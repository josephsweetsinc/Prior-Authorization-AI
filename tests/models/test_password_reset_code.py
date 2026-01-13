"""Tests for PasswordResetCode model."""

from datetime import UTC, datetime, timedelta

import pytest


class TestPasswordResetCode:
    """Test suite for PasswordResetCode model."""

    @pytest.mark.asyncio
    async def test_is_expired_when_expired(self, password_reset_code_factory):
        """Test is_expired returns True when code is expired."""
        expired_at = datetime.now(UTC) - timedelta(minutes=1)
        code = await password_reset_code_factory(expires_at=expired_at)
        # Ensure expires_at is timezone-aware for comparison
        if code.expires_at.tzinfo is None:
            code.expires_at = code.expires_at.replace(tzinfo=UTC)
        assert code.is_expired() is True

    @pytest.mark.asyncio
    async def test_is_expired_when_not_expired(
        self, password_reset_code_factory
    ):
        """Test is_expired returns False when code is not expired."""
        expires_at = datetime.now(UTC) + timedelta(minutes=15)
        code = await password_reset_code_factory(expires_at=expires_at)
        # Ensure expires_at is timezone-aware for comparison
        if code.expires_at.tzinfo is None:
            code.expires_at = code.expires_at.replace(tzinfo=UTC)
        assert code.is_expired() is False

    @pytest.mark.asyncio
    async def test_repr(self, password_reset_code_factory):
        """Test __repr__ method."""
        code = await password_reset_code_factory(
            code='12345',
            user_id=1,
        )
        repr_str = repr(code)
        assert 'PasswordResetCode' in repr_str
        assert '12345' in repr_str
        assert '1' in repr_str
