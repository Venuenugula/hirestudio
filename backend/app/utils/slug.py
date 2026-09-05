import re


_SLUG_PATTERN = re.compile(r"[^a-z0-9]+")
_MULTI_HYPHEN = re.compile(r"-{2,}")


def normalize_slug(value: str) -> str:
    """Normalize a slug to lowercase hyphen-separated alphanumeric form."""
    slug = value.strip().lower()
    slug = _SLUG_PATTERN.sub("-", slug)
    slug = _MULTI_HYPHEN.sub("-", slug)
    return slug.strip("-")
