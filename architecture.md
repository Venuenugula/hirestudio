# Architecture

## Tech Stack

Frontend

- React
- TypeScript
- Vite
- TailwindCSS
- shadcn/ui
- TanStack Query
- React Router

Backend

- FastAPI
- SQLAlchemy 2.0
- PostgreSQL
- Alembic
- Pydantic v2

Storage

- Local Storage (Development)
- S3 Compatible Storage (Future)

Deployment

Frontend
- Vercel

Backend
- Render

Database
- PostgreSQL

---

## Architecture

React

↓

REST API

↓

FastAPI

↓

Service Layer

↓

Repository Layer

↓

PostgreSQL

---

## Backend Layers

Router

↓

Service

↓

Repository

↓

Database

Responsibilities

Router

- HTTP only

Service

- Business logic

Repository

- Database access

Database

- Persistence

---

## Frontend Structure

Pages

↓

Features

↓

Components

↓

Hooks

↓

API

---

## Design Principles

- Layered Architecture
- Repository Pattern
- Separation of Concerns
- Strong Typing
- Feature-based Frontend
- Reusable Components