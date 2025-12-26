"""add_new_transportation_types

Revision ID: f4537fc1e764
Revises: c86800d8acb2
Create Date: 2025-12-21 01:33:53.908943

Adds new transportation types to the TransportationType enum:
- WHEELCHAIR - wheelchair van transport
- STRETCHER - stretcher van transport
- BLS - Basic Life Support ambulance
- ALS - Advanced Life Support ambulance
- CCT - Critical Care Transport

Note: Alembic does not auto-detect enum changes in PostgreSQL.
This migration must be written manually.

"""
from typing import Sequence, Union

from alembic import op


# revision identifiers, used by Alembic.
revision: str = 'f4537fc1e764'
down_revision: Union[str, Sequence[str], None] = 'c86800d8acb2'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

# New transportation types to add to the enum
# Using uppercase to match existing 'AMBULANCE' value in database
NEW_TRANSPORTATION_TYPES = ['WHEELCHAIR', 'STRETCHER', 'BLS', 'ALS', 'CCT']


def upgrade() -> None:
    """Add new values to transportationtype enum.

    PostgreSQL allows adding new values to existing enums with
    ALTER TYPE ... ADD VALUE. The IF NOT EXISTS clause prevents
    errors if the value already exists.

    """
    for transport_type in NEW_TRANSPORTATION_TYPES:
        op.execute(
            f"ALTER TYPE transportationtype ADD VALUE "
            f"IF NOT EXISTS '{transport_type}'"
        )


def downgrade() -> None:
    """Downgrade schema.

    PostgreSQL does not support removing values from enums directly.
    To remove values, you would need to:
    1. Create a new enum type without the values
    2. Update all tables using the enum
    3. Drop the old enum type
    4. Rename the new enum

    This is a destructive operation and not implemented here.

    """
    pass
