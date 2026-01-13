"""Pydantic schemas for WebSocket endpoints."""
from typing import Any

from pydantic import BaseModel, Field


class WebSocketInfoResponse(BaseModel):
    """Information about WebSocket connection."""

    websocket_url: str = Field(
        description='WebSocket connection URL',
        examples=['ws://localhost:8000/Prod/api/v1/websocket/notifications'],
    )
    authentication: str = Field(
        description='Authentication method',
        examples=['Authorization: Bearer <your_jwt_token>'],
    )
    description: str = Field(
        description='Description of the WebSocket endpoint',
    )
    example_message: dict[Any, Any] = Field(
        description='Example of notification message format',
    )
