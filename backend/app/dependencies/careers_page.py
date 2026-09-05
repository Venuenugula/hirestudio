from typing import Annotated

from fastapi import Depends

from app.dependencies.database import DbSession
from app.repositories.careers_page_repository import CareersPageRepository
from app.repositories.company_repository import CompanyRepository
from app.services.careers_page_service import CareersPageService


def get_careers_page_repository(db: DbSession) -> CareersPageRepository:
    return CareersPageRepository(db)


def get_company_repository_for_careers(db: DbSession) -> CompanyRepository:
    return CompanyRepository(db)


def get_careers_page_service(
    db: DbSession,
    repository: Annotated[
        CareersPageRepository,
        Depends(get_careers_page_repository),
    ],
    company_repository: Annotated[
        CompanyRepository,
        Depends(get_company_repository_for_careers),
    ],
) -> CareersPageService:
    return CareersPageService(
        db=db,
        repository=repository,
        company_repository=company_repository,
    )


CareersPageServiceDep = Annotated[
    CareersPageService,
    Depends(get_careers_page_service),
]
