"""Tests for PasswordResetCodeDAO."""

from datetime import UTC, datetime, timedelta

import pytest

from dao import PasswordResetCodeDAO


class TestPasswordResetCodeDAO:
    """Test suite for PasswordResetCodeDAO."""

    @pytest.mark.asyncio
    async def test_create(
        self,
        password_reset_code_dao: PasswordResetCodeDAO,
        user_factory,
        db_session,
    ):
        """Test creating a password reset code."""
        user = await user_factory()
        await db_session.commit()

        code = '12345'
        expires_at = datetime.now(UTC) + timedelta(minutes=15)

        reset_code = await password_reset_code_dao.create(
            code=code,
            user_id=user.id,
            expires_at=expires_at,
        )

        assert reset_code.code == code
        assert reset_code.user_id == user.id
        # SQLite may return naive datetime, so compare timestamps
        assert reset_code.expires_at.replace(tzinfo=UTC) == expires_at
        assert reset_code.is_used is False
        assert reset_code.is_verified is False
        assert reset_code.id is not None

    @pytest.mark.asyncio
    async def test_get_by_code(
        self,
        password_reset_code_dao: PasswordResetCodeDAO,
        password_reset_code_factory,
        db_session,
    ):
        """Test getting password reset code by code."""
        reset_code = await password_reset_code_factory(code='12345')
        await db_session.commit()

        found_code = await password_reset_code_dao.get_by_code('12345')

        assert found_code is not None
        assert found_code.code == '12345'
        assert found_code.id == reset_code.id

    @pytest.mark.asyncio
    async def test_get_by_code_not_found(
        self,
        password_reset_code_dao: PasswordResetCodeDAO,
    ):
        """Test getting non-existent code returns None."""
        found_code = await password_reset_code_dao.get_by_code('99999')
        assert found_code is None

    @pytest.mark.asyncio
    async def test_get_by_code_excludes_used(
        self,
        password_reset_code_dao: PasswordResetCodeDAO,
        password_reset_code_factory,
        db_session,
    ):
        """Test get_by_code excludes used codes."""
        reset_code = await password_reset_code_factory(
            code='12345',
            is_used=True,
        )
        await db_session.commit()

        found_code = await password_reset_code_dao.get_by_code('12345')
        assert found_code is None

    @pytest.mark.asyncio
    async def test_mark_as_used(
        self,
        password_reset_code_dao: PasswordResetCodeDAO,
        password_reset_code_factory,
        db_session,
    ):
        """Test marking code as used."""
        reset_code = await password_reset_code_factory(code='12345')
        await db_session.commit()

        updated_code = await password_reset_code_dao.mark_as_used(reset_code.id)
        await db_session.commit()

        assert updated_code is not None
        assert updated_code.is_used is True

        # Verify it's marked as used
        found_code = await password_reset_code_dao.get_by_code('12345')
        assert found_code is None

    @pytest.mark.asyncio
    async def test_mark_as_verified(
        self,
        password_reset_code_dao: PasswordResetCodeDAO,
        password_reset_code_factory,
        db_session,
    ):
        """Test marking code as verified."""
        reset_code = await password_reset_code_factory(
            code='12345',
            is_verified=False,
        )
        await db_session.commit()

        updated_code = await password_reset_code_dao.mark_as_verified(
            reset_code.id
        )
        await db_session.commit()

        assert updated_code is not None
        assert updated_code.is_verified is True
        assert updated_code.is_used is False

        # Verify it's still accessible (not used)
        found_code = await password_reset_code_dao.get_by_code('12345')
        assert found_code is not None
        assert found_code.is_verified is True

    @pytest.mark.asyncio
    async def test_invalidate_user_codes(
        self,
        password_reset_code_dao: PasswordResetCodeDAO,
        password_reset_code_factory,
        user_factory,
        db_session,
    ):
        """Test invalidating all unused codes for a user."""
        user = await user_factory()
        await db_session.commit()

        code1 = await password_reset_code_factory(
            code='11111',
            user_id=user.id,
            is_used=False,
        )
        code2 = await password_reset_code_factory(
            code='22222',
            user_id=user.id,
            is_used=False,
        )
        await db_session.commit()

        await password_reset_code_dao.invalidate_user_codes(user.id)
        await db_session.commit()

        # Both codes should be marked as used
        found_code1 = await password_reset_code_dao.get_by_code('11111')
        found_code2 = await password_reset_code_dao.get_by_code('22222')

        assert found_code1 is None
        assert found_code2 is None
