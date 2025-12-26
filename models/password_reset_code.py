from datetime import UTC, datetime

from sqlalchemy import TIMESTAMP, ForeignKey, Index, String
from sqlalchemy.orm import Mapped, mapped_column

from core.models import BaseIdMixin, BaseTimeStampMixin


class PasswordResetCode(BaseIdMixin, BaseTimeStampMixin):
    """Model for storing password reset codes.

    Codes are 5-digit numeric codes sent to user's email for password reset.
    Each code is associated with a user and has an expiration time.
    """

    __tablename__ = 'password_reset_codes'

    code: Mapped[str] = mapped_column(
        String(5),
        nullable=False,
        index=True,
        comment='5-digit password reset code',
    )
    user_id: Mapped[int] = mapped_column(
        ForeignKey('users.id', ondelete='CASCADE'),
        nullable=False,
        index=True,
        comment='User ID associated with the reset code',
    )
    expires_at: Mapped[datetime] = mapped_column(
        TIMESTAMP(timezone=True),
        nullable=False,
        index=True,
        comment='Code expiration timestamp',
    )
    is_used: Mapped[bool] = mapped_column(
        nullable=False,
        default=False,
        comment='Whether the code has been used',
    )
    is_verified: Mapped[bool] = mapped_column(
        nullable=False,
        default=False,
        comment='Whether the code has been verified',
    )

    __table_args__ = (
        Index(
            'ix_password_reset_codes_user_id_expires_at',
            'user_id',
            'expires_at',
        ),
    )

    def __repr__(self) -> str:
        """Return a string representation of the PasswordResetCode instance."""
        return (
            f'<PasswordResetCode(id={self.id}, code={self.code}, '
            f'user_id={self.user_id}, expires_at={self.expires_at}, '
            f'is_used={self.is_used}, is_verified={self.is_verified})>'
        )

    def is_expired(self) -> bool:
        """Check if the code has expired.

        Returns:
            bool: True if code is expired, False otherwise.

        """
        # Handle timezone-aware and naive datetimes
        expires_at = self.expires_at
        if expires_at.tzinfo is None:
            expires_at = expires_at.replace(tzinfo=UTC)
        return datetime.now(UTC) > expires_at
