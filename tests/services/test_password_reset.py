"""Tests for PasswordResetService."""

from datetime import UTC, datetime, timedelta
from unittest.mock import AsyncMock, patch

import pytest

from exceptions import (
    InvalidResetCodeException,
    ResetCodeExpiredException,
    UserNotFoundByEmailException,
)
from services.password import PasswordService


class TestPasswordResetService:
    """Test suite for PasswordResetService."""

    @pytest.mark.asyncio
    async def test_request_password_reset_success(
        self,
        password_reset_service: PasswordService,
        user_factory,
        db_session,
    ):
        """Test successful password reset request."""
        user = await user_factory(email='test@example.com')
        await db_session.commit()

        with patch.object(
            password_reset_service._email_service,
            'send_password_reset_code',
            new_callable=AsyncMock,
        ) as mock_send_email:
            await password_reset_service.request_password_reset(
                'test@example.com'
            )

            mock_send_email.assert_called_once()
            call_args = mock_send_email.call_args
            assert call_args[1]['email'] == 'test@example.com'
            assert len(call_args[1]['code']) == 5

    @pytest.mark.asyncio
    async def test_request_password_reset_user_not_found(
        self,
        password_reset_service: PasswordService,
    ):
        """Test password reset request with non-existent user."""
        with pytest.raises(UserNotFoundByEmailException):
            await password_reset_service.request_password_reset(
                'nonexistent@example.com'
            )

    @pytest.mark.asyncio
    async def test_request_password_reset_inactive_user(
        self,
        password_reset_service: PasswordService,
        user_factory,
        db_session,
    ):
        """Test password reset request with inactive user."""
        user = await user_factory(
            email='inactive@example.com',
            is_active=False,
        )
        await db_session.commit()

        with pytest.raises(UserNotFoundByEmailException):
            await password_reset_service.request_password_reset(
                'inactive@example.com'
            )

    @pytest.mark.asyncio
    async def test_request_password_reset_invalidates_old_codes(
        self,
        password_reset_service: PasswordService,
        user_factory,
        password_reset_code_factory,
        db_session,
    ):
        """Test that requesting reset invalidates existing codes."""
        user = await user_factory(email='test@example.com')
        await db_session.commit()

        # Create existing unused code
        old_code = await password_reset_code_factory(
            code='11111',
            user_id=user.id,
            is_used=False,
        )
        await db_session.commit()

        with patch.object(
            password_reset_service._email_service,
            'send_password_reset_code',
            new_callable=AsyncMock,
        ):
            await password_reset_service.request_password_reset(
                'test@example.com'
            )
            await db_session.commit()

        # Old code should be invalidated
        found_code = (
            await password_reset_service._password_reset_code_dao.get_by_code(
                '11111'
            )
        )
        assert found_code is None

    @pytest.mark.asyncio
    async def test_verify_code_success(
        self,
        password_reset_service: PasswordService,
        user_factory,
        password_reset_code_factory,
        db_session,
    ):
        """Test successful code verification."""
        user = await user_factory(email='test@example.com')
        await db_session.commit()

        reset_code = await password_reset_code_factory(
            code='12345',
            user_id=user.id,
            expires_at=datetime.now(UTC) + timedelta(minutes=15),
            is_used=False,
            is_verified=False,
        )
        await db_session.commit()

        await password_reset_service.verify_code(code='12345')
        await db_session.commit()

        # Verify code is marked as verified
        found_code = (
            await password_reset_service._password_reset_code_dao.get_by_code(
                '12345'
            )
        )
        assert found_code is not None
        assert found_code.is_verified is True
        assert found_code.is_used is False

    @pytest.mark.asyncio
    async def test_verify_code_invalid_code(
        self,
        password_reset_service: PasswordService,
    ):
        """Test code verification with invalid code."""
        with pytest.raises(InvalidResetCodeException):
            await password_reset_service.verify_code(code='99999')

    @pytest.mark.asyncio
    async def test_verify_code_expired_code(
        self,
        password_reset_service: PasswordService,
        user_factory,
        password_reset_code_factory,
        db_session,
    ):
        """Test code verification with expired code."""
        user = await user_factory(email='test@example.com')
        await db_session.commit()

        expired_code = await password_reset_code_factory(
            code='12345',
            user_id=user.id,
            expires_at=datetime.now(UTC) - timedelta(minutes=1),
            is_used=False,
        )
        await db_session.commit()

        with pytest.raises(ResetCodeExpiredException):
            await password_reset_service.verify_code(code='12345')

    @pytest.mark.asyncio
    async def test_verify_code_used_code(
        self,
        password_reset_service: PasswordService,
        user_factory,
        password_reset_code_factory,
        db_session,
    ):
        """Test code verification with already used code."""
        user = await user_factory(email='test@example.com')
        await db_session.commit()

        used_code = await password_reset_code_factory(
            code='12345',
            user_id=user.id,
            expires_at=datetime.now(UTC) + timedelta(minutes=15),
            is_used=True,
        )
        await db_session.commit()

        # get_by_code excludes used codes, so we get InvalidResetCodeException
        with pytest.raises(InvalidResetCodeException):
            await password_reset_service.verify_code(code='12345')

    @pytest.mark.asyncio
    async def test_reset_password_success(
        self,
        password_reset_service: PasswordService,
        user_factory,
        password_reset_code_factory,
        db_session,
    ):
        """Test successful password reset."""
        user = await user_factory(
            email='test@example.com',
            password='old_hashed_password',
        )
        await db_session.commit()

        reset_code = await password_reset_code_factory(
            code='12345',
            user_id=user.id,
            expires_at=datetime.now(UTC) + timedelta(minutes=15),
            is_used=False,
            is_verified=False,
        )
        await db_session.commit()

        # First verify the code
        await password_reset_service.verify_code(code='12345')
        await db_session.commit()

        # Then reset password using email
        new_password = 'NewPassword123!'
        await password_reset_service.reset_password(
            email='test@example.com',
            new_password=new_password,
        )

        # Verify code is marked as used
        found_code = (
            await password_reset_service._password_reset_code_dao.get_by_code(
                '12345'
            )
        )
        assert found_code is None

        # Verify password is updated
        updated_user = await password_reset_service._user_dao.get_by_id(user.id)
        assert updated_user is not None
        assert updated_user.password != 'old_hashed_password'

        # Verify password can be verified
        assert password_reset_service._hash_service.verify_password(
            new_password, updated_user.password
        )

    @pytest.mark.asyncio
    async def test_reset_password_no_verified_code(
        self,
        password_reset_service: PasswordService,
        user_factory,
        db_session,
    ):
        """Test password reset without verified code."""
        user = await user_factory(email='test@example.com')
        await db_session.commit()

        # Try to reset password without verifying code first
        with pytest.raises(InvalidResetCodeException):
            await password_reset_service.reset_password(
                email='test@example.com',
                new_password='NewPassword123!',
            )

    @pytest.mark.asyncio
    async def test_reset_password_unverified_code(
        self,
        password_reset_service: PasswordService,
        user_factory,
        password_reset_code_factory,
        db_session,
    ):
        """Test password reset with unverified code."""
        user = await user_factory(email='test@example.com')
        await db_session.commit()

        reset_code = await password_reset_code_factory(
            code='12345',
            user_id=user.id,
            expires_at=datetime.now(UTC) + timedelta(minutes=15),
            is_used=False,
            is_verified=False,
        )
        await db_session.commit()

        # Try to reset password without verifying code first
        with pytest.raises(InvalidResetCodeException):
            await password_reset_service.reset_password(
                email='test@example.com',
                new_password='NewPassword123!',
            )

    @pytest.mark.asyncio
    async def test_reset_password_expired_code(
        self,
        password_reset_service: PasswordService,
        user_factory,
        password_reset_code_factory,
        db_session,
    ):
        """Test password reset with expired code."""
        user = await user_factory(email='test@example.com')
        await db_session.commit()

        expired_code = await password_reset_code_factory(
            code='12345',
            user_id=user.id,
            expires_at=datetime.now(UTC) - timedelta(minutes=1),
            is_used=False,
            is_verified=False,
        )
        await db_session.commit()

        # Expired code should fail at verification stage
        with pytest.raises(ResetCodeExpiredException):
            await password_reset_service.verify_code(code='12345')

    @pytest.mark.asyncio
    async def test_reset_password_old_verified_code(
        self,
        password_reset_service: PasswordService,
        user_factory,
        password_reset_code_factory,
        db_session,
    ):
        """Test password reset with verified code older than 5 minutes."""
        user = await user_factory(email='test@example.com')
        await db_session.commit()

        # Create code that was verified more than 5 minutes ago
        # We need to manually set created_at to be older
        reset_code = await password_reset_code_factory(
            code='12345',
            user_id=user.id,
            expires_at=datetime.now(UTC) + timedelta(minutes=15),
            is_used=False,
            is_verified=True,
        )
        await db_session.commit()

        # Manually update created_at to be 6 minutes ago
        from sqlalchemy import update as sql_update
        from models import PasswordResetCode
        old_created_at = datetime.now(UTC) - timedelta(minutes=6)
        stmt = sql_update(PasswordResetCode).where(
            PasswordResetCode.id == reset_code.id
        ).values(created_at=old_created_at)
        await db_session.execute(stmt)
        await db_session.commit()

        # Try to reset password with old verified code
        with pytest.raises(InvalidResetCodeException):
            await password_reset_service.reset_password(
                email='test@example.com',
                new_password='NewPassword123!',
            )

    @pytest.mark.asyncio
    async def test_reset_password_used_code(
        self,
        password_reset_service: PasswordService,
        user_factory,
        password_reset_code_factory,
        db_session,
    ):
        """Test password reset with already used code."""
        user = await user_factory(email='test@example.com')
        await db_session.commit()

        used_code = await password_reset_code_factory(
            code='12345',
            user_id=user.id,
            expires_at=datetime.now(UTC) + timedelta(minutes=15),
            is_used=True,
            is_verified=True,
        )
        await db_session.commit()

        # get_verified_code_by_user excludes used codes, so we get InvalidResetCodeException
        with pytest.raises(InvalidResetCodeException):
            await password_reset_service.reset_password(
                email='test@example.com',
                new_password='NewPassword123!',
            )

    @pytest.mark.asyncio
    async def test_generate_reset_code(self):
        """Test reset code generation."""
        code = PasswordService._generate_reset_code()
        assert len(code) == 5
        assert code.isdigit()
        assert all(c.isdigit() for c in code)
