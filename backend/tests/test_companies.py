"""Tests for company endpoints"""

import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_create_company(client: AsyncClient, auth_headers: dict):
    """Test creating a company"""
    response = await client.post(
        "/api/v1/companies",
        headers=auth_headers,
        json={
            "name": "Test Company",
            "legal_name": "ООО Тест",
            "inn": "1234567890",
            "description": "Test company description",
            "tags": ["manufacturing", "metalwork"],
        },
    )

    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "Test Company"
    assert data["legal_name"] == "ООО Тест"
    assert data["inn"] == "1234567890"
    assert "manufacturing" in data["tags"]
    assert "id" in data


@pytest.mark.asyncio
async def test_get_my_companies(client: AsyncClient, auth_headers: dict):
    """Test getting user's companies"""
    # First create a company
    await client.post(
        "/api/v1/companies",
        headers=auth_headers,
        json={"name": "My Company", "tags": []},
    )

    # Get companies
    response = await client.get(
        "/api/v1/companies/my",
        headers=auth_headers,
    )

    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 1
    assert data[0]["name"] == "My Company"


@pytest.mark.asyncio
async def test_get_company_by_id(client: AsyncClient, auth_headers: dict):
    """Test getting company by ID"""
    # Create company
    create_response = await client.post(
        "/api/v1/companies",
        headers=auth_headers,
        json={"name": "Test Company", "tags": []},
    )
    company_id = create_response.json()["id"]

    # Get company
    response = await client.get(
        f"/api/v1/companies/{company_id}",
        headers=auth_headers,
    )

    assert response.status_code == 200
    data = response.json()
    assert data["id"] == company_id
    assert data["name"] == "Test Company"


@pytest.mark.asyncio
async def test_update_company(client: AsyncClient, auth_headers: dict):
    """Test updating company"""
    # Create company
    create_response = await client.post(
        "/api/v1/companies",
        headers=auth_headers,
        json={"name": "Original Name", "tags": []},
    )
    company_id = create_response.json()["id"]

    # Update company
    response = await client.patch(
        f"/api/v1/companies/{company_id}",
        headers=auth_headers,
        json={
            "name": "Updated Name",
            "description": "New description",
        },
    )

    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Updated Name"
    assert data["description"] == "New description"


@pytest.mark.asyncio
async def test_get_company_members(client: AsyncClient, auth_headers: dict):
    """Test getting company members"""
    # Create company
    create_response = await client.post(
        "/api/v1/companies",
        headers=auth_headers,
        json={"name": "Test Company", "tags": []},
    )
    company_id = create_response.json()["id"]

    # Get members
    response = await client.get(
        f"/api/v1/companies/{company_id}/members",
        headers=auth_headers,
    )

    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 1  # Creator should be a member
    assert data[0]["role"] == "admin"


@pytest.mark.asyncio
async def test_access_other_company_forbidden(client: AsyncClient, auth_headers: dict, db_session):
    """Test that user cannot access company they're not member of"""
    from app.models import Company

    # Create company directly in DB (not through API, so user won't be member)
    other_company = Company(
        name="Other Company",
        tags=[],
    )
    db_session.add(other_company)
    await db_session.commit()
    await db_session.refresh(other_company)

    # Try to access
    response = await client.get(
        f"/api/v1/companies/{other_company.id}",
        headers=auth_headers,
    )

    assert response.status_code == 403
