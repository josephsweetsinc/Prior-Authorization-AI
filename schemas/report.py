from datetime import date, datetime
from typing import Annotated

from pydantic import BaseModel, Field

from models.report import ReportFormat


class GenerateReportRequestSchema(BaseModel):
    """Request schema for generating a report."""

    format: Annotated[
        ReportFormat,
        Field(description='Report format (PDF or Excel)'),
    ]
    start_date: Annotated[
        date,
        Field(description='Start date for report period'),
    ]
    end_date: Annotated[
        date,
        Field(description='End date for report period'),
    ]


class GenerateReportResponseSchema(BaseModel):
    """Response schema for report generation."""

    report_id: Annotated[int, Field(description='ID of the generated report')]
    download_url: Annotated[
        str, Field(description='Presigned URL for downloading the report file')
    ]


class ReportStatisticsSchema(BaseModel):
    """Statistics schema for report comparison."""

    total_requests: Annotated[
        int,
        Field(description='Total number of requests'),
    ]
    total_requests_change: Annotated[
        float,
        Field(
            description='Change in total requests '
            'compared to previous report (%)'
        ),
    ]
    approved_requests: Annotated[
        int,
        Field(description='Number of approved requests'),
    ]
    approved_requests_change: Annotated[
        float,
        Field(
            description='Change in approved requests'
            ' compared to previous report (%)'
        ),
    ]
    denied_requests: Annotated[
        int,
        Field(description='Number of denied requests'),
    ]
    denied_requests_change: Annotated[
        float,
        Field(
            description='Change in denied requests'
            ' compared to previous report (%)'
        ),
    ]
    pending_requests: Annotated[
        int,
        Field(description='Number of pending/submitted requests'),
    ]
    pending_requests_change: Annotated[
        float,
        Field(
            description='Change in pending requests'
            ' compared to previous report (%)'
        ),
    ]


class ReportItemSchema(BaseModel):
    """Schema for a single report in the list."""

    id: Annotated[int, Field(description='Report ID')]
    name: Annotated[str, Field(description='Report name')]
    format: Annotated[ReportFormat, Field(description='Report format')]
    created_at: Annotated[datetime, Field(description='Report creation date')]
    created_by_full_name: Annotated[
        str,
        Field(description='Full name of the user who created the report'),
    ]
    s3_key: Annotated[str, Field(description='S3 key for the report file')]


class LatestReportsResponseSchema(BaseModel):
    """Response schema for latest reports with statistics."""

    reports: Annotated[
        list[ReportItemSchema],
        Field(description='List of latest reports (up to 3)'),
    ]
    current_statistics: Annotated[
        ReportStatisticsSchema,
        Field(
            description='Current statistics compared to the latest report',
        ),
    ]
