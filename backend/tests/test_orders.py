"""Tests for order endpoints"""

import pytest
from httpx import AsyncClient


@pytest.fixture
async def test_companies(client: AsyncClient, auth_headers: dict):
    """Create buyer and seller companies"""
    buyer_response = await client.post(
        "/api/v1/companies",
        headers=auth_headers,
        json={"name": "Buyer Company", "tags": []},
    )

    seller_response = await client.post(
        "/api/v1/companies",
        headers=auth_headers,
        json={"name": "Seller Company", "tags": []},
    )

    return {
        "buyer": buyer_response.json(),
        "seller": seller_response.json(),
    }


@pytest.mark.asyncio
async def test_create_order(client: AsyncClient, auth_headers: dict, test_companies: dict):
    """Test creating an order"""
    response = await client.post(
        "/api/v1/orders",
        headers=auth_headers,
        json={
            "buyer_company_id": test_companies["buyer"]["id"],
            "seller_company_id": test_companies["seller"]["id"],
            "notes": "Test order",
            "payment_terms": "50% prepayment",
        },
    )

    assert response.status_code == 201
    data = response.json()
    assert "order_number" in data
    assert data["order_number"].startswith("ORD-")
    assert data["status"] == "draft"
    assert data["total_amount"] == "0.00"


@pytest.mark.asyncio
async def test_list_orders(client: AsyncClient, auth_headers: dict, test_companies: dict):
    """Test listing orders"""
    # Create an order first
    await client.post(
        "/api/v1/orders",
        headers=auth_headers,
        json={
            "buyer_company_id": test_companies["buyer"]["id"],
            "seller_company_id": test_companies["seller"]["id"],
        },
    )

    # List orders
    response = await client.get(
        "/api/v1/orders",
        headers=auth_headers,
    )

    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 1


@pytest.mark.asyncio
async def test_get_order_by_id(client: AsyncClient, auth_headers: dict, test_companies: dict):
    """Test getting order by ID"""
    # Create order
    create_response = await client.post(
        "/api/v1/orders",
        headers=auth_headers,
        json={
            "buyer_company_id": test_companies["buyer"]["id"],
            "seller_company_id": test_companies["seller"]["id"],
        },
    )
    order_id = create_response.json()["id"]

    # Get order
    response = await client.get(
        f"/api/v1/orders/{order_id}",
        headers=auth_headers,
    )

    assert response.status_code == 200
    data = response.json()
    assert data["id"] == order_id


@pytest.mark.asyncio
async def test_update_order_status(client: AsyncClient, auth_headers: dict, test_companies: dict):
    """Test updating order status"""
    # Create order
    create_response = await client.post(
        "/api/v1/orders",
        headers=auth_headers,
        json={
            "buyer_company_id": test_companies["buyer"]["id"],
            "seller_company_id": test_companies["seller"]["id"],
        },
    )
    order_id = create_response.json()["id"]

    # Update status
    response = await client.patch(
        f"/api/v1/orders/{order_id}",
        headers=auth_headers,
        json={"status": "approved"},
    )

    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "approved"
    assert data["approved_at"] is not None


@pytest.mark.asyncio
async def test_cancel_order(client: AsyncClient, auth_headers: dict, test_companies: dict):
    """Test cancelling an order"""
    # Create order
    create_response = await client.post(
        "/api/v1/orders",
        headers=auth_headers,
        json={
            "buyer_company_id": test_companies["buyer"]["id"],
            "seller_company_id": test_companies["seller"]["id"],
        },
    )
    order_id = create_response.json()["id"]

    # Cancel order
    response = await client.delete(
        f"/api/v1/orders/{order_id}",
        headers=auth_headers,
    )

    assert response.status_code == 204

    # Verify status changed
    get_response = await client.get(
        f"/api/v1/orders/{order_id}",
        headers=auth_headers,
    )
    assert get_response.json()["status"] == "cancelled"


@pytest.mark.asyncio
async def test_add_order_item(client: AsyncClient, auth_headers: dict, test_companies: dict):
    """Test adding item to order"""
    # Create order
    create_response = await client.post(
        "/api/v1/orders",
        headers=auth_headers,
        json={
            "buyer_company_id": test_companies["buyer"]["id"],
            "seller_company_id": test_companies["seller"]["id"],
        },
    )
    order_id = create_response.json()["id"]

    # Add item
    response = await client.post(
        f"/api/v1/orders/{order_id}/items",
        headers=auth_headers,
        json={
            "order_id": order_id,
            "name": "Test Item",
            "description": "Test description",
            "quantity": 5,
            "unit_price": 1000.00,
            "specifications": {},
        },
    )

    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "Test Item"
    assert data["quantity"] == "5.00"
    assert data["unit_price"] == "1000.00"
    assert data["total_price"] == "5000.00"


@pytest.mark.asyncio
async def test_list_order_items(client: AsyncClient, auth_headers: dict, test_companies: dict):
    """Test listing order items"""
    # Create order
    create_response = await client.post(
        "/api/v1/orders",
        headers=auth_headers,
        json={
            "buyer_company_id": test_companies["buyer"]["id"],
            "seller_company_id": test_companies["seller"]["id"],
        },
    )
    order_id = create_response.json()["id"]

    # Add item
    await client.post(
        f"/api/v1/orders/{order_id}/items",
        headers=auth_headers,
        json={
            "order_id": order_id,
            "name": "Item 1",
            "quantity": 1,
            "unit_price": 100.00,
            "specifications": {},
        },
    )

    # List items
    response = await client.get(
        f"/api/v1/orders/{order_id}/items",
        headers=auth_headers,
    )

    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 1


@pytest.mark.asyncio
async def test_order_total_calculation(client: AsyncClient, auth_headers: dict, test_companies: dict):
    """Test that order total is calculated correctly"""
    # Create order
    create_response = await client.post(
        "/api/v1/orders",
        headers=auth_headers,
        json={
            "buyer_company_id": test_companies["buyer"]["id"],
            "seller_company_id": test_companies["seller"]["id"],
        },
    )
    order_id = create_response.json()["id"]

    # Add multiple items
    await client.post(
        f"/api/v1/orders/{order_id}/items",
        headers=auth_headers,
        json={
            "order_id": order_id,
            "name": "Item 1",
            "quantity": 2,
            "unit_price": 1000.00,
            "specifications": {},
        },
    )

    await client.post(
        f"/api/v1/orders/{order_id}/items",
        headers=auth_headers,
        json={
            "order_id": order_id,
            "name": "Item 2",
            "quantity": 3,
            "unit_price": 500.00,
            "specifications": {},
        },
    )

    # Get order and check total
    response = await client.get(
        f"/api/v1/orders/{order_id}",
        headers=auth_headers,
    )

    data = response.json()
    # Total should be (2 * 1000) + (3 * 500) = 3500
    assert float(data["total_amount"]) == 3500.00
