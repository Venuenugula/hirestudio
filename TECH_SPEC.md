# Tech Spec — Careers Page Builder

## 1. Goal

Build a small multi-tenant product where recruiters brand and publish a careers page, and candidates browse that company’s open roles. No apply flow — browsing only.

This doc covers the assumptions I locked early, how the system is put together, the data model, and how I tested it.

---

## 2. Assumptions

These are the calls I made so I could ship a usable MVP instead of boiling the ocean:

1. **One recruiter per company.** Registration creates a company + user together. Good enough for the assignment; real ATS would have teams/roles later.
2. **Tenant boundary = company.** Everything (page config, jobs, media) hangs off `company_id`. Public URLs use a unique `slug`.
3. **URL shape.** Assignment suggested `/:slug/careers` and `/:slug/edit`. I went with:
   - Recruiter workspace: `/login`, `/dashboard`, `/company`, `/careers-page`, `/jobs`
   - Public: `/careers/:slug` and `/careers/:slug/jobs/:jobId`  
   Same idea, slightly cleaner for a SPA with an authenticated shell.
4. **Draft ≠ live.** Edits go to `draft_config`. Candidates only see `published_config` after an explicit Publish. Preview uses draft.
5. **Page layout lives in JSONB.** Sections change often; I didn’t want a migration every time I add a section type. Relational tables stay for company / user / job.
6. **Brand assets.** Logo + banner upload to the API disk (`./uploads`). Culture video is *not* in this MVP — about/copy sections cover storytelling instead. Object storage (S3) is the obvious next step.
7. **Jobs.** Recruiters can CRUD jobs in-app. Demo seed loads the Whitecarrot sample CSV into one demo company.
8. **Auth.** Email/password + JWT access token. No OAuth, no refresh tokens for now.
9. **Hosting.** Frontend on Vercel, API on Render free tier, Postgres on Neon. Free Render sleeps — cold start is expected.
10. **SEO.** Client-set document title + meta description on public pages. Full SSR/structured data would be nicer later; SPA meta is what I shipped.

---

## 3. Architecture

### Stack

| Layer | Choice | Why |
| --- | --- | --- |
| Frontend | React 19, Vite, TypeScript, Tailwind, shadcn/ui | Fast UI iteration, typed editor, decent a11y primitives |
| Server state | TanStack Query | Caching + invalidation for draft autosave / public fetch |
| Forms | React Hook Form + Zod | Brand + section forms without reinventing validation |
| Backend | FastAPI, Pydantic v2 | Typed API, OpenAPI docs out of the box |
| ORM / migrations | SQLAlchemy 2.0 + Alembic | Clear models, evolvable schema |
| DB | PostgreSQL (Neon) | JSONB + indexes; no local Postgres required |
| Deploy | Vercel (FE) + Render (API) | Free-tier friendly, fits monorepo |

### Request flow

```
Browser (React)
    → REST /api/v1/*
        → Router (HTTP only)
            → Service (rules)
                → Repository (SQL)
                    → PostgreSQL
```

I kept this layering on purpose. Routers don’t own business rules; services don’t write raw SQL. Makes tests and later refactors less painful.

### Frontend layout

Feature folders under `frontend/src/features/`:

- `auth` — login / register
- `company` — branding, logo/banner
- `pages` — careers page editor (sections, theme, preview, publish)
- `jobs` — recruiter job list/CRUD
- `public` — candidate careers + job detail
- `dashboard` — workspace home

Shared UI lives in `components/ui` (shadcn) and `components/layout`.

### Multi-tenancy

- Authenticated routes resolve the company from the JWT user (`/me` style endpoints).
- Public routes resolve by `slug` only and never return draft config.
- Jobs are always scoped by `company_id` (DB indexes on `(company_id, is_active)`, title, posted_at).

### Draft / publish

One `careers_pages` row per company:

| Column | Role |
| --- | --- |
| `draft_config` | What the editor autosaves / previews |
| `published_config` | What `/careers/:slug` renders |
| `published_at` | Last successful publish |

Publish = copy draft → published in one transaction. No version history table yet.

### Page config shape (JSONB)

Rough structure:

```json
{
  "theme": {
    "primaryColor": "#0F172A",
    "secondaryColor": "#F8FAFC",
    "styleId": "...",
    "themePackId": "...",
    "fontId": "...",
    "radiusId": "...",
    "buttonStyle": "..."
  },
  "template": { "id": "professional_starter", "version": 1 },
  "sections": [
    { "id": "...", "type": "hero", "title": "...", "subtitle": "...", "ctaLabel": "..." },
    { "id": "...", "type": "about", "title": "...", "body": "..." },
    { "id": "...", "type": "benefits", "title": "...", "items": [] },
    { "id": "...", "type": "open_roles", "title": "...", "subtitle": "..." },
    { "id": "...", "type": "cta", "title": "...", "subtitle": "...", "buttonLabel": "..." }
  ]
}
```

Section order in the array = render order. Editor supports add / remove / reorder (dnd-kit) and hide.

New companies get a **professional starter** template from the backend so the page isn’t empty on first open.

---

## 4. Schema

All primary keys are UUIDs. Timestamps are timezone-aware.

### `companies`

| Field | Notes |
| --- | --- |
| id | UUID PK |
| name | Display name |
| slug | Unique, public URL key |
| logo_url, banner_url | Paths/URLs to uploaded assets |
| website, industry, company_size | Optional profile |
| primary_color, secondary_color | Brand defaults (also mirrored in page theme) |
| is_active | Soft kill switch |
| created_at, updated_at | |

### `users`

| Field | Notes |
| --- | --- |
| id | UUID PK |
| company_id | 1:1 with company |
| full_name, email | Email unique |
| password_hash | bcrypt via pwdlib |
| is_active | |

### `careers_pages`

| Field | Notes |
| --- | --- |
| id | UUID PK |
| company_id | Unique FK → companies |
| draft_config | JSONB |
| published_config | JSONB |
| published_at | Nullable |
| created_at, updated_at | |

### `jobs`

| Field | Notes |
| --- | --- |
| id | UUID PK |
| company_id | FK → companies |
| title, department, location | Filter/search inputs |
| employment_type, work_policy, experience_level, job_type | Structured filters |
| salary_range | Optional display string |
| description | Text / markdown-ish body |
| is_active | Only active jobs on public page |
| application_url | Optional outbound link (no in-app apply) |
| posted_at | Sorting / “posted X ago” |
| created_at, updated_at | |

Migrations live under `backend/alembic/versions/` (`0001` … `0004`).

### Main API surface

| Area | Endpoints (prefix `/api/v1`) |
| --- | --- |
| Health | `GET /health` |
| Auth | `POST /auth/register`, `POST /auth/login`, `GET /auth/me`, `POST /auth/logout` |
| Company | `GET/PATCH /companies/me`, `POST /companies/me/media` |
| Careers page | `GET /careers-pages/me`, `PATCH .../draft`, `POST .../publish` |
| Jobs | CRUD under `/jobs` (auth) |
| Public | `GET /public/{slug}`, `GET /public/{slug}/jobs/{job_id}` |

Exact path prefixes match the routers in `backend/app/api/v1/`.

---

## 5. Key product flows

### Recruiter

1. Register → company created with slug + empty/starter careers page.
2. Update company brand (colors, logo, banner) on `/company`.
3. Edit sections/theme on `/careers-page` (autosave draft).
4. Preview in-editor (desktop/tablet/mobile frames).
5. Publish → public link `/careers/{slug}` is shareable.
6. Manage jobs on `/jobs` (or seed sample CSV for demos).

### Candidate

1. Open `/careers/{slug}`.
2. Read hero / about / benefits / CTA from published config.
3. Search by title (fuzzy) and filter by location / job type / etc.
4. Open a job detail page. Apply is out of scope (optional external URL if set).

---

## 6. Test plan

### Automated

**Backend** (from `backend/` with venv + `pip install -e ".[dev]"`):

```bash
pytest
```

Covers health, auth, company, careers page (service/repo/API), jobs, CSV import, public API, page templates. Uses test fixtures in `tests/conftest.py`.

**Frontend** (from `frontend/`):

```bash
npm test
```

Unit tests for page-config helpers, job search/filter logic, asset URL helpers, job description parsing.

### Manual checklist (what I actually click through)

**Happy path**

- [ ] Register a new company, land in workspace
- [ ] Upload logo + banner, change primary color, save
- [ ] Add / reorder / delete sections; confirm autosave indicator
- [ ] Preview mobile width looks usable
- [ ] Publish; open `/careers/{slug}` in a private window
- [ ] Search jobs by title; filter location + job type
- [ ] Open job detail; back to list works

**Edge / safety**

- [ ] Unpublished draft changes are **not** visible publicly
- [ ] Wrong password fails cleanly
- [ ] Invalid slug → sensible empty/error state
- [ ] Inactive job doesn’t show on public list
- [ ] Leaving editor with dirty state warns (unsaved guard)

**Demo seed**

```bash
cd backend
python -m app.scripts.seed_demo
```

Login: `demo@demo-careers.com` / `demo-password-123`  
Public: `/careers/demo-careers`

**Deploy smoke**

- [ ] `GET {API}/api/v1/health`
- [ ] Login from Vercel origin (no CORS errors)
- [ ] Public page loads with brand + jobs
- [ ] Uploaded image URLs resolve against the API host

### Out of scope for this test plan

- Load / soak testing hundreds of tenants
- Cross-browser matrix beyond Chromium + one mobile viewport
- Apply-form E2E (feature not built)

---

## 7. Scaling notes (if this went real)

- Move uploads to S3/R2; don’t trust Render disk.
- CDN + maybe SSR or prerender for public SEO / JobPosting JSON-LD.
- Cache public page payloads (short TTL) keyed by slug + `published_at`.
- Split read replicas if job browse gets hot; keep publish writes on primary.
- Team accounts, audit log, and config version history before selling to larger customers.

That’s the intentional ceiling for this assignment build — solid MVP, clear upgrade path.
