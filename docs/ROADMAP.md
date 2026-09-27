# FORauto Implementation Roadmap

**Product:** FORauto
**Domain:** Automotive Services & Vehicle Solutions
**Status:** Implementation roadmap
**Primary objective:** Build and launch a professional digital platform around the existing FORauto automotive business.

---

# 1. Purpose

This roadmap defines the order in which FORauto should be designed, implemented, tested, and launched.

It exists to prevent:

* Building features before their dependencies
* Overengineering the first release
* Building future features before the business process is confirmed
* Duplicating logic between frontend and backend
* Introducing unnecessary infrastructure
* Designing screens without understanding the underlying workflow
* Launching an attractive website with an unusable operational system

The roadmap follows the principle:

> **Build the smallest complete system that creates real value for the business, then expand from actual usage.**

---

# 2. Product Development Strategy

FORauto will be developed in progressive phases:

```text
Planning
   ↓
Brand
   ↓
UX
   ↓
Design System
   ↓
Technical Foundation
   ↓
Public Website
   ↓
Customer Requests
   ↓
Admin Operations
   ↓
Testing & QA
   ↓
Launch
   ↓
Iteration
```

The system should not attempt to build every planned feature before launch.

---

# 3. Release Strategy

The roadmap is divided into:

### Phase 0 — Product Foundation

Planning, requirements, architecture, and repository setup.

### Phase 1 — Brand & Experience

Brand identity, content direction, UX, and visual implementation.

### Phase 2 — Technical Foundation

Monorepo, frontend, backend, database, authentication, infrastructure.

### Phase 3 — Public Website

Homepage and public content experience.

### Phase 4 — Customer Request System

Service enquiry and vehicle information workflow.

### Phase 5 — Admin Operations

Requests, appointments, jobs, staff, customers, vehicles, and work records.

### Phase 6 — Production Readiness

Testing, security, performance, accessibility, SEO, and deployment.

### Phase 7 — Launch

Production release and operational onboarding.

### Phase 8 — Post-Launch

Measure usage and introduce validated improvements.

---

# 4. Phase 0 — Product Foundation

## Objective

Establish a stable product and technical direction before implementation begins.

## Deliverables

Existing planning documents:

```text
docs/PRD.md
docs/PRODUCT_OVERVIEW.md
docs/BRAND.md
docs/USER_FLOWS.md
docs/DESIGN.md
docs/ARCHITECTURE.md
docs/DATABASE.md
docs/API.md
docs/ROADMAP.md
```

Supporting project files:

```text
AGENTS.md
README.md
.env.example
.gitignore
package.json
```

---

## Phase 0 Checklist

* [ ] Confirm working brand name: FORauto
* [ ] Confirm business positioning
* [ ] Confirm initial service catalogue
* [ ] Confirm workshop contact information
* [ ] Confirm workshop location details
* [ ] Gather real business photographs
* [ ] Gather business history
* [ ] Confirm staff/team information that can be published
* [ ] Confirm public-facing WhatsApp number
* [ ] Confirm opening hours
* [ ] Confirm whether walk-ins are accepted
* [ ] Confirm appointment process
* [ ] Confirm which future vehicle services are actually offered
* [ ] Review documentation
* [ ] Resolve contradictions before implementation

---

# 5. Business Discovery Before Launch

Some information is still intentionally unknown.

The implementation should not invent it.

Before publishing the final website, confirm:

### Services

Exactly what FORauto currently provides.

Potential examples include:

```text
Mechanical repairs
Auto electrical
Rewiring
Diagnostics
Vehicle servicing
AC-related work
Brake work
Suspension
Engine work
Transmission work
```

These are examples only.

The final public service list must reflect the actual business.

---

### Business Information

Confirm:

```text
Business name
Phone
WhatsApp
Workshop address
Opening hours
Years of experience
Team information
Service areas
Emergency/roadside availability
```

---

### Customer Workflow

Confirm:

```text
How customers currently book
How appointments are handled
How jobs are recorded
How technicians are assigned
How completed work is documented
How customers are notified
```

The software should adapt to the existing business wherever practical.

---

# 6. Phase 1 — Brand & Experience

## Objective

Create a recognizable FORauto identity before implementation of the public interface.

---

## Brand Tasks

* [ ] Finalize FORauto name usage
* [ ] Finalize tagline
* [ ] Create logo
* [ ] Create favicon
* [ ] Define typography
* [ ] Define color system
* [ ] Define spacing
* [ ] Define image direction
* [ ] Define iconography
* [ ] Define buttons
* [ ] Define form styles
* [ ] Define motion principles

---

## Brand Direction

The visual identity should communicate:

```text
Experience
Engineering
Craftsmanship
Trust
Modernity
```

Avoid:

```text
Generic mechanic aesthetic
Overused wrench logos
Excessive red/black styling
Cheap-looking gradients
Generic stock imagery
Fake luxury
Unverifiable claims
```

---

# 7. Phase 2 — Technical Foundation

## Objective

Create the application foundation before building business features.

---

## 7.1 Repository

Recommended structure:

```text
FORauto/
├── apps/
│   ├── web/
│   └── api/
├── packages/
│   ├── ui/
│   ├── types/
│   └── config/
├── database/
│   └── migrations/
├── docs/
├── AGENTS.md
├── package.json
└── README.md
```

---

## 7.2 Frontend Foundation

Set up:

* [ ] Next.js
* [ ] React
* [ ] TypeScript
* [ ] Tailwind CSS
* [ ] Framer Motion
* [ ] Lucide
* [ ] Shared UI primitives
* [ ] Global typography
* [ ] Design tokens
* [ ] Responsive breakpoints
* [ ] Metadata foundations
* [ ] Error boundaries
* [ ] Loading states

---

## 7.3 Backend Foundation

Set up:

* [ ] Node.js
* [ ] TypeScript
* [ ] Fastify or Express
* [ ] REST API
* [ ] `/api/v1`
* [ ] Environment configuration
* [ ] PostgreSQL connection
* [ ] `pg`
* [ ] SQL migrations
* [ ] Validation
* [ ] Authentication foundation
* [ ] Authorization middleware
* [ ] Error handling
* [ ] Logging
* [ ] Request IDs
* [ ] Health checks

---

## 7.4 Database Foundation

Implement migrations for the MVP tables:

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

Do not create unnecessary future tables merely because they exist in the long-term database plan.

---

# 8. Phase 3 — Public Website

## Objective

Launch the core FORauto digital presence.

---

# 8.1 Global Navigation

Build:

```text
Logo
Services
Our Work
About
Vehicle Services
Contact
Get Help With Your Car
```

Mobile navigation should remain simple.

---

# 8.2 Homepage

Build sections in this order:

```text
Hero
↓
Experience / Trust
↓
Services
↓
Work / Workshop imagery
↓
FORauto story
↓
Vehicle services
↓
Work gallery
↓
Final CTA
↓
Footer
```

---

## Hero

Primary messaging direction:

```text
20+ YEARS OF AUTOMOTIVE EXPERIENCE

Your car. Our expertise.

From mechanical repairs and auto electrical work
to diagnostics and vehicle services, FORauto brings
decades of hands-on experience to every job.
```

Primary CTA:

```text
Get Help With Your Car
```

Secondary CTA:

```text
Chat on WhatsApp
```

Final copy should be reviewed against the confirmed business information.

---

# 8.3 Services

Build:

```text
/services
/services/[slug]
```

The service catalogue must use confirmed services.

Each service should have:

* Name
* Description
* Relevant imagery
* Typical customer problem
* What FORauto handles
* CTA

Avoid invented pricing.

---

# 8.4 About

Build:

```text
/about
```

Focus on:

* 20+ years of experience
* Hands-on expertise
* Workshop story
* Team
* Approach to work
* Human relationship with customers

---

# 8.5 Our Work

Build:

```text
/work
/work/[slug]
```

Use actual completed work whenever possible.

Each published work entry can include:

```text
Vehicle
Problem
Diagnosis
Work performed
Images
Outcome
```

Do not fabricate case studies.

---

# 8.6 Contact

Build:

```text
/contact
```

Include:

* Phone
* WhatsApp
* Workshop location
* Opening hours
* Directions
* Contact CTA

---

# 9. Phase 4 — Customer Request System

## Objective

Turn the website from an informational site into an operational customer acquisition channel.

---

# 9.1 Request Entry

Primary CTA:

```text
Get Help With Your Car
```

Flow:

```text
Problem
↓
Vehicle
↓
Details
↓
Photos
↓
Contact
↓
Preferred date
↓
Submit
↓
Confirmation
```

---

# 9.2 Request Form

Collect only useful information.

### Customer

```text
First name
Last name
Phone
Email
WhatsApp
```

### Vehicle

```text
Make
Model
Year
Registration
Mileage
```

### Problem

```text
Category
Description
When it happens
```

### Scheduling

```text
Preferred date
Preferred time period
```

### Media

```text
Photos
Videos
```

---

# 9.3 Confirmation

After submission:

```text
Request received
Reference: FA-XXXX
```

The customer should understand:

> FORauto has received the request and will contact them to discuss/confirm the next step.

Do not imply that an appointment is automatically confirmed.

---

# 9.4 WhatsApp Handoff

Offer:

```text
Continue on WhatsApp
```

with a contextual message.

Example:

```text
Hello FORauto, I just submitted a service request through your website. My request reference is FA-1042.
```

---

# 10. Phase 5 — Admin Operations

## Objective

Give FORauto a practical internal system for managing enquiries and workshop work.

---

# 10.1 Admin Authentication

Build:

```text
/admin/login
```

Only authorized staff accounts can access the admin system.

---

# 10.2 Dashboard

Initial dashboard:

```text
New Requests
Today's Jobs
Pending Appointments
Active Jobs
Completed Jobs
```

Below:

```text
Recent Requests
Upcoming Appointments
Active Jobs
```

The dashboard should prioritize operational clarity over visual decoration.

---

# 10.3 Request Management

Build:

```text
/admin/requests
/admin/requests/[id]
```

Admin should be able to:

* View request
* View customer
* View vehicle
* View issue
* View uploaded media
* Contact customer
* Add internal notes
* Change status
* Create appointment
* Convert request into job

---

# 10.4 Customer Management

Build:

```text
/admin/customers
/admin/customers/[id]
```

Show:

```text
Customer information
Vehicles
Requests
Appointments
Jobs
Service history
```

---

# 10.5 Vehicle Management

Build:

```text
/admin/vehicles
/admin/vehicles/[id]
```

Show:

```text
Vehicle details
Owner
Service requests
Jobs
Service history
```

---

# 10.6 Appointment Management

Build:

```text
/admin/appointments
```

Operations:

* Review requested dates
* Confirm
* Reschedule
* Cancel
* Mark completed
* Mark no-show

---

# 10.7 Job Management

Build:

```text
/admin/jobs
/admin/jobs/[id]
```

Admin/staff can:

* Create job
* Assign technician
* Add diagnosis
* Add work performed
* Add internal notes
* Add work entries
* Upload job media
* Change job status
* Complete job

---

# 10.8 Staff Management

Build:

```text
/admin/staff
/admin/staff/[id]
```

Support:

```text
Technicians
Workmen
Apprentices
Managers
Administrators
```

Role permissions must be enforced by the backend.

---

# 10.9 Work Publishing

After a job is completed, authorized staff can turn appropriate completed work into a public work item.

Flow:

```text
Completed Job
     ↓
Create Work Item
     ↓
Add approved images
     ↓
Write case summary
     ↓
Draft
     ↓
Review
     ↓
Publish
```

This prevents the public gallery from becoming disconnected from real workshop activity.

---

# 11. Phase 6 — Production Readiness

Before launch, the entire system must pass a production-readiness checklist.

---

# 11.1 Functional QA

Test:

* [ ] Homepage
* [ ] Navigation
* [ ] Services
* [ ] Service details
* [ ] About
* [ ] Our Work
* [ ] Contact
* [ ] WhatsApp CTA
* [ ] Phone CTA
* [ ] Service request
* [ ] Image upload
* [ ] Request confirmation
* [ ] Authentication
* [ ] Customer account
* [ ] Vehicle management
* [ ] Appointments
* [ ] Admin requests
* [ ] Jobs
* [ ] Staff
* [ ] Work publishing

---

# 11.2 Mobile QA

Test on realistic mobile sizes.

Pay particular attention to:

* Navigation
* Hero
* Forms
* Uploading photos
* Buttons
* WhatsApp CTA
* Admin usability where relevant
* Long content
* Keyboard interactions

FORauto is expected to receive significant mobile traffic, so mobile is not a secondary version.

---

# 11.3 Browser QA

Test modern versions of:

```text
Chrome
Safari
Firefox
Edge
```

At minimum, validate the main customer journey across mobile and desktop browsers.

---

# 11.4 Accessibility

Check:

* Semantic HTML
* Keyboard navigation
* Focus states
* Form labels
* Error messages
* Color contrast
* Alt text
* Reduced-motion behavior
* Touch target sizes
* Screen-reader-friendly controls

---

# 11.5 Security QA

Verify:

* Authentication
* Authorization
* Ownership checks
* Password handling
* CORS
* Rate limiting
* Upload restrictions
* SQL parameterization
* Input validation
* Error sanitization
* Secret management

Attempt unauthorized access during testing.

Examples:

```text
Customer A → Customer B's vehicle
Customer → Admin endpoint
Technician → Unauthorized admin operation
Guest → Private request
```

All must be rejected appropriately.

---

# 11.6 Database QA

Verify:

* Foreign keys
* Constraints
* Indexes
* Transactions
* Migration consistency
* Backup process
* Restore process
* Production connection configuration

---

# 11.7 Performance

Measure:

* Initial page load
* Image loading
* Largest contentful paint
* JavaScript bundle size
* API response times
* Database query performance

Images should be optimized aggressively.

Do not ship unnecessarily huge workshop photographs to mobile devices.

---

# 11.8 SEO

Implement:

* Page titles
* Meta descriptions
* Canonical URLs
* Open Graph metadata
* Sitemap
* Robots configuration
* Structured data where appropriate
* Service-specific pages
* Location-aware business information

Avoid keyword stuffing.

---

# 12. Phase 7 — Deployment

## Frontend

Deploy the Next.js application to the selected production platform.

## Backend

Deploy the API to a production server/platform.

## Database

Use a managed PostgreSQL production instance where practical.

## Media

Use production object storage.

## Domain

Connect the official FORauto domain when available.

---

# 13. Environment Configuration

Separate:

```text
Development
Staging
Production
```

Environment variables should contain:

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

Not yet defined, because no code reads them. Each is introduced by the
phase that first needs it, not before:

```text
STORAGE_ENDPOINT
STORAGE_BUCKET
STORAGE_ACCESS_KEY
STORAGE_SECRET_KEY

EMAIL_PROVIDER_KEY
MAPS_PROVIDER_KEY
```

`.env.example` in the repository root is the authoritative list of the
variables the application actually reads, and is kept in step with
`docs/ARCHITECTURE.md` §42 and `apps/api/src/config/env.ts`. Only
variables that the code genuinely reads belong in it. Never commit secrets
to Git.

---

# 14. CI/CD

Before deployment, automated checks should run.

Recommended pipeline:

```text
Push
 ↓
Install dependencies
 ↓
Lint
 ↓
Type check
 ↓
Unit tests
 ↓
Integration tests
 ↓
Build
 ↓
Deploy
```

Production deployment should fail if critical checks fail.

---

# 15. Database Migration Strategy

Production migrations must be:

* Version controlled
* Repeatable
* Reviewed
* Applied in order
* Tested before production

Never manually modify the production database as the normal development workflow.

Emergency production fixes should still be documented.

---

# 16. Launch Checklist

## Business

* [ ] Business name confirmed
* [ ] Logo approved
* [ ] Services confirmed
* [ ] Phone number confirmed
* [ ] WhatsApp confirmed
* [ ] Location confirmed
* [ ] Opening hours confirmed
* [ ] Real photos collected
* [ ] Business description approved
* [ ] Public team information approved

---

## Product

* [ ] Homepage complete
* [ ] Services complete
* [ ] About complete
* [ ] Work complete
* [ ] Contact complete
* [ ] Request service complete
* [ ] Confirmation flow complete
* [ ] Admin dashboard complete
* [ ] Request management complete
* [ ] Job management complete

---

## Technical

* [ ] Production environment configured
* [ ] Database migrated
* [ ] Media storage configured
* [ ] HTTPS enabled
* [ ] CORS configured
* [ ] Rate limiting active
* [ ] Error monitoring active
* [ ] Backups configured
* [ ] Health checks working
* [ ] CI/CD working

---

## SEO

* [ ] Sitemap
* [ ] Robots
* [ ] Metadata
* [ ] Social sharing metadata
* [ ] Business information
* [ ] Search indexing verification

---

# 17. Soft Launch

FORauto should not immediately depend on the system for every customer interaction.

First perform a controlled launch.

Example:

```text
Website live
     ↓
Internal team tests
     ↓
Small number of real enquiries
     ↓
Observe workflow
     ↓
Fix friction
     ↓
Broader launch
```

The first real users should help reveal problems that were impossible to identify through development alone.

---

# 18. Operational Onboarding

The business team should be shown how to:

1. Log in
2. View a new request
3. Contact a customer
4. Update request status
5. Schedule an appointment
6. Create/continue a job
7. Assign staff
8. Add diagnosis/work
9. Complete a job
10. Review customer/vehicle history
11. Publish appropriate work

The software is only successful if the workshop can actually use it.

---

# 19. Phase 8 — Post-Launch Measurement

After launch, monitor real usage.

Key metrics:

### Acquisition

```text
Website visitors
Search impressions
Search clicks
Traffic sources
```

### Contact

```text
WhatsApp clicks
Phone clicks
Service request submissions
```

### Operations

```text
Requests received
Requests contacted
Requests scheduled
Requests completed
Appointment completion rate
```

### Customer

```text
Repeat customers
Vehicles recorded
Service history records
Reviews
```

### Business

Eventually:

```text
Digital leads
Jobs originating from digital leads
Revenue attributable to digital leads
Popular services
Inspection enquiries
Vehicle sales enquiries
```

Revenue attribution should only be introduced when the business has a reliable way to record it.

---

# 20. Post-Launch Feedback Loop

The development cycle becomes:

```text
Observe
 ↓
Identify friction
 ↓
Confirm with business
 ↓
Prioritize
 ↓
Design
 ↓
Implement
 ↓
Test
 ↓
Release
 ↓
Observe again
```

Do not build features solely because they sound impressive.

Build based on:

* Customer need
* Business need
* Observed usage
* Operational evidence

---

# 21. P1 Roadmap

Once the MVP is stable, consider:

### Customer experience

* Customer dashboard
* Saved vehicles
* Service history
* Appointment history
* Request tracking
* Notifications

### Workshop operations

* Technician dashboard
* Better job workflow
* Inspection workflow
* Review management
* Operational reporting

### Communication

* Email notifications
* Automated WhatsApp notifications
* Appointment reminders
* Job completion notifications

---

# 22. P2 Roadmap

Only after the core platform is working:

### Vehicle services

* Vehicle inspection reports
* Vehicle sales assistance
* Public vehicle listings

### Financial workflow

* Quotes
* Invoices
* Deposits
* Online payments

### Workshop operations

* Parts inventory
* Maintenance reminders
* Fleet management

### Expansion

* Multiple workshop locations
* Roadside/mobile services
* Additional service categories

---

# 23. Features That Require Business Validation

The following should not be automatically added just because they appear in the long-term product vision:

```text
Online payments
Vehicle marketplace
Automated diagnosis
Roadside assistance
Parts marketplace
Fleet management
Maintenance subscriptions
Insurance integrations
Financing
AI mechanics assistant
Multi-location operations
```

Each requires a separate product decision.

---

# 24. Suggested Implementation Order

Within the actual coding phase, use this order:

```text
1. Repository setup
2. Development environment
3. Database connection
4. Migration system
5. API foundation
6. Frontend foundation
7. Shared types/UI
8. Authentication
9. Public content
10. Service request backend
11. Service request frontend
12. Media uploads
13. Admin authentication
14. Admin dashboard
15. Request management
16. Customer management
17. Vehicle management
18. Appointments
19. Jobs
20. Staff assignment
21. Work entries
22. Service history
23. Work publishing
24. Full integration testing
25. Production hardening
26. Deployment
27. Soft launch
```

---

# 25. Definition of MVP Complete

FORauto MVP is considered complete when a real customer can:

```text
Discover FORauto
      ↓
Understand the services
      ↓
Trust the business
      ↓
Describe their vehicle problem
      ↓
Submit a request
      ↓
Receive confirmation
      ↓
Continue via WhatsApp/phone
      ↓
Be contacted by FORauto
      ↓
Receive an appointment
      ↓
Have a job recorded
      ↓
Have work assigned
      ↓
Have work completed
      ↓
Have the vehicle's service history recorded
```

And FORauto staff can:

```text
Receive request
      ↓
Review customer
      ↓
Review vehicle
      ↓
Contact customer
      ↓
Schedule appointment
      ↓
Create job
      ↓
Assign technician
      ↓
Record diagnosis/work
      ↓
Complete job
      ↓
Maintain service history
      ↓
Publish selected completed work
```

---

# 26. Definition of Production Ready

FORauto is production-ready when:

* The primary customer journey works end-to-end.
* The primary staff workflow works end-to-end.
* Authentication and authorization are enforced.
* Customer data is protected.
* Database migrations are reliable.
* Uploads are secure.
* Production errors are observable.
* Backups exist.
* The website is responsive.
* Accessibility fundamentals are implemented.
* SEO foundations are implemented.
* Real business content has replaced placeholders.
* The workshop team understands the workflow.
* Critical QA issues are resolved.

---

# 27. The Core Principle

FORauto should grow from the business outward.

Not:

```text
"Let's build every automotive feature possible."
```

But:

```text
Real business
     ↓
Real customer problems
     ↓
Simple digital workflow
     ↓
Useful operational data
     ↓
Measured improvements
     ↓
Validated expansion
```

The website is the front door.

The service-request system is the bridge.

The admin system is the operational backbone.

The customer/vehicle history becomes the foundation for future services.

---

# 28. Roadmap Summary

```text
PHASE 0
Product Foundation
        ↓
PHASE 1
Brand & Experience
        ↓
PHASE 2
Technical Foundation
        ↓
PHASE 3
Public Website
        ↓
PHASE 4
Customer Requests
        ↓
PHASE 5
Admin Operations
        ↓
PHASE 6
Production Readiness
        ↓
PHASE 7
Launch
        ↓
PHASE 8
Measure + Improve
        ↓
P1
Customer + Inspection + Notifications
        ↓
P2
Vehicle Services + Payments + Expansion
```

---

# 29. Final Product Direction

FORauto should not feel like a mechanic's website that happens to have software.

It should feel like a **modern automotive business with a digital system built around real workshop expertise**.

The technology should remain invisible when possible.

The customer should simply feel:

> **I know who I'm dealing with.
> I know what they can help me with.
> I can easily tell them what's wrong.
> I can reach them.
> And they can keep track of my vehicle over time.**

That is the experience the roadmap is designed to create.
