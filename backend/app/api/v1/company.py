from typing import Annotated, Literal

from fastapi import APIRouter, Depends, File, Form, UploadFile

from app.dependencies.auth import CurrentCompanyIdDep, CurrentUserDep
from app.dependencies.company import CompanyServiceDep
from app.schemas.company import (
    CompanyMediaUploadResponse,
    CompanyResponse,
    CompanyUpdate,
)
from app.services.media_service import MediaService

router = APIRouter(prefix="/company", tags=["company"])


def get_media_service() -> MediaService:
    return MediaService()


MediaServiceDep = Annotated[MediaService, Depends(get_media_service)]


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


@router.post("/me/media", response_model=CompanyMediaUploadResponse)
async def upload_company_media(
    company_id: CurrentCompanyIdDep,
    media_service: MediaServiceDep,
    _user: CurrentUserDep,
    kind: Annotated[Literal["logo", "banner"], Form()],
    file: Annotated[UploadFile, File()],
) -> CompanyMediaUploadResponse:
    url = media_service.save_company_image(
        company_id=company_id,
        kind=kind,
        upload=file,
    )
    return CompanyMediaUploadResponse(url=url, kind=kind)
