from uuid import uuid4

import pytest

from app.core.exceptions import NotFoundError
from app.models.careers_page import CareersPage
from app.models.company import Company
from app.models.job import Job
from app.services.public_service import PublicService


def test_get_public_site_excludes_draft_and_inactive_jobs(
    db_session,
    unique_slug: str,
) -> None:
    company = Company(name="Acme", slug=unique_slug, is_active=True)
    db_session.add(company)
    db_session.flush()

    page = CareersPage(
        company_id=company.id,
        draft_config={"secret": True},
        published_config={"theme": {"primaryColor": "#000000"}},
        published_at=None,
    )
    db_session.add(page)

    active = Job(
        company_id=company.id,
        title="Open",
        department="Eng",
        location="Remote",
        employment_type="full_time",
        work_policy="remote",
        experience_level="mid_level",
        job_type="permanent",
        description="Desc",
        is_active=True,
    )
    inactive = Job(
        company_id=company.id,
        title="Closed",
        department="Eng",
        location="Remote",
        employment_type="full_time",
        work_policy="hybrid",
        experience_level="junior",
        job_type="temporary",
        description="Desc",
        is_active=False,
    )
    db_session.add_all([active, inactive])
    db_session.flush()

    service = PublicService(db_session)
    result = service.get_public_site(unique_slug)

    assert result.company.slug == unique_slug
    assert result.careers_page is not None
    assert result.careers_page.published_config == {
        "theme": {"primaryColor": "#000000"}
    }
    assert "draft_config" not in result.careers_page.model_dump()
    assert len(result.jobs) == 1
    assert result.jobs[0].title == "Open"


def test_inactive_company_raises_not_found(db_session, unique_slug: str) -> None:
    company = Company(name="Acme", slug=unique_slug, is_active=False)
    db_session.add(company)
    db_session.flush()

    service = PublicService(db_session)
    with pytest.raises(NotFoundError):
        service.get_public_site(unique_slug)


def test_get_public_job_requires_active_job(db_session, unique_slug: str) -> None:
    company = Company(name="Acme", slug=unique_slug, is_active=True)
    db_session.add(company)
    db_session.flush()

    job = Job(
        company_id=company.id,
        title="Closed",
        department="Eng",
        location="Remote",
        employment_type="full_time",
        work_policy="remote",
        experience_level="senior",
        job_type="permanent",
        description="Desc",
        is_active=False,
    )
    db_session.add(job)
    db_session.flush()

    service = PublicService(db_session)
    with pytest.raises(NotFoundError):
        service.get_public_job(unique_slug, job.id)

    with pytest.raises(NotFoundError):
        service.get_public_job(unique_slug, uuid4())
