"""Comprehensive tests for dashboard_metrics service."""

from datetime import UTC, date, datetime, timedelta

import pytest

from models.ambulance_request import RequestStatus
from models.user import UserRole
from services.dashboard_metrics import DashboardService


class TestDashboardService:
    """Test suite for DashboardService."""

    @pytest.mark.asyncio
    async def test_get_dashboard_for_provider(
        self,
        db_session,
        user_factory,
        ambulance_request_factory,
        request_status_history_factory,
    ):
        """Test getting dashboard_metrics for user with provider role."""
        provider = await user_factory(
            email='provider@test.com',
            role=UserRole.PROVIDER,
        )
        await db_session.commit()

        # Create some requests
        req1 = await ambulance_request_factory(
            user_id=provider.id,
            patient_first_name='John',
            status=RequestStatus.APPROVED,
        )
        await request_status_history_factory(
            request_id=req1.id,
            status=RequestStatus.APPROVED,
        )

        req2 = await ambulance_request_factory(
            user_id=provider.id,
            patient_first_name='Jane',
            status=RequestStatus.PENDING,
        )
        await request_status_history_factory(
            request_id=req2.id,
            status=RequestStatus.PENDING,
        )

        await db_session.commit()

        service = DashboardService(db_session)
        dashboard = await service.get_dashboard_for_user(user=provider)

        assert dashboard.provider is not None
        assert dashboard.admin is None

        provider_data = dashboard.provider
        assert provider_data.summary.total_requests == 2
        assert provider_data.summary.approved == 1
        assert provider_data.summary.pending_review == 1

    @pytest.mark.asyncio
    async def test_get_dashboard_for_admin(
        self,
        db_session,
        user_factory,
        ambulance_request_factory,
        request_status_history_factory,
    ):
        """Test getting dashboard_metrics for admin user."""
        provider = await user_factory(
            email='provider@test.com',
            role=UserRole.PROVIDER,
        )
        admin = await user_factory(
            email='admin@test.com',
            role=UserRole.ADMIN,
        )
        await db_session.commit()

        # Create requests from provider
        req = await ambulance_request_factory(
            user_id=provider.id,
            patient_first_name='John',
            status=RequestStatus.APPROVED,
        )
        await request_status_history_factory(
            request_id=req.id,
            status=RequestStatus.APPROVED,
        )

        await db_session.commit()

        service = DashboardService(db_session)
        dashboard = await service.get_dashboard_for_user(user=admin)

        assert dashboard.admin is not None
        assert dashboard.provider is None

        admin_data = dashboard.admin
        assert admin_data.requests_statuses.approved_requests == 1

    @pytest.mark.asyncio
    async def test_provider_dashboard_summary_calculation(
        self,
        db_session,
        user_factory,
        ambulance_request_factory,
        request_status_history_factory,
    ):
        """Test provider dashboard_metrics summary statistics calculation."""
        provider = await user_factory(
            email='provider2@test.com',
            role=UserRole.PROVIDER,
        )
        await db_session.commit()

        # Create requests: 5 approved, 2 denied, 3 pending
        for i in range(5):
            req = await ambulance_request_factory(
                user_id=provider.id,
                patient_first_name=f'Approved{i}',
                status=RequestStatus.APPROVED,
            )
            await request_status_history_factory(
                request_id=req.id,
                status=RequestStatus.APPROVED,
            )

        for i in range(2):
            req = await ambulance_request_factory(
                user_id=provider.id,
                patient_first_name=f'Denied{i}',
                status=RequestStatus.DENIED,
            )
            await request_status_history_factory(
                request_id=req.id,
                status=RequestStatus.DENIED,
            )

        for i in range(3):
            req = await ambulance_request_factory(
                user_id=provider.id,
                patient_first_name=f'Pending{i}',
                status=RequestStatus.PENDING,
            )
            await request_status_history_factory(
                request_id=req.id,
                status=RequestStatus.PENDING,
            )

        await db_session.commit()

        service = DashboardService(db_session)
        dashboard = await service.get_dashboard_for_user(user=provider)

        summary = dashboard.provider.summary
        assert summary.total_requests == 10
        assert summary.approved == 5
        assert summary.pending_review == 3
        # Approval rate = 5 / (5 + 2) * 100 = 71.43% -> 72 (ceiled)
        assert summary.approval_rate >= 71
        assert summary.approval_rate <= 72

    @pytest.mark.asyncio
    async def test_provider_dashboard_recent_requests_limit(
        self,
        db_session,
        user_factory,
        ambulance_request_factory,
    ):
        """Test that recent requests are limited to 5."""
        provider = await user_factory(
            email='provider3@test.com',
            role=UserRole.PROVIDER,
        )
        await db_session.commit()

        # Create 10 requests
        for i in range(10):
            await ambulance_request_factory(
                user_id=provider.id,
                patient_first_name=f'Patient{i}',
                created_at=datetime.now(UTC) - timedelta(hours=i),
            )

        await db_session.commit()

        service = DashboardService(db_session)
        dashboard = await service.get_dashboard_for_user(user=provider)

        recent_requests = dashboard.provider.recent_requests
        assert len(recent_requests) == 5

    @pytest.mark.asyncio
    async def test_provider_dashboard_in_progress_requests(
        self,
        db_session,
        user_factory,
        ambulance_request_factory,
    ):
        """Test in-progress requests (PENDING + PROCESSING)."""
        provider = await user_factory(
            email='provider4@test.com',
            role=UserRole.PROVIDER,
        )
        await db_session.commit()

        # Create requests in different statuses
        await ambulance_request_factory(
            user_id=provider.id,
            patient_first_name='Pending',
            status=RequestStatus.PENDING,
        )
        await ambulance_request_factory(
            user_id=provider.id,
            patient_first_name='Processing',
            status=RequestStatus.PROCESSING,
        )
        await ambulance_request_factory(
            user_id=provider.id,
            patient_first_name='Approved',
            status=RequestStatus.APPROVED,
        )
        await ambulance_request_factory(
            user_id=provider.id,
            patient_first_name='Denied',
            status=RequestStatus.DENIED,
        )

        await db_session.commit()

        service = DashboardService(db_session)
        dashboard = await service.get_dashboard_for_user(user=provider)

        in_progress = dashboard.provider.requests_in_progress.items
        assert len(in_progress) == 2
        statuses = {item.status for item in in_progress}
        assert RequestStatus.PENDING in statuses
        assert RequestStatus.PROCESSING in statuses

    @pytest.mark.asyncio
    async def test_provider_dashboard_daily_submitted_requests(
        self,
        db_session,
        user_factory,
        ambulance_request_factory,
    ):
        """Test daily submitted requests calculation."""
        provider = await user_factory(
            email='provider5@test.com',
            role=UserRole.PROVIDER,
        )
        await db_session.commit()

        today = date.today()
        # Create requests on different days
        for i in range(5):
            day_offset = i - 2  # -2 to 2
            request_date = today - timedelta(days=day_offset)
            created_at = datetime.combine(
                request_date, datetime.min.time()
            ).replace(tzinfo=UTC)

            await ambulance_request_factory(
                user_id=provider.id,
                patient_first_name=f'Day{i}',
                created_at=created_at,
            )

        await db_session.commit()

        service = DashboardService(db_session)
        dashboard = await service.get_dashboard_for_user(user=provider)

        daily_submitted = dashboard.provider.daily_submitted_requests
        assert daily_submitted.total >= 0
        assert len(daily_submitted.days) == 8

        # Check days are in order (oldest first)
        for i in range(len(daily_submitted.days) - 1):
            assert daily_submitted.days[i].date <= daily_submitted.days[i + 1].date

    @pytest.mark.asyncio
    async def test_admin_dashboard_request_counts(
        self,
        db_session,
        user_factory,
        ambulance_request_factory,
        request_status_history_factory,
    ):
        """Test admin dashboard_metrics request counts."""
        provider1 = await user_factory(
            email='provider6@test.com',
            role=UserRole.PROVIDER,
        )
        provider2 = await user_factory(
            email='provider7@test.com',
            role=UserRole.PROVIDER,
        )
        admin = await user_factory(
            email='admin2@test.com',
            role=UserRole.ADMIN,
        )
        await db_session.commit()

        # Provider 1: 3 approved, 1 denied
        for i in range(3):
            req = await ambulance_request_factory(
                user_id=provider1.id,
                patient_first_name=f'P1Approved{i}',
                status=RequestStatus.APPROVED,
            )
            await request_status_history_factory(
                request_id=req.id,
                status=RequestStatus.APPROVED,
            )

        denied_req = await ambulance_request_factory(
            user_id=provider1.id,
            patient_first_name='P1Denied',
            status=RequestStatus.DENIED,
        )
        await request_status_history_factory(
            request_id=denied_req.id,
            status=RequestStatus.DENIED,
        )

        # Provider 2: 2 approved, 1 pending
        for i in range(2):
            req = await ambulance_request_factory(
                user_id=provider2.id,
                patient_first_name=f'P2Approved{i}',
                status=RequestStatus.APPROVED,
            )
            await request_status_history_factory(
                request_id=req.id,
                status=RequestStatus.APPROVED,
            )

        pending_req = await ambulance_request_factory(
            user_id=provider2.id,
            patient_first_name='P2Pending',
            status=RequestStatus.PENDING,
        )
        await request_status_history_factory(
            request_id=pending_req.id,
            status=RequestStatus.PENDING,
        )

        await db_session.commit()

        service = DashboardService(db_session)
        dashboard = await service.get_dashboard_for_user(user=admin)

        statuses = dashboard.admin.requests_statuses
        assert statuses.approved_requests == 5
        assert statuses.pending_review == 1
        assert statuses.denied_requests == 1
        # Denial rate = 1 / (5 + 1) * 100 = 16.67% -> 17 (ceiled)
        assert statuses.denial_rate_percent == 17

    @pytest.mark.asyncio
    async def test_admin_dashboard_recent_requests_all_providers(
        self,
        db_session,
        user_factory,
        ambulance_request_factory,
    ):
        """Test admin sees recent requests from all providers."""
        provider1 = await user_factory(
            email='provider8@test.com',
            role=UserRole.PROVIDER,
        )
        provider2 = await user_factory(
            email='provider9@test.com',
            role=UserRole.PROVIDER,
        )
        admin = await user_factory(
            email='admin3@test.com',
            role=UserRole.ADMIN,
        )
        await db_session.commit()

        now = datetime.now(UTC)

        # Create requests from both providers
        for i in range(3):
            await ambulance_request_factory(
                user_id=provider1.id,
                patient_first_name=f'P1Patient{i}',
                created_at=now - timedelta(hours=i),
            )

        for i in range(3):
            await ambulance_request_factory(
                user_id=provider2.id,
                patient_first_name=f'P2Patient{i}',
                created_at=now - timedelta(hours=i + 0.5),
            )

        await db_session.commit()

        service = DashboardService(db_session)
        dashboard = await service.get_dashboard_for_user(user=admin)

        recent_requests = dashboard.admin.recent_requests
        assert len(recent_requests) <= 5
        # Should see requests from both providers
        patient_names = {req.patient_full_name for req in recent_requests}
        assert any('P1Patient' in name for name in patient_names)
        assert any('P2Patient' in name for name in patient_names)

    @pytest.mark.asyncio
    async def test_admin_dashboard_processing_time_distribution(
        self,
        db_session,
        user_factory,
        ambulance_request_factory,
        request_status_history_factory,
    ):
        """Test processing time distribution (10 days)."""
        provider = await user_factory(
            email='provider10@test.com',
            role=UserRole.PROVIDER,
        )
        admin = await user_factory(
            email='admin4@test.com',
            role=UserRole.ADMIN,
        )
        await db_session.commit()

        today = date.today()
        # Create approved requests on different days
        for i in range(5):
            day_offset = i
            request_date = today - timedelta(days=day_offset)
            created_at = datetime.combine(
                request_date, datetime.min.time()
            ).replace(tzinfo=UTC)

            req = await ambulance_request_factory(
                user_id=provider.id,
                patient_first_name=f'Day{i}',
                status=RequestStatus.APPROVED,
                created_at=created_at,
            )
            await request_status_history_factory(
                request_id=req.id,
                status=RequestStatus.APPROVED,
                created_at=created_at,
            )

        await db_session.commit()

        service = DashboardService(db_session)
        dashboard = await service.get_dashboard_for_user(user=admin)

        processing_dist = dashboard.admin.processing_time_distribution
        assert len(processing_dist) == 10

        # Check dates are in order
        dates = [item.date for item in processing_dist]
        for i in range(len(dates) - 1):
            assert dates[i] <= dates[i + 1]

    @pytest.mark.asyncio
    async def test_admin_dashboard_status_distribution(
        self,
        db_session,
        user_factory,
        ambulance_request_factory,
        request_status_history_factory,
    ):
        """Test status distribution with percentages."""
        provider = await user_factory(
            email='provider11@test.com',
            role=UserRole.PROVIDER,
        )
        admin = await user_factory(
            email='admin5@test.com',
            role=UserRole.ADMIN,
        )
        await db_session.commit()

        # Create 4 approved, 2 pending, 1 denied
        for i in range(4):
            req = await ambulance_request_factory(
                user_id=provider.id,
                patient_first_name=f'Approved{i}',
                status=RequestStatus.APPROVED,
            )
            await request_status_history_factory(
                request_id=req.id,
                status=RequestStatus.APPROVED,
            )

        for i in range(2):
            req = await ambulance_request_factory(
                user_id=provider.id,
                patient_first_name=f'Pending{i}',
                status=RequestStatus.PENDING,
            )
            await request_status_history_factory(
                request_id=req.id,
                status=RequestStatus.PENDING,
            )

        denied_req = await ambulance_request_factory(
            user_id=provider.id,
            patient_first_name='Denied',
            status=RequestStatus.DENIED,
        )
        await request_status_history_factory(
            request_id=denied_req.id,
            status=RequestStatus.DENIED,
        )

        await db_session.commit()

        service = DashboardService(db_session)
        dashboard = await service.get_dashboard_for_user(user=admin)

        status_dist = dashboard.admin.requests_by_status
        assert len(status_dist) == 3

        # Check percentages sum to 100
        total_percentage = sum(item.percentage for item in status_dist)
        assert abs(total_percentage - 100.0) < 0.01  # Allow small floating point errors

        # Check counts
        status_counts = {item.status: item.count for item in status_dist}
        assert status_counts[RequestStatus.APPROVED] == 4
        assert status_counts[RequestStatus.PENDING] == 2
        assert status_counts[RequestStatus.DENIED] == 1

    @pytest.mark.asyncio
    async def test_admin_dashboard_recent_activity(
        self,
        db_session,
        user_factory,
        ambulance_request_factory,
        request_status_history_factory,
    ):
        """Test recent activity section."""
        provider = await user_factory(
            email='provider12@test.com',
            role=UserRole.PROVIDER,
        )
        admin = await user_factory(
            email='admin6@test.com',
            role=UserRole.ADMIN,
        )
        await db_session.commit()

        now = datetime.now(UTC)

        # Create requests with status history
        for i in range(5):
            req = await ambulance_request_factory(
                user_id=provider.id,
                patient_first_name=f'Activity{i}',
                status=RequestStatus.APPROVED,
                created_at=now - timedelta(hours=i),
            )
            await request_status_history_factory(
                request_id=req.id,
                status=RequestStatus.PROCESSING,
                created_at=now - timedelta(hours=i),
            )
            await request_status_history_factory(
                request_id=req.id,
                status=RequestStatus.APPROVED,
                created_at=now - timedelta(hours=i) + timedelta(minutes=30),
            )

        await db_session.commit()

        service = DashboardService(db_session)
        dashboard = await service.get_dashboard_for_user(user=admin)

        recent_activity = dashboard.admin.recent_activity
        assert len(recent_activity) <= 3

        # Check activity entries have required fields
        for activity in recent_activity:
            assert activity.request_id is not None
            assert activity.status is not None
            assert activity.created_at is not None
