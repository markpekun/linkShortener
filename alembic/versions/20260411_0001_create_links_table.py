"""create links table

Revision ID: 20260411_0001
Revises:
Create Date: 2026-04-11 00:00:00
"""

from collections.abc import Sequence

from alembic import op
import sqlalchemy as sa


revision: str = "20260411_0001"
down_revision: str | None = None
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.create_table(
        "links",
        sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True, nullable=False),
        sa.Column("short_code", sa.String(length=16), nullable=False),
        sa.Column("original_url", sa.Text(), nullable=False),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.Column("expires_at", sa.DateTime(timezone=True), nullable=True),
        sa.CheckConstraint("expires_at IS NULL", name="ck_links_expires_null"),
        sa.UniqueConstraint("short_code", name="uq_links_short_code"),
    )
    op.create_index("ix_links_created_at", "links", ["created_at"], unique=False)


def downgrade() -> None:
    op.drop_index("ix_links_created_at", table_name="links")
    op.drop_table("links")
