from typing import Annotated

from pydantic import BaseModel, EmailStr, Field, field_validator


def validate_password_strength(value: str) -> str:
    """Validate password against business rules.

    Rules:
    - Length between 8 and 20 characters
    - No whitespace characters
    - At least one uppercase letter
    - At least one digit
    """
    if not (8 <= len(value) <= 20):
        raise ValueError('Password must be between 8 and 20 characters long')

    if any(ch.isspace() for ch in value):
        raise ValueError('Password must not contain whitespace characters')

    if not any(ch.isupper() for ch in value):
        raise ValueError('Password must contain at least one uppercase letter')

    if not any(ch.isdigit() for ch in value):
        raise ValueError('Password must contain at least one digit')

    return value


class PasswordMixinSchema(BaseModel):
    """Base schema for password validation."""

    password: Annotated[
        str,
        Field(
            min_length=8,
            max_length=20,
            pattern=r'^\S{8,20}$',
            examples=['StrongP@ss9'],
        ),
    ]

    @field_validator('password')
    @classmethod
    def _validate_password(cls, value: str) -> str:
        return validate_password_strength(value)


class NameMixinSchema(BaseModel):
    """Base schema for name validation."""

    name: Annotated[
        str,
        Field(
            min_length=3,
            max_length=15,
            examples=[
                'John',
            ],
        ),
    ]


class SurnameMixinSchema(BaseModel):
    """Base schema for surname validation."""

    surname: Annotated[
        str,
        Field(
            min_length=3,
            max_length=15,
            pattern=r'^[a-zA-Z]+$',
            examples=[
                'Doe',
            ],
        ),
    ]


class EmailMixinSchema(BaseModel):
    """Base schema for email validation."""

    email: Annotated[
        EmailStr,
        Field(
            min_length=3,
            max_length=254,
            pattern=r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$',
            examples=[
                'admin@admin.com',
            ],
        ),
    ]
