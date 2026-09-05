from uuid import UUID

from fastapi import APIRouter

from app.dependencies.public import PublicServiceDep
from app.schemas.public import PublicJobDetailResponse, PublicSiteResponse

router = APIRouter(prefix="/public", tags=["public"])


@router.get("/{slug}", response_model=PublicSiteResponse)
def get_public_site(slug: str, service: PublicServiceDep) -> PublicSiteResponse:
    return service.get_public_site(slug)


@router.get("/{slug}/jobs/{job_id}", response_model=PublicJobDetailResponse)
def get_public_job(
    slug: str,
    job_id: UUID,
    service: PublicServiceDep,
) -> PublicJobDetailResponse:
    return service.get_public_job(slug, job_id)
