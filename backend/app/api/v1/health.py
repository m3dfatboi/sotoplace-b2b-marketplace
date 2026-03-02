"""Health check and monitoring endpoints"""

from typing import Any, Dict

from fastapi import APIRouter, Depends, status
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.db import get_db

router = APIRouter(prefix="/health", tags=["health"])


@router.get("/", status_code=status.HTTP_200_OK)
async def health_check() -> Dict[str, Any]:
    """
    Basic health check endpoint

    Returns service status
    """
    return {
        "status": "healthy",
        "service": settings.app_name,
        "version": settings.app_version,
        "environment": settings.environment,
    }


@router.get("/ready", status_code=status.HTTP_200_OK)
async def readiness_check(db: AsyncSession = Depends(get_db)) -> Dict[str, Any]:
    """
    Readiness check endpoint

    Checks if service is ready to accept traffic
    - Database connection
    - Redis connection (TODO)
    """
    checks = {
        "database": "unknown",
        "redis": "unknown",
    }

    # Check database
    try:
        await db.execute(text("SELECT 1"))
        checks["database"] = "healthy"
    except Exception as e:
        checks["database"] = f"unhealthy: {str(e)}"

    # Check Redis (TODO: implement when Redis client is available)
    checks["redis"] = "not_implemented"

    # Determine overall status
    is_healthy = checks["database"] == "healthy"

    return {
        "status": "ready" if is_healthy else "not_ready",
        "checks": checks,
    }


@router.get("/live", status_code=status.HTTP_200_OK)
async def liveness_check() -> Dict[str, Any]:
    """
    Liveness check endpoint

    Checks if service is alive (for Kubernetes liveness probe)
    """
    return {
        "status": "alive",
        "service": settings.app_name,
    }


@router.get("/metrics")
async def metrics_endpoint(db: AsyncSession = Depends(get_db)) -> Dict[str, Any]:
    """
    Basic metrics endpoint

    Returns basic application metrics
    """
    from sqlalchemy import func, select
    from app.models import User, Company, Order, Product

    # Get counts
    users_count = await db.scalar(select(func.count(User.id)))
    companies_count = await db.scalar(select(func.count(Company.id)))
    orders_count = await db.scalar(select(func.count(Order.id)))
    products_count = await db.scalar(select(func.count(Product.id)))

    return {
        "service": settings.app_name,
        "version": settings.app_version,
        "metrics": {
            "users_total": users_count or 0,
            "companies_total": companies_count or 0,
            "orders_total": orders_count or 0,
            "products_total": products_count or 0,
        },
    }


@router.get("/version")
async def version_info() -> Dict[str, Any]:
    """
    Version information endpoint

    Returns detailed version and build information
    """
    import sys
    import platform

    return {
        "service": settings.app_name,
        "version": settings.app_version,
        "environment": settings.environment,
        "python_version": sys.version,
        "platform": platform.platform(),
        "debug": settings.debug,
    }
