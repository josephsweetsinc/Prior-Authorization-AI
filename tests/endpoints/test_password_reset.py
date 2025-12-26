"""Tests for password reset endpoints.

Note: Full integration tests with database are covered in test_services_password_reset.py.
These tests focus on endpoint validation and schema validation.
"""

from unittest.mock import AsyncMock, MagicMock, patch

import pytest
from fastapi.testclient import TestClient

from dependencies.auth import get_current_user
from exceptions import WrongCredentialsException
from main import app
from models.user import UserRole


@pytest.fixture
def client():
    """Create test client."""
    return TestClient(app)


@pytest.fixture(autouse=True)
def reset_dependencies():
    """Reset dependency overrides after each test."""
    yield
    app.dependency_overrides.clear()


class TestPasswordResetEndpoints:
    """Test suite for password reset endpoints."""

    @pytest.mark.asyncio
    async def test_request_password_reset_invalid_email(
            self,
            client: TestClient,
    ):
        """Test password reset request with invalid email format."""
        response = client.post(
            '/Prod/api/v1/auth/password-reset/request',
            json={'email': 'invalid-email'},
        )

        assert response.status_code == 422

    @pytest.mark.asyncio
    async def test_request_password_reset_missing_email(
            self,
            client: TestClient,
    ):
        """Test password reset request with missing email."""
        response = client.post(
            '/Prod/api/v1/auth/password-reset/request',
            json={},
        )

        assert response.status_code == 422

    @pytest.mark.asyncio
    async def test_confirm_password_reset_invalid_email_format(
            self,
            client: TestClient,
    ):
        """Test password reset confirmation with invalid email format."""
        response = client.post(
            '/Prod/api/v1/auth/password-reset/confirm',
            json={
                'email': 'invalid-email',
                'new_password': 'NewPassword123!',
            },
        )

        assert response.status_code == 422

    @pytest.mark.asyncio
    async def test_confirm_password_reset_invalid_password(
            self,
            client: TestClient,
    ):
        """Test password reset confirmation with invalid password."""
        response = client.post(
            '/Prod/api/v1/auth/password-reset/confirm',
            json={
                'code': '12345',
                'new_password': 'weak',  # Too weak
            },
        )

        assert response.status_code == 422

    @pytest.mark.asyncio
    async def test_confirm_password_reset_missing_fields(
            self,
            client: TestClient,
    ):
        """Test password reset confirmation with missing fields."""
        response = client.post(
            '/Prod/api/v1/auth/password-reset/confirm',
            json={
                'email': 'user@example.com',
            },
        )

        assert response.status_code == 422

    @pytest.mark.asyncio
    async def test_request_password_reset_success(
            self,
            client: TestClient,
    ):
        """Test successful password reset request."""
        with patch(
            'services.password.PasswordService.request_password_reset',
            new_callable=AsyncMock,
        ) as mock_request:
            mock_request.return_value = None

            response = client.post(
                '/Prod/api/v1/auth/password-reset/request',
                json={'email': 'user@example.com'},
            )

            assert response.status_code == 204
            mock_request.assert_awaited_once_with(email='user@example.com')

    @pytest.mark.asyncio
    async def test_verify_password_reset_code_invalid_code_format(
            self,
            client: TestClient,
    ):
        """Test password reset code verification with invalid code format."""
        response = client.post(
            '/Prod/api/v1/auth/password-reset/verify',
            json={
                'code': '123',  # Too short
            },
        )

        assert response.status_code == 422

    @pytest.mark.asyncio
    async def test_verify_password_reset_code_invalid_code_format_letters(
            self,
            client: TestClient,
    ):
        """Test password reset code verification with non-numeric code."""
        response = client.post(
            '/Prod/api/v1/auth/password-reset/verify',
            json={
                'code': 'abcde',  # Not numeric
            },
        )

        assert response.status_code == 422

    @pytest.mark.asyncio
    async def test_verify_password_reset_code_missing_code(
            self,
            client: TestClient,
    ):
        """Test password reset code verification with missing code."""
        response = client.post(
            '/Prod/api/v1/auth/password-reset/verify',
            json={},
        )

        assert response.status_code == 422

    @pytest.mark.asyncio
    async def test_verify_password_reset_code_success(
            self,
            client: TestClient,
    ):
        """Test successful password reset code verification."""
        with patch(
            'services.password.PasswordService.verify_code',
            new_callable=AsyncMock,
        ) as mock_verify:
            mock_verify.return_value = None

            response = client.post(
                '/Prod/api/v1/auth/password-reset/verify',
                json={'code': '12345'},
            )

            assert response.status_code == 204
            mock_verify.assert_awaited_once_with(code='12345')

    @pytest.mark.asyncio
    async def test_confirm_password_reset_success(
            self,
            client: TestClient,
    ):
        """Test successful password reset confirmation."""
        with patch(
            'services.password.PasswordService.reset_password',
            new_callable=AsyncMock,
        ) as mock_reset:
            mock_reset.return_value = None

            response = client.post(
                '/Prod/api/v1/auth/password-reset/confirm',
                json={
                    'email': 'user@example.com',
                    'new_password': 'NewPassword123!',
                },
            )

            assert response.status_code == 204
            mock_reset.assert_awaited_once_with(
                email='user@example.com',
                new_password='NewPassword123!',
            )


@pytest.fixture
def mock_user() -> MagicMock:
    """Create mock user for password change tests."""
    user = MagicMock()
    user.id = 1
    user.email = 'user@example.com'
    user.role = UserRole.PROVIDER
    user.is_active = True
    user.password = 'hashed_password'
    return user


@pytest.fixture
def auth_headers() -> dict[str, str]:
    """Create auth headers with mock token."""
    return {'Authorization': 'Bearer mock_token'}


class TestPasswordChangeEndpoints:
    """Test suite for password change endpoints."""

    @pytest.mark.asyncio
    async def test_change_password_unauthorized(
            self,
            client: TestClient,
    ):
        """Test password change without authentication."""
        response = client.post(
            '/Prod/api/v1/auth/password-change',
            json={
                'old_password': 'OldPassword123!',
                'new_password': 'NewPassword123!',
            },
        )

        assert response.status_code in (401, 403)

    @pytest.mark.asyncio
    async def test_change_password_invalid_old_password_format(
            self,
            client: TestClient,
            mock_user: MagicMock,
            auth_headers: dict[str, str],
    ):
        """Test password change with invalid old password format."""
        async def get_user_override():
            return mock_user

        app.dependency_overrides[get_current_user] = get_user_override

        response = client.post(
            '/Prod/api/v1/auth/password-change',
            json={
                'old_password': 'weak',  # Too weak
                'new_password': 'NewPassword123!',
            },
            headers=auth_headers,
        )

        assert response.status_code == 422

    @pytest.mark.asyncio
    async def test_change_password_invalid_new_password_format(
            self,
            client: TestClient,
            mock_user: MagicMock,
            auth_headers: dict[str, str],
    ):
        """Test password change with invalid new password format."""
        async def get_user_override():
            return mock_user

        app.dependency_overrides[get_current_user] = get_user_override

        response = client.post(
            '/Prod/api/v1/auth/password-change',
            json={
                'old_password': 'OldPassword123!',
                'new_password': 'weak',  # Too weak
            },
            headers=auth_headers,
        )

        assert response.status_code == 422

    @pytest.mark.asyncio
    async def test_change_password_missing_fields(
            self,
            client: TestClient,
            mock_user: MagicMock,
            auth_headers: dict[str, str],
    ):
        """Test password change with missing fields."""
        async def get_user_override():
            return mock_user

        app.dependency_overrides[get_current_user] = get_user_override

        response = client.post(
            '/Prod/api/v1/auth/password-change',
            json={
                'old_password': 'OldPassword123!',
            },
            headers=auth_headers,
        )

        assert response.status_code == 422

    @pytest.mark.asyncio
    async def test_change_password_wrong_old_password(
            self,
            client: TestClient,
            mock_user: MagicMock,
            auth_headers: dict[str, str],
    ):
        """Test password change with wrong old password."""
        async def get_user_override():
            return mock_user

        app.dependency_overrides[get_current_user] = get_user_override

        with patch(
            'services.password.PasswordService.change_password',
            new_callable=AsyncMock,
        ) as mock_change:
            mock_change.side_effect = WrongCredentialsException()

            response = client.post(
                '/Prod/api/v1/auth/password-change',
                json={
                    'old_password': 'WrongPassword123!',
                    'new_password': 'NewPassword123!',
                },
                headers=auth_headers,
            )

            assert response.status_code == 401
            mock_change.assert_awaited_once()

    @pytest.mark.asyncio
    async def test_change_password_success(
            self,
            client: TestClient,
            mock_user: MagicMock,
            auth_headers: dict[str, str],
    ):
        """Test successful password change."""
        async def get_user_override():
            return mock_user

        app.dependency_overrides[get_current_user] = get_user_override

        with patch(
            'services.password.PasswordService.change_password',
            new_callable=AsyncMock,
        ) as mock_change:
            mock_change.return_value = None

            response = client.post(
                '/Prod/api/v1/auth/password-change',
                json={
                    'old_password': 'OldPassword123!',
                    'new_password': 'NewPassword123!',
                },
                headers=auth_headers,
            )

            assert response.status_code == 204
            mock_change.assert_awaited_once_with(
                user=mock_user,
                old_password='OldPassword123!',
                new_password='NewPassword123!',
            )
