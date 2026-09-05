import pytest

from app.core.exceptions import NotFoundError
from app.schemas.job import JobCreate, JobUpdate
from app.services.job_service import JobService
from uuid import uuid4


def test_create_list_and_filter_jobs(db_session, company) -> None:
    service = JobService(db_session)
    service.create_job(
        company.id,
        JobCreate(
            title="Frontend Engineer",
            department="Engineering",
            location="Berlin",
            employment_type="full_time",
            description="Build UI",
        ),
    )
    service.create_job(
        company.id,
        JobCreate(
            title="People Partner",
            department="People",
            location="Berlin",
            employment_type="part_time",
            description="Support teams",
            is_active=False,
        ),
    )

    all_jobs = service.list_jobs(company.id)
    assert all_jobs.total == 2

    filtered = service.list_jobs(company.id, department="People", is_active=False)
    assert filtered.total == 1
    assert filtered.items[0].title == "People Partner"


def test_update_and_delete_job(db_session, company) -> None:
    service = JobService(db_session)
    created = service.create_job(
        company.id,
        JobCreate(
            title="Designer",
            department="Design",
            location="Remote",
            employment_type="contract",
            description="Craft interfaces",
        ),
    )

    updated = service.update_job(
        created.id,
        JobUpdate(title="Product Designer", is_active=False),
    )
    assert updated.title == "Product Designer"
    assert updated.is_active is False

    service.delete_job(created.id)
    with pytest.raises(NotFoundError):
        service.get_job(created.id)


def test_create_for_missing_company_raises(db_session) -> None:
    service = JobService(db_session)
    with pytest.raises(NotFoundError):
        service.create_job(
            uuid4(),
            JobCreate(
                title="Ghost",
                department="None",
                location="Nowhere",
                employment_type="full_time",
                description="Nope",
            ),
        )
