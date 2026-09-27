# FORauto — User Flows & UX Architecture

**Version:** 0.1
**Status:** Working Specification
**Product:** FORauto — Automotive Services & Vehicle Solutions

---

## 1. Purpose

This document defines how customers, technicians, staff, and administrators interact with FORauto.

The goal is to make the digital experience feel simple and natural while supporting the real-world workflow of an established automotive workshop.

### Core UX principle

> **Conversation first. Complexity second.**

A customer should not need to understand automotive terminology or know exactly what is wrong with their vehicle before asking for help.

The system should help them explain the problem in simple language and let FORauto handle the technical interpretation.

---

# 2. Primary User Types

## 2.1 Vehicle Owner

A person who needs help with their vehicle.

Typical goals:

* Find a trusted mechanic
* Understand available services
* Ask about a vehicle problem
* Request service
* Contact FORauto on WhatsApp
* Book/request an appointment
* Track a request
* View vehicle/service history in the future

---

## 2.2 Prospective Customer

Someone discovering FORauto for the first time.

Typical goals:

* Understand what FORauto does
* Verify experience and credibility
* See previous work
* Find the workshop
* Contact the business
* Decide whether to bring their vehicle

---

## 2.3 Vehicle Seller

Someone who wants assistance selling a vehicle.

Typical goals:

* Submit vehicle details
* Upload photos
* Provide asking price
* Receive follow-up from FORauto

This is a future workflow.

---

## 2.4 Technician / Workman

A member of the workshop team responsible for carrying out jobs.

Typical goals:

* See assigned jobs
* View vehicle/customer information
* View reported issue
* Update job status
* Add work notes
* Upload work photos
* Mark work as completed

---

## 2.5 Administrator / Business Owner

The person managing FORauto's operations.

Typical goals:

* Receive enquiries
* Contact customers
* Manage appointments
* Manage jobs
* Assign technicians
* Manage customer and vehicle records
* Record work performed
* Manage website content
* Manage inspections
* Manage vehicle listings in the future

---

# 3. UX Architecture

The product is divided into four experiences.

```text
                    FORauto
                       │
        ┌──────────────┼──────────────┐
        │              │              │
     PUBLIC         CUSTOMER        INTERNAL
     WEBSITE         AREA           OPERATIONS
        │              │              │
   Discover &      Requests &      Admin + Staff
   Understand      History         Dashboard
        │              │              │
        └──────────────┼──────────────┘
                       │
                WhatsApp / Phone
```

---

# 4. Public Website Flow

The public website is primarily a **discovery and conversion experience**.

```text
Discover FORauto
      ↓
Understand services
      ↓
See experience / work
      ↓
Trust the business
      ↓
Choose an action
      ↓
┌────────────┬────────────┬───────────────┐
│ Get Help   │ WhatsApp   │ Call          │
│ With Car   │            │               │
└─────┬──────┴──────┬─────┴───────┬───────┘
      ↓             ↓              ↓
Service Request   WhatsApp       Phone
```

### Primary conversion action

**Get Help With Your Car**

Secondary:

* Chat on WhatsApp
* Call FORauto
* View Services
* Get Directions

---

# 5. Flow A — First-Time Customer → Service Request

This is the most important customer flow.

## Entry points

A customer can enter the flow from:

* Homepage
* Services page
* Service detail page
* Contact page
* Mobile CTA
* Search engine
* Shared link

---

## Step 1 — Customer selects "Get Help With Your Car"

The system opens:

`/request-service`

### Intro

The page should immediately explain:

> Tell us what's going on with your car. You don't need to know the technical name — just describe what you're experiencing.

This reduces anxiety around technical terminology.

---

## Step 2 — Select problem category

Possible categories:

* Engine
* Transmission / Gear
* Electrical
* Starting problem
* AC
* Brakes
* Suspension
* Steering
* Cooling / Overheating
* Lights
* Noise / Vibration
* Diagnostics
* Servicing
* Other

The customer may also choose:

**"I'm not sure."**

This is important.

Customers should never be forced to diagnose their own vehicle.

---

## Step 3 — Describe the problem

Fields:

* What's happening?
* When did it start?
* Does it happen all the time?
* Anything else we should know?

Example:

> "The car doesn't start sometimes, especially in the morning. I hear a clicking sound."

Optional:

* Upload photos
* Upload video

---

## Step 4 — Vehicle information

Required:

* Make
* Model

Optional initially:

* Year
* Registration number
* Mileage

Future:

* VIN / chassis number
* Existing vehicle profile

---

## Step 5 — Customer information

Required:

* Name
* Phone number
* Preferred contact method

Optional:

* Email

Preferred contact:

* WhatsApp
* Phone call

---

## Step 6 — Preferred timing

Customer chooses:

* As soon as possible
* Today
* Tomorrow
* Choose a date

Optional preferred time:

* Morning
* Afternoon
* Evening

The first release should avoid pretending that appointment availability is automatically confirmed.

Instead:

> **Request received. FORauto will contact you to confirm the time.**

---

## Step 7 — Review

Show a clear summary.

```text
YOUR REQUEST

Vehicle
Toyota Camry

Problem
Car isn't starting consistently.

Category
Starting / Electrical

Preferred time
Tomorrow — Morning

Contact
080********

[Submit Request]
```

---

## Step 8 — Confirmation

After submission:

`/request-service/success`

Display:

> **We've received your request.**

Then:

* Request reference
* What happens next
* Call FORauto
* Chat on WhatsApp
* Return to homepage

Example:

```text
Request #FA-1042

We've received your request.
We'll contact you to discuss the issue
and confirm the next step.

[Chat on WhatsApp]

[Back to FORauto]
```

---

# 6. Service Request States

Every request has a lifecycle.

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

Alternative:

```text
NEW → CANCELLED
```

### Meaning

**NEW**

Customer has submitted a request.

**CONTACTED**

FORauto has reached out to the customer.

**SCHEDULED**

A time has been agreed.

**IN_PROGRESS**

Work has started.

**COMPLETED**

The work has been completed.

**CLOSED**

The job/request has been administratively closed.

**CANCELLED**

The request will not proceed.

---

# 7. Flow B — Customer → WhatsApp

WhatsApp remains a first-class channel because it is already part of the business's existing customer behaviour.

The website should not try to replace it.

## Flow

```text
Website
   ↓
Chat on WhatsApp
   ↓
WhatsApp opens
   ↓
Pre-filled message
```

Example:

> Hello FORauto, I found you through your website. I need help with my Toyota Camry. The vehicle is having trouble starting.

The message should be contextual whenever possible.

---

## Context-aware WhatsApp links

From a service page:

> Hello FORauto, I need help with your auto electrical service.

From a vehicle inspection page:

> Hello FORauto, I'd like to ask about a vehicle inspection.

From a service request:

> Hello FORauto, I submitted request FA-1042 and would like to follow up.

---

# 8. Flow C — Customer → Appointment

Appointment scheduling should initially be **request-based**, not falsely automated.

```text
Customer submits request
        ↓
FORauto reviews request
        ↓
FORauto contacts customer
        ↓
Time agreed
        ↓
Admin confirms appointment
        ↓
Appointment scheduled
```

### Appointment states

```text
REQUESTED
CONFIRMED
RESCHEDULED
COMPLETED
CANCELLED
NO_SHOW
```

---

## Customer-facing appointment information

When an appointment exists:

* Date
* Time
* Location
* Vehicle
* Service/request
* Status
* Contact FORauto

Future:

* Add to calendar
* Directions
* Reminder notifications

---

# 9. Flow D — Customer → Vehicle Inspection

Vehicle inspection is a separate service flow.

## Entry

```text
Vehicle Services
       ↓
Vehicle Inspection
       ↓
Request Inspection
```

---

## Step 1 — Vehicle information

* Make
* Model
* Year
* Registration
* Mileage
* Vehicle location

---

## Step 2 — Inspection purpose

Possible options:

* Buying a used vehicle
* Selling a vehicle
* General vehicle assessment
* Pre-trip check
* Other

---

## Step 3 — Contact information

* Name
* Phone
* WhatsApp
* Email (optional)

---

## Step 4 — Preferred date

Customer selects preferred date.

This is a request, not an automatic confirmation.

---

## Step 5 — Submit

```text
Inspection Request
        ↓
FORauto receives request
        ↓
Admin contacts customer
        ↓
Appointment confirmed
        ↓
Technician performs inspection
        ↓
Findings recorded
        ↓
Inspection report
        ↓
Customer receives result
```

---

# 10. Inspection Workflow — Internal

The technician sees:

```text
Inspection
FA-INS-001

Vehicle
Toyota Corolla 2018

Customer
Customer Name

Purpose
Pre-purchase inspection
```

### Inspection categories

Potential checklist:

* Engine
* Transmission
* Electrical
* Cooling
* Brakes
* Suspension
* Steering
* AC
* Diagnostic scan
* Body / Exterior
* Interior

Each category can contain:

* Condition
* Findings
* Notes
* Photos

---

## Inspection result

The final report may contain:

* Vehicle details
* Inspection date
* Technician
* Areas inspected
* Findings
* Photos
* Recommended attention
* General notes

The system should avoid presenting the inspection as a guarantee of vehicle condition.

---

# 11. Flow E — Seller → Vehicle Sales Assistance

Future feature.

```text
Vehicle Services
      ↓
Sell Your Vehicle
      ↓
Submit Vehicle
      ↓
FORauto reviews
      ↓
Customer contacted
      ↓
Vehicle approved
      ↓
Listing published
      ↓
Enquiries received
```

---

## Seller submission

Fields:

* Make
* Model
* Year
* Mileage
* Condition
* Asking price
* Location
* Description
* Photos
* Seller name
* Phone
* WhatsApp

---

## Listing lifecycle

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

Alternative:

```text
UNDER_REVIEW → REJECTED
```

---

# 12. Flow F — Customer Account

Customer accounts are **not required for basic service requests**.

This is deliberate.

A new customer should be able to get help without:

* Creating a password
* Verifying an email
* Completing a long registration process

---

## Guest experience

```text
Visit website
 ↓
Request service
 ↓
Submit contact details
 ↓
Done
```

---

## Account experience

For returning customers:

```text
Login
 ↓
Dashboard
 ├── Vehicles
 ├── Requests
 ├── Appointments
 ├── Service History
 └── Profile
```

---

# 13. Customer Dashboard

## Overview

Display:

* Active request
* Upcoming appointment
* Vehicles
* Recent service history

Example:

```text
Good afternoon, Rachael.

Active Request
Toyota Camry
Starting issue

Status: Contacted

[View Request]

Your Vehicles
Toyota Camry
Honda Accord

[View Vehicles]
```

---

# 14. Customer Vehicle Profile

A customer can have multiple vehicles.

```text
My Vehicles

Toyota Camry
2018

Honda Accord
2020

[+ Add Vehicle]
```

Vehicle profile:

* Make
* Model
* Year
* Registration
* Mileage
* Notes
* Service history

Future:

* Maintenance reminders
* Inspection reports
* Documents
* Insurance information

---

# 15. Service History

A vehicle can have a chronological record.

```text
Toyota Camry

2026
────────────
September 20
Electrical diagnosis

September 02
General servicing

August 11
AC repair
```

Each record can contain:

* Date
* Service
* Work performed
* Technician
* Notes
* Photos
* Cost — future

---

# 16. Flow G — Admin → New Request → Job

This is the core internal workflow.

```text
New request
     ↓
Admin reviews
     ↓
Admin contacts customer
     ↓
Request updated
     ↓
Appointment scheduled
     ↓
Job created
     ↓
Technician assigned
     ↓
Work begins
     ↓
Work completed
     ↓
Customer contacted
     ↓
Job closed
```

---

# 17. Admin Request Inbox

The dashboard should have a request list.

Columns:

* Request
* Customer
* Vehicle
* Service/problem
* Status
* Preferred date
* Created
* Assigned staff

Filters:

* New
* Contacted
* Scheduled
* In progress
* Completed
* Cancelled

---

# 18. Admin Request Detail

Example:

```text
REQUEST #FA-1042

Customer
John Doe
080********

Vehicle
Toyota Camry
2018

Issue
Vehicle refuses to start sometimes.

Category
Electrical / Starting

Preferred date
Tomorrow morning

Attachments
3 photos
1 video

Status
NEW

[Contact Customer]
[Schedule]
[Assign Technician]
```

Admin actions:

* Update status
* Add notes
* Contact customer
* Create appointment
* Assign technician
* Create job
* Attach vehicle
* Upload media

---

# 19. Flow H — Admin → Assign Technician

```text
Job created
     ↓
Admin selects technician
     ↓
Technician receives assignment
     ↓
Technician opens job
```

Technician assignment should show:

* Customer
* Vehicle
* Problem
* Location
* Appointment
* Relevant media
* Existing vehicle history

---

# 20. Flow I — Technician → Complete Job

Technician workflow:

```text
Assigned
   ↓
View Job
   ↓
Start Work
   ↓
Update Status
   ↓
Add Findings
   ↓
Record Work
   ↓
Upload Photos
   ↓
Mark Complete
```

---

## Technician job page

```text
JOB #JOB-1042

Toyota Camry — 2018

Customer
John Doe

Reported Issue
Vehicle intermittently fails to start.

Status
IN PROGRESS

WORK NOTES
[textarea]

PHOTOS
[Upload]

WORK PERFORMED
[textarea]

[Save]
[Mark Job Complete]
```

---

# 21. Admin → Completed Job

After technician completion:

```text
Job Completed
      ↓
Admin reviews
      ↓
Service record generated
      ↓
Customer notified
      ↓
Job CLOSED
```

Future:

* Quote
* Invoice
* Payment
* Warranty notes
* Review request

---

# 22. Flow J — Admin → Publish Work

FORauto should use completed real-world work as proof.

```text
Completed Job
      ↓
Select "Add to Our Work"
      ↓
Admin adds:
  - Title
  - Service category
  - Vehicle make/model
  - Problem
  - Work performed
  - Photos
      ↓
Preview
      ↓
Publish
```

Example:

**Toyota Camry Electrical Diagnosis**

> Diagnosed intermittent starting issues and traced the fault to the vehicle's electrical system.

The content should describe actual work performed.

No invented case studies.

---

# 23. Public "Our Work" Flow

```text
Our Work
   ↓
Browse projects
   ↓
Filter by category
   ↓
Open project
   ↓
View:
   - Problem
   - Diagnosis
   - Work performed
   - Photos
```

Potential categories:

* Mechanical
* Electrical
* Diagnostics
* AC
* Servicing
* Rewiring
* Other

---

# 24. Error & Empty States

The product should explicitly design for states beyond the happy path.

## Service request errors

Examples:

* Missing required vehicle information
* Invalid phone number
* Upload failure
* Network interruption
* Request submission failure

Message style:

> Something went wrong while sending your request. Please try again or contact us on WhatsApp.

---

## Empty states

### No vehicles

> You haven't added a vehicle yet.

**Add Vehicle**

### No service history

> Your completed services will appear here.

### No requests

> You don't have any service requests yet.

**Get Help With Your Car**

### No appointments

> No upcoming appointments.

---

# 25. Mobile UX

A significant percentage of customers are expected to access FORauto through phones.

The mobile experience should therefore be designed independently rather than treated as a compressed desktop version.

## Persistent actions

On mobile, consider a bottom action area:

```text
[WhatsApp]    [Call]    [Get Help]
```

The exact implementation will be determined during `DESIGN.md`.

---

# 26. Navigation Model

## Desktop

```text
FORauto

Services
Our Work
About
Vehicle Services
Contact

[Get Help With Your Car]
```

## Mobile

```text
FORauto

☰ Menu

[Get Help With Your Car]
```

Within the mobile menu:

* Services
* Our Work
* About
* Vehicle Services
* Contact
* WhatsApp
* Call

---

# 27. UX Conversion Hierarchy

The product should not give every action equal visual weight.

## Primary

**Get Help With Your Car**

## Secondary

**Chat on WhatsApp**

## Supporting

* Call
* View Services
* See Our Work
* Get Directions

This creates a clear path without making the website feel like a sales funnel.

---

# 28. Progressive Disclosure

The system should reveal complexity only when necessary.

### Bad

Asking a first-time customer for:

* VIN
* Engine number
* Chassis details
* Technical diagnosis
* Service codes
* Previous repair records

before they can submit a request.

### Better

Start with:

> What's happening with your car?

Then collect the minimum information required to continue.

Additional information can be requested later by FORauto.

---

# 29. Trust UX

Trust should be built through evidence.

The interface should surface:

* 20+ years of experience
* Real workshop/team photography
* Real completed work
* Clear service categories
* Physical location
* Direct contact
* Transparent request process
* Customer reviews when genuine reviews are available

Avoid:

* Fake testimonials
* Fake ratings
* Fake certifications
* Artificial urgency
* Unsupported claims such as "Lagos's #1 mechanic"

---

# 30. Notification Architecture

Future notification channels:

### WhatsApp

Potential events:

* Request received
* Appointment confirmed
* Appointment reminder
* Job completed
* Inspection ready

### Email

Potential events:

* Request confirmation
* Appointment confirmation
* Inspection report
* Service history update

### SMS

Potential events:

* Important appointment reminders
* Operational alerts

Notifications should remain useful rather than becoming promotional spam.

---

# 31. MVP vs Future UX

## MVP

Customer:

* Browse website
* View services
* Contact FORauto
* WhatsApp
* Submit service request
* Upload media
* Provide vehicle details
* Request preferred date

Admin:

* Login
* View requests
* Contact customer
* Manage request status
* Manage customers
* Manage vehicles
* Manage appointments
* Manage jobs
* Assign technicians
* Add work notes
* Upload job media

Public:

* Homepage
* Services
* Service details
* Our Work
* About
* Contact
* Location

---

## P1

* Customer accounts
* Vehicle dashboard
* Service history
* Technician dashboard
* Inspection workflow
* Inspection reports
* Reviews
* Email notifications
* Better analytics
* Content management

---

## P2

* Vehicle marketplace
* Digital quotes
* Payments
* Invoices
* Maintenance reminders
* Parts inventory
* Automated WhatsApp
* Fleet management
* Roadside assistance
* AI-assisted issue intake
* Multi-location support

---

# 32. Critical UX Rules

### Rule 1 — Don't force customers to diagnose cars

The customer explains the symptom.

FORauto handles the diagnosis.

### Rule 2 — Don't require an account before help

Guest service requests remain available.

### Rule 3 — Don't pretend requests are confirmed appointments

A requested date is not a confirmed appointment until FORauto confirms it.

### Rule 4 — WhatsApp remains part of the product

The digital platform should work with the existing business workflow, not fight it.

### Rule 5 — Real work becomes product content

Completed jobs can become:

* Portfolio entries
* Service history
* Inspection evidence
* Customer trust content

### Rule 6 — Internal complexity stays internal

Customers should not see administrative states, technical database concepts, or unnecessary operational complexity.

### Rule 7 — Every important action needs a clear next step

Avoid dead ends.

Every successful flow should answer:

> **What happens now?**

### Rule 8 — Real information over invented content

No fake:

* Reviews
* Customers
* Work examples
* Certifications
* Statistics
* Vehicle listings

Placeholders are acceptable during development but must be clearly replaceable.

---

# 33. End-to-End Product Journey

The complete FORauto experience is:

```text
DISCOVER
   ↓
UNDERSTAND
   ↓
TRUST
   ↓
ASK FOR HELP
   ↓
SUBMIT REQUEST
   ↓
FORauto CONTACTS CUSTOMER
   ↓
APPOINTMENT
   ↓
JOB
   ↓
TECHNICIAN
   ↓
WORK COMPLETED
   ↓
SERVICE RECORD
   ↓
CUSTOMER RETURNS
   ↓
LONG-TERM VEHICLE HISTORY
```

This is the foundation for turning FORauto from a website into a **digital operating layer for the automotive business**.

---

# 34. Design Implication

The UX architecture establishes the following design priorities:

1. **Strong first impression**
2. **Clear automotive service discovery**
3. **Extremely easy service request**
4. **Fast WhatsApp/phone access**
5. **Real-work visual proof**
6. **Mobile-first interaction**
7. **Simple customer language**
8. **Operationally useful admin experience**
9. **Clear status and feedback**
10. **A foundation that can expand without redesigning the entire product**

The next design document should translate these flows into the actual visual system, including:

* layout
* spacing
* color tokens
* typography
* buttons
* forms
* cards
* navigation
* mobile patterns
* dashboards
* request states
* empty states
* motion
* photography
* responsive behaviour
* accessibility
* component principles

That document will be `DESIGN.md`.
