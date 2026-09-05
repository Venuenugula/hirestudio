from app.models.job import Job
from app.repositories.job_repository import JobFilters, JobRepository


def _job(company_id, **overrides) -> Job:
    data = {
        "company_id": company_id,
        "title": "Backend Engineer",
        "department": "Engineering",
        "location": "Remote",
        "employment_type": "full_time",
        "work_policy": "remote",
        "experience_level": "mid_level",
        "job_type": "permanent",
        "description": "Build APIs",
    }
    data.update(overrides)
    return Job(**data)


def test_create_and_get_job(db_session, company) -> None:
    repo = JobRepository(db_session)
    created = repo.create_job(_job(company.id))

    found = repo.get_by_id(created.id)
    assert found is not None
    assert found.title == "Backend Engineer"
    assert found.work_policy == "remote"
    assert found.posted_at is not None


def test_list_filters(db_session, company) -> None:
    repo = JobRepository(db_session)
    repo.create_job(_job(company.id, is_active=True))
    repo.create_job(
        _job(
            company.id,
            title="Sales Lead",
            department="Sales",
            location="New York",
            work_policy="on_site",
            experience_level="senior",
            job_type="temporary",
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

    on_site = repo.list_by_company(company.id, JobFilters(work_policy="on_site"))
    assert len(on_site) == 1


def test_delete_job(db_session, company) -> None:
    repo = JobRepository(db_session)
    job = repo.create_job(
        _job(
            company.id,
            title="Temp Role",
            department="Ops",
            employment_type="contract",
            job_type="temporary",
            description="Temporary",
        )
    )
    repo.delete_job(job)
    assert repo.get_by_id(job.id) is None
