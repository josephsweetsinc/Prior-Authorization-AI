from fastapi import HTTPException


class AmbulanceFileException(HTTPException):
    """Base exception for all file-related errors."""


class UnknownFiletypeException(AmbulanceFileException):
    """Exception raised when file type is not allowed."""

    def __init__(self, allowed_types: list[str] | None = None) -> None:
        """Initialize UnknownFiletypeException with a default message."""
        detail = 'Unsupported file type'
        if allowed_types:
            detail = (
                f'File type not allowed. Allowed types: '
                f'{", ".join(allowed_types)}'
            )
        super().__init__(
            status_code=400,
            detail=detail,
        )


class IncorrectFileSizeException(AmbulanceFileException):
    """Exception raised when file size exceeds maximum allowed size."""

    def __init__(self, max_size_mb: int | None = None) -> None:
        """Initialize IncorrectFileSizeException with a default message."""
        detail = 'Incorrect file size'
        if max_size_mb:
            detail = (
                f'File size exceeds maximum allowed size of {max_size_mb} MB'
            )
        super().__init__(
            status_code=400,
            detail=detail,
        )
