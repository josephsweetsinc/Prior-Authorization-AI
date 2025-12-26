"""Tests for user admin endpoints and self-profile updates."""

from unittest.mock import AsyncMock, patch

import pytest
from fastapi.testclient import TestClient

from dependencies.auth import get_admin_user_from_token, get_current_user
from endpoints.user import update_me
from main import app
from models.user import UserRole
from schemas.user import UpdateUserRequestSchema, UserResponseShema


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
def auth_headers() -> dict[str, str]:
    """Create auth headers with mock token."""
    return {'Authorization': 'Bearer mock_token'}


class TestUserAdminEndpoints:
    """Test suite for user admin and profile endpoints."""

    @pytest.mark.asyncio
    async def test_update_me_success_for_provider(
        self,
        user_factory,
    ):
        """Provider user can successfully update only their own profile via /me."""
        user = await user_factory(role=UserRole.PROVIDER)
        update_data = UpdateUserRequestSchema(name='UpdatedName')

        # Prepare a mock service and verify that endpoint calls it correctly
        mock_service = AsyncMock()
        mock_service.update_user_by_id.return_value = UserResponseShema(
            id=user.id,
            name=update_data.name,
            surname=user.surname,
            email=user.email,
            role=user.role,
            is_active=user.is_active,
        )

        result = await update_me(
            user_data=update_data,
            user=user,
            service=mock_service,
        )

        # Ensure endpoint delegates to service with current user id
        mock_service.update_user_by_id.assert_awaited_once_with(
            user_id=user.id,
            user_data=update_data,
        )
        # And returns the updated user data
        assert result.id == user.id
        assert result.name == update_data.name

    @pytest.mark.asyncio
    async def test_update_me_unauthorized_without_token(
        self,
        client: TestClient,
    ):
        """Updating /me without auth token should be unauthorized."""
        response = client.patch(
            '/Prod/api/v1/user/me',
            json={'name': 'UpdatedName'},
        )

        # FastAPI returns 401 for missing auth, but 403 is also acceptable
        assert response.status_code in (401, 403)

    @pytest.mark.asyncio
    async def test_admin_can_update_provider_by_id(
        self,
        client: TestClient,
        auth_headers: dict[str, str],
        db_session,
        user_factory,
    ):
        """Admin can update another provider user by id."""
        admin = await user_factory(
            email='admin@example.com',
            role=UserRole.ADMIN,
        )
        provider = await user_factory(
            email='provider@example.com',
            role=UserRole.PROVIDER,
        )
        await db_session.commit()

        async def get_admin_override():
            return admin

        app.dependency_overrides[get_admin_user_from_token] = get_admin_override

        update_data = {'name': 'ProviderUpdated'}

        with patch(
            'endpoints.user.UserService.update_user_by_id',
            new_callable=AsyncMock,
        ) as mock_update:
            mock_update.return_value = UserResponseShema(
                id=provider.id,
                name=update_data['name'],
                surname=provider.surname,
                email=provider.email,
                role=provider.role,
                is_active=provider.is_active,
            )

            response = client.patch(
                f'/Prod/api/v1/user/{provider.id}',
                json=update_data,
                headers=auth_headers,
            )

            assert response.status_code == 200
            data = response.json()
            assert data['id'] == provider.id
            assert data['name'] == update_data['name']

            mock_update.assert_awaited_once()
            args, kwargs = mock_update.call_args
            assert kwargs['user_id'] == provider.id
            assert isinstance(kwargs['user_data'], UpdateUserRequestSchema)
            assert kwargs['user_data'].name == update_data['name']

    @pytest.mark.asyncio
    async def test_non_admin_cannot_update_other_user_by_id(
        self,
        client: TestClient,
        auth_headers: dict[str, str],
        db_session,
        user_factory,
    ):
        """Non-admin user must not be able to update other users by id."""
        provider = await user_factory(
            email='provider@example.com',
            role=UserRole.PROVIDER,
        )
        other_user = await user_factory(
            email='other@example.com',
            role=UserRole.PROVIDER,
        )
        await db_session.commit()

        async def get_user_override():
            return provider

        app.dependency_overrides[get_current_user] = get_user_override

        update_data = {'name': 'ShouldNotUpdate'}

        with patch(
            'endpoints.user.UserService.update_user_by_id',
            new_callable=AsyncMock,
        ) as mock_update:
            response = client.patch(
                f'/Prod/api/v1/user/{other_user.id}',
                json=update_data,
                headers=auth_headers,
            )

            # Dependency get_admin_user_from_token should block this request
            assert response.status_code in (401, 403, 404)
            mock_update.assert_not_awaited()
