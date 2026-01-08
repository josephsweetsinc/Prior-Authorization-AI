from enum import StrEnum
from typing import TYPE_CHECKING

from sqlalchemy import Enum, ForeignKey, Integer, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from core.models import BaseIdMixin, BaseTimeStampMixin

if TYPE_CHECKING:
    from models import AmbulanceRequest, User


class NotificationCategory(StrEnum):
    """Enumeration of notification categories."""

    STATUS_UPDATE = 'status_updates'
    DOCUMENT = 'documents'
    REQUIREMENT = 'requirements'
    SYSTEM = 'system'


class Notification(BaseIdMixin, BaseTimeStampMixin):
    """Notification model.

    Fields:
    - user_id: ID of the user who receives the notification.
    - category: Category of the notification (enum).
    - message: Notification message text.
    - request_id: ID of the related ambulance request (nullable for SYSTEM).
    - is_read: Whether the notification has been read.
    """

    __tablename__ = 'notifications'

    user_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey('users.id', ondelete='CASCADE'),
        nullable=False,
        comment='ID of the user who receives the notification',
    )
    category: Mapped[NotificationCategory] = mapped_column(
        Enum(NotificationCategory),
        nullable=False,
        comment='Category of the notification',
    )
    message: Mapped[str] = mapped_column(
        Text,
        nullable=False,
        comment='Notification message text',
    )
    request_id: Mapped[int | None] = mapped_column(
        Integer,
        ForeignKey('ambulance_requests.id', ondelete='CASCADE'),
        nullable=True,
        comment='ID of the related ambulance request (nullable for SYSTEM )',
    )
    is_read: Mapped[bool] = mapped_column(
        default=False,
        nullable=False,
        comment='Whether the notification has been read',
    )

    # Relationships
    user: Mapped['User'] = relationship(
        'User',
        foreign_keys=[user_id],
    )
    request: Mapped['AmbulanceRequest | None'] = relationship(
        'AmbulanceRequest',
        foreign_keys=[request_id],
    )

    def __repr__(self) -> str:
        """Return a string representation of the notification."""
        return (
            f'<Notification {self.id} - {self.category.value} - '
            f'User {self.user_id} - Read: {self.is_read}>'
        )
