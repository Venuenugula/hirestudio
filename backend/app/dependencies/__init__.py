"""FastAPI dependency providers."""

from app.dependencies.company import CompanyServiceDep, get_company_service
from app.dependencies.database import DbSession

__all__ = [
    "CompanyServiceDep",
    "DbSession",
    "get_company_service",
]
