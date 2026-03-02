"""Product model"""

from sqlalchemy import Boolean, Column, String, Text, Numeric, ARRAY, ForeignKey
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship

from app.models.base import BaseModel


class Product(BaseModel):
    """Product model"""

    __tablename__ = "products"

    company_id = Column(UUID(as_uuid=True), ForeignKey("companies.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    category = Column(String(100), nullable=True)
    base_price = Column(Numeric(15, 2), nullable=True)
    price_type = Column(String(20), default="fixed", nullable=False)
    is_customizable = Column(Boolean, default=False, nullable=False)
    images = Column(ARRAY(String), default=list, nullable=False)
    specifications = Column(JSONB, default=dict, nullable=False)
    qr_code_url = Column(Text, nullable=True)
    is_published = Column(Boolean, default=False, nullable=False)
    created_by = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)

    # Relationships
    company = relationship("Company", back_populates="products")
    variants = relationship(
        "ProductVariant",
        back_populates="product",
        cascade="all, delete-orphan",
    )
    tags = relationship(
        "ProductTag",
        back_populates="product",
        cascade="all, delete-orphan",
    )

    def __repr__(self) -> str:
        return f"Product(id={self.id}, name={self.name!r}, company_id={self.company_id})"


class ProductVariant(BaseModel):
    """Product variant model"""

    __tablename__ = "product_variants"

    product_id = Column(UUID(as_uuid=True), ForeignKey("products.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(255), nullable=False)
    sku = Column(String(100), nullable=True)
    price_modifier = Column(Numeric(15, 2), default=0, nullable=False)
    attributes = Column(JSONB, default=dict, nullable=False)
    stock_quantity = Column(Numeric(10, 2), default=0, nullable=False)
    is_available = Column(Boolean, default=True, nullable=False)

    # Relationships
    product = relationship("Product", back_populates="variants")

    def __repr__(self) -> str:
        return f"ProductVariant(id={self.id}, name={self.name!r}, product_id={self.product_id})"


class ProductTag(BaseModel):
    """Product tag model"""

    __tablename__ = "product_tags"

    product_id = Column(UUID(as_uuid=True), ForeignKey("products.id", ondelete="CASCADE"), nullable=False, primary_key=True)
    tag = Column(String(100), nullable=False, primary_key=True)

    # Relationships
    product = relationship("Product", back_populates="tags")
