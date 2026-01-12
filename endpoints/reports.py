"""Report API endpoints."""

import logging
from typing import Annotated

from fastapi import APIRouter, Depends
from fastapi.params import Security

from core import exception_handler, get_service
from dependencies import get_admin_user_from_token
from models import User
from schemas.report import (
    GenerateReportRequestSchema,
    GenerateReportResponseSchema,
    LatestReportsResponseSchema,
)
from services.report import ReportService

logger = logging.getLogger(__name__)

report_router = APIRouter()


@report_router.post(
    '/generate',
    description='Generate a report in PDF or Excel format.',
    summary='Generate report',
    response_model=GenerateReportResponseSchema,
)
@exception_handler
async def generate_report(
    request_data: GenerateReportRequestSchema,
    user: Annotated[User, Security(get_admin_user_from_token)],
    service: Annotated[
        ReportService,
        Depends(get_service(ReportService)),
    ],
) -> GenerateReportResponseSchema:
    """Generate a report in PDF or Excel format.

    Args:
        request_data: Report generation request data.
        user: Current authenticated admin user.
        service: Report service.

    Returns:
        GenerateReportResponseSchema: Generated report information.

    """
    return await service.generate_report(
        file_format=request_data.format,
        start_date=request_data.start_date,
        end_date=request_data.end_date,
        created_by_id=user.id,
    )


@report_router.get(
    '/latest',
    description='Get latest reports with current statistics comparison.',
    summary='Get latest reports',
    response_model=LatestReportsResponseSchema,
)
@exception_handler
async def get_latest_reports(
    user: Annotated[User, Security(get_admin_user_from_token)],
    service: Annotated[
        ReportService,
        Depends(get_service(ReportService)),
    ],
) -> LatestReportsResponseSchema:
    """Get latest reports with current statistics comparison.

    Args:
        user: Current authenticated admin user.
        service: Report service.

    Returns:
        LatestReportsResponseSchema: Latest reports and statistics.

    """
    return await service.get_latest_reports_with_statistics()
