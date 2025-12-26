from typing import Annotated

from fastapi import APIRouter, Depends
from fastapi.params import Security

from core import exception_handler, get_service
from dependencies import get_current_user
from models import User
from schemas import DashboardResponseSchema
from services.dashboard_metrics import DashboardService

dashboard_router = APIRouter()


@dashboard_router.get(
    '/',
    description='Get dashboard_metrics data for current user.',
    response_model=DashboardResponseSchema,
)
@exception_handler
async def get_dashboard(
    user: Annotated[User, Security(get_current_user)],
    service: Annotated[
        DashboardService,
        Depends(get_service(DashboardService)),
    ],
) -> DashboardResponseSchema:
    """Return dashboard_metrics data for the current user.

    Provider users receive provider-specific dashboard_metrics data,
    admin users receive admin-specific dashboard_metrics data.
    """
    return await service.get_dashboard_for_user(user=user)
