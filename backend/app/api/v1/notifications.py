"""Notification API endpoints"""

from datetime import datetime
from typing import Any, List, Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select, func, and_
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.dependencies import get_current_active_user
from app.db import get_db
from app.models import Notification, NotificationPreferences, User
from app.schemas.notification import (
    NotificationCreate,
    NotificationResponse,
    NotificationMarkRead,
    NotificationPreferencesUpdate,
    NotificationPreferencesResponse,
    NotificationStats,
)

router = APIRouter(prefix="/notifications", tags=["notifications"])


@router.get("", response_model=List[NotificationResponse])
async def get_notifications(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    unread_only: bool = Query(False),
    notification_type: Optional[str] = Query(None),
    priority: Optional[str] = Query(None),
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
) -> Any:
    """
    Get user notifications with filters

    - **skip**: Number of notifications to skip
    - **limit**: Maximum number of notifications to return
    - **unread_only**: Show only unread notifications
    - **notification_type**: Filter by notification type
    - **priority**: Filter by priority (low, normal, high, urgent)
    """
    query = select(Notification).where(Notification.user_id == current_user.id)

    if unread_only:
        query = query.where(Notification.is_read == False)

    if notification_type:
        query = query.where(Notification.type == notification_type)

    if priority:
        query = query.where(Notification.priority == priority)

    query = query.order_by(Notification.created_at.desc()).offset(skip).limit(limit)

    result = await db.execute(query)
    notifications = result.scalars().all()

    return notifications


@router.get("/stats", response_model=NotificationStats)
async def get_notification_stats(
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
) -> Any:
    """Get notification statistics for current user"""

    # Total count
    total_result = await db.execute(
        select(func.count(Notification.id)).where(Notification.user_id == current_user.id)
    )
    total = total_result.scalar() or 0

    # Unread count
    unread_result = await db.execute(
        select(func.count(Notification.id)).where(
            and_(
                Notification.user_id == current_user.id,
                Notification.is_read == False,
            )
        )
    )
    unread = unread_result.scalar() or 0

    # By type
    type_result = await db.execute(
        select(Notification.type, func.count(Notification.id))
        .where(Notification.user_id == current_user.id)
        .group_by(Notification.type)
    )
    by_type = {row[0]: row[1] for row in type_result.all()}

    # By priority
    priority_result = await db.execute(
        select(Notification.priority, func.count(Notification.id))
        .where(Notification.user_id == current_user.id)
        .group_by(Notification.priority)
    )
    by_priority = {row[0]: row[1] for row in priority_result.all()}

    return NotificationStats(
        total=total,
        unread=unread,
        by_type=by_type,
        by_priority=by_priority,
    )


@router.get("/{notification_id}", response_model=NotificationResponse)
async def get_notification(
    notification_id: UUID,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
) -> Any:
    """Get specific notification"""
    result = await db.execute(
        select(Notification).where(
            Notification.id == notification_id,
            Notification.user_id == current_user.id,
        )
    )
    notification = result.scalar_one_or_none()

    if notification is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Notification not found",
        )

    return notification


@router.patch("/{notification_id}/read", response_model=NotificationResponse)
async def mark_notification_read(
    notification_id: UUID,
    data: NotificationMarkRead,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
) -> Any:
    """Mark notification as read/unread"""
    result = await db.execute(
        select(Notification).where(
            Notification.id == notification_id,
            Notification.user_id == current_user.id,
        )
    )
    notification = result.scalar_one_or_none()

    if notification is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Notification not found",
        )

    notification.is_read = data.is_read
    if data.is_read:
        notification.read_at = datetime.utcnow()
    else:
        notification.read_at = None

    await db.commit()
    await db.refresh(notification)

    return notification


@router.post("/mark-all-read", status_code=status.HTTP_204_NO_CONTENT)
async def mark_all_notifications_read(
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
) -> None:
    """Mark all notifications as read"""
    from sqlalchemy import update

    await db.execute(
        update(Notification)
        .where(
            and_(
                Notification.user_id == current_user.id,
                Notification.is_read == False,
            )
        )
        .values(is_read=True, read_at=datetime.utcnow())
    )
    await db.commit()


@router.patch("/{notification_id}/archive", response_model=NotificationResponse)
async def archive_notification(
    notification_id: UUID,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
) -> Any:
    """Archive notification"""
    result = await db.execute(
        select(Notification).where(
            Notification.id == notification_id,
            Notification.user_id == current_user.id,
        )
    )
    notification = result.scalar_one_or_none()

    if notification is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Notification not found",
        )

    notification.is_archived = True
    await db.commit()
    await db.refresh(notification)

    return notification


@router.delete("/{notification_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_notification(
    notification_id: UUID,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
) -> None:
    """Delete notification"""
    result = await db.execute(
        select(Notification).where(
            Notification.id == notification_id,
            Notification.user_id == current_user.id,
        )
    )
    notification = result.scalar_one_or_none()

    if notification is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Notification not found",
        )

    await db.delete(notification)
    await db.commit()


@router.get("/preferences/me", response_model=NotificationPreferencesResponse)
async def get_notification_preferences(
    company_id: UUID = Query(..., description="Company ID for preferences"),
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
) -> Any:
    """Get notification preferences for current user in specific company"""
    result = await db.execute(
        select(NotificationPreferences).where(
            NotificationPreferences.user_id == current_user.id,
            NotificationPreferences.company_id == company_id,
        )
    )
    preferences = result.scalar_one_or_none()

    if preferences is None:
        # Create default preferences
        preferences = NotificationPreferences(
            user_id=current_user.id,
            company_id=company_id,
            preferences={
                "order_status_change": {"email": True, "push": True, "sms": False},
                "new_message": {"email": False, "push": True, "sms": False},
                "blueprint_approval": {"email": True, "push": True, "sms": False},
                "payment_received": {"email": True, "push": True, "sms": True},
                "deadline_approaching": {"email": True, "push": True, "sms": True},
            },
        )
        db.add(preferences)
        await db.commit()
        await db.refresh(preferences)

    return preferences


@router.patch("/preferences/me", response_model=NotificationPreferencesResponse)
async def update_notification_preferences(
    company_id: UUID = Query(..., description="Company ID for preferences"),
    data: NotificationPreferencesUpdate = ...,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
) -> Any:
    """Update notification preferences"""
    result = await db.execute(
        select(NotificationPreferences).where(
            NotificationPreferences.user_id == current_user.id,
            NotificationPreferences.company_id == company_id,
        )
    )
    preferences = result.scalar_one_or_none()

    if preferences is None:
        # Create new preferences
        preferences = NotificationPreferences(
            user_id=current_user.id,
            company_id=company_id,
            preferences=data.preferences,
        )
        db.add(preferences)
    else:
        # Update existing preferences
        preferences.preferences = data.preferences
        preferences.updated_at = datetime.utcnow()

    await db.commit()
    await db.refresh(preferences)

    return preferences
