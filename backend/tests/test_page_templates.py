import pytest

from app.core.exceptions import DomainValidationError
from app.page_templates import (
    DEFAULT_TEMPLATE_ID,
    PageTemplateContext,
    get_template,
    list_templates,
    render_page_config,
)


def test_default_template_is_registered() -> None:
    templates = list_templates()
    ids = {template.id for template in templates}
    assert DEFAULT_TEMPLATE_ID in ids
    assert get_template(DEFAULT_TEMPLATE_ID).id == DEFAULT_TEMPLATE_ID


def test_unknown_template_raises() -> None:
    with pytest.raises(DomainValidationError):
        get_template("does-not-exist")


def test_professional_starter_includes_required_sections() -> None:
    config = render_page_config(
        PageTemplateContext(
            company_name="Acme Labs",
            primary_color="#123456",
            secondary_color="#abcdef",
        )
    )

    assert config["theme"]["primaryColor"] == "#123456"
    assert config["theme"]["secondaryColor"] == "#abcdef"
    assert config["template"]["id"] == DEFAULT_TEMPLATE_ID
    assert config["template"]["version"] == 1

    types = [section["type"] for section in config["sections"]]
    assert types == ["hero", "about", "benefits", "open_roles", "cta"]

    hero = config["sections"][0]
    assert hero["title"] == "Join Acme Labs"
    assert "Acme Labs" in hero["subtitle"]
    assert hero["ctaLabel"]

    benefits = config["sections"][2]
    assert len(benefits["items"]) >= 4
    titles = {item["title"] for item in benefits["items"]}
    assert {"Flexible Work", "Learning Budget", "Health Insurance", "Career Growth"} <= titles
    assert all(item["title"] and item["description"] for item in benefits["items"])

    cta = config["sections"][4]
    assert cta["title"] == "Ready to make an impact?"
    assert cta["subtitle"] == "Browse our open positions."
