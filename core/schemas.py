from typing import Annotated

from pydantic import BaseModel, EmailStr, Field


class PasswordMixinSchema(BaseModel):
    """Base schema for password validation."""

    password: Annotated[
        str,
        Field(
            min_length=8,
            max_length=20,
            pattern=r'^(?=.*[A-Z])(?=.*\d)(?!.*\s).{8,}$',
            examples=['StrongP@ss9'],
        ),
    ]


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
