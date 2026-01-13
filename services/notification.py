import logging

from sqlalchemy.ext.asyncio import AsyncSession

from core import BaseService
from dao import NotificationDAO
from exceptions.notification import (
    NotificationMissingRequestException,
    NotificationSystemCategoryException,
)
from models.notification import Notification, NotificationCategory
from schemas.notification import NotificationResponseSchema
from services.websocket_manager import websocket_manager

logger = logging.getLogger(__name__)


class NotificationService(BaseService):
    """Service for notification operations."""

    def __init__(
        self,
        db_session: AsyncSession,
        *,
        notification_dao: NotificationDAO | None = None,
    ):
        """Initialize NotificationService.

        Args:
            db_session: Database session.
            notification_dao: Optional NotificationDAO instance.

        """
        super().__init__(db_session)
        self._notification_dao = notification_dao or NotificationDAO(db_session)

    async def create_notification(
        self,
        *,
        user_id: int,
        category: NotificationCategory,
        message: str,
        request_id: int | None = None,
        title: str | None = None,
    ) -> Notification:
        """Create a new notification.

        Args:
            user_id: ID of the user who receives the notification.
            category: Category of the notification.
            message: Notification message text.
            request_id: ID of the related ambulance request (optional).
                Must be None for SYSTEM notifications.
            title: Notification title/heading (optional). If not provided,
                will be auto-generated based on category and request_id.

        Returns:
            Notification: Created notification instance.

        """
        # Validate that SYSTEM notifications don't have request_id
        if category == NotificationCategory.SYSTEM and request_id is not None:
            raise NotificationSystemCategoryException

        # Validate that non-SYSTEM notifications have request_id
        if category != NotificationCategory.SYSTEM and request_id is None:
            raise NotificationMissingRequestException(category.value)

        # Auto-generate title if not provided
        if title is None:
            title = self._generate_title(
                category=category, request_id=request_id
            )

        # Always save notification to database first
        notification = await self._notification_dao.create(
            user_id=user_id,
            category=category,
            title=title,
            message=message,
            request_id=request_id,
        )
        await self._session.flush()
        await self._session.commit()

        # Try to send notification via WebSocket (if user is connected)
        # If user is not connected or WebSocket fails,
        # notification is still saved in DB
        # and can be retrieved later via API endpoint
        try:
            await self._send_notification_via_websocket(notification)
        except Exception as e:
            logger.warning(
                'Failed to send notification via WebSocket to user %s: %s. '
                'Notification is saved in db and can be retrieved via API.',
                user_id,
                e,
            )
            # Don't fail the notification creation if WebSocket fails

        return notification

    async def _send_notification_via_websocket(
        self, notification: Notification
    ) -> None:
        """Send notification via WebSocket to the specific user if connected.

        If user is not connected, this method does nothing (no error).
        Notification is already saved in database and can be retrieved via API.

        Args:
            notification: Notification to send.

        """
        notification_data = NotificationResponseSchema.model_validate(
            notification
        )
        message = {
            'type': 'notification',
            'data': notification_data.model_dump(mode='json'),
        }
        # Send to the specific user who should receive this notification
        # If user is not connected, send_personal_message will silently skip
        await websocket_manager.send_personal_message(
            message, notification.user_id
        )

    def _generate_title(
        self,
        category: NotificationCategory,
        request_id: int | None = None,
    ) -> str:
        """Generate notification title based on category and request_id.

        Args:
            category: Notification category.
            request_id: Request ID (if applicable).

        Returns:
            str: Generated title.

        """
        if request_id is not None:
            request_ref = f'Request #{request_id}'
        else:
            request_ref = 'Request'

        match category:
            case NotificationCategory.STATUS_UPDATE:
                return f'{request_ref} Status Update'
            case NotificationCategory.DOCUMENT:
                return f'{request_ref} Document Update'
            case NotificationCategory.REQUIREMENT:
                return f'{request_ref} Requirement Update'
            case NotificationCategory.SYSTEM:
                return 'System Notification'

    async def create_status_update_notification(
        self,
        *,
        user_id: int,
        request_id: int,
        status_message: str,
    ) -> Notification:
        """Create a status update notification.

        Args:
            user_id: ID of the user who receives the notification.
            request_id: ID of the related ambulance request.
            status_message: Status update message
             (e.g., "Request #123 was updated").

        Returns:
            Notification: Created notification instance.

        """
        return await self.create_notification(
            user_id=user_id,
            category=NotificationCategory.STATUS_UPDATE,
            message=status_message,
            request_id=request_id,
        )

    async def create_document_notification(
        self,
        *,
        user_id: int,
        request_id: int,
        document_message: str,
    ) -> Notification:
        """Create a document notification.

        Args:
            user_id: ID of the user who receives the notification.
            request_id: ID of the related ambulance request.
            document_message: Document notification message
                (e.g., "New document added for Request #123").

        Returns:
            Notification: Created notification instance.

        """
        return await self.create_notification(
            user_id=user_id,
            category=NotificationCategory.DOCUMENT,
            message=document_message,
            request_id=request_id,
        )

    async def create_requirement_notification(
        self,
        *,
        user_id: int,
        request_id: int,
        requirement_message: str,
    ) -> Notification:
        """Create a requirement notification.

        Args:
            user_id: ID of the user who receives the notification.
            request_id: ID of the related ambulance request.
            requirement_message: Requirement notification message.

        Returns:
            Notification: Created notification instance.

        """
        return await self.create_notification(
            user_id=user_id,
            category=NotificationCategory.REQUIREMENT,
            message=requirement_message,
            request_id=request_id,
        )

    async def create_system_notification(
        self,
        *,
        user_id: int,
        system_message: str,
    ) -> Notification:
        """Create a system notification.

        Args:
            user_id: ID of the user who receives the notification.
            system_message: System notification message.

        Returns:
            Notification: Created notification instance.

        """
        return await self.create_notification(
            user_id=user_id,
            category=NotificationCategory.SYSTEM,
            message=system_message,
            request_id=None,
        )

    async def get_notification_by_id(
        self,
        notification_id: int,
    ) -> Notification | None:
        """Get notification by id.

        Args:
            notification_id: Notification ID.

        Returns:
            Notification | None: Notification instance or None if not found.

        """
        return await self._notification_dao.get_by_id(notification_id)

    async def get_user_notifications(
        self,
        user_id: int,
        *,
        page: int = 1,
        limit: int = 20,
        category: NotificationCategory | None = None,
        is_read: bool | None = None,
    ) -> tuple[list[Notification], int, int, int, int]:
        """Get all notifications for a user with pagination.

        Args:
            user_id: User ID.
            page: Page number (1-based).
            limit: Number of items per page.
            category: Notification category to filter by (optional).
            is_read: Filter by read status (optional).

        Returns:
            tuple containing:
                - List of notifications.
                - Total count of notifications.
                - Current page number.
                - Total number of pages.
                - Number of items shown.

        """
        offset = (page - 1) * limit
        total = await self._notification_dao.count_by_user_id(
            user_id=user_id,
            category=category,
            is_read=is_read,
        )
        notifications = await self._notification_dao.get_by_user_id(
            user_id=user_id,
            offset=offset,
            limit=limit,
            category=category,
            is_read=is_read,
        )

        total_pages = (total + limit - 1) // limit if total > 0 else 1
        showing = len(notifications)

        return (
            notifications,
            total,
            page,
            total_pages,
            showing,
        )

    async def mark_notification_as_read(
        self,
        notification_id: int,
    ) -> Notification | None:
        """Mark notification as read.

        Args:
            notification_id: Notification ID.

        Returns:
            Notification | None: Updated notification instance or None.

        """
        notification = await self._notification_dao.mark_as_read(
            notification_id
        )
        if notification:
            await self._session.commit()
        return notification

    async def mark_notifications_as_read(
        self,
        notification_ids: list[int],
        user_id: int,
    ) -> list[Notification]:
        """Mark multiple notifications as read.

        Args:
            notification_ids: List of notification IDs to mark as read.
            user_id: ID of the user performing the action.

        Returns:
            list[Notification]: List of updated notification instances.

        """
        notifications_to_mark = []
        for n_id in notification_ids:
            notif = await self._notification_dao.get_by_id(n_id)
            if notif and notif.user_id == user_id:
                notifications_to_mark.append(n_id)

        if not notifications_to_mark:
            return []

        notifications = await self._notification_dao.mark_multiple_as_read(
            notifications_to_mark
        )
        if notifications:
            await self._session.commit()
        return notifications

    async def mark_all_notifications_as_read(
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
        count = await self._notification_dao.mark_all_as_read(
            user_id=user_id,
            category=category,
        )
        await self._session.commit()
        return count

    async def get_unread_count(
        self,
        user_id: int,
    ) -> int:
        """Get count of unread notifications for a user.

        Args:
            user_id: User ID.

        Returns:
            int: Count of unread notifications.

        """
        return await self._notification_dao.count_unread_by_user_id(user_id)

    async def get_notifications_by_request_id(
        self,
        request_id: int,
    ) -> list[Notification]:
        """Get all notifications for a request.

        Args:
            request_id: Request ID.

        Returns:
            list[Notification]: List of notifications.

        """
        return await self._notification_dao.get_by_request_id(request_id)
