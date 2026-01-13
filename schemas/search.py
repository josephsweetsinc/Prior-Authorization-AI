from typing import Annotated

from pydantic import BaseModel, Field


class SearchRequestsResponseSchema(BaseModel):
    """Response schema for request search results."""

    request_ids: Annotated[
        list[int],
        Field(description='List of request IDs matching the search criteria'),
    ]
