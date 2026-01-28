"""Celery tasks for expiration reminders."""

import asyncio
import concurrent.futures
import logging

from celery import shared_task  # type: ignore[import-untyped]
from sqlalchemy.ext.asyncio import async_sessionmaker, create_async_engine

from config.settings import Settings
from services.expiration_reminder import ExpirationReminderService

logger = logging.getLogger(__name__)

settings = Settings.load()


@shared_task(name='tasks.expiration_reminders.check_expiration_reminders')  # type: ignore[misc]
def check_expiration_reminders() -> dict[str, int]:
    """Check for expiring requests and send reminder notifications.

    This task runs daily at 8:00 AM to check for requests expiring
    in 30, 15, or 7 days and sends notifications to providers and admins.

    Returns:
        dict: Summary with counts of reminders sent.

    """
    logger.info('Starting expiration reminders check task')

    async def _run_check() -> dict[str, int]:
        """Run the expiration check in async context."""
        # Create a new engine for each task to avoid event loop conflicts
        engine = create_async_engine(
            settings.database_settings.url(),
            echo=False,
            pool_pre_ping=True,
        )
        try:
            session_maker = async_sessionmaker(
                bind=engine,
                expire_on_commit=False,
            )
            async with session_maker() as session:
                service = ExpirationReminderService(db_session=session)
                return await service.check_and_send_reminders()
        finally:
            # Clean up engine to avoid connection pool issues
            await engine.dispose()

    # Run in separate thread to avoid event loop conflicts with Celery
    with concurrent.futures.ThreadPoolExecutor() as executor:
        future = executor.submit(asyncio.run, _run_check())
        try:
            summary = future.result()
        except Exception:
            logger.exception('Error in expiration reminders task')
            raise
        else:
            logger.info('Expiration reminders task completed: %s', summary)
            return summary
