"""WebSocket endpoints for real-time communication"""

from typing import Dict, Set
from uuid import UUID

from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends, Query
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db import get_db
from app.models import Chat, ChatParticipant, Message, User
from app.core.security import decode_access_token

router = APIRouter()


class ConnectionManager:
    """Manage WebSocket connections"""

    def __init__(self):
        # chat_id -> set of websockets
        self.active_connections: Dict[UUID, Set[WebSocket]] = {}
        # websocket -> user_id mapping
        self.user_connections: Dict[WebSocket, UUID] = {}

    async def connect(self, websocket: WebSocket, chat_id: UUID, user_id: UUID):
        """Connect user to chat"""
        await websocket.accept()

        if chat_id not in self.active_connections:
            self.active_connections[chat_id] = set()

        self.active_connections[chat_id].add(websocket)
        self.user_connections[websocket] = user_id

    def disconnect(self, websocket: WebSocket, chat_id: UUID):
        """Disconnect user from chat"""
        if chat_id in self.active_connections:
            self.active_connections[chat_id].discard(websocket)
            if not self.active_connections[chat_id]:
                del self.active_connections[chat_id]

        if websocket in self.user_connections:
            del self.user_connections[websocket]

    async def send_personal_message(self, message: str, websocket: WebSocket):
        """Send message to specific connection"""
        await websocket.send_json(message)

    async def broadcast_to_chat(self, message: dict, chat_id: UUID, exclude: WebSocket = None):
        """Broadcast message to all users in chat"""
        if chat_id not in self.active_connections:
            return

        for connection in self.active_connections[chat_id]:
            if connection != exclude:
                try:
                    await connection.send_json(message)
                except:
                    # Connection might be closed
                    pass

    def get_chat_users_count(self, chat_id: UUID) -> int:
        """Get number of active users in chat"""
        if chat_id not in self.active_connections:
            return 0
        return len(self.active_connections[chat_id])


manager = ConnectionManager()


async def get_current_user_ws(
    token: str = Query(...),
    db: AsyncSession = Depends(get_db),
) -> User:
    """Get current user from WebSocket token"""
    payload = decode_access_token(token)
    if payload is None:
        raise WebSocketDisconnect(code=1008, reason="Invalid token")

    user_id = payload.get("sub")
    if user_id is None:
        raise WebSocketDisconnect(code=1008, reason="Invalid token")

    result = await db.execute(select(User).where(User.id == UUID(user_id)))
    user = result.scalar_one_or_none()

    if user is None or not user.is_active:
        raise WebSocketDisconnect(code=1008, reason="User not found or inactive")

    return user


@router.websocket("/ws/chats/{chat_id}")
async def websocket_chat_endpoint(
    websocket: WebSocket,
    chat_id: UUID,
    token: str = Query(...),
    db: AsyncSession = Depends(get_db),
):
    """
    WebSocket endpoint for real-time chat

    Connect: ws://localhost:8000/api/v1/ws/chats/{chat_id}?token=YOUR_JWT_TOKEN

    Message format (send):
    {
        "type": "message",
        "content": "Hello!",
        "attachments": []
    }

    Message format (receive):
    {
        "type": "message",
        "id": "uuid",
        "sender_id": "uuid",
        "sender_name": "John Doe",
        "content": "Hello!",
        "created_at": "2026-03-02T10:00:00Z",
        "attachments": []
    }

    System messages:
    {
        "type": "user_joined",
        "user_id": "uuid",
        "user_name": "John Doe",
        "active_users": 3
    }

    {
        "type": "user_left",
        "user_id": "uuid",
        "user_name": "John Doe",
        "active_users": 2
    }

    {
        "type": "typing",
        "user_id": "uuid",
        "user_name": "John Doe"
    }
    """
    # Authenticate user
    try:
        current_user = await get_current_user_ws(token, db)
    except WebSocketDisconnect:
        await websocket.close(code=1008, reason="Authentication failed")
        return

    # Check if chat exists
    result = await db.execute(select(Chat).where(Chat.id == chat_id))
    chat = result.scalar_one_or_none()

    if chat is None:
        await websocket.close(code=1008, reason="Chat not found")
        return

    # Check if user is participant
    result = await db.execute(
        select(ChatParticipant).where(
            ChatParticipant.chat_id == chat_id,
            ChatParticipant.user_id == current_user.id,
            ChatParticipant.is_active == True,
        )
    )
    participant = result.scalar_one_or_none()

    if participant is None:
        await websocket.close(code=1008, reason="Not a participant")
        return

    # Connect user
    await manager.connect(websocket, chat_id, current_user.id)

    # Notify others that user joined
    await manager.broadcast_to_chat(
        {
            "type": "user_joined",
            "user_id": str(current_user.id),
            "user_name": current_user.full_name,
            "active_users": manager.get_chat_users_count(chat_id),
        },
        chat_id,
        exclude=websocket,
    )

    try:
        while True:
            # Receive message from client
            data = await websocket.receive_json()

            message_type = data.get("type", "message")

            if message_type == "message":
                # Save message to database
                from datetime import datetime

                message = Message(
                    chat_id=chat_id,
                    sender_user_id=current_user.id,
                    sender_company_id=participant.company_id,
                    content=data.get("content", ""),
                    message_type="text",
                    attachments=data.get("attachments", []),
                )
                db.add(message)
                await db.commit()
                await db.refresh(message)

                # Update chat last_message_at
                chat.last_message_at = datetime.utcnow()
                await db.commit()

                # Broadcast to all participants
                await manager.broadcast_to_chat(
                    {
                        "type": "message",
                        "id": str(message.id),
                        "sender_id": str(current_user.id),
                        "sender_name": current_user.full_name,
                        "content": message.content,
                        "created_at": message.created_at.isoformat(),
                        "attachments": message.attachments,
                    },
                    chat_id,
                )

            elif message_type == "typing":
                # Broadcast typing indicator
                await manager.broadcast_to_chat(
                    {
                        "type": "typing",
                        "user_id": str(current_user.id),
                        "user_name": current_user.full_name,
                    },
                    chat_id,
                    exclude=websocket,
                )

            elif message_type == "read":
                # Update last_read_at for participant
                from datetime import datetime
                participant.last_read_at = datetime.utcnow()
                await db.commit()

                # Notify sender that message was read
                await manager.broadcast_to_chat(
                    {
                        "type": "read",
                        "user_id": str(current_user.id),
                        "message_id": data.get("message_id"),
                    },
                    chat_id,
                    exclude=websocket,
                )

    except WebSocketDisconnect:
        manager.disconnect(websocket, chat_id)

        # Notify others that user left
        await manager.broadcast_to_chat(
            {
                "type": "user_left",
                "user_id": str(current_user.id),
                "user_name": current_user.full_name,
                "active_users": manager.get_chat_users_count(chat_id),
            },
            chat_id,
        )
