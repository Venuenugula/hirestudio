# Career Page Builder — Frontend

React SPA for recruiters and the public careers experience.

## Stack

- React + TypeScript + Vite
- Tailwind CSS v4
- shadcn/ui
- React Router
- TanStack Query
- next-themes + Sonner

## Setup

```bash
npm install
cp .env.example .env
npm run dev
```

App: http://localhost:5173

Leave `VITE_API_BASE_URL` empty in local development to use the Vite proxy to `http://127.0.0.1:8000`.

## Scripts

| Script | Purpose |
|--------|---------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Typecheck + production build |
| `npm run preview` | Preview production build |
| `npm run lint` | Lint with oxlint |

## Structure

```
src/
├── api/                 # HTTP client, query keys, endpoint helpers
├── components/
│   ├── layout/          # Sidebar, header
│   ├── shared/          # PageHeader, EmptyState, etc.
│   └── ui/              # shadcn primitives
├── features/            # Domain feature modules (mirrors backend)
├── hooks/               # Shared TanStack Query hooks
├── layouts/             # App / Auth shells
├── lib/                 # utils, toast helpers
├── providers/           # Query, theme, toaster
└── routes/              # Route tree + path constants
```

## Routes

- `/` — foundation home + health check sample
- `/login` — auth placeholder (no sidebar)
- `/dashboard`, `/company`, `/careers-page`, `/jobs` — app shell placeholders
