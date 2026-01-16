from fastapi import HTTPException


class NotificationException(HTTPException):
    """Base exception for all notification-related errors."""


class NotificationSystemCategoryException(NotificationException):
    """Exception raised when SYSTEM notification is associated with a request.

    Attributes:
        status_code (int): HTTP status code for exception (400 Bad Request).
        detail (str): Human-readable explanation of the error.

    """

    def __init__(self) -> None:
        """Initialize NotificationSystemCategoryException with default message."""  # noqa: E501
        super().__init__(
            status_code=400,
            detail='SYSTEM notifications cannot be associated with a request',
        )


class NotificationMissingRequestException(NotificationException):
    """Exception raised when non-SYSTEM notification is missing request_id.

    Attributes:
        status_code (int): HTTP status code for exception (400 Bad Request).
        detail (str): Human-readable explanation of the error.

    """

    def __init__(self, category: str) -> None:
        """Initialize NotificationMissingRequestException with category.

        Args:
            category: Notification category that requires request_id.

        """
        super().__init__(
            status_code=400,
            detail=f'{category} notifications must be associated with a request',  # noqa: E501
        )


class NotificationNotFoundException(NotificationException):
    """Exception raised when notification is not found.

    Attributes:
        status_code (int): HTTP status code for exception (404 Not Found).
        detail (str): Human-readable explanation of the error.

    """

    def __init__(self) -> None:
        """Initialize NotificationNotFoundException with default message."""
        super().__init__(
            status_code=404,
            detail='Notification was not found by given id.',
        )
