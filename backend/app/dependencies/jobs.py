from typing import Annotated

from fastapi import Depends

from app.dependencies.database import DbSession
from app.repositories.company_repository import CompanyRepository
from app.repositories.job_repository import JobRepository
from app.services.job_service import JobService


def get_job_repository(db: DbSession) -> JobRepository:
    return JobRepository(db)


def get_company_repository_for_jobs(db: DbSession) -> CompanyRepository:
    return CompanyRepository(db)


def get_job_service(
    db: DbSession,
    repository: Annotated[JobRepository, Depends(get_job_repository)],
    company_repository: Annotated[
        CompanyRepository,
        Depends(get_company_repository_for_jobs),
    ],
) -> JobService:
    return JobService(
        db=db,
        repository=repository,
        company_repository=company_repository,
    )


JobServiceDep = Annotated[JobService, Depends(get_job_service)]
