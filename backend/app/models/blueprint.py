"""Blueprint models for engineering drawings"""

from sqlalchemy import Column, String, Text, Integer, ForeignKey, DateTime, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.models.base import BaseModel


class Blueprint(BaseModel):
    """Blueprint model"""

    __tablename__ = "blueprints"

    order_id = Column(UUID(as_uuid=True), ForeignKey("orders.id", ondelete="CASCADE"), nullable=False)
    order_item_id = Column(UUID(as_uuid=True), ForeignKey("order_items.id"), nullable=True)
    created_by_user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    current_version_id = Column(UUID(as_uuid=True), nullable=True)
    status = Column(String(50), default="draft", nullable=False)  # draft, review, approved, rejected

    # Relationships
    versions = relationship(
        "BlueprintVersion",
        back_populates="blueprint",
        cascade="all, delete-orphan",
        foreign_keys="BlueprintVersion.blueprint_id",
    )

    def __repr__(self) -> str:
        return f"Blueprint(id={self.id}, name={self.name!r}, status={self.status!r})"


class BlueprintVersion(BaseModel):
    """Blueprint version model"""

    __tablename__ = "blueprint_versions"
    __table_args__ = (
        UniqueConstraint("blueprint_id", "version_number", name="uq_blueprint_version"),
    )

    blueprint_id = Column(UUID(as_uuid=True), ForeignKey("blueprints.id", ondelete="CASCADE"), nullable=False)
    version_number = Column(Integer, nullable=False)
    file_url = Column(Text, nullable=False)
    file_type = Column(String(20), nullable=False)  # pdf, dwg, step, iges, stl
    thumbnail_url = Column(Text, nullable=True)
    changes_description = Column(Text, nullable=True)
    created_by_user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)

    # Relationships
    blueprint = relationship("Blueprint", back_populates="versions", foreign_keys=[blueprint_id])
    approvals = relationship(
        "BlueprintApproval",
        back_populates="version",
        cascade="all, delete-orphan",
    )

    def __repr__(self) -> str:
        return f"BlueprintVersion(id={self.id}, blueprint_id={self.blueprint_id}, version={self.version_number})"


class BlueprintApproval(BaseModel):
    """Blueprint approval model"""

    __tablename__ = "blueprint_approvals"
    __table_args__ = (
        UniqueConstraint("blueprint_version_id", "approver_user_id", name="uq_version_approver"),
    )

    blueprint_version_id = Column(UUID(as_uuid=True), ForeignKey("blueprint_versions.id", ondelete="CASCADE"), nullable=False)
    approver_user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    status = Column(String(50), default="pending", nullable=False)  # pending, approved, rejected
    comment = Column(Text, nullable=True)
    approved_at = Column(DateTime(timezone=True), nullable=True)

    # Relationships
    version = relationship("BlueprintVersion", back_populates="approvals")

    def __repr__(self) -> str:
        return f"BlueprintApproval(id={self.id}, version_id={self.blueprint_version_id}, status={self.status!r})"
