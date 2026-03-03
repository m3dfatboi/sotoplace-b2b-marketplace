"""Company model"""

from sqlalchemy import Boolean, Column, String, Text, ARRAY, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import JSONB, UUID

from app.models.base import BaseModel


class Company(BaseModel):
    """Company (tenant) model"""

    __tablename__ = "companies"

    name = Column(String(255), nullable=False)
    legal_name = Column(String(255), nullable=True)
    inn = Column(String(20), nullable=True)
    description = Column(Text, nullable=True)
    logo_url = Column(Text, nullable=True)
    website = Column(String(255), nullable=True)
    tags = Column(ARRAY(String), default=list, nullable=False)
    is_verified = Column(Boolean, default=False, nullable=False)
    is_public = Column(Boolean, default=True, nullable=False)

    # Relationships
    members = relationship(
        "CompanyMember",
        back_populates="company",
        cascade="all, delete-orphan",
    )
    products = relationship(
        "Product",
        back_populates="company",
        cascade="all, delete-orphan",
    )
    settings = relationship(
        "CompanySettings",
        back_populates="company",
        uselist=False,
        cascade="all, delete-orphan",
    )
    buyer_orders = relationship(
        "Order",
        foreign_keys="Order.buyer_company_id",
        back_populates="buyer_company",
    )
    seller_orders = relationship(
        "Order",
        foreign_keys="Order.seller_company_id",
        back_populates="seller_company",
    )

    def __repr__(self) -> str:
        return f"Company(id={self.id}, name={self.name!r})"


class CompanySettings(BaseModel):
    """Company settings and details"""

    __tablename__ = "company_settings"

    company_id = Column(
        UUID(as_uuid=True),
        ForeignKey("companies.id"),
        nullable=False,
        unique=True,
    )
    bank_details = Column(JSONB, nullable=True)
    billing_address = Column(JSONB, nullable=True)
    shipping_address = Column(JSONB, nullable=True)
    catalog_visibility = Column(
        String(20),
        default="public",
        nullable=False,
    )
    settings = Column(JSONB, default=dict, nullable=False)

    # Relationships
    company = relationship("Company", back_populates="settings")
