"""Verify the application can connect to PostgreSQL via DATABASE_URL.

Usage (from backend/ with venv active):

    python scripts/check_db_connection.py
"""

from __future__ import annotations

import sys
from pathlib import Path

BACKEND_ROOT = Path(__file__).resolve().parents[1]
if str(BACKEND_ROOT) not in sys.path:
    sys.path.insert(0, str(BACKEND_ROOT))

from sqlalchemy import text

from app.core.config import settings
from app.db.session import engine


def main() -> int:
    print(f"Connecting via DATABASE_URL ({_mask_database_url(settings.database_url)})...")

    try:
        with engine.connect() as connection:
            result = connection.execute(text("SELECT 1")).scalar_one()
            db_name, db_user = connection.execute(
                text("SELECT current_database(), current_user")
            ).one()
    except Exception as exc:  # noqa: BLE001 - surface any driver/network error
        print(f"Database connection FAILED: {exc}")
        print(
            "Update DATABASE_URL in backend/.env with your Neon connection string, "
            "then retry. Example format:\n"
            "  postgresql+psycopg://USER:PASSWORD@ep-xxxx.region.aws.neon.tech/"
            "neondb?sslmode=require"
        )
        return 1

    print(f"Database connection OK (SELECT 1 -> {result})")
    print(f"Connected to database={db_name} as user={db_user}")
    return 0


def _mask_database_url(url: str) -> str:
    """Return a URL-safe summary without credentials for console output."""
    if "@" not in url:
        return "driver configured"
    return f"...@{url.split('@', 1)[1]}"


if __name__ == "__main__":
    raise SystemExit(main())
