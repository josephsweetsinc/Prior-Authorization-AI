"""Tests for UserDAO."""

from datetime import UTC, datetime

import pytest

from dao import UserDAO
from models.user import UserRole


class TestUserDAO:
    """Test suite for UserDAO."""

    @pytest.mark.asyncio
    async def test_get_all(
        self,
        db_session,
        user_factory,
    ):
        """Test getting all users."""
        user1 = await user_factory(
            email='user1@example.com',
            name='John',
            surname='Doe',
        )
        user2 = await user_factory(
            email='user2@example.com',
            name='Jane',
            surname='Smith',
        )
        await db_session.commit()

        dao = UserDAO(db_session)
        all_users = await dao.get_all()

        assert len(all_users) == 2
        user_emails = {user.email for user in all_users}
        assert user_emails == {user1.email, user2.email}

    @pytest.mark.asyncio
    async def test_get_all_with_pagination(
        self,
        db_session,
        user_factory,
    ):
        """Test getting all users with pagination."""
        # Create 5 users
        user_ids = []
        for i in range(5):
            user = await user_factory(
                email=f'user{i}@example.com',
                name=f'User{i}',
                surname='Test',
            )
            user_ids.append(user.id)
            await db_session.commit()

        dao = UserDAO(db_session)

        # Get first page (offset=0, limit=2)
        first_page = await dao.get_all(offset=0, limit=2)
        assert len(first_page) == 2

        # Get next page (offset=2, limit=2)
        second_page = await dao.get_all(offset=2, limit=2)
        assert len(second_page) == 2
        # Should not overlap with first page
        first_page_ids = {user.id for user in first_page}
        second_page_ids = {user.id for user in second_page}
        assert first_page_ids.isdisjoint(second_page_ids), (
            f'Pages overlap: first_page={first_page_ids}, second_page={second_page_ids}'
        )

        # Get last page (offset=4, limit=2)
        third_page = await dao.get_all(offset=4, limit=2)
        # Should get remaining 1 item
        assert len(third_page) == 1

    @pytest.mark.asyncio
    async def test_get_all_with_search_by_name(
        self,
        db_session,
        user_factory,
    ):
        """Test getting all users with search by name."""
        user1 = await user_factory(
            email='john@example.com',
            name='John',
            surname='Doe',
        )
        user2 = await user_factory(
            email='jane@example.com',
            name='Jane',
            surname='Smith',
        )
        user3 = await user_factory(
            email='bob@example.com',
            name='Bob',
            surname='Johnson',
        )
        await db_session.commit()

        dao = UserDAO(db_session)

        # Search by first name - 'John' matches name='John' and also surname='Johnson'
        # So it will find both user1 (name='John') and user3 (surname='Johnson')
        results = await dao.get_all(search='John')
        assert len(results) == 2  # Matches both 'John' (name) and 'Johnson' (surname)
        emails = {user.email for user in results}
        assert user1.email in emails
        assert user3.email in emails

        # Search by exact email to get only one result
        results = await dao.get_all(search='john@example.com')
        assert len(results) == 1
        assert results[0].email == user1.email

        # Search by surname
        results = await dao.get_all(search='Smith')
        assert len(results) == 1
        assert results[0].email == user2.email

        # Search that matches multiple (case insensitive) - 'j' matches John, Jane, and Johnson
        results = await dao.get_all(search='j')
        assert len(results) == 3  # All three users have 'j' in name, surname, or email
        emails = {user.email for user in results}
        assert user1.email in emails
        assert user2.email in emails
        assert user3.email in emails

    @pytest.mark.asyncio
    async def test_get_all_with_search_by_email(
        self,
        db_session,
        user_factory,
    ):
        """Test getting all users with search by email."""
        user1 = await user_factory(
            email='john.doe@example.com',
            name='John',
            surname='Doe',
        )
        user2 = await user_factory(
            email='jane.smith@example.com',
            name='Jane',
            surname='Smith',
        )
        await db_session.commit()

        dao = UserDAO(db_session)

        # Search by email
        results = await dao.get_all(search='john.doe')
        assert len(results) == 1
        assert results[0].email == user1.email

        # Search by domain
        results = await dao.get_all(search='@example.com')
        assert len(results) == 2

    @pytest.mark.asyncio
    async def test_count_all(
        self,
        db_session,
        user_factory,
    ):
        """Test counting all users."""
        await user_factory(email='user1@example.com')
        await user_factory(email='user2@example.com')
        await user_factory(email='user3@example.com')
        await db_session.commit()

        dao = UserDAO(db_session)
        count = await dao.count_all()

        assert count == 3

    @pytest.mark.asyncio
    async def test_count_all_with_search(
        self,
        db_session,
        user_factory,
    ):
        """Test counting all users with search filter."""
        await user_factory(
            email='john@example.com',
            name='John',
            surname='Doe',
        )
        await user_factory(
            email='jane@example.com',
            name='Jane',
            surname='Smith',
        )
        await user_factory(
            email='bob@example.com',
            name='Bob',
            surname='Johnson',
        )
        await db_session.commit()

        dao = UserDAO(db_session)

        # Count with search - 'John' matches name='John' and surname='Johnson'
        count = await dao.count_all(search='John')
        assert count == 2  # Matches both 'John' (name) and 'Johnson' (surname)

        # 'j' matches all three users (John, Jane, Johnson)
        count = await dao.count_all(search='j')
        assert count == 3

    @pytest.mark.asyncio
    async def test_get_all_excludes_inactive(
        self,
        db_session,
        user_factory,
    ):
        """Test that get_all excludes inactive users."""
        active_user = await user_factory(
            email='active@example.com',
            is_active=True,
        )
        inactive_user = await user_factory(
            email='inactive@example.com',
            is_active=False,
        )
        await db_session.commit()

        dao = UserDAO(db_session)
        users = await dao.get_all()

        assert len(users) == 1
        assert users[0].email == active_user.email
        assert users[0].id != inactive_user.id

    @pytest.mark.asyncio
    async def test_update_last_login(
        self,
        db_session,
        user_factory,
    ):
        """Test updating last login timestamp."""
        user = await user_factory(email='test@example.com')
        await db_session.commit()

        dao = UserDAO(db_session)
        updated_user = await dao.update_last_login(user.id)
        await db_session.commit()

        assert updated_user is not None
        assert updated_user.id == user.id
        assert updated_user.last_login is not None
        assert isinstance(updated_user.last_login, datetime)

        # Verify it's updated in DB
        found = await dao.get_by_id(user.id)
        assert found is not None
        assert found.last_login is not None
