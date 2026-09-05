from __future__ import annotations

from typing import Any

from app.core.exceptions import DomainValidationError
from app.page_templates.base import PageTemplate
from app.page_templates.context import PageTemplateContext
from app.page_templates.professional_starter import ProfessionalStarterTemplate

DEFAULT_TEMPLATE_ID = ProfessionalStarterTemplate.id

_TEMPLATES: dict[str, PageTemplate] = {
    ProfessionalStarterTemplate.id: ProfessionalStarterTemplate(),
}


def list_templates() -> list[PageTemplate]:
    return list(_TEMPLATES.values())


def get_template(template_id: str) -> PageTemplate:
    template = _TEMPLATES.get(template_id)
    if template is None:
        raise DomainValidationError(f"Unknown page template '{template_id}'")
    return template


def render_page_config(
    context: PageTemplateContext,
    *,
    template_id: str = DEFAULT_TEMPLATE_ID,
) -> dict[str, Any]:
    """Build a personalized PageConfig dict from a registered template."""
    return get_template(template_id).build(context)
