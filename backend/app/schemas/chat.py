"""Chat schemas for request/response validation"""

from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, Field


class ChatBase(BaseModel):
    """Base chat schema"""
    type: str = Field(..., pattern="^(order|blueprint|general|support)$")


class ChatCreate(ChatBase):
    """Schema for creating a chat"""
    order_id: UUID | None = None
    blueprint_id: UUID | None = None
    company_id: UUID  # Company context for creator


class ChatResponse(ChatBase):
    """Schema for chat response"""
    id: UUID
    order_id: UUID | None = None
    blueprint_id: UUID | None = None
    last_message_at: datetime | None = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class MessageBase(BaseModel):
    """Base message schema"""
    content: str | None = None
    message_type: str = Field(default="text", pattern="^(text|file|blueprint_version|status_update)$")


class MessageCreate(MessageBase):
    """Schema for creating a message"""
    attachments: list[dict] | None = None
    blueprint_version_id: UUID | None = None


class MessageResponse(MessageBase):
    """Schema for message response"""
    id: UUID
    chat_id: UUID
    sender_user_id: UUID
    sender_company_id: UUID
    attachments: list[dict]
    blueprint_version_id: UUID | None = None
    created_at: datetime
    updated_at: datetime
    edited_at: datetime | None = None
    is_deleted: bool

    class Config:
        from_attributes = True
