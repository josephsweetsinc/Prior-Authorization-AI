from typing import Annotated

from pydantic import BaseModel, ConfigDict, EmailStr, Field

from core import EmailMixinSchema
from models.user import UserRole


class _AccessTokenMixinSchema(BaseModel):
    access_token: Annotated[
        str,
        Field(
            examples=[
                'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjMiLCJlbWFpb'
                'CI6InVzZXJAZXhhbXBsZS5jb20iLCJyb2xlIjoiVVNFUiIsImV4cCI6MTczNDc'
                '5MjAwMCwiaWF0IjoxNzM0Nzg4NDAwfQ.8F3dQZyKZcW9z1nqzQz0YxZ5z4C6kE'
                '1xk9P4sR1L2Xs'
            ]
        ),
    ]


class _RefreshTokenMixinSchema(BaseModel):
    refresh_token: Annotated[
        str,
        Field(
            examples=[
                'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjMiLCJ0eXBlI'
                'joicmVmcmVzaCIsImV4cCI6MTczNzM4MDQwMCwiaWF0IjoxNzM0Nzg4NDAwfQ.'
                'xL9J2dE8QZ7M3Pq0kF2T4bR5C8YHnA1VwS6UeZ'
            ]
        ),
    ]


class TokenSchemas(_AccessTokenMixinSchema, _RefreshTokenMixinSchema):
    """Schema representing access and refresh tokens.

    This schema is returned after successful authentication and contains
    the JWT tokens needed for API access. The access token is short-lived
    and should be used for API requests, while the refresh token is long-lived
    and used to obtain new access tokens.

    Attributes:
        access_token (str): JWT access token for authentication.
            Expires in 15 minutes by default.
        refresh_token (str): JWT refresh token for obtaining new access tokens.
            Expires in 30 days by default.
        token_type (str): Type of token, always 'Bearer' for this API.

    Example:
        ```json
        {
            "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
            "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
            "token_type": "Bearer"
        }
        ```

    """

    user_role: UserRole
    token_type: str = 'Bearer'  # noqa: S105


class RefreshTokenRequestSchema(_RefreshTokenMixinSchema):
    """Schema representing a request to refresh an access token.

    Attributes:
        refresh_token (str): The refresh token provided by the client.

    """

    model_config = ConfigDict(from_attributes=True)


class PasswordResetRequestSchema(EmailMixinSchema):
    """Schema for requesting password reset.

    Attributes:
        email: User's email address.

    """


class PasswordResetVerifySchema(BaseModel):
    """Schema for verifying password reset code.

    Attributes:
        code: 5-digit password reset code.

    """

    code: Annotated[
        str,
        Field(
            min_length=5,
            max_length=5,
            pattern=r'^\d{5}$',
            examples=['12345'],
        ),
    ]

    model_config = ConfigDict(from_attributes=True)


class PasswordResetConfirmSchema(BaseModel):
    """Schema for confirming password reset.

    Attributes:
        email: User's email address.
        new_password: New password.

    """

    email: Annotated[
        EmailStr,
        Field(
            pattern=r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$',
            examples=['user@example.com'],
        ),
    ]
    new_password: Annotated[
        str,
        Field(
            min_length=8,
            max_length=20,
            pattern=r'^(?=.*[A-Z])(?=.*\d)(?!.*\s).{8,}$',
            examples=['NewStrongPass9'],
        ),
    ]

    model_config = ConfigDict(from_attributes=True)


class PasswordChangeRequestSchema(BaseModel):
    """Schema for changing user password."""

    old_password: Annotated[
        str,
        Field(
            min_length=8,
            max_length=20,
            pattern=r'^(?=.*[A-Z])(?=.*\d)(?!.*\s).{8,}$',
            examples=['StrongP@ss9'],
        ),
    ]
    new_password: Annotated[
        str,
        Field(
            min_length=8,
            max_length=20,
            pattern=r'^(?=.*[A-Z])(?=.*\d)(?!.*\s).{8,}$',
            examples=['NewStrongP@ss9'],
        ),
    ]
