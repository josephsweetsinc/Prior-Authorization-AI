import logging
from typing import Annotated

from fastapi import APIRouter, Depends, Query

from core import exception_handler, get_service
from dependencies import get_admin_user_from_token, get_current_user
from models import User
from models.user import UserRole
from schemas import (
    CreateUserByAdminRequestSchema,
    OrganizationResponseSchema,
    UpdateUserRequestSchema,
    UserResponseShema,
    UsersListResponseSchema,
)
from services import OrganizationService, UserService

logger = logging.getLogger(__name__)


user_router = APIRouter()


@user_router.post(
    path='/',
    summary='Create new user by admin',
    description='Create new user(admin only).',
    response_model=UserResponseShema,
    dependencies=[Depends(get_admin_user_from_token)],
    tags=['admin'],
)
async def create_user(
    user_data: CreateUserByAdminRequestSchema,
    service: Annotated[UserService, Depends(get_service(UserService))],
) -> UserResponseShema:
    """Create a new user for admin.

    Args:
        user_data:   User data.
        service: User service

    Returns:
     UserResponseShema: Schema representing the user.

    """
    new_user = await service.create_new_user(
        user_data=user_data, user_role=user_data.role
    )
    return UserResponseShema.model_validate(new_user)


@user_router.delete(
    path='/{user_id}',
    summary='Delete user by admin',
    description='Delete a user(admin only).',
    status_code=201,
    tags=['admin'],
)
async def delete_user(
    user_id: int,
    admin_user: Annotated[User, Depends(get_admin_user_from_token)],
    service: Annotated[UserService, Depends(get_service(UserService))],
) -> UserResponseShema:
    """Delete a user for admin.

    Args:
        user_id: User id data.
        admin_user: Admin user.
        service: User service

    Returns: 201 status code.

    """
    new_user = await service.delete_user_by_id(
        current_user=admin_user, user_id=user_id
    )
    return UserResponseShema.model_validate(new_user)


@user_router.patch(
    path='/{user_id}',
    summary='Update another user info by admin',
    description=(
        "Update the current authenticated user's profile information. "
        'At least one field (name, surname, or email) must be provided.'
    ),
    response_model=UserResponseShema,
    dependencies=[Depends(get_admin_user_from_token)],
    tags=['admin'],
)
async def update_user(
    user_id: int,
    user_data: UpdateUserRequestSchema,
    service: Annotated[UserService, Depends(get_service(UserService))],
) -> UserResponseShema:
    """Update a user for admin.

    Args:
        user_id: User id data.
        user_data: Updated user data.
        service: User service.

    Returns:
        UserResponseShema: Schema representing updated the user info.

    """
    return await service.update_user_by_id(
        user_id=user_id,
        user_data=user_data,
    )


@user_router.get(
    path='/me',
    summary='Get current user profile',
    description=(
        "Retrieve the current authenticated user's profile information "
        'including organization data if available.'
    ),
    tags=['me'],
)
async def get_me(
    user: Annotated[User, Depends(get_current_user)],
    organization_service: Annotated[
        OrganizationService, Depends(get_service(OrganizationService))
    ],
) -> UserResponseShema:
    """Get information about current user.

    Args:
        user (User): Current authenticated user from token.
        organization_service: Organization service.

    Returns:
        UserResponseShema: Schema representing the user with organization data.

    """
    # Load organization if exists
    organization = await organization_service.get_organization_by_user_id(
        user.id
    )

    # Build response
    response_data = {
        'id': user.id,
        'name': user.name,
        'surname': user.surname,
        'email': user.email,
        'role': user.role,
        'is_active': user.is_active,
        'organization': (
            OrganizationResponseSchema.model_validate(organization)
            if organization
            else None
        ),
    }

    return UserResponseShema.model_validate(response_data)


@user_router.patch(
    path='/me',
    summary='Update current user profile',
    description=(
        "Update the current authenticated user's profile information. "
        'At least one field (name, surname, or email) must be provided.'
    ),
    response_model=UserResponseShema,
    tags=['me'],
)
async def update_me(
    user_data: UpdateUserRequestSchema,
    user: Annotated[User, Depends(get_current_user)],
    service: Annotated[UserService, Depends(get_service(UserService))],
) -> UserResponseShema:
    """Update the current authenticated user's profile.

    Args:
        user_data (UpdateUserRequestSchema): Schema with user data to update.
        user (User): Current authenticated user from token.
        service (UserService): Service for user-related operations.

    Returns:
        UserResponseShema: Schema representing the updated user.

    """
    return await service.update_user_by_id(
        user_id=user.id,
        user_data=user_data,
    )


@user_router.delete(
    path='/me',
    summary='Delete current user profile',
    description=(
        "Delete the current authenticated user's profile information."
    ),
    tags=['me'],
)
async def delete_me(
    user: Annotated[User, Depends(get_current_user)],
    service: Annotated[UserService, Depends(get_service(UserService))],
) -> UserResponseShema:
    """Delete the current authenticated user's profile.

    Args:
        user (User): Current authenticated user from token.
        service (UserService): Service for user-related operations.

    Returns:
        UserResponseShema: Schema representing the deleted user.

    """
    return await service.delete_user_by_id(current_user=user, user_id=user.id)


@user_router.get(
    '/',
    description='Get all users with pagination (admin only)',
    response_model=UsersListResponseSchema,
    dependencies=[Depends(get_admin_user_from_token)],
    tags=['admin'],
)
@exception_handler
async def get_all_users(
    service: Annotated[UserService, Depends(get_service(UserService))],
    page: int = Query(
        1,
        ge=1,
        description='Page number (1-based)',
        examples=[1],
    ),
    search: str | None = Query(
        None,
        description='Search by user name, surname, or email',
        examples=['John'],
    ),
    role: list[UserRole] | None = Query(  # noqa: B008
        None,
        description='Filter by user roles. Can specify multiple roles.',
        examples=[['admin'], ['provider'], ['admin', 'provider']],
    ),
) -> UsersListResponseSchema:
    """Get all users with pagination.

    Only admin users can access this endpoint.

    Args:
        page: Page number (1-based).
        search: Search term for user name, surname, or email.
        role: List of user roles to filter by.
        service: User service.

    Returns:
        UsersListResponseSchema: Paginated list of users.

    """
    (
        items,
        total,
        current_page,
        total_pages,
        showing,
    ) = await service.get_all_users(
        page=page,
        limit=8,
        search=search,
        roles=role,
    )
    return UsersListResponseSchema(
        items=items,
        page=current_page,
        total=total,
        showing=showing,
        total_pages=total_pages,
    )
