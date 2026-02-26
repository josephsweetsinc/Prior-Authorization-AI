from datetime import date

from sqlalchemy import func, select

from core.dao import BaseDAO
from models.ambulance_request import (
    AmbulanceRequest,
    RequestStatus,
    RequestStatusHistory,
)


class DashboardDAO(BaseDAO):
    """DAO with aggregated queries for dashboard_metrics metrics."""

    async def get_average_ai_accuracy(self) -> float:
        """Get average AI accuracy across all requests that used AI."""
        stmt = select(func.avg(AmbulanceRequest.ai_accuracy)).where(
            AmbulanceRequest.is_active.is_(True),
            AmbulanceRequest.deleted_at.is_(None),
            AmbulanceRequest.ai_accuracy.is_not(None),
        )
        result = await self._session.execute(stmt)
        avg_value = result.scalar_one()
        if avg_value is None:
            return 0.0
        return round(float(avg_value), 1)

    async def get_request_counts_by_status(
        self,
        *,
        user_id: int | None = None,
    ) -> dict[RequestStatus, int]:
        """Get request counts grouped by status.

        Args:
            user_id: Optional user ID to filter requests by creator.

        Returns:
            Mapping from RequestStatus to number of requests.

        """
        stmt = (
            select(
                AmbulanceRequest.status,
                func.count(AmbulanceRequest.id),
            )
            .where(AmbulanceRequest.is_active == True)  # noqa: E712
            .group_by(AmbulanceRequest.status)
        )
        if user_id is not None:
            stmt = stmt.where(AmbulanceRequest.user_id == user_id)

        result = await self._session.execute(stmt)
        rows = result.all()
        return dict(tuple(row) for row in rows)

    async def get_recent_requests(
        self,
        *,
        limit: int,
        user_id: int | None = None,
    ) -> list[AmbulanceRequest]:
        """Get most recent ambulance requests.

        Args:
            limit: Maximum number of requests to return.
            user_id: Optional user ID to filter by creator.
                If None (admin view), DRAFT requests are excluded.

        Returns:
            List of recent AmbulanceRequest instances.

        """
        stmt = select(AmbulanceRequest).where(
            AmbulanceRequest.is_active == True  # noqa: E712
        )
        if user_id is not None:
            stmt = stmt.where(AmbulanceRequest.user_id == user_id)
        else:
            # Admin view: exclude DRAFT requests
            stmt = stmt.where(AmbulanceRequest.status != RequestStatus.DRAFT)

        stmt = stmt.order_by(
            AmbulanceRequest.created_at.desc(),
            AmbulanceRequest.id.desc(),
        ).limit(limit)

        result = await self._session.execute(stmt)
        return list(result.scalars().all())

    async def get_daily_submitted_counts(
        self,
        *,
        user_id: int,
        start_date: date,
        end_date: date,
    ) -> dict[date, int]:
        """Get number of submitted requests per day for a provider.

        Args:
            user_id: Provider user ID.
            start_date: Inclusive start date.
            end_date: Inclusive end date.

        Returns:
            Mapping from date to number of created requests.

        """
        day_column = func.date(AmbulanceRequest.created_at)
        stmt = (
            select(
                day_column.label('day'),
                func.count(AmbulanceRequest.id),
            )
            .where(
                AmbulanceRequest.is_active == True,  # noqa: E712
                AmbulanceRequest.user_id == user_id,
                day_column >= start_date,
                day_column <= end_date,
            )
            .group_by('day')
        )
        result = await self._session.execute(stmt)
        rows = result.all()
        return dict(tuple(row) for row in rows)

    async def get_approved_counts_by_day(
        self,
        *,
        start_date: date,
        end_date: date,
    ) -> dict[date, int]:
        """Get number of approvals per day based on status history.

        Args:
            start_date: Inclusive start date.
            end_date: Inclusive end date.

        Returns:
            Mapping from date to count of approved statuses.

        """
        day_column = func.date(RequestStatusHistory.created_at)
        stmt = (
            select(
                day_column.label('day'),
                func.count(RequestStatusHistory.id),
            )
            .where(
                RequestStatusHistory.status == RequestStatus.APPROVED,
                day_column >= start_date,
                day_column <= end_date,
            )
            .group_by('day')
        )
        result = await self._session.execute(stmt)
        rows = result.all()
        return dict(tuple(row) for row in rows)

    async def get_approved_count_in_period(
        self,
        *,
        period_start: date,
        period_end: date,
    ) -> int:
        """Get number of approvals in a given calendar date range.

        Args:
            period_start: Inclusive start date.
            period_end: Inclusive end date.

        Returns:
            Count of approvals in the period.

        """
        day_column = func.date(RequestStatusHistory.created_at)
        stmt = select(func.count(RequestStatusHistory.id)).where(
            RequestStatusHistory.status == RequestStatus.APPROVED,
            day_column >= period_start,
            day_column <= period_end,
        )
        result = await self._session.execute(stmt)
        return int(result.scalar_one() or 0)

    async def get_pending_wait_durations(self) -> list[float]:
        """Get wait durations in seconds for PENDING statuses until next change.

        Returns:
            List of durations in seconds for each PENDING -> next-status event.

        """
        stmt = (
            select(RequestStatusHistory)
            .join(
                AmbulanceRequest,
                RequestStatusHistory.request_id == AmbulanceRequest.id,
            )
            .where(
                AmbulanceRequest.is_active == True,  # noqa: E712
            )
        )
        result = await self._session.execute(stmt)
        histories: list[RequestStatusHistory] = list(result.scalars().all())

        durations: list[float] = []
        by_request: dict[int, list[RequestStatusHistory]] = {}
        for history in histories:
            by_request.setdefault(history.request_id, []).append(history)

        for entries in by_request.values():
            sorted_entries = sorted(
                entries,
                key=lambda h: h.created_at,
            )
            for idx, entry in enumerate(sorted_entries):
                if entry.status != RequestStatus.PENDING:
                    continue
                if idx + 1 >= len(sorted_entries):
                    continue
                next_entry = sorted_entries[idx + 1]
                delta = next_entry.created_at - entry.created_at
                durations.append(delta.total_seconds())
        return durations

    async def get_recent_status_history(
        self,
        *,
        limit: int,
    ) -> list[RequestStatusHistory]:
        """Get most recent status history entries across all requests.

        Args:
            limit: Maximum number of entries to return.

        Returns:
            List of recent RequestStatusHistory records.

        """
        stmt = (
            select(RequestStatusHistory)
            .order_by(
                RequestStatusHistory.created_at.desc(),
                RequestStatusHistory.id.desc(),
            )
            .limit(limit)
        )
        result = await self._session.execute(stmt)
        return list(result.scalars().all())

    async def get_in_progress_requests(
        self,
        *,
        user_id: int,
    ) -> list[AmbulanceRequest]:
        """Get all in-progress requests (PENDING + SUBMITTED) for a provider.

        Args:
            user_id: Provider user ID.

        Returns:
            List of AmbulanceRequest instances in PENDING or SUBMITTED status.

        """
        stmt = (
            select(AmbulanceRequest)
            .where(
                AmbulanceRequest.is_active == True,  # noqa: E712
                AmbulanceRequest.user_id == user_id,
                AmbulanceRequest.status.in_(
                    [RequestStatus.PENDING, RequestStatus.SUBMITTED]
                ),
            )
            .order_by(
                AmbulanceRequest.created_at.desc(),
                AmbulanceRequest.id.desc(),
            )
        )
        result = await self._session.execute(stmt)
        return list(result.scalars().all())
