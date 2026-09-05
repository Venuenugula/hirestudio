# Career Page Builder — Frontend

React SPA for recruiters and the public careers experience.

## Stack

- React + TypeScript + Vite
- Tailwind CSS v4
- shadcn/ui (configured via `components.json`)
- React Router
- TanStack Query
- React Hook Form + Zod

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
├── api/           # HTTP client and endpoint helpers
├── components/ui/ # shadcn primitives
├── features/      # Domain feature modules
├── hooks/         # Shared hooks
├── layouts/       # App shells
├── lib/           # Shared libraries (cn, etc.)
├── providers/     # React context providers
├── routes/        # Route tree and page components
├── types/         # Shared types
└── utils/         # Pure helpers
```
