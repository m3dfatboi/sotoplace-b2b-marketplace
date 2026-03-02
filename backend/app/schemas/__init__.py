"""Pydantic schemas for request/response validation"""

from app.schemas.user import (
    UserBase,
    UserCreate,
    UserUpdate,
    UserResponse,
    UserLogin,
    Token,
    TokenPayload,
)
from app.schemas.company import (
    CompanyBase,
    CompanyCreate,
    CompanyUpdate,
    CompanyResponse,
    CompanyMemberBase,
    CompanyMemberCreate,
    CompanyMemberUpdate,
    CompanyMemberResponse,
)
from app.schemas.product import (
    ProductBase,
    ProductCreate,
    ProductUpdate,
    ProductResponse,
    ProductVariantBase,
    ProductVariantCreate,
    ProductVariantUpdate,
    ProductVariantResponse,
)
from app.schemas.order import (
    OrderBase,
    OrderCreate,
    OrderUpdate,
    OrderResponse,
    OrderItemBase,
    OrderItemCreate,
    OrderItemUpdate,
    OrderItemResponse,
)
from app.schemas.chat import (
    ChatCreate,
    ChatResponse,
    MessageCreate,
    MessageResponse,
)
from app.schemas.notification import (
    NotificationCreate,
    NotificationResponse,
    NotificationMarkRead,
    NotificationPreferencesUpdate,
    NotificationPreferencesResponse,
    NotificationStats,
)

__all__ = [
    # User schemas
    "UserBase",
    "UserCreate",
    "UserUpdate",
    "UserResponse",
    "UserLogin",
    "Token",
    "TokenPayload",
    # Company schemas
    "CompanyBase",
    "CompanyCreate",
    "CompanyUpdate",
    "CompanyResponse",
    "CompanyMemberBase",
    "CompanyMemberCreate",
    "CompanyMemberUpdate",
    "CompanyMemberResponse",
    # Product schemas
    "ProductBase",
    "ProductCreate",
    "ProductUpdate",
    "ProductResponse",
    "ProductVariantBase",
    "ProductVariantCreate",
    "ProductVariantUpdate",
    "ProductVariantResponse",
    # Order schemas
    "OrderBase",
    "OrderCreate",
    "OrderUpdate",
    "OrderResponse",
    "OrderItemBase",
    "OrderItemCreate",
    "OrderItemUpdate",
    "OrderItemResponse",
    # Chat schemas
    "ChatCreate",
    "ChatResponse",
    "MessageCreate",
    "MessageResponse",
    # Notification schemas
    "NotificationCreate",
    "NotificationResponse",
    "NotificationMarkRead",
    "NotificationPreferencesUpdate",
    "NotificationPreferencesResponse",
    "NotificationStats",
]
