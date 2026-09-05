from typing import Annotated

from fastapi import Depends

from app.dependencies.database import DbSession
from app.repositories.careers_page_repository import CareersPageRepository
from app.repositories.company_repository import CompanyRepository
from app.repositories.job_repository import JobRepository
from app.services.public_service import PublicService


def get_company_repository_for_public(db: DbSession) -> CompanyRepository:
    return CompanyRepository(db)


def get_careers_page_repository_for_public(
    db: DbSession,
) -> CareersPageRepository:
    return CareersPageRepository(db)


def get_job_repository_for_public(db: DbSession) -> JobRepository:
    return JobRepository(db)


def get_public_service(
    db: DbSession,
    company_repository: Annotated[
        CompanyRepository,
        Depends(get_company_repository_for_public),
    ],
    careers_page_repository: Annotated[
        CareersPageRepository,
        Depends(get_careers_page_repository_for_public),
    ],
    job_repository: Annotated[
        JobRepository,
        Depends(get_job_repository_for_public),
    ],
) -> PublicService:
    return PublicService(
        db=db,
        company_repository=company_repository,
        careers_page_repository=careers_page_repository,
        job_repository=job_repository,
    )


PublicServiceDep = Annotated[PublicService, Depends(get_public_service)]
