from __future__ import annotations

from dataclasses import dataclass

from app.models.company import Company


@dataclass(frozen=True, slots=True)
class PageTemplateContext:
    """Company-derived inputs used to personalize a page template."""

    company_name: str
    primary_color: str
    secondary_color: str
    logo_url: str | None = None

    @classmethod
    def from_company(cls, company: Company) -> PageTemplateContext:
        return cls(
            company_name=company.name.strip() or "Our company",
            primary_color=company.primary_color or "#111111",
            secondary_color=company.secondary_color or "#FFFFFF",
            logo_url=company.logo_url,
        )
