"""Audit log model for tracking all user actions"""

from sqlalchemy import Column, String, Text, Enum as SQLEnum
from sqlalchemy.dialects.postgresql import UUID, JSONB, INET
from sqlalchemy.orm import relationship

from app.models.base import BaseModel


class AuditLog(BaseModel):
    """Audit log model (immutable)"""

    __tablename__ = "audit_logs"

    # Who and where
    user_id = Column(UUID(as_uuid=True), nullable=True)  # null for system actions
    company_id = Column(UUID(as_uuid=True), nullable=True)
    ip_address = Column(INET, nullable=True)
    user_agent = Column(Text, nullable=True)

    # What
    action = Column(String(50), nullable=False)  # create, update, delete, view, approve, reject, export, login, logout
    entity_type = Column(String(50), nullable=False)  # order, product, user, company, blueprint, message, payment
    entity_id = Column(UUID(as_uuid=True), nullable=False)

    # Details
    description = Column(Text, nullable=True)
    changes = Column(JSONB, default=dict, nullable=False)
    log_metadata = Column(JSONB, default=dict, nullable=False)

    # Result
    status = Column(String(20), default="success", nullable=False)  # success, failure, partial
    error_message = Column(Text, nullable=True)

    def __repr__(self) -> str:
        return f"AuditLog(id={self.id}, action={self.action!r}, entity_type={self.entity_type!r})"
