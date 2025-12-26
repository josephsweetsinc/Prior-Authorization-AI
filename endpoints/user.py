import logging
from typing import Annotated

from fastapi import APIRouter, Depends

from core import get_service
from dependencies import get_admin_user_from_token, get_current_user
from models import User
from schemas import (
    CreateUserByAdminRequestSchema,
    UpdateUserRequestSchema,
    UserResponseShema,
)
from services import UserService

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
        "Retrieve the current authenticated user's profile information."
    ),
    tags=['me'],
)
async def get_me(
    user: Annotated[User, Depends(get_current_user)],
) -> UserResponseShema:
    """Get information about current user.

    Args:
        user (User): Current authenticated user from token.

    Returns:
        UserResponseShema: Schema representing the user.

    """
    return UserResponseShema.model_validate(user)


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
