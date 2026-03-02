"""Company service for business logic"""

from datetime import datetime
from typing import List, Optional
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import Company, CompanyMember, User
from app.schemas.company import CompanyCreate, CompanyUpdate


class CompanyService:
    """Service for company-related business logic"""

    @staticmethod
    async def create_company(
        db: AsyncSession,
        company_data: CompanyCreate,
        creator: User,
    ) -> Company:
        """
        Create a new company and add creator as admin

        Args:
            db: Database session
            company_data: Company creation data
            creator: User creating the company

        Returns:
            Created company
        """
        # Create company
        company = Company(
            name=company_data.name,
            legal_name=company_data.legal_name,
            inn=company_data.inn,
            description=company_data.description,
            website=company_data.website,
            tags=company_data.tags,
        )
        db.add(company)
        await db.flush()

        # Add creator as admin
        member = CompanyMember(
            user_id=creator.id,
            company_id=company.id,
            role="admin",
            joined_at=datetime.utcnow(),
        )
        db.add(member)

        await db.commit()
        await db.refresh(company)

        return company

    @staticmethod
    async def get_by_id(db: AsyncSession, company_id: UUID) -> Optional[Company]:
        """Get company by ID"""
        result = await db.execute(
            select(Company).where(Company.id == company_id)
        )
        return result.scalar_one_or_none()

    @staticmethod
    async def get_user_companies(db: AsyncSession, user_id: UUID) -> List[Company]:
        """Get all companies where user is a member"""
        result = await db.execute(
            select(Company)
            .join(CompanyMember)
            .where(CompanyMember.user_id == user_id)
            .where(CompanyMember.is_active == True)
        )
        return list(result.scalars().all())

    @staticmethod
    async def update_company(
        db: AsyncSession,
        company: Company,
        company_data: CompanyUpdate,
    ) -> Company:
        """Update company"""
        if company_data.name is not None:
            company.name = company_data.name
        if company_data.legal_name is not None:
            company.legal_name = company_data.legal_name
        if company_data.inn is not None:
            company.inn = company_data.inn
        if company_data.description is not None:
            company.description = company_data.description
        if company_data.logo_url is not None:
            company.logo_url = company_data.logo_url
        if company_data.website is not None:
            company.website = company_data.website
        if company_data.tags is not None:
            company.tags = company_data.tags
        if company_data.is_public is not None:
            company.is_public = company_data.is_public

        await db.commit()
        await db.refresh(company)

        return company

    @staticmethod
    async def add_member(
        db: AsyncSession,
        company_id: UUID,
        user_id: UUID,
        role: str,
        permissions: dict = None,
    ) -> CompanyMember:
        """
        Add member to company

        Args:
            db: Database session
            company_id: Company ID
            user_id: User ID
            role: Member role
            permissions: Optional permissions dict

        Returns:
            Created company member

        Raises:
            ValueError: If user is already a member
        """
        # Check if already a member
        existing = await db.execute(
            select(CompanyMember).where(
                CompanyMember.company_id == company_id,
                CompanyMember.user_id == user_id,
            )
        )
        if existing.scalar_one_or_none():
            raise ValueError("User is already a member of this company")

        # Add member
        member = CompanyMember(
            user_id=user_id,
            company_id=company_id,
            role=role,
            permissions=permissions or {},
            joined_at=datetime.utcnow(),
        )
        db.add(member)
        await db.commit()
        await db.refresh(member)

        return member

    @staticmethod
    async def check_user_access(
        db: AsyncSession,
        user_id: UUID,
        company_id: UUID,
        required_role: Optional[str] = None,
    ) -> Optional[CompanyMember]:
        """
        Check if user has access to company

        Args:
            db: Database session
            user_id: User ID
            company_id: Company ID
            required_role: Optional required role

        Returns:
            CompanyMember if user has access, None otherwise
        """
        query = select(CompanyMember).where(
            CompanyMember.user_id == user_id,
            CompanyMember.company_id == company_id,
            CompanyMember.is_active == True,
        )

        if required_role:
            # Admin always has access
            query = query.where(
                (CompanyMember.role == required_role) | (CompanyMember.role == "admin")
            )

        result = await db.execute(query)
        return result.scalar_one_or_none()
