"""Analytics API endpoints"""

from datetime import date, datetime, timedelta
from typing import Any, List, Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.dependencies import get_current_active_user
from app.db import get_db
from app.models import (
    CompanyAnalytics,
    OrderAnalytics,
    UserPerformance,
    User,
    Order,
    CompanyMember,
)
from app.schemas.analytics import (
    CompanyAnalyticsResponse,
    OrderAnalyticsResponse,
    UserPerformanceResponse,
    AnalyticsSummary,
    TriggerAnalyticsCalculation,
)

router = APIRouter(prefix="/analytics", tags=["analytics"])


@router.get("/company/{company_id}", response_model=List[CompanyAnalyticsResponse])
async def get_company_analytics(
    company_id: UUID,
    period_type: str = Query("monthly", pattern="^(daily|weekly|monthly|quarterly|yearly)$"),
    limit: int = Query(12, ge=1, le=100),
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
) -> Any:
    """
    Get company analytics for specified period

    - **company_id**: Company UUID
    - **period_type**: Period type (daily, weekly, monthly, quarterly, yearly)
    - **limit**: Number of periods to return (default 12)
    """
    # TODO: Check if user has access to this company

    query = (
        select(CompanyAnalytics)
        .where(
            CompanyAnalytics.company_id == company_id,
            CompanyAnalytics.period_type == period_type,
        )
        .order_by(CompanyAnalytics.period_start.desc())
        .limit(limit)
    )

    result = await db.execute(query)
    analytics = result.scalars().all()

    return analytics


@router.get("/company/{company_id}/summary", response_model=AnalyticsSummary)
async def get_company_analytics_summary(
    company_id: UUID,
    period_start: Optional[date] = Query(None),
    period_end: Optional[date] = Query(None),
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
) -> Any:
    """
    Get analytics summary for company dashboard

    - **company_id**: Company UUID
    - **period_start**: Start date (default: 30 days ago)
    - **period_end**: End date (default: today)
    """
    # Default to last 30 days
    if not period_end:
        period_end = date.today()
    if not period_start:
        period_start = period_end - timedelta(days=30)

    # Get orders for current period
    current_orders = await db.execute(
        select(Order).where(
            Order.seller_company_id == company_id,
            Order.created_at >= period_start,
            Order.created_at <= period_end,
        )
    )
    current_orders_list = current_orders.scalars().all()

    total_orders = len(current_orders_list)
    completed_orders = len([o for o in current_orders_list if o.status == "completed"])
    total_revenue = sum(
        float(o.total_amount) for o in current_orders_list if o.status == "completed"
    )
    avg_order_value = total_revenue / completed_orders if completed_orders > 0 else 0

    # Get previous period for growth calculation
    prev_period_start = period_start - (period_end - period_start)
    prev_period_end = period_start

    prev_orders = await db.execute(
        select(Order).where(
            Order.seller_company_id == company_id,
            Order.created_at >= prev_period_start,
            Order.created_at < prev_period_end,
        )
    )
    prev_orders_list = prev_orders.scalars().all()

    prev_total_orders = len(prev_orders_list)
    prev_revenue = sum(
        float(o.total_amount) for o in prev_orders_list if o.status == "completed"
    )

    # Calculate growth
    revenue_growth = None
    if prev_revenue > 0:
        revenue_growth = ((total_revenue - prev_revenue) / prev_revenue) * 100

    orders_growth = None
    if prev_total_orders > 0:
        orders_growth = ((total_orders - prev_total_orders) / prev_total_orders) * 100

    # Get active users count
    active_users_result = await db.execute(
        select(func.count(CompanyMember.id)).where(
            CompanyMember.company_id == company_id,
            CompanyMember.is_active == True,
        )
    )
    active_users = active_users_result.scalar() or 0

    return AnalyticsSummary(
        period_start=period_start,
        period_end=period_end,
        total_revenue=total_revenue,
        total_orders=total_orders,
        completed_orders=completed_orders,
        active_users=active_users,
        revenue_growth=revenue_growth,
        orders_growth=orders_growth,
        average_order_value=avg_order_value,
    )


@router.get("/order/{order_id}", response_model=OrderAnalyticsResponse)
async def get_order_analytics(
    order_id: UUID,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
) -> Any:
    """Get analytics for specific order"""
    result = await db.execute(
        select(OrderAnalytics).where(OrderAnalytics.order_id == order_id)
    )
    analytics = result.scalar_one_or_none()

    if analytics is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order analytics not found",
        )

    return analytics


@router.get("/user/{user_id}/performance", response_model=List[UserPerformanceResponse])
async def get_user_performance(
    user_id: UUID,
    company_id: UUID = Query(...),
    limit: int = Query(6, ge=1, le=24),
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
) -> Any:
    """
    Get user performance metrics

    - **user_id**: User UUID
    - **company_id**: Company UUID
    - **limit**: Number of periods to return
    """
    # TODO: Check if current user has permission to view this data

    query = (
        select(UserPerformance)
        .where(
            UserPerformance.user_id == user_id,
            UserPerformance.company_id == company_id,
        )
        .order_by(UserPerformance.period_start.desc())
        .limit(limit)
    )

    result = await db.execute(query)
    performance = result.scalars().all()

    return performance


@router.post("/calculate/company/{company_id}", status_code=status.HTTP_202_ACCEPTED)
async def trigger_company_analytics_calculation(
    company_id: UUID,
    data: TriggerAnalyticsCalculation,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
) -> Any:
    """
    Trigger analytics calculation for company

    This will queue a background task to calculate analytics.

    - **company_id**: Company UUID
    - **period_type**: Period type to calculate
    - **period_start**: Optional specific period start date
    """
    from app.tasks.analytics import calculate_company_analytics

    # Queue calculation task
    task = calculate_company_analytics.delay(
        company_id=str(company_id),
        period_type=data.period_type,
        period_start=str(data.period_start) if data.period_start else None,
    )

    return {
        "message": "Analytics calculation queued",
        "task_id": task.id,
        "company_id": str(company_id),
        "period_type": data.period_type,
    }


@router.post("/calculate/order/{order_id}", status_code=status.HTTP_202_ACCEPTED)
async def trigger_order_analytics_calculation(
    order_id: UUID,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
) -> Any:
    """
    Trigger analytics calculation for specific order

    This will queue a background task to calculate order analytics.

    - **order_id**: Order UUID
    """
    from app.tasks.analytics import calculate_order_analytics

    # Queue calculation task
    task = calculate_order_analytics.delay(order_id=str(order_id))

    return {
        "message": "Order analytics calculation queued",
        "task_id": task.id,
        "order_id": str(order_id),
    }


@router.post("/calculate/all", status_code=status.HTTP_202_ACCEPTED)
async def trigger_all_analytics_calculation(
    period_type: str = Query("monthly", pattern="^(daily|weekly|monthly|quarterly|yearly)$"),
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """
    Trigger analytics calculation for all companies

    This will queue background tasks for all companies.
    Only admins should be able to call this.

    - **period_type**: Period type to calculate
    """
    # TODO: Check if user is admin

    from app.tasks.analytics import calculate_all_company_analytics

    # Queue calculation task
    task = calculate_all_company_analytics.delay(period_type=period_type)

    return {
        "message": "Batch analytics calculation queued",
        "task_id": task.id,
        "period_type": period_type,
    }


@router.get("/dashboard/{company_id}")
async def get_dashboard_data(
    company_id: UUID,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
) -> Any:
    """
    Get complete dashboard data for company

    Returns summary, recent analytics, and key metrics.
    """
    # Get summary for last 30 days
    period_end = date.today()
    period_start = period_end - timedelta(days=30)

    # Get summary
    summary_data = await get_company_analytics_summary(
        company_id=company_id,
        period_start=period_start,
        period_end=period_end,
        current_user=current_user,
        db=db,
    )

    # Get recent monthly analytics
    recent_analytics_result = await db.execute(
        select(CompanyAnalytics)
        .where(
            CompanyAnalytics.company_id == company_id,
            CompanyAnalytics.period_type == "monthly",
        )
        .order_by(CompanyAnalytics.period_start.desc())
        .limit(6)
    )
    recent_analytics = recent_analytics_result.scalars().all()

    # Get recent orders
    recent_orders_result = await db.execute(
        select(Order)
        .where(Order.seller_company_id == company_id)
        .order_by(Order.created_at.desc())
        .limit(10)
    )
    recent_orders = recent_orders_result.scalars().all()

    return {
        "summary": summary_data,
        "recent_analytics": [
            CompanyAnalyticsResponse.model_validate(a) for a in recent_analytics
        ],
        "recent_orders": [
            {
                "id": str(o.id),
                "order_number": o.order_number,
                "status": o.status,
                "total_amount": float(o.total_amount),
                "created_at": o.created_at.isoformat(),
            }
            for o in recent_orders
        ],
    }
