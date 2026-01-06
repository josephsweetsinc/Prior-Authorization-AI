"""add_new_fields_to_requests

Revision ID: 769c041c5983
Revises: 80d7fe846e69
Create Date: 2026-01-06 16:54:56.622000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '769c041c5983'
down_revision: Union[str, Sequence[str], None] = '80d7fe846e69'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema.
    
    Adds new fields to ambulance_requests table:
    - ambulatory_status: Ambulatory status enum (ambulatory, non-ambulatory)
    - oxygen_required: Boolean flag for oxygen requirement
    - ai_accuracy: AI confidence percentage (Numeric with 1 decimal place)
    - ordering_physician: Name of the ordering physician
    - physician_phone: Phone number of the ordering physician
    """
    # Create ambulatorystatus enum type if it doesn't exist
    op.execute(
        "DO $$ BEGIN "
        "CREATE TYPE ambulatorystatus AS ENUM ('ambulatory', 'non-ambulatory'); "
        "EXCEPTION WHEN duplicate_object THEN null; "
        "END $$;"
    )
    
    # Add new columns
    op.add_column(
        'ambulance_requests',
        sa.Column(
            'ambulatory_status',
            sa.Enum('ambulatory', 'non-ambulatory', name='ambulatorystatus', create_type=False),
            nullable=True,
            comment='Ambulatory status of the patient'
        )
    )
    op.add_column(
        'ambulance_requests',
        sa.Column(
            'oxygen_required',
            sa.Boolean(),
            server_default='false',
            nullable=False,
            comment='Whether oxygen is required for the patient'
        )
    )
    op.add_column(
        'ambulance_requests',
        sa.Column(
            'ai_accuracy',
            sa.Numeric(precision=4, scale=1),
            nullable=True,
            comment='AI confidence in filled data (percentage with 1 decimal place, e.g., 37.3)'
        )
    )
    op.add_column(
        'ambulance_requests',
        sa.Column(
            'ordering_physician',
            sa.String(length=200),
            nullable=True,
            comment='Name of the ordering physician'
        )
    )
    op.add_column(
        'ambulance_requests',
        sa.Column(
            'physician_phone',
            sa.String(length=50),
            nullable=True,
            comment='Phone number of the ordering physician'
        )
    )


def downgrade() -> None:
    """Downgrade schema."""
    # Drop columns
    op.drop_column('ambulance_requests', 'physician_phone')
    op.drop_column('ambulance_requests', 'ordering_physician')
    op.drop_column('ambulance_requests', 'ai_accuracy')
    op.drop_column('ambulance_requests', 'oxygen_required')
    op.drop_column('ambulance_requests', 'ambulatory_status')
    
    # Drop enum type
    op.execute('DROP TYPE IF EXISTS ambulatorystatus')
