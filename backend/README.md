# Career Page Builder — Backend

FastAPI API for the multi-tenant Careers Page Builder.

## Stack

- FastAPI
- SQLAlchemy 2.0
- Alembic
- PostgreSQL (Neon via `DATABASE_URL`)
- psycopg v3
- Pydantic v2

## Architecture

```
Router → Service → Repository → Database
```

Business logic lives in services. Routers stay HTTP-only. Repositories only access the database.

## Setup

```bash
python -m venv .venv
# Windows
.venv\Scripts\activate
# macOS / Linux
source .venv/bin/activate

pip install -e ".[dev]"
cp .env.example .env
```

Set `DATABASE_URL` in `.env` to your Neon connection string (do not hardcode credentials in source):

```env
DATABASE_URL=postgresql+psycopg://USER:PASSWORD@ep-xxxx.region.aws.neon.tech/neondb?sslmode=require
```

Plain `postgresql://` / `postgres://` URLs from the Neon UI are accepted and normalized to the psycopg v3 driver automatically.

### Verify database connectivity

```bash
python scripts/check_db_connection.py
```

Expected output includes `Database connection OK`.

### Migrations

```bash
alembic upgrade head
```

Create a new revision after adding models:

```bash
alembic revision --autogenerate -m "describe_change"
alembic upgrade head
```

### Seed demo data

```bash
alembic upgrade head
python -m app.scripts.seed_demo
```

Creates demo company `demo-careers`, recruiter user, published careers page, and 150 sample jobs.

Default login: `demo@demo-careers.com` / `demo-password-123`

Public page: `/careers/demo-careers`. Re-running the seed wipe-reloads demo jobs.

CSV path defaults to `backend/data/sample_jobs.csv`.

### Run API

```bash
uvicorn app.main:app --reload --port 8000
```

Health check: [http://localhost:8000/api/v1/health](http://localhost:8000/api/v1/health)

API docs: [http://localhost:8000/docs](http://localhost:8000/docs)

## Tests

```bash
pytest
```

ORM models should inherit from `TimestampedBase` (`id`, `created_at`, `updated_at`). Inject DB sessions with `DbSession` from `app.dependencies`.
