from uuid import uuid4


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
    assert response.status_code == 200 or response.status_code == 201
    return response.json()


def _create_job(client, company_id: str, **overrides):
    payload = {
        "title": "Backend Engineer",
        "department": "Engineering",
        "location": "Remote",
        "employment_type": "full_time",
        "description": "Build scalable APIs",
        "is_active": True,
    }
    payload.update(overrides)
    response = client.post(f"/api/v1/jobs/company/{company_id}", json=payload)
    assert response.status_code == 201
    return response.json()


def test_public_site_returns_published_config_and_active_jobs(
    client,
    unique_slug: str,
) -> None:
    company = _create_company(client, unique_slug)
    company_id = company["id"]

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
    patch = client.patch(
        f"/api/v1/careers-page/company/{company_id}/draft",
        json={"draft_config": draft},
    )
    assert patch.status_code == 200
    publish = client.post(f"/api/v1/careers-page/company/{company_id}/publish")
    assert publish.status_code == 200

    active = _create_job(client, company_id, title="Active Role")
    _create_job(client, company_id, title="Hidden Role", is_active=False)

    response = client.get(f"/api/v1/public/{unique_slug}")
    assert response.status_code == 200
    body = response.json()

    assert body["company"]["slug"] == unique_slug
    assert "draft_config" not in body["careers_page"]
    assert body["careers_page"]["published_config"] == draft
    assert len(body["jobs"]) == 1
    assert body["jobs"][0]["id"] == active["id"]
    assert body["jobs"][0]["title"] == "Active Role"


def test_public_site_unknown_slug_returns_404(client) -> None:
    response = client.get("/api/v1/public/does-not-exist-xyz")
    assert response.status_code == 404


def test_public_site_inactive_company_returns_404(
    client,
    unique_slug: str,
) -> None:
    company = _create_company(client, unique_slug, is_active=False)
    response = client.get(f"/api/v1/public/{company['slug']}")
    assert response.status_code == 404


def test_public_job_detail(client, unique_slug: str) -> None:
    company = _create_company(client, unique_slug)
    job = _create_job(client, company["id"])

    response = client.get(f"/api/v1/public/{unique_slug}/jobs/{job['id']}")
    assert response.status_code == 200
    body = response.json()
    assert body["company"]["id"] == company["id"]
    assert body["job"]["id"] == job["id"]
    assert body["job"]["title"] == "Backend Engineer"


def test_public_job_inactive_returns_404(client, unique_slug: str) -> None:
    company = _create_company(client, unique_slug)
    job = _create_job(client, company["id"], is_active=False)

    response = client.get(f"/api/v1/public/{unique_slug}/jobs/{job['id']}")
    assert response.status_code == 404


def test_public_job_wrong_company_returns_404(client, unique_slug: str) -> None:
    company_a = _create_company(client, unique_slug)
    company_b = _create_company(client, f"{unique_slug}-b")
    job = _create_job(client, company_b["id"])

    response = client.get(f"/api/v1/public/{company_a['slug']}/jobs/{job['id']}")
    assert response.status_code == 404
