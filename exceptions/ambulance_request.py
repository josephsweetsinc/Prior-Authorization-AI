from fastapi import HTTPException


class AmbulanceRequestException(HTTPException):
    """Exception raised when an Ambulance request fails."""


class AmbulanceRequestNotFoundException(AmbulanceRequestException):
    """Exception raised when an ambulance request is not found."""

    def __init__(self) -> None:
        """Initialize AmbulanceRequestNotFoundException."""
        super().__init__(
            status_code=404,
            detail='Ambulance request was not found by given id.',
        )


class AmbulanceRequestNoDocumentsUploadedException(AmbulanceRequestException):
    """Exception raised when no files were uploaded for request."""

    def __init__(self) -> None:
        """Initialize AmbulanceRequestNoDocumentsUploadedException."""
        super().__init__(
            status_code=400,
            detail='No files were uploaded for request',
        )


class AmbulanceRequestEmptyDocumentFileNameException(AmbulanceRequestException):
    """Exception raised when a file has no name."""

    def __init__(self) -> None:
        """Initialize AmbulanceRequestEmptyDocumentFileNameException."""
        super().__init__(
            status_code=400,
            detail='File for ambulance request has no name.',
        )


class AmbulanceRequestEmptyDocumentEmtpyException(AmbulanceRequestException):
    """Exception raised when a file is empty."""

    def __init__(self) -> None:
        """Initialize AmbulanceRequestEmptyDocumentEmtpyException."""
        super().__init__(
            status_code=400,
            detail='File for ambulance request has is empty.',
        )


class AmbulanceRequestFileUploadFailedException(AmbulanceRequestException):
    """Exception raised when a file failed to upload."""

    def __init__(self, filename: str, error: str) -> None:
        """Initialize AmbulanceRequestFileUploadFailedException."""
        super().__init__(
            status_code=400,
            detail=f'Failed to upload file "{filename}": {error}',
        )


class AmbulanceRequestAllFilesUploadFailedException(AmbulanceRequestException):
    """Exception raised when all files failed to upload."""

    def __init__(self, errors: list[str]) -> None:
        """Initialize AmbulanceRequestAllFilesUploadFailedException."""
        error_message = '; '.join(errors)
        super().__init__(
            status_code=400,
            detail=f'All files failed to upload: {error_message}',
        )


class AmbulanceRequestInvalidFileIdsException(AmbulanceRequestException):
    """Exception raised when invalid file IDs provided for ambulance request."""

    def __init__(self, invalid_file_ids: list[int]) -> None:
        """Initialize AmbulanceRequestInvalidFileIdsException."""
        file_ids_str = ', '.join(map(str, invalid_file_ids))
        super().__init__(
            status_code=400,
            detail=f'Invalid file IDs provided: {file_ids_str}.'
            f' Files not found. Or already attached to a different request',
        )


class AmbulanceRequestFilesAlreadyLinkedException(AmbulanceRequestException):
    """Exception raised when files are already linked to a request."""

    def __init__(self) -> None:
        """Initialize AmbulanceRequestFilesAlreadyLinkedException."""
        super().__init__(
            status_code=400,
            detail='Files are already linked to a request.',
        )


class AmbulanceRequestPermissionException(AmbulanceRequestException):
    """Exception raised when user does not have permission."""

    def __init__(self) -> None:
        """Initialize AmbulanceRequestPermissionException."""
        super().__init__(
            status_code=403,
            detail='Current user cannot access this ambulance request',
        )
