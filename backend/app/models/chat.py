"""Chat and messaging models"""

from sqlalchemy import Boolean, Column, String, Text, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID, JSONB, ARRAY
from sqlalchemy.orm import relationship

from app.models.base import BaseModel


class Chat(BaseModel):
    """Chat model"""

    __tablename__ = "chats"

    type = Column(String(50), nullable=False)  # order, blueprint, general, support
    order_id = Column(UUID(as_uuid=True), ForeignKey("orders.id"), nullable=True)
    blueprint_id = Column(UUID(as_uuid=True), ForeignKey("blueprints.id"), nullable=True)
    last_message_at = Column(DateTime(timezone=True), nullable=True)

    # Relationships
    participants = relationship(
        "ChatParticipant",
        back_populates="chat",
        cascade="all, delete-orphan",
    )
    messages = relationship(
        "Message",
        back_populates="chat",
        cascade="all, delete-orphan",
    )

    def __repr__(self) -> str:
        return f"Chat(id={self.id}, type={self.type!r})"


class ChatParticipant(BaseModel):
    """Chat participant model"""

    __tablename__ = "chat_participants"

    chat_id = Column(UUID(as_uuid=True), ForeignKey("chats.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    company_id = Column(UUID(as_uuid=True), ForeignKey("companies.id"), nullable=False)
    role = Column(String(50), default="participant", nullable=False)  # owner, participant, observer
    joined_at = Column(DateTime(timezone=True), nullable=False)
    last_read_at = Column(DateTime(timezone=True), nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)

    # Relationships
    chat = relationship("Chat", back_populates="participants")

    def __repr__(self) -> str:
        return f"ChatParticipant(chat_id={self.chat_id}, user_id={self.user_id})"


class Message(BaseModel):
    """Message model"""

    __tablename__ = "messages"

    chat_id = Column(UUID(as_uuid=True), ForeignKey("chats.id", ondelete="CASCADE"), nullable=False)
    sender_user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    sender_company_id = Column(UUID(as_uuid=True), ForeignKey("companies.id"), nullable=False)

    content = Column(Text, nullable=True)
    message_type = Column(String(50), default="text", nullable=False)  # text, file, blueprint_version, status_update
    attachments = Column(JSONB, default=list, nullable=False)
    blueprint_version_id = Column(UUID(as_uuid=True), ForeignKey("blueprint_versions.id"), nullable=True)

    edited_at = Column(DateTime(timezone=True), nullable=True)
    is_deleted = Column(Boolean, default=False, nullable=False)

    # Relationships
    chat = relationship("Chat", back_populates="messages")

    def __repr__(self) -> str:
        return f"Message(id={self.id}, chat_id={self.chat_id}, sender_user_id={self.sender_user_id})"
