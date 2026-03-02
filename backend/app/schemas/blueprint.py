"""Blueprint schemas"""

from datetime import datetime
from typing import List, Optional
from uuid import UUID

from pydantic import BaseModel, Field


class BlueprintBase(BaseModel):
    """Base blueprint schema"""

    name: str = Field(..., max_length=255)
    description: Optional[str] = None


class BlueprintCreate(BlueprintBase):
    """Create blueprint schema"""

    order_id: UUID
    order_item_id: Optional[UUID] = None


class BlueprintResponse(BlueprintBase):
    """Blueprint response schema"""

    id: UUID
    order_id: UUID
    order_item_id: Optional[UUID] = None
    created_by_user_id: UUID
    current_version_id: Optional[UUID] = None
    status: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class BlueprintVersionBase(BaseModel):
    """Base blueprint version schema"""

    changes_description: Optional[str] = None


class BlueprintVersionCreate(BlueprintVersionBase):
    """Create blueprint version schema"""

    file_url: str
    file_type: str = Field(..., pattern="^(pdf|dwg|step|iges|stl)$")
    thumbnail_url: Optional[str] = None


class BlueprintVersionResponse(BlueprintVersionBase):
    """Blueprint version response schema"""

    id: UUID
    blueprint_id: UUID
    version_number: int
    file_url: str
    file_type: str
    thumbnail_url: Optional[str] = None
    created_by_user_id: UUID
    created_at: datetime

    class Config:
        from_attributes = True


class BlueprintApprovalCreate(BaseModel):
    """Create blueprint approval schema"""

    status: str = Field(..., pattern="^(approved|rejected)$")
    comment: Optional[str] = None


class BlueprintApprovalResponse(BaseModel):
    """Blueprint approval response schema"""

    id: UUID
    blueprint_version_id: UUID
    approver_user_id: UUID
    status: str
    comment: Optional[str] = None
    approved_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class BlueprintWithVersions(BlueprintResponse):
    """Blueprint with all versions"""

    versions: List[BlueprintVersionResponse] = []


class FileUploadResponse(BaseModel):
    """File upload response"""

    file_url: str
    file_name: str
    file_size: int
    content_type: str
    thumbnail_url: Optional[str] = None
