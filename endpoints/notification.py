import logging
from typing import Annotated

from fastapi import APIRouter, Depends, Query
from fastapi.params import Security

from core import exception_handler, get_service
from dependencies import get_provider_user_from_token
from models import User
from models.notification import NotificationCategory
from schemas.notification import (
    NotificationResponseSchema,
    NotificationsListResponseSchema,
)
from services.notification import NotificationService

logger = logging.getLogger(__name__)

notification_router = APIRouter()


@notification_router.get(
    '/',
    description='Get all notifications for current user with pagination',
    summary='Get user notifications',
    response_model=NotificationsListResponseSchema,
)
@exception_handler
async def get_user_notifications(
    user: Annotated[User, Security(get_provider_user_from_token)],
    service: Annotated[
        NotificationService, Depends(get_service(NotificationService))
    ],
    page: int = Query(
        1,
        ge=1,
        description='Page number (1-based)',
        examples=[1],
    ),
    category: str | None = Query(
        None,
        description='Filter by notification category',
        examples=['status_updates'],
    ),
    is_read: bool | None = Query(
        None,
        description='Filter by read status',
        examples=[False],
    ),
) -> NotificationsListResponseSchema:
    """Get all notifications for the current user with pagination.

    Only provider users can access this endpoint.

    Args:
        page: Page number (1-based).
        category: Notification category to filter by (optional).
        is_read: Filter by read status (optional).
        user: Current authenticated user (must be provider).
        service: Notification service.

    Returns:
        NotificationsListResponseSchema: Paginated list of notifications.

    """
    category_enum: NotificationCategory | None = None
    if category:
        try:
            category_enum = NotificationCategory(category.lower())
        except ValueError:
            category_enum = None

    (
        notifications,
        total,
        current_page,
        total_pages,
        showing,
    ) = await service.get_user_notifications(
        user_id=user.id,
        page=page,
        limit=20,
        category=category_enum,
        is_read=is_read,
    )

    # Collect unread notification IDs for batch marking
    unread_notification_ids = [
        notification.id for notification in notifications if not notification.is_read
    ]

    # Return notifications with their original read status
    response = NotificationsListResponseSchema(
        items=[
            NotificationResponseSchema.model_validate(notification)
            for notification in notifications
        ],
        page=current_page,
        total=total,
        showing=showing,
        total_pages=total_pages,
    )

    # Mark unread notifications as read after response is formed (background task)
    if unread_notification_ids:
        try:
            await service.mark_notifications_as_read(unread_notification_ids)
        except Exception:
            logger.exception(
                'Failed to mark notifications as read: %s', unread_notification_ids
            )

    return response
