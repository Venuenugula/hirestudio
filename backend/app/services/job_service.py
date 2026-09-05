from datetime import UTC, datetime
from uuid import UUID

from sqlalchemy.orm import Session

from app.core.exceptions import NotFoundError
from app.models.job import Job
from app.repositories.company_repository import CompanyRepository
from app.repositories.job_repository import JobFilters, JobRepository
from app.schemas.job import JobCreate, JobListResponse, JobResponse, JobUpdate


class JobService:
    """Job business rules and orchestration."""

    def __init__(
        self,
        db: Session,
        repository: JobRepository | None = None,
        company_repository: CompanyRepository | None = None,
    ) -> None:
        self._db = db
        self._repository = repository or JobRepository(db)
        self._company_repository = company_repository or CompanyRepository(db)

    def list_jobs(
        self,
        company_id: UUID,
        *,
        title: str | None = None,
        department: str | None = None,
        location: str | None = None,
        employment_type: str | None = None,
        work_policy: str | None = None,
        experience_level: str | None = None,
        job_type: str | None = None,
        is_active: bool | None = None,
    ) -> JobListResponse:
        self._require_company(company_id)
        filters = JobFilters(
            title=title,
            department=department,
            location=location,
            employment_type=employment_type,
            work_policy=work_policy,
            experience_level=experience_level,
            job_type=job_type,
            is_active=is_active,
        )
        jobs = self._repository.list_by_company(company_id, filters)
        return JobListResponse(
            items=[JobResponse.model_validate(job) for job in jobs],
            total=len(jobs),
        )

    def get_job(self, job_id: UUID) -> JobResponse:
        job = self._get_job_or_raise(job_id)
        return JobResponse.model_validate(job)

    def create_job(self, company_id: UUID, payload: JobCreate) -> JobResponse:
        self._require_company(company_id)
        salary = payload.salary_range.strip() if payload.salary_range else None
        job = Job(
            company_id=company_id,
            title=payload.title.strip(),
            department=payload.department.strip(),
            location=payload.location.strip(),
            employment_type=payload.employment_type,
            work_policy=payload.work_policy,
            experience_level=payload.experience_level,
            job_type=payload.job_type,
            salary_range=salary or None,
            description=payload.description.strip(),
            is_active=payload.is_active,
            application_url=payload.application_url,
            posted_at=payload.posted_at or datetime.now(UTC),
        )
        created = self._repository.create_job(job)
        self._db.commit()
        self._db.refresh(created)
        return JobResponse.model_validate(created)

    def update_job(self, job_id: UUID, payload: JobUpdate) -> JobResponse:
        job = self._get_job_or_raise(job_id)
        updates = payload.model_dump(exclude_unset=True)

        for field in (
            "title",
            "department",
            "location",
            "description",
            "salary_range",
        ):
            if field in updates and isinstance(updates[field], str):
                updates[field] = updates[field].strip() or (
                    None if field == "salary_range" else updates[field].strip()
                )

        if "salary_range" in updates and updates["salary_range"] == "":
            updates["salary_range"] = None

        for field, value in updates.items():
            setattr(job, field, value)

        updated = self._repository.update_job(job)
        self._db.commit()
        self._db.refresh(updated)
        return JobResponse.model_validate(updated)

    def delete_job(self, job_id: UUID) -> None:
        job = self._get_job_or_raise(job_id)
        self._repository.delete_job(job)
        self._db.commit()

    def _require_company(self, company_id: UUID) -> None:
        if self._company_repository.get_by_id(company_id) is None:
            raise NotFoundError(f"Company '{company_id}' was not found")

    def _get_job_or_raise(self, job_id: UUID) -> Job:
        job = self._repository.get_by_id(job_id)
        if job is None:
            raise NotFoundError(f"Job '{job_id}' was not found")
        return job
