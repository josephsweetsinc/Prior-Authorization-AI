from datetime import date
from enum import StrEnum
from typing import TYPE_CHECKING

from sqlalchemy import Date, Enum, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from core.models import BaseIdMixin, BaseTimeStampMixin

if TYPE_CHECKING:
    from models import User


class ReportFormat(StrEnum):
    """Enumeration of report formats."""

    PDF = 'pdf'
    EXCEL = 'excel'


class Report(BaseIdMixin, BaseTimeStampMixin):
    """Report model for storing generated reports.

    Fields:
    - name: Report name.
    - format: Report format (PDF or Excel).
    - s3_key: S3 key for the report file.
    - created_by_id: ID of the user who created the report.
    - period_start: Start date of the report period.
    - period_end: End date of the report period.
    - total_requests: Total number of requests at report creation time.
    - approved_requests: Number of approved requests at report creation time.
    - denied_requests: Number of denied requests at report creation time.
    - pending_requests: Number of pending/submitted requests at report creation time.
    """

    __tablename__ = 'reports'

    name: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
        comment='Report name',
    )
    format: Mapped[ReportFormat] = mapped_column(
        Enum(ReportFormat),
        nullable=False,
        comment='Report format (PDF or Excel)',
    )
    s3_key: Mapped[str] = mapped_column(
        String(512),
        nullable=False,
        comment='S3 key for the report file',
    )
    created_by_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey('users.id', ondelete='SET NULL'),
        nullable=False,
        comment='ID of the user who created the report',
    )
    period_start: Mapped[date] = mapped_column(
        Date,
        nullable=False,
        comment='Start date of the report period',
    )
    period_end: Mapped[date] = mapped_column(
        Date,
        nullable=False,
        comment='End date of the report period',
    )
    total_requests: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=0,
        comment='Total number of requests at report creation time',
    )
    approved_requests: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=0,
        comment='Number of approved requests at report creation time',
    )
    denied_requests: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=0,
        comment='Number of denied requests at report creation time',
    )
    pending_requests: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=0,
        comment='Number of pending/submitted requests at report creation time',
    )

    # Relationships
    created_by: Mapped['User'] = relationship(
        'User',
        foreign_keys=[created_by_id],
    )

    def __repr__(self) -> str:
        """Return a string representation of the report."""
        return f'<Report {self.id} - {self.name} ({self.format})>'
