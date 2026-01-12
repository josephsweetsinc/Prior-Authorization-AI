from datetime import date, datetime
from math import ceil
from typing import Annotated, Any

from pydantic import BaseModel, Field, field_validator, model_validator

from models.ambulance_request import RequestStatus


class ProviderSummaryStatsSchema(BaseModel):
    """Top-level statistics for provider dashboard_metrics."""

    total_requests: Annotated[
        int,
        Field(description='Total number of requests created by provider.'),
    ]
    pending_review: Annotated[
        int,
        Field(description='Number of requests with PENDING status.'),
    ]
    approved: Annotated[
        int,
        Field(description='Number of requests with APPROVED status.'),
    ]
    approval_rate: Annotated[
        float,
        Field(
            description=(
                'Approval rate in percentage calculated as '
                'approved / (approved + denied).'
            ),
        ),
    ]

    @field_validator('approval_rate', mode='before')
    def ceil_approval_rate(cls, v: float) -> Any:
        """Round approval rate to the nearest integer."""
        if isinstance(v, float):
            return ceil(v)
        return v  # type: ignore


class RecentRequestItemSchema(BaseModel):
    """Single recent request row for dashboard_metrics tables."""

    id: Annotated[
        int,
        Field(description='Unique identifier of the ambulance request.'),
    ]
    patient_id: Annotated[
        str,
        Field(
            description='Patient ID.',
            examples=['1EG4-TE5-MK72'],
        ),
    ]
    patient_full_name: Annotated[
        str,
        Field(
            description='Full name of the patient (first + last name).',
            examples=['John Doe'],
        ),
    ]
    # TODO: MRN field will be added when MRN is introduced into the model.
    diagnosis: Annotated[
        str | None,
        Field(description='Primary diagnosis of the patient.'),
    ]
    status: RequestStatus
    created_at: Annotated[
        datetime,
        Field(
            description=(
                'Datetime when request was created. '
                'Frontend is responsible for formatting.'
            ),
        ),
    ]


class StatusDistributionItemSchema(BaseModel):
    """Distribution of requests by status."""

    status: RequestStatus
    count: Annotated[int, Field(description='Number of requests.')]
    percentage: Annotated[
        float,
        Field(
            description='Share of this status in percentage (0-100).',
        ),
    ]


class RequestProgressItemSchema(BaseModel):
    """Single request in progress item for provider dashboard_metrics."""

    full_name: Annotated[
        str,
        Field(
            description='Full name of the patient (first + last name).',
            examples=['John Doe'],
        ),
    ]
    status: RequestStatus
    progress: Annotated[
        float,
        Field(
            description='Progress percentage (0-100) based on request status.',
            ge=0.0,
            le=100.0,
        ),
    ]


class RequestsProgressSchema(BaseModel):
    """Requests in progress block for provider."""

    items: list[RequestProgressItemSchema]


class DailySubmittedItemSchema(BaseModel):
    """Single day entry for daily submitted requests."""

    date: Annotated[
        date,
        Field(
            description='Calendar date when requests were created.',
        ),
    ]
    count: Annotated[int, Field(description='Number of requests for this day.')]


class DailySubmittedRequestsSchema(BaseModel):
    """Daily submitted requests for a provider over a fixed window."""

    total: Annotated[
        int,
        Field(
            description=(
                'Total number of requests created by provider '
                'for the selected period.'
            ),
        ),
    ]
    change_percent: Annotated[
        float,
        Field(
            description=(
                'Percentage change compared to previous 8-day period. '
                'Formula: ((current_total - previous_total) / previous_total) * 100.'  # noqa: E501
            ),
        ),
    ]
    days: list[DailySubmittedItemSchema]


class ProviderDashboardDataSchema(BaseModel):
    """Complete provider dashboard_metrics payload."""

    summary: ProviderSummaryStatsSchema
    recent_requests: list[RecentRequestItemSchema]
    requests_in_progress: RequestsProgressSchema
    daily_submitted_requests: DailySubmittedRequestsSchema


class AdminRequestsStatusesResponseSchema(BaseModel):
    """Top statistics for admin dashboard_metrics."""

    approved_requests: Annotated[
        int,
        Field(description='Total number of approved requests (all time).'),
    ]
    approved_requests_change_percent: Annotated[
        float,
        Field(
            description=(
                'Change in approved requests compared to previous month '
                'in percentage.'
            ),
        ),
    ]
    pending_review: Annotated[
        int,
        Field(description='Number of requests currently in PENDING status.'),
    ]
    pending_avg_wait_time_hours: Annotated[
        float,
        Field(
            description=(
                'Average wait time in hours for requests in PENDING status '
                'until the next status change, calculated from '
                'status history.'
            ),
        ),
    ]
    denied_requests: Annotated[
        int,
        Field(description='Total number of denied requests (all time).'),
    ]
    denial_rate_percent: Annotated[
        float,
        Field(
            description=(
                'Denial rate in percentage calculated as '
                'denied / (approved + denied).'
            ),
        ),
    ]
    ai_accuracy: Annotated[
        int,
        Field(
            description=(
                'AI form accuracy in percentage. '
                'Currently a static demo value (TODO: implement real metric).'
            ),
        ),
    ]

    @model_validator(mode='before')
    def ceil_floats(cls, values: dict[str, Any]) -> Any:
        """Round floats to the nearest integer."""
        for k, v in values.items():
            if isinstance(v, float):
                values[k] = ceil(v)
        return values


class CommonDenialReasonsResponseSchema(BaseModel):
    """Schema representing common denial reasons (admin dashboard_metrics)."""

    reason: Annotated[str, Field(description='Reason for denial.')]
    count: Annotated[
        int, Field(description='Amount of denials for this reason.')
    ]


class ProcessingTimeDistributionItemSchema(BaseModel):
    """Approved requests distribution by day for admin dashboard_metrics."""

    date: Annotated[
        date,
        Field(description='Calendar date.'),
    ]
    approved_count: Annotated[
        int,
        Field(description='Number of requests approved on this date.'),
    ]


class RecentActivityItemSchema(BaseModel):
    """Single recent activity entry for admin dashboard_metrics."""

    request_id: Annotated[
        int,
        Field(description='Identifier of the related ambulance request.'),
    ]
    status: RequestStatus
    author_name: Annotated[
        str,
        Field(
            description=(
                'Name of the user who changed the status. '
                'TODO: link to actual user when audit is available.'
            ),
        ),
    ]
    created_at: Annotated[
        datetime,
        Field(description='Datetime when this status change was recorded.'),
    ]


class AdminDashboardDataSchema(BaseModel):
    """Complete admin dashboard_metrics payload."""

    requests_statuses: AdminRequestsStatusesResponseSchema
    processing_time_distribution: list[ProcessingTimeDistributionItemSchema]
    requests_by_status: list[StatusDistributionItemSchema]
    recent_requests: list[RecentRequestItemSchema]
    recent_activity: list[RecentActivityItemSchema]
    denial_reasons: list[CommonDenialReasonsResponseSchema]


class DashboardResponseSchema(BaseModel):
    """Unified dashboard_metrics response for both provider and admin roles."""

    provider: ProviderDashboardDataSchema | None = None
    admin: AdminDashboardDataSchema | None = None
