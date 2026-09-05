# AGENT_LOG.md

Short log of how I used AI (mostly Cursor) while building this assignment. Not a transcript dump — just the useful bits.

---

## Tools

- **ChatGPT** — early brainstorming, understanding the business problem, and later review passes (does this MVP actually answer the brief?)
- **Cursor Agent / Composer** — majority of scaffolding, coding, and refactors
- **Cursor sub-agents** — parallel explore / research when I needed to find stuff across the monorepo or audit completeness without clogging the main chat
- Occasional paste of API errors / stack traces back into chat instead of guessing

I did **not** let the model write this log, the README, or the tech spec as a first draft of “perfect submission docs.” Those I wrote myself after the code was mostly done. (If you’re reading polished markdown, that’s still me editing for clarity.)

---

## ChatGPT (brainstorm + review)

Used this *before* and *around* coding, not as the main code generator.

**Initial brainstorming / business problem**

- What recruiters actually need vs what looks flashy on a careers page
- Multi-tenant mental model: one company → one public page → many jobs
- Draft vs live: how edits stay safe until publish
- Scope cuts: no apply flow, keep mobile browse solid, SEO “good enough” for SPA MVP

Helped me turn the Whitecarrot brief into a short PRD-ish checklist instead of jumping straight into UI.

**Reviewing**

- Pasted feature lists / route maps and asked “what’s missing vs the assignment?”
- Sense-checked assumptions (1 recruiter per company, JSONB page config, etc.)
- Used it as a second opinion on README/tech-spec structure before I finalized wording myself

ChatGPT was better for *thinking*; Cursor was better for *building in the repo*.

---

## Cursor sub-agents

When the main agent chat got noisy, I spun up **sub-agents** for bounded jobs:

- **Explore** — “where is draft publish handled?”, “list public routes / job filter code”, quick codebase maps
- **Assignment / completeness checks** — compare repo against the brief (recruiter features, candidate browse, deploy docs) without mixing that audit into an active coding thread
- Occasional **parallel lookups** — e.g. backend schema vs frontend editor types when they drifted

Pattern that worked: main chat keeps implementing; sub-agent returns a short report; I decide what to fix next. Kept context cleaner than one giant infinite thread.

---

## Where AI helped a lot

### 1. Project skeleton

Early prompt vibe: *FastAPI + SQLAlchemy 2 + Alembic + React/Vite/Tailwind/shadcn, layered router → service → repository.*

Got a clean folder layout fast. I still had to enforce the layering myself when the agent tried to put logic in routers.

### 2. Draft vs published

I asked it to propose how to store page config per company. First idea was two rows / version table. I pushed back and locked:

- one `careers_pages` row
- `draft_config` + `published_config` JSONB
- publish = copy in a transaction

That decision stuck; later prompts referenced it so the agent stopped reinventing it.

### 3. Editor UX

Heavy AI use here: autosave indicator, unsaved-changes guard, dnd-kit section reorder, device preview frames. First passes were noisy (too many buttons, card-heavy). I kept saying things like “simplify the chrome” and “preview should feel like the public page.”

### 4. Job search

Asked for location + job type filters and title search. First version was only exact match. I asked for something more candidate-friendly → ended up with Fuse.js + a small rule-based parser for phrases. I trimmed some of the “AI natural language” ambition so it stayed understandable.

### 5. Tests & seed

Useful for generating pytest fixtures and the idempotent `seed_demo` script against the sample CSV. I still ran the tests and fixed assertion mismatches myself.

### 6. Deploy docs

Render + Vercel + Neon wiring — AI drafted the env var tables; I verified against what actually worked and cut the wrong advice (e.g. free Render pre-deploy hooks).

---

## Where I overruled AI

| Suggestion | What I did instead |
| --- | --- |
| Purple gradient / generic SaaS landing look | Kept a calmer brand-driven public theme driven by company colors |
| Culture video + apply form in MVP | Skipped — brief said browse only; video deferred |
| Put business logic in FastAPI route handlers | Forced service layer every time |
| Huge “design system” abstraction early | Started with real section types, extracted presets later |
| Exact assignment routes `/:slug/edit` | Used `/careers-page` inside auth shell + `/careers/:slug` public — clearer for this SPA |

---

## Example prompts that worked

These are paraphrased, not copy-paste magic spells:

1. *“Add draft autosave for careers page config. Debounce PATCH. Show idle/dirty/saving/saved/error. Don’t publish on save.”*
2. *“Public jobs: filter by location and job_type, search title with fuzzy match. Keep it client-side for MVP.”*
3. *“Seed script: upsert demo company + user, wipe that company’s jobs, import sample_jobs.csv. Idempotent.”*
4. *“Don’t change architecture. Fix the failing test only.”* ← this last line saved me from drive-by refactors.

---

## Example prompts that wasted time

- “Make the editor beautiful” with no constraints → pretty but inconsistent with the rest of the app
- Asking for SSR SEO in one shot while the app is still a Vite SPA → lots of theory, little shippable code
- Huge multi-file “implement everything in TASKS.md” prompts → context got muddy; smaller vertical slices worked better

---

## Learnings

1. **Lock decisions in a file** (`DECISIONS.md`) and point the agent at them. Stops thrashing on draft/publish and tenancy.
2. **Small prompts beat epic ones.** One feature, one PR-sized change.
3. **AI is great at boilerplate, mediocre at product taste.** I spent real time on recruiter editor clarity and public page calmness myself.
4. **Always run the tests / click the happy path.** Generated tests sometimes tested the wrong thing confidently.
5. **Deployment is half the assignment.** I should have wired Render CORS + Vercel `VITE_API_BASE_URL` earlier; cold starts and upload ephemerality surprised me the first time.

---

## Rough timeline of AI use by phase

| Phase | AI role |
| --- | --- |
| Brief → problem framing | ChatGPT — brainstorm + scope |
| Scaffold backend/frontend | Cursor — generate structure |
| Auth + company + jobs models | Cursor medium — I drove schema |
| Careers editor + preview | Cursor high — UI iteration |
| Public page + search | Cursor medium — logic reviews |
| “Are we done?” audits | Cursor sub-agents + ChatGPT review |
| Polish / a11y / tests | Cursor medium |
| Deploy + docs | Low–medium — I wrote the narrative docs |

---

## Bottom line

ChatGPT helped me understand the business problem and pressure-test scope. Cursor (including sub-agents for explore/audits) got the monorepo built. The parts that feel “product-y” (draft/publish rules, editor restraint, what not to build) came from me pushing back on the defaults. Workflow I’d keep: think → generate → edit hard.
