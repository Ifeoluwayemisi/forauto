# FORauto — Technical Architecture

**Version:** 0.1
**Status:** Working Specification
**Product:** FORauto — Automotive Services & Vehicle Solutions

---

# 1. Purpose

This document defines the technical architecture for the FORauto platform.

It translates the product requirements, information architecture, brand direction, user flows, and design system into a maintainable software structure.

The architecture should support:

* Public website
* Customer service requests
* Customer accounts
* Vehicle records
* Appointments
* Jobs
* Technician assignment
* Inspections
* Vehicle listings
* Admin operations
* Media uploads
* Notifications
* Future payments and additional vehicle services

The architecture should remain simple enough for a small engineering team to maintain while providing a solid foundation for future growth.

---

# 2. Architecture Principles

## 2.1 Start as a modular monolith

FORauto does **not** need microservices initially.

The first production version should use:

```text
Frontend
    ↓
Backend API
    ↓
PostgreSQL
```

with external services where appropriate.

This provides:

* Easier development
* Easier deployment
* Easier debugging
* Lower infrastructure cost
* Fewer networking problems
* Clearer ownership

The backend should nevertheless be organized into modules so individual domains can be separated later if the product actually requires it.

---

# 3. High-Level Architecture

```text
                         ┌─────────────────────┐
                         │      CUSTOMER       │
                         │ Mobile / Desktop    │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │     Next.js Web     │
                         │   Public + Account  │
                         └──────────┬──────────┘
                                    │
                              HTTPS / REST
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │     Node.js API     │
                         │ Fastify / Express   │
                         └──────────┬──────────┘
                                    │
              ┌─────────────────────┼─────────────────────┐
              │                     │                     │
              ▼                     ▼                     ▼
       ┌────────────┐       ┌──────────────┐      ┌──────────────┐
       │ PostgreSQL │       │ Object       │      │ External     │
       │            │       │ Storage      │      │ Services     │
       └────────────┘       └──────────────┘      └──────────────┘
                                                    │
                                  ┌─────────────────┼─────────────────┐
                                  │                 │                 │
                                  ▼                 ▼                 ▼
                              WhatsApp           Email            Maps
```

---

# 4. Application Layers

The system should be divided into clear layers.

```text
Presentation
     ↓
API / Routes
     ↓
Controllers
     ↓
Services
     ↓
Repositories / Data Access
     ↓
PostgreSQL
```

Each layer should have a clear responsibility.

---

# 5. Frontend

## Recommended stack

* Next.js
* React
* TypeScript
* Tailwind CSS
* Framer Motion
* Lucide

The frontend will contain:

* Public website
* Service pages
* Work gallery
* Request flow
* Customer dashboard
* Admin dashboard
* Technician interface

---

# 6. Frontend Application Structure

Recommended structure:

```text
apps/
└── web/
    ├── app/
    │   ├── (public)/
    │   │   ├── page.tsx
    │   │   ├── services/
    │   │   ├── work/
    │   │   ├── about/
    │   │   ├── vehicles/
    │   │   ├── contact/
    │   │   └── request-service/
    │   │
    │   ├── (customer)/
    │   │   └── account/
    │   │
    │   ├── (admin)/
    │   │   └── admin/
    │   │
    │   └── (staff)/
    │       └── staff/
    │
    ├── components/
    ├── features/
    ├── lib/
    ├── hooks/
    ├── types/
    └── styles/
```

The exact repository layout can be adjusted during implementation.

---

# 7. Frontend Feature Boundaries

Feature-specific logic should remain grouped.

Example:

```text
features/
├── service-requests/
├── vehicles/
├── appointments/
├── jobs/
├── inspections/
├── work/
├── customers/
├── staff/
└── listings/
```

This prevents business logic from becoming scattered across generic components.

---

# 8. Backend

## Recommended stack

* Node.js
* TypeScript
* Fastify or Express
* PostgreSQL
* `pg`
* REST API

The backend owns:

* Authentication
* Authorization
* Validation
* Business rules
* Request management
* Customer management
* Vehicle records
* Appointment management
* Job management
* Staff assignment
* Inspection workflows
* Vehicle listings
* Media metadata
* Notifications

---

# 9. Backend Structure

Recommended:

```text
apps/
└── api/
    └── src/
        ├── modules/
        │   ├── auth/
        │   ├── users/
        │   ├── customers/
        │   ├── vehicles/
        │   ├── service-requests/
        │   ├── appointments/
        │   ├── jobs/
        │   ├── staff/
        │   ├── inspections/
        │   ├── work/
        │   ├── listings/
        │   ├── media/
        │   ├── notifications/
        │   └── reviews/
        │
        ├── middleware/
        ├── plugins/
        ├── config/
        ├── db/
        ├── utils/
        ├── app.ts
        └── server.ts
```

---

# 10. Modular Backend Principle

Each domain should generally contain:

```text
module/
├── routes
├── controller
├── service
├── repository
├── schema
└── types
```

For example:

```text
service-requests/
├── serviceRequest.routes.ts
├── serviceRequest.controller.ts
├── serviceRequest.service.ts
├── serviceRequest.repository.ts
├── serviceRequest.schema.ts
└── serviceRequest.types.ts
```

Not every module needs every file if its complexity is small.

The goal is **clear ownership**, not ceremony.

---

# 11. Database

## Database

**PostgreSQL**

PostgreSQL is the primary system of record.

It will store:

* Users
* Customers
* Staff
* Vehicles
* Requests
* Appointments
* Jobs
* Assignments
* Inspections
* Work entries
* Listings
* Reviews
* Notifications
* Media metadata

---

# 12. Database Access

Use the PostgreSQL driver directly through:

**`pg`**

The application should use:

* Parameterized queries
* Transactions where necessary
* Explicit migrations
* Foreign keys
* Constraints
* Indexes
* Proper timestamps

Database design is documented separately in:

`docs/DATABASE.md`

---

# 13. Authentication

The platform has three major authentication contexts.

## Guest

No account required.

Can:

* Browse website
* Contact FORauto
* Submit service request
* Request inspection

---

## Customer

Authenticated user.

Can:

* Manage profile
* Manage vehicles
* View requests
* View appointments
* View service history
* View inspection reports

---

## Staff

Authenticated internal user.

Roles can include:

```text
ADMIN
MANAGER
TECHNICIAN
STAFF
```

The exact roles should be finalized based on how the real business operates.

---

# 14. Authorization

Authentication answers:

> Who are you?

Authorization answers:

> What are you allowed to do?

Example:

```text
CUSTOMER
→ own vehicles
→ own requests
→ own appointments
→ own service history

TECHNICIAN
→ assigned jobs
→ relevant vehicle information
→ job updates

ADMIN
→ operational management
→ customers
→ vehicles
→ jobs
→ staff
→ content
```

Customers must never be able to access another customer's records by changing an ID in a URL or API request.

Authorization must therefore be enforced server-side.

---

# 15. Guest Service Requests

Guest requests are a deliberate architectural decision.

A guest should be able to submit:

```text
Problem
+
Vehicle
+
Contact information
+
Preferred time
```

without creating an account.

The backend creates the appropriate customer/request records.

If the customer later creates an account using the same verified contact information, records can potentially be associated with the account.

This account-linking behaviour should be implemented carefully and securely.

---

# 16. API Architecture

The API should be versioned.

Example:

```text
/api/v1
```

Possible domains:

```text
/api/v1/auth
/api/v1/customers
/api/v1/vehicles
/api/v1/service-requests
/api/v1/appointments
/api/v1/jobs
/api/v1/staff
/api/v1/inspections
/api/v1/work
/api/v1/listings
/api/v1/media
/api/v1/reviews
```

---

# 17. API Response Format

Responses should follow a predictable structure.

Successful response:

```text id="j3c3qv"
{
  "data": {},
  "meta": {}
}
```

Error:

```text id="b9j4y6"
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Please provide a vehicle model.",
    "details": {}
  }
}
```

The exact response contract will be finalized in:

`docs/API.md`

---

# 18. Validation

Validation must happen at the API boundary.

Validate:

* Request body
* Query parameters
* Path parameters
* File metadata
* Authentication context

Frontend validation improves UX.

Backend validation provides security and correctness.

Both are required.

---

# 19. Service Request Architecture

The service request is one of the central entities.

```text
Customer
    │
    └── ServiceRequest
             │
             ├── Vehicle
             ├── Attachments
             ├── Appointment
             └── Job
                    │
                    └── Staff Assignment
```

A request should preserve the original customer-submitted problem even if staff later changes its internal classification.

This creates a reliable record of what the customer originally reported.

---

# 20. Appointment Architecture

Appointments should be separate from service requests.

Relationship:

```text
ServiceRequest
      │
      └── Appointment
```

A request can exist without an appointment.

This supports:

* Customers who only ask questions
* Requests awaiting confirmation
* Rescheduling
* Cancellation
* Multiple appointments where appropriate in the future

The system should not automatically claim a requested time is confirmed.

---

# 21. Job Architecture

A job represents actual workshop work.

```text
ServiceRequest
       ↓
Appointment
       ↓
Job
       ↓
Staff Assignment
```

A job can contain:

* Work status
* Technician
* Start time
* Completion time
* Findings
* Work performed
* Internal notes
* Media
* Future quote
* Future invoice

---

# 22. Staff Assignment

Staff assignments should be represented independently.

Example:

```text
Job
 │
 ├── Technician A
 └── Technician B
```

This allows more than one staff member to contribute to a job.

Future:

* Primary technician
* Supporting technician
* Apprentice
* Supervisor

---

# 23. Vehicle Architecture

Vehicles belong to customers.

```text
Customer
 ├── Vehicle
 ├── Vehicle
 └── Vehicle
```

Vehicle information may include:

* Make
* Model
* Year
* Registration
* VIN/chassis
* Mileage
* Notes

A vehicle can have many:

* Service records
* Requests
* Appointments
* Jobs
* Inspections

---

# 24. Service History

Service history should be derived from completed work rather than manually duplicated wherever possible.

Conceptually:

```text
Completed Job
      ↓
Service Record
      ↓
Vehicle History
```

This prevents the system from maintaining multiple conflicting copies of the same event.

---

# 25. Media Architecture

Images and videos should **not** be stored directly inside PostgreSQL.

PostgreSQL stores metadata.

Example:

```text
Media
├── id
├── storage_key
├── url/reference
├── mime_type
├── size
├── owner_type
├── owner_id
└── created_at
```

Actual files should live in object storage.

Potential providers:

* Cloudflare R2
* AWS S3
* Supabase Storage
* Another reliable S3-compatible provider

The final provider can be selected based on cost, deployment, and operational simplicity.

---

# 26. Media Ownership

Media may belong to:

* Service request
* Job
* Inspection
* Work entry
* Vehicle listing
* Customer profile

Access rules must depend on the parent entity.

For example, internal job photos should not automatically become publicly accessible.

---

# 27. Image Processing

Future image pipeline:

```text
Upload
  ↓
Validate
  ↓
Store original
  ↓
Generate optimized variants
  ↓
Serve responsive image
```

Potential optimizations:

* WebP / AVIF
* Responsive sizes
* Compression
* Thumbnail generation

The implementation should prioritize actual performance rather than adding a complicated media-processing system prematurely.

---

# 28. WhatsApp Integration

WhatsApp should initially be implemented as a **deep-link/contact channel**, not a complicated messaging backend.

Example flow:

```text
Website
   ↓
WhatsApp CTA
   ↓
WhatsApp app/web
   ↓
FORauto business account
```

Context can be passed through a pre-filled message.

Future automation can be added if operationally useful.

---

# 29. Notifications

The notification architecture should be provider-agnostic.

Conceptually:

```text
Application Event
      ↓
Notification Service
      ↓
┌─────────┬────────┬────────┐
│ WhatsApp│ Email  │ SMS    │
└─────────┴────────┴────────┘
```

Examples:

```text
REQUEST_RECEIVED
APPOINTMENT_CONFIRMED
APPOINTMENT_REMINDER
JOB_COMPLETED
INSPECTION_READY
```

The first release can begin with the channels the business actually needs.

---

# 30. Email

Email can be used for:

* Request confirmation
* Appointment confirmation
* Inspection reports
* Account-related communication
* Internal notifications

A transactional email provider can be introduced when email notifications become part of the active release.

---

# 31. Maps / Location

The public website should provide the workshop location and directions.

Possible integration:

* Google Maps
* Apple Maps
* OpenStreetMap-based solution

The first version does not need a complex mapping system.

A simple location page and directions link are sufficient.

---

# 32. Search Engine Architecture

The public website should be optimized for search.

Technical requirements:

* Metadata
* Open Graph
* Structured headings
* Canonical URLs
* Sitemap
* Robots configuration
* Service-specific pages
* Local business structured data where appropriate
* Fast page loading
* Semantic HTML

Search strategy should focus on actual services and location rather than keyword stuffing.

---

# 33. SEO Content Architecture

Potential service/location combinations include:

* Auto mechanic in Victoria Island
* Auto electrical services in Victoria Island
* Car diagnostics in Victoria Island
* Car rewiring in Lagos
* Vehicle inspection in Lagos
* Auto repair in Oniru

Only pages supported by actual services should be published.

---

# 34. Caching

Caching should be introduced selectively.

Good candidates:

* Public service data
* Work gallery
* Public vehicle listings
* Static content

Avoid caching highly dynamic operational data without a clear invalidation strategy.

---

# 35. Real-Time Features

Real-time functionality is **not required for MVP**.

Future possibilities:

* Job status updates
* Technician assignment notifications
* Appointment updates
* Admin request notifications

If real-time updates become necessary, WebSockets or Server-Sent Events can be introduced.

Do not add them merely because the application is a modern platform.

---

# 36. Background Jobs

Background processing may eventually be useful for:

* Email sending
* WhatsApp notifications
* Image processing
* Report generation
* Reminder scheduling

For MVP, simple asynchronous application processing may be sufficient.

A queue system should only be introduced once workload justifies it.

---

# 37. Security

Security requirements include:

* HTTPS
* Secure authentication
* Password hashing where passwords are used
* Secure session/token handling
* Authorization checks
* Input validation
* Parameterized SQL
* Rate limiting
* File validation
* Upload size limits
* Secure HTTP headers
* CSRF protection where applicable
* Audit logging for sensitive admin actions

---

# 38. File Upload Security

Uploaded files must be treated as untrusted.

Validate:

* MIME type
* File extension
* Size
* File signature where appropriate

Do not trust the filename supplied by the client.

Storage keys should be generated by the server.

---

# 39. Auditability

Important internal changes should eventually be auditable.

Examples:

```text
Admin changed request status
Admin assigned technician
Admin changed appointment
Technician updated job
Admin published work
Admin approved listing
```

Future audit records may contain:

* Actor
* Action
* Entity
* Previous value
* New value
* Timestamp

---

# 40. Observability

Production should have visibility into:

* API errors
* Failed requests
* Authentication failures
* Upload failures
* Slow API requests
* Database errors
* Notification failures

At minimum:

* Structured server logs
* Error monitoring
* Health endpoint

---

# 41. Health Checks

The API should expose a health endpoint.

Example:

```text
GET /health
```

Potential checks:

```text
API        OK
Database   OK
Storage    OK
```

The exact level of dependency checking should be chosen carefully so the health endpoint remains useful for deployment and monitoring.

---

# 42. Environment Configuration

Environment-specific configuration must use environment variables.

Currently defined, validated at boot by `apps/api/src/config/env.ts` and
listed authoritatively in `.env.example`:

```text
NODE_ENV
PORT
LOG_LEVEL
DATABASE_URL

API_BASE_URL
NEXT_PUBLIC_API_BASE_URL
FRONTEND_URL
CORS_ORIGINS

AUTH_SECRET
```

Planned, and deliberately absent until the subsystem that reads them
exists:

```text
STORAGE_ENDPOINT
STORAGE_BUCKET
STORAGE_ACCESS_KEY
STORAGE_SECRET_KEY

EMAIL_PROVIDER_KEY
MAPS_PROVIDER_KEY
```

`NEXT_PUBLIC_API_BASE_URL` is the only variable exposed to the browser,
because only client-side code needs it. `FRONTEND_URL` is read in a Server
Component and is never inlined into the client bundle.

Secrets must never be committed to Git.

---

# 43. Environments

At minimum:

```text
Development
    ↓
Staging / Preview
    ↓
Production
```

Development:

* Local PostgreSQL
* Local development server
* Test uploads

Preview/staging:

* Deployment preview
* Production-like configuration
* Safe test data

Production:

* Real customer information
* Real requests
* Real media
* Real notifications

---

# 44. Database Migrations

Database changes must be version-controlled.

Example:

```text
migrations/
├── 001_initial_schema.sql
├── 002_add_service_requests.sql
├── 003_add_jobs.sql
└── ...
```

Never rely on manually modifying the production database.

---

# 45. Transactions

Database transactions should be used whenever multiple changes must succeed or fail together.

Examples:

### Creating a job

```text
Create Job
+
Create Assignment
+
Update Request
```

These should be handled atomically where appropriate.

### Completing a job

```text
Update Job
+
Create Service Record
+
Create Notification Event
```

The exact transactional boundary depends on which operations are synchronous versus asynchronous.

---

# 46. Data Ownership

Every operational record should have a clear ownership relationship.

Example:

```text
Customer
  └── Vehicle
       ├── Request
       ├── Appointment
       ├── Job
       ├── Inspection
       └── Service History
```

This makes authorization, reporting, and future customer dashboards easier to implement.

---

# 47. API Security Boundary

The frontend must never be trusted to enforce business rules.

For example:

The frontend may hide:

> "Mark Job Complete"

from a customer.

But the backend must independently reject a customer attempting:

```text
PATCH /api/v1/jobs/123
status=COMPLETED
```

Authorization belongs to the backend.

---

# 48. Public vs Private Data

## Public

Potentially accessible:

* Services
* Published work
* About information
* Workshop location
* Public vehicle listings
* Published reviews

## Private

Must require authorization:

* Customer phone numbers
* Customer vehicles
* Requests
* Appointments
* Jobs
* Inspection reports
* Internal notes
* Staff information
* Unpublished listings

---

# 49. Deployment Architecture

Initial deployment can remain simple.

```text
                    Internet
                       │
          ┌────────────┴────────────┐
          │                         │
          ▼                         ▼
     Next.js Host              API Host
          │                         │
          │                         ▼
          │                    PostgreSQL
          │
          └──────────────┐
                         ▼
                   Object Storage
```

The exact hosting providers can be selected later based on cost, reliability, and existing workflow.

---

# 50. CI/CD

The repository should eventually have automated checks.

On pull request:

```text
Install
  ↓
Lint
  ↓
Typecheck
  ↓
Tests
  ↓
Build
```

Only passing changes should be eligible for production deployment.

---

# 51. Testing Strategy

Testing should focus on business-critical behaviour.

## Unit tests

Examples:

* Request status transitions
* Validation
* Authorization rules
* Vehicle ownership
* Appointment rules

## Integration tests

Examples:

* Create service request
* Create appointment
* Assign technician
* Complete job
* Create service history

## End-to-end tests

Critical customer journey:

```text
Homepage
 ↓
Request Service
 ↓
Submit
 ↓
Confirmation
```

Admin journey:

```text
Login
 ↓
View Request
 ↓
Create Job
 ↓
Assign Technician
 ↓
Complete Job
```

---

# 52. Performance

Initial performance priorities:

1. Fast homepage
2. Optimized images
3. Minimal JavaScript where possible
4. Server-rendered public content
5. Lazy loading for non-critical media
6. Efficient database queries
7. Pagination for admin lists

Do not optimize hypothetical scale before real bottlenecks exist.

---

# 53. Scalability Strategy

The architecture should scale **vertically and modularly before horizontally**.

Potential evolution:

```text
Phase 1
Modular monolith
      ↓
Phase 2
Better caching / background jobs
      ↓
Phase 3
Dedicated services only where justified
```

The product should not begin with:

* Microservices
* Kubernetes
* Event-driven infrastructure everywhere
* Multiple databases
* Complex distributed queues

unless actual requirements justify them.

---

# 54. Future AI Integration

AI is a possible future capability, not an MVP requirement.

Potential uses:

* Convert customer's natural-language problem into structured categories
* Summarize technician notes
* Help generate inspection summaries
* Search historical service records
* Assist customer support

AI must not automatically make safety-critical mechanical conclusions without appropriate human oversight.

---

# 55. Future Payments

Payments are not required for the first version.

Future architecture may support:

```text
Quote
 ↓
Customer approval
 ↓
Payment
 ↓
Job
 ↓
Invoice
```

A payment provider can be integrated when the business process is defined.

---

# 56. Future Vehicle Marketplace

Vehicle listings can eventually become a separate module within the same application.

```text
VehicleListing
 ├── Seller
 ├── Vehicle
 ├── Media
 ├── Status
 └── Enquiries
```

The listing system should not be built as a full marketplace until FORauto's actual vehicle-sales workflow is confirmed.

---

# 57. Repository Architecture

Recommended monorepo direction:

```text
FORauto/
├── apps/
│   ├── web/
│   └── api/
│
├── packages/
│   ├── ui/
│   ├── types/
│   └── config/
│
├── database/
│   └── migrations/
│
├── docs/
│   ├── PRD.md
│   ├── PRODUCT_OVERVIEW.md
│   ├── BRAND.md
│   ├── USER_FLOWS.md
│   ├── DESIGN.md
│   ├── ARCHITECTURE.md
│   ├── DATABASE.md
│   ├── API.md
│   └── ROADMAP.md
│
├── AGENTS.md
├── package.json
└── README.md
```

A simpler single-app repository is also acceptable if it better matches the development team's workflow.

The architecture should not force a monorepo purely for the sake of having one.

---

# 58. Shared Types

Where appropriate, shared API/domain types can be placed in:

```text
packages/types/
```

Potential shared definitions:

* RequestStatus
* AppointmentStatus
* JobStatus
* UserRole
* Vehicle
* ServiceRequest
* Appointment

However, shared types should not become a dumping ground for backend implementation details.

---

# 59. API Contract Ownership

The API contract should be treated as an explicit boundary between frontend and backend.

The contract should define:

* Endpoint
* HTTP method
* Authentication
* Request schema
* Response schema
* Error responses
* Pagination
* Filtering
* Authorization requirements

This will be documented in:

`docs/API.md`

---

# 60. Architectural Boundaries

The following boundaries should remain clear:

```text
UI
↓
API
↓
Business Logic
↓
Data Access
↓
Database
```

And:

```text
Public Content
≠
Customer Data
≠
Internal Operations
```

And:

```text
Customer Workflow
≠
Technician Workflow
≠
Admin Workflow
```

These boundaries reduce accidental coupling.

---

# 61. What We Are Deliberately Not Building Yet

The architecture does not require:

* Microservices
* Kubernetes
* Dedicated mobile apps
* Real-time tracking
* Payment processing
* Parts marketplace
* Fleet SaaS
* Multi-workshop marketplace
* AI diagnosis
* Complex recommendation engine
* Full accounting system

These remain future possibilities.

---

# 62. Architectural North Star

The FORauto architecture should follow one rule:

> **Build the simplest architecture that can support the real business today while leaving clean boundaries for tomorrow.**

The product should be technologically modern without becoming technologically complicated.

---

# 63. Architecture Summary

The initial FORauto system is:

```text
Next.js
   │
   │ REST
   ▼
Node.js API
   │
   ├── Auth
   ├── Customers
   ├── Vehicles
   ├── Requests
   ├── Appointments
   ├── Jobs
   ├── Staff
   ├── Inspections
   ├── Work
   ├── Listings
   ├── Media
   └── Notifications
   │
   ▼
PostgreSQL

External:
WhatsApp
Email
Maps
Object Storage
```

This provides the technical foundation for the next stage:

**`docs/DATABASE.md`**

The database document will turn these architectural entities into an actual relational model, including tables, columns, relationships, constraints, indexes, status enums, and migration strategy.
