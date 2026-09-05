from __future__ import annotations

from typing import Any
from uuid import uuid4

from app.page_templates.context import PageTemplateContext


def _section_id() -> str:
    return str(uuid4())


class ProfessionalStarterTemplate:
    """Default recruiter-ready careers page used for new companies."""

    id = "professional-starter"
    name = "Professional Starter"
    version = 1
    description = (
        "A polished starter layout with hero, about, benefits, open roles, and CTA."
    )

    def build(self, context: PageTemplateContext) -> dict[str, Any]:
        name = context.company_name
        return {
            "template": {
                "id": self.id,
                "version": self.version,
            },
            "theme": {
                "primaryColor": context.primary_color,
                "secondaryColor": context.secondary_color,
            },
            "sections": [
                {
                    "id": _section_id(),
                    "type": "hero",
                    "title": f"Join {name}",
                    "subtitle": (
                        f"Help us build the future. Explore opportunities to grow "
                        f"your career with {name}."
                    ),
                    "ctaLabel": "View open roles",
                },
                {
                    "id": _section_id(),
                    "type": "about",
                    "title": f"About {name}",
                    "body": (
                        f"{name} is building great products with an amazing team. "
                        "Customize this section to tell candidates about your "
                        "mission, culture, and values."
                    ),
                },
                {
                    "id": _section_id(),
                    "type": "benefits",
                    "title": "Benefits & perks",
                    "items": [
                        {
                            "id": _section_id(),
                            "title": "Flexible Work",
                            "description": (
                                "Work in a way that fits your life — with trust, "
                                "clarity, and room to focus."
                            ),
                        },
                        {
                            "id": _section_id(),
                            "title": "Learning Budget",
                            "description": (
                                "Invest in courses, books, and conferences that "
                                "help you grow your craft."
                            ),
                        },
                        {
                            "id": _section_id(),
                            "title": "Health Insurance",
                            "description": (
                                "Comprehensive coverage so you and your family "
                                "can stay healthy and supported."
                            ),
                        },
                        {
                            "id": _section_id(),
                            "title": "Career Growth",
                            "description": (
                                "Clear paths, regular feedback, and opportunities "
                                "to take on bigger challenges."
                            ),
                        },
                    ],
                },
                {
                    "id": _section_id(),
                    "type": "open_roles",
                    "title": "Open roles",
                    "subtitle": (
                        f"Find a role that matches your skills and ambitions at "
                        f"{name}. New positions are posted regularly."
                    ),
                },
                {
                    "id": _section_id(),
                    "type": "cta",
                    "title": "Ready to make an impact?",
                    "subtitle": "Browse our open positions.",
                    "buttonLabel": "See open roles",
                },
            ],
        }
