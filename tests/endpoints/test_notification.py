"""Tests for notification endpoints."""

from typing import Any
from unittest.mock import AsyncMock, MagicMock, patch

import pytest
from fastapi.testclient import TestClient

from dependencies.auth import get_current_user
from main import app
from models.notification import NotificationCategory
from models.user import UserRole
from schemas.notification import (
    NotificationResponseSchema,
    NotificationsListResponseSchema,
)


@pytest.fixture
def client() -> TestClient:
    """Create test client."""
    return TestClient(app)


@pytest.fixture(autouse=True)
def reset_dependencies():
    """Reset dependency overrides after each test."""
    yield
    app.dependency_overrides.clear()


@pytest.fixture
def mock_user() -> MagicMock:
    """Create mock provider user."""
    user = MagicMock()
    user.id = 1
    user.email = "provider@example.com"
    user.role = UserRole.PROVIDER
    user.is_active = True
    return user


class TestNotificationEndpoints:
    """Test suite for notification endpoints."""

    @pytest.mark.asyncio
    async def test_get_notifications_success(
        self,
        client: TestClient,
        mock_user: MagicMock,
    ):
        """Test getting notifications successfully."""
        async def get_user_override():
            return mock_user

        app.dependency_overrides[get_current_user] = get_user_override

        with patch(
            "services.notification.NotificationService.get_user_notifications",
            new_callable=AsyncMock,
        ) as mock_get:

            # Mock notification object
            notification = MagicMock()
            notification.id = 101
            notification.user_id = 1
            notification.category = NotificationCategory.STATUS_UPDATE
            notification.title = "Test Notification"
            notification.message = "This is a test"
            notification.is_read = False
            notification.created_at = "2025-01-01T12:00:00"

            mock_get.return_value = (
                [notification],  # items
                1,  # total
                1,  # current_page
                1,  # total_pages
                1,  # showing
            )

            response = client.get("/Prod/api/v1/notification/")

            assert response.status_code == 200
            data = response.json()
            assert len(data["items"]) == 1
            assert data["items"][0]["id"] == 101
            assert data["total"] == 1

    @pytest.mark.asyncio
    async def test_get_notifications_with_filters(
        self,
        client: TestClient,
        mock_user: MagicMock,
    ):
        """Test getting notifications with category and read filters."""
        async def get_user_override():
            return mock_user

        app.dependency_overrides[get_current_user] = get_user_override

        with patch(
            "services.notification.NotificationService.get_user_notifications",
            new_callable=AsyncMock,
        ) as mock_get:

            mock_get.return_value = ([], 0, 1, 1, 0)

            response = client.get(
                "/Prod/api/v1/notification/",
                params={
                    "category": "status_updates",
                    "is_read": "false",
                    "page": "2",
                }
            )

            assert response.status_code == 200

            mock_get.assert_awaited_once()
            args, kwargs = mock_get.call_args
            assert kwargs["user_id"] == mock_user.id
            assert kwargs["page"] == 2
            assert kwargs["category"] == NotificationCategory.STATUS_UPDATE
            assert kwargs["is_read"] is False

    @pytest.mark.asyncio
    async def test_get_notifications_unauthorized(
        self,
        client: TestClient,
    ):
        """Test getting notifications without authentication."""
        # Clear overrides to ensure no user is injected
        app.dependency_overrides = {}

        response = client.get("/Prod/api/v1/notification/")
        assert response.status_code in (401, 403)

    @pytest.mark.asyncio
    async def test_mark_notification_as_read_success(
        self,
        client: TestClient,
        mock_user: MagicMock,
    ):
        """Test marking notification as read successfully."""
        async def get_user_override():
            return mock_user

        app.dependency_overrides[get_current_user] = get_user_override

        with patch(
            "services.notification.NotificationService.mark_notification_as_read",
            new_callable=AsyncMock,
        ) as mock_mark:

            # Mock notification object
            notification = MagicMock()
            notification.id = 101
            notification.user_id = 1
            notification.category = NotificationCategory.STATUS_UPDATE
            notification.title = "Test Notification"
            notification.message = "This is a test"
            notification.is_read = True
            notification.created_at = "2025-01-01T12:00:00"

            mock_mark.return_value = notification

            response = client.patch("/Prod/api/v1/notification/101")

            assert response.status_code == 200
            data = response.json()
            assert data["id"] == 101
            assert data["is_read"] is True

            mock_mark.assert_awaited_once_with(
                notification_id=101,
                user_id=1,
            )

    @pytest.mark.asyncio
    async def test_mark_notification_as_read_not_found(
        self,
        client: TestClient,
        mock_user: MagicMock,
    ):
        """Test marking notification as read when notification not found."""
        from exceptions.notification import NotificationNotFoundException

        async def get_user_override():
            return mock_user

        app.dependency_overrides[get_current_user] = get_user_override

        with patch(
            "services.notification.NotificationService.mark_notification_as_read",
            new_callable=AsyncMock,
        ) as mock_mark:

            mock_mark.side_effect = NotificationNotFoundException()

            response = client.patch("/Prod/api/v1/notification/999")

            assert response.status_code == 404
            assert "not found" in response.json()["detail"].lower()

    @pytest.mark.asyncio
    async def test_mark_notification_as_read_unauthorized(
        self,
        client: TestClient,
    ):
        """Test marking notification as read without authentication."""
        # Clear overrides to ensure no user is injected
        app.dependency_overrides = {}

        response = client.patch("/Prod/api/v1/notification/101")
        assert response.status_code in (401, 403)
