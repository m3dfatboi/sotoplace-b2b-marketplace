"""API v1 router"""

from fastapi import APIRouter

from app.api.v1 import auth, companies, orders, products, users

api_router = APIRouter()

# Include routers
api_router.include_router(auth.router)
api_router.include_router(users.router)
api_router.include_router(companies.router)
api_router.include_router(products.router)
api_router.include_router(orders.router)
