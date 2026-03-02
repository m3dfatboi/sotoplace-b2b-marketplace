"""User schemas for request/response validation"""

from datetime import datetime
from uuid import UUID
from pydantic import BaseModel, EmailStr, Field


class UserBase(BaseModel):
    """Base user schema"""
    email: EmailStr
    full_name: str = Field(..., min_length=1, max_length=255)
    phone: str | None = Field(None, max_length=50)


class UserCreate(UserBase):
    """Schema for creating a user"""
    password: str = Field(..., min_length=8, max_length=100)


class UserUpdate(BaseModel):
    """Schema for updating a user"""
    full_name: str | None = Field(None, min_length=1, max_length=255)
    phone: str | None = Field(None, max_length=50)
    avatar_url: str | None = None


class UserResponse(UserBase):
    """Schema for user response"""
    id: UUID
    avatar_url: str | None = None
    is_active: bool
    created_at: datetime
    updated_at: datetime
    last_login_at: datetime | None = None

    class Config:
        from_attributes = True


class UserLogin(BaseModel):
    """Schema for user login"""
    email: EmailStr
    password: str


class Token(BaseModel):
    """Schema for authentication token"""
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class TokenPayload(BaseModel):
    """Schema for token payload"""
    sub: str  # user_id
    exp: int
    company_id: str | None = None
    role: str | None = None
