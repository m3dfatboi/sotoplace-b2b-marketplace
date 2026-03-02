"""User service for business logic"""

from typing import Optional
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import get_password_hash, verify_password
from app.models import User
from app.schemas.user import UserCreate, UserUpdate


class UserService:
    """Service for user-related business logic"""

    @staticmethod
    async def create_user(db: AsyncSession, user_data: UserCreate) -> User:
        """
        Create a new user

        Args:
            db: Database session
            user_data: User creation data

        Returns:
            Created user

        Raises:
            ValueError: If email already exists
        """
        # Check if email exists
        existing = await UserService.get_by_email(db, user_data.email)
        if existing:
            raise ValueError("User with this email already exists")

        # Create user
        user = User(
            email=user_data.email,
            password_hash=get_password_hash(user_data.password),
            full_name=user_data.full_name,
            phone=user_data.phone,
        )

        db.add(user)
        await db.commit()
        await db.refresh(user)

        return user

    @staticmethod
    async def get_by_id(db: AsyncSession, user_id: UUID) -> Optional[User]:
        """
        Get user by ID

        Args:
            db: Database session
            user_id: User ID

        Returns:
            User or None if not found
        """
        result = await db.execute(
            select(User).where(User.id == user_id)
        )
        return result.scalar_one_or_none()

    @staticmethod
    async def get_by_email(db: AsyncSession, email: str) -> Optional[User]:
        """
        Get user by email

        Args:
            db: Database session
            email: User email

        Returns:
            User or None if not found
        """
        result = await db.execute(
            select(User).where(User.email == email)
        )
        return result.scalar_one_or_none()

    @staticmethod
    async def authenticate(
        db: AsyncSession,
        email: str,
        password: str,
    ) -> Optional[User]:
        """
        Authenticate user by email and password

        Args:
            db: Database session
            email: User email
            password: Plain password

        Returns:
            User if authentication successful, None otherwise
        """
        user = await UserService.get_by_email(db, email)

        if not user:
            return None

        if not verify_password(password, user.password_hash):
            return None

        if not user.is_active:
            return None

        return user

    @staticmethod
    async def update_user(
        db: AsyncSession,
        user: User,
        user_data: UserUpdate,
    ) -> User:
        """
        Update user profile

        Args:
            db: Database session
            user: User to update
            user_data: Update data

        Returns:
            Updated user
        """
        if user_data.full_name is not None:
            user.full_name = user_data.full_name
        if user_data.phone is not None:
            user.phone = user_data.phone
        if user_data.avatar_url is not None:
            user.avatar_url = user_data.avatar_url

        await db.commit()
        await db.refresh(user)

        return user

    @staticmethod
    async def change_password(
        db: AsyncSession,
        user: User,
        current_password: str,
        new_password: str,
    ) -> bool:
        """
        Change user password

        Args:
            db: Database session
            user: User
            current_password: Current password for verification
            new_password: New password

        Returns:
            True if password changed successfully

        Raises:
            ValueError: If current password is incorrect
        """
        # Verify current password
        if not verify_password(current_password, user.password_hash):
            raise ValueError("Incorrect current password")

        # Update password
        user.password_hash = get_password_hash(new_password)
        await db.commit()

        return True

    @staticmethod
    async def deactivate_user(db: AsyncSession, user: User) -> User:
        """
        Deactivate user account

        Args:
            db: Database session
            user: User to deactivate

        Returns:
            Deactivated user
        """
        user.is_active = False
        await db.commit()
        await db.refresh(user)

        return user

    @staticmethod
    async def activate_user(db: AsyncSession, user: User) -> User:
        """
        Activate user account

        Args:
            db: Database session
            user: User to activate

        Returns:
            Activated user
        """
        user.is_active = True
        await db.commit()
        await db.refresh(user)

        return user
