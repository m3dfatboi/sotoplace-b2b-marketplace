"""Order schemas for request/response validation"""

from datetime import datetime
from decimal import Decimal
from uuid import UUID
from pydantic import BaseModel, Field


class OrderBase(BaseModel):
    """Base order schema"""
    notes: str | None = None
    payment_terms: str | None = None
    deadline: datetime | None = None


class OrderCreate(OrderBase):
    """Schema for creating an order"""
    buyer_company_id: UUID
    seller_company_id: UUID


class OrderUpdate(BaseModel):
    """Schema for updating an order"""
    status: str | None = Field(
        None,
        pattern="^(draft|negotiation|approved|in_production|assembly|quality_check|shipping|delivered|completed|cancelled)$"
    )
    payment_status: str | None = Field(None, pattern="^(pending|partial|paid)$")
    assigned_manager_id: UUID | None = None
    assigned_constructor_id: UUID | None = None
    notes: str | None = None
    payment_terms: str | None = None
    deadline: datetime | None = None
    metadata: dict | None = None


class OrderResponse(OrderBase):
    """Schema for order response"""
    id: UUID
    order_number: str
    parent_order_id: UUID | None = None
    buyer_company_id: UUID
    seller_company_id: UUID
    created_by_user_id: UUID
    assigned_manager_id: UUID | None = None
    assigned_constructor_id: UUID | None = None
    status: str
    payment_status: str
    total_amount: Decimal
    currency: str
    approved_at: datetime | None = None
    completed_at: datetime | None = None
    metadata: dict
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class OrderItemBase(BaseModel):
    """Base order item schema"""
    name: str = Field(..., min_length=1, max_length=255)
    description: str | None = None
    quantity: Decimal = Field(..., gt=0)
    unit_price: Decimal = Field(..., ge=0)
    specifications: dict = Field(default_factory=dict)


class OrderItemCreate(OrderItemBase):
    """Schema for creating an order item"""
    order_id: UUID
    product_id: UUID | None = None
    variant_id: UUID | None = None
    parent_item_id: UUID | None = None


class OrderItemUpdate(BaseModel):
    """Schema for updating an order item"""
    name: str | None = Field(None, min_length=1, max_length=255)
    description: str | None = None
    quantity: Decimal | None = Field(None, gt=0)
    unit_price: Decimal | None = Field(None, ge=0)
    production_status: dict | None = None
    specifications: dict | None = None
    attachments: list[str] | None = None


class OrderItemResponse(OrderItemBase):
    """Schema for order item response"""
    id: UUID
    order_id: UUID
    product_id: UUID | None = None
    variant_id: UUID | None = None
    parent_item_id: UUID | None = None
    total_price: Decimal
    production_status: dict
    attachments: list[str]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
