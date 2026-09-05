"""Initial schema foundation.

No business tables yet. Establishes the Alembic revision chain and
confirms migrations run against DATABASE_URL (Neon Postgres).

Future models inheriting from TimestampedBase will be added in later
revisions.
"""

from typing import Sequence, Union

revision: str = "0001_initial"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Intentionally empty: TimestampedBase is abstract and creates no tables.
    pass


def downgrade() -> None:
    pass
