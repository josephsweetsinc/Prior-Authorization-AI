"""new_statuses

Revision ID: 9d0173bad9c8
Revises: d55d476a053e
Create Date: 2026-01-07 18:47:49.017566

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

revision: str = '9d0173bad9c8'
down_revision: Union[str, Sequence[str], None] = 'd55d476a053e'

old_options = ('APPROVED', 'PENDING', 'PROCESSING', 'DENIED')
new_options = ('DRAFT', 'SUBMITTED', 'PENDING', 'APPROVED', 'DENIED')

denial_reason_enum = sa.Enum(
    'DUPLICATE_REQUEST', 'INVALID_REQUEST_TYPE', 'INVALID_DIAGNOSIS_CODE',
    'MISSING_PHYSICIAN_SIGNATURE', 'TRANSPORT_LEVEL_NOT_MEDICALLY_NECESSARY',
    'INCOMPLETE_MEDICAL_DOCUMENTATION', 'OUTDATED_OR_EXPIRED_DOCUMENTS',
    'INCORRECT_OR_INCONSISTENT_PATIENT_INFORMATION', 'OTHER_REASON',
    name='denialreason'
)


def upgrade() -> None:
    op.execute(
        "ALTER TABLE ambulance_requests ALTER COLUMN status DROP DEFAULT")
    op.execute(
        "ALTER TABLE request_status_history ALTER COLUMN status DROP DEFAULT")

    bind = op.get_bind()
    result = bind.execute(sa.text(
        "SELECT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'denialreason')"))
    exists = result.scalar()

    if not exists:
        denial_reason_enum.create(bind)

    temp_type = sa.Enum(*new_options, name='requeststatus_new_tmp')
    temp_type.create(bind)

    op.execute(
        "ALTER TABLE ambulance_requests ALTER COLUMN status TYPE requeststatus_new_tmp USING "
        "CASE "
        "  WHEN status::text = 'PROCESSING' THEN 'PENDING'::requeststatus_new_tmp "
        "  ELSE UPPER(status::text)::requeststatus_new_tmp "
        "END"
    )

    op.execute(
        "ALTER TABLE request_status_history ALTER COLUMN status TYPE requeststatus_new_tmp USING "
        "CASE "
        "  WHEN status::text = 'PROCESSING' THEN 'PENDING'::requeststatus_new_tmp "
        "  ELSE UPPER(status::text)::requeststatus_new_tmp "
        "END"
    )

    op.execute("DROP TYPE requeststatus")
    op.execute("ALTER TYPE requeststatus_new_tmp RENAME TO requeststatus")

    op.execute(
        "ALTER TABLE ambulance_requests ALTER COLUMN status SET DEFAULT 'DRAFT'::requeststatus")

    op.add_column('ambulance_requests', sa.Column(
        'denial_reason', denial_reason_enum, nullable=True,
        comment='Reason for denial if request was denied'
    ))
    op.add_column('ambulance_requests', sa.Column(
        'denial_notes', sa.String(length=256), nullable=True,
        comment='Additional notes for denial (required if denial_reason is OTHER_REASON)'
    ))

def downgrade() -> None:
    op.drop_column('ambulance_requests', 'denial_notes')
    op.drop_column('ambulance_requests', 'denial_reason')
    denial_reason_enum.drop(op.get_bind())

    op.execute("ALTER TABLE ambulance_requests ALTER COLUMN status DROP DEFAULT")
    op.execute("ALTER TABLE request_status_history ALTER COLUMN status DROP DEFAULT")

    temp_old_type = sa.Enum(*old_options, name='requeststatus_old_tmp')
    temp_old_type.create(op.get_bind())

    for table in ['ambulance_requests', 'request_status_history']:
        op.execute(
            f"ALTER TABLE {table} ALTER COLUMN status TYPE requeststatus_old_tmp USING "
            "CASE "
            "  WHEN status::text IN ('DRAFT', 'SUBMITTED') THEN 'PENDING'::requeststatus_old_tmp "
            "  ELSE status::text::requeststatus_old_tmp "
            "END"
        )

    op.execute("DROP TYPE requeststatus")
    op.execute("ALTER TYPE requeststatus_old_tmp RENAME TO requeststatus")
    op.execute("ALTER TABLE ambulance_requests ALTER COLUMN status SET DEFAULT 'PENDING'::requeststatus")
