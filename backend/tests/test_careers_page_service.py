from datetime import UTC
from uuid import uuid4

import pytest

from app.core.exceptions import NotFoundError
from app.page_templates import DEFAULT_TEMPLATE_ID
from app.schemas.careers_page import CareersPageUpdate
from app.services.careers_page_service import CareersPageService


def _assert_starter_config(draft_config: dict, company_name: str) -> None:
    assert draft_config["template"]["id"] == DEFAULT_TEMPLATE_ID
    assert draft_config["template"]["version"] == 1
    assert draft_config["theme"]["primaryColor"]
    assert draft_config["theme"]["secondaryColor"]
    types = [section["type"] for section in draft_config["sections"]]
    assert types == ["hero", "about", "benefits", "open_roles", "cta"]
    assert company_name in draft_config["sections"][0]["title"]
    benefits = draft_config["sections"][2]
    assert len(benefits["items"]) >= 4


def test_get_creates_starter_page_when_missing(db_session, company) -> None:
    service = CareersPageService(db_session)

    page = service.get_by_company_id(company.id)

    assert page.company_id == company.id
    _assert_starter_config(page.draft_config, company.name)
    assert page.published_config == {}
    assert page.published_at is None


def test_get_backfills_uninitialized_empty_page(db_session, company) -> None:
    service = CareersPageService(db_session)
    # Simulate legacy blank page created before starter templates.
    from app.repositories.careers_page_repository import CareersPageRepository

    CareersPageRepository(db_session).create(company.id, draft_config={})
    db_session.commit()

    page = service.get_by_company_id(company.id)

    _assert_starter_config(page.draft_config, company.name)
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
