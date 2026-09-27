# FORauto — Design System & UI Direction

**Version:** 0.1
**Status:** Working Specification
**Product:** FORauto — Automotive Services & Vehicle Solutions

---

# 1. Design Intent

FORauto should feel like an established automotive business that has been brought into the modern digital age.

The design should communicate:

* Experience
* Technical competence
* Trust
* Precision
* Practicality
* Human craftsmanship
* Convenience

It should **not** look like:

* A generic mechanic website
* A car dealership template
* A SaaS dashboard pretending to be an automotive company
* A flashy automotive landing page
* A stereotypical red-and-black garage brand

### Core design principle

> **Experienced hands. Modern service.**

The interface should make the business feel more organized and accessible without removing its human character.

---

# 2. Visual Direction

## Overall aesthetic

**Premium automotive × engineering × human craftsmanship**

The visual language combines:

* Dark technical surfaces
* Warm neutral backgrounds
* Strong typography
* Large automotive photography
* Editorial layouts
* Precise spacing
* Subtle technical details
* Restrained motion
* Clear calls to action

The website should feel closer to a **premium automotive service brand** than a traditional workshop website.

---

# 3. Design Personality

The interface should feel:

| Attribute    | Direction   |
| ------------ | ----------- |
| Professional | High        |
| Technical    | High        |
| Human        | High        |
| Premium      | Medium–High |
| Playful      | Low         |
| Corporate    | Medium      |
| Minimal      | Medium–High |
| Industrial   | Medium      |
| Aggressive   | Low         |

The design should communicate confidence without trying too hard.

---

# 4. Color System

The initial palette should use a restrained foundation.

## Primary background

**Near Black / Charcoal**

Used for:

* Navigation
* Hero sections
* Footer
* Major CTA sections
* Selected dashboard surfaces

Approximate direction:

```text
#111111
```

The exact production value can be refined during implementation.

---

## Primary light surface

**Warm White**

Used for:

* Main page backgrounds
* Service sections
* Content areas
* Forms

Direction:

```text
#F7F5F0
```

The interface should avoid an overly sterile pure-white aesthetic.

---

## Secondary neutral

**Stone / Warm Gray**

Used for:

* Secondary backgrounds
* Borders
* Cards
* Supporting sections
* Muted text

Direction:

```text
#E7E3DB
```

---

## Accent

**Amber / Automotive Orange**

Current preferred direction.

Used selectively for:

* Primary CTA
* Active states
* Important highlights
* Small visual details
* Status indicators where appropriate

Direction:

```text
#E88A2A
```

The accent must remain an accent.

Do not turn the entire website orange.

---

## Text

### On light backgrounds

Primary:

```text
#171717
```

Secondary:

```text
#5F5B55
```

Muted:

```text
#8A857D
```

### On dark backgrounds

Primary:

```text
#F5F3EE
```

Secondary:

```text
#B8B4AC
```

---

# 5. Color Usage Rule

The color hierarchy should generally be:

```text
Neutral foundation
        ↓
Strong typography
        ↓
Photography
        ↓
Accent
```

The accent should guide attention rather than define the entire identity.

### Avoid

* Red + black mechanic stereotype
* Neon gradients
* Multiple competing accent colors
* Excessive orange backgrounds
* Gradient-heavy UI
* Rainbow status systems

---

# 6. Typography

Typography should feel modern, technical, and highly readable.

## Primary candidates

Display:

* Manrope
* Geist
* Inter Tight

Body:

* Inter
* Geist

Technical metadata:

* Monospace font where useful

The final font choice should be locked during implementation based on availability, rendering quality, and overall visual balance.

---

# 7. Typography Hierarchy

## Display heading

Used for:

* Hero
* Major section headings
* Important editorial moments

Characteristics:

* Large
* Strong
* Tight line height
* Confident

Example:

> **Your car.
> Our expertise.**

---

## Section heading

Used for:

* Services
* Our Work
* About
* Vehicle Services

Example:

> Automotive expertise that goes beyond repairs.

---

## Body

Readable and relaxed.

Example:

> From mechanical repairs and auto electrical work to diagnostics and vehicle services, FORauto brings decades of hands-on experience to every job.

---

## Labels

Small, uppercase or compact labels can be used for technical context.

Example:

```text
20+ YEARS OF EXPERIENCE
```

These should be used sparingly.

---

# 8. Layout System

The layout should use a strong grid.

## Desktop

Use a centered content container.

Direction:

```text
┌─────────────────────────────────────────────┐
│                                             │
│              MAX CONTENT WIDTH              │
│                                             │
└─────────────────────────────────────────────┘
```

Target maximum width:

**1200–1320px**

depending on viewport and final implementation.

---

## Mobile

Content should use comfortable horizontal padding.

Approximate:

**20–24px**

The exact spacing should be tokenized.

---

# 9. Spacing System

Use a consistent spacing scale rather than arbitrary values.

Suggested base:

```text
4
8
12
16
24
32
48
64
80
96
120
```

Large spacing should be reserved for major editorial sections.

The design should feel spacious without becoming empty.

---

# 10. Border Radius

FORauto should not use extremely rounded SaaS-style components.

Suggested direction:

* Small controls: 8px
* Cards: 12–16px
* Large image containers: 16–20px
* Buttons: 8–10px

Avoid excessive pill-shaped UI except where the content naturally calls for it.

---

# 11. Navigation

## Desktop

Structure:

```text
FORauto

Services
Our Work
About
Vehicle Services
Contact

                         [Get Help With Your Car]
```

The navigation should remain visually simple.

### Behaviour

* Sticky or intelligently persistent navigation
* Slight background transition when scrolling
* Strong contrast against hero
* CTA always visible

---

## Mobile

```text
FORauto                       ☰
```

Menu:

```text
Services
Our Work
About
Vehicle Services
Contact

──────────────

WhatsApp
Call FORauto

[Get Help With Your Car]
```

The mobile navigation should prioritize actions over decorative elements.

---

# 12. Hero Design

The homepage hero is the most important visual moment.

## Preferred composition

Large automotive/workshop image or image composition.

Overlay or adjacent typography:

```text
20+ YEARS OF AUTOMOTIVE EXPERIENCE

Your car.
Our expertise.

From mechanical repairs and auto electrical work
to diagnostics and vehicle services.

[Get Help With Your Car]
[Chat on WhatsApp]
```

---

# 13. Hero Photography

Use photography that feels real.

Preferred:

* Mechanic working on vehicle
* Engine bay
* Diagnostic equipment
* Electrical work
* Workshop environment
* Hands working
* Vehicle detail
* Team at work

Avoid generic images of:

* A random luxury car
* A showroom
* A smiling stock mechanic pointing at a laptop
* Obviously staged garage scenes

Temporary stock/AI imagery may be used during development, but it should be structured so it can easily be replaced with real FORauto photography.

---

# 14. Homepage Rhythm

The homepage should alternate between different visual modes.

```text
DARK
Hero
   ↓
LIGHT
Trust / Experience
   ↓
LIGHT
Services
   ↓
IMAGE
Real Work
   ↓
DARK / EDITORIAL
About / Story
   ↓
LIGHT
Vehicle Services
   ↓
IMAGE
Our Work
   ↓
DARK
Final CTA
   ↓
DARK
Footer
```

This prevents the page from becoming a repetitive sequence of cards.

---

# 15. Experience / Trust Section

The 20+ years of experience should be presented as evidence, not exaggerated marketing.

Possible composition:

```text
20+

YEARS
OF EXPERIENCE
```

Alongside:

> More than two decades of hands-on automotive experience, working across different vehicle makes and automotive systems.

Supporting details can include:

* Mechanical expertise
* Electrical / rewiring
* Diagnostics
* Team of technicians and apprentices
* Physical workshop

Only confirmed facts should be displayed.

---

# 16. Services Design

The services section should avoid looking like a generic icon grid.

Possible structure:

```text
WHAT WE DO

Mechanical
────────────────────────────
Engine, transmission and general
mechanical repairs.

Electrical
────────────────────────────
Auto electrical systems,
rewiring and fault tracing.

Diagnostics
────────────────────────────
Vehicle diagnostics and
fault identification.

Servicing
────────────────────────────
Routine and preventive
vehicle maintenance.
```

Additional confirmed services can be added once the full service inventory is documented.

---

# 17. Service Cards

Cards should feel editorial rather than overly decorative.

Each card may contain:

* Service number
* Name
* Short description
* Supporting image
* Arrow/action

Example:

```text
01

AUTO ELECTRICAL

Electrical repairs,
rewiring and fault tracing.

                         →
```

Hover:

* Image subtly scales
* Arrow moves slightly
* Border/accent changes
* No excessive animation

---

# 18. Service Detail Page

Structure:

```text
Breadcrumb

AUTO ELECTRICAL

Electrical work,
rewiring & diagnostics.

[Request This Service]

Large image

What we can help with

Service details

Common issues

How the process works

Related services

[Get Help With Your Car]
```

The page should explain services in language customers understand.

---

# 19. Request Form Design

The service request experience should feel like a guided conversation rather than an administrative form.

## Step indicator

Example:

```text
01 Problem
02 Vehicle
03 Contact
04 Review
```

The user should always know where they are.

---

# 20. Form Principles

### One clear question at a time where appropriate

Instead of:

```text
Name
Phone
Email
Vehicle
Problem
Date
Photos
Everything on one page
```

consider progressive sections.

---

## Required fields

Keep the first request lightweight.

Core:

* Problem
* Vehicle make
* Vehicle model
* Name
* Phone

Optional:

* Year
* Registration
* Photos
* Video
* Email
* Preferred date

---

# 21. Form Inputs

Inputs should be:

* Large enough for mobile
* High contrast
* Clearly labelled
* Easy to scan
* Keyboard-friendly
* Accessible

Avoid placeholder text being the only label.

---

# 22. Upload Component

The upload interface should clearly communicate supported media.

Example:

```text
ADD PHOTOS OR VIDEO

Help us understand the issue.

[ + Upload photos or video ]

You can add up to X files.
```

The final upload limit should be determined during implementation.

States:

* Empty
* Uploading
* Uploaded
* Failed
* Removing

---

# 23. Success State

Success should feel reassuring.

```text
REQUEST RECEIVED

We've received your request.

We'll contact you to discuss the issue
and confirm the next step.

Request #FA-1042

[Chat on WhatsApp]
[Back to FORauto]
```

Avoid:

> "Your booking has been confirmed"

unless the appointment has actually been confirmed.

---

# 24. WhatsApp CTA

WhatsApp should be visually recognizable but still fit the brand.

Use it as:

* Hero secondary CTA
* Contact CTA
* Mobile persistent action
* Request success action
* Service page action

The exact implementation should use the appropriate official WhatsApp iconography rather than creating a fake logo.

---

# 25. Call CTA

The phone action should be simple:

**Call FORauto**

On mobile it should trigger the device's phone functionality.

---

# 26. Our Work

The portfolio should be one of the strongest trust-building sections.

Instead of generic gallery tiles:

```text
OUR WORK

Real vehicles.
Real problems.
Real work.

[Gallery]
```

Each project can tell a small story:

```text
Toyota Camry

INTERMITTENT STARTING ISSUE

Problem
Vehicle was experiencing intermittent
starting failure.

Work
Electrical diagnosis and repair.

[View Case]
```

Only actual completed work should eventually appear here.

---

# 27. Image Gallery

Gallery direction:

* Large feature image
* Supporting smaller images
* Mixed aspect ratios
* Full-bleed moments
* Editorial spacing

Avoid:

* 12 identical square thumbnails
* Heavy borders
* Excessive captions
* Generic stock image grids

---

# 28. About Page

The About page should feel human.

Possible structure:

```text
20+ YEARS

Built through hands-on experience.

[Workshop / Owner Image]

The Story

Team

How We Work

Our Workshop

[Get Directions]

[Talk to FORauto]
```

The owner's story can become an important brand asset once accurate information is collected.

---

# 29. Vehicle Services

Vehicle-related services should have a slightly more editorial presentation.

Possible categories:

```text
VEHICLE SERVICES

Vehicle Inspection
Know what you're buying.

Sell Your Vehicle
Let us know what you're selling.

Future:
Vehicle Listings
Browse available vehicles.
```

Only services actually offered should be presented as active services.

Future capabilities should remain clearly separated during development.

---

# 30. Contact Page

The Contact page should prioritize immediate action.

```text
CONTACT FORauto

Need help with your vehicle?

[WhatsApp]
[Call]

WORKSHOP

Oniru,
Victoria Island, Lagos

[Get Directions]

Hours
[Actual business hours]

Service Request
[Get Help With Your Car]
```

Business hours should only be displayed once confirmed.

---

# 31. Footer

The footer should be compact but useful.

```text
FORauto
Automotive Services & Vehicle Solutions

Services
Our Work
About
Vehicle Services
Contact

WhatsApp
Call

Oniru, Victoria Island, Lagos

© FORauto
```

Potential future links:

* Privacy
* Terms
* Customer account
* Service history

---

# 32. Admin Dashboard Design

The admin interface should prioritize **information density and operational clarity**, not marketing aesthetics.

## Dashboard

```text
GOOD MORNING

Overview

┌────────────┐ ┌────────────┐
│ New        │ │ Today      │
│ Requests   │ │ Jobs       │
└────────────┘ └────────────┘

┌────────────┐ ┌────────────┐
│ Pending    │ │ Active     │
│ Bookings   │ │ Jobs       │
└────────────┘ └────────────┘

Recent Requests
────────────────────────────
```

---

# 33. Admin Navigation

```text
Dashboard

Requests
Appointments
Jobs

Customers
Vehicles
Staff

Inspections
Our Work
Vehicle Listings

Reviews
Media

Settings
```

Items that are not implemented should not appear as fake functionality in the production MVP.

---

# 34. Status Design

Status must be understandable immediately.

Example:

```text
NEW
CONTACTED
SCHEDULED
IN PROGRESS
COMPLETED
CLOSED
CANCELLED
```

Status indicators should use:

* Text
* Shape
* Optional color

Never rely on color alone.

---

# 35. Technician Dashboard

Technicians should see only the information necessary to perform their work.

```text
MY JOBS

Today
──────────────

Toyota Camry
Starting issue
10:00 AM

Honda Accord
Electrical fault
2:00 PM
```

Job detail:

```text
Vehicle
Customer
Reported issue
Appointment
Previous relevant notes

[Start Job]

Work Notes
Photos
Findings

[Mark Complete]
```

---

# 36. Motion Design

Motion should communicate precision.

## Preferred

* Smooth page transitions
* Image reveal
* Subtle hover movement
* Button micro-interactions
* Navigation transitions
* Scroll-triggered content reveals
* Subtle number animations where meaningful

## Avoid

* Excessive parallax
* Constant floating elements
* Bouncing buttons
* Large spinning objects
* Long loading animations
* Animation on every element

---

# 37. Motion Timing

Suggested direction:

### Micro interaction

~150–250ms

### Component transition

~250–400ms

### Larger section reveal

~400–700ms

Motion should remain fast enough that the interface feels responsive.

---

# 38. Accessibility

Accessibility is part of the design system.

Requirements:

* Sufficient color contrast
* Keyboard navigation
* Visible focus states
* Semantic HTML
* Accessible form labels
* Alt text for meaningful images
* Reduced-motion support
* Touch-friendly controls
* Error messages that explain how to recover

---

# 39. Responsive Behaviour

Design breakpoints should not simply shrink desktop layouts.

## Mobile

Priorities:

1. Main action
2. Service discovery
3. Trust
4. Contact
5. Request flow

## Tablet

Use intermediate layouts where useful.

## Desktop

Use:

* Wider editorial compositions
* Multi-column layouts
* Larger imagery
* More visible navigation
* Dashboard density

---

# 40. Component Principles

The component system should be built around reusable primitives.

Potential core components:

```text
Button
IconButton
Link
Badge
StatusBadge

Navbar
MobileMenu
Footer

Section
Container
Grid

Card
ServiceCard
WorkCard
VehicleCard

Input
Select
Textarea
FileUpload
DatePicker

FormStepper
RequestSummary
SuccessState

Modal
Drawer
Toast
Dialog

StatCard
DataTable
EmptyState
ErrorState
```

Components should have clear responsibilities.

Avoid creating separate components for visually identical elements simply because they appear on different pages.

---

# 41. Button Hierarchy

## Primary

Used for the main action.

Example:

**Get Help With Your Car**

## Secondary

Used for supporting actions.

Example:

**Chat on WhatsApp**

## Tertiary

Used for low-emphasis navigation.

Example:

**View Services →**

## Destructive

Used only for destructive administrative actions.

Example:

**Cancel Job**

---

# 42. Iconography

Use a consistent icon library.

Preferred direction:

**Lucide**

Icons should support meaning rather than decorate every piece of text.

Avoid using:

* Random icon sets
* Emoji as primary UI icons
* Different icon styles on different pages

---

# 43. Photography Rules

Photography should eventually become a major part of the FORauto identity.

Priority order:

1. Real owner/workshop
2. Real technicians
3. Real vehicles being worked on
4. Real diagnostic/electrical/mechanical work
5. Real finished work
6. Temporary high-quality placeholders

Every major image should answer:

> **Does this help the customer understand or trust FORauto?**

---

# 44. Image Treatment

Photography can use:

* Cropping
* Dark overlays
* Grain where appropriate
* Monochrome treatment for selected editorial moments
* Edge-to-edge layouts
* Strong contrast

But the treatment should never make real work look artificial.

---

# 45. Content Design

The copy should be:

* Clear
* Confident
* Human
* Specific
* Nigerian without forcing slang everywhere

FORauto does not need to use Nigerian slang in every sentence.

Conversational moments can feel natural.

Example:

> **Something wrong with your car? Let's find out what's happening.**

rather than:

> "Omo, your motor dey misbehave?"

The brand should feel local and relatable without becoming gimmicky.

---

# 46. Empty States

Empty states should be useful.

Example:

### No service history

> Your completed services will appear here once your vehicle has been serviced through FORauto.

### No requests

> Nothing here yet. If your car needs attention, tell us what's happening.

**Get Help With Your Car**

---

# 47. Error States

Errors should be:

* Human
* Specific
* Actionable

Bad:

> Error 500.

Better:

> We couldn't send your request right now. Please try again or contact us on WhatsApp.

---

# 48. Loading States

Use skeletons where content is predictable.

Examples:

* Work cards
* Vehicle cards
* Request list
* Dashboard metrics

Avoid using a generic spinner for the entire website.

---

# 49. Trust Without UI Noise

The interface should not constantly repeat:

> 20+ YEARS
> TRUSTED
> PROFESSIONAL
> BEST SERVICE

Instead, trust should emerge from:

* Real work
* Clear information
* Experience
* Photography
* Physical location
* Transparent process
* Customer reviews
* Professional interaction

---

# 50. Design Do / Don't

## DO

* Use real work as proof
* Give typography room
* Use strong photography
* Keep CTAs clear
* Make forms easy
* Design mobile-first
* Use motion intentionally
* Keep the interface technically polished
* Make the business feel established
* Preserve human interaction

## DON'T

* Use generic mechanic templates
* Overuse orange
* Use fake testimonials
* Invent certifications
* Invent customer numbers
* Use fake vehicle listings
* Overuse glassmorphism
* Use excessive gradients
* Make everything a card
* Animate everything
* Hide the phone/WhatsApp contact
* Force account creation

---

# 51. Design North Star

Every design decision should pass this test:

> **Does this make FORauto feel more trustworthy, more experienced, or easier to work with?**

If not, it probably does not need to be there.

---

# 52. Implementation Handoff

Before frontend implementation begins, the following should be defined:

* Final color tokens
* Final typography
* Logo/wordmark
* Icon system
* Spacing tokens
* Radius tokens
* Shadows
* Breakpoints
* Button variants
* Form components
* Card patterns
* Navigation
* Mobile navigation
* Dashboard primitives
* Motion rules
* Image guidelines

The final visual implementation should remain faithful to:

`PRD → Product Overview → Brand → User Flows → Design`

The design system must serve the product rather than override the product requirements.

---

# 53. Design System Summary

FORauto should look like:

> **A modern automotive company built on decades of real workshop experience.**

Not a startup pretending to be a mechanic.

Not a mechanic business pretending to be a technology company.

The technology exists to make the experience better.

**Experienced hands. Modern service.**
