from fastapi import APIRouter

from app.dependencies.auth import CurrentCompanyIdDep, CurrentUserDep
from app.dependencies.company import CompanyServiceDep
from app.schemas.company import CompanyResponse, CompanyUpdate

router = APIRouter(prefix="/company", tags=["company"])


@router.get("/me", response_model=CompanyResponse)
def get_my_company(
    company_id: CurrentCompanyIdDep,
    service: CompanyServiceDep,
    _user: CurrentUserDep,
) -> CompanyResponse:
    return service.get_company(company_id)


@router.patch("/me", response_model=CompanyResponse)
def update_my_company(
    payload: CompanyUpdate,
    company_id: CurrentCompanyIdDep,
    service: CompanyServiceDep,
    _user: CurrentUserDep,
) -> CompanyResponse:
    return service.update_company(company_id, payload)
