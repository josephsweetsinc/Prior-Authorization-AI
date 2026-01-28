"""Tests for NotificationService."""

from datetime import datetime
from unittest.mock import AsyncMock, MagicMock

import pytest

from exceptions.notification import NotificationNotFoundException
from models import Notification
from models.notification import NotificationCategory
from services.notification import NotificationService


@pytest.fixture
def mock_session():
    """Mock database session."""
    return AsyncMock()


@pytest.fixture
def mock_notification_dao():
    """Mock NotificationDAO."""
    return AsyncMock()


@pytest.fixture
def notification_service(
    mock_session,
    mock_notification_dao,
):
    """Create NotificationService instance with mocks."""
    return NotificationService(
        db_session=mock_session,
        notification_dao=mock_notification_dao,
    )


class TestNotificationService:
    """Test suite for NotificationService."""

    @pytest.mark.asyncio
    async def test_get_user_notifications_pagination(
        self,
        notification_service,
        mock_notification_dao,
    ):
        """Test getting notifications with pagination."""
        user_id = 1
        total_items = 50
        limit = 10
        page = 2
        mock_items = [MagicMock(spec=Notification) for _ in range(limit)]

        mock_notification_dao.count_by_user_id.return_value = total_items
        mock_notification_dao.get_by_user_id.return_value = mock_items

        notifications, total, current_page, total_pages, showing = \
            await notification_service.get_user_notifications(
                user_id=user_id, page=page, limit=limit
            )

        assert len(notifications) == limit
        assert total == total_items
        assert current_page == page
        assert total_pages == 5
        assert showing == limit

        # Verify DAO call offset
        mock_notification_dao.get_by_user_id.assert_awaited_once()
        args, kwargs = mock_notification_dao.get_by_user_id.call_args
        assert kwargs["offset"] == 10  # (2-1)*10

    @pytest.mark.asyncio
    async def test_mark_notifications_as_read(
        self,
        notification_service,
        mock_notification_dao,
        mock_session,
    ):
        """Test batch marking notifications as read."""
        ids = [1, 2, 3]
        user_id = 99

        # Mock get_by_id to return notifications belonging to user
        async def mock_get_by_id(nid):
            n = MagicMock(spec=Notification)
            n.id = nid
            n.user_id = user_id
            return n

        mock_notification_dao.get_by_id.side_effect = mock_get_by_id
        mock_notification_dao.mark_multiple_as_read.return_value = [MagicMock(), MagicMock(), MagicMock()]

        result = await notification_service.mark_notifications_as_read(ids, user_id=user_id)

        assert len(result) == 3
        mock_notification_dao.mark_multiple_as_read.assert_awaited_once_with(ids)
        mock_session.commit.assert_awaited_once()

    @pytest.mark.asyncio
    async def test_mark_notifications_as_read_ownership_check(
        self,
        notification_service,
        mock_notification_dao,
        mock_session,
    ):
        """Test that only user's notifications are marked as read."""
        user_id = 1
        other_user_id = 2

        ids = [101, 102] # 101 belongs to user, 102 to other

        async def mock_get_by_id(nid):
            n = MagicMock(spec=Notification)
            n.id = nid
            if nid == 101:
                n.user_id = user_id
            else:
                n.user_id = other_user_id
            return n

        mock_notification_dao.get_by_id.side_effect = mock_get_by_id
        mock_notification_dao.mark_multiple_as_read.return_value = [MagicMock()] # Only 1 marked

        await notification_service.mark_notifications_as_read(ids, user_id=user_id)

        # DAO should be called ONLY with [101]
        mock_notification_dao.mark_multiple_as_read.assert_awaited_once_with([101])
        mock_session.commit.assert_awaited_once()

    @pytest.mark.asyncio
    async def test_create_notification_success(
        self,
        notification_service,
        mock_notification_dao,
        mock_session,
    ):
        """Test creating a notification."""
        user_id = 1
        category = NotificationCategory.STATUS_UPDATE
        message = "Status changed"
        request_id = 100

        notification = MagicMock(spec=Notification)
        mock_notification_dao.create.return_value = notification

        result = await notification_service.create_notification(
            user_id=user_id,
            category=category,
            message=message,
            request_id=request_id
        )

        assert result == notification
        mock_notification_dao.create.assert_awaited_once()
        mock_session.commit.assert_awaited_once()

    @pytest.mark.asyncio
    async def test_mark_notification_as_read_success(
        self,
        notification_service,
        mock_notification_dao,
        mock_session,
    ):
        """Test marking a single notification as read."""
        notification_id = 101
        user_id = 1

        notification = MagicMock(spec=Notification)
        notification.id = notification_id
        notification.user_id = user_id

        mock_notification_dao.get_by_id.return_value = notification
        mock_notification_dao.mark_as_read.return_value = notification

        result = await notification_service.mark_notification_as_read(
            notification_id=notification_id,
            user_id=user_id,
        )

        assert result == notification
        mock_notification_dao.get_by_id.assert_awaited_once_with(notification_id)
        mock_notification_dao.mark_as_read.assert_awaited_once_with(notification_id)
        mock_session.commit.assert_awaited_once()

    @pytest.mark.asyncio
    async def test_mark_notification_as_read_not_found(
        self,
        notification_service,
        mock_notification_dao,
    ):
        """Test marking notification as read when notification not found."""
        notification_id = 999
        user_id = 1

        mock_notification_dao.get_by_id.return_value = None

        with pytest.raises(NotificationNotFoundException):
            await notification_service.mark_notification_as_read(
                notification_id=notification_id,
                user_id=user_id,
            )

    @pytest.mark.asyncio
    async def test_mark_notification_as_read_wrong_owner(
        self,
        notification_service,
        mock_notification_dao,
    ):
        """Test marking notification as read when notification belongs to another user."""
        notification_id = 101
        user_id = 1
        other_user_id = 2

        notification = MagicMock(spec=Notification)
        notification.id = notification_id
        notification.user_id = other_user_id

        mock_notification_dao.get_by_id.return_value = notification

        with pytest.raises(NotificationNotFoundException):
            await notification_service.mark_notification_as_read(
                notification_id=notification_id,
                user_id=user_id,
            )
