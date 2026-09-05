from datetime import datetime
from typing import Any
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class CareersPageUpdate(BaseModel):
    """Payload for updating the editable draft configuration only."""

    draft_config: dict[str, Any] = Field(default_factory=dict)


class CareersPageResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    company_id: UUID
    draft_config: dict[str, Any]
    published_config: dict[str, Any]
    published_at: datetime | None
    created_at: datetime
    updated_at: datetime


class PublishResponse(BaseModel):
    """Result of publishing draft_config to published_config."""

    model_config = ConfigDict(from_attributes=True)

    id: UUID
    company_id: UUID
    draft_config: dict[str, Any]
    published_config: dict[str, Any]
    published_at: datetime
    created_at: datetime
    updated_at: datetime
