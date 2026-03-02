"""Analytics schemas"""

from datetime import date, datetime
from typing import Dict, List, Optional
from uuid import UUID

from pydantic import BaseModel, Field


class CompanyAnalyticsResponse(BaseModel):
    """Company analytics response"""

    id: UUID
    company_id: UUID
    period_type: str
    period_start: date
    period_end: date

    # Sales metrics
    total_orders_count: int
    completed_orders_count: int
    cancelled_orders_count: int
    total_revenue: float
    average_order_value: float

    # Production metrics
    production_load_percentage: Optional[float] = None
    on_time_delivery_rate: Optional[float] = None
    quality_issues_count: int

    # Purchase metrics
    total_purchases: float
    active_suppliers_count: int

    # Top performers
    top_products: List[Dict] = []
    top_clients: List[Dict] = []
    top_suppliers: List[Dict] = []

    calculated_at: datetime

    class Config:
        from_attributes = True


class OrderAnalyticsResponse(BaseModel):
    """Order analytics response"""

    order_id: UUID
    time_to_approval: Optional[str] = None
    time_to_production: Optional[str] = None
    time_to_completion: Optional[str] = None
    total_duration: Optional[str] = None
    profit_margin: Optional[float] = None
    cost_breakdown: Dict = {}
    revisions_count: int = 0
    quality_issues_count: int = 0
    customer_satisfaction_score: Optional[float] = None
    messages_count: int = 0
    response_time_avg: Optional[str] = None
    calculated_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class UserPerformanceResponse(BaseModel):
    """User performance metrics response"""

    user_id: UUID
    company_id: UUID
    period_start: date
    period_end: date

    # Manager metrics
    orders_managed_count: int = 0
    orders_completed_count: int = 0
    average_deal_size: Optional[float] = None
    conversion_rate: Optional[float] = None

    # Constructor metrics
    blueprints_created_count: int = 0
    blueprints_approved_count: int = 0
    average_approval_time: Optional[str] = None

    # General metrics
    active_days_count: int = 0
    messages_sent_count: int = 0
    response_time_avg: Optional[str] = None

    calculated_at: datetime

    class Config:
        from_attributes = True


class AnalyticsSummary(BaseModel):
    """Analytics summary for dashboard"""

    period_start: date
    period_end: date

    # Overview
    total_revenue: float
    total_orders: int
    completed_orders: int
    active_users: int

    # Growth
    revenue_growth: Optional[float] = None
    orders_growth: Optional[float] = None

    # Performance
    average_order_value: float
    on_time_delivery_rate: Optional[float] = None
    customer_satisfaction: Optional[float] = None


class TriggerAnalyticsCalculation(BaseModel):
    """Trigger analytics calculation"""

    period_type: str = Field(..., pattern="^(daily|weekly|monthly|quarterly|yearly)$")
    period_start: Optional[date] = None
