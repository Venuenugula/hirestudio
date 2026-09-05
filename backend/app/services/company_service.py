from uuid import UUID

from sqlalchemy.orm import Session

from app.core.exceptions import ConflictError, DomainValidationError, NotFoundError
from app.models.company import Company
from app.repositories.company_repository import CompanyRepository
from app.schemas.company import CompanyCreate, CompanyResponse, CompanyUpdate
from app.utils.slug import normalize_slug


class CompanyService:
    """Company business rules and orchestration."""

    def __init__(self, db: Session, repository: CompanyRepository | None = None) -> None:
        self._db = db
        self._repository = repository or CompanyRepository(db)

    def create_company(self, payload: CompanyCreate) -> CompanyResponse:
        slug = self._require_valid_slug(payload.slug)
        self._ensure_slug_available(slug)

        company = Company(
            name=payload.name.strip(),
            slug=slug,
            logo_url=payload.logo_url,
            banner_url=payload.banner_url,
            website=payload.website,
            industry=payload.industry,
            company_size=payload.company_size,
            primary_color=payload.primary_color,
            secondary_color=payload.secondary_color,
            is_active=payload.is_active,
        )
        created = self._repository.create_company(company)
        self._db.commit()
        self._db.refresh(created)
        return CompanyResponse.model_validate(created)

    def get_company(self, company_id: UUID) -> CompanyResponse:
        company = self._repository.get_by_id(company_id)
        if company is None:
            raise NotFoundError(f"Company '{company_id}' was not found")
        return CompanyResponse.model_validate(company)

    def get_company_by_slug(self, slug: str) -> CompanyResponse:
        normalized = self._require_valid_slug(slug)
        company = self._repository.get_by_slug(normalized)
        if company is None:
            raise NotFoundError(f"Company with slug '{normalized}' was not found")
        return CompanyResponse.model_validate(company)

    def update_company(
        self,
        company_id: UUID,
        payload: CompanyUpdate,
    ) -> CompanyResponse:
        company = self._repository.get_by_id(company_id)
        if company is None:
            raise NotFoundError(f"Company '{company_id}' was not found")

        updates = payload.model_dump(exclude_unset=True)
        if "slug" in updates:
            new_slug = self._require_valid_slug(updates["slug"])
            self._ensure_slug_available(new_slug, exclude_id=company.id)
            updates["slug"] = new_slug

        if "name" in updates and isinstance(updates["name"], str):
            updates["name"] = updates["name"].strip()

        for text_field in ("website", "industry", "company_size"):
            if text_field in updates and isinstance(updates[text_field], str):
                trimmed = updates[text_field].strip()
                updates[text_field] = trimmed or None

        for field, value in updates.items():
            setattr(company, field, value)

        updated = self._repository.update_company(company)
        self._db.commit()
        self._db.refresh(updated)
        return CompanyResponse.model_validate(updated)

    def _require_valid_slug(self, value: str) -> str:
        slug = normalize_slug(value)
        if not slug:
            raise DomainValidationError(
                "Slug must contain at least one alphanumeric character"
            )
        if len(slug) > 100:
            raise DomainValidationError("Slug must be at most 100 characters")
        return slug

    def _ensure_slug_available(
        self,
        slug: str,
        *,
        exclude_id: UUID | None = None,
    ) -> None:
        if self._repository.exists_by_slug(slug, exclude_id=exclude_id):
            raise ConflictError(f"Company slug '{slug}' is already taken")
