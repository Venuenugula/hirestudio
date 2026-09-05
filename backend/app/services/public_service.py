from uuid import UUID

from sqlalchemy.orm import Session

from app.core.exceptions import NotFoundError
from app.repositories.careers_page_repository import CareersPageRepository
from app.repositories.company_repository import CompanyRepository
from app.repositories.job_repository import JobFilters, JobRepository
from app.schemas.company import CompanyResponse
from app.schemas.job import JobResponse
from app.schemas.public import (
    PublicCareersPageResponse,
    PublicJobDetailResponse,
    PublicSiteResponse,
)
from app.utils.slug import normalize_slug


class PublicService:
    """Read-only candidate-facing careers site orchestration."""

    def __init__(
        self,
        db: Session,
        company_repository: CompanyRepository | None = None,
        careers_page_repository: CareersPageRepository | None = None,
        job_repository: JobRepository | None = None,
    ) -> None:
        self._db = db
        self._company_repository = company_repository or CompanyRepository(db)
        self._careers_page_repository = (
            careers_page_repository or CareersPageRepository(db)
        )
        self._job_repository = job_repository or JobRepository(db)

    def get_public_site(self, slug: str) -> PublicSiteResponse:
        company = self._require_active_company_by_slug(slug)
        page = self._careers_page_repository.get_by_company_id(company.id)
        jobs = self._job_repository.list_by_company(
            company.id,
            JobFilters(is_active=True),
        )

        careers_page = None
        if page is not None:
            careers_page = PublicCareersPageResponse(
                id=page.id,
                company_id=page.company_id,
                published_config=dict(page.published_config or {}),
                published_at=page.published_at,
            )

        return PublicSiteResponse(
            company=CompanyResponse.model_validate(company),
            careers_page=careers_page,
            jobs=[JobResponse.model_validate(job) for job in jobs],
        )

    def get_public_job(self, slug: str, job_id: UUID) -> PublicJobDetailResponse:
        company = self._require_active_company_by_slug(slug)
        job = self._job_repository.get_by_id(job_id)

        if (
            job is None
            or job.company_id != company.id
            or not job.is_active
        ):
            raise NotFoundError(f"Job '{job_id}' was not found")

        return PublicJobDetailResponse(
            company=CompanyResponse.model_validate(company),
            job=JobResponse.model_validate(job),
        )

    def _require_active_company_by_slug(self, slug: str):
        normalized = normalize_slug(slug)
        if not normalized:
            raise NotFoundError(f"Company with slug '{slug}' was not found")

        company = self._company_repository.get_by_slug(normalized)
        if company is None or not company.is_active:
            raise NotFoundError(f"Company with slug '{normalized}' was not found")

        return company
