"""Pydantic schemas for request and response validation."""

from .ai_extraction import (
    AIExtractionResponse,
    ExtractedTransportationData,
)
from .ambulance_request import (
    AdminRequestWithStatusHistorySchema,
    AdminUpdateRequestSchema,
    AmbulanceRequestResponseSchema,
    AmbulanceRequestsListResponseSchema,
    ApproveRequestSchema,
    CompletionStatus,
    CompletionStatusItem,
    CompletionStatusSchema,
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
from .notification import (
    NotificationResponseSchema,
    NotificationsListResponseSchema,
)
from .organization import (
    OrganizationResponseSchema,
    UpdateOrganizationRequestSchema,
)
from .stats import (
    AdminUserItemSchema,
    AdminUsersResponseSchema,
    ProviderStatsResponseSchema,
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
from .websocket import WebSocketInfoResponse

__all__ = [
    'AIExtractionResponse',
    'AdminRequestWithStatusHistorySchema',
    'AdminUpdateRequestSchema',
    'AdminUserItemSchema',
    'AdminUsersResponseSchema',
    'AmbulanceRequestResponseSchema',
    'AmbulanceRequestsListResponseSchema',
    'ApproveRequestSchema',
    'CompletionStatus',
    'CompletionStatusItem',
    'CompletionStatusSchema',
    'CreateAmbulanceRequestParseSchema',
    'CreateAmbulanceRequestSchema',
    'CreateUserByAdminRequestSchema',
    'CreateUserRequestSchema',
    'DashboardResponseSchema',
    'DenyRequestSchema',
    'ExtractedTransportationData',
    'FileUploadResponseSchema',
    'FileUploadWithExtractionResponseSchema',
    'HealthCheckResponseSchema',
    'NotificationResponseSchema',
    'NotificationsListResponseSchema',
    'OrganizationResponseSchema',
    'PasswordChangeRequestSchema',
    'PasswordResetConfirmSchema',
    'PasswordResetRequestSchema',
    'PasswordResetVerifySchema',
    'ProviderStatsResponseSchema',
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
    'WebSocketInfoResponse',
]

# Rebuild models to resolve forward references
UserResponseShema.model_rebuild()
