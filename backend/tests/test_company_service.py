import pytest

from app.core.exceptions import ConflictError, DomainValidationError, NotFoundError
from app.schemas.company import CompanyCreate, CompanyUpdate
from app.services.company_service import CompanyService
from uuid import uuid4


def test_create_company_normalizes_slug(db_session, unique_slug: str) -> None:
    from app.utils.slug import normalize_slug

    service = CompanyService(db_session)
    raw_slug = f"Acme {unique_slug} Corp"
    response = service.create_company(
        CompanyCreate(name="Acme Inc", slug=raw_slug)
    )

    assert response.name == "Acme Inc"
    assert response.slug == normalize_slug(raw_slug)
    assert response.is_active is True


def test_create_company_rejects_duplicate_slug(db_session, unique_slug: str) -> None:
    service = CompanyService(db_session)
    service.create_company(CompanyCreate(name="One", slug=unique_slug))

    with pytest.raises(ConflictError):
        service.create_company(CompanyCreate(name="Two", slug=unique_slug.upper()))


def test_create_company_rejects_empty_slug(db_session) -> None:
    service = CompanyService(db_session)
    with pytest.raises(DomainValidationError):
        service.create_company(CompanyCreate(name="Acme", slug="!!!"))


def test_get_company_not_found(db_session) -> None:
    service = CompanyService(db_session)
    with pytest.raises(NotFoundError):
        service.get_company(uuid4())


def test_update_company_changes_fields(db_session, unique_slug: str) -> None:
    service = CompanyService(db_session)
    created = service.create_company(CompanyCreate(name="Acme", slug=unique_slug))

    updated = service.update_company(
        created.id,
        CompanyUpdate(name="Acme Renamed", primary_color="#abcdef"),
    )
    assert updated.name == "Acme Renamed"
    assert updated.primary_color == "#abcdef"
    assert updated.slug == unique_slug


def test_update_company_slug_conflict(db_session, unique_slug: str) -> None:
    service = CompanyService(db_session)
    first = service.create_company(CompanyCreate(name="One", slug=f"{unique_slug}-a"))
    service.create_company(CompanyCreate(name="Two", slug=f"{unique_slug}-b"))

    with pytest.raises(ConflictError):
        service.update_company(first.id, CompanyUpdate(slug=f"{unique_slug}-b"))


def test_get_company_by_slug(db_session, unique_slug: str) -> None:
    service = CompanyService(db_session)
    created = service.create_company(CompanyCreate(name="Acme", slug=unique_slug))

    found = service.get_company_by_slug(unique_slug.upper())
    assert found.id == created.id
