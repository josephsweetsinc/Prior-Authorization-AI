"""Tests for ExpirationReminderService."""

from datetime import UTC, date, datetime, timedelta
from unittest.mock import AsyncMock, MagicMock

import pytest

from models.ambulance_request import AmbulanceRequest, RequestStatus
from models.notification import NotificationCategory
from models.user import User, UserRole
from services.expiration_reminder import ExpirationReminderService


@pytest.fixture
def mock_session():
    """Mock database session."""
    return AsyncMock()


@pytest.fixture
def mock_request_dao():
    """Mock AmbulanceRequestDAO."""
    return AsyncMock()


@pytest.fixture
def mock_user_dao():
    """Mock UserDAO."""
    return AsyncMock()


@pytest.fixture
def mock_notification_dao():
    """Mock NotificationDAO."""
    return AsyncMock()


@pytest.fixture
def mock_notification_service():
    """Mock NotificationService."""
    return AsyncMock()


@pytest.fixture
def expiration_reminder_service(
    mock_session,
    mock_request_dao,
    mock_user_dao,
    mock_notification_dao,
    mock_notification_service,
):
    """Create ExpirationReminderService instance with mocks."""
    return ExpirationReminderService(
        db_session=mock_session,
        request_dao=mock_request_dao,
        user_dao=mock_user_dao,
        notification_dao=mock_notification_dao,
        notification_service=mock_notification_service,
    )


class TestExpirationReminderService:
    """Test suite for ExpirationReminderService."""

    @pytest.mark.asyncio
    async def test_check_and_send_reminders_no_expiring_requests(
        self,
        expiration_reminder_service,
        mock_request_dao,
    ):
        """Test when no requests are expiring."""
        mock_request_dao.get_expiring_requests.return_value = []

        result = await expiration_reminder_service.check_and_send_reminders()

        assert result['total_requests'] == 0
        assert result['notifications_sent'] == 0
        assert mock_request_dao.get_expiring_requests.call_count == 3  # 30, 15, 7 days

    @pytest.mark.asyncio
    async def test_check_and_send_reminders_sends_notifications(
        self,
        expiration_reminder_service,
        mock_request_dao,
        mock_user_dao,
        mock_notification_dao,
        mock_notification_service,
    ):
        """Test sending reminders for expiring requests."""
        # Create mock request expiring in 30 days
        request_30 = MagicMock(spec=AmbulanceRequest)
        request_30.id = 1
        request_30.user_id = 10

        # Create mock request expiring in 15 days
        request_15 = MagicMock(spec=AmbulanceRequest)
        request_15.id = 2
        request_15.user_id = 20

        # Create mock admin
        admin = MagicMock(spec=User)
        admin.id = 100

        mock_request_dao.get_expiring_requests.side_effect = [
            [request_30],  # 30 days
            [request_15],  # 15 days
            [],  # 7 days
        ]
        mock_user_dao.get_all_admins.return_value = [admin]
        mock_notification_dao.exists_today_by_request_and_category.return_value = (
            False
        )
        # Mock NotificationService to return a mock notification
        mock_notification = MagicMock()
        mock_notification_service.create_requirement_notification.return_value = (
            mock_notification
        )

        result = await expiration_reminder_service.check_and_send_reminders()

        assert result['total_requests'] == 2
        # 2 requests * (1 provider + 1 admin) = 4 notifications
        assert result['notifications_sent'] == 4

    @pytest.mark.asyncio
    async def test_check_and_send_reminders_skips_duplicates(
        self,
        expiration_reminder_service,
        mock_request_dao,
        mock_notification_dao,
        mock_notification_service,
    ):
        """Test that reminders already sent today are skipped."""
        request = MagicMock(spec=AmbulanceRequest)
        request.id = 1
        request.user_id = 10

        mock_request_dao.get_expiring_requests.return_value = [request]
        # Notification already sent today
        mock_notification_dao.exists_today_by_request_and_category.return_value = (
            True
        )

        result = await expiration_reminder_service.check_and_send_reminders()

        assert result['total_requests'] == 3  # Found in all 3 checks
        assert result['notifications_sent'] == 0
        # Should not create notifications
        mock_notification_service.create_requirement_notification.assert_not_awaited()

    @pytest.mark.asyncio
    async def test_send_reminder_for_request_sends_to_provider_and_admins(
        self,
        expiration_reminder_service,
        mock_user_dao,
        mock_notification_dao,
        mock_notification_service,
    ):
        """Test that reminder is sent to provider and all admins."""
        request_id = 1
        provider_id = 10
        days = 30

        admin1 = MagicMock(spec=User)
        admin1.id = 100
        admin2 = MagicMock(spec=User)
        admin2.id = 101

        mock_notification_dao.exists_today_by_request_and_category.return_value = (
            False
        )
        mock_user_dao.get_all_admins.return_value = [admin1, admin2]
        mock_notification = MagicMock()
        mock_notification_service.create_requirement_notification.return_value = (
            mock_notification
        )

        result = await expiration_reminder_service._send_reminder_for_request(
            request_id=request_id,
            user_id=provider_id,
            days_until_expiration=days,
        )

        # Should send to provider + 2 admins = 3 notifications
        assert result == 3
        assert (
            mock_notification_service.create_requirement_notification.await_count
            == 3
        )

        # Verify notification details
        create_calls = (
            mock_notification_service.create_requirement_notification.await_args_list
        )
        assert create_calls[0].kwargs['user_id'] == provider_id
        assert create_calls[1].kwargs['user_id'] == admin1.id
        assert create_calls[2].kwargs['user_id'] == admin2.id

        # All should have same request_id
        for call in create_calls:
            assert call.kwargs['request_id'] == request_id
            assert 'will expire in 30 day(s)' in call.kwargs[
                'requirement_message'
            ]

    @pytest.mark.asyncio
    async def test_send_reminder_for_request_no_admins(
        self,
        expiration_reminder_service,
        mock_user_dao,
        mock_notification_dao,
        mock_notification_service,
    ):
        """Test sending reminder when there are no admins."""
        request_id = 1
        provider_id = 10
        days = 15

        mock_notification_dao.exists_today_by_request_and_category.return_value = (
            False
        )
        mock_user_dao.get_all_admins.return_value = []
        mock_notification = MagicMock()
        mock_notification_service.create_requirement_notification.return_value = (
            mock_notification
        )

        result = await expiration_reminder_service._send_reminder_for_request(
            request_id=request_id,
            user_id=provider_id,
            days_until_expiration=days,
        )

        # Should send only to provider
        assert result == 1
        assert (
            mock_notification_service.create_requirement_notification.await_count
            == 1
        )

    @pytest.mark.asyncio
    async def test_send_reminder_for_request_already_sent_today(
        self,
        expiration_reminder_service,
        mock_notification_dao,
        mock_notification_service,
    ):
        """Test that reminder is not sent if already sent today."""
        mock_notification_dao.exists_today_by_request_and_category.return_value = (
            True
        )

        result = await expiration_reminder_service._send_reminder_for_request(
            request_id=1,
            user_id=10,
            days_until_expiration=30,
        )

        assert result == 0
        mock_notification_service.create_requirement_notification.assert_not_awaited()
