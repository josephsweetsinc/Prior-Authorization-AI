import asyncio
import sys
from pathlib import Path

project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))

from sqlalchemy import select
from sqlalchemy.exc import IntegrityError

from config.database import async_session_maker
from models.user import User, UserRole
from services.jwt.hasher import Hasher


async def create_admin_user(email: str, password: str) -> bool:  # noqa: D103
    async with async_session_maker() as session:
        # Check if user already exists
        result = await session.execute(select(User).where(User.email == email))
        existing_user = result.scalar_one_or_none()
        if existing_user:
            print(f"❌ Error: User with email '{email}' already exists")
            return False
        try:
            user = User(
                email=email,
                password=Hasher.hash_password(password),
                name='admin',
                surname='admin_user',
                role=UserRole.ADMIN,
                phone_number='',
                position='Doctor',
                place_of_work='Clinic',
            )
            session.add(user)
            await session.commit()
            print(f"✅ Admin user '{email}' created successfully")
            return True  # noqa: TRY300
        except IntegrityError as e:
            await session.rollback()
            error_msg = str(e.orig) if hasattr(e, 'orig') else str(e)
            if (
                'unique constraint' in error_msg.lower()
                or 'duplicate key' in error_msg.lower()
            ):
                print(f"❌ Error: User with email '{email}' already exists")
            else:
                print(f'❌ Database error: {error_msg}')
            return False
        except Exception as e:
            await session.rollback()
            print(f'❌ Unexpected error: {e}')
            return False


async def main() -> None:  # noqa: D103
    if len(sys.argv) < 3:  # noqa: PLR2004
        print('Usage: python scripts/create_admin_user.py <email> <password>')
        print(
            'Example: python scripts/create_admin_user.py'
            ' admin@admin.com admin123'
        )
        sys.exit(1)
    email = sys.argv[1]
    password = sys.argv[2]
    is_created = await create_admin_user(email, password)
    sys.exit(0 if is_created else 1)


if __name__ == '__main__':
    asyncio.run(main())
