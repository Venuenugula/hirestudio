from uuid import uuid4


def test_get_careers_page_auto_creates(client, company) -> None:
    response = client.get(f"/api/v1/careers-page/company/{company.id}")

    assert response.status_code == 200
    body = response.json()
    assert body["company_id"] == str(company.id)
    assert body["draft_config"] == {}
    assert body["published_config"] == {}
    assert body["published_at"] is None


def test_get_careers_page_unknown_company_returns_404(client) -> None:
    response = client.get(f"/api/v1/careers-page/company/{uuid4()}")
    assert response.status_code == 404


def test_patch_draft_and_publish_flow(client, company) -> None:
    draft = {
        "sections": [
            {"type": "hero", "title": "Work with us"},
            {"type": "jobs", "showFilters": True},
        ]
    }

    patch_response = client.patch(
        f"/api/v1/careers-page/company/{company.id}/draft",
        json={"draft_config": draft},
    )
    assert patch_response.status_code == 200
    patched = patch_response.json()
    assert patched["draft_config"] == draft
    assert patched["published_config"] == {}

    publish_response = client.post(
        f"/api/v1/careers-page/company/{company.id}/publish"
    )
    assert publish_response.status_code == 200
    published = publish_response.json()
    assert published["published_config"] == draft
    assert published["draft_config"] == draft
    assert published["published_at"] is not None

    get_response = client.get(f"/api/v1/careers-page/company/{company.id}")
    assert get_response.status_code == 200
    assert get_response.json()["published_config"] == draft


def test_publish_without_prior_draft_publishes_empty_config(client, company) -> None:
    response = client.post(f"/api/v1/careers-page/company/{company.id}/publish")

    assert response.status_code == 200
    body = response.json()
    assert body["published_config"] == {}
    assert body["published_at"] is not None
