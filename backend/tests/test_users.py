"""Tests for user endpoints"""

import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_get_user_profile(client: AsyncClient, auth_headers: dict):
    """Test getting user profile"""
    response = await client.get(
        "/api/v1/users/me",
        headers=auth_headers,
    )

    assert response.status_code == 200
    data = response.json()
    assert "id" in data
    assert "email" in data
    assert "full_name" in data
    assert "is_active" in data


@pytest.mark.asyncio
async def test_update_user_profile(client: AsyncClient, auth_headers: dict):
    """Test updating user profile"""
    response = await client.patch(
        "/api/v1/users/me",
        headers=auth_headers,
        json={
            "full_name": "Updated Name",
            "phone": "+7 (999) 123-45-67",
        },
    )

    assert response.status_code == 200
    data = response.json()
    assert data["full_name"] == "Updated Name"
    assert data["phone"] == "+7 (999) 123-45-67"


@pytest.mark.asyncio
async def test_change_password_success(client: AsyncClient, auth_headers: dict, test_user: dict):
    """Test successful password change"""
    response = await client.post(
        "/api/v1/users/me/change-password",
        headers=auth_headers,
        params={
            "current_password": test_user["password"],
            "new_password": "newpassword123",
        },
    )

    assert response.status_code == 204

    # Try logging in with new password
    login_response = await client.post(
        "/api/v1/auth/login",
        json={
            "email": test_user["email"],
            "password": "newpassword123",
        },
    )
    assert login_response.status_code == 200


@pytest.mark.asyncio
async def test_change_password_wrong_current(client: AsyncClient, auth_headers: dict):
    """Test password change with wrong current password"""
    response = await client.post(
        "/api/v1/users/me/change-password",
        headers=auth_headers,
        params={
            "current_password": "wrongpassword",
            "new_password": "newpassword123",
        },
    )

    assert response.status_code == 400
    assert "Incorrect" in response.json()["detail"]


@pytest.mark.asyncio
async def test_change_password_too_short(client: AsyncClient, auth_headers: dict, test_user: dict):
    """Test password change with too short new password"""
    response = await client.post(
        "/api/v1/users/me/change-password",
        headers=auth_headers,
        params={
            "current_password": test_user["password"],
            "new_password": "short",
        },
    )

    assert response.status_code == 400
    assert "8 characters" in response.json()["detail"]
