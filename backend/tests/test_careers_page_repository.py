from app.models.careers_page import CareersPage
from app.repositories.careers_page_repository import CareersPageRepository
from datetime import UTC, datetime


def test_create_if_missing_creates_blank_page(db_session, company) -> None:
    repo = CareersPageRepository(db_session)

    page = repo.create_if_missing(company.id)

    assert page.company_id == company.id
    assert page.draft_config == {}
    assert page.published_config == {}
    assert page.published_at is None


def test_create_with_draft_config(db_session, company) -> None:
    repo = CareersPageRepository(db_session)
    draft = {"sections": [{"type": "hero", "title": "Hello"}]}

    page = repo.create(company.id, draft_config=draft)

    assert page.draft_config == draft
    assert page.published_config == {}


def test_create_if_missing_returns_existing(db_session, company) -> None:
    repo = CareersPageRepository(db_session)
    first = repo.create_if_missing(company.id)
    second = repo.create_if_missing(company.id)

    assert first.id == second.id


def test_get_by_company_id(db_session, company) -> None:
    repo = CareersPageRepository(db_session)
    assert repo.get_by_company_id(company.id) is None

    created = repo.create_if_missing(company.id)
    found = repo.get_by_company_id(company.id)

    assert found is not None
    assert found.id == created.id


def test_update_draft(db_session, company) -> None:
    repo = CareersPageRepository(db_session)
    page = repo.create_if_missing(company.id)
    draft = {"sections": [{"type": "hero", "title": "Join us"}]}

    updated = repo.update_draft(page, draft)

    assert updated.draft_config == draft
    assert updated.published_config == {}


def test_publish_copies_draft(db_session, company) -> None:
    repo = CareersPageRepository(db_session)
    page = repo.create_if_missing(company.id)
    draft = {"theme": {"primary": "#111111"}}
    repo.update_draft(page, draft)

    published_at = datetime.now(UTC)
    published = repo.publish(page, published_at)

    assert published.published_config == draft
    assert published.draft_config == draft
    assert published.published_at == published_at
