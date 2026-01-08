"""Endpoints for statistics."""

from typing import Annotated

from fastapi import APIRouter, Depends
from fastapi.params import Security

from core import exception_handler, get_service
from dependencies import get_admin_user_from_token, get_provider_user_from_token
from models import User
from schemas.stats import AdminUsersResponseSchema, ProviderStatsResponseSchema
from services.stats import StatsService

stats_router = APIRouter()


@stats_router.get(
    '/provider',
    description='Get statistics for provider user',
    summary='Get provider statistics',
    response_model=ProviderStatsResponseSchema,
)
@exception_handler
async def get_provider_stats(
    user: Annotated[User, Security(get_provider_user_from_token)],
    service: Annotated[StatsService, Depends(get_service(StatsService))],
) -> ProviderStatsResponseSchema:
    """Get statistics for the current provider user.

    Returns:
        ProviderStatsResponseSchema: Statistics including total_requests,
            approved, submitted, and rejected counts.

    """
    return await service.get_provider_stats(user_id=user.id)


@stats_router.get(
    '/admin/users',
    description='Get admin users information',
    summary='Get admin users',
    response_model=AdminUsersResponseSchema,
)
@exception_handler
async def get_admin_users(
    user: Annotated[User, Security(get_admin_user_from_token)],
    service: Annotated[StatsService, Depends(get_service(StatsService))],
) -> AdminUsersResponseSchema:
    """Get admin users information including recent admins.

    Returns:
        AdminUsersResponseSchema: Current admin info and list of 3 most
            recently registered admin users.

    """
    return await service.get_admin_users(admin_user_id=user.id)
