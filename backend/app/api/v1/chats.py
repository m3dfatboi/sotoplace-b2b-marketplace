"""Chat API endpoints"""

from typing import Any, List, Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.dependencies import get_current_active_user
from app.db import get_db
from app.models import Chat, ChatParticipant, Message, User
from app.schemas.chat import (
    ChatCreate,
    ChatResponse,
    MessageCreate,
    MessageResponse,
)

router = APIRouter(prefix="/chats", tags=["chats"])


@router.post("", response_model=ChatResponse, status_code=status.HTTP_201_CREATED)
async def create_chat(
    chat_data: ChatCreate,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
) -> Any:
    """
    Create a new chat

    - **type**: Chat type (order, blueprint, general, support)
    - **order_id**: Optional order ID for order chats
    - **blueprint_id**: Optional blueprint ID for blueprint chats
    """
    from datetime import datetime

    # Create chat
    chat = Chat(
        type=chat_data.type,
        order_id=chat_data.order_id,
        blueprint_id=chat_data.blueprint_id,
    )
    db.add(chat)
    await db.flush()

    # Add creator as participant
    participant = ChatParticipant(
        chat_id=chat.id,
        user_id=current_user.id,
        company_id=chat_data.company_id,
        role="owner",
        joined_at=datetime.utcnow(),
    )
    db.add(participant)

    await db.commit()
    await db.refresh(chat)

    return chat


@router.get("", response_model=List[ChatResponse])
async def list_chats(
    chat_type: Optional[str] = Query(None, description="Filter by chat type"),
    order_id: Optional[UUID] = Query(None, description="Filter by order"),
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
) -> Any:
    """
    List user's chats

    Returns chats where user is a participant
    """
    # Get user's chats
    query = (
        select(Chat)
        .join(ChatParticipant)
        .where(ChatParticipant.user_id == current_user.id)
        .where(ChatParticipant.is_active == True)
    )

    if chat_type:
        query = query.where(Chat.type == chat_type)
    if order_id:
        query = query.where(Chat.order_id == order_id)

    query = query.order_by(Chat.last_message_at.desc().nullslast())

    result = await db.execute(query)
    chats = result.scalars().all()

    return chats


@router.get("/{chat_id}", response_model=ChatResponse)
async def get_chat(
    chat_id: UUID,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
) -> Any:
    """Get chat by ID"""
    # Check if user is participant
    participant_result = await db.execute(
        select(ChatParticipant).where(
            ChatParticipant.chat_id == chat_id,
            ChatParticipant.user_id == current_user.id,
            ChatParticipant.is_active == True,
        )
    )
    participant = participant_result.scalar_one_or_none()

    if not participant:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not a participant of this chat",
        )

    # Get chat
    result = await db.execute(
        select(Chat).where(Chat.id == chat_id)
    )
    chat = result.scalar_one_or_none()

    if not chat:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Chat not found",
        )

    return chat


@router.post("/{chat_id}/messages", response_model=MessageResponse, status_code=status.HTTP_201_CREATED)
async def send_message(
    chat_id: UUID,
    message_data: MessageCreate,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
) -> Any:
    """
    Send message to chat

    - **content**: Message text
    - **message_type**: Type (text, file, blueprint_version, status_update)
    - **attachments**: Optional file attachments
    """
    from datetime import datetime

    # Check if user is participant
    participant_result = await db.execute(
        select(ChatParticipant).where(
            ChatParticipant.chat_id == chat_id,
            ChatParticipant.user_id == current_user.id,
            ChatParticipant.is_active == True,
        )
    )
    participant = participant_result.scalar_one_or_none()

    if not participant:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not a participant of this chat",
        )

    # Create message
    message = Message(
        chat_id=chat_id,
        sender_user_id=current_user.id,
        sender_company_id=participant.company_id,
        content=message_data.content,
        message_type=message_data.message_type,
        attachments=message_data.attachments or [],
        blueprint_version_id=message_data.blueprint_version_id,
    )
    db.add(message)

    # Update chat last_message_at
    chat_result = await db.execute(
        select(Chat).where(Chat.id == chat_id)
    )
    chat = chat_result.scalar_one()
    chat.last_message_at = datetime.utcnow()

    await db.commit()
    await db.refresh(message)

    return message


@router.get("/{chat_id}/messages", response_model=List[MessageResponse])
async def list_messages(
    chat_id: UUID,
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
) -> Any:
    """
    List messages in chat

    Returns messages in chronological order
    """
    # Check if user is participant
    participant_result = await db.execute(
        select(ChatParticipant).where(
            ChatParticipant.chat_id == chat_id,
            ChatParticipant.user_id == current_user.id,
            ChatParticipant.is_active == True,
        )
    )
    participant = participant_result.scalar_one_or_none()

    if not participant:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not a participant of this chat",
        )

    # Get messages
    result = await db.execute(
        select(Message)
        .where(Message.chat_id == chat_id)
        .where(Message.is_deleted == False)
        .order_by(Message.created_at.asc())
        .offset(skip)
        .limit(limit)
    )
    messages = result.scalars().all()

    return messages


@router.post("/{chat_id}/participants", status_code=status.HTTP_201_CREATED)
async def add_participant(
    chat_id: UUID,
    user_id: UUID,
    company_id: UUID,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
) -> Any:
    """
    Add participant to chat

    Only chat owner can add participants
    """
    from datetime import datetime

    # Check if current user is owner
    owner_check = await db.execute(
        select(ChatParticipant).where(
            ChatParticipant.chat_id == chat_id,
            ChatParticipant.user_id == current_user.id,
            ChatParticipant.role == "owner",
            ChatParticipant.is_active == True,
        )
    )
    if not owner_check.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only chat owner can add participants",
        )

    # Check if already participant
    existing = await db.execute(
        select(ChatParticipant).where(
            ChatParticipant.chat_id == chat_id,
            ChatParticipant.user_id == user_id,
        )
    )
    if existing.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User is already a participant",
        )

    # Add participant
    participant = ChatParticipant(
        chat_id=chat_id,
        user_id=user_id,
        company_id=company_id,
        role="participant",
        joined_at=datetime.utcnow(),
    )
    db.add(participant)
    await db.commit()

    return {"message": "Participant added successfully"}


@router.post("/{chat_id}/read", status_code=status.HTTP_204_NO_CONTENT)
async def mark_as_read(
    chat_id: UUID,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
) -> None:
    """Mark chat as read (update last_read_at)"""
    from datetime import datetime

    # Get participant
    result = await db.execute(
        select(ChatParticipant).where(
            ChatParticipant.chat_id == chat_id,
            ChatParticipant.user_id == current_user.id,
            ChatParticipant.is_active == True,
        )
    )
    participant = result.scalar_one_or_none()

    if not participant:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not a participant of this chat",
        )

    # Update last_read_at
    participant.last_read_at = datetime.utcnow()
    await db.commit()
