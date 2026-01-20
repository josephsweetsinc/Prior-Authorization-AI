"""Tests for NotificationDAO."""

from datetime import UTC, datetime, timedelta

import pytest

from dao import NotificationDAO
from models.notification import NotificationCategory


@pytest.fixture
def notification_dao(db_session):
    """Create NotificationDAO instance."""
    return NotificationDAO(db_session)


class TestNotificationDAO:
    """Test suite for NotificationDAO."""

    @pytest.mark.asyncio
    async def test_exists_today_by_request_and_category_exists_today(
        self,
        notification_dao,
        db_session,
        user_factory,
        ambulance_request_factory,
    ):
        """Test that method returns True when notification exists today."""
        user = await user_factory()
        request = await ambulance_request_factory(user_id=user.id)
        await db_session.commit()

        # Create notification today
        notification = await notification_dao.create(
            user_id=user.id,
            category=NotificationCategory.REQUIREMENT,
            message='Test message',
            request_id=request.id,
        )
        await db_session.commit()

        exists = (
            await notification_dao.exists_today_by_request_and_category(
                request_id=request.id,
                category=NotificationCategory.REQUIREMENT,
            )
        )

        assert exists is True

    @pytest.mark.asyncio
    async def test_exists_today_by_request_and_category_not_exists(
        self,
        notification_dao,
        db_session,
        user_factory,
        ambulance_request_factory,
    ):
        """Test that method returns False when notification doesn't exist."""
        user = await user_factory()
        request = await ambulance_request_factory(user_id=user.id)
        await db_session.commit()

        exists = (
            await notification_dao.exists_today_by_request_and_category(
                request_id=request.id,
                category=NotificationCategory.REQUIREMENT,
            )
        )

        assert exists is False

    @pytest.mark.asyncio
    async def test_exists_today_by_request_and_category_different_category(
        self,
        notification_dao,
        db_session,
        user_factory,
        ambulance_request_factory,
    ):
        """Test that method returns False for different category."""
        user = await user_factory()
        request = await ambulance_request_factory(user_id=user.id)
        await db_session.commit()

        # Create notification with different category
        await notification_dao.create(
            user_id=user.id,
            category=NotificationCategory.STATUS_UPDATE,
            message='Test message',
            request_id=request.id,
        )
        await db_session.commit()

        exists = (
            await notification_dao.exists_today_by_request_and_category(
                request_id=request.id,
                category=NotificationCategory.REQUIREMENT,
            )
        )

        assert exists is False

    @pytest.mark.asyncio
    async def test_exists_today_by_request_and_category_yesterday(
        self,
        notification_dao,
        db_session,
        user_factory,
        ambulance_request_factory,
    ):
        """Test that method returns False for notification created yesterday."""
        user = await user_factory()
        request = await ambulance_request_factory(user_id=user.id)
        await db_session.commit()

        # Create notification yesterday (manually set created_at)
        notification = await notification_dao.create(
            user_id=user.id,
            category=NotificationCategory.REQUIREMENT,
            message='Test message',
            request_id=request.id,
        )
        # Set created_at to yesterday
        yesterday = datetime.now(UTC) - timedelta(days=1)
        notification.created_at = yesterday
        await db_session.commit()

        exists = (
            await notification_dao.exists_today_by_request_and_category(
                request_id=request.id,
                category=NotificationCategory.REQUIREMENT,
            )
        )

        assert exists is False

    @pytest.mark.asyncio
    async def test_exists_today_by_request_and_category_different_request(
        self,
        notification_dao,
        db_session,
        user_factory,
        ambulance_request_factory,
    ):
        """Test that method returns False for different request."""
        user = await user_factory()
        request1 = await ambulance_request_factory(user_id=user.id)
        request2 = await ambulance_request_factory(user_id=user.id)
        await db_session.commit()

        # Create notification for request1
        await notification_dao.create(
            user_id=user.id,
            category=NotificationCategory.REQUIREMENT,
            message='Test message',
            request_id=request1.id,
        )
        await db_session.commit()

        # Check for request2
        exists = (
            await notification_dao.exists_today_by_request_and_category(
                request_id=request2.id,
                category=NotificationCategory.REQUIREMENT,
            )
        )

        assert exists is False
