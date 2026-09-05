from datetime import datetime
from typing import Literal
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field, field_validator

from app.constants.job import (
    EMPLOYMENT_TYPES,
    EXPERIENCE_LEVELS,
    JOB_TYPES,
    WORK_POLICIES,
)

EmploymentTypeLiteral = Literal["full_time", "part_time", "contract"]
WorkPolicyLiteral = Literal["remote", "hybrid", "on_site"]
JobTypeLiteral = Literal["permanent", "temporary", "internship"]
ExperienceLevelLiteral = Literal["junior", "mid_level", "senior"]


def _require_in(value: str, allowed: tuple[str, ...], label: str) -> str:
    normalized = value.strip()
    if normalized not in allowed:
        raise ValueError(f"{label} must be one of: {', '.join(allowed)}")
    return normalized


class JobCreate(BaseModel):
    title: str = Field(min_length=1, max_length=255)
    department: str = Field(min_length=1, max_length=150)
    location: str = Field(min_length=1, max_length=255)
    employment_type: EmploymentTypeLiteral
    work_policy: WorkPolicyLiteral
    experience_level: ExperienceLevelLiteral
    job_type: JobTypeLiteral
    salary_range: str | None = Field(default=None, max_length=150)
    description: str = Field(min_length=1)
    is_active: bool = True
    application_url: str | None = Field(default=None, max_length=1024)
    posted_at: datetime | None = None

    @field_validator("employment_type")
    @classmethod
    def validate_employment_type(cls, value: str) -> str:
        return _require_in(value, EMPLOYMENT_TYPES, "employment_type")

    @field_validator("work_policy")
    @classmethod
    def validate_work_policy(cls, value: str) -> str:
        return _require_in(value, WORK_POLICIES, "work_policy")

    @field_validator("experience_level")
    @classmethod
    def validate_experience_level(cls, value: str) -> str:
        return _require_in(value, EXPERIENCE_LEVELS, "experience_level")

    @field_validator("job_type")
    @classmethod
    def validate_job_type(cls, value: str) -> str:
        return _require_in(value, JOB_TYPES, "job_type")

    @field_validator("salary_range")
    @classmethod
    def validate_salary_range(cls, value: str | None) -> str | None:
        if value is None:
            return None
        trimmed = value.strip()
        return trimmed or None


class JobUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=1, max_length=255)
    department: str | None = Field(default=None, min_length=1, max_length=150)
    location: str | None = Field(default=None, min_length=1, max_length=255)
    employment_type: EmploymentTypeLiteral | None = None
    work_policy: WorkPolicyLiteral | None = None
    experience_level: ExperienceLevelLiteral | None = None
    job_type: JobTypeLiteral | None = None
    salary_range: str | None = Field(default=None, max_length=150)
    description: str | None = Field(default=None, min_length=1)
    is_active: bool | None = None
    application_url: str | None = Field(default=None, max_length=1024)
    posted_at: datetime | None = None

    @field_validator("employment_type")
    @classmethod
    def validate_employment_type(cls, value: str | None) -> str | None:
        if value is None:
            return None
        return _require_in(value, EMPLOYMENT_TYPES, "employment_type")

    @field_validator("work_policy")
    @classmethod
    def validate_work_policy(cls, value: str | None) -> str | None:
        if value is None:
            return None
        return _require_in(value, WORK_POLICIES, "work_policy")

    @field_validator("experience_level")
    @classmethod
    def validate_experience_level(cls, value: str | None) -> str | None:
        if value is None:
            return None
        return _require_in(value, EXPERIENCE_LEVELS, "experience_level")

    @field_validator("job_type")
    @classmethod
    def validate_job_type(cls, value: str | None) -> str | None:
        if value is None:
            return None
        return _require_in(value, JOB_TYPES, "job_type")

    @field_validator("salary_range")
    @classmethod
    def validate_salary_range(cls, value: str | None) -> str | None:
        if value is None:
            return None
        trimmed = value.strip()
        return trimmed or None


class JobResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    company_id: UUID
    title: str
    department: str
    location: str
    employment_type: str
    work_policy: str
    experience_level: str
    job_type: str
    salary_range: str | None
    description: str
    is_active: bool
    application_url: str | None
    posted_at: datetime
    created_at: datetime
    updated_at: datetime


class JobListResponse(BaseModel):
    items: list[JobResponse]
    total: int
