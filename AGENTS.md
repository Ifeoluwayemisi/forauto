# FORauto — AI Coding Agent Guidelines

## 1. Project Overview

FORauto is a modern digital platform for an established automotive services business in Lagos, Nigeria.

The business has more than 20 years of hands-on automotive experience and provides mechanical, electrical, diagnostic, and other vehicle-related services.

The product is not just a marketing website.

It consists of:

* A public automotive website
* Customer service-request workflow
* Vehicle records
* Appointment management
* Job/work management
* Technician/staff assignment
* Service history
* Admin operations dashboard
* Media/work showcase
* Future vehicle inspection services
* Future vehicle sales assistance
* Future customer accounts and additional vehicle services

The core product principle is:

> **Digital should make the existing business better, not force the business to behave like a tech startup.**

The product should preserve the human, practical nature of the workshop while providing a significantly better digital experience.

---

# 2. Source of Truth

Before implementing functionality, inspect the relevant documentation in `/docs`.

The documentation is part of the architecture and must not be ignored.

Primary documents:

* `docs/PRD.md`
* `docs/PRODUCT_OVERVIEW.md`
* `docs/BRAND.md`
* `docs/USER_FLOWS.md`
* `docs/DESIGN.md`
* `docs/ARCHITECTURE.md`
* `docs/DATABASE.md`
* `docs/API.md`
* `docs/ROADMAP.md`

When documentation and an implementation assumption conflict, do not silently invent a new direction.

Determine whether the documentation needs to be updated first.

---

# 3. Documentation-First Development

Use the following rules when making changes.

### Product changes

If a change affects:

* user journeys
* product scope
* feature priorities
* business capabilities

Review and update:

`docs/PRD.md`

and/or

`docs/PRODUCT_OVERVIEW.md`

### UX changes

If a change affects:

* navigation
* customer flow
* forms
* interaction patterns
* information architecture

Review and update:

`docs/USER_FLOWS.md`

### Design changes

Before making significant visual/design changes:

1. Read `docs/DESIGN.md`.
2. Follow the existing design system.
3. If the design system itself must change, update `docs/DESIGN.md` before or alongside implementation.

Do not introduce a new visual direction simply because it looks good in isolation.

### Architecture changes

If changing:

* framework
* backend structure
* database access strategy
* API architecture
* authentication architecture
* infrastructure
* major dependencies

Update:

`docs/ARCHITECTURE.md`

before treating the new architecture as established.

### Database changes

Any schema change must be reflected in:

`docs/DATABASE.md`

and implemented through a version-controlled SQL migration.

### API changes

Any API contract change must be reflected in:

`docs/API.md`.

Do not allow frontend assumptions and backend behavior to drift apart.

### Roadmap changes

If scope or implementation order changes materially, update:

`docs/ROADMAP.md`.

---

# 4. Core Architecture

FORauto uses a **modular monolith**.

Do not introduce microservices unless explicitly approved.

The initial architecture is:

```text
FORauto
├── apps/
│   ├── web/              # Next.js frontend
│   └── api/              # Node.js REST API
│
├── packages/
│   ├── ui/               # Shared UI components
│   ├── types/            # Shared TypeScript contracts/types
│   └── config/           # Shared configuration
│
├── database/
│   └── migrations/       # PostgreSQL SQL migrations
│
├── docs/
│
├── AGENTS.md
├── README.md
├── package.json
└── .env.example
```

Keep module boundaries clear.

Do not create abstractions merely because they are theoretically reusable.

Prefer:

> simple + explicit + maintainable

over:

> clever + abstract + difficult to understand.

---

# 5. Technology Rules

## Frontend

Use:

* Next.js
* React
* TypeScript
* Tailwind CSS
* Framer Motion
* Lucide icons

The frontend must remain responsive and mobile-first.

## Backend

Use:

* Node.js
* TypeScript
* REST API
* Fastify or Express according to the established architecture
* PostgreSQL
* `pg`

## Database

PostgreSQL is the source of truth.

Use:

* SQL migrations
* parameterized SQL queries
* transactions where required
* foreign keys
* appropriate indexes
* database constraints

### Do not introduce Prisma.

The project intentionally uses `pg` + SQL migrations.

Do not replace this with Prisma, Drizzle, Sequelize, TypeORM, or another ORM unless the architecture is explicitly changed and documented.

---

# 6. API Rules

The API uses:

```text
/api/v1
```

The backend owns business rules.

The frontend must not become a second business-logic layer.

Example:

Bad:

```text
Frontend decides:
if request.status === "NEW"
then request can be changed to COMPLETED
```

Better:

```text
Frontend requests the transition.

Backend validates whether the transition is allowed.
```

Business-critical rules belong on the backend.

The frontend may provide UX validation, but backend validation is authoritative.

---

# 7. Data Rules

FORauto is a real business system.

### Never use fake production data.

Do not create:

* fake customers
* fake vehicles
* fake service requests
* fake jobs
* fake technicians
* fake reviews
* fake workshop history
* fake testimonials
* fake statistics
* fake business claims

Do not populate production-facing UI with fabricated records merely to make it look populated.

If real data does not exist, design a proper empty state.

Example:

```text
No service requests yet.

When customers submit requests, they'll appear here.
```

### Test data

Test fixtures/factories are allowed for automated tests.

They must remain clearly separated from production data.

---

# 8. Never Invent Business Information

Do not invent:

* services
* prices
* opening hours
* warranties
* certifications
* workshop capabilities
* staff credentials
* customer reviews
* locations
* guarantees
* partnerships
* awards
* statistics
* business claims

If the business information has not been confirmed, use documented placeholders or mark the information as requiring confirmation.

For example:

```text
[BUSINESS TO CONFIRM]
```

is preferable to inventing an answer.

---

# 9. Customer Request Workflow

The service-request system is a core workflow.

The intended journey is:

```text
Customer
  ↓
Get Help With My Car
  ↓
Describe Problem
  ↓
Vehicle Details
  ↓
Photos / Videos
  ↓
Contact Information
  ↓
Preferred Date
  ↓
Submit
  ↓
Confirmation
  ↓
FORauto Contacts Customer
```

Guest requests are allowed.

A customer must not be forced to create an account merely to report a vehicle problem.

However, private request information must never become publicly accessible.

---

# 10. Request Statuses

The current service-request lifecycle is:

```text
NEW
  ↓
CONTACTED
  ↓
SCHEDULED
  ↓
IN_PROGRESS
  ↓
COMPLETED
  ↓
CLOSED
```

Cancellation is also supported:

```text
CANCELLED
```

Do not create arbitrary status values in individual components.

Statuses should be defined centrally and shared where appropriate.

Status transitions must be validated by the backend.

---

# 11. Appointment Rules

A customer's preferred date/time is a **request**, not an automatic confirmation.

Never communicate:

> Your appointment is confirmed.

unless the backend/admin has actually confirmed it.

Correct distinction:

```text
Preferred date
≠
Confirmed appointment
```

The UI must make this clear.

---

# 12. Job Rules

Jobs represent actual workshop work.

A job may contain:

* customer
* vehicle
* service request
* appointment
* assigned staff
* diagnosis
* work performed
* internal notes
* work entries
* media
* completion information

Do not mark work as completed simply because a customer submitted a request.

The workflow must reflect the actual operational state.

---

# 13. Staff Rules

Staff roles currently include:

```text
ADMIN
MANAGER
TECHNICIAN
STAFF
```

Use authorization checks on the backend.

Never rely solely on hiding frontend UI to protect admin functionality.

Example:

Hiding:

```text
Delete customer
```

from a technician is not authorization.

The API must independently reject unauthorized requests.

---

# 14. Customer and Vehicle Ownership

Customers may have multiple vehicles.

Vehicle records must belong to the correct customer.

Private customer information must only be accessible to authorized users.

Never trust a `customer_id` supplied by the frontend without verifying ownership/authorization.

Example:

```text
GET /vehicles/:vehicleId
```

must verify that the requesting user is allowed to access that vehicle.

---

# 15. Database Rules

All database changes must use migrations.

Never rely on manually changing the production database.

Migrations must be:

* version controlled
* deterministic
* reviewable
* safe to run in the intended environment

Use parameterized queries.

Never construct SQL using untrusted user input through string concatenation.

Bad:

```ts
`SELECT * FROM customers WHERE phone = '${phone}'`
```

Use parameterized queries instead.

---

# 16. Transactions

Use database transactions when multiple writes must succeed or fail together.

For example:

```text
Create customer
+
Create vehicle
+
Create service request
```

If the operation requires all three records to remain consistent, use a transaction.

Do not use transactions unnecessarily for independent reads.

---

# 17. API Layering

Backend modules should follow this general structure:

```text
HTTP
 ↓
Route
 ↓
Validation
 ↓
Authentication
 ↓
Authorization
 ↓
Controller
 ↓
Service
 ↓
Repository / Data Access
 ↓
PostgreSQL
```

Do not place database queries directly inside route definitions.

Do not place large business workflows inside controllers.

Controllers should coordinate HTTP concerns.

Services should contain business workflows.

Repositories/data-access code should handle database interaction.

---

# 18. Validation

Validate all external input.

Validate:

* request bodies
* query parameters
* route parameters
* file uploads
* authentication input
* vehicle information
* phone numbers
* dates
* status transitions

Client-side validation improves UX.

Server-side validation provides security and correctness.

Never assume frontend validation is sufficient.

---

# 19. Nigerian Phone Numbers

Phone numbers should be normalized consistently.

Support common Nigerian formats such as:

```text
08055153346
+234805513346
234805513346
```

Store normalized values according to the project's documented phone-number strategy.

Do not duplicate phone normalization logic across unrelated modules.

Create one shared utility/service where appropriate.

---

# 20. WhatsApp

WhatsApp is a first-class customer communication channel.

Initially, use WhatsApp deep links rather than building unnecessary messaging infrastructure.

Messages should be contextual where useful.

Example:

```text
Hello FORauto, I found you through your website. I need help with my Toyota Camry. The vehicle is having trouble starting.
```

Do not automatically send messages without the customer's appropriate action unless an explicit notification system is implemented and approved.

---

# 21. Media Uploads

Vehicle/customer uploads may include:

* images
* videos
* job photos
* work showcase media

Media must have:

* type validation
* size limits
* access control
* safe storage
* appropriate visibility
* metadata

Do not store large production media directly inside PostgreSQL.

Use object storage.

Never expose private media through unrestricted public URLs.

---

# 22. Authentication

Authentication must distinguish between:

```text
Guest
Customer
Staff
```

Staff authorization must distinguish roles.

Never:

* store plaintext passwords
* expose password hashes
* put secrets in frontend code
* commit `.env` secrets
* trust client-provided roles
* use localStorage as the only security boundary for sensitive operations

Authentication implementation must follow the architecture documentation.

---

# 23. Security

Treat every external input as untrusted.

Apply:

* authentication
* authorization
* input validation
* SQL parameterization
* rate limiting
* secure cookies/tokens according to the auth design
* CORS restrictions
* upload validation
* secret management
* safe error responses
* structured logging
* request IDs

Never log:

* passwords
* tokens
* secrets
* unnecessary personal information

Do not return internal stack traces to production clients.

---

# 24. Error Handling

Errors should be predictable.

Use the documented API error structure.

Do not silently swallow errors.

Bad:

```ts
try {
  await createRequest();
} catch {
  return null;
}
```

This hides failures.

Prefer explicit handling with useful logs and safe user-facing errors.

Frontend errors should provide meaningful recovery paths.

---

# 25. Empty States

Empty states are part of the product.

Do not solve an empty dashboard by inventing fake records.

Examples:

```text
No service requests yet.
```

```text
No vehicles added yet.
```

```text
No completed jobs yet.
```

```text
No work has been published yet.
```

Empty states should guide the user toward the next meaningful action.

---

# 26. Frontend Architecture

Organize frontend code around product features rather than arbitrary technical categories.

Relevant feature boundaries include:

```text
service-requests
vehicles
appointments
jobs
customers
staff
work
inspections
listings
```

Avoid putting the entire application into giant files.

Avoid:

```text
page.tsx with 1000+ lines
```

Split meaningful UI responsibilities into components.

But do not create dozens of tiny components with no useful boundary.

---

# 27. Shared Types

Use shared types for important contracts between frontend and backend where appropriate.

Avoid manually duplicating:

```text
RequestStatus
AppointmentStatus
UserRole
```

in multiple unrelated locations.

If the API contract changes, update the shared contract and affected consumers together.

---

# 28. No Duplicate Logic

Do not implement the same business rule in multiple places.

Examples of logic that should have a single authoritative implementation:

* request status transitions
* phone normalization
* authorization
* appointment state rules
* vehicle ownership checks
* business validation

If the same logic appears repeatedly, stop and determine whether it belongs in:

* a shared utility
* backend service
* repository
* shared type/constant

Do not abstract prematurely.

---

# 29. Design System

FORauto's visual direction is:

> **Premium automotive × engineering × human craftsmanship**

The UI should feel:

* experienced
* professional
* practical
* modern
* technical
* trustworthy
* established
* human

Avoid generic mechanic branding.

Do not default to:

* red/black automotive clichés
* giant wrench logos
* generic car icons
* excessive gradients
* excessive glassmorphism
* generic stock-photo hero sections
* excessive animation
* fake luxury language

The current design direction uses:

* near-black/charcoal
* warm white/stone
* a restrained accent, currently amber/orange
* strong typography
* real workshop imagery
* subtle motion

The exact design tokens must follow `docs/DESIGN.md`.

---

# 30. Photography

Real work is the strongest proof.

When real FORauto workshop photos become available, prioritize them.

Development placeholders may be used temporarily.

Do not present placeholder imagery as if it were FORauto's actual workshop, staff, customers, or completed work.

The implementation should make replacing placeholder media straightforward.

---

# 31. Motion

Use animation to support:

* hierarchy
* transitions
* feedback
* storytelling

Do not animate everything.

Motion should feel:

```text
restrained
precise
intentional
```

Avoid:

* excessive bouncing
* constant parallax
* distracting hover effects
* unnecessary page transitions
* animation that harms performance or accessibility

Respect reduced-motion preferences.

---

# 32. Mobile-First

A large portion of customers will access FORauto from phones.

Every customer-facing flow must work well on mobile.

Prioritize:

* readable typography
* large tap targets
* simple forms
* fast loading
* persistent contact actions where appropriate
* WhatsApp accessibility
* phone-call accessibility
* clear location information

Do not design desktop first and merely shrink it for mobile.

---

# 33. Accessibility

Follow accessible web practices.

At minimum:

* semantic HTML
* keyboard navigation
* visible focus states
* sufficient contrast
* meaningful labels
* accessible form errors
* alt text for meaningful images
* reduced-motion support
* usable touch targets

Do not sacrifice accessibility for visual effects.

---

# 34. SEO

Public pages should have appropriate:

* titles
* descriptions
* canonical URLs where needed
* semantic headings
* structured metadata where appropriate
* Open Graph metadata
* useful URLs
* image alt text

Do not keyword-stuff.

Content should primarily serve real customers.

---

# 35. Admin Dashboard

The admin dashboard is an operational tool.

It does not need to look like the public marketing website.

Prioritize:

* clarity
* density
* speed
* status visibility
* filters
* search
* actionable information
* efficient workflows

Important overview information includes:

```text
New Requests
Today's Jobs
Pending Bookings
Active Jobs
Completed
```

Avoid excessive decorative UI in operational screens.

---

# 36. Business Workflow Guardrail

Do not implement a business process simply because it is technically interesting.

The current platform proposes future capabilities such as:

* vehicle inspections
* vehicle sales assistance
* online payments
* invoices
* maintenance reminders
* parts inventory
* fleet management
* roadside services

These are not automatically confirmed current business processes.

Before turning a proposed feature into a real workflow, verify the business process.

---

# 37. Scope Control

Do not turn FORauto into an unnecessarily large platform during MVP development.

Do not introduce:

* microservices
* complex event buses
* unnecessary AI
* unnecessary real-time infrastructure
* unnecessary caching layers
* complex workflow engines
* unnecessary third-party services
* elaborate CMS infrastructure

unless the actual product requirement justifies them.

Build the smallest production-quality system that solves the real problem.

---

# 38. AI Coding Agent Workflow

For every meaningful task:

### Step 1 — Understand

Read:

* the relevant documentation
* existing implementation
* related types
* related database schema
* existing tests

Do not immediately start editing.

### Step 2 — Plan

Identify:

* affected files
* dependencies
* API changes
* database changes
* documentation changes
* tests required

### Step 3 — Implement

Make the smallest coherent change.

Do not rewrite unrelated code.

### Step 4 — Validate

Run appropriate:

* type checks
* lint
* tests
* build
* migration checks

### Step 5 — Review

Inspect the resulting diff.

Look for:

* duplicated logic
* accidental scope expansion
* security issues
* broken types
* inconsistent naming
* undocumented architecture changes
* fake data
* accessibility regressions

### Step 6 — Document

Update relevant documentation when behavior or architecture has changed.

---

# 39. Design Change Workflow

When asked to change the UI significantly:

1. Read `docs/DESIGN.md`.
2. Inspect existing implementation.
3. Determine whether the requested change fits the current design system.
4. If it changes the design system, update `docs/DESIGN.md`.
5. Implement.
6. Check mobile and desktop behavior.
7. Check accessibility.
8. Check motion/reduced-motion behavior.
9. Verify that the design still feels like FORauto.

Do not introduce random component styles from unrelated projects.

---

# 40. Database Change Workflow

When implementing a database feature:

1. Read `docs/DATABASE.md`.
2. Determine required entities/relationships.
3. Update the database documentation if necessary.
4. Create a migration.
5. Add constraints/indexes.
6. Implement repository/data-access logic.
7. Add service-layer behavior.
8. Add API validation.
9. Add tests.
10. Verify rollback/recovery considerations where applicable.

Never modify the schema only in code.

---

# 41. API Change Workflow

When implementing an API feature:

1. Read `docs/API.md`.
2. Define the endpoint contract.
3. Validate input.
4. Apply authentication/authorization.
5. Implement controller/service/repository layers.
6. Update shared types if needed.
7. Add tests.
8. Update API documentation.

Do not create undocumented endpoints casually.

---

# 42. Testing

Test business-critical behavior.

Prioritize tests for:

* authentication
* authorization
* customer ownership
* vehicle ownership
* service request creation
* request status transitions
* appointment transitions
* job transitions
* staff assignment
* database constraints
* media access
* important API validation

Frontend tests should focus on meaningful user behavior rather than implementation details.

The goal is confidence, not an arbitrary test-count target.

---

# 43. Production Readiness

Before production launch, verify:

### Application

* no debug endpoints
* no fake production data
* no exposed secrets
* production error handling
* responsive UI
* accessible UI
* SEO metadata
* correct business information

### Backend

* validation
* authorization
* rate limiting
* logging
* request IDs
* health endpoint
* secure CORS
* safe error responses

### Database

* migrations
* indexes
* constraints
* backups
* connection configuration

### Media

* upload limits
* storage configuration
* private/public access rules

### Deployment

* environment variables
* production build
* HTTPS
* domain configuration
* monitoring
* database connection
* storage connection

---

# 44. Environment Variables

Never commit secrets.

Use:

```text
.env
.env.local
```

where appropriate and keep them ignored by Git.

Maintain:

```text
.env.example
```

with variable names but no real credentials.

Example:

```text
DATABASE_URL=
API_BASE_URL=
NEXT_PUBLIC_API_BASE_URL=
JWT_SECRET=
STORAGE_BUCKET=
WHATSAPP_PHONE=
```

Only expose variables prefixed for public frontend use when they are genuinely safe to expose.

---

# 45. Git and Changes

Keep changes focused.

Do not mix:

```text
new feature
+
unrelated refactor
+
formatting entire repository
+
dependency upgrades
```

in one change unless necessary.

Prefer small, understandable commits.

Before considering a task complete, inspect the diff for accidental changes.

---

# 46. Naming

Use descriptive names.

Prefer:

```text
serviceRequest
vehicleId
appointmentStatus
createServiceRequest
```

over:

```text
data
item
thing
handleStuff
```

Database naming should remain consistent with the documented schema.

API naming should remain consistent with the documented contract.

---

# 47. No Silent Architecture Changes

An AI agent must never silently:

* replace PostgreSQL
* introduce an ORM
* replace Express/Fastify
* introduce microservices
* change authentication architecture
* replace storage strategy
* change API conventions
* remove documented functionality
* create a new state-management architecture
* introduce a major dependency

If a change is genuinely necessary, explain it and update the appropriate documentation.

---

# 48. When to Ask for Clarification

Do not ask unnecessary questions.

Make a reasonable implementation decision when:

* the architecture already specifies the answer
* the documentation provides enough information
* the decision is reversible
* the choice does not change business behavior

Ask for clarification when blocked by an actual business decision, such as:

* exact service catalogue
* confirmed opening hours
* confirmed pricing
* confirmed appointment process
* confirmed staff roles
* confirmed inspection checklist
* confirmed vehicle-sales process
* confirmed customer communication policy

Never invent these details just to keep coding.

---

# 49. Definition of Done

A feature is not done simply because the UI exists.

A feature is considered complete when appropriate:

```text
Requirements understood
        ↓
Relevant docs reviewed
        ↓
Architecture respected
        ↓
Database implemented
        ↓
Backend implemented
        ↓
Validation implemented
        ↓
Authorization implemented
        ↓
Frontend implemented
        ↓
Loading states handled
        ↓
Error states handled
        ↓
Empty states handled
        ↓
Mobile checked
        ↓
Accessibility checked
        ↓
Tests added
        ↓
Build/typecheck/lint pass
        ↓
Diff reviewed
        ↓
Documentation updated
```

Not every feature requires every step literally, but production-critical workflows must be treated end-to-end.

---

# 50. Product Quality Standard

FORauto should feel like a real business that happens to have excellent technology.

It should not feel like:

* a hackathon demo
* a generic mechanic template
* a fake startup
* an AI-generated landing page
* a dashboard full of invented numbers
* an over-engineered SaaS platform

The quality bar is:

> **Real business. Real workflows. Real data. Real operational value.**

The technology exists to make the automotive business easier to discover, easier to contact, easier to operate, and easier to grow.

---

# 51. Final Agent Rule

Before adding complexity, ask:

> **Does this make FORauto materially better for the customer or the people running the business?**

If the answer is no, do not build it.

Build intentionally.
Build from the documentation.
Keep the architecture understandable.
Protect real customer data.
Do not invent business facts.
Do not over-engineer.

**FORauto: experienced hands, modern service.**
