from tests.conftest import auth_header, register_and_login


def test_get_and_patch_my_company(client, unique_slug: str) -> None:
    session = register_and_login(client, unique_slug)
    headers = auth_header(session["access_token"])

    get_response = client.get("/api/v1/company/me", headers=headers)
    assert get_response.status_code == 200
    assert get_response.json()["slug"] == unique_slug

    patch_response = client.patch(
        "/api/v1/company/me",
        headers=headers,
        json={"name": "Acme Updated", "primary_color": "#101010"},
    )
    assert patch_response.status_code == 200
    body = patch_response.json()
    assert body["name"] == "Acme Updated"
    assert body["primary_color"] == "#101010"


def test_company_me_requires_auth(client) -> None:
    assert client.get("/api/v1/company/me").status_code == 401
