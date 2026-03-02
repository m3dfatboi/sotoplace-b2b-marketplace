"""Tests for product endpoints"""

import pytest
from httpx import AsyncClient


@pytest.fixture
async def test_company(client: AsyncClient, auth_headers: dict):
    """Create a test company"""
    response = await client.post(
        "/api/v1/companies",
        headers=auth_headers,
        json={"name": "Test Company", "tags": []},
    )
    return response.json()


@pytest.mark.asyncio
async def test_create_product(client: AsyncClient, auth_headers: dict, test_company: dict):
    """Test creating a product"""
    response = await client.post(
        "/api/v1/products",
        headers=auth_headers,
        json={
            "company_id": test_company["id"],
            "name": "Test Product",
            "description": "Test description",
            "category": "Test Category",
            "base_price": 1000.00,
            "price_type": "fixed",
            "is_customizable": True,
            "images": [],
            "specifications": {"material": "Steel"},
        },
    )

    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "Test Product"
    assert data["base_price"] == "1000.00"
    assert data["category"] == "Test Category"
    assert data["is_published"] == False


@pytest.mark.asyncio
async def test_list_products(client: AsyncClient, auth_headers: dict, test_company: dict):
    """Test listing products"""
    # Create a product first
    await client.post(
        "/api/v1/products",
        headers=auth_headers,
        json={
            "company_id": test_company["id"],
            "name": "Product 1",
            "base_price": 1000.00,
            "images": [],
        },
    )

    # List products
    response = await client.get("/api/v1/products")

    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)


@pytest.mark.asyncio
async def test_search_products(client: AsyncClient, auth_headers: dict, test_company: dict):
    """Test searching products"""
    # Create products
    await client.post(
        "/api/v1/products",
        headers=auth_headers,
        json={
            "company_id": test_company["id"],
            "name": "Metal Table",
            "description": "Steel table for workshop",
            "base_price": 5000.00,
            "images": [],
        },
    )

    # Search
    response = await client.get(
        "/api/v1/products",
        params={"search": "metal"},
    )

    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 1
    assert "metal" in data[0]["name"].lower() or "metal" in data[0]["description"].lower()


@pytest.mark.asyncio
async def test_publish_product(client: AsyncClient, auth_headers: dict, test_company: dict):
    """Test publishing a product"""
    # Create product
    create_response = await client.post(
        "/api/v1/products",
        headers=auth_headers,
        json={
            "company_id": test_company["id"],
            "name": "Test Product",
            "base_price": 1000.00,
            "images": [],
        },
    )
    product_id = create_response.json()["id"]

    # Publish
    response = await client.post(
        f"/api/v1/products/{product_id}/publish",
        headers=auth_headers,
    )

    assert response.status_code == 200
    data = response.json()
    assert data["is_published"] == True


@pytest.mark.asyncio
async def test_create_product_variant(client: AsyncClient, auth_headers: dict, test_company: dict):
    """Test creating a product variant"""
    # Create product
    create_response = await client.post(
        "/api/v1/products",
        headers=auth_headers,
        json={
            "company_id": test_company["id"],
            "name": "Test Product",
            "base_price": 1000.00,
            "images": [],
        },
    )
    product_id = create_response.json()["id"]

    # Create variant
    response = await client.post(
        f"/api/v1/products/{product_id}/variants",
        headers=auth_headers,
        json={
            "product_id": product_id,
            "name": "Black variant",
            "sku": "PROD-001-BLACK",
            "price_modifier": 500.00,
            "attributes": {"color": "black"},
            "stock_quantity": 10,
        },
    )

    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "Black variant"
    assert data["price_modifier"] == "500.00"
    assert data["attributes"]["color"] == "black"


@pytest.mark.asyncio
async def test_list_product_variants(client: AsyncClient, auth_headers: dict, test_company: dict):
    """Test listing product variants"""
    # Create product
    create_response = await client.post(
        "/api/v1/products",
        headers=auth_headers,
        json={
            "company_id": test_company["id"],
            "name": "Test Product",
            "base_price": 1000.00,
            "images": [],
        },
    )
    product_id = create_response.json()["id"]

    # Create variant
    await client.post(
        f"/api/v1/products/{product_id}/variants",
        headers=auth_headers,
        json={
            "product_id": product_id,
            "name": "Variant 1",
            "price_modifier": 0,
            "attributes": {},
            "stock_quantity": 10,
        },
    )

    # List variants
    response = await client.get(
        f"/api/v1/products/{product_id}/variants",
    )

    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 1
