from typing import Annotated

from pydantic import BaseModel, ConfigDict, EmailStr, Field, model_validator

from core import (
    EmailMixinSchema,
    NameMixinSchema,
    PasswordMixinSchema,
    SurnameMixinSchema,
)
from models.user import UserRole


class _BaseUserRequestSchema(
    NameMixinSchema, SurnameMixinSchema, EmailMixinSchema, PasswordMixinSchema
):
    """Base schema for user-related requests.

    This schema combines common user fields and validation rules
    using mixins. It is intended to be used as a parent class
    for more specific user request schemas (e.g., registration,
    password reset, admin user creation).

    Notes
    -----
    - This is an internal base schema. Do not use it directly in API responses.
    - It provides unified validation rules via mixins, preventing duplication.

    """


class CreateUserRequestSchema(_BaseUserRequestSchema):
    """User creation request schema."""

    phone_number: Annotated[
        str,
        Field(
            min_length=10,
            max_length=15,
            pattern=r'^1\d{10}$',
            examples=['12345678900'],
        ),
    ]
    position: Annotated[
        str,
        Field(min_length=3, max_length=64, examples=['Doctor']),
    ]
    place_of_work: Annotated[
        str,
        Field(min_length=3, max_length=64, examples=['Hospital']),
    ]


class CreateUserByAdminRequestSchema(_BaseUserRequestSchema):
    """Create user with role."""

    role: UserRole


class UpdateUserRequestSchema(BaseModel):
    """User update request schema."""

    name: Annotated[
        str | None,
        Field(
            None,
            min_length=3,
            max_length=15,
            pattern=r'^[a-zA-Z]+$',
            examples=['John'],
        ),
    ]
    surname: Annotated[
        str | None,
        Field(
            None,
            min_length=3,
            max_length=15,
            pattern=r'^[a-zA-Z]+$',
            examples=['Doe'],
        ),
    ]
    email: Annotated[
        EmailStr | None,
        Field(
            None,
            min_length=3,
            max_length=30,
            pattern=r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$',
            examples=['admin@admin.com'],
        ),
    ]

    @model_validator(mode='after')
    def validate_at_least_one_field(self) -> 'UpdateUserRequestSchema':
        """Validate that at least one field is provided for update."""
        if self.name is None and self.surname is None and self.email is None:
            raise ValueError(  # noqa: TRY003
                'At least one field (name, surname, or email) must be provided'
            )
        return self


class UserResponseShema(BaseModel):
    """User response schema."""

    id: int
    name: str
    surname: str
    email: str
    role: UserRole
    is_active: bool
    model_config = ConfigDict(from_attributes=True)
