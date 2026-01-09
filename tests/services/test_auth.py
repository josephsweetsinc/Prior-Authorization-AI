"""Tests for AuthService."""

from datetime import datetime, timedelta, UTC
from unittest.mock import AsyncMock, MagicMock, patch

import pytest

from exceptions import (
    RefreshTokenException,
    UserIsNotActiveException,
    WrongCredentialsException,
)
from models import User
from models.user import UserRole
from schemas import TokenSchemas
from services.auth import AuthService


@pytest.fixture
def mock_session():
    """Mock database session."""
    return AsyncMock()


@pytest.fixture
def mock_user_dao():
    """Mock UserDAO."""
    return AsyncMock()


@pytest.fixture
def mock_blacklist_dao():
    """Mock BlacklistTokenDAO."""
    return AsyncMock()


@pytest.fixture
def mock_hasher():
    """Mock Hasher."""
    return MagicMock()


@pytest.fixture
def mock_token_manager():
    """Mock TokenManager."""
    return MagicMock()


@pytest.fixture
def auth_service(
    mock_session,
    mock_user_dao,
    mock_blacklist_dao,
    mock_hasher,
    mock_token_manager,
):
    """Create AuthService instance with mocks."""
    return AuthService(
        db_session=mock_session,
        user_dao=mock_user_dao,
        blacklist_token_dao=mock_blacklist_dao,
        hash_service=mock_hasher,
        token_manager_service=mock_token_manager,
    )


class TestAuthService:
    """Test suite for AuthService."""

    @pytest.mark.asyncio
    async def test_auth_user_success(
        self,
        auth_service,
        mock_user_dao,
    ):
        """Test successful user authentication."""
        email = "user@example.com"
        password = "password"
        hashed_password = "hashed_password"

        user = MagicMock(spec=User)
        user.id = 1
        user.is_active = True
        user.password = hashed_password
        mock_user_dao.get_by_email.return_value = user

        # Mock Hasher.verify_password
        with patch("services.auth.Hasher.verify_password", return_value=True):
            result = await auth_service.auth_user(email, password)

            assert result == user
            mock_user_dao.get_by_email.assert_awaited_once_with(email=email)
            mock_user_dao.update_last_login.assert_awaited_once_with(user.id)

    @pytest.mark.asyncio
    async def test_auth_user_not_found(
        self,
        auth_service,
        mock_user_dao,
    ):
        """Test authentication with non-existent email."""
        mock_user_dao.get_by_email.return_value = None

        with pytest.raises(WrongCredentialsException):
            await auth_service.auth_user("unknown@example.com", "password")

    @pytest.mark.asyncio
    async def test_auth_user_inactive(
        self,
        auth_service,
        mock_user_dao,
    ):
        """Test authentication for inactive user."""
        user = MagicMock(spec=User)
        user.is_active = False
        mock_user_dao.get_by_email.return_value = user

        with pytest.raises(UserIsNotActiveException):
            await auth_service.auth_user("user@example.com", "password")

    @pytest.mark.asyncio
    async def test_auth_user_wrong_password(
        self,
        auth_service,
        mock_user_dao,
    ):
        """Test authentication with wrong password."""
        user = MagicMock(spec=User)
        user.is_active = True
        user.password = "hashed"
        mock_user_dao.get_by_email.return_value = user

        with patch("services.auth.Hasher.verify_password", return_value=False):
            with pytest.raises(WrongCredentialsException):
                await auth_service.auth_user("user@example.com", "wrong")

    @pytest.mark.asyncio
    async def test_create_token(
        self,
        auth_service,
    ):
        """Test token creation."""
        author_id = 1
        role = UserRole.PROVIDER
        
        with patch("services.auth.TokenManager.generate_access_token", return_value="access"), \
             patch("services.auth.TokenManager.generate_refresh_token", return_value="refresh"):
            
            result = await auth_service.create_token(author_id, role)

            assert isinstance(result, TokenSchemas)
            assert result.access_token == "access"
            assert result.refresh_token == "refresh"
            assert result.user_role == role

    @pytest.mark.asyncio
    async def test_refresh_token_success(
        self,
        auth_service,
        mock_blacklist_dao,
        mock_user_dao,
    ):
        """Test successful token refresh."""
        refresh_token = "valid_refresh_token"
        decoded_token = {"sub": "1", "jti": "unique_id", "exp": 1234567890}
        
        with patch("services.auth.TokenManager.decode_refresh_token", return_value=decoded_token), \
             patch("services.auth.TokenManager.validate_refresh_token_expired"), \
             patch("services.auth.TokenManager.get_jti_from_token", return_value="unique_id"), \
             patch("services.auth.TokenManager.generate_access_token", return_value="new_access"), \
             patch("services.auth.TokenManager.generate_refresh_token", return_value="new_refresh"):
             
             mock_blacklist_dao.is_blacklisted.return_value = False
             
             user = MagicMock(spec=User)
             user.id = 1
             user.is_active = True
             user.role = UserRole.PROVIDER
             mock_user_dao.get_by_id.return_value = user

             result = await auth_service.refresh_token(refresh_token)

             assert result.access_token == "new_access"
             assert result.refresh_token == "new_refresh"
             # Verify old token was blacklisted
             mock_blacklist_dao.create.assert_awaited_once()

    @pytest.mark.asyncio
    async def test_refresh_token_reuse_detected(
        self,
        auth_service,
        mock_blacklist_dao,
    ):
        """Test that reusing a blacklisted token raises exception."""
        refresh_token = "reused_token"
        decoded_token = {"sub": "1", "jti": "jti", "exp": 1234567890}
        
        with patch("services.auth.TokenManager.decode_refresh_token", return_value=decoded_token), \
             patch("services.auth.TokenManager.validate_refresh_token_expired"), \
             patch("services.auth.TokenManager.get_jti_from_token", return_value="jti"):
             
             # Simulate token is already blacklisted
             mock_blacklist_dao.is_blacklisted.return_value = True

             with pytest.raises(RefreshTokenException):
                 await auth_service.refresh_token(refresh_token)

    @pytest.mark.asyncio
    async def test_refresh_token_blacklisted(
        self,
        auth_service,
        mock_blacklist_dao,
    ):
        """Test refresh with blacklisted token."""
        refresh_token = "blacklisted"
        decoded_token = {"sub": 1, "jti": "jti"}
        
        with patch("services.auth.TokenManager.decode_refresh_token", return_value=decoded_token), \
             patch("services.auth.TokenManager.validate_refresh_token_expired"), \
             patch("services.auth.TokenManager.get_jti_from_token", return_value="jti"):
             
             mock_blacklist_dao.is_blacklisted.return_value = True

             with pytest.raises(RefreshTokenException):
                 await auth_service.refresh_token(refresh_token)

    @pytest.mark.asyncio
    async def test_logout_user_success(
        self,
        auth_service,
        mock_blacklist_dao,
        mock_session,
    ):
        """Test successful logout."""
        refresh_token = "token"
        decoded_token = {"sub": "1", "jti": "jti", "exp": 1234567890}
        
        with patch("services.auth.TokenManager.decode_refresh_token", return_value=decoded_token), \
             patch("services.auth.TokenManager.validate_refresh_token_expired"), \
             patch("services.auth.TokenManager.get_jti_from_token", return_value="jti"):
             
             mock_blacklist_dao.is_blacklisted.return_value = False

             await auth_service.logout_user(refresh_token)

             mock_blacklist_dao.create.assert_awaited_once()
             mock_session.commit.assert_awaited_once()
