from dataclasses import dataclass
from uuid import UUID

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models.job import Job


@dataclass(frozen=True)
class JobFilters:
    title: str | None = None
    department: str | None = None
    location: str | None = None
    employment_type: str | None = None
    work_policy: str | None = None
    experience_level: str | None = None
    job_type: str | None = None
    is_active: bool | None = None


class JobRepository:
    """Database access for Job. No business rules live here."""

    def __init__(self, db: Session) -> None:
        self._db = db

    def create_job(self, job: Job) -> Job:
        self._db.add(job)
        self._db.flush()
        self._db.refresh(job)
        return job

    def get_by_id(self, job_id: UUID) -> Job | None:
        return self._db.get(Job, job_id)

    def list_by_company(
        self,
        company_id: UUID,
        filters: JobFilters | None = None,
    ) -> list[Job]:
        statement = select(Job).where(Job.company_id == company_id)
        statement = self._apply_filters(statement, filters)
        statement = statement.order_by(Job.posted_at.desc(), Job.created_at.desc())
        return list(self._db.scalars(statement).all())

    def count_by_company(
        self,
        company_id: UUID,
        filters: JobFilters | None = None,
    ) -> int:
        statement = select(func.count()).select_from(Job).where(
            Job.company_id == company_id
        )
        statement = self._apply_filters(statement, filters)
        return int(self._db.scalar(statement) or 0)

    def delete_all_for_company(self, company_id: UUID) -> int:
        jobs = self.list_by_company(company_id)
        count = len(jobs)
        for job in jobs:
            self._db.delete(job)
        self._db.flush()
        return count

    def update_job(self, job: Job) -> Job:
        self._db.add(job)
        self._db.flush()
        self._db.refresh(job)
        return job

    def delete_job(self, job: Job) -> None:
        self._db.delete(job)
        self._db.flush()

    def _apply_filters(self, statement, filters: JobFilters | None):
        if filters is None:
            return statement

        if filters.title:
            statement = statement.where(Job.title.ilike(f"%{filters.title.strip()}%"))
        if filters.department:
            statement = statement.where(
                Job.department.ilike(f"%{filters.department.strip()}%")
            )
        if filters.location:
            statement = statement.where(
                Job.location.ilike(f"%{filters.location.strip()}%")
            )
        if filters.employment_type:
            statement = statement.where(
                Job.employment_type == filters.employment_type.strip()
            )
        if filters.work_policy:
            statement = statement.where(Job.work_policy == filters.work_policy.strip())
        if filters.experience_level:
            statement = statement.where(
                Job.experience_level == filters.experience_level.strip()
            )
        if filters.job_type:
            statement = statement.where(Job.job_type == filters.job_type.strip())
        if filters.is_active is not None:
            statement = statement.where(Job.is_active.is_(filters.is_active))

        return statement
