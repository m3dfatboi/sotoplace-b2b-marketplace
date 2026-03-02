"""Order API endpoints"""

from datetime import datetime
from typing import Any, List, Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select, or_
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.dependencies import get_current_active_user
from app.db import get_db
from app.models import CompanyMember, Order, OrderItem, User
from app.schemas.order import (
    OrderCreate,
    OrderItemCreate,
    OrderItemResponse,
    OrderItemUpdate,
    OrderResponse,
    OrderUpdate,
)

router = APIRouter(prefix="/orders", tags=["orders"])


async def check_order_access(
    order: Order,
    user: User,
    db: AsyncSession,
    required_role: Optional[str] = None,
) -> bool:
    """
    Check if user has access to order
    User must be member of buyer or seller company
    """
    # Check if user is member of buyer or seller company
    result = await db.execute(
        select(CompanyMember).where(
            CompanyMember.user_id == user.id,
            or_(
                CompanyMember.company_id == order.buyer_company_id,
                CompanyMember.company_id == order.seller_company_id,
            ),
            CompanyMember.is_active == True,
        )
    )
    member = result.scalar_one_or_none()

    if not member:
        return False

    # Check role if required
    if required_role and member.role != required_role and member.role != "admin":
        return False

    return True


@router.post("", response_model=OrderResponse, status_code=status.HTTP_201_CREATED)
async def create_order(
    order_data: OrderCreate,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
) -> Any:
    """
    Create a new order

    User must be member of buyer company
    """
    # Check if user is member of buyer company
    member_result = await db.execute(
        select(CompanyMember).where(
            CompanyMember.company_id == order_data.buyer_company_id,
            CompanyMember.user_id == current_user.id,
            CompanyMember.is_active == True,
        )
    )
    member = member_result.scalar_one_or_none()

    if not member:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Must be member of buyer company to create order",
        )

    # Generate order number
    from datetime import datetime
    order_count = await db.scalar(select(Order).count())
    order_number = f"ORD-{datetime.now().strftime('%Y-%m')}-{(order_count + 1):05d}"

    # Create order
    order = Order(
        order_number=order_number,
        buyer_company_id=order_data.buyer_company_id,
        seller_company_id=order_data.seller_company_id,
        created_by_user_id=current_user.id,
        notes=order_data.notes,
        payment_terms=order_data.payment_terms,
        deadline=order_data.deadline,
    )

    db.add(order)
    await db.commit()
    await db.refresh(order)

    return order


@router.get("", response_model=List[OrderResponse])
async def list_orders(
    company_id: Optional[UUID] = Query(None, description="Filter by company (buyer or seller)"),
    status_filter: Optional[str] = Query(None, alias="status", description="Filter by status"),
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(100, ge=1, le=100, description="Number of records to return"),
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
) -> Any:
    """
    List orders

    Returns orders where user's company is buyer or seller
    """
    # Get user's companies
    companies_result = await db.execute(
        select(CompanyMember.company_id).where(
            CompanyMember.user_id == current_user.id,
            CompanyMember.is_active == True,
        )
    )
    user_company_ids = [row[0] for row in companies_result.all()]

    if not user_company_ids:
        return []

    # Build query
    query = select(Order).where(
        or_(
            Order.buyer_company_id.in_(user_company_ids),
            Order.seller_company_id.in_(user_company_ids),
        )
    )

    # Apply filters
    if company_id:
        query = query.where(
            or_(
                Order.buyer_company_id == company_id,
                Order.seller_company_id == company_id,
            )
        )
    if status_filter:
        query = query.where(Order.status == status_filter)

    # Apply pagination
    query = query.order_by(Order.created_at.desc()).offset(skip).limit(limit)

    result = await db.execute(query)
    orders = result.scalars().all()

    return orders


@router.get("/{order_id}", response_model=OrderResponse)
async def get_order(
    order_id: UUID,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
) -> Any:
    """
    Get order by ID

    User must be member of buyer or seller company
    """
    result = await db.execute(
        select(Order).where(Order.id == order_id)
    )
    order = result.scalar_one_or_none()

    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found",
        )

    # Check access
    has_access = await check_order_access(order, current_user, db)
    if not has_access:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No access to this order",
        )

    return order


@router.patch("/{order_id}", response_model=OrderResponse)
async def update_order(
    order_id: UUID,
    order_data: OrderUpdate,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
) -> Any:
    """
    Update order

    Manager or admin of buyer/seller company can update
    """
    # Get order
    result = await db.execute(
        select(Order).where(Order.id == order_id)
    )
    order = result.scalar_one_or_none()

    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found",
        )

    # Check access (manager or admin)
    has_access = await check_order_access(order, current_user, db, required_role="manager")
    if not has_access:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only manager or admin can update order",
        )

    # Update fields
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


@router.delete("/{order_id}", status_code=status.HTTP_204_NO_CONTENT)
async def cancel_order(
    order_id: UUID,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
) -> None:
    """
    Cancel order (set status to cancelled)

    Manager or admin can cancel
    """
    # Get order
    result = await db.execute(
        select(Order).where(Order.id == order_id)
    )
    order = result.scalar_one_or_none()

    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found",
        )

    # Check access
    has_access = await check_order_access(order, current_user, db, required_role="manager")
    if not has_access:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only manager or admin can cancel order",
        )

    # Check if order can be cancelled
    if order.status in ["completed", "cancelled"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Cannot cancel order with status: {order.status}",
        )

    order.status = "cancelled"
    await db.commit()


# Order Items endpoints

@router.post("/{order_id}/items", response_model=OrderItemResponse, status_code=status.HTTP_201_CREATED)
async def create_order_item(
    order_id: UUID,
    item_data: OrderItemCreate,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
) -> Any:
    """
    Add item to order

    Manager or admin can add items
    """
    # Get order
    order_result = await db.execute(
        select(Order).where(Order.id == order_id)
    )
    order = order_result.scalar_one_or_none()

    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found",
        )

    # Check access
    has_access = await check_order_access(order, current_user, db, required_role="manager")
    if not has_access:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only manager or admin can add items",
        )

    # Calculate total price
    total_price = item_data.quantity * item_data.unit_price

    # Create item
    item = OrderItem(
        order_id=order_id,
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


@router.get("/{order_id}/items", response_model=List[OrderItemResponse])
async def list_order_items(
    order_id: UUID,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
) -> Any:
    """
    List all items in order

    User must have access to order
    """
    # Get order
    order_result = await db.execute(
        select(Order).where(Order.id == order_id)
    )
    order = order_result.scalar_one_or_none()

    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found",
        )

    # Check access
    has_access = await check_order_access(order, current_user, db)
    if not has_access:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No access to this order",
        )

    # Get items
    result = await db.execute(
        select(OrderItem).where(OrderItem.order_id == order_id)
    )
    items = result.scalars().all()

    return items


@router.patch("/{order_id}/items/{item_id}", response_model=OrderItemResponse)
async def update_order_item(
    order_id: UUID,
    item_id: UUID,
    item_data: OrderItemUpdate,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
) -> Any:
    """
    Update order item

    Manager or admin can update
    """
    # Get order
    order_result = await db.execute(
        select(Order).where(Order.id == order_id)
    )
    order = order_result.scalar_one_or_none()

    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found",
        )

    # Check access
    has_access = await check_order_access(order, current_user, db, required_role="manager")
    if not has_access:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only manager or admin can update items",
        )

    # Get item
    item_result = await db.execute(
        select(OrderItem).where(
            OrderItem.id == item_id,
            OrderItem.order_id == order_id,
        )
    )
    item = item_result.scalar_one_or_none()

    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Item not found",
        )

    # Store old total for order amount update
    old_total = item.total_price

    # Update fields
    if item_data.name is not None:
        item.name = item_data.name
    if item_data.description is not None:
        item.description = item_data.description
    if item_data.quantity is not None:
        item.quantity = item_data.quantity
    if item_data.unit_price is not None:
        item.unit_price = item_data.unit_price
    if item_data.production_status is not None:
        item.production_status = item_data.production_status
    if item_data.specifications is not None:
        item.specifications = item_data.specifications
    if item_data.attachments is not None:
        item.attachments = item_data.attachments

    # Recalculate total price
    item.total_price = item.quantity * item.unit_price

    # Update order total
    order.total_amount = order.total_amount - old_total + item.total_price

    await db.commit()
    await db.refresh(item)

    return item


@router.delete("/{order_id}/items/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_order_item(
    order_id: UUID,
    item_id: UUID,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
) -> None:
    """
    Delete order item

    Manager or admin can delete
    """
    # Get order
    order_result = await db.execute(
        select(Order).where(Order.id == order_id)
    )
    order = order_result.scalar_one_or_none()

    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found",
        )

    # Check access
    has_access = await check_order_access(order, current_user, db, required_role="manager")
    if not has_access:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only manager or admin can delete items",
        )

    # Get item
    item_result = await db.execute(
        select(OrderItem).where(
            OrderItem.id == item_id,
            OrderItem.order_id == order_id,
        )
    )
    item = item_result.scalar_one_or_none()

    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Item not found",
        )

    # Update order total
    order.total_amount -= item.total_price

    await db.delete(item)
    await db.commit()
