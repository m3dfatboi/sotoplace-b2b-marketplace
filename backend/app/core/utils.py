"""Utility functions for the application"""

from typing import Optional
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import CompanyMember


async def check_user_company_role(
    db: AsyncSession,
    user_id: UUID,
    company_id: UUID,
    required_roles: Optional[list[str]] = None,
) -> Optional[CompanyMember]:
    """
    Check if user is member of company with required role

    Args:
        db: Database session
        user_id: User ID
        company_id: Company ID
        required_roles: List of required roles (e.g., ["admin", "manager"])

    Returns:
        CompanyMember if user has access, None otherwise
    """
    query = select(CompanyMember).where(
        CompanyMember.user_id == user_id,
        CompanyMember.company_id == company_id,
        CompanyMember.is_active == True,
    )

    if required_roles:
        query = query.where(CompanyMember.role.in_(required_roles))

    result = await db.execute(query)
    return result.scalar_one_or_none()


async def check_user_permission(
    db: AsyncSession,
    user_id: UUID,
    company_id: UUID,
    permission: str,
) -> bool:
    """
    Check if user has specific permission in company

    Args:
        db: Database session
        user_id: User ID
        company_id: Company ID
        permission: Permission to check (e.g., "orders:create")

    Returns:
        True if user has permission, False otherwise
    """
    member = await check_user_company_role(db, user_id, company_id)

    if not member:
        return False

    # Admin has all permissions
    if member.role == "admin":
        return True

    # Check specific permission in member.permissions JSONB
    if not member.permissions:
        return False

    # Parse permission (e.g., "orders:create" -> resource="orders", action="create")
    try:
        resource, action = permission.split(":")
        return member.permissions.get(resource, {}).get(action, False)
    except (ValueError, AttributeError):
        return False


def generate_order_number(count: int) -> str:
    """
    Generate order number in format: ORD-YYYY-MM-XXXXX

    Args:
        count: Current order count

    Returns:
        Order number string
    """
    from datetime import datetime

    now = datetime.utcnow()
    return f"ORD-{now.strftime('%Y-%m')}-{(count + 1):05d}"


def calculate_order_total(items: list) -> float:
    """
    Calculate total amount for order items

    Args:
        items: List of order items with total_price attribute

    Returns:
        Total amount
    """
    return sum(float(item.total_price) for item in items)
