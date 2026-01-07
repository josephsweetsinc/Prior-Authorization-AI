import logging
from typing import Annotated

from fastapi import APIRouter, Depends, File, Query, UploadFile
from fastapi.params import Security

from core import exception_handler, get_service, timing_handler
from dependencies import get_current_user, get_provider_user_from_token
from models import RequestStatus, User, UserRole
from schemas.ambulance_request import (
    AdminRequestWithStatusHistorySchema,
    AdminUpdateRequestSchema,
    AmbulanceRequestResponseSchema,
    AmbulanceRequestsListResponseSchema,
    ApproveRequestSchema,
    CreateAmbulanceRequestParseSchema,
    CreateAmbulanceRequestSchema,
    DenyRequestSchema,
    FileUploadResponseSchema,
    FileUploadWithExtractionResponseSchema,
    RequestWithStatusHistorySchema,
)
from services import AmbulanceRequestService

logger = logging.getLogger(__name__)

ambulance_request_router = APIRouter()


@ambulance_request_router.post(
    '/files',
    description='Upload medical documents from user.',
    summary='Upload medical documents.',
    response_model=list[FileUploadResponseSchema],
)
@timing_handler
@exception_handler
async def upload_files(
    files: Annotated[list[UploadFile], File()],
    user: Annotated[User, Security(get_provider_user_from_token)],
    service: Annotated[
        AmbulanceRequestService, Depends(get_service(AmbulanceRequestService))
    ],
) -> list[FileUploadResponseSchema]:
    """Upload medical document files to S3.

    This endpoint:
    1. Uploads files to S3
    2. Creates file records in database
    3. Returns uploaded files info

    Args:
        files: List of files (PDF, DOC, DOCX, XLS, XLSX, max 10MB each).
        user: Current authenticated user.
        service: Ambulance request service.

    Returns:
        list[FileUploadResponseSchema]: List of uploaded files info.

    Raises:
        HTTPException: If file upload fails.

    """
    return await service.upload_files(files=files, user_id=user.id)


@ambulance_request_router.post(
    '/extraction',
    description='Step 2: Parse medical documents and get info from AI.',
    summary='Get info from documents by AI.',
    response_model=FileUploadWithExtractionResponseSchema,
)
@timing_handler
@exception_handler
async def create_request_with_extraction(
    request_data: CreateAmbulanceRequestParseSchema,
    user: Annotated[User, Security(get_provider_user_from_token)],
    service: Annotated[
        AmbulanceRequestService, Depends(get_service(AmbulanceRequestService))
    ],
) -> FileUploadWithExtractionResponseSchema:
    """Triggers AI extraction of medical data and creates draft request.

    This endpoint acts as the second step in the request workflow.
    It takes a list of file IDs (uploaded in Step 1), validates them, and
    sends the documents to an AI service to parse medical details.
    A draft request is created with status DRAFT and its ID is returned.

    Args:
        request_data (CreateAmbulanceRequestParseSchema): The input payload
            containing the list of file IDs to be analyzed.
        user (User): The currently authenticated provider user.
        service (AmbulanceRequestService): The injected service instance.

    Returns:
        FileUploadWithExtractionResponseSchema: The structured data
            extracted from the medical documents and the created request ID.

    """
    return await service.create_request_with_extraction(
        request_data=request_data, user_id=user.id
    )


@ambulance_request_router.post(
    '/create',
    description='Create ambulance request with info verified by provider.',
    summary='Create ambulance request.',
    response_model=AmbulanceRequestResponseSchema,
)
@exception_handler
async def create_request(
    request_data: CreateAmbulanceRequestSchema,
    user: Annotated[User, Security(get_provider_user_from_token)],
    service: Annotated[
        AmbulanceRequestService, Depends(get_service(AmbulanceRequestService))
    ],
) -> AmbulanceRequestResponseSchema:
    """Update draft request and submit it.

    This endpoint updates an existing draft request with verified data
    and changes its status to SUBMITTED.

    Args:
        request_data: Request data with request_id and verified information.
        user: Current authenticated user.
        service: Ambulance request service.

    Returns:
        AmbulanceRequestResponseSchema: Updated and submitted request.

    Raises:
        HTTPException: If request update fails.

    """
    return await service.create_request(
        user_id=user.id, request_data=request_data
    )


@ambulance_request_router.get(
    '/{request_id}',
    description='Get ambulance request by ID',
    response_model=RequestWithStatusHistorySchema
    | AdminRequestWithStatusHistorySchema,
)
@exception_handler
async def get_request(
    request_id: int,
    user: Annotated[User, Security(get_current_user)],
    service: Annotated[
        AmbulanceRequestService, Depends(get_service(AmbulanceRequestService))
    ],
) -> RequestWithStatusHistorySchema | AdminRequestWithStatusHistorySchema:
    """Get ambulance request by ID with status history.

    Args:
        request_id: Request ID.
        user: Current authenticated user.
        service: Ambulance request service.

    Returns:
        RequestWithStatusHistorySchema: Request with status history.

    Raises:
        HTTPException: If request not found or access denied.

    """
    return await service.get_request_by_id(
        request_id=request_id,
        user=user,
    )


@ambulance_request_router.get(
    '/',
    description='Get all ambulance requests with pagination',
    response_model=AmbulanceRequestsListResponseSchema,
)
@exception_handler
async def get_user_requests(
    user: Annotated[User, Security(get_current_user)],
    service: Annotated[
        AmbulanceRequestService, Depends(get_service(AmbulanceRequestService))
    ],
    page: int = Query(
        1,
        ge=1,
        description='Page number (1-based)',
        examples=[1],
    ),
    search: str | None = Query(
        None,
        description='Search by patient first name, last name, or patient ID',
        examples=['John'],
    ),
    status: str | None = Query(
        None,
        description='Filter by request status',
        examples=['pending'],
    ),
    days: int | None = Query(
        None,
        description='Filter by number of days (0=today, 7, 30, 90, 365)',
        examples=[7],
    ),
) -> AmbulanceRequestsListResponseSchema:
    """Get all ambulance requests with pagination.

    Admin users see all requests in the system.
    Provider users see only their own requests.
    Status history is always included.

    Args:
        page: Page number (1-based).
        search: Search term for patient name or ID.
        status: Request status to filter by.
        days: Number of days to filter by (0=today, 7, 30, 90, 365).
        user: Current authenticated user.
        service: Ambulance request service.

    Returns:
        AmbulanceRequestsListResponseSchema: Paginated list of requests.

    """
    status_enum: RequestStatus | None = None
    if status:
        try:
            status_enum = RequestStatus(status.lower())
        except ValueError:
            status_enum = None

    (
        items,
        total,
        current_page,
        total_pages,
        showing,
    ) = await service.get_all_requests(
        user=user,
        page=page,
        limit=8,
        search=search,
        status=status_enum,
        days=days,
    )
    return AmbulanceRequestsListResponseSchema(
        items=items,
        page=current_page,
        total=total,
        showing=showing,
        total_pages=total_pages,
    )


@ambulance_request_router.post(
    '/{request_id}/approve',
    description='Approve an ambulance request (admin only)',
    summary='Approve request',
    response_model=AmbulanceRequestResponseSchema,
)
@exception_handler
async def approve_request(
    request_id: int,
    request_data: ApproveRequestSchema,
    user: Annotated[User, Security(get_current_user)],
    service: Annotated[
        AmbulanceRequestService, Depends(get_service(AmbulanceRequestService))
    ],
) -> AmbulanceRequestResponseSchema:
    """Approve an ambulance request.

    Only admin users can approve requests.

    Args:
        request_id: Request ID to approve.
        request_data: Approval data (empty schema).
        user: Current authenticated user (must be admin).
        service: Ambulance request service.

    Returns:
        AmbulanceRequestResponseSchema: Approved request.

    Raises:
        HTTPException: If user is not admin, request not found, or approval fails.

    """
    if user.role != UserRole.ADMIN:
        from fastapi import HTTPException, status

        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail='Only admin users can approve requests',
        )
    return await service.approve_request(
        request_id=request_id,
        reviewer_id=user.id,
    )


@ambulance_request_router.post(
    '/{request_id}/deny',
    description='Deny an ambulance request (admin only)',
    summary='Deny request',
    response_model=AmbulanceRequestResponseSchema,
)
@exception_handler
async def deny_request(
    request_id: int,
    request_data: DenyRequestSchema,
    user: Annotated[User, Security(get_current_user)],
    service: Annotated[
        AmbulanceRequestService, Depends(get_service(AmbulanceRequestService))
    ],
) -> AmbulanceRequestResponseSchema:
    """Deny an ambulance request.

    Only admin users can deny requests.
    If denial_reason is OTHER_REASON, denial_notes is required.

    Args:
        request_id: Request ID to deny.
        request_data: Denial data with reason and optional notes.
        user: Current authenticated user (must be admin).
        service: Ambulance request service.

    Returns:
        AmbulanceRequestResponseSchema: Denied request.

    Raises:
        HTTPException: If user is not admin, request not found, or denial fails.

    """
    if user.role != UserRole.ADMIN:
        from fastapi import HTTPException, status

        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail='Only admin users can deny requests',
        )
    return await service.deny_request(
        request_id=request_id,
        reviewer_id=user.id,
        denial_reason=request_data.denial_reason,
        denial_notes=request_data.denial_notes,
    )


@ambulance_request_router.patch(
    '/{request_id}',
    description='Update ambulance request fields (admin only)',
    summary='Update request by admin',
    response_model=AdminRequestWithStatusHistorySchema,
)
@exception_handler
async def update_request_by_admin(
    request_id: int,
    update_data: AdminUpdateRequestSchema,
    user: Annotated[User, Security(get_current_user)],
    service: Annotated[
        AmbulanceRequestService, Depends(get_service(AmbulanceRequestService))
    ],
) -> AdminRequestWithStatusHistorySchema:
    """Update ambulance request fields by admin.

    Admin can update all fields except ai_accuracy and status.
    Only admin users can update requests.

    Args:
        request_id: Request ID to update.
        update_data: Data to update (all fields optional).
        user: Current authenticated user (must be admin).
        service: Ambulance request service.

    Returns:
        AdminRequestWithStatusHistorySchema: Updated request with all fields.

    Raises:
        HTTPException: If user is not admin, request not found, or update fails.

    """
    if user.role != UserRole.ADMIN:
        from fastapi import HTTPException, status

        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail='Only admin users can update requests',
        )
    return await service.update_request_by_admin(
        request_id=request_id,
        update_data=update_data,
    )
