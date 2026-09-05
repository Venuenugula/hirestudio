# Deployment

Backend → [Render](https://render.com) · Frontend → [Vercel](https://vercel.com) · Database → Neon (existing `DATABASE_URL`)

## Prerequisites

1. Push the latest code to GitHub (`origin`: `hirestudio`).
2. Neon Postgres is reachable (same `DATABASE_URL` you use locally, or a production branch).
3. Accounts on Render and Vercel linked to the same GitHub repo.

---

## 1. Backend on Render

### Option A — Blueprint (recommended)

1. Open [Render Dashboard](https://dashboard.render.com) → **New** → **Blueprint**.
2. Connect the GitHub repo and select `render.yaml` at the repo root.
3. When prompted, set:
   - **`DATABASE_URL`** — Neon connection string (`postgresql://...` or `postgresql+psycopg://...` with `sslmode=require`).
   - **`CORS_ORIGINS`** — leave a placeholder for now (e.g. `https://localhost`); update after Vercel deploy.
4. Deploy. Note the service URL, e.g. `https://career-page-builder-api.onrender.com`.

### Option B — Manual Web Service

| Setting | Value |
| --- | --- |
| Root Directory | `backend` |
| Runtime | Python 3 |
| Build Command | `pip install .` |
| Pre-Deploy Command | `alembic upgrade head` |
| Start Command | `uvicorn app.main:app --host 0.0.0.0 --port $PORT` |
| Health Check Path | `/api/v1/health` |

**Environment variables**

| Key | Value |
| --- | --- |
| `DATABASE_URL` | Neon URL |
| `JWT_SECRET_KEY` | long random secret (Render can generate) |
| `APP_ENV` | `production` |
| `DEBUG` | `false` |
| `CORS_ORIGINS` | your Vercel origin(s), comma-separated |
| `UPLOAD_DIR` | `./uploads` |
| `PYTHON_VERSION` | `3.12.8` |

### Verify

```text
GET https://<your-render-host>/api/v1/health
```

### Notes

- Free Render services sleep after inactivity; the first request can take ~30–60s.
- Uploaded logos/banners are stored on the instance disk and are **ephemeral** on free plans (lost on redeploy). Fine for MVP; use object storage later for production.

Optional seed (one-off via Render Shell):

```bash
python -m app.scripts.seed_demo
```

---

## 2. Frontend on Vercel

1. [Vercel Dashboard](https://vercel.com/new) → Import the GitHub repo.
2. Configure:
   - **Root Directory**: `frontend`
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `dist` (default)
3. **Environment variable** (Production + Preview):

   | Key | Value |
   | --- | --- |
   | `VITE_API_BASE_URL` | `https://<your-render-host>` (no trailing slash) |

4. Deploy. Note the URL, e.g. `https://hirestudio.vercel.app`.

### SPA routing

`frontend/vercel.json` rewrites non-asset routes to `index.html` for React Router.

---

## 3. Wire CORS

In Render, set:

```env
CORS_ORIGINS=https://hirestudio.vercel.app,https://hirestudio-*.vercel.app
```

Use exact production origin(s). For preview deploys, either:

- add each preview URL, or
- temporarily allow your production Vercel domain only and test against production API.

Redeploy the Render service after changing `CORS_ORIGINS`.

---

## 4. End-to-end checklist

- [ ] `GET /api/v1/health` returns OK on Render
- [ ] Frontend loads on Vercel
- [ ] Login / API calls succeed (no CORS errors in browser console)
- [ ] Public careers page loads (`/careers/<slug>`)
- [ ] Uploaded logo/banner URLs point at the Render host (`…/uploads/…`)

---

## Local vs production env

**Backend** (`backend/.env` locally; Render dashboard in prod):

```env
DATABASE_URL=...
CORS_ORIGINS=https://your-app.vercel.app
APP_ENV=production
DEBUG=false
JWT_SECRET_KEY=...
```

**Frontend** (Vercel env; never commit secrets):

```env
VITE_API_BASE_URL=https://your-api.onrender.com
```

Locally, leave `VITE_API_BASE_URL` empty so Vite proxies `/api` and `/uploads` to `localhost:8000`.
