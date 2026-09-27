-- 002_enums.sql
--
-- Central status vocabularies.
-- Source: docs/DATABASE.md §5, §8, §11, §15, §17, §20, §30, §31
--         docs/API.md §4, §17, §22, §24, §25, §29
--
-- Every value here is mirrored in packages/types/src/status.ts.
-- AGENTS.md §10 and §28: statuses are defined once, centrally.

-- ── users ────────────────────────────────────────────────────────
CREATE TYPE user_role AS ENUM (
  'CUSTOMER',
  'STAFF'
);

CREATE TYPE user_status AS ENUM (
  'ACTIVE',
  'SUSPENDED',
  'DISABLED'
);

-- ── staff ────────────────────────────────────────────────────────
CREATE TYPE staff_role AS ENUM (
  'ADMIN',
  'MANAGER',
  'TECHNICIAN',
  'STAFF'
);

CREATE TYPE staff_status AS ENUM (
  'ACTIVE',
  'INACTIVE'
);

-- ── service_requests ─────────────────────────────────────────────
CREATE TYPE service_request_status AS ENUM (
  'NEW',
  'CONTACTED',
  'SCHEDULED',
  'IN_PROGRESS',
  'COMPLETED',
  'CLOSED',
  'CANCELLED'
);

CREATE TYPE preferred_time_period AS ENUM (
  'MORNING',
  'AFTERNOON',
  'EVENING'
);

CREATE TYPE contact_preference AS ENUM (
  'PHONE',
  'WHATSAPP'
);

-- ── appointments ─────────────────────────────────────────────────
CREATE TYPE appointment_status AS ENUM (
  'REQUESTED',
  'CONFIRMED',
  'RESCHEDULED',
  'COMPLETED',
  'CANCELLED',
  'NO_SHOW'
);

-- ── jobs ─────────────────────────────────────────────────────────
CREATE TYPE job_status AS ENUM (
  'ASSIGNED',
  'IN_PROGRESS',
  'COMPLETED',
  'CANCELLED'
);

CREATE TYPE assignment_role AS ENUM (
  'PRIMARY',
  'SUPPORT',
  'APPRENTICE',
  'SUPERVISOR'
);

-- ── media ────────────────────────────────────────────────────────
-- docs/DATABASE.md §30. This enum is a privacy control, not cosmetics:
-- it is what stops internal job photos from becoming public.
CREATE TYPE media_visibility AS ENUM (
  'PRIVATE',
  'INTERNAL',
  'PUBLIC'
);

-- ── work_items ───────────────────────────────────────────────────
CREATE TYPE work_item_status AS ENUM (
  'DRAFT',
  'PUBLISHED',
  'ARCHIVED'
);

-- ── shared updated_at trigger ────────────────────────────────────
-- docs/DATABASE.md §42. Every operational table carries
-- created_at / updated_at.
--
-- `statement_timestamp()` is deliberate. `now()` returns the *transaction*
-- start time, so it never advances inside a transaction: a row inserted
-- and then modified in the same transaction would keep its original
-- `updated_at`, and two updates in one transaction would be
-- indistinguishable. `statement_timestamp()` advances per statement while
-- staying constant across the rows of a single statement, which is the
-- right semantics for "when was this row last changed".
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = statement_timestamp();
  RETURN NEW;
END;
$$;
