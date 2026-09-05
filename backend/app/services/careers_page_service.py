from datetime import UTC, datetime
from typing import Any
from uuid import UUID

from sqlalchemy.orm import Session

from app.core.exceptions import DomainValidationError, NotFoundError
from app.models.company import Company
from app.page_templates import PageTemplateContext, render_page_config
from app.repositories.careers_page_repository import CareersPageRepository
from app.repositories.company_repository import CompanyRepository
from app.schemas.careers_page import (
    CareersPageResponse,
    CareersPageUpdate,
    PublishResponse,
)


class CareersPageService:
    """Careers page business rules and orchestration."""

    def __init__(
        self,
        db: Session,
        repository: CareersPageRepository | None = None,
        company_repository: CompanyRepository | None = None,
    ) -> None:
        self._db = db
        self._repository = repository or CareersPageRepository(db)
        self._company_repository = company_repository or CompanyRepository(db)

    def get_by_company_id(self, company_id: UUID) -> CareersPageResponse:
        company = self._require_company(company_id)
        page = self.ensure_page_for_company(company)
        self._db.commit()
        self._db.refresh(page)
        return CareersPageResponse.model_validate(page)

    def ensure_page_for_company(self, company: Company):
        """Create or backfill an uninitialized careers page with the starter template.

        Does not commit — callers own the transaction boundary.
        """
        page = self._repository.get_by_company_id(company.id)
        starter = render_page_config(PageTemplateContext.from_company(company))

        if page is None:
            return self._repository.create(company.id, draft_config=starter)

        if self._is_uninitialized(page):
            return self._repository.update_draft(page, starter)

        return page

    def update_draft(
        self,
        company_id: UUID,
        payload: CareersPageUpdate,
    ) -> CareersPageResponse:
        company = self._require_company(company_id)
        draft_config = self._require_config_object(payload.draft_config)

        page = self.ensure_page_for_company(company)
        updated = self._repository.update_draft(page, draft_config)
        self._db.commit()
        self._db.refresh(updated)
        return CareersPageResponse.model_validate(updated)

    def publish(self, company_id: UUID) -> PublishResponse:
        company = self._require_company(company_id)
        page = self.ensure_page_for_company(company)

        published_at = datetime.now(UTC)
        published = self._repository.publish(page, published_at)
        self._db.commit()
        self._db.refresh(published)

        if published.published_at is None:
            raise DomainValidationError("Publish did not set published_at")

        return PublishResponse.model_validate(published)

    def _require_company(self, company_id: UUID) -> Company:
        company = self._company_repository.get_by_id(company_id)
        if company is None:
            raise NotFoundError(f"Company '{company_id}' was not found")
        return company

    def _require_config_object(self, value: Any) -> dict[str, Any]:
        if not isinstance(value, dict):
            raise DomainValidationError("draft_config must be a JSON object")
        return value

    @staticmethod
    def _is_uninitialized(page) -> bool:
        """True when the page row exists but was never customized or published."""
        if page.published_at is not None:
            return False
        draft = page.draft_config or {}
        published = page.published_config or {}
        return draft == {} and published == {}
