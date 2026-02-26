from datetime import UTC, datetime, timedelta
from math import ceil

from sqlalchemy.ext.asyncio import AsyncSession

from core import BaseService
from dao import DashboardDAO
from dto import RequestCountDTO
from models import User
from models.ambulance_request import RequestStatus
from models.user import UserRole
from schemas.dasboard import (
    AdminDashboardDataSchema,
    AdminRequestsStatusesResponseSchema,
    DailySubmittedItemSchema,
    DailySubmittedRequestsSchema,
    DashboardResponseSchema,
    ProcessingTimeDistributionItemSchema,
    ProviderDashboardDataSchema,
    ProviderSummaryStatsSchema,
    RecentActivityItemSchema,
    RecentRequestItemSchema,
    RequestProgressItemSchema,
    RequestsProgressSchema,
    StatusDistributionItemSchema,
)
from services.dashboard_metrics.metrics_calculator import (
    DashboardMetricsCalculator,
)


class DashboardService(BaseService):
    """Service layer for building provider and admin dashboards."""

    def __init__(
        self,
        db_session: AsyncSession,
        *,
        dashboard_dao: DashboardDAO | None = None,
    ) -> None:
        """Initialize DashboardService."""
        super().__init__(db_session)
        self._dashboard_dao = dashboard_dao or DashboardDAO(db_session)

    async def get_dashboard_for_user(
        self, user: User
    ) -> DashboardResponseSchema:
        """Return dashboard_metrics data depending on user role."""
        if user.role == UserRole.ADMIN:
            admin_data = await self._build_admin_dashboard()
            return DashboardResponseSchema(admin=admin_data)

        # Default to provider dashboard_metrics for all non-admin roles.
        provider_data = await self._build_provider_dashboard(user_id=user.id)
        return DashboardResponseSchema(provider=provider_data)

    async def _build_provider_dashboard(
        self,
        *,
        user_id: int,
    ) -> ProviderDashboardDataSchema:
        """Build dashboard_metrics data for provider user."""
        counts: dict[
            RequestStatus, int
        ] = await self._dashboard_dao.get_request_counts_by_status(
            user_id=user_id,
        )
        requests_count: RequestCountDTO = RequestCountDTO(
            approved_all=counts.get(RequestStatus.APPROVED, 0),
            pending_all=counts.get(RequestStatus.SUBMITTED, 0),
            denied_all=counts.get(RequestStatus.DENIED, 0),
        )
        approval_rate = DashboardMetricsCalculator.calculate_approval_rate(
            approved=requests_count.approved_all,
            denied=requests_count.denied_all,
        )
        summary = ProviderSummaryStatsSchema(
            total_requests=requests_count.total_requests,
            pending_review=requests_count.pending_all,
            approved=requests_count.approved_all,
            approval_rate=approval_rate,
        )
        recent_requests_models = await self._dashboard_dao.get_recent_requests(
            limit=5,
            user_id=user_id,
        )
        recent_requests = [
            RecentRequestItemSchema(
                id=request.id,
                patient_id=request.patient_id,
                patient_full_name=request.patient_full_name,
                diagnosis=request.primary_diagnosis,
                status=request.status,
                created_at=request.created_at,
            )
            for request in recent_requests_models
        ]

        # Get in-progress requests (PENDING + PROCESSING) for provider
        in_progress_requests = (
            await self._dashboard_dao.get_in_progress_requests(
                user_id=user_id,
            )
        )

        progress_items = [
            RequestProgressItemSchema(
                full_name=request.patient_full_name,
                status=request.status,
                progress=0.0,  # TODO: implement progress calculation
            )
            for request in in_progress_requests
        ]

        requests_in_progress = RequestsProgressSchema(items=progress_items)
        today = datetime.now(tz=UTC).date()
        (
            current_start,
            current_end,
            previous_start,
            previous_end,
        ) = DashboardMetricsCalculator.get_daily_period_boundaries(
            reference_date=today,
            days=8,
        )

        daily_counts = await self._dashboard_dao.get_daily_submitted_counts(
            user_id=user_id,
            start_date=current_start,
            end_date=current_end,
        )

        days: list[DailySubmittedItemSchema] = []
        total_period_requests = 0
        for offset in range(7, -1, -1):
            current_day = today - timedelta(days=offset)
            count = daily_counts.get(current_day, 0)
            total_period_requests += count
            days.append(
                DailySubmittedItemSchema(
                    date=current_day,
                    count=count,
                )
            )

        previous_counts = await self._dashboard_dao.get_daily_submitted_counts(
            user_id=user_id,
            start_date=previous_start,
            end_date=previous_end,
        )
        total_previous_requests = sum(previous_counts.values())

        change_percent = DashboardMetricsCalculator.calculate_percentage_change(
            current_value=total_period_requests,
            previous_value=total_previous_requests,
        )

        daily_submitted = DailySubmittedRequestsSchema(
            total=total_period_requests,
            change_percent=change_percent,
            days=days,
        )

        return ProviderDashboardDataSchema(
            summary=summary,
            recent_requests=recent_requests,
            requests_in_progress=requests_in_progress,
            daily_submitted_requests=daily_submitted,
        )

    async def _build_admin_dashboard(self) -> AdminDashboardDataSchema:
        """Build dashboard_metrics data for admin user."""
        counts: dict[
            RequestStatus, int
        ] = await self._dashboard_dao.get_request_counts_by_status()
        requests_count: RequestCountDTO = RequestCountDTO(
            approved_all=counts.get(RequestStatus.APPROVED, 0),
            pending_all=counts.get(RequestStatus.SUBMITTED, 0),
            denied_all=counts.get(RequestStatus.DENIED, 0),
        )
        today = datetime.now(tz=UTC).date()
        (
            last_month_start,
            last_month_end,
            prev_month_start,
            prev_month_end,
        ) = DashboardMetricsCalculator.get_month_boundaries(
            reference_date=today
        )

        approved_last_month = (
            await self._dashboard_dao.get_approved_count_in_period(
                period_start=last_month_start,
                period_end=last_month_end,
            )
        )
        approved_prev_month = (
            await self._dashboard_dao.get_approved_count_in_period(
                period_start=prev_month_start,
                period_end=prev_month_end,
            )
        )

        approved_change_percent = (
            DashboardMetricsCalculator.calculate_percentage_change(
                current_value=approved_last_month,
                previous_value=approved_prev_month,
            )
        )

        pending_durations_seconds = (
            await self._dashboard_dao.get_pending_wait_durations()
        )
        avg_pending_hours = (
            DashboardMetricsCalculator.calculate_average_wait_time_hours(
                wait_durations_seconds=pending_durations_seconds,
            )
        )

        denial_rate = DashboardMetricsCalculator.calculate_denial_rate(
            approved=requests_count.approved_all,
            denied=requests_count.denied_all,
        )

        ai_accuracy_avg = await self._dashboard_dao.get_average_ai_accuracy()
        ai_accuracy_percent = int(ceil(ai_accuracy_avg))

        requests_statuses = AdminRequestsStatusesResponseSchema(
            approved_requests=requests_count.approved_all,
            approved_requests_change_percent=approved_change_percent,
            pending_review=requests_count.pending_all,
            pending_avg_wait_time_hours=avg_pending_hours,
            denied_requests=requests_count.denied_all,
            denial_rate_percent=denial_rate,
            ai_accuracy=ai_accuracy_percent,
        )

        # Processing distribution: number of approvals per day over 10 days.
        dist_end = today
        dist_start = today - timedelta(days=9)
        approved_by_day = await self._dashboard_dao.get_approved_counts_by_day(
            start_date=dist_start,
            end_date=dist_end,
        )
        processing_distribution: list[ProcessingTimeDistributionItemSchema] = []
        for offset in range(9, -1, -1):
            current_day = today - timedelta(days=offset)
            count = approved_by_day.get(current_day, 0)
            processing_distribution.append(
                ProcessingTimeDistributionItemSchema(
                    date=current_day,
                    approved_count=count,
                )
            )

        # Requests by status distribution (APPROVED, SUBMITTED, DENIED only).
        distribution_statuses = [
            (RequestStatus.APPROVED, requests_count.approved_all),
            (RequestStatus.SUBMITTED, requests_count.pending_all),
            (RequestStatus.DENIED, requests_count.denied_all),
        ]
        distribution_with_percentages = DashboardMetricsCalculator.calculate_status_distribution_percentages(  # noqa: E501
            status_counts=distribution_statuses,
        )
        requests_by_status = [
            StatusDistributionItemSchema(
                status=status,
                count=count,
                percentage=percentage,
            )
            for status, count, percentage in distribution_with_percentages
        ]

        recent_requests_models = await self._dashboard_dao.get_recent_requests(
            limit=5,
            user_id=None,
        )
        recent_requests = [
            RecentRequestItemSchema(
                id=request.id,
                patient_id=request.patient_id,
                patient_full_name=request.patient_full_name,
                diagnosis=request.primary_diagnosis,
                status=request.status,
                created_at=request.created_at.replace(tzinfo=UTC)
                if request.created_at.tzinfo is None
                else request.created_at,
            )
            for request in recent_requests_models
        ]

        recent_history = await self._dashboard_dao.get_recent_status_history(
            limit=3
        )
        recent_activity: list[RecentActivityItemSchema] = [
            RecentActivityItemSchema(
                request_id=history.request_id,
                status=history.status,
                author_name='TODO',  # TODO: resolve real author.
                created_at=history.created_at.replace(tzinfo=UTC)
                if history.created_at.tzinfo is None
                else history.created_at,
            )
            for history in recent_history
        ]

        # Denial reasons are currently a stub, will be implemented later.
        denial_reasons = []  # type: ignore

        return AdminDashboardDataSchema(
            requests_statuses=requests_statuses,
            processing_time_distribution=processing_distribution,
            requests_by_status=requests_by_status,
            recent_requests=recent_requests,
            recent_activity=recent_activity,
            denial_reasons=denial_reasons,
        )
