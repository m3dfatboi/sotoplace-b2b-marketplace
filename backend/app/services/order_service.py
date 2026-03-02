"""Order service for business logic"""

from datetime import datetime
from decimal import Decimal
from typing import List, Optional
from uuid import UUID

from sqlalchemy import select, or_
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import CompanyMember, Order, OrderItem
from app.schemas.order import OrderCreate, OrderItemCreate, OrderUpdate


class OrderService:
    """Service for order-related business logic"""

    @staticmethod
    async def create_order(
        db: AsyncSession,
        order_data: OrderCreate,
        creator_id: UUID,
    ) -> Order:
        """
        Create a new order

        Args:
            db: Database session
            order_data: Order creation data
            creator_id: User creating the order

        Returns:
            Created order
        """
        # Generate order number
        count = await db.scalar(select(Order).count())
        order_number = f"ORD-{datetime.utcnow().strftime('%Y-%m')}-{(count + 1):05d}"

        # Create order
        order = Order(
            order_number=order_number,
            buyer_company_id=order_data.buyer_company_id,
            seller_company_id=order_data.seller_company_id,
            created_by_user_id=creator_id,
            notes=order_data.notes,
            payment_terms=order_data.payment_terms,
            deadline=order_data.deadline,
        )

        db.add(order)
        await db.commit()
        await db.refresh(order)

        return order

    @staticmethod
    async def get_by_id(db: AsyncSession, order_id: UUID) -> Optional[Order]:
        """Get order by ID"""
        result = await db.execute(
            select(Order).where(Order.id == order_id)
        )
        return result.scalar_one_or_none()

    @staticmethod
    async def get_user_orders(
        db: AsyncSession,
        user_id: UUID,
        status: Optional[str] = None,
    ) -> List[Order]:
        """
        Get orders where user's company is buyer or seller

        Args:
            db: Database session
            user_id: User ID
            status: Optional status filter

        Returns:
            List of orders
        """
        # Get user's companies
        companies_result = await db.execute(
            select(CompanyMember.company_id).where(
                CompanyMember.user_id == user_id,
                CompanyMember.is_active == True,
            )
        )
        company_ids = [row[0] for row in companies_result.all()]

        if not company_ids:
            return []

        # Build query
        query = select(Order).where(
            or_(
                Order.buyer_company_id.in_(company_ids),
                Order.seller_company_id.in_(company_ids),
            )
        )

        if status:
            query = query.where(Order.status == status)

        query = query.order_by(Order.created_at.desc())

        result = await db.execute(query)
        return list(result.scalars().all())

    @staticmethod
    async def update_order(
        db: AsyncSession,
        order: Order,
        order_data: OrderUpdate,
    ) -> Order:
        """Update order"""
        if order_data.status is not None:
            order.status = order_data.status
            if order_data.status == "approved":
                order.approved_at = datetime.utcnow()
            elif order_data.status == "completed":
                order.completed_at = datetime.utcnow()

        if order_data.payment_status is not None:
            order.payment_status = order_data.payment_status
        if order_data.assigned_manager_id is not None:
            order.assigned_manager_id = order_data.assigned_manager_id
        if order_data.assigned_constructor_id is not None:
            order.assigned_constructor_id = order_data.assigned_constructor_id
        if order_data.notes is not None:
            order.notes = order_data.notes
        if order_data.payment_terms is not None:
            order.payment_terms = order_data.payment_terms
        if order_data.deadline is not None:
            order.deadline = order_data.deadline
        if order_data.metadata is not None:
            order.metadata = order_data.metadata

        await db.commit()
        await db.refresh(order)

        return order

    @staticmethod
    async def cancel_order(db: AsyncSession, order: Order) -> Order:
        """
        Cancel order

        Args:
            db: Database session
            order: Order to cancel

        Returns:
            Cancelled order

        Raises:
            ValueError: If order cannot be cancelled
        """
        if order.status in ["completed", "cancelled"]:
            raise ValueError(f"Cannot cancel order with status: {order.status}")

        order.status = "cancelled"
        await db.commit()
        await db.refresh(order)

        return order

    @staticmethod
    async def add_item(
        db: AsyncSession,
        order: Order,
        item_data: OrderItemCreate,
    ) -> OrderItem:
        """
        Add item to order

        Args:
            db: Database session
            order: Order to add item to
            item_data: Item data

        Returns:
            Created order item
        """
        # Calculate total price
        total_price = item_data.quantity * item_data.unit_price

        # Create item
        item = OrderItem(
            order_id=order.id,
            product_id=item_data.product_id,
            variant_id=item_data.variant_id,
            parent_item_id=item_data.parent_item_id,
            name=item_data.name,
            description=item_data.description,
            quantity=item_data.quantity,
            unit_price=item_data.unit_price,
            total_price=total_price,
            specifications=item_data.specifications,
        )

        db.add(item)

        # Update order total
        order.total_amount += total_price

        await db.commit()
        await db.refresh(item)

        return item

    @staticmethod
    async def get_order_items(db: AsyncSession, order_id: UUID) -> List[OrderItem]:
        """Get all items in order"""
        result = await db.execute(
            select(OrderItem).where(OrderItem.order_id == order_id)
        )
        return list(result.scalars().all())

    @staticmethod
    async def calculate_order_total(db: AsyncSession, order: Order) -> Decimal:
        """
        Recalculate order total from items

        Args:
            db: Database session
            order: Order

        Returns:
            Total amount
        """
        items = await OrderService.get_order_items(db, order.id)
        total = sum(item.total_price for item in items)
        return Decimal(str(total))

    @staticmethod
    async def check_user_access(
        db: AsyncSession,
        user_id: UUID,
        order: Order,
    ) -> bool:
        """
        Check if user has access to order

        Args:
            db: Database session
            user_id: User ID
            order: Order

        Returns:
            True if user has access, False otherwise
        """
        result = await db.execute(
            select(CompanyMember).where(
                CompanyMember.user_id == user_id,
                or_(
                    CompanyMember.company_id == order.buyer_company_id,
                    CompanyMember.company_id == order.seller_company_id,
                ),
                CompanyMember.is_active == True,
            )
        )
        return result.scalar_one_or_none() is not None

    @staticmethod
    async def validate_status_transition(
        current_status: str,
        new_status: str,
    ) -> bool:
        """
        Validate if status transition is allowed

        Args:
            current_status: Current order status
            new_status: New order status

        Returns:
            True if transition is allowed, False otherwise
        """
        # Define allowed transitions
        allowed_transitions = {
            "draft": ["negotiation", "cancelled"],
            "negotiation": ["approved", "cancelled"],
            "approved": ["in_production", "cancelled"],
            "in_production": ["assembly", "cancelled"],
            "assembly": ["quality_check"],
            "quality_check": ["shipping", "in_production"],  # Can go back to production
            "shipping": ["delivered"],
            "delivered": ["completed"],
            "completed": [],  # Final state
            "cancelled": [],  # Final state
        }

        return new_status in allowed_transitions.get(current_status, [])
