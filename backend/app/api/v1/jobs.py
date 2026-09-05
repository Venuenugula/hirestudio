from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Query, Response, status

from app.dependencies.jobs import JobServiceDep
from app.schemas.job import JobCreate, JobListResponse, JobResponse, JobUpdate

router = APIRouter(prefix="/jobs", tags=["jobs"])


@router.get("/company/{company_id}", response_model=JobListResponse)
def list_jobs(
    company_id: UUID,
    service: JobServiceDep,
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


@router.post(
    "/company/{company_id}",
    response_model=JobResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_job(
    company_id: UUID,
    payload: JobCreate,
    service: JobServiceDep,
) -> JobResponse:
    return service.create_job(company_id, payload)


@router.get("/{job_id}", response_model=JobResponse)
def get_job(job_id: UUID, service: JobServiceDep) -> JobResponse:
    return service.get_job(job_id)


@router.patch("/{job_id}", response_model=JobResponse)
def update_job(
    job_id: UUID,
    payload: JobUpdate,
    service: JobServiceDep,
) -> JobResponse:
    return service.update_job(job_id, payload)


@router.delete("/{job_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_job(job_id: UUID, service: JobServiceDep) -> Response:
    service.delete_job(job_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
