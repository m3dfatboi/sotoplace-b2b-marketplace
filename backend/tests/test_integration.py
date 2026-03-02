"""Integration tests for complete user workflows"""

import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_complete_order_workflow(client: AsyncClient):
    """Test complete order workflow from registration to order completion"""

    # 1. Register two users
    buyer_response = await client.post(
        "/api/v1/auth/register",
        json={
            "email": "buyer@test.com",
            "password": "password123",
            "full_name": "Buyer User",
        },
    )
    assert buyer_response.status_code == 201

    seller_response = await client.post(
        "/api/v1/auth/register",
        json={
            "email": "seller@test.com",
            "password": "password123",
            "full_name": "Seller User",
        },
    )
    assert seller_response.status_code == 201

    # 2. Login as buyer
    buyer_login = await client.post(
        "/api/v1/auth/login",
        json={"email": "buyer@test.com", "password": "password123"},
    )
    buyer_token = buyer_login.json()["access_token"]
    buyer_headers = {"Authorization": f"Bearer {buyer_token}"}

    # 3. Login as seller
    seller_login = await client.post(
        "/api/v1/auth/login",
        json={"email": "seller@test.com", "password": "password123"},
    )
    seller_token = seller_login.json()["access_token"]
    seller_headers = {"Authorization": f"Bearer {seller_token}"}

    # 4. Buyer creates company
    buyer_company_response = await client.post(
        "/api/v1/companies",
        headers=buyer_headers,
        json={"name": "Buyer Company", "tags": []},
    )
    buyer_company_id = buyer_company_response.json()["id"]

    # 5. Seller creates company
    seller_company_response = await client.post(
        "/api/v1/companies",
        headers=seller_headers,
        json={"name": "Seller Company", "tags": []},
    )
    seller_company_id = seller_company_response.json()["id"]

    # 6. Seller creates product
    product_response = await client.post(
        "/api/v1/products",
        headers=seller_headers,
        json={
            "company_id": seller_company_id,
            "name": "Test Product",
            "base_price": 1000.00,
            "images": [],
        },
    )
    product_id = product_response.json()["id"]

    # 7. Seller publishes product
    await client.post(
        f"/api/v1/products/{product_id}/publish",
        headers=seller_headers,
    )

    # 8. Buyer creates order
    order_response = await client.post(
        "/api/v1/orders",
        headers=buyer_headers,
        json={
            "buyer_company_id": buyer_company_id,
            "seller_company_id": seller_company_id,
            "notes": "Integration test order",
        },
    )
    order_id = order_response.json()["id"]
    assert order_response.json()["status"] == "draft"

    # 9. Buyer adds items to order
    item_response = await client.post(
        f"/api/v1/orders/{order_id}/items",
        headers=buyer_headers,
        json={
            "order_id": order_id,
            "product_id": product_id,
            "name": "Test Product",
            "quantity": 5,
            "unit_price": 1000.00,
            "specifications": {},
        },
    )
    assert item_response.status_code == 201

    # 10. Verify order total
    order_check = await client.get(
        f"/api/v1/orders/{order_id}",
        headers=buyer_headers,
    )
    assert float(order_check.json()["total_amount"]) == 5000.00

    # 11. Seller can also see the order
    seller_order_check = await client.get(
        f"/api/v1/orders/{order_id}",
        headers=seller_headers,
    )
    assert seller_order_check.status_code == 200

    # 12. Seller approves order
    approve_response = await client.patch(
        f"/api/v1/orders/{order_id}",
        headers=seller_headers,
        json={"status": "approved"},
    )
    assert approve_response.json()["status"] == "approved"
    assert approve_response.json()["approved_at"] is not None

    # 13. Seller updates to in_production
    production_response = await client.patch(
        f"/api/v1/orders/{order_id}",
        headers=seller_headers,
        json={"status": "in_production"},
    )
    assert production_response.json()["status"] == "in_production"

    # 14. Seller completes order
    await client.patch(
        f"/api/v1/orders/{order_id}",
        headers=seller_headers,
        json={"status": "assembly"},
    )
    await client.patch(
        f"/api/v1/orders/{order_id}",
        headers=seller_headers,
        json={"status": "quality_check"},
    )
    await client.patch(
        f"/api/v1/orders/{order_id}",
        headers=seller_headers,
        json={"status": "shipping"},
    )
    await client.patch(
        f"/api/v1/orders/{order_id}",
        headers=seller_headers,
        json={"status": "delivered"},
    )
    complete_response = await client.patch(
        f"/api/v1/orders/{order_id}",
        headers=seller_headers,
        json={"status": "completed"},
    )

    assert complete_response.json()["status"] == "completed"
    assert complete_response.json()["completed_at"] is not None


@pytest.mark.asyncio
async def test_product_catalog_workflow(client: AsyncClient):
    """Test product catalog creation and search workflow"""

    # Register and login
    await client.post(
        "/api/v1/auth/register",
        json={
            "email": "seller@test.com",
            "password": "password123",
            "full_name": "Seller",
        },
    )

    login_response = await client.post(
        "/api/v1/auth/login",
        json={"email": "seller@test.com", "password": "password123"},
    )
    token = login_response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Create company
    company_response = await client.post(
        "/api/v1/companies",
        headers=headers,
        json={"name": "Manufacturing Co", "tags": ["manufacturing"]},
    )
    company_id = company_response.json()["id"]

    # Create multiple products
    products = [
        {"name": "Metal Table", "category": "Furniture", "base_price": 5000},
        {"name": "Steel Chair", "category": "Furniture", "base_price": 2000},
        {"name": "Aluminum Shelf", "category": "Storage", "base_price": 3000},
    ]

    for product_data in products:
        product_response = await client.post(
            "/api/v1/products",
            headers=headers,
            json={
                "company_id": company_id,
                "name": product_data["name"],
                "category": product_data["category"],
                "base_price": product_data["base_price"],
                "images": [],
            },
        )
        product_id = product_response.json()["id"]

        # Publish product
        await client.post(
            f"/api/v1/products/{product_id}/publish",
            headers=headers,
        )

    # Search by category
    furniture_response = await client.get(
        "/api/v1/products",
        params={"category": "Furniture", "is_published": True},
    )
    assert len(furniture_response.json()) == 2

    # Search by text
    metal_response = await client.get(
        "/api/v1/products",
        params={"search": "metal"},
    )
    assert len(metal_response.json()) >= 1

    # Filter by company
    company_products = await client.get(
        "/api/v1/products",
        params={"company_id": company_id},
    )
    assert len(company_products.json()) == 3
