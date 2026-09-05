# Career Page Builder — Backend

FastAPI API for the multi-tenant Careers Page Builder.

## Stack

- FastAPI
- SQLAlchemy 2.0
- Alembic
- PostgreSQL
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

Ensure PostgreSQL is running and `DATABASE_URL` in `.env` is correct.

```bash
alembic upgrade head
uvicorn app.main:app --reload --port 8000
```

Health check: [http://localhost:8000/api/v1/health](http://localhost:8000/api/v1/health)

API docs: [http://localhost:8000/docs](http://localhost:8000/docs)

## Tests

```bash
pytest
```
