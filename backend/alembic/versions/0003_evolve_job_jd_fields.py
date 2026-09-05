"""Evolve jobs table to the assignment Job Description schema.

Revision ID: 0003_job_jd_fields
Revises: 0002_core_models
Create Date: 2026-09-05
"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "0003_job_jd_fields"
down_revision: Union[str, None] = "0002_core_models"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "jobs",
        sa.Column("work_policy", sa.String(length=50), nullable=True),
    )
    op.add_column(
        "jobs",
        sa.Column("experience_level", sa.String(length=50), nullable=True),
    )
    op.add_column(
        "jobs",
        sa.Column("job_type", sa.String(length=50), nullable=True),
    )
    op.add_column(
        "jobs",
        sa.Column("salary_range", sa.String(length=150), nullable=True),
    )
    op.add_column(
        "jobs",
        sa.Column("posted_at", sa.DateTime(timezone=True), nullable=True),
    )

    op.execute(
        sa.text(
            """
            UPDATE jobs
            SET
                posted_at = created_at,
                work_policy = COALESCE(work_policy, 'remote'),
                experience_level = COALESCE(experience_level, 'mid_level'),
                job_type = CASE
                    WHEN employment_type = 'internship' THEN 'internship'
                    WHEN employment_type = 'temporary' THEN 'temporary'
                    ELSE COALESCE(job_type, 'permanent')
                END,
                employment_type = CASE
                    WHEN employment_type IN ('internship', 'temporary')
                        THEN 'full_time'
                    WHEN employment_type IN ('full_time', 'part_time', 'contract')
                        THEN employment_type
                    ELSE 'full_time'
                END
            """
        )
    )

    op.alter_column(
        "jobs",
        "work_policy",
        existing_type=sa.String(length=50),
        nullable=False,
    )
    op.alter_column(
        "jobs",
        "experience_level",
        existing_type=sa.String(length=50),
        nullable=False,
    )
    op.alter_column(
        "jobs",
        "job_type",
        existing_type=sa.String(length=50),
        nullable=False,
    )
    op.alter_column(
        "jobs",
        "posted_at",
        existing_type=sa.DateTime(timezone=True),
        nullable=False,
        server_default=sa.text("now()"),
    )

    op.create_index(
        "ix_jobs_company_id_posted_at",
        "jobs",
        ["company_id", "posted_at"],
        unique=False,
    )


def downgrade() -> None:
    op.drop_index("ix_jobs_company_id_posted_at", table_name="jobs")
    op.drop_column("jobs", "posted_at")
    op.drop_column("jobs", "salary_range")
    op.drop_column("jobs", "job_type")
    op.drop_column("jobs", "experience_level")
    op.drop_column("jobs", "work_policy")
