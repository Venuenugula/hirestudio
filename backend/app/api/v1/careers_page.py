from fastapi import APIRouter

from app.dependencies.auth import CurrentCompanyIdDep, CurrentUserDep
from app.dependencies.careers_page import CareersPageServiceDep
from app.schemas.careers_page import (
    CareersPageResponse,
    CareersPageUpdate,
    PublishResponse,
)

router = APIRouter(prefix="/careers-page", tags=["careers-page"])


@router.get("/me", response_model=CareersPageResponse)
def get_my_careers_page(
    company_id: CurrentCompanyIdDep,
    service: CareersPageServiceDep,
    _user: CurrentUserDep,
) -> CareersPageResponse:
    return service.get_by_company_id(company_id)


@router.patch("/me/draft", response_model=CareersPageResponse)
def update_my_careers_page_draft(
    payload: CareersPageUpdate,
    company_id: CurrentCompanyIdDep,
    service: CareersPageServiceDep,
    _user: CurrentUserDep,
) -> CareersPageResponse:
    return service.update_draft(company_id, payload)


@router.post("/me/publish", response_model=PublishResponse)
def publish_my_careers_page(
    company_id: CurrentCompanyIdDep,
    service: CareersPageServiceDep,
    _user: CurrentUserDep,
) -> PublishResponse:
    return service.publish(company_id)
