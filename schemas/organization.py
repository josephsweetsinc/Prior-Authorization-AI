from typing import Annotated

from pydantic import BaseModel, ConfigDict, Field, model_validator


class UpdateOrganizationRequestSchema(BaseModel):
    """Organization update request schema."""

    provider_type: Annotated[
        str | None,
        Field(
            None,
            max_length=512,
            examples=['Hospital', 'Clinic'],
            description='Type of provider',
        ),
    ]
    professional_id: Annotated[
        str | None,
        Field(
            None,
            max_length=128,
            examples=['PROF123456'],
            description='Professional ID',
        ),
    ]
    medic_name: Annotated[
        str | None,
        Field(
            None,
            max_length=128,
            examples=['Dr. John Smith'],
            description='Medic name',
        ),
    ]

    @model_validator(mode='after')
    def validate_at_least_one_field(self) -> 'UpdateOrganizationRequestSchema':
        """Validate that at least one field is provided for update."""
        if (
            self.provider_type is None
            and self.professional_id is None
            and self.medic_name is None
        ):
            raise ValueError(  # noqa: TRY003
                'At least one field (provider_type, professional_id, or medic_name) must be provided'
            )
        return self


class OrganizationResponseSchema(BaseModel):
    """Organization response schema."""

    id: int
    user_id: int
    provider_type: str | None
    professional_id: str | None
    medic_name: str | None

    model_config = ConfigDict(from_attributes=True)
