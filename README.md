# HireStudio — Careers Page Builder

Small multi-tenant app for recruiters to build a branded careers page and for candidates to browse open roles.

Built for the Whitecarrot take-home. Stack is FastAPI + Postgres on the backend, React/Vite on the frontend.

**Repo:** https://github.com/Venuenugula/hirestudio  
**Docs:** [TECH_SPEC.md](./TECH_SPEC.md) · [AGENT_LOG.md](./AGENT_LOG.md) · [docs/deployment.md](./docs/deployment.md)

> Replace the production URL below once your Vercel deploy is live.  
> **Live app:** _add your Vercel URL here_  
> **API:** _add your Render URL here_

---

## What I built

### For recruiters

- Sign up / log in (JWT)
- Company profile: name, colors, logo + banner upload
- Careers page editor: theme packs, fonts, section add/remove/reorder
- Live preview (desktop / tablet / mobile frames)
- Autosave draft + explicit **Publish**
- Job management (create/edit/deactivate) + CSV sample seed
- Shareable public link: `/careers/{company-slug}`

### For candidates

- Branded public careers page from published config
- Job list with search (title) and filters (location, job type, etc.)
- Job detail view
- Responsive layout, keyboard-focusable controls, meta title/description

### What I skipped on purpose

- In-app job applications (browse only, as the brief asked)
- Culture video embed (logo/banner + About section instead)
- Custom domains, analytics, multi-recruiter teams

---

## Monorepo layout

```
career-page-builder/
├── backend/          FastAPI API, Alembic, seed script, sample CSV
├── frontend/         React + Vite app
├── docs/             Deployment runbook
├── TECH_SPEC.md      Assumptions, architecture, schema, test plan
├── AGENT_LOG.md      How I used AI while building
├── README.md         You are here
└── render.yaml       Render blueprint for the API
```

---

## How to run locally

### Prerequisites

- Python 3.11+
- Node 20+ (or recent LTS)
- A Neon (or any Postgres) connection string

### 1. Backend

```bash
cd backend
python -m venv .venv

# Windows
.venv\Scripts\activate

# macOS / Linux
# source .venv/bin/activate

pip install -e ".[dev]"
cp .env.example .env
```

Edit `backend/.env` and set `DATABASE_URL` (Neon URL with `sslmode=require` is fine). Prefer:

```text
postgresql+psycopg://USER:PASSWORD@HOST/neondb?sslmode=require
```

Then:

```bash
python scripts/check_db_connection.py
alembic upgrade head
uvicorn app.main:app --reload --port 8000
```

Optional demo data (company + sample jobs from the assignment spreadsheet):

```bash
python -m app.scripts.seed_demo
```

Demo login after seed:

- Email: `demo@demo-careers.com`
- Password: `demo-password-123`
- Public page: http://localhost:5173/careers/demo-careers

Sample CSV lives at `backend/data/sample_jobs.csv`.

### 2. Frontend

```bash
cd frontend
npm install
cp .env.example .env   # leave VITE_API_BASE_URL empty for local proxy
npm run dev
```

Open http://localhost:5173

Locally the Vite proxy forwards `/api` and `/uploads` to `localhost:8000`, so you usually don’t set `VITE_API_BASE_URL`.

### Useful URLs

| What | URL |
| --- | --- |
| App | http://localhost:5173 |
| Login | http://localhost:5173/login |
| API health | http://localhost:8000/api/v1/health |
| OpenAPI | http://localhost:8000/docs |

### Tests

```bash
# backend
cd backend && pytest

# frontend
cd frontend && npm test
```

---

## Deploy (short version)

Full steps: [docs/deployment.md](./docs/deployment.md)

1. **Neon** — create DB, copy `DATABASE_URL`
2. **Render** — deploy `backend` (or use root `render.yaml`), set env vars, note API URL
3. **Vercel** — import repo, root = `frontend`, set `VITE_API_BASE_URL` to the Render URL
4. Set Render `CORS_ORIGINS` to your Vercel origin(s) and redeploy API

---

## Step-by-step user guide

### Recruiter — first careers page

1. Go to `/register`, create an account (this also creates your company).
2. Open **Company** in the sidebar. Set colors, upload logo/banner, save.
3. Open **Careers page**.
4. Tweak theme / section copy. Drag sections to reorder. Changes autosave as draft.
5. Use the preview toolbar to check mobile.
6. Hit **Publish**.
7. Copy the public link from the UI (or open `/careers/{your-slug}`).

### Recruiter — jobs

1. Go to **Jobs**.
2. Add roles manually, or run `seed_demo` for a full sample set on the demo company.
3. Only active jobs show on the public page after publish (page content) — job list itself is live from the jobs API for that company.

### Candidate

1. Open `/careers/{slug}`.
2. Read the company story sections.
3. Use search + filters to narrow roles.
4. Open a job for the full description.

---

## Improvement plan (if this continued)

**Soon**

- Object storage for logos/banners (Render disk is ephemeral on free tier)
- JobPosting JSON-LD + better crawlability (SSR or prerender public routes)
- Culture video URL field on brand / about section
- Match assignment URLs exactly if a partner prefers `/:slug/careers`

**Later**

- Custom domains per company
- Version history / rollback for published pages
- Multiple recruiters + roles per company
- Analytics (views, job clicks)
- Real apply flow or deep-link into an ATS

**Scale worries I’d watch**

- Public page cache keyed by slug + `published_at`
- Cold starts on free Render
- Search shifting server-side once job counts get large

---

## Notes for reviewers

- Architecture decisions: [DECISIONS.md](./DECISIONS.md)
- Longer architecture sketch: [architecture.md](./architecture.md)
- How I used Cursor/AI: [AGENT_LOG.md](./AGENT_LOG.md)
- Assumptions + schema + test plan: [TECH_SPEC.md](./TECH_SPEC.md)
