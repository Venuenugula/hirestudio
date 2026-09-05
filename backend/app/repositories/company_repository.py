from uuid import UUID

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.company import Company


class CompanyRepository:
    """Database access for Company. No business rules live here."""

    def __init__(self, db: Session) -> None:
        self._db = db

    def create_company(self, company: Company) -> Company:
        self._db.add(company)
        self._db.flush()
        self._db.refresh(company)
        return company

    def get_by_id(self, company_id: UUID) -> Company | None:
        return self._db.get(Company, company_id)

    def get_by_slug(self, slug: str) -> Company | None:
        statement = select(Company).where(Company.slug == slug)
        return self._db.scalars(statement).first()

    def update_company(self, company: Company) -> Company:
        self._db.add(company)
        self._db.flush()
        self._db.refresh(company)
        return company

    def exists_by_slug(self, slug: str, *, exclude_id: UUID | None = None) -> bool:
        statement = select(Company.id).where(Company.slug == slug)
        if exclude_id is not None:
            statement = statement.where(Company.id != exclude_id)
        return self._db.scalars(statement).first() is not None
