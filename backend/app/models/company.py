from __future__ import annotations

from typing import TYPE_CHECKING

from sqlalchemy import Boolean, String, text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import TimestampedBase

if TYPE_CHECKING:
    from app.models.careers_page import CareersPage
    from app.models.job import Job
    from app.models.user import User


class Company(TimestampedBase):
    """Tenant root. Owns one recruiter, one careers page, and many jobs."""

    __tablename__ = "companies"

    name: Mapped[str] = mapped_column(String(255), nullable=False)
    slug: Mapped[str] = mapped_column(String(100), unique=True, index=True, nullable=False)
    logo_url: Mapped[str | None] = mapped_column(String(1024), nullable=True)
    banner_url: Mapped[str | None] = mapped_column(String(1024), nullable=True)
    primary_color: Mapped[str] = mapped_column(
        String(32),
        nullable=False,
        default="#111111",
        server_default=text("'#111111'"),
    )
    secondary_color: Mapped[str] = mapped_column(
        String(32),
        nullable=False,
        default="#FFFFFF",
        server_default=text("'#FFFFFF'"),
    )
    is_active: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        default=True,
        server_default=text("true"),
    )

    user: Mapped[User] = relationship(
        back_populates="company",
        uselist=False,
        cascade="all, delete-orphan",
        single_parent=True,
    )
    careers_page: Mapped[CareersPage] = relationship(
        back_populates="company",
        uselist=False,
        cascade="all, delete-orphan",
        single_parent=True,
    )
    jobs: Mapped[list[Job]] = relationship(
        back_populates="company",
        cascade="all, delete-orphan",
    )
