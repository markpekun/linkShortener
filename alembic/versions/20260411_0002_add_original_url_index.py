"""add original_url index

Revision ID: 20260411_0002
Revises: 20260411_0001
Create Date: 2026-04-11 00:30:00
"""

from collections.abc import Sequence

from alembic import op


revision: str = "20260411_0002"
down_revision: str | None = "20260411_0001"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.create_index("ix_links_original_url", "links", ["original_url"], unique=False)


def downgrade() -> None:
    op.drop_index("ix_links_original_url", table_name="links")
