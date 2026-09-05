# Cursor Engineering Guidelines

Always follow these rules.

## General

- Write production quality code.
- Keep functions focused.
- Prefer readability over cleverness.
- Use descriptive names.
- Never duplicate business logic.

---

## Backend

Use

- FastAPI
- SQLAlchemy 2.0
- Alembic
- Pydantic v2

Rules

- Never place business logic inside routers.
- Services contain business logic.
- Repositories only access the database.
- Use dependency injection.
- Return Pydantic schemas.
- Use UUID primary keys.

---

## Database

- PostgreSQL
- Alembic migrations
- JSONB for page configuration
- Proper indexes
- Foreign keys
- Transactions where needed

---

## Frontend

Use

- React
- TypeScript
- TailwindCSS
- shadcn/ui

Rules

- Functional components only.
- Keep components reusable.
- Separate UI from business logic.
- Use React Query for server state.
- Use React Hook Form for forms.
- Validate using Zod.

---

## Code Style

- Strong typing
- Small files
- Reusable utilities
- Minimal comments
- Consistent formatting

---

## Architecture

Always preserve

Router

↓

Service

↓

Repository

↓

Database

Never skip layers.