# Engineering Decisions

## Why FastAPI?

FastAPI provides excellent developer productivity, type safety, automatic API documentation, and aligns with my experience building production APIs.

---

## Why React?

React offers a component-based architecture suitable for building dynamic editing interfaces.

---

## Why PostgreSQL?

Reliable relational database with JSONB support for flexible page configuration.

---

## Why JSONB?

Careers page sections evolve frequently. JSONB allows adding new section types without schema migrations while keeping structured business data relational.

---

## Why Layered Architecture?

Separating routing, business logic, and persistence improves maintainability, testing, and scalability.

---

## Why TanStack Query?

Provides efficient server-state management, caching, and request synchronization.

## Authentication

JWT Access Token
Email + Password


---

## Draft vs Published

One `CareersPage` row per company with two JSONB columns:

- `draft_config` — editable / preview
- `published_config` — what candidates see
- `published_at` — last publish timestamp

Publish copies `draft_config` → `published_config` in one transaction. No duplicate rows.