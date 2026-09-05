from uuid import UUID

from fastapi import APIRouter

from app.dependencies.careers_page import CareersPageServiceDep
from app.schemas.careers_page import (
    CareersPageResponse,
    CareersPageUpdate,
    PublishResponse,
)

router = APIRouter(prefix="/careers-page", tags=["careers-page"])


@router.get("/company/{company_id}", response_model=CareersPageResponse)
def get_careers_page(
    company_id: UUID,
    service: CareersPageServiceDep,
) -> CareersPageResponse:
    return service.get_by_company_id(company_id)


@router.patch("/company/{company_id}/draft", response_model=CareersPageResponse)
def update_careers_page_draft(
    company_id: UUID,
    payload: CareersPageUpdate,
    service: CareersPageServiceDep,
) -> CareersPageResponse:
    return service.update_draft(company_id, payload)


@router.post("/company/{company_id}/publish", response_model=PublishResponse)
def publish_careers_page(
    company_id: UUID,
    service: CareersPageServiceDep,
) -> PublishResponse:
    return service.publish(company_id)
