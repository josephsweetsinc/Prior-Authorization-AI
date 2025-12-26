import secrets
from datetime import UTC, datetime, timedelta

from sqlalchemy.ext.asyncio.session import AsyncSession

from core import BaseService
from dao import PasswordResetCodeDAO, UserDAO
from exceptions import (
    InvalidResetCodeException,
    ResetCodeExpiredException,
    ResetCodeUsedException,
    UserNotFoundByEmailException,
    WrongCredentialsException,
)
from models import User
from services.email import EmailService
from services.jwt.hasher import Hasher


class PasswordService(BaseService):
    """Service for password reset functionality."""

    CODE_EXPIRATION_MINUTES = 15
    CODE_LENGTH = 5
    VERIFIED_CODE_VALID_MINUTES = 5

    def __init__(
        self,
        db_session: AsyncSession,
        *,
        password_reset_code_dao: PasswordResetCodeDAO | None = None,
        user_dao: UserDAO | None = None,
        email_service: EmailService | None = None,
        hash_service: Hasher | None = None,
    ) -> None:
        """Initialize PasswordResetService.

        Args:
            db_session: Database session.
            password_reset_code_dao: DAO for password reset codes.
            user_dao: DAO for users.
            email_service: Service for sending emails.
            hash_service: Service for hashing passwords.

        """
        super().__init__(db_session)
        self._password_reset_code_dao = (
            password_reset_code_dao or PasswordResetCodeDAO(db_session)
        )
        self._user_dao = user_dao or UserDAO(db_session)
        self._email_service = email_service or EmailService()
        self._hash_service = hash_service or Hasher()

    async def request_password_reset(self, email: str) -> None:
        """Request password reset by sending code to user's email.

        Args:
            email: User's email address.

        Raises:
            UserNotFoundByEmailException: If user with email not found.

        """
        user = await self._user_dao.get_by_email(email=email)
        if not user:
            raise UserNotFoundByEmailException

        if not user.is_active:
            raise UserNotFoundByEmailException

        # Invalidate existing unused codes for this user
        await self._password_reset_code_dao.invalidate_user_codes(user.id)

        # Generate new code
        code = self._generate_reset_code()
        expires_at = datetime.now(UTC) + timedelta(
            minutes=self.CODE_EXPIRATION_MINUTES
        )

        # Save code to database
        await self._password_reset_code_dao.create(
            code=code,
            user_id=user.id,
            expires_at=expires_at,
        )
        await self._session.commit()

        # Send code via email
        await self._email_service.send_password_reset_code(
            email=user.email,
            code=code,
        )

    async def verify_code(self, code: str) -> None:
        """Verify password reset code.

        Args:
            code: Password reset code.

        Raises:
            InvalidResetCodeException: If code is invalid or user not found.
            ResetCodeExpiredException: If code has expired.
            ResetCodeUsedException: If code has already been used.

        """
        # Get reset code
        reset_code = await self._password_reset_code_dao.get_by_code(code=code)

        if not reset_code:
            raise InvalidResetCodeException

        if reset_code.is_used:
            raise ResetCodeUsedException

        if reset_code.is_expired():
            raise ResetCodeExpiredException

        # Get user by ID from reset code
        user = await self._user_dao.get_by_id(user_id=reset_code.user_id)
        if not user:
            raise InvalidResetCodeException

        if not user.is_active:
            raise InvalidResetCodeException

        # Mark code as verified
        await self._password_reset_code_dao.mark_as_verified(reset_code.id)
        await self._session.commit()

    async def reset_password(
        self,
        email: str,
        new_password: str,
    ) -> None:
        """Reset user password using verified code.

        Args:
            email: User's email address.
            new_password: New password.

        Raises:
            InvalidResetCodeException: If no verified code found for user,
                or code is too old (more than 5 minutes).
            UserNotFoundByEmailException: If user with email not found.

        """
        # Get user by email
        user = await self._user_dao.get_by_email(email=email)
        if not user or not user.is_active:
            raise UserNotFoundByEmailException

        # Get verified code for this user
        reset_code = (
            await self._password_reset_code_dao.get_verified_code_by_user(
                user_id=user.id
            )
        )

        if not reset_code or reset_code.is_used:
            raise InvalidResetCodeException

        # Check if code was created more than VERIFIED_CODE_VALID_MINUTES ago
        created_at = reset_code.created_at
        if created_at.tzinfo is None:
            created_at = created_at.replace(tzinfo=UTC)
        code_age = datetime.now(UTC) - created_at
        if code_age > timedelta(minutes=self.VERIFIED_CODE_VALID_MINUTES):
            raise InvalidResetCodeException

        # Mark code as used
        await self._password_reset_code_dao.mark_as_used(reset_code.id)

        # Update user password
        hashed_password = self._hash_service.hash_password(new_password)
        await self._user_dao.update_password(user.id, hashed_password)

        await self._session.commit()

    async def change_password(
        self,
        user: User,
        old_password: str,
        new_password: str,
    ) -> None:
        """Change password for current authenticated user.

        Args:
            user: Authenticated user.
            old_password: old password
            new_password: new password

        Returns:
            None
        Raises:
            WrongCredentialsException - if old password is wrong

        """
        if not self._hash_service.verify_password(
            unhashed_password=old_password, hashed_password=user.password
        ):
            raise WrongCredentialsException
        hashed_password = self._hash_service.hash_password(new_password)
        await self._user_dao.update_password(user.id, hashed_password)
        await self._session.commit()

    @staticmethod
    def _generate_reset_code() -> str:
        """Generate a random 5-digit reset code.

        Returns:
            str: 5-digit numeric code.

        """
        return ''.join(str(secrets.randbelow(10)) for _ in range(5))
