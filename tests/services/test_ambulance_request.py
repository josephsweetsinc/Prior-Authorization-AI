"""Tests for AmbulanceRequestService."""

from datetime import date, time
from io import BytesIO
from unittest.mock import AsyncMock, MagicMock

import pytest
from fastapi import UploadFile

from dao import (
    RequestFileDAO,
    RequestStatusHistoryDAO,
)
from exceptions import (
    AmbulanceRequestAllFilesUploadFailedException,
    AmbulanceRequestEmptyDocumentEmtpyException,
    AmbulanceRequestEmptyDocumentFileNameException,
    AmbulanceRequestInvalidFileIdsException,
    AmbulanceRequestNotFoundException,
    AmbulanceRequestPermissionException,
)
from exceptions.file import IncorrectFileSizeException, UnknownFiletypeException
from models.ambulance_request import RequestStatus, TransportationType
from models.user import UserRole
from schemas.ambulance_request import CreateAmbulanceRequestSchema
from services.ai.extractor import AIExtractionService
from services.ambulance_request import AmbulanceRequestService
from services.aws.actions import S3Actions


class TestAmbulanceRequestService:
    """Test suite for AmbulanceRequestService."""

    @pytest.fixture
    def mock_s3_actions(self) -> MagicMock:
        """Create mock S3Actions."""
        mock = MagicMock(spec=S3Actions)
        mock.upload_file.return_value = (
            'users/1/ambulance-requests/test.pdf',
            'application/pdf',
        )
        mock.get_presigned_url.return_value = (
            'https://s3.example.com/presigned-url'
        )
        return mock

    @pytest.fixture
    def mock_ai_service(self) -> MagicMock:
        """Create mock AIExtractionService."""
        from schemas.ai_extraction import (
            AIExtractionResponse,
            ExtractedTransportationData,
        )

        mock = MagicMock(spec=AIExtractionService)
        mock.extract_data_from_files = AsyncMock(
            return_value=AIExtractionResponse(
                extracted_data=ExtractedTransportationData(
                    transportation_type=None,
                    patient_first_name='John',
                    patient_last_name='Doe',
                    patient_date_of_birth=date(1980, 1, 1),
                    patient_id='DA123456789HY',
                    date_of_transport=None,
                    time_of_transport=None,
                    pickup_address='123 Main St',
                    destination_address='456 Medical Dr',
                    primary_diagnosis='Chronic heart failure',
                    medical_justification='Patient requires transport',
                    form_number='CMS-10344',
                ),
                confidence_score=0.95,
            )
        )
        return mock

    @pytest.fixture
    def service(
        self,
        db_session,
        mock_s3_actions,
        mock_ai_service,
    ) -> AmbulanceRequestService:
        """Create AmbulanceRequestService instance with mocks."""
        return AmbulanceRequestService(
            db_session=db_session,
            s3_actions=mock_s3_actions,
            ai_extraction_service=mock_ai_service,
        )

    @pytest.mark.asyncio
    async def test_upload_file_success(
        self,
        service: AmbulanceRequestService,
        user_factory,
        db_session,
    ):
        """Test successful file upload."""
        user = await user_factory()
        await db_session.commit()

        file_content = b'PDF content here'
        file = UploadFile(
            filename='test.pdf',
            file=BytesIO(file_content),
        )

        result = await service.upload_file(file=file, user_id=user.id)

        assert result.id is not None
        assert result.filename == 'test.pdf'
        assert result.file_size == len(file_content)
        assert result.content_type == 'application/pdf'

        # Verify file record was created
        file_dao = RequestFileDAO(db_session)
        file_record = await file_dao.get_by_id(result.id)
        assert file_record is not None
        assert file_record.filename == 'test.pdf'
        assert file_record.request_id is None  # Not linked yet

    @pytest.mark.asyncio
    async def test_upload_file_no_filename(
        self,
        service: AmbulanceRequestService,
        user_factory,
    ):
        """Test upload file without filename raises exception."""
        user = await user_factory()
        file = UploadFile(filename=None, file=BytesIO(b'content'))

        with pytest.raises(AmbulanceRequestEmptyDocumentFileNameException):
            await service.upload_file(file=file, user_id=user.id)

    @pytest.mark.asyncio
    async def test_upload_file_empty(
        self,
        service: AmbulanceRequestService,
        user_factory,
    ):
        """Test upload empty file raises exception."""
        user = await user_factory()
        file = UploadFile(filename='test.pdf', file=BytesIO(b''))

        with pytest.raises(AmbulanceRequestEmptyDocumentEmtpyException):
            await service.upload_file(file=file, user_id=user.id)

    @pytest.mark.asyncio
    async def test_upload_file_invalid_type(
        self,
        service: AmbulanceRequestService,
        user_factory,
        mock_s3_actions,
    ):
        """Test upload file with invalid type raises exception."""
        user = await user_factory()
        file = UploadFile(filename='test.exe', file=BytesIO(b'content'))
        mock_s3_actions.upload_file.side_effect = UnknownFiletypeException()

        with pytest.raises(UnknownFiletypeException):
            await service.upload_file(file=file, user_id=user.id)

    @pytest.mark.asyncio
    async def test_upload_file_too_large(
        self,
        service: AmbulanceRequestService,
        user_factory,
        mock_s3_actions,
    ):
        """Test upload file that's too large raises exception."""
        user = await user_factory()
        file = UploadFile(filename='test.pdf', file=BytesIO(b'content'))
        mock_s3_actions.upload_file.side_effect = IncorrectFileSizeException()

        with pytest.raises(IncorrectFileSizeException):
            await service.upload_file(file=file, user_id=user.id)

    @pytest.mark.asyncio
    async def test_upload_files_success(
        self,
        service: AmbulanceRequestService,
        user_factory,
        db_session,
    ):
        """Test successful multiple file upload."""
        user = await user_factory()
        await db_session.commit()

        files = [
            UploadFile(filename='file1.pdf', file=BytesIO(b'content1')),
            UploadFile(filename='file2.pdf', file=BytesIO(b'content2')),
        ]

        result = await service.upload_files(files=files, user_id=user.id)

        assert len(result) == 2
        assert result[0].filename == 'file1.pdf'
        assert result[1].filename == 'file2.pdf'

    @pytest.mark.asyncio
    async def test_upload_files_no_files(
        self,
        service: AmbulanceRequestService,
        user_factory,
    ):
        """Test upload files with empty list."""
        user = await user_factory()

        # Empty list should result in empty list
        result = await service.upload_files(files=[], user_id=user.id)

        assert len(result) == 0

    @pytest.mark.asyncio
    async def test_upload_files_all_failed(
        self,
        service: AmbulanceRequestService,
        user_factory,
        mock_s3_actions,
    ):
        """Test upload files when all files fail raises exception."""
        user = await user_factory()
        files = [
            UploadFile(filename='file1.pdf', file=BytesIO(b'content1')),
        ]
        mock_s3_actions.upload_file.side_effect = UnknownFiletypeException()

        with pytest.raises(AmbulanceRequestAllFilesUploadFailedException):
            await service.upload_files(files=files, user_id=user.id)

    @pytest.mark.asyncio
    async def test_upload_files_partial_success(
        self,
        service: AmbulanceRequestService,
        user_factory,
        db_session,
        mock_s3_actions,
        mock_ai_service,
    ):
        """Test upload files when some files succeed and some fail."""
        user = await user_factory()
        await db_session.commit()

        files = [
            UploadFile(filename='file1.pdf', file=BytesIO(b'content1')),
            UploadFile(filename='file2.exe', file=BytesIO(b'content2')),
        ]

        # First file succeeds, second fails
        def upload_side_effect(*args, **kwargs):
            if 'file2.exe' in str(kwargs.get('file_name', '')):
                raise UnknownFiletypeException()
            return ('users/1/ambulance-requests/file1.pdf', 'application/pdf')

        mock_s3_actions.upload_file.side_effect = upload_side_effect

        # Should not raise exception, but log warning
        result = await service.upload_files(files=files, user_id=user.id)

        assert len(result) == 1
        assert result[0].filename == 'file1.pdf'

    @pytest.mark.asyncio
    async def test_create_request_success(
        self,
        service: AmbulanceRequestService,
        user_factory,
        db_session,
        mock_ai_service,
    ):
        """Test successful request creation."""
        user = await user_factory()
        await db_session.commit()

        # Upload files first
        file1 = UploadFile(filename='file1.pdf', file=BytesIO(b'content1'))
        file2 = UploadFile(filename='file2.pdf', file=BytesIO(b'content2'))
        upload_result = await service.upload_files(
            files=[file1, file2], user_id=user.id
        )
        file_ids = [f.id for f in upload_result]
        await db_session.commit()

        # Create draft request with extraction
        from schemas.ambulance_request import CreateAmbulanceRequestParseSchema

        parse_data = CreateAmbulanceRequestParseSchema(file_ids=file_ids)
        draft_result = await service.create_request_with_extraction(
            request_data=parse_data, user_id=user.id
        )
        await db_session.commit()

        # Now create/submit the request
        request_data = CreateAmbulanceRequestSchema(
            request_id=draft_result.request_id,
            transportation_type=TransportationType.AMBULANCE,
            patient_first_name='John',
            patient_last_name='Doe',
            patient_date_of_birth=date(1980, 1, 1),
            patient_id='DA123456789HY',
            date_of_transport=date(2025, 12, 6),
            time_of_transport=time(13, 40),
            pickup_address='123 Main St, Springfield, IL 62701',
            destination_address='Memorial Dialysis Center, 456 Medical Dr',
            primary_diagnosis='Chronic heart failure',
            medical_justification='Patient requires transport',
            form_number='CMS-10344',
        )

        result = await service.create_request(
            user_id=user.id, request_data=request_data
        )

        assert result.id is not None
        assert result.patient_first_name == 'John'
        assert result.status == RequestStatus.SUBMITTED

        # Verify files are linked
        file_dao = RequestFileDAO(db_session)
        files = await file_dao.get_by_request_id(result.id)
        assert len(files) == 2
        assert all(f.request_id == result.id for f in files)

        # Verify status history was created
        status_dao = RequestStatusHistoryDAO(db_session)
        history = await status_dao.get_by_request_id(result.id)
        assert len(history) == 1
        assert history[0].status == RequestStatus.SUBMITTED

    @pytest.mark.asyncio
    async def test_create_request_invalid_draft(
        self,
        service: AmbulanceRequestService,
        user_factory,
        db_session,
    ):
        """Test create request with invalid draft request_id raises exception."""
        user = await user_factory()
        await db_session.commit()

        request_data = CreateAmbulanceRequestSchema(
            request_id=99999,  # Non-existent draft request
            transportation_type=TransportationType.AMBULANCE,
            patient_first_name='John',
            patient_last_name='Doe',
            patient_date_of_birth=date(1980, 1, 1),
            patient_id='DA123456789HY',
            date_of_transport=date(2025, 12, 6),
            time_of_transport=time(13, 40),
            pickup_address='123 Main St',
            destination_address='456 Medical Dr',
            primary_diagnosis=None,
            medical_justification=None,
            form_number=None,
        )

        with pytest.raises(AmbulanceRequestNotFoundException):
            await service.create_request(
                user_id=user.id, request_data=request_data
            )

    @pytest.mark.asyncio
    async def test_get_request_by_id_success(
        self,
        service: AmbulanceRequestService,
        user_factory,
        db_session,
        mock_s3_actions,
    ):
        """Test getting request by ID."""
        user = await user_factory()
        await db_session.commit()

        # Create request
        file1 = UploadFile(filename='file1.pdf', file=BytesIO(b'content1'))
        upload_result = await service.upload_files(
            files=[file1], user_id=user.id
        )
        file_ids = [f.id for f in upload_result]
        await db_session.commit()

        # Create draft
        from schemas.ambulance_request import CreateAmbulanceRequestParseSchema

        parse_data = CreateAmbulanceRequestParseSchema(file_ids=file_ids)
        draft_result = await service.create_request_with_extraction(
            request_data=parse_data, user_id=user.id
        )
        await db_session.commit()

        request_data = CreateAmbulanceRequestSchema(
            request_id=draft_result.request_id,
            transportation_type=TransportationType.AMBULANCE,
            patient_first_name='John',
            patient_last_name='Doe',
            patient_date_of_birth=date(1980, 1, 1),
            patient_id='DA123456789HY',
            date_of_transport=date(2025, 12, 6),
            time_of_transport=time(13, 40),
            pickup_address='123 Main St',
            destination_address='456 Medical Dr',
        )
        created = await service.create_request(
            user_id=user.id, request_data=request_data
        )
        await db_session.commit()

        result = await service.get_request_by_id(
            user=user, request_id=created.id
        )

        assert result.id == created.id
        assert len(result.documents) == 1
        assert result.documents[0].filename == 'file1.pdf'
        assert (
            result.documents[0].download_url
            == 'https://s3.example.com/presigned-url'
        )
        assert len(result.status_history) == 1

    @pytest.mark.asyncio
    async def test_get_request_by_id_not_found(
        self,
        service: AmbulanceRequestService,
        user_factory,
    ):
        """Test getting non-existent request raises exception."""
        user = await user_factory()

        with pytest.raises(AmbulanceRequestNotFoundException):
            await service.get_request_by_id(user=user, request_id=99999)

    @pytest.mark.asyncio
    async def test_get_request_by_id_permission_denied(
        self,
        service: AmbulanceRequestService,
        user_factory,
        db_session,
    ):
        """Test getting request from another user raises exception."""
        user1 = await user_factory(email='user1@example.com')
        user2 = await user_factory(email='user2@example.com')
        await db_session.commit()

        # Create request for user1
        file1 = UploadFile(filename='file1.pdf', file=BytesIO(b'content1'))
        upload_result = await service.upload_files(
            files=[file1], user_id=user1.id
        )
        file_ids = [f.id for f in upload_result]
        await db_session.commit()

        # Create draft
        from schemas.ambulance_request import CreateAmbulanceRequestParseSchema

        parse_data = CreateAmbulanceRequestParseSchema(file_ids=file_ids)
        draft_result = await service.create_request_with_extraction(
            request_data=parse_data, user_id=user1.id
        )
        await db_session.commit()

        request_data = CreateAmbulanceRequestSchema(
            request_id=draft_result.request_id,
            transportation_type=TransportationType.AMBULANCE,
            patient_first_name='John',
            patient_last_name='Doe',
            patient_date_of_birth=date(1980, 1, 1),
            patient_id='DA123456789HY',
            date_of_transport=date(2025, 12, 6),
            time_of_transport=time(13, 40),
            pickup_address='123 Main St',
            destination_address='456 Medical Dr',
        )
        created = await service.create_request(
            user_id=user1.id, request_data=request_data
        )
        await db_session.commit()

        # user2 tries to access user1's request
        with pytest.raises(AmbulanceRequestPermissionException):
            await service.get_request_by_id(user=user2, request_id=created.id)

    @pytest.mark.asyncio
    async def test_get_request_by_id_admin_access(
        self,
        service: AmbulanceRequestService,
        user_factory,
        db_session,
        mock_s3_actions,
    ):
        """Test admin can access any request."""
        user1 = await user_factory(email='user1@example.com')
        admin = await user_factory(
            email='admin@example.com', role=UserRole.ADMIN
        )
        await db_session.commit()

        # Create request for user1
        file1 = UploadFile(filename='file1.pdf', file=BytesIO(b'content1'))
        upload_result = await service.upload_files(
            files=[file1], user_id=user1.id
        )
        file_ids = [f.id for f in upload_result]
        await db_session.commit()

        # Create draft
        from schemas.ambulance_request import CreateAmbulanceRequestParseSchema

        parse_data = CreateAmbulanceRequestParseSchema(file_ids=file_ids)
        draft_result = await service.create_request_with_extraction(
            request_data=parse_data, user_id=user1.id
        )
        await db_session.commit()

        request_data = CreateAmbulanceRequestSchema(
            request_id=draft_result.request_id,
            transportation_type=TransportationType.AMBULANCE,
            patient_first_name='John',
            patient_last_name='Doe',
            patient_date_of_birth=date(1980, 1, 1),
            patient_id='DA123456789HY',
            date_of_transport=date(2025, 12, 6),
            time_of_transport=time(13, 40),
            pickup_address='123 Main St',
            destination_address='456 Medical Dr',
        )
        created = await service.create_request(
            user_id=user1.id, request_data=request_data
        )
        await db_session.commit()

        # Admin can access
        result = await service.get_request_by_id(
            user=admin, request_id=created.id
        )
        assert result.id == created.id

    @pytest.mark.asyncio
    async def test_get_all_requests_provider(
        self,
        service: AmbulanceRequestService,
        user_factory,
        db_session,
    ):
        """Test provider sees only their own requests."""
        user1 = await user_factory(email='user1@example.com')
        user2 = await user_factory(email='user2@example.com')
        await db_session.commit()

        # Create requests for user1
        first_names = ['John', 'Jane', 'Bob']
        for i, first_name in enumerate(first_names):
            file1 = UploadFile(
                filename=f'file{i}.pdf', file=BytesIO(b'content')
            )
            upload_result = await service.upload_files(
                files=[file1], user_id=user1.id
            )
            file_ids = [f.id for f in upload_result]
            await db_session.commit()

            # Create draft
            from schemas.ambulance_request import CreateAmbulanceRequestParseSchema

            parse_data = CreateAmbulanceRequestParseSchema(file_ids=file_ids)
            draft_result = await service.create_request_with_extraction(
                request_data=parse_data, user_id=user1.id
            )
            await db_session.commit()

            request_data = CreateAmbulanceRequestSchema(
                request_id=draft_result.request_id,
                transportation_type=TransportationType.AMBULANCE,
                patient_first_name=first_name,
                patient_last_name='Doe',
                patient_date_of_birth=date(1980, 1, 1),
                patient_id=f'DA12345678{i}HY',
                date_of_transport=date(2025, 12, 6),
                time_of_transport=time(13, 40),
                pickup_address='123 Main St',
                destination_address='456 Medical Dr',
            )
            await service.create_request(
                user_id=user1.id, request_data=request_data
            )
            await db_session.commit()

        # Create request for user2
        file1 = UploadFile(filename='file2.pdf', file=BytesIO(b'content'))
        upload_result = await service.upload_files(
            files=[file1], user_id=user2.id
        )
        file_ids = [f.id for f in upload_result]
        await db_session.commit()

        # Create draft
        from schemas.ambulance_request import CreateAmbulanceRequestParseSchema

        parse_data = CreateAmbulanceRequestParseSchema(file_ids=file_ids)
        draft_result = await service.create_request_with_extraction(
            request_data=parse_data, user_id=user2.id
        )
        await db_session.commit()

        request_data = CreateAmbulanceRequestSchema(
            request_id=draft_result.request_id,
            transportation_type=TransportationType.AMBULANCE,
            patient_first_name='Jane',
            patient_last_name='Smith',
            patient_date_of_birth=date(1980, 1, 1),
            patient_id='DA987654321AB',
            date_of_transport=date(2025, 12, 6),
            time_of_transport=time(13, 40),
            pickup_address='789 Oak Ave',
            destination_address='321 Pine St',
        )
        await service.create_request(
            user_id=user2.id, request_data=request_data
        )
        await db_session.commit()

        # Provider sees only their own requests
        items, total, page, total_pages, showing = await service.get_all_requests(
            user=user1, page=1, limit=8
        )

        assert len(items) == 3
        assert all(req.patient_first_name in first_names for req in items)
        assert all(req.user_id == user1.id for req in items)
        assert total == 3
        assert page == 1
        assert total_pages == 1
        assert showing == 3

    @pytest.mark.asyncio
    async def test_get_all_requests_admin(
        self,
        service: AmbulanceRequestService,
        user_factory,
        db_session,
    ):
        """Test admin sees all requests."""
        user1 = await user_factory(email='user1@example.com')
        user2 = await user_factory(email='user2@example.com')
        admin = await user_factory(
            email='admin@example.com', role=UserRole.ADMIN
        )
        await db_session.commit()

        # Create requests for both users
        for user in [user1, user2]:
            file1 = UploadFile(filename='file.pdf', file=BytesIO(b'content'))
            upload_result = await service.upload_files(
                files=[file1], user_id=user.id
            )
            file_ids = [f.id for f in upload_result]
            await db_session.commit()

            # Create draft
            from schemas.ambulance_request import CreateAmbulanceRequestParseSchema

            parse_data = CreateAmbulanceRequestParseSchema(file_ids=file_ids)
            draft_result = await service.create_request_with_extraction(
                request_data=parse_data, user_id=user.id
            )
            await db_session.commit()

            request_data = CreateAmbulanceRequestSchema(
                request_id=draft_result.request_id,
                transportation_type=TransportationType.AMBULANCE,
                patient_first_name='John',
                patient_last_name='Doe',
                patient_date_of_birth=date(1980, 1, 1),
                patient_id='DA123456789HY',
                date_of_transport=date(2025, 12, 6),
                time_of_transport=time(13, 40),
                pickup_address='123 Main St',
                destination_address='456 Medical Dr',
            )
            await service.create_request(
                user_id=user.id, request_data=request_data
            )
            await db_session.commit()

        # Admin sees all requests
        items, total, page, total_pages, showing = await service.get_all_requests(
            user=admin, page=1, limit=8
        )

        assert len(items) == 2
        user_ids = {req.user_id for req in items}
        assert user_ids == {user1.id, user2.id}
        assert total == 2
        assert page == 1
        assert total_pages == 1
        assert showing == 2

    @pytest.mark.asyncio
    async def test_get_all_requests_with_pagination(
        self,
        service: AmbulanceRequestService,
        user_factory,
        db_session,
    ):
        """Test pagination for getting requests."""
        user = await user_factory()
        await db_session.commit()

        # Create 5 requests
        for i in range(5):
            file1 = UploadFile(
                filename=f'file{i}.pdf', file=BytesIO(b'content')
            )
            upload_result = await service.upload_files(
                files=[file1], user_id=user.id
            )
            file_ids = [f.id for f in upload_result]
            await db_session.commit()

            # Format: 2 letters + 9 digits + 2 letters (e.g., DA123456789HY)
            # Use different patient IDs for each request
            patient_id_digits = f'{100000000 + i:09d}'  # Ensure 9 digits: 100000000, 100000001, etc.
            # Use letters only for first name (pattern requires ^[a-zA-Z]+$)
            first_names = ['John', 'Jane', 'Bob', 'Alice', 'Charlie']
            # Create draft
            from schemas.ambulance_request import CreateAmbulanceRequestParseSchema

            parse_data = CreateAmbulanceRequestParseSchema(file_ids=file_ids)
            draft_result = await service.create_request_with_extraction(
                request_data=parse_data, user_id=user.id
            )
            await db_session.commit()

            request_data = CreateAmbulanceRequestSchema(
                request_id=draft_result.request_id,
                transportation_type=TransportationType.AMBULANCE,
                patient_first_name=first_names[i],
                patient_last_name='Doe',
                patient_date_of_birth=date(1980, 1, 1),
                patient_id=f'DA{patient_id_digits}HY',
                date_of_transport=date(2025, 12, 6),
                time_of_transport=time(13, 40),
                pickup_address='123 Main St',
                destination_address='456 Medical Dr',
            )
            await service.create_request(
                user_id=user.id, request_data=request_data
            )
            await db_session.commit()

        # Get first page
        items, total, page, total_pages, showing = await service.get_all_requests(
            user=user, page=1, limit=2
        )

        assert len(items) == 2
        assert total == 5
        assert page == 1
        assert total_pages == 3
        assert showing == 2
        first_page_ids = {req.id for req in items}

        # Get next page
        items2, total2, page2, total_pages2, showing2 = (
            await service.get_all_requests(user=user, page=2, limit=2)
        )

        # We created 5 requests, first page has 2, so 3 remain
        # Second page should have 2 items (limit=2)
        assert len(items2) == 2
        assert total2 == 5
        assert page2 == 2
        assert total_pages2 == 3
        assert showing2 == 2
        second_page_ids = {req.id for req in items2}

        # Should not overlap
        assert first_page_ids.isdisjoint(second_page_ids), (
            f'Pages overlap: first_page={first_page_ids}, second_page={second_page_ids}'
        )

    @pytest.mark.asyncio
    async def test_update_request_status(
        self,
        service: AmbulanceRequestService,
        user_factory,
        db_session,
    ):
        """Test updating request status."""
        user = await user_factory()
        await db_session.commit()

        # Create request
        file1 = UploadFile(filename='file1.pdf', file=BytesIO(b'content1'))
        upload_result = await service.upload_files(
            files=[file1], user_id=user.id
        )
        file_ids = [f.id for f in upload_result]
        await db_session.commit()

        # Create draft
        from schemas.ambulance_request import CreateAmbulanceRequestParseSchema

        parse_data = CreateAmbulanceRequestParseSchema(file_ids=file_ids)
        draft_result = await service.create_request_with_extraction(
            request_data=parse_data, user_id=user.id
        )
        await db_session.commit()

        request_data = CreateAmbulanceRequestSchema(
            request_id=draft_result.request_id,
            transportation_type=TransportationType.AMBULANCE,
            patient_first_name='John',
            patient_last_name='Doe',
            patient_date_of_birth=date(1980, 1, 1),
            patient_id='DA123456789HY',
            date_of_transport=date(2025, 12, 6),
            time_of_transport=time(13, 40),
            pickup_address='123 Main St',
            destination_address='456 Medical Dr',
        )
        created = await service.create_request(
            user_id=user.id, request_data=request_data
        )
        await db_session.commit()

        # Update status
        updated = await service.update_request_status(
            request_id=created.id,
            new_status=RequestStatus.APPROVED,
            notes='Request approved by admin',
        )

        assert updated.status == RequestStatus.APPROVED

        # Verify status history was created
        status_dao = RequestStatusHistoryDAO(db_session)
        history = await status_dao.get_by_request_id(created.id)
        assert len(history) == 2
        assert history[0].status == RequestStatus.SUBMITTED
        assert history[1].status == RequestStatus.APPROVED
        assert history[1].notes == 'Request approved by admin'

    @pytest.mark.asyncio
    async def test_update_request_status_not_found(
        self,
        service: AmbulanceRequestService,
    ):
        """Test updating status for non-existent request raises exception."""
        with pytest.raises(AmbulanceRequestNotFoundException):
            await service.update_request_status(
                request_id=99999,
                new_status=RequestStatus.APPROVED,
            )
