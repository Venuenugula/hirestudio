# Career Page Builder — Docs

## Canonical documents (repo root)

| Document | Purpose |
|----------|---------|
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

Use this folder for deeper design notes, ADRs, and runbooks as the project grows.
