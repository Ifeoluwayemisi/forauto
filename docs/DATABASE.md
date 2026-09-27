# FORauto — Database Design

**Version:** 0.1
**Status:** Working Specification
**Database:** PostgreSQL

---

# 1. Purpose

This document defines the relational database structure for FORauto.

The database must support the current automotive service workflow while leaving room for future capabilities such as:

* Customer accounts
* Multiple vehicles per customer
* Service requests
* Appointments
* Workshop jobs
* Technician assignments
* Service history
* Vehicle inspections
* Our Work / portfolio
* Vehicle listings
* Reviews
* Notifications
* Media

The database should prioritize:

* Data integrity
* Clear relationships
* Secure ownership
* Query efficiency
* Auditability
* Future extensibility

---

# 2. Database Principles

## 2.1 PostgreSQL is the source of truth

Operational data lives in PostgreSQL.

External services should not become the authoritative source for FORauto business records.

---

## 2.2 Relational modelling

FORauto has strongly related entities.

For example:

```text
Customer
   ↓
Vehicle
   ↓
Service Request
   ↓
Appointment
   ↓
Job
   ↓
Service History
```

A relational database is therefore appropriate.

---

## 2.3 No unnecessary duplication

If information already exists in a reliable entity, other tables should reference it instead of duplicating it.

For example:

A customer's phone number belongs to the customer/contact record, not separately inside every job.

Exceptions can exist where historical snapshots are required.

---

# 3. Core Entity Model

The initial domain model is:

```text
User
 │
 ├── Customer
 │      │
 │      ├── Vehicle
 │      │      ├── Service Request
 │      │      ├── Appointment
 │      │      ├── Job
 │      │      ├── Inspection
 │      │      └── Service Record
 │      │
 │      └── Reviews
 │
 └── Staff
         │
         └── Job Assignments

Service Request
      │
      └── Appointment
              │
              └── Job

Job
 ├── Assignments
 ├── Work Entries
 ├── Media
 └── Service Record

Inspection
 ├── Findings
 └── Media

Vehicle Listing
 ├── Vehicle
 ├── Seller
 └── Media
```

---

# 4. Tables

Initial core tables:

```text
users
customers
staff
vehicles
service_requests
service_request_media
appointments
jobs
job_assignments
job_media
work_entries
service_records
inspections
inspection_findings
media
work_items
reviews
vehicle_listings
notifications
```

Some tables can be introduced later depending on the MVP implementation.

---

# 5. `users`

Represents authenticated platform users.

```text
users
```

### Columns

| Column        | Type        | Notes                                 |
| ------------- | ----------- | ------------------------------------- |
| id            | UUID        | Primary key                           |
| email         | VARCHAR     | Nullable if phone-first               |
| phone         | VARCHAR     | Unique where provided                 |
| password_hash | TEXT        | Nullable for future passwordless auth |
| role          | ENUM        | CUSTOMER / STAFF                      |
| status        | ENUM        | ACTIVE / SUSPENDED / DISABLED         |
| created_at    | TIMESTAMPTZ | Required                              |
| updated_at    | TIMESTAMPTZ | Required                              |
| last_login_at | TIMESTAMPTZ | Nullable                              |

The authentication model can evolve without changing the business entities.

---

# 6. `customers`

Stores customer-specific information.

```text
customers
```

### Columns

| Column         | Type        | Notes          |
| -------------- | ----------- | -------------- |
| id             | UUID        | Primary key    |
| user_id        | UUID        | Nullable       |
| first_name     | VARCHAR     | Required       |
| last_name      | VARCHAR     | Nullable       |
| phone          | VARCHAR     | Required       |
| email          | VARCHAR     | Nullable       |
| whatsapp_phone | VARCHAR     | Nullable       |
| notes          | TEXT        | Internal notes |
| created_at     | TIMESTAMPTZ | Required       |
| updated_at     | TIMESTAMPTZ | Required       |

### Relationship

```text
users 1 ─── 0..1 customers
```

A guest customer can exist without an authenticated user account.

---

# 7. Why Customer and User Are Separate

A customer is a **business entity**.

A user is an **authentication identity**.

This distinction allows:

```text
Guest customer
     ↓
Customer record
     ↓
Later creates account
     ↓
User linked to Customer
```

It also prevents authentication logic from becoming tightly coupled to workshop records.

---

# 8. `staff`

Represents internal FORauto workers.

```text
staff
```

### Columns

| Column     | Type        | Notes                                |
| ---------- | ----------- | ------------------------------------ |
| id         | UUID        | Primary key                          |
| user_id    | UUID        | Required                             |
| first_name | VARCHAR     | Required                             |
| last_name  | VARCHAR     | Nullable                             |
| phone      | VARCHAR     | Nullable                             |
| role       | ENUM        | ADMIN / MANAGER / TECHNICIAN / STAFF |
| specialty  | VARCHAR     | Nullable                             |
| status     | ENUM        | ACTIVE / INACTIVE                    |
| created_at | TIMESTAMPTZ | Required                             |
| updated_at | TIMESTAMPTZ | Required                             |

Relationship:

```text
users 1 ─── 0..1 staff
```

---

# 9. `vehicles`

Represents customer vehicles.

```text
vehicles
```

### Columns

| Column              | Type        | Notes       |
| ------------------- | ----------- | ----------- |
| id                  | UUID        | Primary key |
| customer_id         | UUID        | Required    |
| make                | VARCHAR     | Required    |
| model               | VARCHAR     | Required    |
| year                | SMALLINT    | Nullable    |
| registration_number | VARCHAR     | Nullable    |
| vin                 | VARCHAR     | Nullable    |
| mileage             | INTEGER     | Nullable    |
| notes               | TEXT        | Nullable    |
| created_at          | TIMESTAMPTZ | Required    |
| updated_at          | TIMESTAMPTZ | Required    |

Relationship:

```text
customer 1 ─── N vehicles
```

---

# 10. Vehicle Data Rules

The system should not require every possible vehicle identifier from the beginning.

For a simple service request:

```text
Make
Model
```

may be sufficient.

Additional details can be added later.

This follows the UX principle:

> Collect the minimum information required to help the customer.

---

# 11. `service_requests`

This is the central customer enquiry entity.

```text
service_requests
```

### Columns

| Column                | Type        | Notes                                                                      |
| --------------------- | ----------- | -------------------------------------------------------------------------- |
| id                    | UUID        | Primary key                                                                |
| reference             | VARCHAR     | Human-readable unique reference                                            |
| customer_id           | UUID        | Required                                                                   |
| vehicle_id            | UUID        | Nullable initially                                                         |
| category              | VARCHAR     | Required                                                                   |
| description           | TEXT        | Required                                                                   |
| occurrence_details    | TEXT        | Nullable                                                                   |
| preferred_date        | DATE        | Nullable                                                                   |
| preferred_time_period | ENUM        | MORNING / AFTERNOON / EVENING                                              |
| contact_preference    | ENUM        | PHONE / WHATSAPP                                                           |
| status                | ENUM        | NEW / CONTACTED / SCHEDULED / IN_PROGRESS / COMPLETED / CLOSED / CANCELLED |
| internal_notes        | TEXT        | Nullable                                                                   |
| created_at            | TIMESTAMPTZ | Required                                                                   |
| updated_at            | TIMESTAMPTZ | Required                                                                   |
| contacted_at          | TIMESTAMPTZ | Nullable                                                                   |
| completed_at          | TIMESTAMPTZ | Nullable                                                                   |

---

# 12. Service Request Reference

The customer-facing reference should be readable.

Example:

```text
FA-1042
```

The database primary key remains a UUID.

This gives us:

```text
Internal identity:
550e8400-e29b-41d4-a716-446655440000

Customer reference:
FA-1042
```

---

# 13. Service Request Category

Initial categories can include:

```text
MECHANICAL
ELECTRICAL
DIAGNOSTICS
STARTING
AC
BRAKES
SUSPENSION
STEERING
COOLING
SERVICING
REWIRING
OTHER
```

These should not be treated as permanent.

The category system can later become database-managed if the business needs dynamic categories.

---

# 14. Service Request Media

Customer-uploaded images/videos should be associated with the request.

```text
service_request_media
```

### Columns

| Column             | Type        |
| ------------------ | ----------- |
| id                 | UUID        |
| service_request_id | UUID        |
| media_id           | UUID        |
| created_at         | TIMESTAMPTZ |

Relationship:

```text
ServiceRequest 1 ─── N Media
```

---

# 15. `appointments`

Appointments represent scheduled workshop interactions.

```text
appointments
```

### Columns

| Column             | Type        | Notes                                                                 |
| ------------------ | ----------- | --------------------------------------------------------------------- |
| id                 | UUID        | Primary key                                                           |
| reference          | VARCHAR     | Unique                                                                |
| customer_id        | UUID        | Required                                                              |
| vehicle_id         | UUID        | Nullable                                                              |
| service_request_id | UUID        | Nullable                                                              |
| scheduled_date     | DATE        | Required                                                              |
| start_time         | TIME        | Nullable                                                              |
| end_time           | TIME        | Nullable                                                              |
| status             | ENUM        | REQUESTED / CONFIRMED / RESCHEDULED / COMPLETED / CANCELLED / NO_SHOW |
| notes              | TEXT        | Nullable                                                              |
| confirmed_at       | TIMESTAMPTZ | Nullable                                                              |
| created_at         | TIMESTAMPTZ | Required                                                              |
| updated_at         | TIMESTAMPTZ | Required                                                              |

---

# 16. Appointment Principle

An appointment is not automatically confirmed simply because a customer selected a preferred date.

The workflow is:

```text
Customer preference
       ↓
REQUESTED
       ↓
FORauto confirms
       ↓
CONFIRMED
```

---

# 17. `jobs`

A job represents actual workshop work.

```text
jobs
```

### Columns

| Column             | Type        | Notes                                          |
| ------------------ | ----------- | ---------------------------------------------- |
| id                 | UUID        | Primary key                                    |
| reference          | VARCHAR     | Unique                                         |
| customer_id        | UUID        | Required                                       |
| vehicle_id         | UUID        | Required                                       |
| service_request_id | UUID        | Nullable                                       |
| appointment_id     | UUID        | Nullable                                       |
| status             | ENUM        | ASSIGNED / IN_PROGRESS / COMPLETED / CANCELLED |
| diagnosis          | TEXT        | Nullable                                       |
| work_performed     | TEXT        | Nullable                                       |
| internal_notes     | TEXT        | Nullable                                       |
| started_at         | TIMESTAMPTZ | Nullable                                       |
| completed_at       | TIMESTAMPTZ | Nullable                                       |
| created_at         | TIMESTAMPTZ | Required                                       |
| updated_at         | TIMESTAMPTZ | Required                                       |

---

# 18. Job Relationships

```text
Customer
   │
Vehicle
   │
Service Request
   │
Appointment
   │
Job
```

Not every job must necessarily originate from an online service request.

A job may eventually be created directly by staff for a walk-in customer.

This is important for the real-world workshop.

---

# 19. Walk-In Support

The system should support customers who arrive physically.

Example:

```text
Customer arrives
       ↓
Admin creates customer
       ↓
Admin creates vehicle
       ↓
Admin creates job
       ↓
Technician assigned
```

No online request should be required.

This keeps the digital system aligned with actual workshop operations.

---

# 20. `job_assignments`

Represents staff assigned to a job.

```text
job_assignments
```

### Columns

| Column          | Type        |
| --------------- | ----------- |
| id              | UUID        |
| job_id          | UUID        |
| staff_id        | UUID        |
| assignment_role | ENUM        |
| assigned_at     | TIMESTAMPTZ |
| unassigned_at   | TIMESTAMPTZ |
| created_at      | TIMESTAMPTZ |

Potential assignment roles:

```text
PRIMARY
SUPPORT
APPRENTICE
SUPERVISOR
```

---

# 21. `work_entries`

Represents individual work notes or stages performed on a job.

```text
work_entries
```

### Columns

| Column      | Type        |
| ----------- | ----------- |
| id          | UUID        |
| job_id      | UUID        |
| staff_id    | UUID        |
| title       | VARCHAR     |
| description | TEXT        |
| created_at  | TIMESTAMPTZ |
| updated_at  | TIMESTAMPTZ |

Example:

```text
Job
 ├── Initial diagnosis
 ├── Electrical testing
 ├── Fault repair
 └── Final test
```

This gives FORauto a more detailed history than a single giant notes field.

---

# 22. `job_media`

Associates media with workshop jobs.

```text
job_media
```

### Columns

| Column     | Type        |
| ---------- | ----------- |
| id         | UUID        |
| job_id     | UUID        |
| media_id   | UUID        |
| created_at | TIMESTAMPTZ |

Media may include:

* Before photos
* During-work photos
* After photos
* Diagnostic screenshots
* Videos

---

# 23. `service_records`

Represents completed service history for a vehicle.

```text
service_records
```

### Columns

| Column         | Type        |
| -------------- | ----------- |
| id             | UUID        |
| vehicle_id     | UUID        |
| job_id         | UUID        |
| service_date   | DATE        |
| summary        | TEXT        |
| work_performed | TEXT        |
| notes          | TEXT        |
| created_at     | TIMESTAMPTZ |
| updated_at     | TIMESTAMPTZ |

Relationship:

```text
Vehicle 1 ─── N ServiceRecords
Job 1 ─── 0..1 ServiceRecord
```

A service record should normally be generated from completed work.

---

# 24. `inspections`

Represents vehicle inspection requests and completed inspections.

```text
inspections
```

### Columns

| Column         | Type        |
| -------------- | ----------- |
| id             | UUID        |
| reference      | VARCHAR     |
| customer_id    | UUID        |
| vehicle_id     | UUID        |
| appointment_id | UUID        |
| purpose        | ENUM        |
| status         | ENUM        |
| general_notes  | TEXT        |
| performed_by   | UUID        |
| scheduled_at   | TIMESTAMPTZ |
| completed_at   | TIMESTAMPTZ |
| created_at     | TIMESTAMPTZ |
| updated_at     | TIMESTAMPTZ |

---

# 25. Inspection Purpose

Potential values:

```text
PRE_PURCHASE
PRE_SALE
GENERAL_ASSESSMENT
PRE_TRIP
OTHER
```

---

# 26. Inspection Status

```text
REQUESTED
SCHEDULED
IN_PROGRESS
COMPLETED
CANCELLED
```

---

# 27. `inspection_findings`

Stores individual inspection results.

```text
inspection_findings
```

### Columns

| Column         | Type        |
| -------------- | ----------- |
| id             | UUID        |
| inspection_id  | UUID        |
| category       | VARCHAR     |
| condition      | ENUM        |
| finding        | TEXT        |
| recommendation | TEXT        |
| created_at     | TIMESTAMPTZ |
| updated_at     | TIMESTAMPTZ |

Potential condition values:

```text
GOOD
ATTENTION
REPAIR_RECOMMENDED
CRITICAL
NOT_INSPECTED
```

The final condition vocabulary should be validated against the actual inspection process before implementation.

---

# 28. Inspection Categories

Potential initial categories:

```text
ENGINE
TRANSMISSION
ELECTRICAL
COOLING
BRAKES
SUSPENSION
STEERING
AC
DIAGNOSTICS
BODY
INTERIOR
```

The database should allow categories to evolve without requiring destructive schema changes.

---

# 29. `media`

A centralized media metadata table.

```text
media
```

### Columns

| Column            | Type        |
| ----------------- | ----------- |
| id                | UUID        |
| storage_provider  | VARCHAR     |
| storage_key       | TEXT        |
| original_filename | TEXT        |
| mime_type         | VARCHAR     |
| size_bytes        | BIGINT      |
| width             | INTEGER     |
| height            | INTEGER     |
| visibility        | ENUM        |
| uploaded_by       | UUID        |
| created_at        | TIMESTAMPTZ |

---

# 30. Media Visibility

Potential values:

```text
PRIVATE
INTERNAL
PUBLIC
```

Example:

Customer-uploaded problem photo:

```text
PRIVATE
```

Technician job photo:

```text
INTERNAL
```

Published portfolio photo:

```text
PUBLIC
```

This prevents internal media from accidentally becoming public.

---

# 31. `work_items`

Represents published real-world FORauto work.

```text
work_items
```

### Columns

| Column         | Type        |
| -------------- | ----------- |
| id             | UUID        |
| slug           | VARCHAR     |
| title          | VARCHAR     |
| category       | VARCHAR     |
| vehicle_make   | VARCHAR     |
| vehicle_model  | VARCHAR     |
| problem        | TEXT        |
| work_performed | TEXT        |
| description    | TEXT        |
| status         | ENUM        |
| published_at   | TIMESTAMPTZ |
| created_at     | TIMESTAMPTZ |
| updated_at     | TIMESTAMPTZ |

Potential status:

```text
DRAFT
PUBLISHED
ARCHIVED
```

---

# 32. Work Media

A work item can contain multiple images.

A join table can be used:

```text
work_item_media
```

### Columns

| Column       | Type    |
| ------------ | ------- |
| work_item_id | UUID    |
| media_id     | UUID    |
| sort_order   | INTEGER |

This allows the same media architecture to support multiple content types.

---

# 33. `vehicle_listings`

Future vehicle sales capability.

```text
vehicle_listings
```

### Columns

| Column             | Type        |
| ------------------ | ----------- |
| id                 | UUID        |
| vehicle_id         | UUID        |
| seller_customer_id | UUID        |
| title              | VARCHAR     |
| description        | TEXT        |
| asking_price       | NUMERIC     |
| location           | VARCHAR     |
| status             | ENUM        |
| submitted_at       | TIMESTAMPTZ |
| published_at       | TIMESTAMPTZ |
| sold_at            | TIMESTAMPTZ |
| created_at         | TIMESTAMPTZ |
| updated_at         | TIMESTAMPTZ |

---

# 34. Vehicle Listing Status

```text
SUBMITTED
UNDER_REVIEW
APPROVED
PUBLISHED
SOLD
REJECTED
ARCHIVED
```

Vehicle listings are a future module and do not need to block the initial service platform.

---

# 35. `reviews`

Stores genuine customer reviews.

```text
reviews
```

### Columns

| Column      | Type        |
| ----------- | ----------- |
| id          | UUID        |
| customer_id | UUID        |
| job_id      | UUID        |
| rating      | SMALLINT    |
| comment     | TEXT        |
| status      | ENUM        |
| created_at  | TIMESTAMPTZ |
| updated_at  | TIMESTAMPTZ |

Potential status:

```text
PENDING
PUBLISHED
HIDDEN
```

A review should be linked to a real customer/job where practical.

---

# 36. Review Rules

The system should never manufacture reviews.

Only genuine customer-submitted reviews should become published testimonials.

Rating validation:

```text
1 ≤ rating ≤ 5
```

---

# 37. `notifications`

Stores application-level notification records.

```text
notifications
```

### Columns

| Column            | Type        |
| ----------------- | ----------- |
| id                | UUID        |
| recipient_user_id | UUID        |
| type              | VARCHAR     |
| channel           | ENUM        |
| title             | VARCHAR     |
| message           | TEXT        |
| status            | ENUM        |
| sent_at           | TIMESTAMPTZ |
| created_at        | TIMESTAMPTZ |

Potential channels:

```text
EMAIL
WHATSAPP
SMS
IN_APP
```

---

# 38. Notification Status

```text
PENDING
SENT
FAILED
READ
```

Not every notification needs every state.

---

# 39. Primary Relationships

The central relationships are:

```text
USER
 │
 ├──────── CUSTOMER
 │             │
 │             └──── VEHICLE
 │                    │
 │                    ├──── SERVICE REQUEST
 │                    │          │
 │                    │          └──── APPOINTMENT
 │                    │                    │
 │                    │                    └──── JOB
 │                    │                         │
 │                    │                         ├──── ASSIGNMENTS
 │                    │                         ├──── WORK ENTRIES
 │                    │                         ├──── MEDIA
 │                    │                         └──── SERVICE RECORD
 │                    │
 │                    └──── INSPECTION
 │
 └──────── STAFF
```

---

# 40. Foreign Key Strategy

Relationships should use PostgreSQL foreign keys.

Examples:

```text
vehicles.customer_id
    → customers.id

service_requests.customer_id
    → customers.id

service_requests.vehicle_id
    → vehicles.id

appointments.service_request_id
    → service_requests.id

jobs.vehicle_id
    → vehicles.id

job_assignments.staff_id
    → staff.id
```

Foreign keys should be used to prevent invalid references.

---

# 41. Deletion Strategy

Customer and operational records should generally **not be hard-deleted casually**.

For example:

Deleting a customer should not automatically destroy:

* Vehicle history
* Completed jobs
* Inspection reports
* Service records

Use appropriate archival/deactivation strategies.

Where deletion is genuinely required, foreign-key behaviour must be explicitly defined.

---

# 42. Timestamps

Operational tables should generally contain:

```text
created_at
updated_at
```

Event-specific timestamps should also be used where useful.

Examples:

```text
contacted_at
confirmed_at
started_at
completed_at
published_at
cancelled_at
```

This provides a useful operational timeline.

---

# 43. UUID Strategy

Use UUIDs for internal primary keys.

Benefits:

* Harder to enumerate
* Suitable for distributed systems later
* Safer public identifiers
* Easy to generate

Human-readable references should be separate.

Example:

```text
UUID:
b7d8...

Reference:
FA-1042
```

---

# 44. Slugs

Public content should use unique slugs.

Example:

```text
/services/auto-electrical
/work/toyota-camry-electrical-repair
```

Database:

```text
slug VARCHAR UNIQUE
```

Slugs should be normalized and stable.

---

# 45. Indexing Strategy

Indexes should support common queries.

Initial candidates:

```text
users(phone)
users(email)

customers(phone)

vehicles(customer_id)
vehicles(registration_number)

service_requests(status)
service_requests(customer_id)
service_requests(vehicle_id)
service_requests(created_at)

appointments(scheduled_date)
appointments(status)
appointments(customer_id)

jobs(status)
jobs(vehicle_id)
jobs(customer_id)

job_assignments(staff_id)
job_assignments(job_id)

service_records(vehicle_id)

work_items(status)
work_items(slug)

vehicle_listings(status)
vehicle_listings(slug)
```

Indexes should be added based on actual query patterns rather than blindly indexing every column.

---

# 46. Unique Constraints

Potential unique constraints:

```text
users.email
users.phone
work_items.slug
vehicle_listings.slug
```

Vehicle registration numbers may also need uniqueness, but this should account for real-world data quality and whether the same vehicle can legitimately appear under multiple records.

---

# 47. Check Constraints

PostgreSQL constraints should enforce simple data rules.

Examples:

```text
year > 1885
mileage >= 0
rating BETWEEN 1 AND 5
asking_price >= 0
```

Where values are optional, `NULL` should remain valid.

---

# 48. Status Transitions

Status values should not be treated as arbitrary strings at the application level.

Example:

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

The backend should validate allowed transitions.

For example:

```text
CLOSED → IN_PROGRESS
```

should not happen casually.

---

# 49. Audit Log — Future Addition

A future:

```text
audit_logs
```

table can track important administrative actions.

Potential fields:

```text
id
actor_user_id
action
entity_type
entity_id
old_value
new_value
created_at
```

This becomes especially useful as the admin system grows.

---

# 50. Soft Deletion / Archiving

For records that should disappear from normal views but remain historically useful, prefer:

```text
status = ARCHIVED
```

or a dedicated:

```text
deleted_at
```

depending on the entity.

Do not automatically apply soft deletion to every table.

---

# 51. MVP Database Scope

The initial implementation should prioritize:

```text
users
customers
staff
vehicles
service_requests
service_request_media
appointments
jobs
job_assignments
job_media
work_entries
service_records
media
work_items
```

Potentially later:

```text
inspections
inspection_findings
reviews
notifications
vehicle_listings
```

This keeps the first migration manageable.

---

# 52. Data Flow Example

A normal customer journey could produce:

```text
Customer
   ↓
Vehicle
   ↓
Service Request
   ↓
Appointment
   ↓
Job
   ↓
Job Assignment
   ↓
Work Entries
   ↓
Job Media
   ↓
Completed Job
   ↓
Service Record
```

The customer does not need to understand any of these database entities.

They simply experience:

```text
"I need help with my car."
        ↓
FORauto contacts me
        ↓
I bring the car
        ↓
The work is done
        ↓
My service is recorded
```

---

# 53. Walk-In Data Flow

The system also supports:

```text
Walk-in Customer
      ↓
Customer
      ↓
Vehicle
      ↓
Job
      ↓
Technician
      ↓
Work
      ↓
Service Record
```

No artificial online-request step is required.

---

# 54. Future Quote & Invoice Architecture

Not part of the initial schema, but the database should leave room for:

```text
Quote
 ├── Quote Items
 └── Approval

Invoice
 ├── Invoice Items
 └── Payment
```

Potential future relationship:

```text
Job
 ↓
Quote
 ↓
Approved
 ↓
Invoice
 ↓
Payment
```

These should only be introduced once FORauto's actual pricing and payment workflow is defined.

---

# 55. Future Maintenance Architecture

Future vehicle maintenance features may introduce:

```text
maintenance_records
maintenance_reminders
service_intervals
```

Potential relationship:

```text
Vehicle
   ↓
Service History
   ↓
Maintenance Schedule
   ↓
Reminder
```

No need to build these tables during the first release.

---

# 56. Future Parts Inventory

If FORauto later manages workshop parts:

```text
parts
inventory
stock_movements
suppliers
```

These should remain separate from the initial service schema.

---

# 57. Database Migration Strategy

All schema changes must be version-controlled.

Example:

```text
database/
└── migrations/
    ├── 001_extensions.sql
    ├── 002_users.sql
    ├── 003_customers.sql
    ├── 004_staff.sql
    ├── 005_vehicles.sql
    ├── 006_service_requests.sql
    ├── 007_appointments.sql
    ├── 008_jobs.sql
    └── ...
```

Migrations should be:

* Ordered
* Reproducible
* Reviewable
* Safe to run in CI/staging/production

---

# 58. Seed Data

The production system should **not depend on fake customer, vehicle, job, or review data**.

Development can have controlled fixtures where necessary for automated tests.

Real business records should enter through:

* Admin creation
* Customer submissions
* Actual completed jobs
* Genuine reviews

---

# 59. Privacy

The database will contain potentially sensitive customer information.

Protect:

* Phone numbers
* Email addresses
* Vehicle identifiers
* Internal notes
* Inspection reports
* Job information
* Uploaded media

Access should follow role-based authorization.

---

# 60. Database Security

Production database access should:

* Use encrypted connections where supported
* Use restricted credentials
* Never expose PostgreSQL directly to the public internet unnecessarily
* Keep credentials in environment variables/secrets
* Restrict database permissions
* Run regular backups

---

# 61. Backup Strategy

Production should have automated backups.

At minimum:

* Scheduled database backups
* Point-in-time recovery if supported/appropriate
* Media storage redundancy
* Recovery procedure documented

A backup is only useful if restoration is tested.

---

# 62. Schema Evolution Principle

The schema should evolve from actual business requirements.

Do not create large numbers of speculative tables simply because a feature might exist someday.

The approach is:

```text
Confirmed requirement
       ↓
Model
       ↓
Implement
       ↓
Observe real usage
       ↓
Extend
```

---

# 63. Database North Star

The database should answer the most important operational questions:

> Who is the customer?

> What vehicle do they own?

> What problem did they report?

> What was scheduled?

> What work was done?

> Who worked on it?

> What happened to the vehicle?

> What has FORauto done for this customer before?

That is the core of the system.

---

# 64. Summary

The FORauto database is centered around:

```text
CUSTOMER
    ↓
VEHICLE
    ↓
REQUEST
    ↓
APPOINTMENT
    ↓
JOB
    ↓
STAFF
    ↓
WORK
    ↓
SERVICE HISTORY
```

with supporting domains for:

```text
MEDIA
INSPECTIONS
REVIEWS
WORK / PORTFOLIO
VEHICLE LISTINGS
NOTIFICATIONS
```

The schema deliberately supports both:

**digital customers**

and

**traditional walk-in workshop customers.**

That distinction is essential to FORauto's real-world operation.

---

# 65. Next Technical Document

The database model defined here becomes the foundation for:

**`docs/API.md`**

The API specification will define exactly how the frontend communicates with these entities, including:

* Endpoints
* HTTP methods
* Authentication
* Request bodies
* Response structures
* Validation
* Error codes
* Pagination
* Filtering
* Authorization
* File uploads
* Status transitions
