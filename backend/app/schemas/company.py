from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class CompanyCreate(BaseModel):
    name: str = Field(min_length=1, max_length=255)
    slug: str = Field(min_length=1, max_length=100)
    logo_url: str | None = Field(default=None, max_length=1024)
    banner_url: str | None = Field(default=None, max_length=1024)
    primary_color: str = Field(default="#111111", max_length=32)
    secondary_color: str = Field(default="#FFFFFF", max_length=32)
    is_active: bool = True


class CompanyUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=255)
    slug: str | None = Field(default=None, min_length=1, max_length=100)
    logo_url: str | None = Field(default=None, max_length=1024)
    banner_url: str | None = Field(default=None, max_length=1024)
    primary_color: str | None = Field(default=None, max_length=32)
    secondary_color: str | None = Field(default=None, max_length=32)
    is_active: bool | None = None


class CompanyResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    name: str
    slug: str
    logo_url: str | None
    banner_url: str | None
    primary_color: str
    secondary_color: str
    is_active: bool
    created_at: datetime
    updated_at: datetime
