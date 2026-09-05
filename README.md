# Career Page Builder

Multi-tenant platform for branded careers pages.

## Monorepo layout

```
career-page-builder/
├── backend/     # FastAPI + SQLAlchemy + Alembic
├── frontend/    # React + Vite + TypeScript
├── docs/        # Documentation index
├── prd.md
├── architecture.md
├── AGENTS.md
├── TASKS.md
└── DECISIONS.md
```

## Quick start

### Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate   # Windows
pip install -e ".[dev]"
cp .env.example .env
```

Set `DATABASE_URL` in `backend/.env` to your Neon Postgres connection string
(psycopg v3 form preferred; include `sslmode=require`). Then:

```bash
python scripts/check_db_connection.py
alembic upgrade head
uvicorn app.main:app --reload --port 8000
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Health

- API: http://localhost:8000/api/v1/health
- Docs: http://localhost:8000/docs
- App: http://localhost:5173

## Deployment

Backend on Render, frontend on Vercel (Neon for Postgres). See [docs/deployment.md](docs/deployment.md).
