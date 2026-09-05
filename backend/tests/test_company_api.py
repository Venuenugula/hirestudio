from uuid import uuid4


def test_create_company_api(client, unique_slug: str) -> None:
    response = client.post(
        "/api/v1/company/",
        json={
            "name": "Acme Corp",
            "slug": f"Acme {unique_slug}",
            "primary_color": "#101010",
        },
    )
    assert response.status_code == 201
    body = response.json()
    assert body["name"] == "Acme Corp"
    assert body["slug"] == f"acme-{unique_slug}"
    assert body["primary_color"] == "#101010"
    assert "id" in body


def test_get_company_by_id_api(client, unique_slug: str) -> None:
    created = client.post(
        "/api/v1/company/",
        json={"name": "Acme", "slug": unique_slug},
    ).json()

    response = client.get(f"/api/v1/company/{created['id']}")
    assert response.status_code == 200
    assert response.json()["id"] == created["id"]


def test_get_company_by_slug_api(client, unique_slug: str) -> None:
    client.post(
        "/api/v1/company/",
        json={"name": "Acme", "slug": unique_slug},
    )

    response = client.get(f"/api/v1/company/slug/{unique_slug}")
    assert response.status_code == 200
    assert response.json()["slug"] == unique_slug


def test_patch_company_api(client, unique_slug: str) -> None:
    created = client.post(
        "/api/v1/company/",
        json={"name": "Acme", "slug": unique_slug},
    ).json()

    response = client.patch(
        f"/api/v1/company/{created['id']}",
        json={"name": "Acme Updated", "is_active": False},
    )
    assert response.status_code == 200
    body = response.json()
    assert body["name"] == "Acme Updated"
    assert body["is_active"] is False


def test_create_duplicate_slug_returns_409(client, unique_slug: str) -> None:
    payload = {"name": "Acme", "slug": unique_slug}
    assert client.post("/api/v1/company/", json=payload).status_code == 201

    response = client.post("/api/v1/company/", json=payload)
    assert response.status_code == 409
    assert "already taken" in response.json()["detail"]


def test_get_missing_company_returns_404(client) -> None:
    response = client.get(f"/api/v1/company/{uuid4()}")
    assert response.status_code == 404
    assert "not found" in response.json()["detail"].lower()
