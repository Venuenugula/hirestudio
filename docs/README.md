# Career Page Builder — Docs

## Canonical documents (repo root)

| Document | Purpose |
|----------|---------|
| [README.md](../README.md) | How to run, user guide, improvements |
| [TECH_SPEC.md](../TECH_SPEC.md) | Assumptions, architecture, schema, test plan |
| [AGENT_LOG.md](../AGENT_LOG.md) | How AI was used while building |
| [prd.md](../prd.md) | Product requirements |
| [architecture.md](../architecture.md) | System architecture |
| [AGENTS.md](../AGENTS.md) | Engineering guidelines for Cursor |
| [TASKS.md](../TASKS.md) | Implementation roadmap |
| [DECISIONS.md](../DECISIONS.md) | Architecture decision records |

## Draft vs published (locked)

One `CareersPage` row per company:

- `draft_config` (JSONB) — editable / preview
- `published_config` (JSONB) — candidate-facing
- `published_at` — last publish timestamp

Publish is an atomic copy of draft → published.

## Runbooks

| Document | Purpose |
|----------|---------|
| [deployment.md](./deployment.md) | Deploy backend (Render) + frontend (Vercel) |

Use this folder for deeper design notes, ADRs, and runbooks as the project grows.
