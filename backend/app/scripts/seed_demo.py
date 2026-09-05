"""Seed demo company, recruiter user, careers page, and assignment sample jobs.

Idempotent strategy:
- Upsert demo company by slug
- Upsert demo recruiter user for that company
- Ensure careers page exists and is published
- Delete all jobs for the demo company, then insert CSV rows

Usage (from backend/ with venv active):

    python -m app.scripts.seed_demo

Default login: demo@demo-careers.test / demo-password-123
"""

from __future__ import annotations

import argparse
from datetime import UTC, datetime
from pathlib import Path
from uuid import uuid4

from app.core.security import hash_password
from app.db.session import SessionLocal
from app.models.company import Company
from app.models.job import Job
from app.models.user import User
from app.repositories.careers_page_repository import CareersPageRepository
from app.repositories.company_repository import CompanyRepository
from app.repositories.job_repository import JobRepository
from app.repositories.user_repository import UserRepository
from app.services.job_csv_import import default_csv_path, load_sample_jobs
from app.utils.slug import normalize_slug

DEMO_SLUG = "demo-careers"
DEMO_NAME = "Demo Careers Co"
DEMO_EMAIL = "demo@demo-careers.test"
DEMO_PASSWORD = "demo-password-123"
DEMO_FULL_NAME = "Demo Recruiter"


def _demo_page_config() -> dict:
    return {
        "theme": {"primaryColor": "#0F172A", "secondaryColor": "#F8FAFC"},
        "sections": [
            {
                "id": str(uuid4()),
                "type": "hero",
                "title": "Build what comes next",
                "subtitle": "Explore open roles across product, engineering, and go-to-market.",
                "ctaLabel": "View open roles",
            },
            {
                "id": str(uuid4()),
                "type": "about",
                "title": "About Demo Careers Co",
                "body": (
                    "We are a sample company used to showcase the careers page builder. "
                    "Roles in this demo are imported from the assignment dataset."
                ),
            },
        ],
    }


def seed_demo(
    *,
    csv_path: Path | None = None,
    slug: str = DEMO_SLUG,
    email: str = DEMO_EMAIL,
    password: str = DEMO_PASSWORD,
) -> dict[str, object]:
    session = SessionLocal()
    company_repo = CompanyRepository(session)
    user_repo = UserRepository(session)
    page_repo = CareersPageRepository(session)
    job_repo = JobRepository(session)

    try:
        normalized = normalize_slug(slug)
        company = company_repo.get_by_slug(normalized)
        if company is None:
            company = company_repo.create_company(
                Company(
                    name=DEMO_NAME,
                    slug=normalized,
                    primary_color="#0F172A",
                    secondary_color="#F8FAFC",
                    is_active=True,
                )
            )
            company_created = True
        else:
            company.is_active = True
            company = company_repo.update_company(company)
            company_created = False

        user = user_repo.get_by_company_id(company.id)
        if user is None:
            existing_email = user_repo.get_by_email(email.lower())
            if existing_email is not None:
                raise RuntimeError(
                    f"Demo email '{email}' is already tied to another company"
                )
            user = user_repo.create_user(
                User(
                    company_id=company.id,
                    full_name=DEMO_FULL_NAME,
                    email=email.lower(),
                    password_hash=hash_password(password),
                    is_active=True,
                )
            )
            user_created = True
        else:
            user.full_name = DEMO_FULL_NAME
            user.email = email.lower()
            user.password_hash = hash_password(password)
            user.is_active = True
            session.add(user)
            session.flush()
            session.refresh(user)
            user_created = False

        page = page_repo.create_if_missing(company.id)
        config = _demo_page_config()
        page_repo.update_draft(page, config)
        page_repo.publish(page, datetime.now(UTC))

        deleted = job_repo.delete_all_for_company(company.id)
        payloads = load_sample_jobs(csv_path)
        for payload in payloads:
            job_repo.create_job(Job(company_id=company.id, **payload))

        session.commit()
        return {
            "company_id": str(company.id),
            "user_id": str(user.id),
            "slug": company.slug,
            "email": user.email,
            "password": password,
            "company_created": company_created,
            "user_created": user_created,
            "jobs_deleted": deleted,
            "jobs_imported": len(payloads),
            "csv_path": str(csv_path or default_csv_path()),
            "public_path": f"/careers/{company.slug}",
        }
    except Exception:
        session.rollback()
        raise
    finally:
        session.close()


def main() -> None:
    parser = argparse.ArgumentParser(description="Seed demo careers company + sample jobs")
    parser.add_argument(
        "--csv",
        type=Path,
        default=None,
        help="Path to sample jobs CSV (defaults to backend/data/sample_jobs.csv)",
    )
    parser.add_argument(
        "--slug",
        default=DEMO_SLUG,
        help=f"Demo company slug (default: {DEMO_SLUG})",
    )
    args = parser.parse_args()
    result = seed_demo(csv_path=args.csv, slug=args.slug)
    print("Demo seed complete")
    for key, value in result.items():
        print(f"  {key}: {value}")


if __name__ == "__main__":
    main()
