"""Tests for authentication endpoints."""

from typing import Any
from unittest.mock import AsyncMock, patch

import pytest
from fastapi.testclient import TestClient

from exceptions import (
    RefreshTokenException,
    UserIsNotActiveException,
    WrongCredentialsException,
)
from main import app
from models.user import UserRole
from schemas import TokenSchemas, UserResponseShema


@pytest.fixture
def client() -> TestClient:
    """Create test client."""
    return TestClient(app)


class TestAuthEndpoints:
    """Test suite for authentication endpoints."""

    @pytest.mark.asyncio
    async def test_signup_user_success(
        self,
        client: TestClient,
    ):
        """Test successful user signup."""
        user_data = {
            "email": "newuser@example.com",
            "password": "StrongPassword123!",
            "name": "New",
            "surname": "User",
            "phone_number": "12345678900",
            "position": "Doctor",
            "place_of_work": "Hospital"
        }

        with patch(
            "services.user.UserService.create_new_user",
            new_callable=AsyncMock,
        ) as mock_create:
            mock_create.return_value = UserResponseShema(
                id=1,
                email=user_data["email"],
                name=user_data["name"],
                surname=user_data["surname"],
                role=UserRole.PROVIDER,
                is_active=True,
                created_at="2025-01-01T12:00:00",
            )

            response = client.post("/Prod/api/v1/auth/signup", json=user_data)

            assert response.status_code == 200
            data = response.json()
            assert data["email"] == user_data["email"]
            assert data["id"] == 1
            mock_create.assert_awaited_once()

    @pytest.mark.asyncio
    async def test_login_user_success(
        self,
        client: TestClient,
    ):
        """Test successful user login."""
        form_data = {
            "username": "user@example.com",
            "password": "Password123!"
        }

        with patch(
            "services.auth.AuthService.auth_user",
            new_callable=AsyncMock,
        ) as mock_auth, patch(
            "services.auth.AuthService.create_token",
            new_callable=AsyncMock,
        ) as mock_token:

            mock_user = AsyncMock()
            mock_user.id = 1
            mock_user.role = UserRole.PROVIDER
            mock_auth.return_value = mock_user

            mock_token.return_value = TokenSchemas(
                access_token="access_token",
                refresh_token="refresh_token",
                user_role=UserRole.PROVIDER,
            )

            response = client.post(
                "/Prod/api/v1/auth/login",
                data=form_data,
                headers={"Content-Type": "application/x-www-form-urlencoded"}
            )

            assert response.status_code == 200
            data = response.json()
            assert data["access_token"] == "access_token"
            assert data["refresh_token"] == "refresh_token"

            mock_auth.assert_awaited_once_with(
                email=form_data["username"],
                password=form_data["password"]
            )
            mock_token.assert_awaited_once_with(
                author_id=1,
                user_role=UserRole.PROVIDER
            )

    @pytest.mark.asyncio
    async def test_login_user_wrong_credentials(
        self,
        client: TestClient,
    ):
        """Test login with wrong credentials."""
        with patch(
            "services.auth.AuthService.auth_user",
            side_effect=WrongCredentialsException,
        ):
            response = client.post(
                "/Prod/api/v1/auth/login",
                data={"username": "wrong@example.com", "password": "wrong"},
            )

            assert response.status_code == 401

    @pytest.mark.asyncio
    async def test_refresh_token_success(
        self,
        client: TestClient,
    ):
        """Test successful token refresh."""
        with patch(
            "services.auth.AuthService.refresh_token",
            new_callable=AsyncMock,
        ) as mock_refresh:
            mock_refresh.return_value = TokenSchemas(
                access_token="new_access_token",
                refresh_token="new_refresh_token",
                user_role=UserRole.PROVIDER,
            )

            response = client.post(
                "/Prod/api/v1/auth/refresh",
                params={"refresh_token": "valid_refresh_token"},
            )

            assert response.status_code == 200
            data = response.json()
            assert data["access_token"] == "new_access_token"

            mock_refresh.assert_awaited_once_with(
                refresh_token="valid_refresh_token"
            )

    @pytest.mark.asyncio
    async def test_refresh_token_invalid(
        self,
        client: TestClient,
    ):
        """Test token refresh with invalid token."""
        with patch(
            "services.auth.AuthService.refresh_token",
            side_effect=RefreshTokenException,
        ):
            response = client.post(
                "/Prod/api/v1/auth/refresh",
                params={"refresh_token": "invalid_token"},
            )

            assert response.status_code == 403

    @pytest.mark.asyncio
    async def test_logout_user_success(
        self,
        client: TestClient,
    ):
        """Test successful user logout."""
        with patch(
            "services.auth.AuthService.logout_user",
            new_callable=AsyncMock,
        ) as mock_logout:
            mock_logout.return_value = None

            response = client.delete(
                "/Prod/api/v1/auth/logout",
                params={"refresh_token": "valid_refresh_token"},
            )

            assert response.status_code == 204
            mock_logout.assert_awaited_once_with("valid_refresh_token")
