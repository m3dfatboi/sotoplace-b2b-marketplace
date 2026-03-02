"""Notification processing tasks"""

from datetime import datetime
from typing import List
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.celery_app import celery_app
from app.db import async_session_maker
from app.models import Notification, NotificationPreferences, NotificationQueue, User
from app.tasks.email import send_notification_email


@celery_app.task(name="process_notification_queue")
def process_notification_queue() -> dict:
    """
    Process pending notifications in queue and send via appropriate channels

    Returns:
        dict with processing statistics
    """
    import asyncio

    async def _process():
        async with async_session_maker() as db:
            # Get pending notifications
            result = await db.execute(
                select(NotificationQueue)
                .where(
                    NotificationQueue.status == "pending",
                    NotificationQueue.scheduled_for <= datetime.utcnow(),
                )
                .limit(100)
            )
            queue_items = result.scalars().all()

            processed = 0
            failed = 0

            for item in queue_items:
                try:
                    # Get notification details
                    notification_result = await db.execute(
                        select(Notification).where(Notification.id == item.notification_id)
                    )
                    notification = notification_result.scalar_one_or_none()

                    if not notification:
                        item.status = "failed"
                        item.error_message = "Notification not found"
                        failed += 1
                        continue

                    # Get user details
                    user_result = await db.execute(
                        select(User).where(User.id == notification.user_id)
                    )
                    user = user_result.scalar_one_or_none()

                    if not user:
                        item.status = "failed"
                        item.error_message = "User not found"
                        failed += 1
                        continue

                    # Send based on channel
                    if item.channel == "email":
                        send_notification_email.delay(
                            user_email=user.email,
                            user_name=user.full_name,
                            notification_type=notification.type,
                            notification_title=notification.title,
                            notification_message=notification.message,
                            action_url=notification.action_url,
                        )

                    # Mark as sent
                    item.status = "sent"
                    item.sent_at = datetime.utcnow()
                    processed += 1

                except Exception as e:
                    item.status = "failed"
                    item.error_message = str(e)
                    item.attempts_count += 1
                    item.last_attempt_at = datetime.utcnow()
                    failed += 1

            await db.commit()

            return {"processed": processed, "failed": failed, "total": len(queue_items)}

    return asyncio.run(_process())


@celery_app.task(name="create_notification")
def create_notification(
    user_id: str,
    company_id: str,
    notification_type: str,
    title: str,
    message: str,
    priority: str = "normal",
    related_order_id: str = None,
    related_chat_id: str = None,
    action_url: str = None,
) -> dict:
    """
    Create notification and queue for delivery

    Args:
        user_id: User UUID
        company_id: Company UUID
        notification_type: Type of notification
        title: Notification title
        message: Notification message
        priority: Priority level
        related_order_id: Optional related order UUID
        related_chat_id: Optional related chat UUID
        action_url: Optional action URL

    Returns:
        dict with notification_id
    """
    import asyncio

    async def _create():
        async with async_session_maker() as db:
            # Create notification
            notification = Notification(
                user_id=UUID(user_id),
                company_id=UUID(company_id),
                type=notification_type,
                title=title,
                message=message,
                priority=priority,
                related_order_id=UUID(related_order_id) if related_order_id else None,
                related_chat_id=UUID(related_chat_id) if related_chat_id else None,
                action_url=action_url,
            )
            db.add(notification)
            await db.flush()

            # Get user preferences
            prefs_result = await db.execute(
                select(NotificationPreferences).where(
                    NotificationPreferences.user_id == UUID(user_id),
                    NotificationPreferences.company_id == UUID(company_id),
                )
            )
            preferences = prefs_result.scalar_one_or_none()

            # Queue for delivery based on preferences
            if preferences and preferences.preferences:
                type_prefs = preferences.preferences.get(notification_type, {})

                # Queue email if enabled
                if type_prefs.get("email", False):
                    user_result = await db.execute(
                        select(User).where(User.id == UUID(user_id))
                    )
                    user = user_result.scalar_one()

                    queue_item = NotificationQueue(
                        notification_id=notification.id,
                        channel="email",
                        recipient=user.email,
                        status="pending",
                    )
                    db.add(queue_item)

                # TODO: Queue push and SMS notifications

            await db.commit()

            return {"notification_id": str(notification.id)}

    return asyncio.run(_create())


@celery_app.task(name="cleanup_old_notifications")
def cleanup_old_notifications(days: int = 90) -> dict:
    """
    Clean up old archived notifications

    Args:
        days: Delete notifications older than this many days

    Returns:
        dict with deleted count
    """
    import asyncio
    from datetime import timedelta

    async def _cleanup():
        async with async_session_maker() as db:
            cutoff_date = datetime.utcnow() - timedelta(days=days)

            # Delete old archived notifications
            from sqlalchemy import delete

            result = await db.execute(
                delete(Notification).where(
                    Notification.is_archived == True,
                    Notification.created_at < cutoff_date,
                )
            )

            await db.commit()

            return {"deleted": result.rowcount}

    return asyncio.run(_cleanup())
