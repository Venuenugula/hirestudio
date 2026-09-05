from uuid import uuid4

from tests.conftest import auth_header, register_and_login


def _create_job(client, token: str, **overrides):
    payload = {
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
    }
    payload.update(overrides)
    response = client.post(
        "/api/v1/jobs",
        headers=auth_header(token),
        json=payload,
    )
    assert response.status_code == 201
    return response.json()


def test_public_site_returns_published_config_and_active_jobs(
    client,
    unique_slug: str,
) -> None:
    session = register_and_login(client, unique_slug)
    headers = auth_header(session["access_token"])

    draft = {
        "theme": {"primaryColor": "#111111", "secondaryColor": "#FFFFFF"},
        "sections": [
            {
                "id": str(uuid4()),
                "type": "hero",
                "title": "Join Acme",
                "subtitle": "Build with us",
                "ctaLabel": "View roles",
            }
        ],
    }
    assert (
        client.patch(
            "/api/v1/careers-page/me/draft",
            headers=headers,
            json={"draft_config": draft},
        ).status_code
        == 200
    )
    assert (
        client.post("/api/v1/careers-page/me/publish", headers=headers).status_code
        == 200
    )

    active = _create_job(client, session["access_token"], title="Active Role")
    _create_job(
        client,
        session["access_token"],
        title="Hidden Role",
        is_active=False,
    )

    response = client.get(f"/api/v1/public/{unique_slug}")
    assert response.status_code == 200
    body = response.json()

    assert body["company"]["slug"] == unique_slug
    assert "draft_config" not in body["careers_page"]
    assert body["careers_page"]["published_config"] == draft
    assert len(body["jobs"]) == 1
    assert body["jobs"][0]["id"] == active["id"]


def test_public_site_unknown_slug_returns_404(client) -> None:
    response = client.get("/api/v1/public/does-not-exist-xyz")
    assert response.status_code == 404


def test_public_site_inactive_company_returns_404(
    client,
    unique_slug: str,
) -> None:
    session = register_and_login(client, unique_slug)
    headers = auth_header(session["access_token"])
    client.patch(
        "/api/v1/company/me",
        headers=headers,
        json={"is_active": False},
    )
    response = client.get(f"/api/v1/public/{unique_slug}")
    assert response.status_code == 404


def test_public_job_detail(client, unique_slug: str) -> None:
    session = register_and_login(client, unique_slug)
    job = _create_job(client, session["access_token"])

    response = client.get(f"/api/v1/public/{unique_slug}/jobs/{job['id']}")
    assert response.status_code == 200
    body = response.json()
    assert body["company"]["id"] == session["company"]["id"]
    assert body["job"]["id"] == job["id"]


def test_public_job_inactive_returns_404(client, unique_slug: str) -> None:
    session = register_and_login(client, unique_slug)
    job = _create_job(client, session["access_token"], is_active=False)

    response = client.get(f"/api/v1/public/{unique_slug}/jobs/{job['id']}")
    assert response.status_code == 404


def test_public_job_wrong_company_returns_404(client, unique_slug: str) -> None:
    first = register_and_login(client, unique_slug)
    second = register_and_login(client, f"{unique_slug}-b")
    job = _create_job(client, second["access_token"])

    response = client.get(
        f"/api/v1/public/{first['company']['slug']}/jobs/{job['id']}"
    )
    assert response.status_code == 404


def test_public_endpoints_do_not_require_auth(client, unique_slug: str) -> None:
    register_and_login(client, unique_slug)
    response = client.get(f"/api/v1/public/{unique_slug}")
    assert response.status_code == 200
