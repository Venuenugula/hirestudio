"""Parse and normalize the assignment sample jobs CSV into Job payloads."""

from __future__ import annotations

import csv
import re
from datetime import UTC, datetime, timedelta
from pathlib import Path
from typing import Any

from app.constants.job import (
    EMPLOYMENT_TYPES,
    EXPERIENCE_LEVELS,
    JOB_TYPES,
    WORK_POLICIES,
)

_DAYS_AGO = re.compile(r"^(\d+)\s+days?\s+ago$", re.IGNORECASE)

_WORK_POLICY_MAP = {
    "remote": "remote",
    "hybrid": "hybrid",
    "on-site": "on_site",
    "onsite": "on_site",
    "on_site": "on_site",
}

_EMPLOYMENT_MAP = {
    "full time": "full_time",
    "full_time": "full_time",
    "part time": "part_time",
    "part_time": "part_time",
    "contract": "contract",
}

_JOB_TYPE_MAP = {
    "permanent": "permanent",
    "temporary": "temporary",
    "internship": "internship",
}

_EXPERIENCE_MAP = {
    "junior": "junior",
    "mid-level": "mid_level",
    "mid level": "mid_level",
    "mid_level": "mid_level",
    "senior": "senior",
}


def default_csv_path() -> Path:
    return Path(__file__).resolve().parents[2] / "data" / "sample_jobs.csv"


def parse_posted_days_ago(value: str, *, now: datetime | None = None) -> datetime:
    """Convert CSV relative phrases into an absolute UTC timestamp."""
    anchor = now or datetime.now(UTC)
    if anchor.tzinfo is None:
        anchor = anchor.replace(tzinfo=UTC)

    raw = value.strip()
    lowered = raw.lower()
    if lowered in {"posted today", "today"}:
        return anchor

    match = _DAYS_AGO.fullmatch(lowered)
    if match:
        days = int(match.group(1))
        return anchor - timedelta(days=days)

    raise ValueError(f"Unrecognized posted_days_ago value: {value!r}")


def _normalize_key(value: str, mapping: dict[str, str], allowed: tuple[str, ...], label: str) -> str:
    key = value.strip().lower()
    normalized = mapping.get(key)
    if normalized is None or normalized not in allowed:
        raise ValueError(f"Invalid {label}: {value!r}")
    return normalized


def row_to_job_fields(
    row: dict[str, str],
    *,
    now: datetime | None = None,
) -> dict[str, Any]:
    title = row["title"].strip()
    department = row["department"].strip()
    location = row["location"].strip()
    salary = (row.get("salary_range") or "").strip() or None

    work_policy = _normalize_key(
        row["work_policy"], _WORK_POLICY_MAP, WORK_POLICIES, "work_policy"
    )
    employment_type = _normalize_key(
        row["employment_type"], _EMPLOYMENT_MAP, EMPLOYMENT_TYPES, "employment_type"
    )
    job_type = _normalize_key(row["job_type"], _JOB_TYPE_MAP, JOB_TYPES, "job_type")
    experience_level = _normalize_key(
        row["experience_level"],
        _EXPERIENCE_MAP,
        EXPERIENCE_LEVELS,
        "experience_level",
    )
    posted_at = parse_posted_days_ago(row["posted_days_ago"], now=now)

    description = (
        f"{title} — {experience_level.replace('_', ' ')} {job_type} role in "
        f"{department} ({location}). Work policy: {work_policy.replace('_', ' ')}. "
        f"Employment: {employment_type.replace('_', ' ')}."
    )
    if salary:
        description = f"{description} Compensation: {salary}."

    return {
        "title": title,
        "department": department,
        "location": location,
        "employment_type": employment_type,
        "work_policy": work_policy,
        "experience_level": experience_level,
        "job_type": job_type,
        "salary_range": salary,
        "description": description,
        "is_active": True,
        "application_url": None,
        "posted_at": posted_at,
    }


def load_sample_jobs(
    csv_path: Path | None = None,
    *,
    now: datetime | None = None,
) -> list[dict[str, Any]]:
    path = csv_path or default_csv_path()
    if not path.is_file():
        raise FileNotFoundError(f"Sample jobs CSV not found: {path}")

    with path.open(encoding="utf-8-sig", newline="") as handle:
        reader = csv.DictReader(handle)
        rows = list(reader)

    if not rows:
        raise ValueError(f"Sample jobs CSV is empty: {path}")

    return [row_to_job_fields(row, now=now) for row in rows]
