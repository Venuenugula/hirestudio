from typing import Annotated

from fastapi import Depends

from app.dependencies.database import DbSession
from app.repositories.company_repository import CompanyRepository
from app.services.company_service import CompanyService


def get_company_repository(db: DbSession) -> CompanyRepository:
    return CompanyRepository(db)


def get_company_service(
    db: DbSession,
    repository: Annotated[CompanyRepository, Depends(get_company_repository)],
) -> CompanyService:
    return CompanyService(db=db, repository=repository)


CompanyServiceDep = Annotated[CompanyService, Depends(get_company_service)]
