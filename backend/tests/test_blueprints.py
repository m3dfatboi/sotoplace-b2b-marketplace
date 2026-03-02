"""Tests for blueprint API endpoints"""

import pytest
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import Blueprint, BlueprintVersion, Order


@pytest.mark.asyncio
async def test_create_blueprint(
    client: AsyncClient,
    auth_headers: dict,
    db_session: AsyncSession,
    test_user,
    test_company,
):
    """Test creating a blueprint"""
    # Create test order
    order = Order(
        order_number="ORD-2026-03-00001",
        buyer_company_id=test_company.id,
        seller_company_id=test_company.id,
        created_by_user_id=test_user.id,
        total_amount=10000,
        status="approved",
    )
    db_session.add(order)
    await db_session.commit()
    await db_session.refresh(order)

    # Create blueprint
    response = await client.post(
        "/api/v1/blueprints",
        headers=auth_headers,
        json={
            "name": "Main Assembly Blueprint",
            "description": "Blueprint for main assembly",
            "order_id": str(order.id),
        },
    )
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "Main Assembly Blueprint"
    assert data["status"] == "draft"


@pytest.mark.asyncio
async def test_get_blueprints(
    client: AsyncClient,
    auth_headers: dict,
    db_session: AsyncSession,
    test_user,
    test_company,
):
    """Test getting list of blueprints"""
    # Create test order
    order = Order(
        order_number="ORD-2026-03-00002",
        buyer_company_id=test_company.id,
        seller_company_id=test_company.id,
        created_by_user_id=test_user.id,
        total_amount=10000,
        status="approved",
    )
    db_session.add(order)
    await db_session.commit()
    await db_session.refresh(order)

    # Create blueprint
    blueprint = Blueprint(
        name="Test Blueprint",
        order_id=order.id,
        created_by_user_id=test_user.id,
        status="draft",
    )
    db_session.add(blueprint)
    await db_session.commit()

    # Get blueprints
    response = await client.get("/api/v1/blueprints", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert len(data) > 0


@pytest.mark.asyncio
async def test_get_blueprint_with_versions(
    client: AsyncClient,
    auth_headers: dict,
    db_session: AsyncSession,
    test_user,
    test_company,
):
    """Test getting blueprint with all versions"""
    # Create test order
    order = Order(
        order_number="ORD-2026-03-00003",
        buyer_company_id=test_company.id,
        seller_company_id=test_company.id,
        created_by_user_id=test_user.id,
        total_amount=10000,
        status="approved",
    )
    db_session.add(order)
    await db_session.commit()
    await db_session.refresh(order)

    # Create blueprint
    blueprint = Blueprint(
        name="Test Blueprint",
        order_id=order.id,
        created_by_user_id=test_user.id,
        status="draft",
    )
    db_session.add(blueprint)
    await db_session.flush()

    # Create version
    version = BlueprintVersion(
        blueprint_id=blueprint.id,
        version_number=1,
        file_url="/uploads/test.pdf",
        file_type="pdf",
        created_by_user_id=test_user.id,
    )
    db_session.add(version)
    await db_session.commit()
    await db_session.refresh(blueprint)

    # Get blueprint with versions
    response = await client.get(
        f"/api/v1/blueprints/{blueprint.id}",
        headers=auth_headers,
    )
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Test Blueprint"
    assert "versions" in data
    assert len(data["versions"]) == 1


@pytest.mark.asyncio
async def test_create_blueprint_version(
    client: AsyncClient,
    auth_headers: dict,
    db_session: AsyncSession,
    test_user,
    test_company,
):
    """Test creating a new blueprint version"""
    # Create test order
    order = Order(
        order_number="ORD-2026-03-00004",
        buyer_company_id=test_company.id,
        seller_company_id=test_company.id,
        created_by_user_id=test_user.id,
        total_amount=10000,
        status="approved",
    )
    db_session.add(order)
    await db_session.commit()
    await db_session.refresh(order)

    # Create blueprint
    blueprint = Blueprint(
        name="Test Blueprint",
        order_id=order.id,
        created_by_user_id=test_user.id,
        status="draft",
    )
    db_session.add(blueprint)
    await db_session.commit()
    await db_session.refresh(blueprint)

    # Create version
    response = await client.post(
        f"/api/v1/blueprints/{blueprint.id}/versions",
        headers=auth_headers,
        json={
            "file_url": "/uploads/blueprint_v1.pdf",
            "file_type": "pdf",
            "changes_description": "Initial version",
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert data["version_number"] == 1
    assert data["file_type"] == "pdf"


@pytest.mark.asyncio
async def test_get_blueprint_versions(
    client: AsyncClient,
    auth_headers: dict,
    db_session: AsyncSession,
    test_user,
    test_company,
):
    """Test getting all versions of a blueprint"""
    # Create test order
    order = Order(
        order_number="ORD-2026-03-00005",
        buyer_company_id=test_company.id,
        seller_company_id=test_company.id,
        created_by_user_id=test_user.id,
        total_amount=10000,
        status="approved",
    )
    db_session.add(order)
    await db_session.commit()
    await db_session.refresh(order)

    # Create blueprint
    blueprint = Blueprint(
        name="Test Blueprint",
        order_id=order.id,
        created_by_user_id=test_user.id,
        status="draft",
    )
    db_session.add(blueprint)
    await db_session.flush()

    # Create multiple versions
    for i in range(3):
        version = BlueprintVersion(
            blueprint_id=blueprint.id,
            version_number=i + 1,
            file_url=f"/uploads/blueprint_v{i+1}.pdf",
            file_type="pdf",
            created_by_user_id=test_user.id,
        )
        db_session.add(version)
    await db_session.commit()
    await db_session.refresh(blueprint)

    # Get versions
    response = await client.get(
        f"/api/v1/blueprints/{blueprint.id}/versions",
        headers=auth_headers,
    )
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 3
    # Should be sorted by version_number DESC
    assert data[0]["version_number"] == 3


@pytest.mark.asyncio
async def test_approve_blueprint_version(
    client: AsyncClient,
    auth_headers: dict,
    db_session: AsyncSession,
    test_user,
    test_company,
):
    """Test approving a blueprint version"""
    # Create test order
    order = Order(
        order_number="ORD-2026-03-00006",
        buyer_company_id=test_company.id,
        seller_company_id=test_company.id,
        created_by_user_id=test_user.id,
        total_amount=10000,
        status="approved",
    )
    db_session.add(order)
    await db_session.commit()
    await db_session.refresh(order)

    # Create blueprint
    blueprint = Blueprint(
        name="Test Blueprint",
        order_id=order.id,
        created_by_user_id=test_user.id,
        status="review",
    )
    db_session.add(blueprint)
    await db_session.flush()

    # Create version
    version = BlueprintVersion(
        blueprint_id=blueprint.id,
        version_number=1,
        file_url="/uploads/blueprint.pdf",
        file_type="pdf",
        created_by_user_id=test_user.id,
    )
    db_session.add(version)
    await db_session.commit()
    await db_session.refresh(version)

    # Approve version
    response = await client.post(
        f"/api/v1/blueprints/{blueprint.id}/versions/{version.id}/approve",
        headers=auth_headers,
        json={
            "status": "approved",
            "comment": "Looks good!",
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "approved"
    assert data["comment"] == "Looks good!"


@pytest.mark.asyncio
async def test_reject_blueprint_version(
    client: AsyncClient,
    auth_headers: dict,
    db_session: AsyncSession,
    test_user,
    test_company,
):
    """Test rejecting a blueprint version"""
    # Create test order
    order = Order(
        order_number="ORD-2026-03-00007",
        buyer_company_id=test_company.id,
        seller_company_id=test_company.id,
        created_by_user_id=test_user.id,
        total_amount=10000,
        status="approved",
    )
    db_session.add(order)
    await db_session.commit()
    await db_session.refresh(order)

    # Create blueprint
    blueprint = Blueprint(
        name="Test Blueprint",
        order_id=order.id,
        created_by_user_id=test_user.id,
        status="review",
    )
    db_session.add(blueprint)
    await db_session.flush()

    # Create version
    version = BlueprintVersion(
        blueprint_id=blueprint.id,
        version_number=1,
        file_url="/uploads/blueprint.pdf",
        file_type="pdf",
        created_by_user_id=test_user.id,
    )
    db_session.add(version)
    await db_session.commit()
    await db_session.refresh(version)

    # Reject version
    response = await client.post(
        f"/api/v1/blueprints/{blueprint.id}/versions/{version.id}/approve",
        headers=auth_headers,
        json={
            "status": "rejected",
            "comment": "Please fix dimensions",
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "rejected"
    assert data["comment"] == "Please fix dimensions"


@pytest.mark.asyncio
async def test_filter_blueprints_by_order(
    client: AsyncClient,
    auth_headers: dict,
    db_session: AsyncSession,
    test_user,
    test_company,
):
    """Test filtering blueprints by order"""
    # Create test orders
    order1 = Order(
        order_number="ORD-2026-03-00008",
        buyer_company_id=test_company.id,
        seller_company_id=test_company.id,
        created_by_user_id=test_user.id,
        total_amount=10000,
        status="approved",
    )
    order2 = Order(
        order_number="ORD-2026-03-00009",
        buyer_company_id=test_company.id,
        seller_company_id=test_company.id,
        created_by_user_id=test_user.id,
        total_amount=20000,
        status="approved",
    )
    db_session.add_all([order1, order2])
    await db_session.commit()
    await db_session.refresh(order1)
    await db_session.refresh(order2)

    # Create blueprints for different orders
    blueprint1 = Blueprint(
        name="Blueprint for Order 1",
        order_id=order1.id,
        created_by_user_id=test_user.id,
        status="draft",
    )
    blueprint2 = Blueprint(
        name="Blueprint for Order 2",
        order_id=order2.id,
        created_by_user_id=test_user.id,
        status="draft",
    )
    db_session.add_all([blueprint1, blueprint2])
    await db_session.commit()

    # Filter by order
    response = await client.get(
        f"/api/v1/blueprints?order_id={order1.id}",
        headers=auth_headers,
    )
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 1
    assert all(b["order_id"] == str(order1.id) for b in data)
