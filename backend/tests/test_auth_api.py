from uuid import uuid4

from tests.conftest import auth_header, register_and_login


def test_register_login_and_me(client, unique_slug: str) -> None:
    registered = register_and_login(client, unique_slug)
    assert registered["token_type"] == "bearer"
    assert registered["access_token"]
    assert registered["user"]["email"] == f"{unique_slug}@example.com"
    assert "password_hash" not in registered["user"]
    assert registered["company"]["slug"] == unique_slug

    login = client.post(
        "/api/v1/auth/login",
        json={"email": f"{unique_slug}@example.com", "password": "password123"},
    )
    assert login.status_code == 200
    assert login.json()["access_token"]

    me = client.get(
        "/api/v1/auth/me",
        headers=auth_header(registered["access_token"]),
    )
    assert me.status_code == 200
    body = me.json()
    assert body["user"]["id"] == registered["user"]["id"]
    assert body["company"]["id"] == registered["company"]["id"]


def test_login_invalid_credentials(client, unique_slug: str) -> None:
    register_and_login(client, unique_slug)
    response = client.post(
        "/api/v1/auth/login",
        json={"email": f"{unique_slug}@example.com", "password": "wrong-password"},
    )
    assert response.status_code == 401


def test_protected_endpoint_requires_auth(client) -> None:
    response = client.get("/api/v1/company/me")
    assert response.status_code == 401


def test_register_duplicate_email_returns_409(client, unique_slug: str) -> None:
    register_and_login(client, unique_slug)
    response = client.post(
        "/api/v1/auth/register",
        json={
            "full_name": "Other",
            "email": f"{unique_slug}@example.com",
            "password": "password123",
            "company_name": "Other Co",
            "company_slug": f"{unique_slug}-other",
        },
    )
    assert response.status_code == 409


def test_cannot_access_other_company_job(client, unique_slug: str) -> None:
    first = register_and_login(client, unique_slug)
    second = register_and_login(client, f"{unique_slug}-b")

    created = client.post(
        "/api/v1/jobs",
        headers=auth_header(first["access_token"]),
        json={
            "title": "Owned Role",
            "department": "Engineering",
            "location": "Remote",
            "employment_type": "full_time",
            "work_policy": "remote",
            "experience_level": "mid_level",
            "job_type": "permanent",
            "description": "Mine",
            "is_active": True,
        },
    )
    assert created.status_code == 201
    job_id = created.json()["id"]

    forbidden = client.get(
        f"/api/v1/jobs/{job_id}",
        headers=auth_header(second["access_token"]),
    )
    assert forbidden.status_code == 403

    missing = client.get(
        f"/api/v1/jobs/{uuid4()}",
        headers=auth_header(first["access_token"]),
    )
    assert missing.status_code == 404


def test_logout_endpoint(client, unique_slug: str) -> None:
    registered = register_and_login(client, unique_slug)
    response = client.post(
        "/api/v1/auth/logout",
        headers=auth_header(registered["access_token"]),
    )
    assert response.status_code == 204
