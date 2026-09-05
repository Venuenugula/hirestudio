from __future__ import annotations

from typing import Any, Protocol

from app.page_templates.context import PageTemplateContext


class PageTemplate(Protocol):
    """Contract for careers page templates.

    New templates implement this protocol and register in the registry.
    """

    id: str
    name: str
    description: str
    version: int

    def build(self, context: PageTemplateContext) -> dict[str, Any]:
        """Return a PageConfig-shaped dict for draft_config."""
        ...
