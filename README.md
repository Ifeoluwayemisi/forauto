# ─────────────────────────────────────────────────────────────
# FORauto

Automotive Services & Vehicle Solutions — Lagos, Nigeria.

A digital platform for an established automotive workshop: a public
website, a customer service-request workflow, and an internal operations
system for requests, appointments, jobs, technicians and service history.

**Experienced hands. Modern service.**

---

## Status

The repository is at the **technical foundation** stage
(`docs/ROADMAP.md` §7, Phase 2). Planning and architecture are complete;
no product feature has been implemented yet.

| Area | State |
| --- | --- |
| Planning documents | Complete (`docs/`) |
| Monorepo, tooling, environment config | Complete |
| Database schema and migrations | Complete (14 MVP tables) |
| API foundation (health, errors, logging, request IDs) | Complete |
| Web foundation (Next.js, Tailwind, tokens, boundaries) | Complete |
| Public website | Not started (Phase 3) |
| Service requests, admin system | Not started (Phase 4, 5) |

There is deliberately **no homepage, no service catalogue and no sample
data** at this stage. Business information that has not been confirmed
must not be invented — see `AGENTS.md` §7, §8 and `docs/ROADMAP.md` §5.

---

## Architecture

Modular monolith. Next.js → Node.js REST API → PostgreSQL.

```text
forauto/
├── apps/
│   ├── web/          Next.js — public site, customer area, admin
│   └── api/          Node.js + Fastify — REST API at /api/v1
├── packages/
│   ├── config/       Shared tsconfig bases and design tokens
│   ├── types/        Shared status vocabularies and API contract types
│   └── ui/           Shared UI primitives (not yet built)
├── database/
│   └── migrations/   Version-controlled SQL migrations
├── docs/             Product and technical documentation
├── AGENTS.md         Project rules for AI coding agents and humans
└── .env.example      Environment variable reference
```

`docs/ARCHITECTURE.md` §57 is the authoritative description.

### Key constraints

- **PostgreSQL via `pg` only.** No Prisma, Drizzle, Sequelize or TypeORM
  (`AGENTS.md` §5, `docs/API.md` §63).
- **No microservices.** The backend is one deployable, organised into
  domain modules (`docs/ARCHITECTURE.md` §2.1).
- **The backend owns business rules.** Status transitions, authorization
  and ownership checks are validated server-side and are never duplicated
  in the frontend (`AGENTS.md` §6, `docs/ARCHITECTURE.md` §47).
- **No fake production data.** Empty states are designed, not filled with
  invented records (`AGENTS.md` §7, §25).

---

## Prerequisites

- Node.js **22+** (developed against 22.18.0)
- npm **10+**
- PostgreSQL **15+** (developed against 17)

---

## Setup

```bash
npm install
cp .env.example .env      # then fill in DATABASE_URL
npm run migrate           # create the schema
```

Run the two applications in separate terminals:

```bash
npm run dev:api           # http://localhost:4000
npm run dev:web           # http://localhost:3000
```

Verify the API is up:

```bash
curl http://localhost:4000/health
curl http://localhost:4000/health/ready
```

---

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev:web` | Start the Next.js dev server on port 3000 |
| `npm run dev:api` | Start the API with reload on port 4000 |
| `npm run build` | Build every workspace |
| `npm run typecheck` | Type-check every workspace |
| `npm run lint` | Biome lint + format check |
| `npm run lint:fix` | Apply safe lint fixes |
| `npm run format` | Format the repository |
| `npm test` | Run the test suite |
| `npm run migrate` | Apply pending SQL migrations |
| `npm run migrate:status` | List applied and pending migrations |

### Runtime model

There is one module-resolution model across the whole repository:
**TypeScript source, no compiled JavaScript bundles.**

- `apps/web` bundles its own source through Next.js; the shared `packages/*`
  are compiled in via `transpilePackages`.
- `apps/api` runs its TypeScript directly through `tsx`, in development and
  in production alike. `tsx` is a production dependency for that reason.

This keeps the shared packages free of a build step and therefore free of
build-order coupling, at the cost of requiring a TypeScript loader in the
API's runtime image. Emitting compiled JavaScript is a deployment-time
decision, not a foundation requirement (`AGENTS.md` §37); if it is
introduced later, `apps/api` and `packages/*` must be updated together.

`npm run build` therefore type-checks the API (there is nothing to emit)
and produces the real production bundle for `apps/web`.

---

## Environment variables

`.env.example` is the reference and is kept in sync with the code. Copy it
to `.env`; `.env` is git-ignored and must never be committed
(`AGENTS.md` §44).

Business contact details (phone, WhatsApp, opening hours) are
**unconfirmed** and are deliberately left blank. Do not invent them.

---

## Database

Migrations are plain, ordered, reviewable SQL files in
`database/migrations`, applied by a small runner (`apps/api/scripts/migrate.ts`).
Each file runs in its own transaction and is recorded in
`schema_migrations` with a checksum, so an already-applied file cannot be
silently edited.

```text
database/migrations/
├── 001_extensions.sql
├── 002_enums.sql
├── 003_users.sql
├── 004_customers.sql
├── 005_staff.sql
├── 006_vehicles.sql
├── 007_media.sql
├── 008_service_requests.sql
├── 009_appointments.sql
├── 010_jobs.sql
├── 011_service_records.sql
└── 012_work_items.sql
```

The schema covers the MVP table set in `docs/ROADMAP.md` §7.4. Tables for
inspections, reviews, notifications and vehicle listings are intentionally
absent — they are P1/P2 and their business processes are not yet confirmed
(`AGENTS.md` §36, `docs/DATABASE.md` §51).

Never modify a deployed database by hand. Add a migration
(`AGENTS.md` §15, §40).

---

## Working on this repository

Read `AGENTS.md` first. It is the project rulebook: documentation-first
development, no invented business information, no fake data, and a
definition of done that spans schema, backend, validation, authorization,
frontend, states, accessibility, tests and documentation.

Documentation and implementation must move together. If an implementation
needs to deviate from `docs/`, update the relevant document in the same
change (`AGENTS.md` §3, `docs/API.md` §64).

---

## Documentation

| Document | Contents |
| --- | --- |
| `docs/PRD.md` | Product requirements and scope |
| `docs/PRODUCT_OVERVIEW.md` | What the product is, in plain terms |
| `docs/BRAND.md` | Brand direction and voice |
| `docs/USER_FLOWS.md` | Customer and staff journeys |
| `docs/DESIGN.md` | Design system, tokens, component direction |
| `docs/ARCHITECTURE.md` | Technical architecture |
| `docs/DATABASE.md` | Relational model and migration strategy |
| `docs/API.md` | REST API contract |
| `docs/ROADMAP.md` | Phased implementation order |

Start with `docs/PRODUCT_OVERVIEW.md` if you are new to the project, and
`AGENTS.md` if you are about to change something.
