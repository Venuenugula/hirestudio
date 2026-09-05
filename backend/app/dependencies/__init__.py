"""FastAPI dependency providers."""

from app.dependencies.database import DbSession

__all__ = ["DbSession"]
