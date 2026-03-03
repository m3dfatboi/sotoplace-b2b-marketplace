"""API v1 router"""

from fastapi import APIRouter

# Disabled routers due to missing models/functions:
# - analytics: CompanyAnalytics, OrderAnalytics, UserPerformance models missing
# - contractors: CompanyRelationship model missing
# - websocket: decode_access_token function missing

from app.api.v1 import auth, blueprints, chats, companies, health, notifications, orders, products, users

api_router = APIRouter()

# Include routers
api_router.include_router(auth.router)
api_router.include_router(users.router)
api_router.include_router(companies.router)
api_router.include_router(products.router)
api_router.include_router(orders.router)
api_router.include_router(chats.router)
api_router.include_router(notifications.router)
api_router.include_router(blueprints.router)
api_router.include_router(health.router)
