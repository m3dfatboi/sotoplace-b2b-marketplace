"""Base model with common fields"""

import uuid
from datetime import datetime
from typing import Any

from sqlalchemy import Column, DateTime, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import declared_attr

from app.db.session import Base


class TimestampMixin:
    """Mixin for created_at and updated_at timestamps"""

    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )


class UUIDMixin:
    """Mixin for UUID primary key"""

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)


class BaseModel(Base, UUIDMixin, TimestampMixin):
    """Base model with UUID and timestamps"""

    __abstract__ = True

    def dict(self) -> dict[str, Any]:
        """Convert model to dictionary"""
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}

    def __repr__(self) -> str:
        """String representation"""
        attrs = ", ".join(
            f"{k}={v!r}"
            for k, v in self.dict().items()
            if k not in ("created_at", "updated_at")
        )
        return f"{self.__class__.__name__}({attrs})"
