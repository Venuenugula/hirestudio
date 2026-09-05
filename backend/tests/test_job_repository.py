from app.models.job import Job
from app.repositories.job_repository import JobFilters, JobRepository


def test_create_and_get_job(db_session, company) -> None:
    repo = JobRepository(db_session)
    job = Job(
        company_id=company.id,
        title="Backend Engineer",
        department="Engineering",
        location="Remote",
        employment_type="full_time",
        description="Build APIs",
    )
    created = repo.create_job(job)

    found = repo.get_by_id(created.id)
    assert found is not None
    assert found.title == "Backend Engineer"


def test_list_filters(db_session, company) -> None:
    repo = JobRepository(db_session)
    repo.create_job(
        Job(
            company_id=company.id,
            title="Backend Engineer",
            department="Engineering",
            location="Remote",
            employment_type="full_time",
            description="API work",
            is_active=True,
        )
    )
    repo.create_job(
        Job(
            company_id=company.id,
            title="Sales Lead",
            department="Sales",
            location="New York",
            employment_type="full_time",
            description="Grow revenue",
            is_active=False,
        )
    )

    engineering = repo.list_by_company(
        company.id,
        JobFilters(department="Eng"),
    )
    assert len(engineering) == 1
    assert engineering[0].title == "Backend Engineer"

    active = repo.list_by_company(company.id, JobFilters(is_active=True))
    assert len(active) == 1

    titled = repo.list_by_company(company.id, JobFilters(title="sales"))
    assert len(titled) == 1


def test_delete_job(db_session, company) -> None:
    repo = JobRepository(db_session)
    job = repo.create_job(
        Job(
            company_id=company.id,
            title="Temp Role",
            department="Ops",
            location="Remote",
            employment_type="contract",
            description="Temporary",
        )
    )
    repo.delete_job(job)
    assert repo.get_by_id(job.id) is None
