from typing import Annotated

from fastapi import Depends, Request

from config.settings import Settings
from core import get_service
from exceptions import UserHasNoPermissionPermission, WrongCredentialsException
from models import User
from models.user import UserRole
from services import UserService
from services.auth import AuthService

settings = Settings.load()


async def get_current_user(
    request: Request,
    auth_service: Annotated[AuthService, Depends(get_service(AuthService))],
    user_service: Annotated[UserService, Depends(get_service(UserService))],
) -> User:
    """Get user from token. Reads token from HttpOnly cookie only.

    Args:
        request: FastAPI request object.
        auth_service: Auth service dependency.
        user_service: User service dependency.

    Returns:
        User: Authenticated user.

    Raises:
        WrongCredentialsException: If no valid token is found in cookies.

    """
    cookie_settings = settings.cookie_settings
    access_token: str | None = request.cookies.get(
        cookie_settings.ACCESS_TOKEN_COOKIE_NAME
    )

    if not access_token:
        raise WrongCredentialsException

    user_id = await auth_service.validate_token_for_user(access_token)
    return await user_service.get_user_by_id(user_id)


async def get_admin_user_from_token(
    current_user: Annotated[User, Depends(get_current_user)],
) -> User:
    """Get a user with an admin role from a token.

    Or raise UserHasNoPermissionPermission if role missmatch.
    """
    if current_user.role != UserRole.ADMIN:
        raise UserHasNoPermissionPermission
    return current_user


async def get_provider_user_from_token(
    current_user: Annotated[User, Depends(get_current_user)],
) -> User:
    """Get a user with an provider role from a token.

    Or raise UserHasNoPermissionPermission if role missmatch.
    """
    if current_user.role != UserRole.PROVIDER:
        raise UserHasNoPermissionPermission
    return current_user
