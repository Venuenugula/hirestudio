from datetime import UTC, datetime, timedelta
from uuid import uuid4


def _job_payload(**overrides):
    data = {
        "title": "Backend Engineer",
        "department": "Engineering",
        "location": "Remote",
        "employment_type": "full_time",
        "work_policy": "remote",
        "experience_level": "mid_level",
        "job_type": "permanent",
        "salary_range": "USD 80K–120K / year",
        "description": "Build scalable APIs",
        "is_active": True,
        "application_url": "https://example.com/apply",
    }
    data.update(overrides)
    return data


def _create_company(client, slug: str, **overrides):
    payload = {
        "name": "Acme Corp",
        "slug": slug,
        "primary_color": "#0A0A0A",
        "secondary_color": "#F5F5F5",
        "is_active": True,
    }
    payload.update(overrides)
    response = client.post("/api/v1/company/", json=payload)
    assert response.status_code == 201
    return response.json()


def test_job_crud_api(client, company) -> None:
    create_response = client.post(
        f"/api/v1/jobs/company/{company.id}",
        json=_job_payload(),
    )
    assert create_response.status_code == 201
    created = create_response.json()
    assert created["title"] == "Backend Engineer"
    assert created["work_policy"] == "remote"
    assert created["experience_level"] == "mid_level"
    assert created["job_type"] == "permanent"
    assert created["posted_at"] is not None

    list_response = client.get(f"/api/v1/jobs/company/{company.id}")
    assert list_response.status_code == 200
    listed = list_response.json()
    assert listed["total"] == 1

    filtered = client.get(
        f"/api/v1/jobs/company/{company.id}",
        params={
            "department": "Engineering",
            "work_policy": "remote",
            "is_active": True,
        },
    )
    assert filtered.status_code == 200
    assert filtered.json()["total"] == 1

    job_id = created["id"]
    get_response = client.get(f"/api/v1/jobs/{job_id}")
    assert get_response.status_code == 200

    update_response = client.patch(
        f"/api/v1/jobs/{job_id}",
        json={"title": "Senior Backend Engineer", "job_type": "temporary"},
    )
    assert update_response.status_code == 200
    assert update_response.json()["title"] == "Senior Backend Engineer"
    assert update_response.json()["job_type"] == "temporary"

    delete_response = client.delete(f"/api/v1/jobs/{job_id}")
    assert delete_response.status_code == 204

    missing = client.get(f"/api/v1/jobs/{job_id}")
    assert missing.status_code == 404


def test_list_jobs_unknown_company_returns_404(client) -> None:
    response = client.get(f"/api/v1/jobs/company/{uuid4()}")
    assert response.status_code == 404


def test_rejects_legacy_employment_type(client, company) -> None:
    response = client.post(
        f"/api/v1/jobs/company/{company.id}",
        json=_job_payload(employment_type="internship"),
    )
    assert response.status_code == 422


def test_public_site_includes_new_job_fields(client, unique_slug: str) -> None:
    company = _create_company(client, unique_slug)
    posted = (datetime.now(UTC) - timedelta(days=5)).isoformat()
    job = client.post(
        f"/api/v1/jobs/company/{company['id']}",
        json=_job_payload(posted_at=posted, title="Public Role"),
    ).json()

    response = client.get(f"/api/v1/public/{unique_slug}")
    assert response.status_code == 200
    body = response.json()
    assert len(body["jobs"]) == 1
    assert body["jobs"][0]["id"] == job["id"]
    assert body["jobs"][0]["work_policy"] == "remote"
    assert body["jobs"][0]["experience_level"] == "mid_level"
    assert body["jobs"][0]["job_type"] == "permanent"
