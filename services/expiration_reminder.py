"""Service for handling expiration reminders."""

import logging

from sqlalchemy.ext.asyncio import AsyncSession

from config.settings import Settings
from core import BaseService
from dao import AmbulanceRequestDAO, NotificationDAO, UserDAO
from models.notification import NotificationCategory
from services.notification import NotificationService

logger = logging.getLogger(__name__)

settings = Settings.load()


class ExpirationReminderService(BaseService):
    """Service for expiration reminder operations."""

    def __init__(
        self,
        db_session: AsyncSession,
        *,
        request_dao: AmbulanceRequestDAO | None = None,
        user_dao: UserDAO | None = None,
        notification_dao: NotificationDAO | None = None,
        notification_service: NotificationService | None = None,
    ):
        """Initialize ExpirationReminderService.

        Args:
            db_session: Database session.
            request_dao: Optional AmbulanceRequestDAO instance.
            user_dao: Optional UserDAO instance.
            notification_dao: Optional NotificationDAO instance.
            notification_service: Optional NotificationService instance.

        """
        super().__init__(db_session)
        self._request_dao = request_dao or AmbulanceRequestDAO(db_session)
        self._user_dao = user_dao or UserDAO(db_session)
        self._notification_dao = notification_dao or NotificationDAO(db_session)
        self._notification_service = (
            notification_service or NotificationService(db_session)
        )

    async def check_and_send_reminders(self) -> dict[str, int]:
        """Check for expiring requests and send reminders.

        Checks all configured reminder days (30, 15, 7) and sends
        notifications for requests expiring on those days.

        Returns:
            dict: Summary with counts of reminders sent.

        """
        summary = {'total_requests': 0, 'notifications_sent': 0}

        for days in settings.REMINDER_DAYS:
            expiring_requests = await self._request_dao.get_expiring_requests(
                days=days
            )
            summary['total_requests'] += len(expiring_requests)

            for request in expiring_requests:
                sent = await self._send_reminder_for_request(
                    request_id=request.id,
                    user_id=request.user_id,
                    days_until_expiration=days,
                )
                if sent:
                    summary['notifications_sent'] += sent

        logger.info(
            'Expiration reminders check completed: '
            '%s requests found, %s notifications sent',
            summary['total_requests'],
            summary['notifications_sent'],
        )

        return summary

    async def _send_reminder_for_request(
        self,
        *,
        request_id: int,
        user_id: int,
        days_until_expiration: int,
    ) -> int:
        """Send reminder notifications for a specific request.

        Sends notifications to:
        - The provider who created the request
        - All admin users

        Checks if notification was already sent today to avoid duplicates.

        Args:
            request_id: Request ID.
            user_id: Provider user ID (who created the request).
            days_until_expiration: Days until expiration.

        Returns:
            int: Number of notifications sent (0 if already sent today).

        """
        # Check if reminder already sent today
        already_sent = (
            await self._notification_dao.exists_today_by_request_and_category(
                request_id=request_id,
                category=NotificationCategory.REQUIREMENT,
            )
        )

        if already_sent:
            logger.debug(
                'Reminder already sent today for request %s', request_id
            )
            return 0

        # Prepare message
        message = (
            f'Prior authorization for request #{request_id} '
            f'will expire in {days_until_expiration} day(s). '
            f'Please renew it before the expiration date.'
        )

        notifications_sent = 0

        # Send to provider
        try:
            await self._notification_service.create_requirement_notification(
                user_id=user_id,
                request_id=request_id,
                requirement_message=message,
            )
            notifications_sent += 1
        except Exception:
            logger.exception(
                'Failed to send reminder to provider %s for request %s',
                user_id,
                request_id,
            )

        # Send to all admins
        admins = await self._user_dao.get_all_admins(limit=100)
        for admin in admins:
            try:
                await (
                    self._notification_service.create_requirement_notification(
                        user_id=admin.id,
                        request_id=request_id,
                        requirement_message=message,
                    )
                )
                notifications_sent += 1
            except Exception:
                logger.exception(
                    'Failed to send reminder to admin %s for request %s',
                    admin.id,
                    request_id,
                )

        if notifications_sent > 0:
            logger.info(
                'Sent %s reminder notifications for request %s',
                notifications_sent,
                request_id,
            )

        return notifications_sent
