"""Canonical categorical values for the Job domain (snake_case storage)."""

from typing import Final, Literal

WORK_POLICIES: Final[tuple[str, ...]] = (
    "remote",
    "hybrid",
    "on_site",
)

EMPLOYMENT_TYPES: Final[tuple[str, ...]] = (
    "full_time",
    "part_time",
    "contract",
)

JOB_TYPES: Final[tuple[str, ...]] = (
    "permanent",
    "temporary",
    "internship",
)

EXPERIENCE_LEVELS: Final[tuple[str, ...]] = (
    "junior",
    "mid_level",
    "senior",
)

WorkPolicy = Literal["remote", "hybrid", "on_site"]
EmploymentType = Literal["full_time", "part_time", "contract"]
JobType = Literal["permanent", "temporary", "internship"]
ExperienceLevel = Literal["junior", "mid_level", "senior"]
