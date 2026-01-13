"""Service for statistics endpoints."""

from sqlalchemy.ext.asyncio import AsyncSession

from core import BaseService
from dao import DashboardDAO, UserDAO
from exceptions import UserNotFoundByIdException
from models.ambulance_request import RequestStatus
from schemas.stats import (
    AdminUserItemSchema,
    AdminUsersResponseSchema,
    ProviderStatsResponseSchema,
)


class StatsService(BaseService):
    """Service for statistics operations."""

    def __init__(
        self,
        db_session: AsyncSession,
        *,
        dashboard_dao: DashboardDAO | None = None,
        user_dao: UserDAO | None = None,
    ) -> None:
        """Initialize StatsService."""
        super().__init__(db_session)
        self._dashboard_dao = dashboard_dao or DashboardDAO(db_session)
        self._user_dao = user_dao or UserDAO(db_session)

    async def get_provider_stats(
        self,
        user_id: int,
    ) -> ProviderStatsResponseSchema:
        """Get statistics for provider user.

        Args:
            user_id: ID of the provider user.

        Returns:
            ProviderStatsResponseSchema: Statistics for the provider.

        """
        counts = await self._dashboard_dao.get_request_counts_by_status(
            user_id=user_id
        )

        approved = counts.get(RequestStatus.APPROVED, 0)
        submitted = counts.get(RequestStatus.SUBMITTED, 0)
        rejected = counts.get(RequestStatus.DENIED, 0)
        # Total requests = only APPROVED + SUBMITTED + DENIED
        total_requests = approved + submitted + rejected

        return ProviderStatsResponseSchema(
            total_requests=total_requests,
            approved=approved,
            submitted=submitted,
            rejected=rejected,
        )

    async def get_admin_users(
        self,
        admin_user_id: int,
    ) -> AdminUsersResponseSchema:
        """Get admin users information.

        Args:
            admin_user_id: ID of the current admin user.

        Returns:
            AdminUsersResponseSchema: Admin users information.

        """
        # Get current admin user
        current_admin = await self._user_dao.get_by_id(admin_user_id)
        if not current_admin:
            raise UserNotFoundByIdException

        # Get recent admins (we get 4 to ensure we have 3 after filtering)
        recent_admins = await self._user_dao.get_recent_admins(limit=4)
        # Filter out current admin from the list and take first 3
        recent_admins_filtered = [
            admin for admin in recent_admins if admin.id != admin_user_id
        ][:3]

        return AdminUsersResponseSchema(
            full_name=f'{current_admin.name} {current_admin.surname}',
            email=current_admin.email,
            recent_admins=[
                AdminUserItemSchema(
                    full_name=f'{admin.name} {admin.surname}',
                    email=admin.email,
                )
                for admin in recent_admins_filtered
            ],
        )
