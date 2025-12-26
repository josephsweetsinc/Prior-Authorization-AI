from typing import Annotated

from fastapi import Depends
from fastapi.params import Security
from fastapi.security import OAuth2PasswordBearer

from config.settings import Settings
from core import get_service
from exceptions import UserHasNoPermissionPermission
from models import User
from models.user import UserRole
from services import UserService
from services.auth import AuthService

settings = Settings.load()
oauth_scheme: OAuth2PasswordBearer = OAuth2PasswordBearer(
    tokenUrl=f'Prod/api/{settings.API_VERSION}/auth/login',
)


async def get_current_user(
    token: Annotated[str, Security(oauth_scheme)],
    auth_service: Annotated[AuthService, Depends(get_service(AuthService))],
    user_service: Annotated[UserService, Depends(get_service(UserService))],
) -> User:
    """Get user from token. Role does not matter."""
    user_id = await auth_service.validate_token_for_user(token)
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
