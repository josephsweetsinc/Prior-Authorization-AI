"""Celery tasks for expiration reminders."""

import logging

from celery import shared_task

from config.database import async_session_maker
from services.expiration_reminder import ExpirationReminderService

logger = logging.getLogger(__name__)


@shared_task(name='tasks.expiration_reminders.check_expiration_reminders')
def check_expiration_reminders() -> dict:
    """Check for expiring requests and send reminder notifications.

    This task runs daily at 8:00 AM to check for requests expiring
    in 30, 15, or 7 days and sends notifications to providers and admins.

    Returns:
        dict: Summary with counts of reminders sent.

    """
    logger.info('Starting expiration reminders check task')

    async def _run_check() -> dict:
        """Run the expiration check in async context."""
        async with async_session_maker() as session:
            service = ExpirationReminderService(db_session=session)
            return await service.check_and_send_reminders()

    # Note: Celery doesn't natively support async tasks,
    # but we can use asyncio.run for this use case
    import asyncio

    try:
        summary = asyncio.run(_run_check())
        logger.info(
            f'Expiration reminders task completed: {summary}'
        )
        return summary
    except Exception as e:
        logger.error(f'Error in expiration reminders task: {e}', exc_info=True)
        raise
