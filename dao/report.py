from datetime import date

from sqlalchemy import select
from sqlalchemy.orm import selectinload

from core.dao import BaseDAO
from models.report import Report


class ReportDAO(BaseDAO):
    """DAO for Report model."""

    async def create(
        self,
        *,
        name: str,
        file_format: str,
        s3_key: str,
        created_by_id: int,
        period_start: date,
        period_end: date,
        total_requests: int,
        approved_requests: int,
        denied_requests: int,
        pending_requests: int,
    ) -> Report:
        """Create a new report.

        Args:
            name: Report name.
            file_format: Report format (pdf or excel).
            s3_key: S3 key for the report file.
            created_by_id: ID of the user who created the report.
            period_start: Start date of the report period.
            period_end: End date of the report period.
            total_requests: Total number of requests.
            approved_requests: Number of approved requests.
            denied_requests: Number of denied requests.
            pending_requests: Number of pending requests.

        Returns:
            Report: Created report instance.

        """
        report = Report(
            name=name,
            format=file_format,
            s3_key=s3_key,
            created_by_id=created_by_id,
            period_start=period_start,
            period_end=period_end,
            total_requests=total_requests,
            approved_requests=approved_requests,
            denied_requests=denied_requests,
            pending_requests=pending_requests,
        )
        self._session.add(report)
        await self._session.flush()
        await self._session.refresh(report)
        return report

    async def get_latest_reports(self, *, limit: int = 3) -> list[Report]:
        """Get latest reports ordered by creation date.

        Args:
            limit: Maximum number of reports to return.

        Returns:
            List of latest Report instances.

        """
        stmt = (
            select(Report)
            .options(selectinload(Report.created_by))
            .order_by(Report.created_at.desc(), Report.id.desc())
            .limit(limit)
        )
        result = await self._session.execute(stmt)
        return list(result.scalars().all())

    async def get_latest_report(self) -> Report | None:
        """Get the latest report.

        Returns:
            Latest Report instance or None if no reports exist.

        """
        stmt = (
            select(Report)
            .options(selectinload(Report.created_by))
            .order_by(Report.created_at.desc(), Report.id.desc())
            .limit(1)
        )
        result = await self._session.execute(stmt)
        return result.scalar_one_or_none()
