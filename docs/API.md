# FORauto API Specification

**Product:** FORauto
**Domain:** Automotive Services & Vehicle Solutions
**API Style:** REST
**API Version:** v1
**Primary Database:** PostgreSQL
**Status:** Initial API contract

---

## 1. Purpose

This document defines the API contract for the FORauto platform.

The API supports:

* Public website content
* Customer enquiries
* Guest service requests
* Customer accounts
* Vehicle records
* Appointments
* Automotive jobs
* Staff and technician management
* Work/project records
* Media uploads
* Vehicle inspections
* Vehicle sales assistance
* Reviews
* Notifications

The API is designed around the principle:

> **The API should make the existing automotive business easier to operate, not force the business into unnecessary software complexity.**

---

# 2. API Principles

The API should follow these principles:

### 2.1 RESTful

Resources should be represented as nouns.

```text
/service-requests
/vehicles
/appointments
/jobs
/staff
```

Avoid action-heavy routes such as:

```text
/createNewRequest
/updateCustomerVehicle
```

---

### 2.2 JSON

Requests and responses should use JSON unless handling file uploads.

```http
Content-Type: application/json
```

---

### 2.3 Versioned

All API routes begin with:

```text
/api/v1
```

Example:

```text
GET /api/v1/services
```

---

### 2.4 PostgreSQL is the source of truth

The API must not maintain a separate competing data store for core business data.

---

### 2.5 Guest-friendly

A customer should be able to request help without creating an account.

Account creation should improve the experience, not be a requirement for basic service enquiries.

---

### 2.6 Explicit authorization

Every protected endpoint must verify:

1. Authentication
2. User role
3. Resource ownership where applicable

---

### 2.7 No fake production data

Production endpoints must use real database records.

Fixtures may exist for automated tests but must never be treated as real customer, vehicle, job, or review data.

---

# 3. Base URL

Development:

```text
http://localhost:<API_PORT>/api/v1
```

Production:

```text
https://<api-domain>/api/v1
```

The production domain should be configured through environment variables rather than hard-coded.

---

# 4. Authentication

FORauto supports two broad access modes:

### Guest

Unauthenticated visitors can:

* View public content
* Contact FORauto
* Submit service requests
* Submit selected future enquiries

### Authenticated customer

Customers can:

* Manage their vehicles
* View their requests
* View appointments
* View service history
* Manage their profile

### Staff

Staff access depends on role.

Supported staff roles:

```text
ADMIN
MANAGER
TECHNICIAN
STAFF
```

---

# 5. Authentication Strategy

Recommended initial strategy:

* Short-lived access token
* Refresh token
* Secure HTTP-only cookie where appropriate
* Password hashing using a modern password hashing algorithm
* Server-side authorization checks

The exact token storage implementation should be finalized during implementation based on the deployment architecture.

---

# 6. API Response Format

Successful responses should use a consistent structure.

### Single resource

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Example"
  }
}
```

### Collection

```json
{
  "success": true,
  "data": [],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 0,
    "total_pages": 0
  }
}
```

---

# 7. Error Response

Errors should follow a consistent format.

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Please provide a valid phone number.",
    "details": {
      "phone": "Invalid Nigerian phone number."
    }
  }
}
```

The `code` should be stable enough for the frontend to make decisions without depending on human-readable messages.

---

# 8. HTTP Status Codes

| Status | Meaning                                  |
| ------ | ---------------------------------------- |
| `200`  | Successful request                       |
| `201`  | Resource created                         |
| `204`  | Successful request with no response body |
| `400`  | Invalid request                          |
| `401`  | Authentication required/invalid          |
| `403`  | Authenticated but not authorized         |
| `404`  | Resource not found                       |
| `409`  | Resource conflict                        |
| `413`  | Payload/file too large                   |
| `415`  | Unsupported media type                   |
| `422`  | Validation failure                       |
| `429`  | Rate limit exceeded                      |
| `500`  | Internal server error                    |
| `503`  | Service temporarily unavailable          |

---

# 9. Endpoint Inventory

## Public

```text
GET    /services
GET    /services/:slug

GET    /work
GET    /work/:slug

GET    /vehicle-services
GET    /contact
```

Some of these may eventually be served directly from the frontend if content does not require dynamic management.

---

## Authentication

```text
POST   /auth/register
POST   /auth/login
POST   /auth/refresh
POST   /auth/logout
GET    /auth/me
```

---

## Customers

```text
GET    /customers/me
PATCH  /customers/me
GET    /customers/me/requests
GET    /customers/me/appointments
GET    /customers/me/service-history
```

---

## Vehicles

```text
GET    /vehicles
POST   /vehicles
GET    /vehicles/:id
PATCH  /vehicles/:id
DELETE /vehicles/:id
GET    /vehicles/:id/service-history
```

---

## Service Requests

```text
POST   /service-requests
GET    /service-requests/:id
GET    /service-requests
PATCH  /service-requests/:id
```

The collection endpoint is staff-protected.

---

## Media

```text
POST   /media/upload-url
POST   /media/complete
DELETE /media/:id
```

Authorization depends on the media's owner and intended visibility.

---

## Appointments

```text
POST   /appointments
GET    /appointments/:id
GET    /appointments
PATCH  /appointments/:id
```

Staff access is required for operational appointment management.

---

## Jobs

```text
GET    /jobs
GET    /jobs/:id
POST   /jobs
PATCH  /jobs/:id
POST   /jobs/:id/assignments
DELETE /jobs/:id/assignments/:staffId
POST   /jobs/:id/work-entries
POST   /jobs/:id/media
```

---

## Staff

```text
GET    /staff
POST   /staff
GET    /staff/:id
PATCH  /staff/:id
```

Restricted to authorized staff.

---

## Work

```text
GET    /work
POST   /work
GET    /work/:slug
PATCH  /work/:id
DELETE /work/:id
```

Public users can read published work.

Authorized staff can manage work records.

---

## Inspections

Future/P1:

```text
POST   /inspections
GET    /inspections/:id
PATCH  /inspections/:id
POST   /inspections/:id/findings
PATCH  /inspections/:id/findings/:findingId
POST   /inspections/:id/complete
```

---

## Vehicle Listings

Future/P2:

```text
GET    /vehicle-listings
GET    /vehicle-listings/:slug
POST   /vehicle-listings
PATCH  /vehicle-listings/:id
POST   /vehicle-listings/:id/publish
POST   /vehicle-listings/:id/mark-sold
```

---

## Reviews

Future/P1:

```text
POST   /reviews
GET    /reviews
PATCH  /reviews/:id
```

---

## Notifications

Future/P1:

```text
GET    /notifications
PATCH  /notifications/:id/read
```

Internal notification delivery should be abstracted from the API resource itself.

---

# 10. Public Service Endpoints

## GET `/services`

Returns published automotive services.

Example:

```json
{
  "success": true,
  "data": [
    {
      "slug": "mechanical-repairs",
      "name": "Mechanical Repairs",
      "short_description": "Mechanical diagnosis and repair for different vehicle makes.",
      "image_url": "...",
      "featured": true
    }
  ]
}
```

Only published services should be returned publicly.

---

## GET `/services/:slug`

Returns a service detail page.

Example:

```json
{
  "success": true,
  "data": {
    "slug": "auto-electrical",
    "name": "Auto Electrical",
    "description": "...",
    "services": [
      "Electrical diagnosis",
      "Wiring",
      "Electrical fault repair"
    ],
    "featured_work": []
  }
}
```

The exact service catalogue must be based on FORauto's confirmed real services.

Do not publish services simply because they exist in the database schema.

---

# 11. Work Endpoints

## GET `/work`

Returns published examples of completed work.

Supported filters may include:

```text
?category=electrical
?vehicle_make=Toyota
?page=1
&limit=20
```

Example:

```json
{
  "success": true,
  "data": [
    {
      "slug": "toyota-camry-electrical-repair",
      "title": "Toyota Camry Electrical Repair",
      "category": "Electrical",
      "vehicle_make": "Toyota",
      "vehicle_model": "Camry",
      "problem": "Electrical fault",
      "summary": "...",
      "cover_image": "..."
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 1,
    "total_pages": 1
  }
}
```

---

## GET `/work/:slug`

Returns the public detail page for a work item.

Only:

```text
PUBLISHED
```

records are publicly accessible.

Draft and archived records require staff authorization.

---

# 12. Authentication Endpoints

## POST `/auth/register`

Creates a customer account.

Example:

```json
{
  "first_name": "Rachael",
  "last_name": "Olayode",
  "phone": "08000000000",
  "email": "customer@example.com",
  "password": "secure-password"
}
```

Response:

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "role": "CUSTOMER"
    }
  }
}
```

---

## POST `/auth/login`

```json
{
  "email": "customer@example.com",
  "password": "secure-password"
}
```

Authentication responses must not expose:

* password
* password hash
* refresh token in normal JSON responses where HTTP-only cookies are used

---

## POST `/auth/refresh`

Creates a new access token using a valid refresh mechanism.

---

## POST `/auth/logout`

Invalidates the relevant session/refresh mechanism.

---

## GET `/auth/me`

Returns the authenticated user's basic account information.

---

# 13. Customer Endpoints

## GET `/customers/me`

Returns the authenticated customer's profile.

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "first_name": "Rachael",
    "last_name": "Olayode",
    "phone": "08000000000",
    "email": "customer@example.com"
  }
}
```

---

## PATCH `/customers/me`

Updates editable customer information.

Sensitive account fields must be handled separately where necessary.

---

# 14. Vehicle Endpoints

## POST `/vehicles`

Creates a vehicle owned by the authenticated customer.

```json
{
  "make": "Toyota",
  "model": "Camry",
  "year": 2018,
  "registration_number": "ABC123XY",
  "vin": "optional",
  "mileage": 85000,
  "notes": "Used primarily for city driving."
}
```

---

## GET `/vehicles`

Returns the authenticated customer's vehicles.

A customer must never receive another customer's vehicles.

---

## GET `/vehicles/:id`

Returns one vehicle if the authenticated user owns it or has authorized staff access.

---

## PATCH `/vehicles/:id`

Updates editable vehicle information.

---

## DELETE `/vehicles/:id`

Deletes or archives the vehicle according to the final retention policy.

Because vehicle records can be connected to historical jobs and service records, hard deletion should not be used casually.

---

## GET `/vehicles/:id/service-history`

Returns historical service records.

Example:

```json
{
  "success": true,
  "data": [
    {
      "service_date": "2026-09-20",
      "summary": "Electrical repair",
      "work_performed": "...",
      "job_reference": "FA-1007"
    }
  ]
}
```

---

# 15. Guest Service Request

This is one of the most important API flows.

## POST `/service-requests`

Authentication is **not required**.

The customer may submit:

* Name
* Phone
* Email
* WhatsApp number
* Vehicle information
* Problem category
* Problem description
* When the problem occurs
* Preferred date
* Preferred time period
* Contact preference
* Photos/videos

Example:

```json
{
  "customer": {
    "first_name": "John",
    "last_name": "Doe",
    "phone": "08000000000",
    "email": "john@example.com",
    "whatsapp_phone": "08000000000"
  },
  "vehicle": {
    "make": "Toyota",
    "model": "Camry",
    "year": 2018,
    "registration_number": "ABC123XY"
  },
  "category": "MECHANICAL",
  "description": "The car makes a loud noise when accelerating.",
  "occurrence_details": "Mostly happens when the engine is hot.",
  "preferred_date": "2026-10-05",
  "preferred_time_period": "AFTERNOON",
  "contact_preference": "WHATSAPP",
  "media_ids": []
}
```

---

## Service Request Response

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "reference": "FA-1042",
    "status": "NEW",
    "message": "Your request has been received."
  }
}
```

The customer-facing reference should be safe to share with FORauto staff.

The internal UUID should not be treated as a public tracking credential.

---

# 16. Guest Request Security

A guest must not be able to retrieve another customer's request simply by knowing or guessing an ID.

Therefore:

```text
GET /service-requests/:id
```

must not expose private request information to arbitrary unauthenticated users.

Future guest tracking can use a separate secure, random access token.

Example future pattern:

```text
/service-requests/track/<secure-token>
```

The token must:

* Be cryptographically random
* Not contain customer information
* Be revocable/expirable where appropriate
* Grant access only to the intended request

---

# 17. Service Request Status

Supported statuses:

```text
NEW
CONTACTED
SCHEDULED
IN_PROGRESS
COMPLETED
CLOSED
CANCELLED
```

Recommended transitions:

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

Cancellation may occur where appropriate.

The API should reject invalid transitions.

For example, a request should not jump from:

```text
NEW → CLOSED
```

without the appropriate operational action.

---

# 18. Idempotency

Service request creation should support idempotency to prevent accidental duplicate submissions caused by:

* Double-clicking submit
* Mobile network retries
* Browser retries
* Client timeout followed by retry

Example:

```http
Idempotency-Key: <unique-client-generated-key>
```

The API should return the original created request when the same valid idempotency key is replayed within the configured retention period.

---

# 19. Media Uploads

Large images and videos should not unnecessarily pass through the application server.

Recommended flow:

```text
Client
  ↓
POST /media/upload-url
  ↓
API returns signed upload URL
  ↓
Client uploads directly to object storage
  ↓
POST /media/complete
  ↓
API validates/registers media
  ↓
media_id returned
```

Example:

```json
{
  "filename": "engine.jpg",
  "content_type": "image/jpeg",
  "size": 2840000
}
```

Response:

```json
{
  "success": true,
  "data": {
    "media_id": "uuid",
    "upload_url": "signed-upload-url"
  }
}
```

---

# 20. Media Validation

The API must validate:

* MIME type
* File size
* File extension
* Upload ownership
* Storage key
* Association target

Allowed file types should initially be intentionally limited.

For example:

```text
image/jpeg
image/png
image/webp
video/mp4
```

The exact maximum sizes should be configured through environment/configuration rather than scattered through application code.

---

# 21. Appointment Endpoints

## POST `/appointments`

Appointments should normally be created from an existing service request.

Example:

```json
{
  "service_request_id": "uuid",
  "vehicle_id": "uuid",
  "scheduled_date": "2026-10-05",
  "start_time": "13:00",
  "end_time": "14:00",
  "notes": "Customer prefers afternoon."
}
```

---

## Important Appointment Rule

A customer's preferred date/time is **not automatically a confirmed appointment**.

The operational flow is:

```text
Customer preference
        ↓
FORauto reviews
        ↓
Appointment requested
        ↓
FORauto confirms/reschedules
        ↓
Confirmed appointment
```

This prevents the website from promising availability that the workshop has not confirmed.

---

# 22. Appointment Status

```text
REQUESTED
CONFIRMED
RESCHEDULED
COMPLETED
CANCELLED
NO_SHOW
```

Invalid state transitions should be rejected.

---

# 23. Job Endpoints

A job represents actual workshop work.

Example lifecycle:

```text
Service Request
      ↓
Appointment
      ↓
Job
      ↓
Technician Assignment
      ↓
Diagnosis
      ↓
Work
      ↓
Completion
      ↓
Service Record
```

---

## POST `/jobs`

Normally created by authorized staff.

```json
{
  "customer_id": "uuid",
  "vehicle_id": "uuid",
  "service_request_id": "uuid",
  "appointment_id": "uuid"
}
```

---

## PATCH `/jobs/:id`

Updates job information.

Possible fields:

```json
{
  "status": "IN_PROGRESS",
  "diagnosis": "Fault found in charging circuit.",
  "work_performed": "Repaired damaged wiring.",
  "internal_notes": "..."
}
```

---

# 24. Job Status

```text
ASSIGNED
IN_PROGRESS
COMPLETED
CANCELLED
```

A job should only be marked `COMPLETED` after the necessary completion information has been captured.

Where appropriate, completing a job should trigger creation of a `service_record`.

---

# 25. Technician Assignment

## POST `/jobs/:id/assignments`

```json
{
  "staff_id": "uuid",
  "assignment_role": "PRIMARY"
}
```

Supported roles:

```text
PRIMARY
SUPPORT
APPRENTICE
SUPERVISOR
```

Only authorized staff should assign personnel to jobs.

---

# 26. Work Entries

Technicians or authorized staff may add work entries.

```json
{
  "title": "Electrical diagnosis",
  "description": "Checked charging circuit and traced fault."
}
```

This creates a historical operational record rather than overwriting the entire job narrative.

---

# 27. Staff Endpoints

Staff records are operationally sensitive.

## GET `/staff`

Returns staff visible to authorized administrators/managers.

---

## POST `/staff`

Creates a staff record.

```json
{
  "first_name": "Technician",
  "last_name": "Name",
  "phone": "08000000000",
  "role": "TECHNICIAN",
  "specialty": "Auto Electrical"
}
```

---

## PATCH `/staff/:id`

Updates staff details or status.

Staff management must be role-protected.

---

# 28. Work Management

Authorized staff can create a work item.

```json
{
  "title": "Toyota Camry Electrical Repair",
  "slug": "toyota-camry-electrical-repair",
  "category": "Electrical",
  "vehicle_make": "Toyota",
  "vehicle_model": "Camry",
  "problem": "Electrical fault",
  "work_performed": "Repaired damaged wiring.",
  "description": "..."
}
```

The record initially remains:

```text
DRAFT
```

It becomes public only after publishing.

---

# 29. Work Status

```text
DRAFT
PUBLISHED
ARCHIVED
```

Only authorized staff can publish or archive work.

---

# 30. Inspection API — Future

Vehicle inspection functionality should only be implemented after FORauto confirms the actual inspection business process.

Potential endpoint:

```text
POST /inspections
```

Example:

```json
{
  "customer_id": "uuid",
  "vehicle_id": "uuid",
  "appointment_id": "uuid",
  "purpose": "PRE_PURCHASE"
}
```

Findings may contain:

```json
{
  "category": "ENGINE",
  "condition": "ATTENTION",
  "finding": "Oil leakage observed.",
  "recommendation": "Further inspection recommended."
}
```

Potential categories include:

```text
ENGINE
TRANSMISSION
ELECTRICAL
COOLING
SUSPENSION
BRAKES
STEERING
AC
BODY
INTERIOR
DIAGNOSTIC
```

These are proposed categories, not claims about FORauto's current inspection process.

---

# 31. Vehicle Listing API — Future

The vehicle sales assistance feature should initially be an enquiry workflow rather than a marketplace.

A seller could submit:

```json
{
  "vehicle": {
    "make": "Toyota",
    "model": "Corolla",
    "year": 2019,
    "mileage": 70000
  },
  "title": "2019 Toyota Corolla",
  "description": "...",
  "asking_price": 15000000,
  "location": "Lagos",
  "media_ids": []
}
```

The listing begins as:

```text
SUBMITTED
```

Possible lifecycle:

```text
SUBMITTED
   ↓
UNDER_REVIEW
   ↓
APPROVED
   ↓
PUBLISHED
   ↓
SOLD
```

Rejection and archival must also be supported.

FORauto must not publish a vehicle listing without internal review.

---

# 32. Reviews — Future

Reviews should be connected to genuine customer/job relationships.

A review should not simply accept arbitrary:

```text
customer_id
rating
comment
```

without validating that the customer has an eligible completed job.

Example:

```json
{
  "job_id": "uuid",
  "rating": 5,
  "comment": "..."
}
```

The initial status should be:

```text
PENDING
```

before publication if moderation is required.

---

# 33. Notifications — Future/P1

Notifications may eventually support:

```text
EMAIL
WHATSAPP
SMS
IN_APP
```

Example internal notification:

```json
{
  "type": "SERVICE_REQUEST_CREATED",
  "channel": "WHATSAPP",
  "title": "New Service Request",
  "message": "A new service request FA-1042 has been submitted."
}
```

The notification system should be abstracted so the business is not tightly coupled to one provider.

---

# 34. WhatsApp Integration

WhatsApp is a first-class contact channel.

For the initial release, FORauto does not need a complicated WhatsApp API integration just to allow customers to start conversations.

A contextual WhatsApp deep link can be generated by the frontend.

Example message:

```text
Hello FORauto, I found you through your website. I need help with my Toyota Camry. The vehicle is having trouble starting.
```

The website can open WhatsApp with this message pre-filled.

The API should only handle WhatsApp messaging directly when a future automated notification workflow actually requires it.

---

# 35. Phone and Location

Phone calls do not require an API endpoint.

The frontend can use a telephone link:

```text
tel:<FORauto-phone>
```

Location can initially use a map/navigation link.

A full maps integration should only be introduced when there is a clear product requirement.

---

# 36. Authorization Matrix

| Resource          |           Guest |        Customer |    Staff |  Manager |    Admin |
| ----------------- | --------------: | --------------: | -------: | -------: | -------: |
| Public services   |            Read |            Read |     Read |     Read |     Read |
| Public work       |            Read |            Read |     Read |     Read |     Read |
| Submit request    |          Create |          Create |   Create |   Create |   Create |
| Own requests      |               — |            Read |        — |        — |        — |
| All requests      |               — |               — |  Limited |      Yes |      Yes |
| Own vehicles      |               — |            CRUD |        — |        — |        — |
| Customer vehicles |               — |        Own only |  Limited |      Yes |      Yes |
| Appointments      |         Request |             Own |  Limited |      Yes |      Yes |
| Jobs              |               — |    Limited read | Assigned |      Yes |      Yes |
| Staff             |               — |               — |        — |   Manage |   Manage |
| Work items        |               — |               — |  Limited |   Manage |   Manage |
| Inspections       |               — |             Own | Assigned |      Yes |      Yes |
| Listings          |               — |      Create own |        — |   Manage |   Manage |
| Reviews           | Create eligible | Create eligible |        — | Moderate | Moderate |
| Notifications     |             Own |             Own |      Own |   Manage |   Manage |

The exact permission matrix should be enforced through backend authorization middleware/services rather than frontend visibility alone.

---

# 37. Pagination

Collection endpoints should support pagination.

Recommended parameters:

```text
?page=1&limit=20
```

Example:

```text
GET /api/v1/work?page=2&limit=12
```

Default:

```text
page = 1
limit = 20
```

Maximum limits should be enforced server-side.

---

# 38. Filtering

Where useful, collection endpoints may support query filters.

Example:

```text
GET /api/v1/service-requests?status=NEW
```

Multiple filters:

```text
GET /api/v1/service-requests?status=NEW&category=ELECTRICAL
```

Staff dashboards may additionally filter by:

```text
customer
vehicle
date
assigned_staff
status
```

---

# 39. Sorting

Sorting should use explicit parameters.

Example:

```text
?sort=created_at
&order=desc
```

The API must whitelist sortable fields.

Arbitrary database column names must never be passed directly into SQL.

---

# 40. Validation

Validation should occur at the API boundary before business logic executes.

Validate:

* Required fields
* String lengths
* Phone formats
* Email formats
* Dates
* UUIDs
* Enum values
* Numeric ranges
* File metadata
* Ownership
* Status transitions

Example:

```text
preferred_time_period
```

must be one of:

```text
MORNING
AFTERNOON
EVENING
```

rather than accepting arbitrary strings.

---

# 41. Nigerian Phone Numbers

Because FORauto operates in Nigeria, phone validation should support Nigerian formats.

The application should normalize phone numbers into a consistent internal representation.

For example, equivalent representations of a Nigerian number should resolve to one canonical stored format.

The exact normalization library/implementation should be selected during development.

---

# 42. Date and Time

Dates should be stored and transmitted consistently.

Recommended API format:

```text
YYYY-MM-DD
```

for dates.

Timestamps should use ISO 8601.

Example:

```text
2026-10-05T13:00:00+01:00
```

The application should explicitly handle the workshop's local timezone.

---

# 43. Authorization Rules

Authorization must be checked server-side.

Examples:

A customer requesting:

```text
GET /vehicles/:id
```

must only receive the vehicle if:

```text
vehicle.customer_id === authenticated_customer.id
```

A technician accessing a job must only receive information permitted by their role and assignment.

An administrator may access broader operational data.

Frontend route protection is not sufficient.

---

# 44. Rate Limiting

Rate limits should protect public endpoints from abuse.

Higher-risk endpoints include:

```text
/auth/login
/auth/register
/service-requests
/media/upload-url
```

Rate limits should be configurable.

Example concept:

```text
Authentication:
strict

Service request:
moderate

Public GET:
higher
```

The exact limits should be tuned after observing real traffic.

---

# 45. Abuse Prevention

The public service request form should include protections against automated abuse.

Potential measures:

* Rate limiting
* Honeypot fields
* Request throttling
* CAPTCHA/challenge when necessary
* Input validation
* File restrictions
* Duplicate submission protection

Do not add CAPTCHA by default if simpler protections are sufficient.

---

# 46. SQL Safety

All database operations must use parameterized queries.

Never construct SQL from raw user input.

Bad:

```text
"SELECT * FROM vehicles WHERE id = " + userInput
```

Correct approach:

```text
Parameterized query
```

The repository/data-access layer should own SQL interaction.

---

# 47. Transaction Boundaries

Operations affecting multiple related records should use database transactions where consistency requires it.

Example:

Creating a completed job may involve:

```text
Job update
      ↓
Service record creation
      ↓
Appointment update
      ↓
Service request update
```

These changes should be committed atomically where appropriate.

---

# 48. Auditability

Important administrative changes should be traceable.

Examples:

* Status changes
* Staff assignments
* Publishing work
* Rejecting listings
* Editing inspection findings
* Administrative account changes

An audit log can be introduced as the operational requirements become clearer.

It should not be added as unnecessary complexity before the core workflow works.

---

# 49. API Security

The API must:

* Hash passwords securely
* Never return password hashes
* Validate authentication tokens
* Enforce authorization server-side
* Validate all input
* Use parameterized SQL
* Restrict uploads
* Rate-limit abuse-prone endpoints
* Use HTTPS in production
* Configure CORS explicitly
* Avoid leaking internal errors
* Avoid exposing stack traces to clients
* Protect sensitive configuration in environment variables

---

# 50. CORS

Production CORS should allow only approved frontend origins.

Example concept:

```text
https://forauto.example
```

Development origins can be configured separately.

Never use unrestricted production CORS such as:

```text
*
```

for authenticated APIs unless there is a deliberate security reason.

---

# 51. Error Codes

Recommended stable error codes:

```text
VALIDATION_ERROR
UNAUTHORIZED
FORBIDDEN
NOT_FOUND
CONFLICT
INVALID_STATUS_TRANSITION
RESOURCE_OWNERSHIP_ERROR
DUPLICATE_REQUEST
RATE_LIMITED
FILE_TOO_LARGE
UNSUPPORTED_FILE_TYPE
UPLOAD_FAILED
AUTHENTICATION_FAILED
SESSION_EXPIRED
INTERNAL_ERROR
SERVICE_UNAVAILABLE
```

---

# 52. API Logging

The API should log enough information to diagnose operational problems without logging sensitive customer information unnecessarily.

Useful fields:

```text
request_id
timestamp
method
route
status_code
duration
user_id where available
error_code where applicable
```

Do not log:

* Passwords
* Authentication secrets
* Raw access tokens
* Sensitive uploaded content
* Payment secrets
* Private credentials

---

# 53. Request IDs

Each API request should receive a unique request ID.

Example:

```text
X-Request-ID: 8f7...
```

This allows support and developers to trace failures across logs.

---

# 54. Health Endpoints

The API should expose operational health endpoints.

Example:

```text
GET /health
GET /health/ready
```

Possible distinction:

```text
/health
```

Checks that the application process is alive.

```text
/health/ready
```

Checks whether required dependencies, particularly PostgreSQL, are available.

Health endpoints should not expose secrets or internal infrastructure details.

---

# 55. API Documentation

The API should eventually expose machine-readable documentation using OpenAPI.

Recommended development flow:

```text
API contract
    ↓
OpenAPI specification
    ↓
Route implementation
    ↓
Integration tests
```

OpenAPI should describe:

* Routes
* Parameters
* Request bodies
* Responses
* Authentication
* Error responses
* Enums

---

# 56. API Testing

The API test suite should cover:

### Authentication

* Register
* Login
* Invalid credentials
* Refresh
* Logout

### Service requests

* Guest submission
* Validation
* Duplicate submission protection
* Staff retrieval
* Status transitions
* Authorization

### Vehicles

* Create
* Read own vehicle
* Update
* Ownership protection

### Appointments

* Request
* Confirm
* Reschedule
* Cancel
* Invalid transitions

### Jobs

* Create
* Assignment
* Status transitions
* Completion
* Service record creation

### Media

* Upload authorization
* File validation
* Ownership
* Association

### Staff

* Role restrictions
* Staff management

### Work

* Draft visibility
* Publish
* Public visibility
* Archive

Future test suites should cover inspections, listings, reviews, and notifications.

---

# 57. MVP API Scope

The first production release should prioritize:

```text
GET    /services
GET    /services/:slug

GET    /work
GET    /work/:slug

POST   /auth/register
POST   /auth/login
POST   /auth/refresh
POST   /auth/logout
GET    /auth/me

GET    /customers/me
PATCH  /customers/me

GET    /vehicles
POST   /vehicles
GET    /vehicles/:id
PATCH  /vehicles/:id

POST   /service-requests
GET    /service-requests
GET    /service-requests/:id
PATCH  /service-requests/:id

POST   /media/upload-url
POST   /media/complete

GET    /appointments
POST   /appointments
GET    /appointments/:id
PATCH  /appointments/:id

GET    /jobs
POST   /jobs
GET    /jobs/:id
PATCH  /jobs/:id

POST   /jobs/:id/assignments
POST   /jobs/:id/work-entries

GET    /staff
POST   /staff
PATCH  /staff/:id

POST   /work
PATCH  /work/:id
DELETE /work/:id
```

The actual implementation order should follow the product roadmap rather than attempting every endpoint simultaneously.

---

# 58. P1 API Scope

After the core workflow is stable:

```text
GET    /customers/me/requests
GET    /customers/me/appointments
GET    /customers/me/service-history

GET    /vehicles/:id/service-history

POST   /inspections
GET    /inspections/:id
PATCH  /inspections/:id

POST   /inspections/:id/findings
PATCH  /inspections/:id/findings/:findingId
POST   /inspections/:id/complete

POST   /reviews
GET    /reviews
PATCH  /reviews/:id

GET    /notifications
PATCH  /notifications/:id/read
```

---

# 59. P2 API Scope

Only after the business requirements are validated:

```text
GET    /vehicle-listings
GET    /vehicle-listings/:slug
POST   /vehicle-listings
PATCH  /vehicle-listings/:id
POST   /vehicle-listings/:id/publish
POST   /vehicle-listings/:id/mark-sold
```

Potential later additions:

```text
Quotes
Invoices
Payments
Parts inventory
Maintenance reminders
Fleet management
Roadside assistance
Automated WhatsApp
Multi-location support
```

These are intentionally outside the initial API.

---

# 60. Business-Process Guardrail

The API must not invent business operations.

For example, the following should not be implemented as established FORauto processes unless the business confirms them:

* Fixed inspection pricing
* Automatic appointment confirmation
* Online mechanic assignment to customers
* Online payments
* Vehicle marketplace guarantees
* Automated repair diagnosis
* Parts inventory
* Quotes/invoices
* Roadside assistance
* Warranty programmes
* Service packages

The API contract may reserve room for future capabilities, but implementation should follow confirmed business requirements.

---

# 61. Recommended Backend Structure

The API should follow the architecture defined in `docs/ARCHITECTURE.md`.

Suggested structure:

```text
apps/api/
├── src/
│   ├── config/
│   ├── middleware/
│   ├── routes/
│   ├── controllers/
│   ├── services/
│   ├── repositories/
│   ├── validators/
│   ├── auth/
│   ├── modules/
│   │   ├── customers/
│   │   ├── vehicles/
│   │   ├── service-requests/
│   │   ├── appointments/
│   │   ├── jobs/
│   │   ├── staff/
│   │   ├── work/
│   │   ├── media/
│   │   ├── inspections/
│   │   └── listings/
│   ├── app.ts
│   └── server.ts
└── tests/
```

The exact folder structure can be simplified if the implementation team finds a cleaner equivalent.

---

# 62. API Layering

Business logic should not be placed directly inside route handlers.

Recommended flow:

```text
HTTP Request
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
Repository
     ↓
PostgreSQL
```

For example:

```text
POST /service-requests
        ↓
validate request
        ↓
create service request
        ↓
service layer
        ↓
customer lookup/create
        ↓
vehicle lookup/create if applicable
        ↓
service request creation
        ↓
media association
        ↓
database transaction
        ↓
response
```

---

# 63. Database Access

The backend should use PostgreSQL through the chosen SQL/data-access approach defined in the architecture.

The current project direction is:

```text
Node.js
+
pg
+
SQL migrations
+
PostgreSQL
```

The API must not introduce Prisma or another ORM unless the architecture is deliberately changed and documented.

---

# 64. API Contract Ownership

This document defines the intended API contract.

If implementation discovers a necessary deviation:

1. Update the API specification.
2. Update related architecture/database documentation if affected.
3. Implement the change.
4. Add/update tests.
5. Avoid silently creating undocumented endpoints.

Documentation and implementation should remain synchronized.

---

# 65. Final API Principle

The FORauto API should remain:

**Simple enough to maintain.
Structured enough to scale.
Secure enough for real customer data.
Flexible enough for future vehicle services.**

The first objective is not to build the biggest automotive platform.

It is to create a reliable digital bridge between:

```text
Customer
   ↓
FORauto
   ↓
Workshop
   ↓
Technician
   ↓
Completed Work
   ↓
Service History
```

That is the core system everything else can grow from.

