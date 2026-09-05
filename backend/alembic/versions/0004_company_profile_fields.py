"""Add company profile fields for branding page polish.

Revision ID: 0004_company_profile_fields
Revises: 0003_job_jd_fields
Create Date: 2026-09-05
"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "0004_company_profile_fields"
down_revision: Union[str, None] = "0003_job_jd_fields"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "companies",
        sa.Column("website", sa.String(length=1024), nullable=True),
    )
    op.add_column(
        "companies",
        sa.Column("industry", sa.String(length=150), nullable=True),
    )
    op.add_column(
        "companies",
        sa.Column("company_size", sa.String(length=50), nullable=True),
    )


def downgrade() -> None:
    op.drop_column("companies", "company_size")
    op.drop_column("companies", "industry")
    op.drop_column("companies", "website")
