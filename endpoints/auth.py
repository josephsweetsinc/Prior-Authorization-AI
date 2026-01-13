from datetime import timedelta
from typing import Annotated

from fastapi import APIRouter, Depends, Query, Request, Response
from fastapi.security import OAuth2PasswordRequestForm

from config.settings import Settings
from core import get_service
from dependencies import get_current_user
from models import User
from schemas import (
    CreateUserRequestSchema,
    PasswordChangeRequestSchema,
    PasswordResetConfirmSchema,
    PasswordResetRequestSchema,
    PasswordResetVerifySchema,
    TokenSchemas,
    UserResponseShema,
)
from services import UserService
from services.auth import AuthService
from services.password import PasswordService

auth_router = APIRouter()
settings = Settings.load()


@auth_router.post(
    path='/signup',
    description='Create new user.',
    response_model=UserResponseShema,
)
async def signup_user(
    user_data: CreateUserRequestSchema,
    service: Annotated[UserService, Depends(get_service(UserService))],
) -> UserResponseShema:
    """Create a new user in the system.

    Args:
        user_data (CreateUserRequestSchema): Schema with new user data.
        service (UserService): Service for user-related operations.

    Returns:
        UserResponseShema: Schema representing the newly created user.

    """
    return await service.create_new_user(user_data=user_data)


@auth_router.post(
    path='/login',
    response_model=TokenSchemas,
    summary='User login',
    description=(
        'Authenticate user with email and password. '
        'Tokens are returned in response body AND set as HttpOnly cookies. '
        'Uses OAuth2PasswordRequestForm (form-data) for Swagger compatibility.'
    ),
)
async def login_user(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    response: Response,
    remember_me: Annotated[bool, Query(description='Remember me flag for longer session')] = False,
    service: Annotated[AuthService, Depends(get_service(AuthService))] = None,
) -> TokenSchemas:
    """Authenticate user and return tokens. Also sets HttpOnly cookies.

    Uses OAuth2PasswordRequestForm (form-data) for Swagger UI compatibility.
    The remember_me parameter can be passed as a query parameter.

    Args:
        form_data (OAuth2PasswordRequestForm): Username (email) and password.
        response (Response): FastAPI response object for setting cookies.
        remember_me (bool): Optional remember me flag (default: False).
        service (AuthService): Auth service dependency.

    Returns:
        TokenSchemas: Access and refresh tokens with type (also set in cookies).

    """
    user = await service.auth_user(
        email=form_data.username,  # OAuth2 uses 'username' field for email
        password=form_data.password,
    )
    token: TokenSchemas = await service.create_token(
        author_id=user.id, user_role=user.role, remember_me=remember_me
    )

    # Calculate cookie expiration
    cookie_settings = settings.cookie_settings
    if remember_me:
        max_age = int(
            timedelta(days=settings.token_settings.REFRESH_TOKEN_EXPIRE_DAYS_REMEMBER_ME).total_seconds()
        )
    else:
        max_age = int(
            timedelta(days=settings.token_settings.REFRESH_TOKEN_EXPIRE_DAYS).total_seconds()
        )

    # Set access token cookie
    response.set_cookie(
        key=cookie_settings.ACCESS_TOKEN_COOKIE_NAME,
        value=token.access_token,
        max_age=max_age,
        httponly=True,
        secure=cookie_settings.SECURE,
        samesite=cookie_settings.SAME_SITE,
        domain=cookie_settings.DOMAIN,
    )

    # Set refresh token cookie
    response.set_cookie(
        key=cookie_settings.REFRESH_TOKEN_COOKIE_NAME,
        value=token.refresh_token,
        max_age=max_age,
        httponly=True,
        secure=cookie_settings.SECURE,
        samesite=cookie_settings.SAME_SITE,
        domain=cookie_settings.DOMAIN,
    )

    return token


@auth_router.post(
    path='/refresh',
    response_model=TokenSchemas,
    summary='Refresh access token',
    description='Get new access and refresh tokens. Reads refresh token from HttpOnly cookie only.',
)
async def refresh_token(
    request: Request,
    response: Response,
    service: Annotated[AuthService, Depends(get_service(AuthService))] = None,
) -> TokenSchemas:
    """Refresh access and refresh tokens using a valid refresh token from cookie.

    Args:
        request (Request): FastAPI request object for reading cookies.
        response (Response): FastAPI response object for setting cookies.
        service (AuthService): Auth service dependency.

    Returns:
        TokenSchemas: New access and refresh tokens (also set in cookies).

    """
    from exceptions import RefreshTokenException

    cookie_settings = settings.cookie_settings
    refresh_token_value: str | None = request.cookies.get(
        cookie_settings.REFRESH_TOKEN_COOKIE_NAME
    )

    if not refresh_token_value:
        raise RefreshTokenException

    token: TokenSchemas = await service.refresh_token(
        refresh_token=refresh_token_value,
    )

    # Calculate max_age from the new refresh token's expiration
    from services.jwt.token import TokenManager
    from datetime import UTC, datetime

    decoded = TokenManager.decode_refresh_token(token.refresh_token)
    exp_timestamp = int(decoded.get('exp', 0))
    if exp_timestamp:
        exp_datetime = datetime.fromtimestamp(exp_timestamp, tz=UTC)
        now = datetime.now(UTC)
        max_age = int((exp_datetime - now).total_seconds())
        max_age = max(0, max_age)
    else:
        max_age = int(
            timedelta(days=settings.token_settings.REFRESH_TOKEN_EXPIRE_DAYS_REMEMBER_ME).total_seconds()
        )

    # Set new access token cookie
    response.set_cookie(
        key=cookie_settings.ACCESS_TOKEN_COOKIE_NAME,
        value=token.access_token,
        max_age=max_age,
        httponly=True,
        secure=cookie_settings.SECURE,
        samesite=cookie_settings.SAME_SITE,
        domain=cookie_settings.DOMAIN,
    )

    # Set new refresh token cookie
    response.set_cookie(
        key=cookie_settings.REFRESH_TOKEN_COOKIE_NAME,
        value=token.refresh_token,
        max_age=max_age,
        httponly=True,
        secure=cookie_settings.SECURE,
        samesite=cookie_settings.SAME_SITE,
        domain=cookie_settings.DOMAIN,
    )

    return token


@auth_router.delete(
    path='/logout',
    status_code=204,
    summary='User logout',
    description='Invalidate the refresh token from HttpOnly cookie and clear cookies.',
)
async def logout_user(
    request: Request,
    response: Response,
    service: Annotated[AuthService, Depends(get_service(AuthService))] = None,
) -> None:
    """Invalidate the refresh token from cookie and clear cookies.

    Args:
        request (Request): FastAPI request object for reading cookies.
        response (Response): FastAPI response object for clearing cookies.
        service (AuthService): Auth service dependency.

    Returns:
        None

    """
    cookie_settings = settings.cookie_settings
    refresh_token_value: str | None = request.cookies.get(
        cookie_settings.REFRESH_TOKEN_COOKIE_NAME
    )

    if refresh_token_value:
        await service.logout_user(refresh_token_value)

    # Clear cookies
    response.delete_cookie(
        key=cookie_settings.ACCESS_TOKEN_COOKIE_NAME,
        domain=cookie_settings.DOMAIN,
        samesite=cookie_settings.SAME_SITE,
        secure=cookie_settings.SECURE,
    )
    response.delete_cookie(
        key=cookie_settings.REFRESH_TOKEN_COOKIE_NAME,
        domain=cookie_settings.DOMAIN,
        samesite=cookie_settings.SAME_SITE,
        secure=cookie_settings.SECURE,
    )


@auth_router.post(
    path='/password-reset/request',
    status_code=204,
    summary='Request password reset',
    description='Request password reset by sending a 5-digit code'
    ' to user email.',
)
async def request_password_reset(
    request_data: PasswordResetRequestSchema,
    service: Annotated[PasswordService, Depends(get_service(PasswordService))],
) -> None:
    """Request password reset by sending code to user's email.

    Args:
        request_data (PasswordResetRequestSchema): Schema containing user email.
        service (PasswordService): Password reset service dependency.

    Returns:
        None

    """
    await service.request_password_reset(email=request_data.email)


@auth_router.post(
    path='/password-reset/verify',
    status_code=204,
    summary='Verify password reset code',
    description='Verify the OTP code sent to email before resetting password.',
)
async def verify_password_reset_code(
    request_data: PasswordResetVerifySchema,
    service: Annotated[PasswordService, Depends(get_service(PasswordService))],
) -> None:
    """Verify password reset code.

    Args:
        request_data (PasswordResetVerifySchema): Schema containing code.
        service (PasswordService): Password reset service dependency.

    Returns:
        None

    """
    await service.verify_code(code=request_data.code)


@auth_router.post(
    path='/password-reset/confirm',
    status_code=204,
    summary='Confirm password reset',
    description='Reset password using verified code. '
    'Code must be verified first and not older than 5 minutes.',
)
async def confirm_password_reset(
    request_data: PasswordResetConfirmSchema,
    service: Annotated[PasswordService, Depends(get_service(PasswordService))],
) -> None:
    """Reset password using verified code.

    Args:
        request_data (PasswordResetConfirmSchema): Schema containing email
            and new password. Code must be verified first via /verify
            and not older than 5 minutes.
        service (PasswordService): Password reset service dependency.

    Returns:
        None

    """
    await service.reset_password(
        email=request_data.email,
        new_password=request_data.new_password,
    )


@auth_router.post(
    path='/password-change',
    status_code=204,
    summary='Change password',
    description='Change password using current password.',
)
async def change_password(
    user: Annotated[User, Depends(get_current_user)],
    request_data: PasswordChangeRequestSchema,
    service: Annotated[PasswordService, Depends(get_service(PasswordService))],
) -> None:
    """Change password.

    Args:
        user: (User): Current authenticated user.
        request_data (PasswordResetConfirmSchema): Schema containing code
            and new password.
        service (PasswordService): Password reset service dependency.

    Returns:
        None

    """
    await service.change_password(
        user=user,
        old_password=request_data.old_password,
        new_password=request_data.new_password,
    )
