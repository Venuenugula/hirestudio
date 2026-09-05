from uuid import UUID

from fastapi import APIRouter, status

from app.dependencies.company import CompanyServiceDep
from app.schemas.company import CompanyCreate, CompanyResponse, CompanyUpdate

router = APIRouter(prefix="/company", tags=["company"])


@router.post(
    "/",
    response_model=CompanyResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_company(
    payload: CompanyCreate,
    service: CompanyServiceDep,
) -> CompanyResponse:
    return service.create_company(payload)


@router.get("/slug/{slug}", response_model=CompanyResponse)
def get_company_by_slug(
    slug: str,
    service: CompanyServiceDep,
) -> CompanyResponse:
    return service.get_company_by_slug(slug)


@router.get("/{company_id}", response_model=CompanyResponse)
def get_company(
    company_id: UUID,
    service: CompanyServiceDep,
) -> CompanyResponse:
    return service.get_company(company_id)


@router.patch("/{company_id}", response_model=CompanyResponse)
def update_company(
    company_id: UUID,
    payload: CompanyUpdate,
    service: CompanyServiceDep,
) -> CompanyResponse:
    return service.update_company(company_id, payload)
