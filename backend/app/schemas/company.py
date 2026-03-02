"""Company schemas for request/response validation"""

from datetime import datetime
from uuid import UUID
from pydantic import BaseModel, Field


class CompanyBase(BaseModel):
    """Base company schema"""
    name: str = Field(..., min_length=1, max_length=255)
    legal_name: str | None = Field(None, max_length=255)
    inn: str | None = Field(None, max_length=20)
    description: str | None = None
    website: str | None = Field(None, max_length=255)
    tags: list[str] = Field(default_factory=list)


class CompanyCreate(CompanyBase):
    """Schema for creating a company"""
    pass


class CompanyUpdate(BaseModel):
    """Schema for updating a company"""
    name: str | None = Field(None, min_length=1, max_length=255)
    legal_name: str | None = Field(None, max_length=255)
    inn: str | None = Field(None, max_length=20)
    description: str | None = None
    logo_url: str | None = None
    website: str | None = Field(None, max_length=255)
    tags: list[str] | None = None
    is_public: bool | None = None


class CompanyResponse(CompanyBase):
    """Schema for company response"""
    id: UUID
    logo_url: str | None = None
    is_verified: bool
    is_public: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class CompanyMemberBase(BaseModel):
    """Base company member schema"""
    role: str = Field(..., pattern="^(admin|manager|constructor|client)$")


class CompanyMemberCreate(CompanyMemberBase):
    """Schema for adding a member to company"""
    user_id: UUID
    permissions: dict = Field(default_factory=dict)


class CompanyMemberUpdate(BaseModel):
    """Schema for updating company member"""
    role: str | None = Field(None, pattern="^(admin|manager|constructor|client)$")
    permissions: dict | None = None
    is_active: bool | None = None


class CompanyMemberResponse(CompanyMemberBase):
    """Schema for company member response"""
    id: UUID
    user_id: UUID
    company_id: UUID
    permissions: dict
    joined_at: datetime
    is_active: bool

    class Config:
        from_attributes = True
