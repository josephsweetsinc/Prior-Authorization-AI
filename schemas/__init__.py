"""Pydantic schemas for request and response validation."""

from .ai_extraction import (
    AIExtractionResponse,
    ExtractedTransportationData,
)
from .ambulance_request import (
    AmbulanceRequestResponseSchema,
    AmbulanceRequestsListResponseSchema,
    ApproveRequestSchema,
    CreateAmbulanceRequestParseSchema,
    CreateAmbulanceRequestSchema,
    DenyRequestSchema,
    FileUploadResponseSchema,
    FileUploadWithExtractionResponseSchema,
    RequestDocumentSchema,
    RequestStatusHistoryResponseSchema,
    RequestWithStatusHistorySchema,
)
from .auth import (
    PasswordChangeRequestSchema,
    PasswordResetConfirmSchema,
    PasswordResetRequestSchema,
    PasswordResetVerifySchema,
    RefreshTokenRequestSchema,
    TokenSchemas,
)
from .dasboard import DashboardResponseSchema
from .main import HealthCheckResponseSchema
from .organization import (
    OrganizationResponseSchema,
    UpdateOrganizationRequestSchema,
)
from .user import (
    CreateUserByAdminRequestSchema,
    CreateUserRequestSchema,
    UpdateMeRequestSchema,
    UpdateUserRequestSchema,
    UserListItemSchema,
    UserResponseShema,
    UsersListResponseSchema,
)

__all__ = [
    'AIExtractionResponse',
    'AmbulanceRequestResponseSchema',
    'AmbulanceRequestsListResponseSchema',
    'ApproveRequestSchema',
    'CreateAmbulanceRequestParseSchema',
    'CreateAmbulanceRequestSchema',
    'DenyRequestSchema',
    'CreateUserByAdminRequestSchema',
    'CreateUserRequestSchema',
    'DashboardResponseSchema',
    'ExtractedTransportationData',
    'FileUploadResponseSchema',
    'FileUploadWithExtractionResponseSchema',
    'HealthCheckResponseSchema',
    'OrganizationResponseSchema',
    'PasswordChangeRequestSchema',
    'PasswordResetConfirmSchema',
    'PasswordResetRequestSchema',
    'PasswordResetVerifySchema',
    'RefreshTokenRequestSchema',
    'RequestDocumentSchema',
    'RequestStatusHistoryResponseSchema',
    'RequestWithStatusHistorySchema',
    'TokenSchemas',
    'UpdateMeRequestSchema',
    'UpdateOrganizationRequestSchema',
    'UpdateUserRequestSchema',
    'UserListItemSchema',
    'UserResponseShema',
    'UsersListResponseSchema',
]

# Rebuild models to resolve forward references
UserResponseShema.model_rebuild()
