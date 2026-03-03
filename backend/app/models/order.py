"""Order model"""

from sqlalchemy import Boolean, Column, String, Text, Numeric, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID, JSONB, ARRAY
from sqlalchemy.orm import relationship

from app.models.base import BaseModel


class Order(BaseModel):
    """Order model"""

    __tablename__ = "orders"

    order_number = Column(String(50), unique=True, nullable=False, index=True)
    parent_order_id = Column(UUID(as_uuid=True), ForeignKey("orders.id"), nullable=True)

    # Parties
    buyer_company_id = Column(UUID(as_uuid=True), ForeignKey("companies.id"), nullable=False)
    seller_company_id = Column(UUID(as_uuid=True), ForeignKey("companies.id"), nullable=False)
    created_by_user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    assigned_manager_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    assigned_constructor_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)

    # Status
    status = Column(String(50), default="draft", nullable=False)
    payment_status = Column(String(50), default="pending", nullable=False)

    # Finance
    total_amount = Column(Numeric(15, 2), default=0, nullable=False)
    currency = Column(String(3), default="RUB", nullable=False)
    payment_terms = Column(Text, nullable=True)

    # Dates
    approved_at = Column(DateTime(timezone=True), nullable=True)
    deadline = Column(DateTime(timezone=True), nullable=True)
    completed_at = Column(DateTime(timezone=True), nullable=True)

    # Metadata
    notes = Column(Text, nullable=True)
    order_metadata = Column(JSONB, default=dict, nullable=False)

    # Relationships
    buyer_company = relationship("Company", foreign_keys=[buyer_company_id], back_populates="buyer_orders")
    seller_company = relationship("Company", foreign_keys=[seller_company_id], back_populates="seller_orders")
    created_by = relationship("User", foreign_keys=[created_by_user_id], back_populates="created_orders")
    assigned_manager = relationship("User", foreign_keys=[assigned_manager_id], back_populates="managed_orders")

    parent_order = relationship("Order", remote_side="Order.id", backref="sub_orders")
    items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")

    def __repr__(self) -> str:
        return f"Order(id={self.id}, order_number={self.order_number!r}, status={self.status!r})"


class OrderItem(BaseModel):
    """Order item model"""

    __tablename__ = "order_items"

    order_id = Column(UUID(as_uuid=True), ForeignKey("orders.id", ondelete="CASCADE"), nullable=False)
    product_id = Column(UUID(as_uuid=True), ForeignKey("products.id"), nullable=True)
    variant_id = Column(UUID(as_uuid=True), ForeignKey("product_variants.id"), nullable=True)
    parent_item_id = Column(UUID(as_uuid=True), ForeignKey("order_items.id"), nullable=True)

    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    quantity = Column(Numeric(10, 2), nullable=False)
    unit_price = Column(Numeric(15, 2), nullable=False)
    total_price = Column(Numeric(15, 2), nullable=False)

    production_status = Column(JSONB, default=dict, nullable=False)
    specifications = Column(JSONB, default=dict, nullable=False)
    attachments = Column(ARRAY(String), default=list, nullable=False)

    # Relationships
    order = relationship("Order", back_populates="items")
    parent_item = relationship("OrderItem", remote_side="OrderItem.id", backref="sub_items")
    suppliers = relationship("OrderItemSupplier", back_populates="order_item", cascade="all, delete-orphan")

    def __repr__(self) -> str:
        return f"OrderItem(id={self.id}, name={self.name!r}, order_id={self.order_id})"


class OrderItemSupplier(BaseModel):
    """Order item supplier (subcontractor) model"""

    __tablename__ = "order_item_suppliers"

    order_item_id = Column(UUID(as_uuid=True), ForeignKey("order_items.id", ondelete="CASCADE"), nullable=False)
    supplier_company_id = Column(UUID(as_uuid=True), ForeignKey("companies.id"), nullable=False)
    sub_order_id = Column(UUID(as_uuid=True), ForeignKey("orders.id"), nullable=True)
    status = Column(String(50), nullable=True)
    assigned_at = Column(DateTime(timezone=True), nullable=False)
    completed_at = Column(DateTime(timezone=True), nullable=True)

    # Relationships
    order_item = relationship("OrderItem", back_populates="suppliers")

    def __repr__(self) -> str:
        return f"OrderItemSupplier(id={self.id}, order_item_id={self.order_item_id})"
