from tests.conftest import auth_header, register_and_login


def test_get_careers_page_auto_creates(client, unique_slug: str) -> None:
    session = register_and_login(client, unique_slug)
    headers = auth_header(session["access_token"])

    response = client.get("/api/v1/careers-page/me", headers=headers)
    assert response.status_code == 200
    body = response.json()
    assert body["company_id"] == session["company"]["id"]
    assert body["draft_config"] == {}
    assert body["published_at"] is None


def test_careers_page_requires_auth(client) -> None:
    assert client.get("/api/v1/careers-page/me").status_code == 401


def test_patch_draft_and_publish_flow(client, unique_slug: str) -> None:
    session = register_and_login(client, unique_slug)
    headers = auth_header(session["access_token"])

    draft = {
        "sections": [
            {"type": "hero", "title": "Work with us"},
            {"type": "jobs", "showFilters": True},
        ]
    }

    patch_response = client.patch(
        "/api/v1/careers-page/me/draft",
        headers=headers,
        json={"draft_config": draft},
    )
    assert patch_response.status_code == 200
    assert patch_response.json()["draft_config"] == draft

    publish_response = client.post(
        "/api/v1/careers-page/me/publish",
        headers=headers,
    )
    assert publish_response.status_code == 200
    published = publish_response.json()
    assert published["published_config"] == draft
    assert published["published_at"] is not None

    get_response = client.get("/api/v1/careers-page/me", headers=headers)
    assert get_response.json()["published_config"] == draft
