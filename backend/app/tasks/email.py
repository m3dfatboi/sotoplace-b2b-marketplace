"""Email tasks"""

import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import List, Optional

from app.core.celery_app import celery_app
from app.core.config import settings


@celery_app.task(name="send_email", bind=True, max_retries=3)
def send_email(
    self,
    to_email: str,
    subject: str,
    body: str,
    html_body: Optional[str] = None,
) -> dict:
    """
    Send email via SMTP

    Args:
        to_email: Recipient email address
        subject: Email subject
        body: Plain text body
        html_body: Optional HTML body

    Returns:
        dict with status and message
    """
    if not settings.smtp_host:
        return {"status": "skipped", "message": "SMTP not configured"}

    try:
        # Create message
        msg = MIMEMultipart("alternative")
        msg["Subject"] = subject
        msg["From"] = f"{settings.smtp_from_name} <{settings.smtp_from_email}>"
        msg["To"] = to_email

        # Add plain text part
        msg.attach(MIMEText(body, "plain"))

        # Add HTML part if provided
        if html_body:
            msg.attach(MIMEText(html_body, "html"))

        # Send email
        with smtplib.SMTP(settings.smtp_host, settings.smtp_port) as server:
            if settings.smtp_user and settings.smtp_password:
                server.starttls()
                server.login(settings.smtp_user, settings.smtp_password)

            server.send_message(msg)

        return {"status": "sent", "message": f"Email sent to {to_email}"}

    except Exception as exc:
        # Retry with exponential backoff
        raise self.retry(exc=exc, countdown=60 * (2 ** self.request.retries))


@celery_app.task(name="send_notification_email")
def send_notification_email(
    user_email: str,
    user_name: str,
    notification_type: str,
    notification_title: str,
    notification_message: str,
    action_url: Optional[str] = None,
) -> dict:
    """
    Send notification email to user

    Args:
        user_email: User email
        user_name: User name
        notification_type: Type of notification
        notification_title: Notification title
        notification_message: Notification message
        action_url: Optional action URL

    Returns:
        dict with status
    """
    # Create email body
    body = f"""
Здравствуйте, {user_name}!

{notification_title}

{notification_message}
"""

    if action_url:
        body += f"\n\nПерейти: {action_url}\n"

    body += """

---
С уважением,
Команда Sotoplace
"""

    # Create HTML body
    html_body = f"""
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
        .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
        .header {{ background-color: #4CAF50; color: white; padding: 20px; text-align: center; }}
        .content {{ padding: 20px; background-color: #f9f9f9; }}
        .button {{ display: inline-block; padding: 10px 20px; background-color: #4CAF50;
                   color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }}
        .footer {{ padding: 20px; text-align: center; color: #666; font-size: 12px; }}
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Sotoplace</h1>
        </div>
        <div class="content">
            <p>Здравствуйте, {user_name}!</p>
            <h2>{notification_title}</h2>
            <p>{notification_message}</p>
"""

    if action_url:
        html_body += f'<a href="{action_url}" class="button">Перейти</a>'

    html_body += """
        </div>
        <div class="footer">
            <p>С уважением,<br>Команда Sotoplace</p>
            <p>Это автоматическое сообщение, пожалуйста, не отвечайте на него.</p>
        </div>
    </div>
</body>
</html>
"""

    # Send email
    return send_email(
        to_email=user_email,
        subject=f"Sotoplace: {notification_title}",
        body=body,
        html_body=html_body,
    )


@celery_app.task(name="send_bulk_emails")
def send_bulk_emails(emails: List[dict]) -> dict:
    """
    Send multiple emails in bulk

    Args:
        emails: List of email dicts with keys: to_email, subject, body, html_body

    Returns:
        dict with sent count and failed count
    """
    sent = 0
    failed = 0

    for email_data in emails:
        try:
            send_email(
                to_email=email_data["to_email"],
                subject=email_data["subject"],
                body=email_data["body"],
                html_body=email_data.get("html_body"),
            )
            sent += 1
        except Exception:
            failed += 1

    return {"sent": sent, "failed": failed, "total": len(emails)}
