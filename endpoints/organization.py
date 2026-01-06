import logging
from typing import Annotated

from fastapi import APIRouter, Depends

from core import exception_handler, get_service
from dependencies import get_provider_user_from_token
from models import User
from schemas import (
    OrganizationResponseSchema,
    UpdateOrganizationRequestSchema,
)
from services import OrganizationService

logger = logging.getLogger(__name__)


organization_router = APIRouter()


@organization_router.patch(
    path='/me',
    summary='Update current user organization',
    description=(
        "Update the current authenticated provider's organization information. "
        'At least one field (provider_type, professional_id, or medic_name).'
    ),
    response_model=OrganizationResponseSchema,
    tags=['organization'],
)
@exception_handler
async def update_my_organization(
    organization_data: UpdateOrganizationRequestSchema,
    current_user: Annotated[User, Depends(get_provider_user_from_token)],
    service: Annotated[
        OrganizationService, Depends(get_service(OrganizationService))
    ],
) -> OrganizationResponseSchema:
    """Update the current authenticated provider's organization.

    Args:
        organization_data: Schema with organization data to update.
        current_user: Current authenticated provider user from token.
        service: Organization service.

    Returns:
        OrganizationResponseSchema: Schema representing the update organization.

    """
    return await service.update_organization_by_user_id(
        user_id=current_user.id,
        organization_data=organization_data,
    )
