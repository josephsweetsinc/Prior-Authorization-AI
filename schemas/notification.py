"""Pydantic schemas for notification requests and responses."""

from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field

from models.notification import NotificationCategory


class NotificationResponseSchema(BaseModel):
    """Schema for notification response."""

    id: int = Field(description='Notification ID')
    user_id: int = Field(
        description='ID of the user who receives the notification'
    )
    category: NotificationCategory = Field(
        description='Category of the notification'
    )
    title: str | None = Field(
        default=None, description='Notification title/heading'
    )
    message: str = Field(description='Notification message text')
    request_id: int | None = Field(
        default=None, description='ID of the related ambulance request'
    )
    is_read: bool = Field(description='Whether the notification has been read')
    created_at: datetime = Field(description='Notification creation timestamp')

    model_config = ConfigDict(from_attributes=True)


class NotificationsListResponseSchema(BaseModel):
    """Schema for paginated list of notifications."""

    items: list[NotificationResponseSchema] = Field(
        description='List of notifications'
    )
    page: int = Field(description='Current page number')
    total: int = Field(description='Total number of notifications')
    showing: int = Field(
        description='Number of notifications shown on this page'
    )
    total_pages: int = Field(description='Total number of pages')
