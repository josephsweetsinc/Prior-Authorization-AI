from fastapi import HTTPException


class PasswordResetException(HTTPException):
    """Base exception for all password reset-related errors."""


class UserNotFoundByEmailException(PasswordResetException):
    """Exception raised when user with provided email is not found.

    Attributes:
        status_code (int): HTTP status code for exception (404 Not Found).
        detail (str): Human-readable explanation of the error.

    """

    def __init__(self) -> None:
        """Initialize UserNotFoundByEmailException with a default message."""
        super().__init__(
            status_code=404,
            detail='User with this email not found',
        )


class InvalidResetCodeException(PasswordResetException):
    """Exception raised when password reset code is invalid.

    Attributes:
        status_code (int): HTTP status code for exception (400 Bad Request).
        detail (str): Human-readable explanation of the error.

    """

    def __init__(self) -> None:
        """Initialize InvalidResetCodeException with a default message."""
        super().__init__(
            status_code=400,
            detail='Invalid password reset code',
        )


class ResetCodeExpiredException(PasswordResetException):
    """Exception raised when password reset code has expired.

    Attributes:
        status_code (int): HTTP status code for exception (400 Bad Request).
        detail (str): Human-readable explanation of the error.

    """

    def __init__(self) -> None:
        """Initialize ResetCodeExpiredException with a default message."""
        super().__init__(
            status_code=400,
            detail='Password reset code has expired',
        )


class ResetCodeUsedException(PasswordResetException):
    """Exception raised when password reset code has already been used.

    Attributes:
        status_code (int): HTTP status code for exception (400 Bad Request).
        detail (str): Human-readable explanation of the error.

    """

    def __init__(self) -> None:
        """Initialize ResetCodeUsedException with a default message."""
        super().__init__(
            status_code=400,
            detail='Password reset code has already been used',
        )
