"""Reusable careers page templates.

Templates produce PageConfig-shaped dicts for draft_config JSONB.
Add new templates by implementing PageTemplate and registering them.
"""

from app.page_templates.context import PageTemplateContext
from app.page_templates.registry import (
    DEFAULT_TEMPLATE_ID,
    get_template,
    list_templates,
    render_page_config,
)

__all__ = [
    "DEFAULT_TEMPLATE_ID",
    "PageTemplateContext",
    "get_template",
    "list_templates",
    "render_page_config",
]
