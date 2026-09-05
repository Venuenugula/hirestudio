from datetime import datetime
from typing import Any
from uuid import UUID

from pydantic import BaseModel, ConfigDict

from app.schemas.company import CompanyResponse
from app.schemas.job import JobResponse


class PublicCareersPageResponse(BaseModel):
    """Candidate-facing careers page. Never includes draft_config."""

    model_config = ConfigDict(from_attributes=True)

    id: UUID
    company_id: UUID
    published_config: dict[str, Any]
    published_at: datetime | None


class PublicSiteResponse(BaseModel):
    company: CompanyResponse
    careers_page: PublicCareersPageResponse | None
    jobs: list[JobResponse]


class PublicJobDetailResponse(BaseModel):
    company: CompanyResponse
    job: JobResponse
