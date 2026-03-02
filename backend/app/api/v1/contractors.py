"""Contractor marketplace API endpoints"""

from typing import Any, List, Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.dependencies import get_current_active_user
from app.db import get_db
from app.models import (
    CompanyRelationship,
    ContractorRequest,
    ContractorResponse,
    User,
    Company,
)
from app.schemas.contractor import (
    CompanyRelationshipCreate,
    CompanyRelationshipResponse,
    ContractorRequestCreate,
    ContractorRequestUpdate,
    ContractorRequestResponse,
    ContractorRequestWithResponses,
    ContractorResponseCreate,
    ContractorResponseUpdate,
    ContractorResponseResponse,
)

router = APIRouter(prefix="/contractors", tags=["contractors"])


# Company Relationships
@router.post("/relationships", response_model=CompanyRelationshipResponse, status_code=status.HTTP_201_CREATED)
async def create_company_relationship(
    data: CompanyRelationshipCreate,
    company_id: UUID = Query(..., description="Your company ID"),
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
) -> Any:
    """
    Create relationship with another company

    - **company_b_id**: Target company UUID
    - **relationship_type**: supplier, client, or partner
    """
    # Check if relationship already exists
    existing = await db.execute(
        select(CompanyRelationship).where(
            CompanyRelationship.company_a_id == company_id,
            CompanyRelationship.company_b_id == data.company_b_id,
        )
    )
    if existing.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Relationship already exists",
        )

    relationship = CompanyRelationship(
        company_a_id=company_id,
        company_b_id=data.company_b_id,
        relationship_type=data.relationship_type,
        status="anonymous",
        trust_level=0,
    )
    db.add(relationship)
    await db.commit()
    await db.refresh(relationship)

    return relationship


@router.get("/relationships", response_model=List[CompanyRelationshipResponse])
async def get_company_relationships(
    company_id: UUID = Query(..., description="Company ID"),
    relationship_type: Optional[str] = Query(None),
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
) -> Any:
    """Get company relationships"""
    query = select(CompanyRelationship).where(
        CompanyRelationship.company_a_id == company_id
    )

    if relationship_type:
        query = query.where(CompanyRelationship.relationship_type == relationship_type)

    result = await db.execute(query.order_by(CompanyRelationship.created_at.desc()))
    relationships = result.scalars().all()

    return relationships


# Contractor Requests
@router.post("/requests", response_model=ContractorRequestResponse, status_code=status.HTTP_201_CREATED)
async def create_contractor_request(
    data: ContractorRequestCreate,
    company_id: UUID = Query(..., description="Your company ID"),
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
) -> Any:
    """
    Post a contractor request to find suppliers/partners

    - **title**: Request title
    - **description**: Detailed description
    - **required_skills**: List of required skills
    - **budget_min/max**: Budget range
    - **deadline**: Project deadline
    """
    from datetime import datetime, timedelta

    request = ContractorRequest(
        posted_by_company_id=company_id,
        posted_by_user_id=current_user.id,
        order_id=data.order_id,
        title=data.title,
        description=data.description,
        required_skills=data.required_skills,
        budget_min=data.budget_min,
        budget_max=data.budget_max,
        deadline=data.deadline,
        location=data.location,
        status="open",
        expires_at=datetime.utcnow() + timedelta(days=30),
    )
    db.add(request)
    await db.commit()
    await db.refresh(request)

    return request


@router.get("/requests", response_model=List[ContractorRequestResponse])
async def get_contractor_requests(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    status: Optional[str] = Query(None),
    skills: Optional[str] = Query(None, description="Comma-separated skills"),
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
) -> Any:
    """
    Get contractor requests (marketplace)

    - **status**: Filter by status
    - **skills**: Filter by required skills
    """
    query = select(ContractorRequest)

    if status:
        query = query.where(ContractorRequest.status == status)

    if skills:
        skill_list = [s.strip() for s in skills.split(",")]
        # Filter by any of the skills
        query = query.where(ContractorRequest.required_skills.overlap(skill_list))

    query = query.order_by(ContractorRequest.created_at.desc()).offset(skip).limit(limit)

    result = await db.execute(query)
    requests = result.scalars().all()

    return requests


@router.get("/requests/{request_id}", response_model=ContractorRequestWithResponses)
async def get_contractor_request(
    request_id: UUID,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
) -> Any:
    """Get contractor request with all responses"""
    result = await db.execute(
        select(ContractorRequest).where(ContractorRequest.id == request_id)
    )
    request = result.scalar_one_or_none()

    if request is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Request not found",
        )

    # Get responses
    responses_result = await db.execute(
        select(ContractorResponse).where(ContractorResponse.request_id == request_id)
    )
    responses = responses_result.scalars().all()

    return ContractorRequestWithResponses(
        **request.__dict__,
        responses=[ContractorResponseResponse.model_validate(r) for r in responses],
        responses_count=len(responses),
    )


@router.patch("/requests/{request_id}", response_model=ContractorRequestResponse)
async def update_contractor_request(
    request_id: UUID,
    data: ContractorRequestUpdate,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
) -> Any:
    """Update contractor request"""
    result = await db.execute(
        select(ContractorRequest).where(ContractorRequest.id == request_id)
    )
    request = result.scalar_one_or_none()

    if request is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Request not found",
        )

    # Check ownership
    if request.posted_by_user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this request",
        )

    # Update fields
    if data.title is not None:
        request.title = data.title
    if data.description is not None:
        request.description = data.description
    if data.required_skills is not None:
        request.required_skills = data.required_skills
    if data.budget_min is not None:
        request.budget_min = data.budget_min
    if data.budget_max is not None:
        request.budget_max = data.budget_max
    if data.deadline is not None:
        request.deadline = data.deadline
    if data.location is not None:
        request.location = data.location
    if data.status is not None:
        request.status = data.status

    await db.commit()
    await db.refresh(request)

    return request


@router.delete("/requests/{request_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_contractor_request(
    request_id: UUID,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
) -> None:
    """Delete contractor request"""
    result = await db.execute(
        select(ContractorRequest).where(ContractorRequest.id == request_id)
    )
    request = result.scalar_one_or_none()

    if request is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Request not found",
        )

    # Check ownership
    if request.posted_by_user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this request",
        )

    await db.delete(request)
    await db.commit()


# Contractor Responses
@router.post("/requests/{request_id}/responses", response_model=ContractorResponseResponse, status_code=status.HTTP_201_CREATED)
async def create_contractor_response(
    request_id: UUID,
    data: ContractorResponseCreate,
    company_id: UUID = Query(..., description="Your company ID"),
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
) -> Any:
    """
    Respond to a contractor request

    - **proposal**: Your proposal text
    - **proposed_price**: Your price quote
    - **estimated_duration**: Estimated duration in days
    - **portfolio_links**: Links to your portfolio
    """
    # Check if request exists
    request_result = await db.execute(
        select(ContractorRequest).where(ContractorRequest.id == request_id)
    )
    request = request_result.scalar_one_or_none()

    if request is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Request not found",
        )

    # Check if already responded
    existing = await db.execute(
        select(ContractorResponse).where(
            ContractorResponse.request_id == request_id,
            ContractorResponse.company_id == company_id,
        )
    )
    if existing.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You have already responded to this request",
        )

    response = ContractorResponse(
        request_id=request_id,
        company_id=company_id,
        user_id=current_user.id,
        proposal=data.proposal,
        proposed_price=data.proposed_price,
        estimated_duration=data.estimated_duration,
        portfolio_links=data.portfolio_links,
        status="pending",
    )
    db.add(response)
    await db.commit()
    await db.refresh(response)

    return response


@router.get("/requests/{request_id}/responses", response_model=List[ContractorResponseResponse])
async def get_contractor_responses(
    request_id: UUID,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
) -> Any:
    """Get all responses for a contractor request"""
    result = await db.execute(
        select(ContractorResponse)
        .where(ContractorResponse.request_id == request_id)
        .order_by(ContractorResponse.created_at.desc())
    )
    responses = result.scalars().all()

    return responses


@router.patch("/responses/{response_id}", response_model=ContractorResponseResponse)
async def update_contractor_response(
    response_id: UUID,
    data: ContractorResponseUpdate,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
) -> Any:
    """Update contractor response (accept/reject)"""
    result = await db.execute(
        select(ContractorResponse).where(ContractorResponse.id == response_id)
    )
    response = result.scalar_one_or_none()

    if response is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Response not found",
        )

    # Update fields
    if data.proposal is not None:
        response.proposal = data.proposal
    if data.proposed_price is not None:
        response.proposed_price = data.proposed_price
    if data.estimated_duration is not None:
        response.estimated_duration = data.estimated_duration
    if data.portfolio_links is not None:
        response.portfolio_links = data.portfolio_links
    if data.status is not None:
        response.status = data.status

    await db.commit()
    await db.refresh(response)

    return response
