from typing import TYPE_CHECKING

from sqlalchemy import ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from core.models import BaseIdMixin, BaseTimeStampMixin, SoftDelete

if TYPE_CHECKING:
    from models import User


class Organization(BaseIdMixin, BaseTimeStampMixin, SoftDelete):
    """Organization model represents an organization attached to a user.

    Fields:
    - user_id: ID of the user this organization belongs to.
    - provider_type: Type of provider (String(512)).
    - professional_id: Professional ID (String(128)).
    - medic_name: Medic name (String(128)).
    """

    __tablename__ = 'organizations'

    user_id: Mapped[int] = mapped_column(
        ForeignKey('users.id', ondelete='CASCADE'),
        nullable=False,
        unique=True,
        comment='ID of the user this organization belongs to',
    )
    provider_type: Mapped[str | None] = mapped_column(
        String(512),
        nullable=True,
        comment='Type of provider',
    )
    professional_id: Mapped[str | None] = mapped_column(
        String(128),
        nullable=True,
        comment='Professional ID',
    )
    medic_name: Mapped[str | None] = mapped_column(
        String(128),
        nullable=True,
        comment='Medic name',
    )

    # Relationships
    user: Mapped['User'] = relationship(
        'User',
        back_populates='organization',
    )

    def __repr__(self) -> str:
        """Return a string representation of the organization."""
        return f'<Organization {self.id} - User {self.user_id}>'
