"""Merge heads

Revision ID: 8ef158a42d2a
Revises: 5c0c548ee4f2, f4537fc1e764
Create Date: 2025-12-25 17:23:12.001731

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '8ef158a42d2a'
down_revision: Union[str, Sequence[str], None] = ('5c0c548ee4f2', 'f4537fc1e764')
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
