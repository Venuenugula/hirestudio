from datetime import UTC
from uuid import uuid4

import pytest

from app.core.exceptions import NotFoundError
from app.schemas.careers_page import CareersPageUpdate
from app.services.careers_page_service import CareersPageService


def test_get_creates_blank_page_when_missing(db_session, company) -> None:
    service = CareersPageService(db_session)

    page = service.get_by_company_id(company.id)

    assert page.company_id == company.id
    assert page.draft_config == {}
    assert page.published_config == {}
    assert page.published_at is None


def test_get_missing_company_raises_not_found(db_session) -> None:
    service = CareersPageService(db_session)

    with pytest.raises(NotFoundError):
        service.get_by_company_id(uuid4())


def test_update_draft_only_changes_draft(db_session, company) -> None:
    service = CareersPageService(db_session)
    draft = {"sections": [{"type": "about", "body": "We build products"}]}

    updated = service.update_draft(
        company.id,
        CareersPageUpdate(draft_config=draft),
    )

    assert updated.draft_config == draft
    assert updated.published_config == {}
    assert updated.published_at is None


def test_publish_copies_draft_and_sets_timestamp(db_session, company) -> None:
    service = CareersPageService(db_session)
    draft = {"hero": {"headline": "Careers"}}
    service.update_draft(company.id, CareersPageUpdate(draft_config=draft))

    published = service.publish(company.id)

    assert published.published_config == draft
    assert published.draft_config == draft
    assert published.published_at is not None
    assert published.published_at.tzinfo is not None
    assert published.published_at.utcoffset() == UTC.utcoffset(None)


def test_publish_is_idempotent_with_new_timestamp(db_session, company) -> None:
    service = CareersPageService(db_session)
    service.update_draft(
        company.id,
        CareersPageUpdate(draft_config={"v": 1}),
    )
    first = service.publish(company.id)

    service.update_draft(
        company.id,
        CareersPageUpdate(draft_config={"v": 2}),
    )
    second = service.publish(company.id)

    assert second.published_config == {"v": 2}
    assert second.published_at >= first.published_at
