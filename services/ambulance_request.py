import logging
from io import BytesIO

from fastapi import UploadFile
from sqlalchemy.ext.asyncio import AsyncSession

from core import BaseService
from dao import (
    AmbulanceRequestDAO,
    RequestFileDAO,
    RequestStatusHistoryDAO,
)
from exceptions import (
    AmbulanceRequestAllFilesUploadFailedException,
    AmbulanceRequestEmptyDocumentEmtpyException,
    AmbulanceRequestEmptyDocumentFileNameException,
    AmbulanceRequestInvalidFileIdsException,
    AmbulanceRequestNotFoundException,
    AmbulanceRequestPermissionException,
)
from exceptions.file import (
    IncorrectFileSizeException,
    UnknownFiletypeException,
)
from models import User
from models.ambulance_request import (
    AmbulanceRequest,
    RequestStatus,
)
from models.user import UserRole
from schemas.ai_extraction import AIExtractionResponse
from schemas.ambulance_request import (
    AmbulanceRequestResponseSchema,
    CreateAmbulanceRequestSchema,
    FileUploadResponseSchema,
    FileUploadWithExtractionResponseSchema,
    RequestDocumentSchema,
    RequestStatusHistoryResponseSchema,
    RequestWithStatusHistorySchema,
)
from services.ai.extractor import AIExtractionService
from services.aws.actions import S3Actions

logger = logging.getLogger(__name__)


class AmbulanceRequestService(BaseService):
    """Service for ambulance request operations."""

    def __init__(
        self,
        db_session: AsyncSession,
        *,
        request_dao: AmbulanceRequestDAO | None = None,
        file_dao: RequestFileDAO | None = None,
        status_history_dao: RequestStatusHistoryDAO | None = None,
        s3_actions: S3Actions | None = None,
        ai_extraction_service: AIExtractionService | None = None,
    ):
        """Initialize AmbulanceRequestService."""
        super().__init__(db_session)
        self._request_dao = request_dao or AmbulanceRequestDAO(db_session)
        self._file_dao = file_dao or RequestFileDAO(db_session)
        self._status_history_dao = (
            status_history_dao or RequestStatusHistoryDAO(db_session)
        )
        self._s3_actions = s3_actions or S3Actions()
        self._ai_extraction_service = (
            ai_extraction_service
            or AIExtractionService(s3_actions=self._s3_actions)
        )

    async def upload_file(
        self,
        file: UploadFile,
        user_id: int,
    ) -> FileUploadResponseSchema:
        """Upload a file to S3 and create file record.

        File validation is handled by S3Actions (FileActionMixin).

        Args:
            file: Uploaded file.
            user_id: ID of the user uploading the file.

        Returns:
            FileUploadResponseSchema: Uploaded file information.

        Raises:
            UnknownFiletypeException: If file type is not supported.
            IncorrectFileSizeException: If file size exceeds maximum allowed.

        """
        if not file.filename:
            raise AmbulanceRequestEmptyDocumentFileNameException

        # Read file content
        content = await file.read()
        file_size = len(content)

        if file_size == 0:
            raise AmbulanceRequestEmptyDocumentEmtpyException

        # Convert bytes to BytesIO for S3Actions
        file_obj = BytesIO(content)

        # Upload to S3 using S3Actions (validation happens inside)
        # S3Actions will validate file type and size using FileActionMixin
        s3_key, uploaded_content_type = self._s3_actions.upload_file(
            file_obj=file_obj,
            file_name=file.filename or 'unknown',
            file_size=file_size,
            declared_content_type=file.content_type,
            prefix=f'users/{user_id}/ambulance-requests',
        )

        # Create file record (without request_id for now)
        # We'll link it to request later in step 3
        # Use content_type determined by S3Actions
        request_file = await self._file_dao.create(
            request_id=None,
            # Temporary, will be updated when request is created
            filename=file.filename or 'unknown',
            s3_key=s3_key,
            file_size=file_size,
            content_type=uploaded_content_type,
        )
        await self._session.flush()
        await self._session.commit()
        return FileUploadResponseSchema(
            id=request_file.id,
            filename=request_file.filename,
            file_size=request_file.file_size,
            content_type=request_file.content_type,
            file_url=self._s3_actions.get_presigned_url(
                s3_key,
                expires_in=self._s3_actions.S3_EXPIRATION_TIME,
                require_object=True,
            ),
        )

    async def _extract_s3_keys(
        self, *, files: list[UploadFile], user_id: int
    ) -> tuple[list[str], list[FileUploadResponseSchema]]:
        uploaded_files: list[FileUploadResponseSchema] = []
        errors: list[str] = []
        file_s3_keys: list[str] = []

        # Upload files
        for file in files:
            try:
                uploaded_file = await self.upload_file(
                    file=file, user_id=user_id
                )
                uploaded_files.append(uploaded_file)
                # Get S3 key from file record
                file_record = await self._file_dao.get_by_id(uploaded_file.id)
                if file_record:
                    file_s3_keys.append(file_record.s3_key)
            except (
                AmbulanceRequestEmptyDocumentFileNameException,
                AmbulanceRequestEmptyDocumentEmtpyException,
                UnknownFiletypeException,
                IncorrectFileSizeException,
            ) as e:
                errors.append(f'{file.filename or "Unknown file"}: {e.detail}')
            except Exception:
                logger.exception('Error uploading file %s', file.filename)
                errors.append(
                    f'{file.filename or "Unknown file"}: Failed to upload'
                )

        if errors:
            if not uploaded_files:
                # If all files failed, raise an exception
                raise AmbulanceRequestAllFilesUploadFailedException(
                    errors=errors
                )
            # If some files succeeded, log errors but continue
            logger.warning('Some files failed to upload: %s', '; '.join(errors))
        return file_s3_keys, uploaded_files

    async def upload_files(
        self,
        files: list[UploadFile],
        user_id: int,
    ) -> list[FileUploadResponseSchema]:
        file_s3_keys, uploaded_files = await self._extract_s3_keys(
            files=files, user_id=user_id
        )
        return uploaded_files

    async def create_request(
        self,
        user_id: int,
        request_data: CreateAmbulanceRequestSchema,
    ) -> AmbulanceRequestResponseSchema:
        """Create a new ambulance request.

        Args:
            user_id: ID of the user creating the request.
            request_data: Request data.

        Returns:
            AmbulanceRequestResponseSchema: Created request.

        """
        # Create request
        request = await self._request_dao.create(
            user_id=user_id,
            transportation_type=request_data.transportation_type,
            patient_first_name=request_data.patient_first_name,
            patient_last_name=request_data.patient_last_name,
            patient_date_of_birth=request_data.patient_date_of_birth,
            patient_id=request_data.patient_id,
            date_of_transport=request_data.date_of_transport,
            time_of_transport=request_data.time_of_transport,
            pickup_address=request_data.pickup_address,
            destination_address=request_data.destination_address,
            primary_diagnosis=request_data.primary_diagnosis,
            medical_justification=request_data.medical_justification,
            form_number=request_data.form_number,
            status=RequestStatus.PROCESSING,
        )
        await self._session.flush()

        # Link files to request
        invalid_file_ids = []
        for file_id in request_data.file_ids:
            updated_file = await self._file_dao.update_request_id(
                file_id=file_id,
                request_id=request.id,
            )
            if not updated_file:
                invalid_file_ids.append(file_id)

        if invalid_file_ids:
            raise AmbulanceRequestInvalidFileIdsException(
                invalid_file_ids=invalid_file_ids
            )
        await self._session.flush()
        await self._status_history_dao.create(
            request_id=request.id,
            status=RequestStatus.PROCESSING,
            notes='Request submitted',
        )
        await self._session.flush()
        await self._session.commit()
        await self._session.refresh(request)
        return AmbulanceRequestResponseSchema.model_validate(request)

    async def get_request_by_id(
        self,
        user: User,
        request_id: int,
    ) -> RequestWithStatusHistorySchema:
        """Get request by id.

        Args:
            request_id: Request ID.
            user: User.

        Returns:
            RequestWithStatusHistorySchema: Request information.

        Raises:
            ValueError: If request not found.

        """
        request = await self._request_dao.get_by_id(
            request_id=request_id,
        )
        if not request:
            raise AmbulanceRequestNotFoundException
        # User can see his own requests, or all if he is an admin
        if request.user_id != user.id and user.role != UserRole.ADMIN:
            raise AmbulanceRequestPermissionException
        # Get files and generate presigned URLs
        files = await self._file_dao.get_by_request_id(request_id=request_id)
        logger.info(
            'Found %s files for request %s. File details: %s',
            len(files),
            request_id,
            [
                {'id': f.id, 'request_id': f.request_id, 'filename': f.filename}
                for f in files
            ],
        )
        documents = []
        for file in files:
            try:
                download_url = self._s3_actions.get_presigned_url(
                    key=file.s3_key,
                    expires_in=3600,
                )
                documents.append(
                    RequestDocumentSchema(
                        id=file.id,
                        filename=file.filename,
                        file_size=file.file_size,
                        content_type=file.content_type,
                        download_url=download_url,
                    )
                )
            except Exception:
                logger.exception(
                    'Failed to generate presigned URL for file %s', file.id
                )
                documents.append(
                    RequestDocumentSchema(
                        id=file.id,
                        filename=file.filename,
                        file_size=file.file_size,
                        content_type=file.content_type,
                        download_url='',
                    )
                )

        response = RequestWithStatusHistorySchema.model_validate(request)
        response.documents = documents
        return response

    async def get_all_requests(
        self,
        user: User,
        cursor: int | None = None,
        limit: int = 20,
    ) -> tuple[list[AmbulanceRequestResponseSchema], int | None, bool]:
        """Get all requests for a user with pagination.

        Admin users see all requests in the system.
        Provider users see only their own requests.
        Status history is always included.

        Args:
            user: User object with role information.
            cursor: Cursor for pagination (request ID to start from).
            limit: Maximum number of items to return.

        Returns:
            tuple containing:
                - List of requests.
                - Next cursor (None if no more pages).
                - Whether there are more items available.

        """
        requests: list[AmbulanceRequest] = []
        match user.role:
            case UserRole.ADMIN:
                # Admin can see all requests
                requests = await self._request_dao.get_all(
                    cursor=cursor,
                    limit=limit,
                )
            case _:
                # Provider can see only their own requests
                requests = await self._request_dao.get_by_user_id(
                    user_id=user.id,
                    cursor=cursor,
                    limit=limit,
                )
        has_more = len(requests) > limit
        if has_more:
            requests = requests[:limit]
            next_cursor = requests[-1].id if requests else None
        else:
            next_cursor = None

        return (
            [
                AmbulanceRequestResponseSchema.model_validate(req)
                for req in requests
            ],
            next_cursor,
            has_more,
        )

    async def get_request_status_history(
        self,
        request_id: int,
    ) -> list[RequestStatusHistoryResponseSchema]:
        """Get status history for a request.

        Args:
            request_id: Request ID.

        Returns:
            list[RequestStatusHistoryResponseSchema]: Status history.

        """
        history = await self._status_history_dao.get_by_request_id(
            request_id=request_id
        )
        return [
            RequestStatusHistoryResponseSchema.model_validate(entry)
            for entry in history
        ]

    async def update_request_status(
        self,
        request_id: int,
        new_status: RequestStatus,
        notes: str | None = None,
    ) -> AmbulanceRequestResponseSchema:
        """Update the status of an existing ambulance request.

        Args:
            request_id (int): ID of the request to update.
            new_status (RequestStatus): New status value to apply.
            notes (str | None): Optional notes describing the status update.

        Returns:
            AmbulanceRequestResponseSchema: Updated request information.

        Raises:
            AmbulanceRequestNotFoundException: If the request does not exist.

        """
        request = await self._request_dao.get_by_id(request_id=request_id)
        if not request:
            raise AmbulanceRequestNotFoundException
        request.status = new_status
        await self._session.flush()
        await self._status_history_dao.create(
            request_id=request_id,
            status=new_status,
            notes=notes,
        )
        await self._session.flush()
        await self._session.commit()
        await self._session.refresh(request)

        return AmbulanceRequestResponseSchema.model_validate(request)
