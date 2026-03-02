"""Contractor marketplace schemas"""

from datetime import datetime
from typing import List, Optional
from uuid import UUID

from pydantic import BaseModel, Field


class CompanyRelationshipCreate(BaseModel):
    """Create company relationship"""

    company_b_id: UUID
    relationship_type: str = Field(..., pattern="^(supplier|client|partner)$")


class CompanyRelationshipResponse(BaseModel):
    """Company relationship response"""

    id: UUID
    company_a_id: UUID
    company_b_id: UUID
    relationship_type: str
    status: str
    trust_level: int
    created_at: datetime
    revealed_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class ContractorRequestCreate(BaseModel):
    """Create contractor request"""

    title: str = Field(..., max_length=255)
    description: str
    required_skills: List[str] = []
    budget_min: Optional[float] = None
    budget_max: Optional[float] = None
    deadline: Optional[datetime] = None
    location: Optional[str] = None
    order_id: Optional[UUID] = None


class ContractorRequestUpdate(BaseModel):
    """Update contractor request"""

    title: Optional[str] = None
    description: Optional[str] = None
    required_skills: Optional[List[str]] = None
    budget_min: Optional[float] = None
    budget_max: Optional[float] = None
    deadline: Optional[datetime] = None
    location: Optional[str] = None
    status: Optional[str] = Field(None, pattern="^(open|in_progress|closed|cancelled)$")


class ContractorRequestResponse(BaseModel):
    """Contractor request response"""

    id: UUID
    posted_by_company_id: UUID
    posted_by_user_id: UUID
    order_id: Optional[UUID] = None
    title: str
    description: str
    required_skills: List[str]
    budget_min: Optional[float] = None
    budget_max: Optional[float] = None
    deadline: Optional[datetime] = None
    location: Optional[str] = None
    status: str
    created_at: datetime
    expires_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class ContractorResponseCreate(BaseModel):
    """Create contractor response"""

    proposal: str
    proposed_price: Optional[float] = None
    estimated_duration: Optional[int] = Field(None, description="Duration in days")
    portfolio_links: List[str] = []


class ContractorResponseUpdate(BaseModel):
    """Update contractor response"""

    proposal: Optional[str] = None
    proposed_price: Optional[float] = None
    estimated_duration: Optional[int] = None
    portfolio_links: Optional[List[str]] = None
    status: Optional[str] = Field(None, pattern="^(pending|accepted|rejected)$")


class ContractorResponseResponse(BaseModel):
    """Contractor response response"""

    id: UUID
    request_id: UUID
    company_id: UUID
    user_id: UUID
    proposal: str
    proposed_price: Optional[float] = None
    estimated_duration: Optional[int] = None
    portfolio_links: List[str]
    status: str
    created_at: datetime

    class Config:
        from_attributes = True


class ContractorRequestWithResponses(ContractorRequestResponse):
    """Contractor request with all responses"""

    responses: List[ContractorResponseResponse] = []
    responses_count: int = 0
