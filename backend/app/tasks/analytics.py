"""Analytics calculation tasks"""

from datetime import datetime, timedelta
from typing import Optional
from uuid import UUID

from sqlalchemy import select, func, and_
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.celery_app import celery_app
from app.db import async_session_maker
from app.models import (
    CompanyAnalytics,
    Order,
    OrderAnalytics,
    OrderItem,
    Product,
)


@celery_app.task(name="calculate_company_analytics")
def calculate_company_analytics(
    company_id: str,
    period_type: str = "monthly",
    period_start: Optional[str] = None,
) -> dict:
    """
    Calculate analytics for a company

    Args:
        company_id: Company UUID
        period_type: Period type (daily, weekly, monthly, quarterly, yearly)
        period_start: Optional period start date (YYYY-MM-DD)

    Returns:
        dict with analytics data
    """
    import asyncio

    async def _calculate():
        async with async_session_maker() as db:
            company_uuid = UUID(company_id)

            # Determine period dates
            if period_start:
                start_date = datetime.strptime(period_start, "%Y-%m-%d").date()
            else:
                start_date = datetime.utcnow().date().replace(day=1)

            if period_type == "daily":
                end_date = start_date + timedelta(days=1)
            elif period_type == "weekly":
                end_date = start_date + timedelta(weeks=1)
            elif period_type == "monthly":
                # Next month
                if start_date.month == 12:
                    end_date = start_date.replace(year=start_date.year + 1, month=1)
                else:
                    end_date = start_date.replace(month=start_date.month + 1)
            elif period_type == "quarterly":
                end_date = start_date + timedelta(days=90)
            else:  # yearly
                end_date = start_date.replace(year=start_date.year + 1)

            # Calculate metrics for orders where company is seller
            seller_orders = await db.execute(
                select(Order).where(
                    Order.seller_company_id == company_uuid,
                    Order.created_at >= start_date,
                    Order.created_at < end_date,
                )
            )
            seller_orders_list = seller_orders.scalars().all()

            total_orders = len(seller_orders_list)
            completed_orders = len([o for o in seller_orders_list if o.status == "completed"])
            cancelled_orders = len([o for o in seller_orders_list if o.status == "cancelled"])
            total_revenue = sum(float(o.total_amount) for o in seller_orders_list if o.status == "completed")
            avg_order_value = total_revenue / completed_orders if completed_orders > 0 else 0

            # Calculate metrics for orders where company is buyer
            buyer_orders = await db.execute(
                select(Order).where(
                    Order.buyer_company_id == company_uuid,
                    Order.created_at >= start_date,
                    Order.created_at < end_date,
                )
            )
            buyer_orders_list = buyer_orders.scalars().all()
            total_purchases = sum(float(o.total_amount) for o in buyer_orders_list if o.status == "completed")

            # Get unique suppliers
            supplier_ids = set(o.seller_company_id for o in buyer_orders_list)
            active_suppliers_count = len(supplier_ids)

            # Top products (for sellers)
            top_products = []
            if seller_orders_list:
                # Get all order items for these orders
                order_ids = [o.id for o in seller_orders_list]
                items_result = await db.execute(
                    select(OrderItem).where(OrderItem.order_id.in_(order_ids))
                )
                items = items_result.scalars().all()

                # Group by product
                product_stats = {}
                for item in items:
                    if item.product_id:
                        if item.product_id not in product_stats:
                            product_stats[item.product_id] = {
                                "revenue": 0,
                                "orders_count": 0,
                            }
                        product_stats[item.product_id]["revenue"] += float(item.total_price)
                        product_stats[item.product_id]["orders_count"] += 1

                # Get top 5 products
                sorted_products = sorted(
                    product_stats.items(),
                    key=lambda x: x[1]["revenue"],
                    reverse=True,
                )[:5]

                for product_id, stats in sorted_products:
                    product_result = await db.execute(
                        select(Product).where(Product.id == product_id)
                    )
                    product = product_result.scalar_one_or_none()
                    if product:
                        top_products.append({
                            "product_id": str(product_id),
                            "product_name": product.name,
                            "revenue": stats["revenue"],
                            "orders_count": stats["orders_count"],
                        })

            # Check if analytics record exists
            existing = await db.execute(
                select(CompanyAnalytics).where(
                    CompanyAnalytics.company_id == company_uuid,
                    CompanyAnalytics.period_type == period_type,
                    CompanyAnalytics.period_start == start_date,
                )
            )
            analytics = existing.scalar_one_or_none()

            if analytics:
                # Update existing
                analytics.total_orders_count = total_orders
                analytics.completed_orders_count = completed_orders
                analytics.cancelled_orders_count = cancelled_orders
                analytics.total_revenue = total_revenue
                analytics.average_order_value = avg_order_value
                analytics.total_purchases = total_purchases
                analytics.active_suppliers_count = active_suppliers_count
                analytics.top_products = top_products
                analytics.calculated_at = datetime.utcnow()
            else:
                # Create new
                analytics = CompanyAnalytics(
                    company_id=company_uuid,
                    period_type=period_type,
                    period_start=start_date,
                    period_end=end_date,
                    total_orders_count=total_orders,
                    completed_orders_count=completed_orders,
                    cancelled_orders_count=cancelled_orders,
                    total_revenue=total_revenue,
                    average_order_value=avg_order_value,
                    total_purchases=total_purchases,
                    active_suppliers_count=active_suppliers_count,
                    top_products=top_products,
                )
                db.add(analytics)

            await db.commit()

            return {
                "company_id": company_id,
                "period_type": period_type,
                "period_start": str(start_date),
                "total_orders": total_orders,
                "total_revenue": total_revenue,
            }

    return asyncio.run(_calculate())


@celery_app.task(name="calculate_order_analytics")
def calculate_order_analytics(order_id: str) -> dict:
    """
    Calculate analytics for a specific order

    Args:
        order_id: Order UUID

    Returns:
        dict with analytics data
    """
    import asyncio

    async def _calculate():
        async with async_session_maker() as db:
            order_uuid = UUID(order_id)

            # Get order
            order_result = await db.execute(
                select(Order).where(Order.id == order_uuid)
            )
            order = order_result.scalar_one_or_none()

            if not order:
                return {"error": "Order not found"}

            # Calculate time metrics
            time_to_approval = None
            time_to_completion = None
            total_duration = None

            if order.approved_at:
                time_to_approval = order.approved_at - order.created_at

            if order.completed_at:
                time_to_completion = order.completed_at - order.created_at
                total_duration = time_to_completion

            # Check if analytics exists
            existing = await db.execute(
                select(OrderAnalytics).where(OrderAnalytics.order_id == order_uuid)
            )
            analytics = existing.scalar_one_or_none()

            if analytics:
                # Update existing
                analytics.time_to_approval = time_to_approval
                analytics.time_to_completion = time_to_completion
                analytics.total_duration = total_duration
                analytics.updated_at = datetime.utcnow()
            else:
                # Create new
                analytics = OrderAnalytics(
                    order_id=order_uuid,
                    time_to_approval=time_to_approval,
                    time_to_completion=time_to_completion,
                    total_duration=total_duration,
                )
                db.add(analytics)

            await db.commit()

            return {
                "order_id": order_id,
                "time_to_approval": str(time_to_approval) if time_to_approval else None,
                "time_to_completion": str(time_to_completion) if time_to_completion else None,
            }

    return asyncio.run(_calculate())


@celery_app.task(name="calculate_all_company_analytics")
def calculate_all_company_analytics(period_type: str = "monthly") -> dict:
    """
    Calculate analytics for all companies

    Args:
        period_type: Period type (daily, weekly, monthly, quarterly, yearly)

    Returns:
        dict with processing statistics
    """
    import asyncio

    async def _calculate_all():
        async with async_session_maker() as db:
            from app.models import Company

            # Get all companies
            companies_result = await db.execute(select(Company))
            companies = companies_result.scalars().all()

            processed = 0
            failed = 0

            for company in companies:
                try:
                    calculate_company_analytics.delay(
                        company_id=str(company.id),
                        period_type=period_type,
                    )
                    processed += 1
                except Exception:
                    failed += 1

            return {"processed": processed, "failed": failed, "total": len(companies)}

    return asyncio.run(_calculate_all())
