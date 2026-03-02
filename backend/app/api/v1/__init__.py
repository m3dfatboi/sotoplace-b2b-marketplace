"""API v1 router"""

from fastapi import APIRouter

from app.api.v1 import analytics, auth, blueprints, chats, companies, contractors, notifications, orders, products, users, websocket

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
api_router.include_router(analytics.router)
api_router.include_router(contractors.router)
api_router.include_router(websocket.router)
