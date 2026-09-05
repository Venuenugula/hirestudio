from uuid import uuid4


def _payload(**overrides):
    data = {
        "title": "Backend Engineer",
        "department": "Engineering",
        "location": "Remote",
        "employment_type": "full_time",
        "description": "Build scalable APIs",
        "is_active": True,
        "application_url": "https://example.com/apply",
    }
    data.update(overrides)
    return data


def test_job_crud_api(client, company) -> None:
    create_response = client.post(
        f"/api/v1/jobs/company/{company.id}",
        json=_payload(),
    )
    assert create_response.status_code == 201
    created = create_response.json()
    assert created["title"] == "Backend Engineer"

    list_response = client.get(f"/api/v1/jobs/company/{company.id}")
    assert list_response.status_code == 200
    listed = list_response.json()
    assert listed["total"] == 1

    filtered = client.get(
        f"/api/v1/jobs/company/{company.id}",
        params={"department": "Engineering", "is_active": True},
    )
    assert filtered.status_code == 200
    assert filtered.json()["total"] == 1

    job_id = created["id"]
    get_response = client.get(f"/api/v1/jobs/{job_id}")
    assert get_response.status_code == 200

    update_response = client.patch(
        f"/api/v1/jobs/{job_id}",
        json={"title": "Senior Backend Engineer"},
    )
    assert update_response.status_code == 200
    assert update_response.json()["title"] == "Senior Backend Engineer"

    delete_response = client.delete(f"/api/v1/jobs/{job_id}")
    assert delete_response.status_code == 204

    missing = client.get(f"/api/v1/jobs/{job_id}")
    assert missing.status_code == 404


def test_list_jobs_unknown_company_returns_404(client) -> None:
    response = client.get(f"/api/v1/jobs/company/{uuid4()}")
    assert response.status_code == 404
