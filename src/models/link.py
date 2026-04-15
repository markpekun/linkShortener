from datetime import datetime

from sqlalchemy import CheckConstraint, DateTime, Index, String, Text, UniqueConstraint, func
from sqlalchemy.orm import Mapped, mapped_column

from src.models.base import Base


class Link(Base):
    __tablename__ = "links"
    __table_args__ = (
        CheckConstraint("expires_at IS NULL", name="ck_links_expires_null"),
        UniqueConstraint("short_code", name="uq_links_short_code"),
        Index("ix_links_created_at", "created_at"),
        Index("ix_links_original_url", "original_url"),
    )

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    short_code: Mapped[str] = mapped_column(String(16), nullable=False)
    original_url: Mapped[str] = mapped_column(Text, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
    )
    expires_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
        default=None,
    )
