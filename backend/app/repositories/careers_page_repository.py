from copy import deepcopy
from datetime import datetime
from typing import Any
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.orm import Session
from sqlalchemy.orm.attributes import flag_modified

from app.models.careers_page import CareersPage


class CareersPageRepository:
    """Database access for CareersPage. No business rules live here."""

    def __init__(self, db: Session) -> None:
        self._db = db

    def get_by_company_id(self, company_id: UUID) -> CareersPage | None:
        statement = select(CareersPage).where(CareersPage.company_id == company_id)
        return self._db.scalars(statement).first()

    def create(
        self,
        company_id: UUID,
        *,
        draft_config: dict[str, Any] | None = None,
        published_config: dict[str, Any] | None = None,
    ) -> CareersPage:
        page = CareersPage(
            company_id=company_id,
            draft_config=deepcopy(draft_config) if draft_config is not None else {},
            published_config=(
                deepcopy(published_config) if published_config is not None else {}
            ),
            published_at=None,
        )
        self._db.add(page)
        self._db.flush()
        self._db.refresh(page)
        return page

    def create_if_missing(
        self,
        company_id: UUID,
        *,
        draft_config: dict[str, Any] | None = None,
    ) -> CareersPage:
        existing = self.get_by_company_id(company_id)
        if existing is not None:
            return existing
        return self.create(company_id, draft_config=draft_config)

    def update_draft(
        self,
        page: CareersPage,
        draft_config: dict,
    ) -> CareersPage:
        page.draft_config = deepcopy(draft_config)
        flag_modified(page, "draft_config")
        self._db.add(page)
        self._db.flush()
        self._db.refresh(page)
        return page

    def publish(self, page: CareersPage, published_at: datetime) -> CareersPage:
        page.published_config = deepcopy(page.draft_config)
        page.published_at = published_at
        flag_modified(page, "published_config")
        self._db.add(page)
        self._db.flush()
        self._db.refresh(page)
        return page
