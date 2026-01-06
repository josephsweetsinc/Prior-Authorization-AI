from datetime import date, datetime, time
from typing import Annotated

from pydantic import BaseModel, ConfigDict, Field, computed_field

from models.ambulance_request import (
    AmbulatoryStatus,
    RequestStatus,
    TransportationType,
)
from schemas.ai_extraction import ExtractedTransportationData


class AmbulanceRequestsListResponseSchema(BaseModel):
    """Response schema for paginated list of requests.

    Attributes:
        items: List of ambulance requests.
        page: Current page number.
        total: Total number of requests.
        showing: Number of items shown on current page.
        total_pages: Total number of pages.

    """

    items: list['AmbulanceRequestResponseSchema'] = Field(
        description='List of ambulance requests',
    )
    page: int = Field(
        description='Current page number',
        examples=[1],
    )
    total: int = Field(
        description='Total number of requests',
        examples=[325],
    )
    showing: int = Field(
        description='Number of items shown on current page',
        examples=[8],
    )
    total_pages: int = Field(
        description='Total number of pages',
        examples=[41],
    )


class FileUploadResponseSchema(BaseModel):
    """Response schema for uploaded file."""

    id: Annotated[
        int,
        Field(
            description='Unique identifier of the uploaded file.', examples=[1]
        ),
    ]
    filename: Annotated[
        str,
        Field(
            description='Original name of the uploaded file.',
            examples=['medical_data.pdf'],
        ),
    ]
    file_size: Annotated[
        int,
        Field(
            description='Size of the uploaded file in bytes.', examples=[254920]
        ),
    ]
    content_type: Annotated[
        str,
        Field(
            description='MIME type detected for the uploaded file.',
            examples=['application/pdf'],
        ),
    ]
    file_url: Annotated[
        str,
        Field(
            description='Presigned URL for downloading the uploaded file.',
            examples=['https://s3.amazonaws.com/bucket/file.pdf'],
        ),
    ]
    model_config = ConfigDict(from_attributes=True)


class FileUploadWithExtractionResponseSchema(BaseModel):
    """Response schema for file upload with AI-extracted data."""

    extracted_data: 'ExtractedTransportationData' = Field(
        description='Data extracted by AI from uploaded documents',
    )

    @computed_field
    def is_complete(self) -> bool:
        """Check if all required fields are populated."""
        return all(
            getattr(self.extracted_data, field) is not None
            for field in self.extracted_data.model_fields
        )


class CreateAmbulanceRequestParseSchema(BaseModel):
    """Input schema for initiating the AI data extraction process.

    This schema validates the payload required to trigger the AI analysis
    of previously uploaded medical documents. It ensures that at least one
    file identifier is provided to perform the extraction.

    Attributes:
        file_ids (list[int]): A list of unique identifiers for the files to be
            analyzed. Must contain at least one file ID. These IDs correspond
            to the records created during the file upload step.

    """

    file_ids: Annotated[
        list[int],
        Field(
            min_length=1,
            examples=[[1, 2, 3]],
            description='IDs of uploaded files (at least one required)',
        ),
    ]


class CreateAmbulanceRequestSchema(BaseModel):
    """Schema for creating ambulance request (combines step 2 and 3)."""

    file_ids: Annotated[
        list[int],
        Field(
            min_length=1,
            examples=[[1, 2, 3]],
            description='IDs of uploaded files (at least one required)',
        ),
    ]
    transportation_type: TransportationType
    patient_first_name: Annotated[
        str,
        Field(
            min_length=3,
            max_length=15,
            pattern=r'^[a-zA-Z]+$',
            examples=['John'],
            description='Patient first name as it appears in the document',
        ),
    ]
    patient_last_name: Annotated[  # TODO: Consider moving to mixin
        str,
        Field(
            min_length=3,
            max_length=15,
            pattern=r'^[a-zA-Z]+$',
            examples=['Doe'],
            description='Patient last name as it appears in the document',
        ),
    ]
    patient_date_of_birth: Annotated[
        date,
        Field(
            description='Patient date of birth',
            examples=[date(1960, 1, 1)],
        ),
    ]
    patient_id: Annotated[
        str,
        Field(
            min_length=1,
            max_length=50,
            description=(
                'Patient Medicare Beneficiary Identifier (MBI) or other ID'
            ),
            examples=['1EG4-TE5-MK72'],
        ),
    ]
    date_of_transport: Annotated[
        date,
        Field(
            description='Patient date of transport',
            examples=[date(2025, 12, 6)],
        ),
    ]
    time_of_transport: Annotated[
        time,
        Field(
            description='Time of transport',
            examples=[time(13, 40)],
        ),
    ]
    pickup_address: Annotated[
        str,
        Field(
            min_length=5,
            max_length=500,
            examples=['123 Main St, Springfield, IL 62701'],
        ),
    ]
    destination_address: Annotated[
        str,
        Field(
            min_length=5,
            max_length=500,
            examples=[
                'Memorial Dialysis Center, '
                '456 Medical Dr, Springfield, IL 62702'
            ],
        ),
    ]
    primary_diagnosis: str | None = Field(
        None,
        examples=['Chronic heart failure, mobility impaired'],
    )
    medical_justification: str | None = Field(
        None,
        examples=[
            'Patient requires repetitive non-emergent ambulance transport'
            ' for dialysis treatment three times weekly.'
            ' Patient is bedbound and unable to sit upright'
            ' for extended periods due to '
            'severe cardiovascular complications.'
            ' Standard wheelchair van transport is contraindicated.'
        ],
    )
    form_number: str | None = None
    ambulatory_status: AmbulatoryStatus | None = Field(
        None,
        examples=[AmbulatoryStatus.NON_AMBULATORY],
        description='Patient ambulatory status',
    )
    oxygen_required: bool = Field(
        False,  # noqa: FBT003
        examples=[False],
        description='Whether oxygen is required for the patient',
    )
    ai_accuracy: float | None = Field(
        None,
        examples=[37.3],
        description='AI confidence in filled data (percentage with 1 decimal place, e.g., 37.3)',  # noqa: E501
        ge=0.0,
        le=100.0,
    )
    ordering_physician: str | None = Field(
        None,
        examples=['Dr. John Smith'],
        description='Name of the ordering physician',
        max_length=200,
    )
    physician_phone: str | None = Field(
        None,
        examples=['555-123-4567'],
        description='Phone number of the ordering physician',
        max_length=50,
    )


class AmbulanceRequestResponseSchema(BaseModel):
    """Response schema for ambulance request."""

    id: Annotated[
        int,
        Field(
            description='Unique identifier of the ambulance request.',
            examples=[1],
        ),
    ]
    user_id: Annotated[
        int,
        Field(
            description='Unique identifier of user that created the request.',
            examples=[2],
        ),
    ]
    patient_first_name: Annotated[
        str,
        Field(
            min_length=3,
            max_length=15,
            pattern=r'^[a-zA-Z]+$',
            examples=['John'],
        ),
    ]
    patient_last_name: Annotated[
        str,
        Field(
            min_length=3,
            max_length=15,
            pattern=r'^[a-zA-Z]+$',
            examples=['Doe'],
        ),
    ]
    primary_diagnosis: Annotated[
        str | None,
        Field(
            ...,
            examples=['Chronic heart failure, mobility impaired'],
        ),
    ]
    status: RequestStatus
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class RequestStatusHistoryResponseSchema(BaseModel):
    """Response schema for request status history."""

    id: Annotated[
        int,
        Field(
            description='Unique identifier of ambulance request status.',
            examples=[1],
        ),
    ]
    request_id: Annotated[
        int,
        Field(
            description='Unique identifier of ambulance request.', examples=[1]
        ),
    ]
    status: RequestStatus
    notes: str | None
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)


class RequestDocumentSchema(BaseModel):
    """Schema for request document with download URL."""

    id: int
    filename: str
    file_size: int
    content_type: str
    download_url: str = Field(
        description='Presigned URL for downloading the document',
    )

    model_config = ConfigDict(from_attributes=True)


class RequestWithStatusHistorySchema(AmbulanceRequestResponseSchema):
    """Response schema for request with status history."""

    status_history: list[RequestStatusHistoryResponseSchema] = []
    documents: list[RequestDocumentSchema] = Field(
        default_factory=list,
        description='List of documents attached to the request',
    )
    model_config = ConfigDict(from_attributes=True)
