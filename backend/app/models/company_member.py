"""Company member model (user-company relationship)"""

from sqlalchemy import Boolean, Column, String, DateTime, ForeignKey, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship

from app.models.base import BaseModel


class CompanyMember(BaseModel):
    """Company member (user-company relationship with role)"""

    __tablename__ = "company_members"
    __table_args__ = (
        UniqueConstraint("user_id", "company_id", name="uq_user_company"),
    )

    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    company_id = Column(UUID(as_uuid=True), ForeignKey("companies.id", ondelete="CASCADE"), nullable=False)
    role = Column(String(50), nullable=False)  # admin, manager, constructor, client
    permissions = Column(JSONB, default=dict, nullable=False)
    joined_at = Column(DateTime(timezone=True), nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)

    # Relationships
    user = relationship("User", back_populates="company_memberships")
    company = relationship("Company", back_populates="members")

    def __repr__(self) -> str:
        return f"CompanyMember(user_id={self.user_id}, company_id={self.company_id}, role={self.role!r})"
