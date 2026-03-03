"""Product schemas for request/response validation"""

from datetime import datetime
from decimal import Decimal
from uuid import UUID
from pydantic import BaseModel, Field


class ProductBase(BaseModel):
    """Base product schema"""
    name: str = Field(..., min_length=1, max_length=255)
    description: str | None = None
    category: str | None = Field(None, max_length=100)
    base_price: Decimal | None = Field(None, ge=0)
    price_type: str = Field(default="fixed", pattern="^(fixed|negotiable|custom)$")
    is_customizable: bool = False
    specifications: dict = Field(default_factory=dict)


class ProductCreate(ProductBase):
    """Schema for creating a product"""
    company_id: UUID
    images: list[str] = Field(default_factory=list)


class ProductUpdate(BaseModel):
    """Schema for updating a product"""
    name: str | None = Field(None, min_length=1, max_length=255)
    description: str | None = None
    category: str | None = Field(None, max_length=100)
    base_price: Decimal | None = Field(None, ge=0)
    price_type: str | None = Field(None, pattern="^(fixed|negotiable|custom)$")
    is_customizable: bool | None = None
    images: list[str] | None = None
    specifications: dict | None = None
    is_published: bool | None = None


class ProductResponse(ProductBase):
    """Schema for product response"""
    id: UUID
    company_id: UUID
    images: list[str]
    qr_code_url: str | None = None
    is_published: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class ProductVariantBase(BaseModel):
    """Base product variant schema"""
    name: str = Field(..., min_length=1, max_length=255)
    sku: str | None = Field(None, max_length=100)
    price_modifier: Decimal = Field(default=0)
    attributes: dict = Field(default_factory=dict)
    stock_quantity: Decimal = Field(default=0, ge=0)


class ProductVariantCreate(ProductVariantBase):
    """Schema for creating a product variant"""
    product_id: UUID


class ProductVariantUpdate(BaseModel):
    """Schema for updating a product variant"""
    name: str | None = Field(None, min_length=1, max_length=255)
    sku: str | None = Field(None, max_length=100)
    price_modifier: Decimal | None = Field(None)
    attributes: dict | None = None
    stock_quantity: Decimal | None = Field(None, ge=0)
    is_available: bool | None = None


class ProductVariantResponse(ProductVariantBase):
    """Schema for product variant response"""
    id: UUID
    product_id: UUID
    is_available: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
