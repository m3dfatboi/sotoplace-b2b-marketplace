"""User model"""

from sqlalchemy import Boolean, Column, String, DateTime
from sqlalchemy.orm import relationship

from app.models.base import BaseModel


class User(BaseModel):
    """User model"""

    __tablename__ = "users"

    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    phone = Column(String(50), nullable=True)
    full_name = Column(String(255), nullable=False)
    avatar_url = Column(String, nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)
    last_login_at = Column(DateTime(timezone=True), nullable=True)

    # Relationships
    company_memberships = relationship(
        "CompanyMember",
        back_populates="user",
        cascade="all, delete-orphan",
    )
    created_orders = relationship(
        "Order",
        foreign_keys="Order.created_by_user_id",
        back_populates="created_by",
    )
    managed_orders = relationship(
        "Order",
        foreign_keys="Order.assigned_manager_id",
        back_populates="assigned_manager",
    )

    def __repr__(self) -> str:
        return f"User(id={self.id}, email={self.email!r}, full_name={self.full_name!r})"
