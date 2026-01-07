"""new_statuses_ambulatory

Revision ID: 5b953111983c
Revises: 9d0173bad9c8
Create Date: 2026-01-07 19:03:45.504437

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '5b953111983c'
down_revision: Union[str, Sequence[str], None] = '9d0173bad9c8'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.execute("ALTER TYPE ambulatorystatus RENAME TO ambulatorystatus_old")

    new_options = ('AMBULATORY', 'NON_AMBULATORY')
    new_type = sa.Enum(*new_options, name='ambulatorystatus')
    new_type.create(op.get_bind())

    op.execute(
        "ALTER TABLE ambulance_requests ALTER COLUMN ambulatory_status TYPE ambulatorystatus USING "
        "REPLACE(UPPER(ambulatory_status::text), '-', '_')::ambulatorystatus"
    )

    op.execute("DROP TYPE ambulatorystatus_old")


def downgrade() -> None:
    """Downgrade schema."""
    op.execute("ALTER TYPE ambulatorystatus RENAME TO ambulatorystatus_new")

    old_options = ('ambulatory', 'non-ambulatory')
    old_type = sa.Enum(*old_options, name='ambulatorystatus')
    old_type.create(op.get_bind())

    op.execute(
        "ALTER TABLE ambulance_requests ALTER COLUMN ambulatory_status TYPE ambulatorystatus USING "
        "REPLACE(LOWER(ambulatory_status::text), '_', '-')::ambulatorystatus"
    )

    # 4. Удаляем новый тип
    op.execute("DROP TYPE ambulatorystatus_new")