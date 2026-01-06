"""Pydantic schemas for request and response validation."""

from .ai_extraction import (
    AIExtractionResponse,
    ExtractedTransportationData,
)
from .ambulance_request import (
    AmbulanceRequestResponseSchema,
    AmbulanceRequestsListResponseSchema,
    CreateAmbulanceRequestParseSchema,
    CreateAmbulanceRequestSchema,
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
    UpdateUserRequestSchema,
    UserListItemSchema,
    UserResponseShema,
    UsersListResponseSchema,
)

__all__ = [
    'AIExtractionResponse',
    'AmbulanceRequestResponseSchema',
    'AmbulanceRequestsListResponseSchema',
    'CreateAmbulanceRequestParseSchema',
    'CreateAmbulanceRequestSchema',
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
    'UpdateOrganizationRequestSchema',
    'UpdateUserRequestSchema',
    'UserListItemSchema',
    'UserResponseShema',
    'UsersListResponseSchema',
]

# Rebuild models to resolve forward references
UserResponseShema.model_rebuild()
