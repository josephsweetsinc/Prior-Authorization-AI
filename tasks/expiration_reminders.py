"""Celery tasks for expiration reminders."""

import logging

from celery import shared_task
from sqlalchemy.ext.asyncio import async_sessionmaker, create_async_engine

from config.settings import Settings
from services.expiration_reminder import ExpirationReminderService

logger = logging.getLogger(__name__)

settings = Settings.load()


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

    import asyncio
    import concurrent.futures

    # Run in separate thread to avoid event loop conflicts with Celery
    with concurrent.futures.ThreadPoolExecutor() as executor:
        future = executor.submit(asyncio.run, _run_check())
        try:
            summary = future.result()
            logger.info(
                f'Expiration reminders task completed: {summary}'
            )
            return summary
        except Exception as e:
            logger.error(f'Error in expiration reminders task: {e}', exc_info=True)
            raise
