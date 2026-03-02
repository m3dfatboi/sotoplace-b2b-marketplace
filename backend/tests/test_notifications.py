"""Tests for notification API endpoints"""

import pytest
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import Notification, NotificationPreferences


@pytest.mark.asyncio
async def test_get_notifications(
    client: AsyncClient,
    auth_headers: dict,
    db_session: AsyncSession,
    test_user,
    test_company,
):
    """Test getting user notifications"""
    # Create test notification
    notification = Notification(
        user_id=test_user.id,
        company_id=test_company.id,
        type="order_status_change",
        title="Test Notification",
        message="This is a test notification",
        priority="normal",
    )
    db_session.add(notification)
    await db_session.commit()

    # Get notifications
    response = await client.get("/api/v1/notifications", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert len(data) > 0
    assert data[0]["title"] == "Test Notification"


@pytest.mark.asyncio
async def test_get_notification_stats(
    client: AsyncClient,
    auth_headers: dict,
    db_session: AsyncSession,
    test_user,
    test_company,
):
    """Test getting notification statistics"""
    # Create test notifications
    for i in range(3):
        notification = Notification(
            user_id=test_user.id,
            company_id=test_company.id,
            type="order_status_change",
            title=f"Notification {i}",
            message="Test",
            priority="normal",
            is_read=(i == 0),  # First one is read
        )
        db_session.add(notification)
    await db_session.commit()

    # Get stats
    response = await client.get("/api/v1/notifications/stats", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["total"] >= 3
    assert data["unread"] >= 2


@pytest.mark.asyncio
async def test_mark_notification_read(
    client: AsyncClient,
    auth_headers: dict,
    db_session: AsyncSession,
    test_user,
    test_company,
):
    """Test marking notification as read"""
    # Create test notification
    notification = Notification(
        user_id=test_user.id,
        company_id=test_company.id,
        type="new_message",
        title="New Message",
        message="You have a new message",
        priority="normal",
        is_read=False,
    )
    db_session.add(notification)
    await db_session.commit()
    await db_session.refresh(notification)

    # Mark as read
    response = await client.patch(
        f"/api/v1/notifications/{notification.id}/read",
        headers=auth_headers,
        json={"is_read": True},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["is_read"] is True
    assert data["read_at"] is not None


@pytest.mark.asyncio
async def test_mark_all_notifications_read(
    client: AsyncClient,
    auth_headers: dict,
    db_session: AsyncSession,
    test_user,
    test_company,
):
    """Test marking all notifications as read"""
    # Create unread notifications
    for i in range(3):
        notification = Notification(
            user_id=test_user.id,
            company_id=test_company.id,
            type="order_status_change",
            title=f"Notification {i}",
            message="Test",
            priority="normal",
            is_read=False,
        )
        db_session.add(notification)
    await db_session.commit()

    # Mark all as read
    response = await client.post(
        "/api/v1/notifications/mark-all-read",
        headers=auth_headers,
    )
    assert response.status_code == 204


@pytest.mark.asyncio
async def test_archive_notification(
    client: AsyncClient,
    auth_headers: dict,
    db_session: AsyncSession,
    test_user,
    test_company,
):
    """Test archiving notification"""
    # Create test notification
    notification = Notification(
        user_id=test_user.id,
        company_id=test_company.id,
        type="system_announcement",
        title="System Update",
        message="System will be updated",
        priority="low",
        is_archived=False,
    )
    db_session.add(notification)
    await db_session.commit()
    await db_session.refresh(notification)

    # Archive notification
    response = await client.patch(
        f"/api/v1/notifications/{notification.id}/archive",
        headers=auth_headers,
    )
    assert response.status_code == 200
    data = response.json()
    assert data["is_archived"] is True


@pytest.mark.asyncio
async def test_delete_notification(
    client: AsyncClient,
    auth_headers: dict,
    db_session: AsyncSession,
    test_user,
    test_company,
):
    """Test deleting notification"""
    # Create test notification
    notification = Notification(
        user_id=test_user.id,
        company_id=test_company.id,
        type="system_announcement",
        title="Old Notification",
        message="This will be deleted",
        priority="low",
    )
    db_session.add(notification)
    await db_session.commit()
    await db_session.refresh(notification)

    # Delete notification
    response = await client.delete(
        f"/api/v1/notifications/{notification.id}",
        headers=auth_headers,
    )
    assert response.status_code == 204


@pytest.mark.asyncio
async def test_get_notification_preferences(
    client: AsyncClient,
    auth_headers: dict,
    test_company,
):
    """Test getting notification preferences"""
    response = await client.get(
        f"/api/v1/notifications/preferences/me?company_id={test_company.id}",
        headers=auth_headers,
    )
    assert response.status_code == 200
    data = response.json()
    assert "preferences" in data
    assert isinstance(data["preferences"], dict)


@pytest.mark.asyncio
async def test_update_notification_preferences(
    client: AsyncClient,
    auth_headers: dict,
    test_company,
):
    """Test updating notification preferences"""
    new_preferences = {
        "order_status_change": {"email": True, "push": False, "sms": False},
        "new_message": {"email": False, "push": True, "sms": False},
    }

    response = await client.patch(
        f"/api/v1/notifications/preferences/me?company_id={test_company.id}",
        headers=auth_headers,
        json={"preferences": new_preferences},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["preferences"]["order_status_change"]["email"] is True
    assert data["preferences"]["new_message"]["push"] is True


@pytest.mark.asyncio
async def test_filter_notifications_by_type(
    client: AsyncClient,
    auth_headers: dict,
    db_session: AsyncSession,
    test_user,
    test_company,
):
    """Test filtering notifications by type"""
    # Create notifications of different types
    types = ["order_status_change", "new_message", "blueprint_approval"]
    for notif_type in types:
        notification = Notification(
            user_id=test_user.id,
            company_id=test_company.id,
            type=notif_type,
            title=f"Test {notif_type}",
            message="Test",
            priority="normal",
        )
        db_session.add(notification)
    await db_session.commit()

    # Filter by type
    response = await client.get(
        "/api/v1/notifications?notification_type=new_message",
        headers=auth_headers,
    )
    assert response.status_code == 200
    data = response.json()
    assert all(n["type"] == "new_message" for n in data)


@pytest.mark.asyncio
async def test_filter_notifications_unread_only(
    client: AsyncClient,
    auth_headers: dict,
    db_session: AsyncSession,
    test_user,
    test_company,
):
    """Test filtering unread notifications only"""
    # Create read and unread notifications
    for i in range(2):
        notification = Notification(
            user_id=test_user.id,
            company_id=test_company.id,
            type="order_status_change",
            title=f"Notification {i}",
            message="Test",
            priority="normal",
            is_read=(i == 0),
        )
        db_session.add(notification)
    await db_session.commit()

    # Get unread only
    response = await client.get(
        "/api/v1/notifications?unread_only=true",
        headers=auth_headers,
    )
    assert response.status_code == 200
    data = response.json()
    assert all(not n["is_read"] for n in data)
