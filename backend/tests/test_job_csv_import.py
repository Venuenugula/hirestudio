from datetime import UTC, datetime, timedelta
from pathlib import Path

from app.services.job_csv_import import (
    load_sample_jobs,
    parse_posted_days_ago,
    row_to_job_fields,
)


def test_parse_posted_days_ago() -> None:
    now = datetime(2026, 9, 5, 12, 0, tzinfo=UTC)
    assert parse_posted_days_ago("Posted today", now=now) == now
    assert parse_posted_days_ago("40 days ago", now=now) == now - timedelta(days=40)


def test_row_to_job_fields_normalizes_enums() -> None:
    now = datetime(2026, 9, 5, 12, 0, tzinfo=UTC)
    fields = row_to_job_fields(
        {
            "title": "Full Stack Engineer",
            "work_policy": "Remote",
            "location": "Berlin, Germany",
            "department": "Product",
            "employment_type": "Full time",
            "experience_level": "Senior",
            "job_type": "Temporary",
            "salary_range": "AED 8K–12K / month",
            "job_slug": "full-stack-engineer-berlin",
            "posted_days_ago": "40 days ago",
        },
        now=now,
    )
    assert fields["employment_type"] == "full_time"
    assert fields["work_policy"] == "remote"
    assert fields["experience_level"] == "senior"
    assert fields["job_type"] == "temporary"
    assert fields["posted_at"] == now - timedelta(days=40)
    assert "job_slug" not in fields
    assert fields["description"]


def test_load_sample_jobs_from_repo_csv() -> None:
    path = Path(__file__).resolve().parents[1] / "data" / "sample_jobs.csv"
    jobs = load_sample_jobs(path)
    assert len(jobs) == 150
    assert all(job["employment_type"] in {"full_time", "part_time", "contract"} for job in jobs)
    assert all(job["job_type"] in {"permanent", "temporary", "internship"} for job in jobs)
