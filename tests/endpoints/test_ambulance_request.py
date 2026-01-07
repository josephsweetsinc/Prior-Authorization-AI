"""Tests for ambulance request endpoints."""

from datetime import date, datetime
from io import BytesIO
from unittest.mock import AsyncMock, MagicMock, patch

import pytest
from fastapi.testclient import TestClient

from dependencies.auth import get_current_user
from main import app
from models.ambulance_request import RequestStatus, TransportationType
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


@pytest.fixture
def mock_user() -> MagicMock:
    """Create mock user."""
    user = MagicMock()
    user.id = 1
    user.email = 'test@example.com'
    user.role = UserRole.PROVIDER
    user.is_active = True
    return user


@pytest.fixture
def auth_headers(mock_user) -> dict[str, str]:
    """Create auth headers with mock token."""
    return {'Authorization': 'Bearer mock_token'}


class TestAmbulanceRequestEndpoints:
    """Test suite for ambulance request endpoints."""

    @pytest.mark.asyncio
    async def test_upload_files_success(
        self,
        client: TestClient,
        auth_headers,
        db_session,
        user_factory,
    ):
        """Test successful file upload endpoint."""
        user = await user_factory()
        await db_session.commit()

        # Override dependency
        async def get_user_override():
            return user

        app.dependency_overrides[get_current_user] = get_user_override

        with patch(
            'services.ambulance_request.AmbulanceRequestService.upload_files',
            new_callable=AsyncMock,
        ) as mock_upload:
            from schemas.ambulance_request import FileUploadResponseSchema

            mock_upload.return_value = [
                FileUploadResponseSchema(
                    id=1,
                    filename='test.pdf',
                    file_size=1024,
                    content_type='application/pdf',
                    file_url='https://s3.example.com/test.pdf',
                ),
            ]

            files = {
                'files': (
                    'test.pdf',
                    BytesIO(b'PDF content'),
                    'application/pdf',
                )
            }
            response = client.post(
                '/Prod/api/v1/ambulance-request/files',
                files=files,
                headers=auth_headers,
            )

            assert response.status_code == 200
            data = response.json()
            assert isinstance(data, list)
            assert len(data) == 1
            assert data[0]['filename'] == 'test.pdf'

    @pytest.mark.asyncio
    async def test_upload_files_unauthorized(
        self,
        client: TestClient,
    ):
        """Test file upload without authentication."""
        # Don't override dependency - should fail authentication
        files = {
            'files': ('test.pdf', BytesIO(b'PDF content'), 'application/pdf')
        }
        response = client.post(
            '/Prod/api/v1/ambulance-request/files',
            files=files,
        )

        # FastAPI returns 401 for missing auth, not 403
        assert response.status_code in (401, 403)

    @pytest.mark.asyncio
    async def test_create_request_success(
        self,
        client: TestClient,
        auth_headers,
        db_session,
        user_factory,
    ):
        """Test successful request creation endpoint."""
        user = await user_factory()
        await db_session.commit()

        # Override dependency
        async def get_user_override():
            return user

        app.dependency_overrides[get_current_user] = get_user_override

        with patch(
            'services.ambulance_request.AmbulanceRequestService.create_request',
            new_callable=AsyncMock,
        ) as mock_create:
            from datetime import datetime

            from schemas.ambulance_request import (
                AmbulanceRequestResponseSchema,
            )

            mock_create.return_value = AmbulanceRequestResponseSchema(
                id=1,
                user_id=user.id,
                patient_first_name='John',
                patient_last_name='Doe',
                primary_diagnosis='Chronic heart failure',
                status=RequestStatus.SUBMITTED,
                pickup_address='Memorial Dialysis Center',
                destination_address='456 Medical Dr, Springfield, IL 62702',
                transportation_type=TransportationType.AMBULANCE,
                patient_id='1EG4-TE5-MK72',
                created_at=datetime(2025, 1, 1, 0, 0, 0),
                updated_at=datetime(2025, 1, 1, 0, 0, 0),
            )

            request_data = {
                'transportation_type': 'ambulance',
                'patient_first_name': 'John',
                'patient_last_name': 'Doe',
                'patient_date_of_birth': '1980-01-01',
                'patient_id': 'DA123456789HY',
                'date_of_transport': '2025-12-06',
                'time_of_transport': '13:40:00',
                'pickup_address': '123 Main St, Springfield, IL 62701',
                'destination_address': 'Memorial Dialysis Center, 456 Medical Dr',
                'primary_diagnosis': 'Chronic heart failure',
                'medical_justification': 'Patient requires transport',
                'form_number': 'CMS-10344',
                'request_id': 1,
            }

            response = client.post(
                '/Prod/api/v1/ambulance-request/create',
                json=request_data,
                headers=auth_headers,
            )

            assert response.status_code == 200
            data = response.json()
            assert data['id'] == 1
            assert data['patient_first_name'] == 'John'
            assert data['status'] == 'submitted'

    @pytest.mark.asyncio
    async def test_create_request_validation_error(
        self,
        client: TestClient,
        mock_user,
        auth_headers,
    ):
        """Test request creation with validation errors."""

        # Override dependency
        async def get_user_override():
            return mock_user

        app.dependency_overrides[get_current_user] = get_user_override

        # Missing required fields
        request_data = {
            'transportation_type': 'ambulance',
            'patient_first_name': 'John',
            # Missing other required fields
        }

        response = client.post(
            '/Prod/api/v1/ambulance-request/create',
            json=request_data,
            headers=auth_headers,
        )

        assert response.status_code == 422

    @pytest.mark.asyncio
    async def test_get_request_success(
        self,
        client: TestClient,
        auth_headers,
        db_session,
        user_factory,
    ):
        """Test getting request by ID endpoint."""
        user = await user_factory()
        await db_session.commit()

        # Override dependency
        async def get_user_override():
            return user

        app.dependency_overrides[get_current_user] = get_user_override

        with patch(
            'services.ambulance_request.AmbulanceRequestService.get_request_by_id',
            new_callable=AsyncMock,
        ) as mock_get:
            from schemas.ambulance_request import (
                RequestDocumentSchema,
                RequestStatusHistoryResponseSchema,
                RequestWithStatusHistorySchema,
            )

            mock_get.return_value = RequestWithStatusHistorySchema(
                id=1,
                user_id=user.id,
                patient_first_name='John',
                patient_last_name='Doe',
                primary_diagnosis='Chronic heart failure',
                status=RequestStatus.SUBMITTED,
                pickup_address="123 Main St, Springfield, IL 62701",
                destination_address="Memorial Dialysis Center, 456 Medical Dr",
                transportation_type=TransportationType.AMBULANCE,
                patient_id="DA123456789HY",
                created_at=datetime(2025, 1, 1, 0, 0, 0),
                updated_at=datetime(2025, 1, 1, 0, 0, 0),
                status_history=[
                    RequestStatusHistoryResponseSchema(
                        id=1,
                        request_id=1,
                        status=RequestStatus.SUBMITTED,
                        notes='Request submitted',
                        created_at=datetime(2025, 1, 1, 0, 0, 0),
                    )
                ],
                documents=[
                    RequestDocumentSchema(
                        id=1,
                        filename='test.pdf',
                        file_size=1024,
                        content_type='application/pdf',
                        download_url='https://s3.example.com/presigned-url',
                    )
                ],
            )

            response = client.get(
                '/Prod/api/v1/ambulance-request/1',
                headers=auth_headers,
            )

            assert response.status_code == 200
            data = response.json()
            assert data['id'] == 1
            assert 'status_history' in data
            assert 'documents' in data
            assert len(data['documents']) == 1

    @pytest.mark.asyncio
    async def test_get_request_not_found(
        self,
        client: TestClient,
        mock_user,
        auth_headers,
    ):
        """Test getting non-existent request."""
        from exceptions import AmbulanceRequestNotFoundException

        # Override dependency
        async def get_user_override():
            return mock_user

        app.dependency_overrides[get_current_user] = get_user_override

        with patch(
            'services.ambulance_request.AmbulanceRequestService.get_request_by_id',
            new_callable=AsyncMock,
            side_effect=AmbulanceRequestNotFoundException(),
        ):
            response = client.get(
                '/Prod/api/v1/ambulance-request/99999',
                headers=auth_headers,
            )

            assert response.status_code == 404

    @pytest.mark.asyncio
    async def test_get_request_permission_denied(
        self,
        client: TestClient,
        mock_user,
        auth_headers,
    ):
        """Test getting request without permission."""
        from exceptions import AmbulanceRequestPermissionException

        # Override dependency
        async def get_user_override():
            return mock_user

        app.dependency_overrides[get_current_user] = get_user_override

        with patch(
            'services.ambulance_request.AmbulanceRequestService.get_request_by_id',
            new_callable=AsyncMock,
            side_effect=AmbulanceRequestPermissionException(),
        ):
            response = client.get(
                '/Prod/api/v1/ambulance-request/1',
                headers=auth_headers,
            )

            assert response.status_code == 403

    @pytest.mark.asyncio
    async def test_get_user_requests_success(
        self,
        client: TestClient,
        auth_headers,
        db_session,
        user_factory,
    ):
        """Test getting all requests for user endpoint with pagination."""
        user = await user_factory()
        await db_session.commit()

        # Override dependency
        async def get_user_override():
            return user

        app.dependency_overrides[get_current_user] = get_user_override

        with patch(
            'services.ambulance_request.AmbulanceRequestService.get_all_requests',
            new_callable=AsyncMock,
        ) as mock_get:
            from schemas.ambulance_request import (
                AmbulanceRequestResponseSchema,
            )

            mock_get.return_value = (
                [
                    AmbulanceRequestResponseSchema(
                        id=1,
                        user_id=user.id,
                        patient_first_name='John',
                        patient_last_name='Doe',
                        primary_diagnosis='Chronic heart failure',
                        status=RequestStatus.SUBMITTED,
                        pickup_address='Memorial Dialysis Center',
                        destination_address='456 Medical Dr, Springfield, IL 62702',
                        transportation_type=TransportationType.AMBULANCE,
                        patient_id='1EG4-TE5-MK72',
                        created_at=datetime(2025, 1, 1, 0, 0, 0),
                        updated_at=datetime(2025, 1, 1, 0, 0, 0),
                    ),
                    AmbulanceRequestResponseSchema(
                        id=2,
                        user_id=user.id,
                        patient_first_name='Jane',
                        patient_last_name='Smith',
                        primary_diagnosis='Diabetes',
                        status=RequestStatus.PENDING,
                        pickup_address='Memorial Dialysis Center',
                        destination_address='456 Medical Dr, Springfield, IL 62702',
                        transportation_type=TransportationType.AMBULANCE,
                        patient_id='1EG4-TE5-MK72',
                        created_at=datetime(2025, 1, 2, 0, 0, 0),
                        updated_at=datetime(2025, 1, 2, 0, 0, 0),
                    ),
                ],
                2,  # total
                1,  # page
                1,  # total_pages
                2,  # showing
            )

            response = client.get(
                '/Prod/api/v1/ambulance-request/',
                headers=auth_headers,
            )

            assert response.status_code == 200
            data = response.json()
            assert 'items' in data
            assert 'page' in data
            assert 'total' in data
            assert 'showing' in data
            assert 'total_pages' in data
            assert len(data['items']) == 2
            assert data['items'][0]['id'] == 1
            assert data['items'][1]['id'] == 2
            assert data['total'] == 2
            assert data['page'] == 1
            assert data['total_pages'] == 1
            assert data['showing'] == 2

    @pytest.mark.asyncio
    async def test_get_user_requests_empty(
        self,
        client: TestClient,
        auth_headers,
        db_session,
        user_factory,
    ):
        """Test getting requests when user has none."""
        user = await user_factory()
        await db_session.commit()

        # Override dependency
        async def get_user_override():
            return user

        app.dependency_overrides[get_current_user] = get_user_override

        with patch(
            'services.ambulance_request.AmbulanceRequestService.get_all_requests',
            new_callable=AsyncMock,
            return_value=([], 0, 1, 1, 0),  # items, total, page, total_pages, showing
        ):
            response = client.get(
                '/Prod/api/v1/ambulance-request/',
                headers=auth_headers,
            )

            assert response.status_code == 200
            data = response.json()
            assert 'items' in data
            assert len(data['items']) == 0
            assert data['total'] == 0
            assert data['page'] == 1
            assert data['total_pages'] == 1
            assert data['showing'] == 0

    @pytest.mark.asyncio
    async def test_get_user_requests_with_pagination(
        self,
        client: TestClient,
        auth_headers,
        db_session,
        user_factory,
    ):
        """Test getting requests with pagination parameters."""
        user = await user_factory()
        await db_session.commit()

        # Override dependency
        async def get_user_override():
            return user

        app.dependency_overrides[get_current_user] = get_user_override

        with patch(
            'services.ambulance_request.AmbulanceRequestService.get_all_requests',
            new_callable=AsyncMock,
        ) as mock_get:
            from schemas.ambulance_request import (
                AmbulanceRequestResponseSchema,
            )

            mock_get.return_value = (
                [
                    AmbulanceRequestResponseSchema(
                        id=3,
                        user_id=user.id,
                        patient_first_name='Bob',
                        patient_last_name='Johnson',
                        primary_diagnosis='Hypertension',
                        status=RequestStatus.SUBMITTED,
                        pickup_address='Memorial Dialysis Center',
                        destination_address='456 Medical Dr, Springfield, IL 62702',
                        transportation_type=TransportationType.AMBULANCE,
                        patient_id='1EG4-TE5-MK72',
                        created_at=datetime(2025, 1, 3, 0, 0, 0),
                        updated_at=datetime(2025, 1, 3, 0, 0, 0),
                    ),
                ],
                5,  # total
                2,  # page
                3,  # total_pages
                1,  # showing
            )

            response = client.get(
                '/Prod/api/v1/ambulance-request/?page=2',
                headers=auth_headers,
            )

            assert response.status_code == 200
            data = response.json()
            assert len(data['items']) == 1
            assert data['total'] == 5
            assert data['page'] == 2
            assert data['total_pages'] == 3
            assert data['showing'] == 1
            # Verify service was called with correct parameters
            mock_get.assert_called_once_with(
                user=user, page=2, limit=8, search=None, status=None, days=None
            )

    @pytest.mark.asyncio
    async def test_get_user_requests_admin_sees_all(
        self,
        client: TestClient,
        auth_headers,
        db_session,
        user_factory,
    ):
        """Test admin sees all requests."""
        admin = await user_factory(
            email='admin@example.com', role=UserRole.ADMIN
        )
        await db_session.commit()

        # Override dependency
        async def get_user_override():
            return admin

        app.dependency_overrides[get_current_user] = get_user_override

        with patch(
            'services.ambulance_request.AmbulanceRequestService.get_all_requests',
            new_callable=AsyncMock,
        ) as mock_get:
            from schemas.ambulance_request import (
                AmbulanceRequestResponseSchema,
            )

            # Admin should see requests from different users
            mock_get.return_value = (
                [
                    AmbulanceRequestResponseSchema(
                        id=1,
                        user_id=1,
                        patient_first_name='John',
                        patient_last_name='Doe',
                        primary_diagnosis='Chronic heart failure',
                        status=RequestStatus.SUBMITTED,
                        pickup_address='Memorial Dialysis Center',
                        destination_address='456 Medical Dr, Springfield, IL 62702',
                        transportation_type=TransportationType.AMBULANCE,
                        patient_id='1EG4-TE5-MK72',
                        created_at=datetime(2025, 1, 1, 0, 0, 0),
                        updated_at=datetime(2025, 1, 1, 0, 0, 0),
                    ),
                    AmbulanceRequestResponseSchema(
                        id=2,
                        user_id=2,
                        patient_first_name='Jane',
                        patient_last_name='Smith',
                        primary_diagnosis='Diabetes',
                        status=RequestStatus.PENDING,
                        pickup_address='Memorial Dialysis Center',
                        destination_address='456 Medical Dr, Springfield, IL 62702',
                        transportation_type=TransportationType.AMBULANCE,
                        patient_id='1EG4-TE5-MK72',
                        created_at=datetime(2025, 1, 2, 0, 0, 0),
                        updated_at=datetime(2025, 1, 2, 0, 0, 0),
                    ),
                ],
                2,  # total
                1,  # page
                1,  # total_pages
                2,  # showing
            )

            response = client.get(
                '/Prod/api/v1/ambulance-request/',
                headers=auth_headers,
            )

            assert response.status_code == 200
            data = response.json()
            assert len(data['items']) == 2
            assert data['total'] == 2
            assert data['page'] == 1
            assert data['total_pages'] == 1
            assert data['showing'] == 2
            # Verify service was called with admin user
            mock_get.assert_called_once()
            call_args = mock_get.call_args
            assert call_args.kwargs['user'] == admin
