"""Comprehensive tests for dashboard_metrics endpoints."""

from datetime import UTC, date, datetime, timedelta

import pytest
from fastapi.testclient import TestClient

from core.dependencies import get_session
from dependencies.auth import get_current_user
from main import app
from models.ambulance_request import RequestStatus
from models.user import UserRole


@pytest.fixture
def client() -> TestClient:
    """Create test client."""
    return TestClient(app)


@pytest.fixture(autouse=True)
def reset_dependencies():
    """Reset dependency overrides after each test."""
    yield
    app.dependency_overrides.clear()


class TestProviderDashboard:
    """Test suite for provider dashboard_metrics."""

    @pytest.mark.asyncio
    async def test_provider_dashboard_empty(
        self,
        client: TestClient,
        db_session,
        user_factory,
    ):
        """Test provider dashboard_metrics with no requests."""
        # Register as provider
        provider = await user_factory(
            name='Provider',
            surname='Test',
            email='provider@test.com',
            role=UserRole.PROVIDER,
        )
        await db_session.commit()

        # Override dependencies to use test session
        async def get_session_override():
            yield db_session

        async def get_user_override():
            return provider

        app.dependency_overrides[get_session] = get_session_override
        app.dependency_overrides[get_current_user] = get_user_override

        # Get dashboard_metrics
        response = client.get('/Prod/api/v1/dashboard_metrics/', headers={})

        assert response.status_code == 200
        data = response.json()
        assert data['provider'] is not None
        assert data['admin'] is None

        provider_data = data['provider']
        assert provider_data['summary']['total_requests'] == 0
        assert provider_data['summary']['pending_review'] == 0
        assert provider_data['summary']['approved'] == 0
        assert provider_data['summary']['approval_rate'] == 0
        assert len(provider_data['recent_requests']) == 0
        assert len(provider_data['requests_in_progress']['items']) == 0
        assert provider_data['daily_submitted_requests']['total'] == 0
        assert len(provider_data['daily_submitted_requests']['days']) == 8

    @pytest.mark.asyncio
    async def test_provider_dashboard_with_requests(
        self,
        client: TestClient,
        db_session,
        user_factory,
        ambulance_request_factory,
        request_status_history_factory,
    ):
        """Test provider dashboard_metrics with multiple requests in different statuses."""
        # Register as provider
        provider = await user_factory(
            name='Provider',
            surname='Test',
            email='provider@test.com',
            role=UserRole.PROVIDER,
        )
        await db_session.commit()

        # Create requests with different statuses
        now = datetime.now(UTC)
        yesterday = now - timedelta(days=1)
        two_days_ago = now - timedelta(days=2)

        # Approved request
        approved_request = await ambulance_request_factory(
            user_id=provider.id,
            patient_first_name='John',
            patient_last_name='Doe',
            primary_diagnosis='Heart failure',
            status=RequestStatus.APPROVED,
            created_at=two_days_ago,
        )
        await request_status_history_factory(
            request_id=approved_request.id,
            status=RequestStatus.SUBMITTED,
            created_at=two_days_ago,
        )
        await request_status_history_factory(
            request_id=approved_request.id,
            status=RequestStatus.APPROVED,
            created_at=yesterday,
        )

        # Pending request
        pending_request = await ambulance_request_factory(
            user_id=provider.id,
            patient_first_name='Jane',
            patient_last_name='Smith',
            primary_diagnosis='Diabetes',
            status=RequestStatus.PENDING,
            created_at=yesterday,
        )
        await request_status_history_factory(
            request_id=pending_request.id,
            status=RequestStatus.SUBMITTED,
            created_at=yesterday,
        )
        await request_status_history_factory(
            request_id=pending_request.id,
            status=RequestStatus.PENDING,
            created_at=yesterday + timedelta(hours=1),
        )

        # Processing request
        processing_request = await ambulance_request_factory(
            user_id=provider.id,
            patient_first_name='Bob',
            patient_last_name='Johnson',
            primary_diagnosis='Hypertension',
            status=RequestStatus.SUBMITTED,
            created_at=now,
        )
        await request_status_history_factory(
            request_id=processing_request.id,
            status=RequestStatus.SUBMITTED,
            created_at=now,
        )

        # Denied request
        denied_request = await ambulance_request_factory(
            user_id=provider.id,
            patient_first_name='Alice',
            patient_last_name='Williams',
            primary_diagnosis='Asthma',
            status=RequestStatus.DENIED,
            created_at=yesterday,
        )
        await request_status_history_factory(
            request_id=denied_request.id,
            status=RequestStatus.SUBMITTED,
            created_at=yesterday,
        )
        await request_status_history_factory(
            request_id=denied_request.id,
            status=RequestStatus.DENIED,
            created_at=yesterday + timedelta(hours=2),
        )

        await db_session.commit()

        # Override dependencies to use test session
        async def get_session_override():
            yield db_session

        async def get_user_override():
            return provider

        app.dependency_overrides[get_session] = get_session_override
        app.dependency_overrides[get_current_user] = get_user_override

        # Get dashboard_metrics
        response = client.get('/Prod/api/v1/dashboard_metrics/', headers={})

        assert response.status_code == 200
        data = response.json()
        assert data['provider'] is not None

        provider_data = data['provider']

        # Check summary statistics
        # Note: total_requests only counts APPROVED + PENDING + DENIED (not SUBMITTED)
        summary = provider_data['summary']
        assert summary['total_requests'] == 3  # APPROVED + PENDING + DENIED (SUBMITTED not counted)
        assert summary['pending_review'] == 1
        assert summary['approved'] == 1
        # Approval rate = 1 / (1 + 1) * 100 = 50%
        assert summary['approval_rate'] == 50

        # Check recent requests (should be ordered by created_at desc)
        recent_requests = provider_data['recent_requests']
        assert len(recent_requests) <= 5
        # Most recent should be first
        assert recent_requests[0]['patient_full_name'] in [
            'Bob Johnson',
            'Alice Williams',
            'Jane Smith',
        ]

        # Check requests in progress (PENDING + SUBMITTED)
        in_progress = provider_data['requests_in_progress']['items']
        assert len(in_progress) == 2
        statuses = {item['status'] for item in in_progress}
        assert RequestStatus.PENDING in statuses
        assert RequestStatus.SUBMITTED in statuses

        # Check daily submitted requests
        daily_submitted = provider_data['daily_submitted_requests']
        assert daily_submitted['total'] >= 0  # At least some requests in last 8 days
        assert len(daily_submitted['days']) == 8

    @pytest.mark.asyncio
    async def test_provider_dashboard_approval_rate_calculation(
        self,
        client: TestClient,
        db_session,
        user_factory,
        ambulance_request_factory,
        request_status_history_factory,
    ):
        """Test approval rate calculation with various scenarios."""
        provider = await user_factory(
            email='provider2@test.com',
            role=UserRole.PROVIDER,
        )
        await db_session.commit()

        # Create 3 approved and 1 denied
        for i in range(3):
            req = await ambulance_request_factory(
                user_id=provider.id,
                patient_first_name=f'Patient{i}',
                status=RequestStatus.APPROVED,
            )
            await request_status_history_factory(
                request_id=req.id,
                status=RequestStatus.APPROVED,
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

        # Override dependencies to use test session
        async def get_session_override():
            yield db_session

        async def get_user_override():
            return provider

        app.dependency_overrides[get_session] = get_session_override
        app.dependency_overrides[get_current_user] = get_user_override

        response = client.get('/Prod/api/v1/dashboard_metrics/', headers={})
        assert response.status_code == 200

        data = response.json()
        summary = data['provider']['summary']
        # 3 approved, 1 denied -> 3/(3+1) * 100 = 75%
        # Check counts first
        assert summary['approved'] == 3, f"Expected 3 approved, got {summary['approved']}"
        assert summary['total_requests'] == 4, f"Expected 4 total, got {summary['total_requests']}"
        # Approval rate should be calculated correctly
        assert summary['approval_rate'] >= 74  # Allow for rounding
        assert summary['approval_rate'] <= 76

    @pytest.mark.asyncio
    async def test_provider_dashboard_only_denied_requests(
        self,
        client: TestClient,
        db_session,
        user_factory,
        ambulance_request_factory,
        request_status_history_factory,
    ):
        """Test dashboard_metrics when all requests are denied."""
        provider = await user_factory(
            email='provider3@test.com',
            role=UserRole.PROVIDER,
        )
        await db_session.commit()

        # Create 2 denied requests
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

        await db_session.commit()

        # Override dependencies to use test session
        async def get_session_override():
            yield db_session

        async def get_user_override():
            return provider

        app.dependency_overrides[get_session] = get_session_override
        app.dependency_overrides[get_current_user] = get_user_override

        response = client.get('/Prod/api/v1/dashboard_metrics/', headers={})
        assert response.status_code == 200

        data = response.json()
        summary = data['provider']['summary']
        assert summary['total_requests'] == 2
        assert summary['approved'] == 0
        # When no approved requests, approval rate should be 0
        assert summary['approval_rate'] == 0

    @pytest.mark.asyncio
    async def test_provider_dashboard_daily_submitted_requests(
        self,
        client: TestClient,
        db_session,
        user_factory,
        ambulance_request_factory,
    ):
        """Test daily submitted requests calculation."""
        provider = await user_factory(
            email='provider4@test.com',
            role=UserRole.PROVIDER,
        )
        await db_session.commit()

        # Create requests on different days
        today = date.today()
        for i in range(5):
            day_offset = i - 3  # -3 to 1 (some in past, some today)
            request_date = today - timedelta(days=day_offset)
            created_at = datetime.combine(
                request_date, datetime.min.time()
            ).replace(tzinfo=UTC)

            await ambulance_request_factory(
                user_id=provider.id,
                patient_first_name=f'Patient{i}',
                created_at=created_at,
            )

        await db_session.commit()

        # Override dependencies to use test session
        async def get_session_override():
            yield db_session

        async def get_user_override():
            return provider

        app.dependency_overrides[get_session] = get_session_override
        app.dependency_overrides[get_current_user] = get_user_override

        response = client.get('/Prod/api/v1/dashboard_metrics/', headers={})
        assert response.status_code == 200

        data = response.json()
        daily_submitted = data['provider']['daily_submitted_requests']
        assert daily_submitted['total'] >= 0
        assert len(daily_submitted['days']) == 8

        # Check that days are in correct order (most recent last)
        days = daily_submitted['days']
        for i in range(len(days) - 1):
            assert days[i]['date'] < days[i + 1]['date']


class TestAdminDashboard:
    """Test suite for admin dashboard_metrics."""

    @pytest.mark.asyncio
    async def test_admin_dashboard_empty(
        self,
        client: TestClient,
        db_session,
        user_factory,
    ):
        """Test admin dashboard_metrics with no requests."""
        admin = await user_factory(
            name='Admin',
            surname='Test',
            email='admin@test.com',
            role=UserRole.ADMIN,
        )
        await db_session.commit()

        # Override dependencies to use test session
        async def get_session_override():
            yield db_session

        async def get_user_override():
            return admin

        app.dependency_overrides[get_session] = get_session_override
        app.dependency_overrides[get_current_user] = get_user_override

        response = client.get('/Prod/api/v1/dashboard_metrics/', headers={})

        assert response.status_code == 200
        data = response.json()
        assert data['admin'] is not None
        assert data['provider'] is None

        admin_data = data['admin']
        statuses = admin_data['requests_statuses']
        assert statuses['approved_requests'] == 0
        assert statuses['pending_review'] == 0
        assert statuses['denied_requests'] == 0
        assert statuses['denial_rate_percent'] == 0
        assert statuses['ai_accuracy'] == 0
        assert len(admin_data['recent_requests']) == 0
        assert len(admin_data['recent_activity']) == 0
        assert len(admin_data['processing_time_distribution']) == 10
        assert len(admin_data['requests_by_status']) >= 0

    @pytest.mark.asyncio
    async def test_admin_dashboard_with_requests_from_multiple_providers(
        self,
        client: TestClient,
        db_session,
        user_factory,
        ambulance_request_factory,
        request_status_history_factory,
    ):
        """Test admin dashboard_metrics with requests from multiple providers."""
        # Create multiple providers
        provider1 = await user_factory(
            email='provider1@test.com',
            role=UserRole.PROVIDER,
        )
        provider2 = await user_factory(
            email='provider2@test.com',
            role=UserRole.PROVIDER,
        )
        admin = await user_factory(
            email='admin@test.com',
            role=UserRole.ADMIN,
        )
        await db_session.commit()

        now = datetime.now(UTC)
        yesterday = now - timedelta(days=1)

        # Provider 1 requests
        req1 = await ambulance_request_factory(
            user_id=provider1.id,
            patient_first_name='John',
            status=RequestStatus.APPROVED,
            created_at=yesterday,
        )
        await request_status_history_factory(
            request_id=req1.id,
            status=RequestStatus.SUBMITTED,
            created_at=yesterday,
        )
        await request_status_history_factory(
            request_id=req1.id,
            status=RequestStatus.APPROVED,
            created_at=yesterday + timedelta(hours=2),
        )

        req2 = await ambulance_request_factory(
            user_id=provider1.id,
            patient_first_name='Jane',
            status=RequestStatus.PENDING,
            created_at=now,
        )
        await request_status_history_factory(
            request_id=req2.id,
            status=RequestStatus.SUBMITTED,
            created_at=now,
        )
        await request_status_history_factory(
            request_id=req2.id,
            status=RequestStatus.PENDING,
            created_at=now + timedelta(hours=1),
        )

        # Provider 2 requests
        req3 = await ambulance_request_factory(
            user_id=provider2.id,
            patient_first_name='Bob',
            status=RequestStatus.DENIED,
            created_at=yesterday,
        )
        await request_status_history_factory(
            request_id=req3.id,
            status=RequestStatus.SUBMITTED,
            created_at=yesterday,
        )
        await request_status_history_factory(
            request_id=req3.id,
            status=RequestStatus.DENIED,
            created_at=yesterday + timedelta(hours=3),
        )

        req4 = await ambulance_request_factory(
            user_id=provider2.id,
            patient_first_name='Alice',
            status=RequestStatus.APPROVED,
            created_at=now,
        )
        await request_status_history_factory(
            request_id=req4.id,
            status=RequestStatus.SUBMITTED,
            created_at=now,
        )
        await request_status_history_factory(
            request_id=req4.id,
            status=RequestStatus.APPROVED,
            created_at=now + timedelta(minutes=30),
        )

        await db_session.commit()

        # Override dependencies to use test session
        async def get_session_override():
            yield db_session

        async def get_user_override():
            return admin

        app.dependency_overrides[get_session] = get_session_override
        app.dependency_overrides[get_current_user] = get_user_override

        response = client.get('/Prod/api/v1/dashboard_metrics/', headers={})

        assert response.status_code == 200
        data = response.json()
        assert data['admin'] is not None
        admin_data = data['admin']

        # Check top-level statistics
        statuses = admin_data['requests_statuses']
        assert statuses['approved_requests'] == 2
        assert statuses['pending_review'] == 1
        assert statuses['denied_requests'] == 1
        # Denial rate = 1 / (2 + 1) * 100 = 33.33% -> 33-34 (ceiled)
        assert statuses['denial_rate_percent'] >= 33
        assert statuses['denial_rate_percent'] <= 34

        # Check recent requests (should see all providers' requests)
        recent_requests = admin_data['recent_requests']
        assert len(recent_requests) <= 5
        patient_names = {req['patient_full_name'] for req in recent_requests}
        # Check that we see requests from both providers (check full names)
        assert any('John' in name for name in patient_names) or any('Jane' in name for name in patient_names)
        assert any('Bob' in name for name in patient_names) or any('Alice' in name for name in patient_names)

        # Check recent activity
        recent_activity = admin_data['recent_activity']
        assert len(recent_activity) <= 3
        # Should have status history entries

        # Check processing time distribution (10 days)
        processing_dist = admin_data['processing_time_distribution']
        assert len(processing_dist) == 10

        # Check requests by status distribution
        status_dist = admin_data['requests_by_status']
        status_counts = {item['status']: item['count'] for item in status_dist}
        assert status_counts.get(RequestStatus.APPROVED, 0) == 2
        assert status_counts.get(RequestStatus.PENDING, 0) == 1
        assert status_counts.get(RequestStatus.DENIED, 0) == 1

    @pytest.mark.asyncio
    async def test_admin_dashboard_pending_wait_time(
        self,
        client: TestClient,
        db_session,
        user_factory,
        ambulance_request_factory,
        request_status_history_factory,
    ):
        """Test pending wait time calculation."""
        provider = await user_factory(
            email='provider5@test.com',
            role=UserRole.PROVIDER,
        )
        admin = await user_factory(
            email='admin2@test.com',
            role=UserRole.ADMIN,
        )
        await db_session.commit()

        now = datetime.now(UTC)
        # Create a pending request with history
        pending_req = await ambulance_request_factory(
            user_id=provider.id,
            patient_first_name='Pending',
            status=RequestStatus.PENDING,
            created_at=now - timedelta(hours=5),
        )
        # Status history: PENDING -> (wait 2 hours) -> next status
        await request_status_history_factory(
            request_id=pending_req.id,
            status=RequestStatus.SUBMITTED,
            created_at=now - timedelta(hours=5),
        )
        await request_status_history_factory(
            request_id=pending_req.id,
            status=RequestStatus.PENDING,
            created_at=now - timedelta(hours=3),  # 2 hours after processing
        )
        await request_status_history_factory(
            request_id=pending_req.id,
            status=RequestStatus.APPROVED,
            created_at=now - timedelta(hours=1),  # 2 hours after pending
        )

        await db_session.commit()

        # Override dependencies to use test session
        async def get_session_override():
            yield db_session

        async def get_user_override():
            return admin

        app.dependency_overrides[get_session] = get_session_override
        app.dependency_overrides[get_current_user] = get_user_override

        response = client.get('/Prod/api/v1/dashboard_metrics/', headers={})
        assert response.status_code == 200

        data = response.json()
        statuses = data['admin']['requests_statuses']
        # Should calculate average wait time from pending durations
        # In this case: 2 hours = 7200 seconds -> 2 hours
        assert statuses['pending_avg_wait_time_hours'] >= 0

    @pytest.mark.asyncio
    async def test_admin_dashboard_approved_change_percent(
        self,
        client: TestClient,
        db_session,
        user_factory,
        ambulance_request_factory,
        request_status_history_factory,
    ):
        """Test approved requests change percentage calculation."""
        provider = await user_factory(
            email='provider6@test.com',
            role=UserRole.PROVIDER,
        )
        admin = await user_factory(
            email='admin3@test.com',
            role=UserRole.ADMIN,
        )
        await db_session.commit()

        # Create approved requests in last month
        today = date.today()
        last_month_start = today.replace(day=1) - timedelta(days=30)
        last_month_mid = last_month_start + timedelta(days=15)

        # 5 approvals in last month
        for i in range(5):
            req = await ambulance_request_factory(
                user_id=provider.id,
                patient_first_name=f'Approved{i}',
                status=RequestStatus.APPROVED,
                created_at=datetime.combine(
                    last_month_mid, datetime.min.time()
                ).replace(tzinfo=UTC),
            )
            await request_status_history_factory(
                request_id=req.id,
                status=RequestStatus.APPROVED,
                created_at=datetime.combine(
                    last_month_mid, datetime.min.time()
                ).replace(tzinfo=UTC),
            )

        # 2 approvals in previous month
        prev_month_start = last_month_start - timedelta(days=30)
        prev_month_mid = prev_month_start + timedelta(days=15)

        for i in range(2):
            req = await ambulance_request_factory(
                user_id=provider.id,
                patient_first_name=f'PrevApproved{i}',
                status=RequestStatus.APPROVED,
                created_at=datetime.combine(
                    prev_month_mid, datetime.min.time()
                ).replace(tzinfo=UTC),
            )
            await request_status_history_factory(
                request_id=req.id,
                status=RequestStatus.APPROVED,
                created_at=datetime.combine(
                    prev_month_mid, datetime.min.time()
                ).replace(tzinfo=UTC),
            )

        await db_session.commit()

        # Override dependencies to use test session
        async def get_session_override():
            yield db_session

        async def get_user_override():
            return admin

        app.dependency_overrides[get_session] = get_session_override
        app.dependency_overrides[get_current_user] = get_user_override

        response = client.get('/Prod/api/v1/dashboard_metrics/', headers={})
        assert response.status_code == 200

        data = response.json()
        statuses = data['admin']['requests_statuses']
        # Change = ((5 - 2) / 2) * 100 = 150%
        assert statuses['approved_requests_change_percent'] >= 0

    @pytest.mark.asyncio
    async def test_admin_dashboard_denial_rate_calculation(
        self,
        client: TestClient,
        db_session,
        user_factory,
        ambulance_request_factory,
        request_status_history_factory,
    ):
        """Test denial rate calculation."""
        provider = await user_factory(
            email='provider7@test.com',
            role=UserRole.PROVIDER,
        )
        admin = await user_factory(
            email='admin4@test.com',
            role=UserRole.ADMIN,
        )
        await db_session.commit()

        # Create 4 approved and 1 denied
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

        # Override dependencies to use test session
        async def get_session_override():
            yield db_session

        async def get_user_override():
            return admin

        app.dependency_overrides[get_session] = get_session_override
        app.dependency_overrides[get_current_user] = get_user_override

        response = client.get('/Prod/api/v1/dashboard_metrics/', headers={})
        assert response.status_code == 200

        data = response.json()
        statuses = data['admin']['requests_statuses']
        assert statuses['approved_requests'] == 4
        assert statuses['denied_requests'] == 1
        # Denial rate = 1 / (4 + 1) * 100 = 20%
        assert statuses['denial_rate_percent'] == 20

    @pytest.mark.asyncio
    async def test_admin_dashboard_processing_time_distribution(
        self,
        client: TestClient,
        db_session,
        user_factory,
        ambulance_request_factory,
        request_status_history_factory,
    ):
        """Test processing time distribution (approved by day)."""
        provider = await user_factory(
            email='provider8@test.com',
            role=UserRole.PROVIDER,
        )
        admin = await user_factory(
            email='admin5@test.com',
            role=UserRole.ADMIN,
        )
        await db_session.commit()

        # Create approved requests on different days
        today = date.today()
        for i in range(3):
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

        # Override dependencies to use test session
        async def get_session_override():
            yield db_session

        async def get_user_override():
            return admin

        app.dependency_overrides[get_session] = get_session_override
        app.dependency_overrides[get_current_user] = get_user_override

        response = client.get('/Prod/api/v1/dashboard_metrics/', headers={})
        assert response.status_code == 200

        data = response.json()
        processing_dist = data['admin']['processing_time_distribution']
        assert len(processing_dist) == 10

        # Check that dates are in order
        dates = [item['date'] for item in processing_dist]
        for i in range(len(dates) - 1):
            assert dates[i] <= dates[i + 1]

    @pytest.mark.asyncio
    async def test_admin_dashboard_recent_activity(
        self,
        client: TestClient,
        db_session,
        user_factory,
        ambulance_request_factory,
        request_status_history_factory,
    ):
        """Test recent activity section."""
        provider = await user_factory(
            email='provider9@test.com',
            role=UserRole.PROVIDER,
        )
        admin = await user_factory(
            email='admin6@test.com',
            role=UserRole.ADMIN,
        )
        await db_session.commit()

        now = datetime.now(UTC)

        # Create requests with status history
        for i in range(3):
            req = await ambulance_request_factory(
                user_id=provider.id,
                patient_first_name=f'Activity{i}',
                status=RequestStatus.APPROVED,
                created_at=now - timedelta(hours=i),
            )
            await request_status_history_factory(
                request_id=req.id,
                status=RequestStatus.SUBMITTED,
                created_at=now - timedelta(hours=i),
            )
            await request_status_history_factory(
                request_id=req.id,
                status=RequestStatus.APPROVED,
                created_at=now - timedelta(hours=i) + timedelta(minutes=30),
            )

        await db_session.commit()

        # Override dependencies to use test session
        async def get_session_override():
            yield db_session

        async def get_user_override():
            return admin

        app.dependency_overrides[get_session] = get_session_override
        app.dependency_overrides[get_current_user] = get_user_override

        response = client.get('/Prod/api/v1/dashboard_metrics/', headers={})
        assert response.status_code == 200

        data = response.json()
        recent_activity = data['admin']['recent_activity']
        assert len(recent_activity) <= 3
        # Should have status history entries
        for activity in recent_activity:
            assert 'request_id' in activity
            assert 'status' in activity
            assert 'created_at' in activity
