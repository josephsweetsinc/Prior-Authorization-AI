"""Script to generate test ambulance requests for testing dashboard functionality.

Usage:
    For provider:
        python scripts/generate_test_requests.py <provider_email>

    For admin (to see requests from specific user):
        python scripts/generate_test_requests.py <admin_email> --created-by <user_email>
"""

import asyncio
import random
import sys
from datetime import UTC, date, datetime, time, timedelta
from pathlib import Path

# Add project root to path BEFORE importing project modules
project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))

from sqlalchemy import select

from config.database import async_session_maker
from models.ambulance_request import (
    AmbulanceRequest,
    RequestStatus,
    RequestStatusHistory,
    TransportationType,
)
from models.user import User, UserRole

FIRST_NAMES: list[str] = [
    'John',
    'Mary',
    'Robert',
    'Patricia',
    'James',
    'Jennifer',
    'Michael',
    'Linda',
    'William',
    'Elizabeth',
    'David',
    'Barbara',
    'Richard',
    'Susan',
    'Joseph',
    'Jessica',
    'Thomas',
    'Sarah',
    'Charles',
    'Karen',
]

LAST_NAMES: list[str] = [
    'Smith',
    'Johnson',
    'Williams',
    'Brown',
    'Jones',
    'Garcia',
    'Miller',
    'Davis',
    'Rodriguez',
    'Martinez',
    'Hernandez',
    'Lopez',
    'Wilson',
    'Anderson',
    'Thomas',
    'Taylor',
    'Moore',
    'Jackson',
    'Martin',
    'Lee',
]

DIAGNOSES: list[str] = [
    'End Stage Renal Disease requiring dialysis',
    'Chronic heart failure, mobility impaired',
    'Severe COPD with oxygen dependence',
    'Morbid obesity, BMI >40, bedridden',
    "Advanced Parkinson's disease",
    'Multiple sclerosis with severe mobility issues',
    'Spinal cord injury, quadriplegia',
    'Advanced dementia, bedbound',
    'Severe arthritis, unable to ambulate',
    'Post-stroke hemiplegia',
    'Congestive heart failure, NYHA Class IV',
    'Chronic obstructive pulmonary disease, oxygen dependent',
    'Diabetes with severe complications',
    'Cancer, palliative care',
    'Severe neurological disorder',
]

ADDRESSES: list[tuple[str, str]] = [
    (
        '123 Main St, Springfield, IL 62701',
        'Memorial Dialysis Center, 456 Medical Dr, Springfield, IL 62702',
    ),
    (
        '789 Oak Ave, Chicago, IL 60601',
        'Northwestern Hospital, 250 E Superior St, Chicago, IL 60611',
    ),
    (
        '321 Elm St, Peoria, IL 61602',
        'OSF Medical Center, 530 NE Glen Oak Ave, Peoria, IL 61637',
    ),
    (
        '555 Pine Rd, Rockford, IL 61101',
        'SwedishAmerican Hospital, 1401 E State St, Rockford, IL 61104',
    ),
    (
        '888 Maple Dr, Aurora, IL 60505',
        'Rush Copley Medical Center, 2000 Ogden Ave, Aurora, IL 60504',
    ),
]


def generate_patient_id(index: int) -> str:
    """Generate a valid patient ID format: 2 letters + 9 digits + 2 letters.

    Args:
        index: Index to make ID unique.

    Returns:
        Patient ID string.

    """
    prefix = 'DA'
    digits = f'{100000000 + index:09d}'
    suffix = 'HY'
    return f'{prefix}{digits}{suffix}'


def generate_form_number(index: int) -> str:
    """Generate a CMS form number.

    Args:
        index: Index to make form number unique.

    Returns:
        Form number string.

    """
    return f'CMS-{10344 + index}'


async def get_user_by_email(email: str) -> User | None:
    """Get user by email address.

    Args:
        email: User email address.

    Returns:
        User instance or None if not found.

    """
    async with async_session_maker() as session:
        result = await session.execute(select(User).where(User.email == email))
        return result.scalar_one_or_none()


async def generate_requests(
    target_user_email: str,
    created_by_user_email: str | None = None,
    count: int = 50,
) -> bool:
    """Generate test ambulance requests.

    Args:
        target_user_email: Email of the user (provider or admin) for whom
            to generate requests. If admin, requests will be created by
            the user specified in created_by_user_email.
        created_by_user_email: Email of the user who created the requests.
            Required if target_user_email is an admin. Ignored if target_user
            is a provider.
        count: Number of requests to generate (default: 50).

    Returns:
        True if successful, False otherwise.

    """
    async with async_session_maker() as session:
        # Get target user (provider or admin)
        target_user = await get_user_by_email(target_user_email)
        if not target_user:
            print(f"❌ Error: User with email '{target_user_email}' not found")
            return False

        # Determine who will create the requests
        if target_user.role == UserRole.ADMIN:
            if not created_by_user_email:
                print(
                    '❌ Error: For admin user, you must specify --created-by <user_email>'
                )
                return False
            creator_user = await get_user_by_email(created_by_user_email)
            if not creator_user:
                print(
                    f"❌ Error: User with email '{created_by_user_email}' not found"
                )
                return False
            if creator_user.role == UserRole.ADMIN:
                print(
                    '❌ Error: Cannot create requests for admin user. '
                    'Please specify a provider email for --created-by'
                )
                return False
            user_id = creator_user.id
            print(
                f'✅ Creating {count} requests for admin {target_user_email} '
                f'(requests will be created by user: {created_by_user_email})'
            )
        else:
            # Provider creates their own requests
            user_id = target_user.id
            print(
                f'✅ Creating {count} requests for provider {target_user_email}'
            )

        # Status distribution: ~40% approved, ~20% pending, ~20% processing, ~20% denied
        status_distribution: list[RequestStatus] = (
            [RequestStatus.APPROVED] * 20
            + [RequestStatus.PENDING] * 10
            + [RequestStatus.PENDING] * 10
            + [RequestStatus.DENIED] * 10
        )
        random.shuffle(status_distribution)

        # Generate requests with dates spread over last 90 days
        # This ensures we have data for past months to calculate change_percent
        today = datetime.now(UTC).date()
        requests_created = 0

        for i in range(count):
            # Random date within last 90 days to cover past months
            # This ensures some requests fall into previous months for change_percent calculation
            days_ago = random.randint(0, 90)
            created_date = today - timedelta(days=days_ago)
            created_at = datetime.combine(
                created_date, datetime.now(UTC).time()
            ).replace(tzinfo=UTC)

            # Select status
            status = status_distribution[i % len(status_distribution)]

            # Generate patient data
            first_name = random.choice(FIRST_NAMES)
            last_name = random.choice(LAST_NAMES)
            patient_id = generate_patient_id(i)
            patient_dob = date(
                1940 + random.randint(0, 50),
                random.randint(1, 12),
                random.randint(1, 28),
            )

            # Transport date in the future
            transport_date = created_date + timedelta(
                days=random.randint(1, 30)
            )
            transport_time = time(
                hour=random.randint(8, 17),
                minute=random.choice([0, 15, 30, 45]),
            )

            # Addresses
            pickup, destination = random.choice(ADDRESSES)

            # Diagnosis
            diagnosis = random.choice(DIAGNOSES)
            medical_justification = (
                'Patient requires repetitive non-emergent ambulance transport '
                'for treatment. Patient is bedbound and unable to sit upright '
                'for extended periods due to severe complications.'
            )

            # Create request
            request = AmbulanceRequest(
                user_id=user_id,
                transportation_type=TransportationType.AMBULANCE,
                patient_first_name=first_name,
                patient_last_name=last_name,
                patient_date_of_birth=patient_dob,
                patient_id=patient_id,
                date_of_transport=transport_date,
                time_of_transport=transport_time,
                pickup_address=pickup,
                destination_address=destination,
                primary_diagnosis=diagnosis,
                medical_justification=medical_justification,
                status=status,
                form_number=generate_form_number(i),
                created_at=created_at,
                updated_at=created_at,
            )
            session.add(request)
            await session.flush()

            # Create realistic status history based on final status
            current_time = created_at

            # Always start with PROCESSING
            processing_history = RequestStatusHistory(
                request_id=request.id,
                status=RequestStatus.PENDING,
                notes='Request submitted',
                created_at=current_time,
            )
            session.add(processing_history)
            await session.flush()

            # Build status history based on final status
            if status == RequestStatus.PENDING:
                # Still processing - no further status changes
                request.updated_at = current_time
            elif status == RequestStatus.PENDING:
                # PROCESSING -> PENDING (current status)
                # This will be updated later when status changes
                pending_delay = timedelta(
                    days=random.randint(1, 2),  # noqa: S311
                    hours=random.randint(0, 12),  # noqa: S311
                )
                pending_time = current_time + pending_delay

                pending_history = RequestStatusHistory(
                    request_id=request.id,
                    status=RequestStatus.PENDING,
                    notes='Request pending review',
                    created_at=pending_time,
                )
                session.add(pending_history)
                await session.flush()
                request.updated_at = pending_time
            else:
                # APPROVED or DENIED - need realistic flow
                # Most requests go through PENDING first (85% chance for better avg_wait_time data) # noqa: E501
                goes_through_pending = random.random() < 0.85  # noqa: PLR2004

                if goes_through_pending:
                    # PROCESSING -> PENDING -> APPROVED/DENIED
                    pending_delay = timedelta(
                        days=random.randint(1, 2),  # noqa: S311
                        hours=random.randint(0, 12),  # noqa: S311
                    )
                    pending_time = current_time + pending_delay

                    pending_history = RequestStatusHistory(
                        request_id=request.id,
                        status=RequestStatus.PENDING,
                        notes='Request pending review',
                        created_at=pending_time,
                    )
                    session.add(pending_history)
                    await session.flush()

                    # Final status after PENDING (this is the wait time!)
                    wait_time_hours = random.uniform(  # noqa: S311
                        1.0, 72.0
                    )  # 1 hour to 3 days
                    final_delay = timedelta(hours=wait_time_hours)
                    final_time = pending_time + final_delay
                else:
                    # PROCESSING -> APPROVED/DENIED (direct, no PENDING)
                    final_delay = timedelta(
                        days=random.randint(1, 3),  # noqa: S311
                        hours=random.randint(0, 12),  # noqa: S311
                    )
                    final_time = current_time + final_delay

                # Add final status
                notes_map: dict[RequestStatus, str] = {
                    RequestStatus.APPROVED: 'Request approved by reviewer',
                    RequestStatus.DENIED: 'Request denied - insufficient documentation',  # noqa: E501
                }

                final_history = RequestStatusHistory(
                    request_id=request.id,
                    status=status,
                    notes=notes_map.get(status, 'Status updated'),
                    created_at=final_time,
                )
                session.add(final_history)
                await session.flush()
                request.updated_at = final_time

            requests_created += 1

            # Commit in batches of 10 for better performance
            if requests_created % 10 == 0:
                await session.commit()
                print(f'  ✓ Created {requests_created}/{count} requests...')

        # Final commit
        await session.commit()
        print(f'✅ Successfully created {requests_created} requests!')
        return True


async def main() -> None:
    """Main entry point for the script."""
    if len(sys.argv) < 2:  # noqa: PLR2004
        print('Usage:')
        print('  For provider:')
        print('    python scripts/generate_test_requests.py <provider_email>')
        print('  For admin:')
        print(
            '    python scripts/generate_test_requests.py <admin_email> '
            '--created-by <user_email>'
        )
        print()
        print('Example:')
        print('  python scripts/generate_test_requests.py provider@example.com')
        print(
            '  python scripts/generate_test_requests.py admin@example.com '
            '--created-by provider@example.com'
        )
        sys.exit(1)

    target_email = sys.argv[1]
    created_by_email: str | None = None

    # Parse --created-by argument
    if '--created-by' in sys.argv:
        idx = sys.argv.index('--created-by')
        if idx + 1 < len(sys.argv):
            created_by_email = sys.argv[idx + 1]
        else:
            print('❌ Error: --created-by requires an email address')
            sys.exit(1)

    success = await generate_requests(
        target_user_email=target_email,
        created_by_user_email=created_by_email,
        count=50,
    )
    sys.exit(0 if success else 1)


if __name__ == '__main__':
    asyncio.run(main())
