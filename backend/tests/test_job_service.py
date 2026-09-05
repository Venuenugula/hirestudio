from datetime import UTC, datetime
from uuid import uuid4

import pytest

from app.core.exceptions import NotFoundError
from app.schemas.job import JobCreate, JobUpdate
from app.services.job_service import JobService


def _create(**overrides) -> JobCreate:
    data = {
        "title": "Frontend Engineer",
        "department": "Engineering",
        "location": "Berlin",
        "employment_type": "full_time",
        "work_policy": "hybrid",
        "experience_level": "senior",
        "job_type": "permanent",
        "salary_range": "EUR 70K–90K / year",
        "description": "Build UI",
    }
    data.update(overrides)
    return JobCreate(**data)


def test_create_list_and_filter_jobs(db_session, company) -> None:
    service = JobService(db_session)
    service.create_job(company.id, _create())
    service.create_job(
        company.id,
        _create(
            title="People Partner",
            department="People",
            employment_type="part_time",
            work_policy="on_site",
            experience_level="junior",
            job_type="temporary",
            is_active=False,
        ),
    )

    all_jobs = service.list_jobs(company.id)
    assert all_jobs.total == 2
    assert all_jobs.items[0].posted_at is not None

    filtered = service.list_jobs(
        company.id,
        department="People",
        work_policy="on_site",
        is_active=False,
    )
    assert filtered.total == 1
    assert filtered.items[0].title == "People Partner"
    assert filtered.items[0].job_type == "temporary"


def test_update_and_delete_job(db_session, company) -> None:
    service = JobService(db_session)
    created = service.create_job(
        company.id,
        _create(title="Designer", department="Design", employment_type="contract"),
    )

    updated = service.update_job(
        created.id,
        JobUpdate(title="Product Designer", is_active=False, experience_level="mid_level"),
    )
    assert updated.title == "Product Designer"
    assert updated.is_active is False
    assert updated.experience_level == "mid_level"

    service.delete_job(created.id)
    with pytest.raises(NotFoundError):
        service.get_job(created.id)


def test_create_for_missing_company_raises(db_session) -> None:
    service = JobService(db_session)
    with pytest.raises(NotFoundError):
        service.create_job(uuid4(), _create(title="Ghost"))


def test_create_respects_posted_at(db_session, company) -> None:
    service = JobService(db_session)
    posted = datetime(2026, 8, 10, 12, 30, tzinfo=UTC)
    created = service.create_job(company.id, _create(posted_at=posted))
    assert created.posted_at == posted
