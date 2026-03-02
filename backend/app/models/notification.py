"""Notification models"""

from sqlalchemy import Boolean, Column, String, Text, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship

from app.models.base import BaseModel


class Notification(BaseModel):
    """Notification model"""

    __tablename__ = "notifications"

    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    company_id = Column(UUID(as_uuid=True), ForeignKey("companies.id"), nullable=False)

    type = Column(String(100), nullable=False)
    priority = Column(String(20), default="normal", nullable=False)  # low, normal, high, urgent

    title = Column(String(255), nullable=False)
    message = Column(Text, nullable=False)

    # Related objects
    related_order_id = Column(UUID(as_uuid=True), ForeignKey("orders.id"), nullable=True)
    related_chat_id = Column(UUID(as_uuid=True), ForeignKey("chats.id"), nullable=True)
    related_blueprint_id = Column(UUID(as_uuid=True), ForeignKey("blueprints.id"), nullable=True)

    action_url = Column(Text, nullable=True)
    action_data = Column(JSONB, default=dict, nullable=False)

    # Status
    is_read = Column(Boolean, default=False, nullable=False)
    read_at = Column(DateTime(timezone=True), nullable=True)
    is_archived = Column(Boolean, default=False, nullable=False)

    expires_at = Column(DateTime(timezone=True), nullable=True)

    def __repr__(self) -> str:
        return f"Notification(id={self.id}, user_id={self.user_id}, type={self.type!r})"


class NotificationPreferences(BaseModel):
    """Notification preferences model"""

    __tablename__ = "notification_preferences"

    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, primary_key=True)
    company_id = Column(UUID(as_uuid=True), ForeignKey("companies.id", ondelete="CASCADE"), nullable=False, primary_key=True)

    preferences = Column(JSONB, nullable=False, default=dict)

    def __repr__(self) -> str:
        return f"NotificationPreferences(user_id={self.user_id}, company_id={self.company_id})"
