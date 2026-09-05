from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class JobCreate(BaseModel):
    title: str = Field(min_length=1, max_length=255)
    department: str = Field(min_length=1, max_length=150)
    location: str = Field(min_length=1, max_length=255)
    employment_type: str = Field(min_length=1, max_length=50)
    description: str = Field(min_length=1)
    is_active: bool = True
    application_url: str | None = Field(default=None, max_length=1024)


class JobUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=1, max_length=255)
    department: str | None = Field(default=None, min_length=1, max_length=150)
    location: str | None = Field(default=None, min_length=1, max_length=255)
    employment_type: str | None = Field(default=None, min_length=1, max_length=50)
    description: str | None = Field(default=None, min_length=1)
    is_active: bool | None = None
    application_url: str | None = Field(default=None, max_length=1024)


class JobResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    company_id: UUID
    title: str
    department: str
    location: str
    employment_type: str
    description: str
    is_active: bool
    application_url: str | None
    created_at: datetime
    updated_at: datetime


class JobListResponse(BaseModel):
    items: list[JobResponse]
    total: int
