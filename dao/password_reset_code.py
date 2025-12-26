from datetime import datetime

from sqlalchemy import select, update

from core.dao import BaseDAO
from models import PasswordResetCode


class PasswordResetCodeDAO(BaseDAO):
    """DAO for PasswordResetCode model."""

    async def create(
        self,
        *,
        code: str,
        user_id: int,
        expires_at: datetime,
    ) -> PasswordResetCode:
        """Create a new password reset code entry.

        Args:
            code: 5-digit password reset code.
            user_id: User ID.
            expires_at: Code expiration timestamp.

        Returns:
            PasswordResetCode: Created password reset code instance.

        """
        reset_code = PasswordResetCode(
            code=code,
            user_id=user_id,
            expires_at=expires_at,
        )
        self._session.add(reset_code)
        await self._session.flush()
        await self._session.refresh(reset_code)
        return reset_code

    async def get_by_code(
        self,
        code: str,
    ) -> PasswordResetCode | None:
        """Get password reset code by code.

        Args:
            code: Password reset code.

        Returns:
            PasswordResetCode | None: Password reset code instance or None.

        """
        stmt = select(PasswordResetCode).where(
            PasswordResetCode.code == code,
            PasswordResetCode.is_used == False,  # noqa: E712
        )
        result = await self._session.execute(stmt)
        return result.scalar_one_or_none()

    async def get_by_code_and_user(
        self,
        code: str,
        user_id: int,
    ) -> PasswordResetCode | None:
        """Get password reset code by code and user ID.

        Args:
            code: Password reset code.
            user_id: User ID.

        Returns:
            PasswordResetCode | None: Password reset code instance or None.

        """
        stmt = select(PasswordResetCode).where(
            PasswordResetCode.code == code,
            PasswordResetCode.user_id == user_id,
            PasswordResetCode.is_used == False,  # noqa: E712
        )
        result = await self._session.execute(stmt)
        return result.scalar_one_or_none()

    async def mark_as_used(
        self, reset_code_id: int
    ) -> PasswordResetCode | None:
        """Mark a password reset code as used.

        Args:
            reset_code_id: Password reset code ID.

        Returns:
            PasswordResetCode | None: Updated password reset code or None.

        """
        stmt = (
            update(PasswordResetCode)
            .where(PasswordResetCode.id == reset_code_id)
            .values(is_used=True)
            .returning(PasswordResetCode)
        )
        result = await self._session.execute(stmt)
        return result.scalar_one_or_none()

    async def mark_as_verified(
        self, reset_code_id: int
    ) -> PasswordResetCode | None:
        """Mark a password reset code as verified.

        Args:
            reset_code_id: Password reset code ID.

        Returns:
            PasswordResetCode | None: Updated password reset code or None.

        """
        stmt = (
            update(PasswordResetCode)
            .where(PasswordResetCode.id == reset_code_id)
            .values(is_verified=True)
            .returning(PasswordResetCode)
        )
        result = await self._session.execute(stmt)
        return result.scalar_one_or_none()

    async def get_verified_code_by_user(
        self,
        user_id: int,
    ) -> PasswordResetCode | None:
        """Get verified password reset code by user ID.

        Args:
            user_id: User ID.

        Returns:
            PasswordResetCode | None: Verified password reset code or None.

        """
        stmt = (
            select(PasswordResetCode)
            .where(
                PasswordResetCode.user_id == user_id,
                PasswordResetCode.is_used == False,  # noqa: E712
                PasswordResetCode.is_verified == True,  # noqa: E712
            )
            .order_by(PasswordResetCode.created_at.desc())
        )
        result = await self._session.execute(stmt)
        return result.scalar_one_or_none()

    async def invalidate_user_codes(self, user_id: int) -> None:
        """Invalidate all unused password reset codes for a user.

        Args:
            user_id: User ID.

        """
        stmt = (
            update(PasswordResetCode)
            .where(
                PasswordResetCode.user_id == user_id,
                PasswordResetCode.is_used == False,  # noqa: E712
            )
            .values(is_used=True)
        )
        await self._session.execute(stmt)
