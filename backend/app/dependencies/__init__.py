"""FastAPI dependency providers."""

from app.dependencies.careers_page import CareersPageServiceDep, get_careers_page_service
from app.dependencies.company import CompanyServiceDep, get_company_service
from app.dependencies.database import DbSession
from app.dependencies.jobs import JobServiceDep, get_job_service

__all__ = [
    "CareersPageServiceDep",
    "CompanyServiceDep",
    "DbSession",
    "JobServiceDep",
    "get_careers_page_service",
    "get_company_service",
    "get_job_service",
]
