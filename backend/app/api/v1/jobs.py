from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Query, Response, status

from app.dependencies.auth import CurrentCompanyIdDep, CurrentUserDep
from app.dependencies.jobs import JobServiceDep
from app.schemas.job import JobCreate, JobListResponse, JobResponse, JobUpdate

router = APIRouter(prefix="/jobs", tags=["jobs"])


@router.get("", response_model=JobListResponse)
def list_my_jobs(
    company_id: CurrentCompanyIdDep,
    service: JobServiceDep,
    _user: CurrentUserDep,
    title: Annotated[str | None, Query()] = None,
    department: Annotated[str | None, Query()] = None,
    location: Annotated[str | None, Query()] = None,
    employment_type: Annotated[str | None, Query()] = None,
    work_policy: Annotated[str | None, Query()] = None,
    experience_level: Annotated[str | None, Query()] = None,
    job_type: Annotated[str | None, Query()] = None,
    is_active: Annotated[bool | None, Query()] = None,
) -> JobListResponse:
    return service.list_jobs(
        company_id,
        title=title,
        department=department,
        location=location,
        employment_type=employment_type,
        work_policy=work_policy,
        experience_level=experience_level,
        job_type=job_type,
        is_active=is_active,
    )


@router.post("", response_model=JobResponse, status_code=status.HTTP_201_CREATED)
def create_my_job(
    payload: JobCreate,
    company_id: CurrentCompanyIdDep,
    service: JobServiceDep,
    _user: CurrentUserDep,
) -> JobResponse:
    return service.create_job(company_id, payload)


@router.get("/{job_id}", response_model=JobResponse)
def get_my_job(
    job_id: UUID,
    company_id: CurrentCompanyIdDep,
    service: JobServiceDep,
    _user: CurrentUserDep,
) -> JobResponse:
    return service.get_job_for_company(job_id, company_id)


@router.patch("/{job_id}", response_model=JobResponse)
def update_my_job(
    job_id: UUID,
    payload: JobUpdate,
    company_id: CurrentCompanyIdDep,
    service: JobServiceDep,
    _user: CurrentUserDep,
) -> JobResponse:
    return service.update_job_for_company(job_id, company_id, payload)


@router.delete("/{job_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_my_job(
    job_id: UUID,
    company_id: CurrentCompanyIdDep,
    service: JobServiceDep,
    _user: CurrentUserDep,
) -> Response:
    service.delete_job_for_company(job_id, company_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
