from uuid import uuid4

from tests.conftest import auth_header, register_and_login


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


def test_job_crud_api(client, unique_slug: str) -> None:
    session = register_and_login(client, unique_slug)
    headers = auth_header(session["access_token"])

    create_response = client.post(
        "/api/v1/jobs",
        headers=headers,
        json=_job_payload(),
    )
    assert create_response.status_code == 201
    created = create_response.json()
    assert created["work_policy"] == "remote"
    assert created["posted_at"] is not None

    list_response = client.get("/api/v1/jobs", headers=headers)
    assert list_response.status_code == 200
    assert list_response.json()["total"] == 1

    filtered = client.get(
        "/api/v1/jobs",
        headers=headers,
        params={"department": "Engineering", "work_policy": "remote", "is_active": True},
    )
    assert filtered.status_code == 200
    assert filtered.json()["total"] == 1

    job_id = created["id"]
    assert client.get(f"/api/v1/jobs/{job_id}", headers=headers).status_code == 200

    update_response = client.patch(
        f"/api/v1/jobs/{job_id}",
        headers=headers,
        json={"title": "Senior Backend Engineer", "job_type": "temporary"},
    )
    assert update_response.status_code == 200
    assert update_response.json()["job_type"] == "temporary"

    assert client.delete(f"/api/v1/jobs/{job_id}", headers=headers).status_code == 204
    assert client.get(f"/api/v1/jobs/{job_id}", headers=headers).status_code == 404


def test_list_jobs_requires_auth(client) -> None:
    assert client.get("/api/v1/jobs").status_code == 401


def test_rejects_legacy_employment_type(client, unique_slug: str) -> None:
    session = register_and_login(client, unique_slug)
    response = client.post(
        "/api/v1/jobs",
        headers=auth_header(session["access_token"]),
        json=_job_payload(employment_type="internship"),
    )
    assert response.status_code == 422


def test_public_site_includes_new_job_fields(client, unique_slug: str) -> None:
    session = register_and_login(client, unique_slug)
    headers = auth_header(session["access_token"])
    job = client.post(
        "/api/v1/jobs",
        headers=headers,
        json=_job_payload(title="Public Role"),
    ).json()

    response = client.get(f"/api/v1/public/{unique_slug}")
    assert response.status_code == 200
    body = response.json()
    assert len(body["jobs"]) == 1
    assert body["jobs"][0]["id"] == job["id"]
    assert body["jobs"][0]["work_policy"] == "remote"
