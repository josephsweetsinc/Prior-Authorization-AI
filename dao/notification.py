from typing import Any

from sqlalchemy import Select, func, select, update

from core.dao import BaseDAO
from models.notification import Notification, NotificationCategory


class NotificationDAO(BaseDAO):
    """DAO for Notification model."""

    async def create(
        self,
        *,
        user_id: int,
        category: NotificationCategory,
        message: str,
        request_id: int | None = None,
    ) -> Notification:
        """Create a new notification.

        Args:
            user_id: ID of the user who receives the notification.
            category: Category of the notification.
            message: Notification message text.
            request_id: ID of the related ambulance request (optional).

        Returns:
            Notification: Created notification instance.

        """
        notification = Notification(
            user_id=user_id,
            category=category,
            message=message,
            request_id=request_id,
        )
        self._session.add(notification)
        await self._session.flush()
        await self._session.refresh(notification)
        return notification

    async def get_by_id(self, notification_id: int) -> Notification | None:
        """Get notification by id.

        Args:
            notification_id: Notification ID.

        Returns:
            Notification | None: Notification instance or None if not found.

        """
        stmt = select(Notification).where(Notification.id == notification_id)
        result = await self._session.execute(stmt)
        return result.scalar_one_or_none()

    async def get_by_user_id(
        self,
        user_id: int,
        *,
        offset: int = 0,
        limit: int = 20,
        category: NotificationCategory | None = None,
        is_read: bool | None = None,
    ) -> list[Notification]:
        """Get all notifications for a user with pagination and filters.

        Args:
            user_id: User ID.
            offset: Number of items to skip.
            limit: Maximum number of items to return.
            category: Notification category to filter by (optional).
            is_read: Filter by read status (optional).

        Returns:
            list[Notification]: List of notifications.

        """
        stmt = select(Notification).where(Notification.user_id == user_id)

        if category is not None:
            stmt = stmt.where(Notification.category == category)

        if is_read is not None:
            stmt = stmt.where(Notification.is_read == is_read)

        stmt = (
            stmt.order_by(Notification.created_at.desc(), Notification.id.desc())
            .offset(offset)
            .limit(limit)
        )
        result = await self._session.execute(stmt)
        return list(result.scalars().all())

    async def count_by_user_id(
        self,
        user_id: int,
        *,
        category: NotificationCategory | None = None,
        is_read: bool | None = None,
    ) -> int:
        """Count notifications for a user with filters.

        Args:
            user_id: User ID.
            category: Notification category to filter by (optional).
            is_read: Filter by read status (optional).

        Returns:
            int: Total count of notifications.

        """
        stmt = select(Notification).where(Notification.user_id == user_id)

        if category is not None:
            stmt = stmt.where(Notification.category == category)

        if is_read is not None:
            stmt = stmt.where(Notification.is_read == is_read)

        stmt = select(func.count()).select_from(stmt.subquery())
        result = await self._session.execute(stmt)
        return result.scalar_one() or 0

    async def mark_as_read(
        self,
        notification_id: int,
    ) -> Notification | None:
        """Mark notification as read.

        Args:
            notification_id: Notification ID.

        Returns:
            Notification | None: Updated notification instance or None if not found.

        """
        stmt = (
            update(Notification)
            .where(Notification.id == notification_id)
            .values(is_read=True)
            .returning(Notification)
        )
        result = await self._session.execute(stmt)
        await self._session.flush()
        return result.scalar_one_or_none()

    async def mark_multiple_as_read(
        self,
        notification_ids: list[int],
    ) -> list[Notification]:
        """Mark multiple notifications as read.

        Args:
            notification_ids: List of notification IDs to mark as read.

        Returns:
            list[Notification]: List of updated notification instances.

        """
        if not notification_ids:
            return []
        stmt = (
            update(Notification)
            .where(
                Notification.id.in_(notification_ids),
                Notification.is_read == False,  # noqa: E712
            )
            .values(is_read=True)
            .returning(Notification)
        )
        result = await self._session.execute(stmt)
        await self._session.flush()
        return list(result.scalars().all())

    async def mark_all_as_read(
        self,
        user_id: int,
        *,
        category: NotificationCategory | None = None,
    ) -> int:
        """Mark all notifications as read for a user.

        Args:
            user_id: User ID.
            category: Notification category to filter by (optional).

        Returns:
            int: Number of notifications marked as read.

        """
        stmt = (
            update(Notification)
            .where(Notification.user_id == user_id, Notification.is_read == False)  # noqa: E712
        )

        if category is not None:
            stmt = stmt.where(Notification.category == category)

        result = await self._session.execute(stmt)
        await self._session.flush()
        return result.rowcount or 0

    async def get_by_request_id(
        self,
        request_id: int,
    ) -> list[Notification]:
        """Get all notifications for a request.

        Args:
            request_id: Request ID.

        Returns:
            list[Notification]: List of notifications.

        """
        stmt = (
            select(Notification)
            .where(Notification.request_id == request_id)
            .order_by(Notification.created_at.desc())
        )
        result = await self._session.execute(stmt)
        return list(result.scalars().all())

    def _build_filter_stmt(
        self,
        *,
        user_id: int | None = None,
        category: NotificationCategory | None = None,
        is_read: bool | None = None,
        request_id: int | None = None,
    ) -> Select[Any]:
        """Build base filter statement for notifications.

        Args:
            user_id: User ID to filter by (optional).
            category: Notification category to filter by (optional).
            is_read: Filter by read status (optional).
            request_id: Request ID to filter by (optional).

        Returns:
            Select: SQLAlchemy select statement with filters applied.

        """
        stmt = select(Notification)

        if user_id is not None:
            stmt = stmt.where(Notification.user_id == user_id)

        if category is not None:
            stmt = stmt.where(Notification.category == category)

        if is_read is not None:
            stmt = stmt.where(Notification.is_read == is_read)

        if request_id is not None:
            stmt = stmt.where(Notification.request_id == request_id)

        return stmt

    async def count_unread_by_user_id(
        self,
        user_id: int,
    ) -> int:
        """Count unread notifications for a user.

        Args:
            user_id: User ID.

        Returns:
            int: Total count of unread notifications.

        """
        stmt = (
            select(func.count())
            .select_from(Notification)
            .where(
                Notification.user_id == user_id,
                Notification.is_read == False,  # noqa: E712
            )
        )
        result = await self._session.execute(stmt)
        return result.scalar_one() or 0
