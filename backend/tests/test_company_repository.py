from app.models.company import Company
from app.repositories.company_repository import CompanyRepository
from app.utils.slug import normalize_slug


def test_normalize_slug_lowercases_and_hyphenates() -> None:
    assert normalize_slug("  Acme Corp!! ") == "acme-corp"
    assert normalize_slug("Hello---World") == "hello-world"


def test_create_and_get_by_id(db_session, unique_slug: str) -> None:
    repo = CompanyRepository(db_session)
    company = Company(name="Acme", slug=unique_slug)
    created = repo.create_company(company)

    found = repo.get_by_id(created.id)
    assert found is not None
    assert found.slug == unique_slug
    assert found.name == "Acme"


def test_get_by_slug_and_exists(db_session, unique_slug: str) -> None:
    repo = CompanyRepository(db_session)
    repo.create_company(Company(name="Acme", slug=unique_slug))

    assert repo.exists_by_slug(unique_slug) is True
    assert repo.get_by_slug(unique_slug) is not None
    assert repo.exists_by_slug("missing-slug") is False


def test_update_company(db_session, unique_slug: str) -> None:
    repo = CompanyRepository(db_session)
    company = repo.create_company(Company(name="Acme", slug=unique_slug))
    company.name = "Acme Updated"
    company.primary_color = "#123456"

    updated = repo.update_company(company)
    assert updated.name == "Acme Updated"
    assert updated.primary_color == "#123456"


def test_exists_by_slug_exclude_id(db_session, unique_slug: str) -> None:
    repo = CompanyRepository(db_session)
    company = repo.create_company(Company(name="Acme", slug=unique_slug))

    assert repo.exists_by_slug(unique_slug, exclude_id=company.id) is False
    assert repo.exists_by_slug(unique_slug) is True
