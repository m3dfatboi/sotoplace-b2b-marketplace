"""Company API endpoints"""

from typing import Any, List
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.api.dependencies import get_current_active_user
from app.db import get_db
from app.models import Company, CompanyMember, User
from app.schemas.company import (
    CompanyCreate,
    CompanyMemberCreate,
    CompanyMemberResponse,
    CompanyMemberUpdate,
    CompanyResponse,
    CompanyUpdate,
)

router = APIRouter(prefix="/companies", tags=["companies"])


@router.post("", response_model=CompanyResponse, status_code=status.HTTP_201_CREATED)
async def create_company(
    company_data: CompanyCreate,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
) -> Any:
    """
    Create a new company

    The current user will be automatically added as admin
    """
    from datetime import datetime

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

    # Add current user as admin
    member = CompanyMember(
        user_id=current_user.id,
        company_id=company.id,
        role="admin",
        joined_at=datetime.utcnow(),
    )
    db.add(member)

    await db.commit()
    await db.refresh(company)

    return company


@router.get("/my", response_model=List[CompanyResponse])
async def get_my_companies(
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
) -> Any:
    """
    Get all companies where current user is a member
    """
    result = await db.execute(
        select(Company)
        .join(CompanyMember)
        .where(CompanyMember.user_id == current_user.id)
        .where(CompanyMember.is_active == True)
    )
    companies = result.scalars().all()
    return companies


@router.get("/{company_id}", response_model=CompanyResponse)
async def get_company(
    company_id: UUID,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
) -> Any:
    """
    Get company by ID

    User must be a member of the company
    """
    # Check if user is member
    member_result = await db.execute(
        select(CompanyMember).where(
            CompanyMember.company_id == company_id,
            CompanyMember.user_id == current_user.id,
            CompanyMember.is_active == True,
        )
    )
    member = member_result.scalar_one_or_none()

    if not member:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not a member of this company",
        )

    # Get company
    result = await db.execute(
        select(Company).where(Company.id == company_id)
    )
    company = result.scalar_one_or_none()

    if not company:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Company not found",
        )

    return company


@router.patch("/{company_id}", response_model=CompanyResponse)
async def update_company(
    company_id: UUID,
    company_data: CompanyUpdate,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
) -> Any:
    """
    Update company

    Only admin can update company
    """
    # Check if user is admin
    member_result = await db.execute(
        select(CompanyMember).where(
            CompanyMember.company_id == company_id,
            CompanyMember.user_id == current_user.id,
            CompanyMember.role == "admin",
            CompanyMember.is_active == True,
        )
    )
    member = member_result.scalar_one_or_none()

    if not member:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admin can update company",
        )

    # Get company
    result = await db.execute(
        select(Company).where(Company.id == company_id)
    )
    company = result.scalar_one_or_none()

    if not company:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Company not found",
        )

    # Update fields
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


@router.get("/{company_id}/members", response_model=List[CompanyMemberResponse])
async def get_company_members(
    company_id: UUID,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
) -> Any:
    """
    Get all members of a company

    User must be a member of the company
    """
    # Check if user is member
    member_check = await db.execute(
        select(CompanyMember).where(
            CompanyMember.company_id == company_id,
            CompanyMember.user_id == current_user.id,
            CompanyMember.is_active == True,
        )
    )
    if not member_check.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not a member of this company",
        )

    # Get all members
    result = await db.execute(
        select(CompanyMember).where(
            CompanyMember.company_id == company_id,
            CompanyMember.is_active == True,
        )
    )
    members = result.scalars().all()
    return members


@router.post("/{company_id}/members", response_model=CompanyMemberResponse, status_code=status.HTTP_201_CREATED)
async def add_company_member(
    company_id: UUID,
    member_data: CompanyMemberCreate,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
) -> Any:
    """
    Add a member to company

    Only admin can add members
    """
    from datetime import datetime

    # Check if user is admin
    admin_check = await db.execute(
        select(CompanyMember).where(
            CompanyMember.company_id == company_id,
            CompanyMember.user_id == current_user.id,
            CompanyMember.role == "admin",
            CompanyMember.is_active == True,
        )
    )
    if not admin_check.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admin can add members",
        )

    # Check if user exists
    user_result = await db.execute(
        select(User).where(User.id == member_data.user_id)
    )
    user = user_result.scalar_one_or_none()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    # Check if already a member
    existing_member = await db.execute(
        select(CompanyMember).where(
            CompanyMember.company_id == company_id,
            CompanyMember.user_id == member_data.user_id,
        )
    )
    if existing_member.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User is already a member",
        )

    # Add member
    member = CompanyMember(
        user_id=member_data.user_id,
        company_id=company_id,
        role=member_data.role,
        permissions=member_data.permissions,
        joined_at=datetime.utcnow(),
    )
    db.add(member)
    await db.commit()
    await db.refresh(member)

    return member
