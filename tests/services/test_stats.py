"""Tests for StatsService."""

from unittest.mock import AsyncMock, MagicMock

import pytest

from models.ambulance_request import RequestStatus
from models.user import User
from services.stats import StatsService


@pytest.fixture
def mock_session():
    """Mock database session."""
    return AsyncMock()


@pytest.fixture
def mock_dashboard_dao():
    """Mock DashboardDAO."""
    return AsyncMock()


@pytest.fixture
def mock_user_dao():
    """Mock UserDAO."""
    return AsyncMock()


@pytest.fixture
def stats_service(
    mock_session,
    mock_dashboard_dao,
    mock_user_dao,
):
    """Create StatsService instance with mocks."""
    return StatsService(
        db_session=mock_session,
        dashboard_dao=mock_dashboard_dao,
        user_dao=mock_user_dao,
    )


class TestStatsService:
    """Test suite for StatsService."""

    @pytest.mark.asyncio
    async def test_get_provider_stats(
        self,
        stats_service,
        mock_dashboard_dao,
    ):
        """Test calculating provider stats."""
        user_id = 1
        # Mock counts: 5 approved, 3 submitted, 2 denied, 1 draft (should ignore draft)
        mock_counts = {
            RequestStatus.APPROVED: 5,
            RequestStatus.SUBMITTED: 3,
            RequestStatus.DENIED: 2,
            RequestStatus.DRAFT: 10,
        }
        mock_dashboard_dao.get_request_counts_by_status.return_value = mock_counts

        result = await stats_service.get_provider_stats(user_id)

        assert result.approved == 5
        assert result.submitted == 3
        assert result.rejected == 2
        # Total = 5 + 3 + 2 = 10
        assert result.total_requests == 10

        mock_dashboard_dao.get_request_counts_by_status.assert_awaited_once_with(
            user_id=user_id
        )

    @pytest.mark.asyncio
    async def test_get_admin_users(
        self,
        stats_service,
        mock_user_dao,
    ):
        """Test getting admin users."""
        current_admin_id = 1

        current_admin = MagicMock(spec=User)
        current_admin.id = 1
        current_admin.name = "My"
        current_admin.surname = "Admin"
        current_admin.email = "me@admin.com"

        other_admin1 = MagicMock(spec=User)
        other_admin1.id = 2
        other_admin1.name = "Other"
        other_admin1.surname = "One"
        other_admin1.email = "one@admin.com"

        mock_user_dao.get_by_id.return_value = current_admin
        # Return list including current admin to verify filtering
        mock_user_dao.get_recent_admins.return_value = [current_admin, other_admin1]

        result = await stats_service.get_admin_users(current_admin_id)

        assert result.full_name == "My Admin"
        assert result.email == "me@admin.com"
        assert len(result.recent_admins) == 1
        assert result.recent_admins[0].full_name == "Other One"

        mock_user_dao.get_by_id.assert_awaited_once_with(current_admin_id)
