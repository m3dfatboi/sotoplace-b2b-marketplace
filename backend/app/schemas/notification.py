"""Notification schemas"""

from datetime import datetime
from typing import Any, Dict, Optional
from uuid import UUID

from pydantic import BaseModel, Field


class NotificationBase(BaseModel):
    """Base notification schema"""

    title: str = Field(..., max_length=255)
    message: str
    priority: str = Field(default="normal", pattern="^(low|normal|high|urgent)$")


class NotificationCreate(NotificationBase):
    """Create notification schema"""

    type: str = Field(
        ...,
        pattern="^(order_status_change|new_message|blueprint_approval|payment_received|deadline_approaching|new_contractor_request|contractor_response|system_announcement)$",
    )
    related_order_id: Optional[UUID] = None
    related_chat_id: Optional[UUID] = None
    related_blueprint_id: Optional[UUID] = None
    action_url: Optional[str] = None
    action_data: Dict[str, Any] = Field(default_factory=dict)


class NotificationResponse(NotificationBase):
    """Notification response schema"""

    id: UUID
    user_id: UUID
    company_id: UUID
    type: str
    related_order_id: Optional[UUID] = None
    related_chat_id: Optional[UUID] = None
    related_blueprint_id: Optional[UUID] = None
    action_url: Optional[str] = None
    action_data: Dict[str, Any]
    is_read: bool
    read_at: Optional[datetime] = None
    is_archived: bool
    created_at: datetime
    expires_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class NotificationPreferencesUpdate(BaseModel):
    """Update notification preferences"""

    preferences: Dict[str, Dict[str, bool]] = Field(
        ...,
        description="Notification preferences by type and channel",
        example={
            "order_status_change": {"email": True, "push": True, "sms": False},
            "new_message": {"email": False, "push": True, "sms": False},
        },
    )


class NotificationPreferencesResponse(BaseModel):
    """Notification preferences response"""

    user_id: UUID
    company_id: UUID
    preferences: Dict[str, Dict[str, bool]]
    updated_at: datetime

    class Config:
        from_attributes = True


class NotificationMarkRead(BaseModel):
    """Mark notification as read"""

    is_read: bool = True


class NotificationStats(BaseModel):
    """Notification statistics"""

    total: int
    unread: int
    by_type: Dict[str, int]
    by_priority: Dict[str, int]
