"""Blueprint API endpoints"""

from typing import Any, List
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.dependencies import get_current_active_user
from app.db import get_db
from app.models import Blueprint, BlueprintVersion, BlueprintApproval, Order, User
from app.schemas.blueprint import (
    BlueprintCreate,
    BlueprintResponse,
    BlueprintVersionCreate,
    BlueprintVersionResponse,
    BlueprintApprovalCreate,
    BlueprintApprovalResponse,
    BlueprintWithVersions,
    FileUploadResponse,
)

router = APIRouter(prefix="/blueprints", tags=["blueprints"])


@router.post("", response_model=BlueprintResponse, status_code=status.HTTP_201_CREATED)
async def create_blueprint(
    blueprint_data: BlueprintCreate,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
) -> Any:
    """
    Create a new blueprint for an order

    - **name**: Blueprint name
    - **description**: Optional description
    - **order_id**: Order ID this blueprint belongs to
    - **order_item_id**: Optional specific order item
    """
    # Check if order exists and user has access
    result = await db.execute(select(Order).where(Order.id == blueprint_data.order_id))
    order = result.scalar_one_or_none()

    if order is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found",
        )

    # TODO: Check if user has access to this order (buyer or seller)

    blueprint = Blueprint(
        name=blueprint_data.name,
        description=blueprint_data.description,
        order_id=blueprint_data.order_id,
        order_item_id=blueprint_data.order_item_id,
        created_by_user_id=current_user.id,
        status="draft",
    )

    db.add(blueprint)
    await db.commit()
    await db.refresh(blueprint)

    return blueprint


@router.get("", response_model=List[BlueprintResponse])
async def get_blueprints(
    order_id: UUID = None,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
) -> Any:
    """Get blueprints, optionally filtered by order"""
    query = select(Blueprint)

    if order_id:
        query = query.where(Blueprint.order_id == order_id)

    # TODO: Filter by user's accessible orders

    result = await db.execute(query.order_by(Blueprint.created_at.desc()))
    blueprints = result.scalars().all()

    return blueprints


@router.get("/{blueprint_id}", response_model=BlueprintWithVersions)
async def get_blueprint(
    blueprint_id: UUID,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
) -> Any:
    """Get blueprint with all versions"""
    result = await db.execute(select(Blueprint).where(Blueprint.id == blueprint_id))
    blueprint = result.scalar_one_or_none()

    if blueprint is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Blueprint not found",
        )

    # Get all versions
    versions_result = await db.execute(
        select(BlueprintVersion)
        .where(BlueprintVersion.blueprint_id == blueprint_id)
        .order_by(BlueprintVersion.version_number.desc())
    )
    versions = versions_result.scalars().all()

    return BlueprintWithVersions(
        **blueprint.__dict__,
        versions=[BlueprintVersionResponse.model_validate(v) for v in versions],
    )


@router.post("/{blueprint_id}/versions", response_model=BlueprintVersionResponse)
async def create_blueprint_version(
    blueprint_id: UUID,
    version_data: BlueprintVersionCreate,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
) -> Any:
    """
    Upload a new version of the blueprint

    - **file_url**: URL to the uploaded file
    - **file_type**: File type (pdf, dwg, step, iges, stl)
    - **thumbnail_url**: Optional thumbnail URL
    - **changes_description**: Description of changes in this version
    """
    result = await db.execute(select(Blueprint).where(Blueprint.id == blueprint_id))
    blueprint = result.scalar_one_or_none()

    if blueprint is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Blueprint not found",
        )

    # Get latest version number
    latest_version_result = await db.execute(
        select(BlueprintVersion)
        .where(BlueprintVersion.blueprint_id == blueprint_id)
        .order_by(BlueprintVersion.version_number.desc())
        .limit(1)
    )
    latest_version = latest_version_result.scalar_one_or_none()
    next_version_number = (latest_version.version_number + 1) if latest_version else 1

    # Create new version
    version = BlueprintVersion(
        blueprint_id=blueprint_id,
        version_number=next_version_number,
        file_url=version_data.file_url,
        file_type=version_data.file_type,
        thumbnail_url=version_data.thumbnail_url,
        changes_description=version_data.changes_description,
        created_by_user_id=current_user.id,
    )

    db.add(version)

    # Update blueprint's current version
    blueprint.current_version_id = version.id
    blueprint.status = "review"

    await db.commit()
    await db.refresh(version)

    return version


@router.get("/{blueprint_id}/versions", response_model=List[BlueprintVersionResponse])
async def get_blueprint_versions(
    blueprint_id: UUID,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
) -> Any:
    """Get all versions of a blueprint"""
    result = await db.execute(
        select(BlueprintVersion)
        .where(BlueprintVersion.blueprint_id == blueprint_id)
        .order_by(BlueprintVersion.version_number.desc())
    )
    versions = result.scalars().all()

    return versions


@router.post(
    "/{blueprint_id}/versions/{version_id}/approve",
    response_model=BlueprintApprovalResponse,
)
async def approve_blueprint_version(
    blueprint_id: UUID,
    version_id: UUID,
    approval_data: BlueprintApprovalCreate,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
) -> Any:
    """
    Approve or reject a blueprint version

    - **status**: approved or rejected
    - **comment**: Optional comment
    """
    # Check if version exists
    result = await db.execute(
        select(BlueprintVersion).where(
            BlueprintVersion.id == version_id,
            BlueprintVersion.blueprint_id == blueprint_id,
        )
    )
    version = result.scalar_one_or_none()

    if version is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Blueprint version not found",
        )

    # Check if already approved by this user
    existing_approval = await db.execute(
        select(BlueprintApproval).where(
            BlueprintApproval.blueprint_version_id == version_id,
            BlueprintApproval.approver_user_id == current_user.id,
        )
    )
    if existing_approval.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You have already approved/rejected this version",
        )

    # Create approval
    from datetime import datetime

    approval = BlueprintApproval(
        blueprint_version_id=version_id,
        approver_user_id=current_user.id,
        status=approval_data.status,
        comment=approval_data.comment,
        approved_at=datetime.utcnow(),
    )

    db.add(approval)

    # Update blueprint status
    blueprint_result = await db.execute(
        select(Blueprint).where(Blueprint.id == blueprint_id)
    )
    blueprint = blueprint_result.scalar_one()

    if approval_data.status == "approved":
        blueprint.status = "approved"
    else:
        blueprint.status = "rejected"

    await db.commit()
    await db.refresh(approval)

    return approval


@router.post("/upload", response_model=FileUploadResponse)
async def upload_file(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """
    Upload a file (blueprint, image, document)

    Returns the file URL that can be used in blueprint version creation
    """
    from app.core.utils import save_upload_file
    import os

    # Validate file type
    allowed_extensions = {".pdf", ".dwg", ".step", ".iges", ".stl", ".png", ".jpg", ".jpeg"}
    file_ext = os.path.splitext(file.filename)[1].lower()

    if file_ext not in allowed_extensions:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File type {file_ext} not allowed. Allowed: {allowed_extensions}",
        )

    # Save file
    file_url, file_size = await save_upload_file(file, current_user.id)

    return FileUploadResponse(
        file_url=file_url,
        file_name=file.filename,
        file_size=file_size,
        content_type=file.content_type,
    )
