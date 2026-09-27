-- 010_jobs.sql
--
-- A job is actual workshop work, not a customer enquiry. A job may be
-- created directly by staff for a walk-in customer, with no online
-- request involved (docs/DATABASE.md §18, §19, §53).
-- Source: docs/DATABASE.md §17, §20, §21, §22, §45

-- See the note in 009_appointments.sql about the reference format.
CREATE SEQUENCE job_reference_seq START 1000;

CREATE TABLE jobs (
  id                 UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  reference          VARCHAR(20) NOT NULL UNIQUE
                       DEFAULT 'FA-JOB-' || lpad(nextval('job_reference_seq')::TEXT, 4, '0'),
  customer_id        UUID        NOT NULL REFERENCES customers (id) ON DELETE RESTRICT,
  vehicle_id         UUID        NOT NULL REFERENCES vehicles (id) ON DELETE RESTRICT,
  service_request_id UUID        REFERENCES service_requests (id) ON DELETE SET NULL,
  appointment_id     UUID        REFERENCES appointments (id) ON DELETE SET NULL,
  status             job_status  NOT NULL DEFAULT 'ASSIGNED',
  diagnosis          TEXT,
  work_performed     TEXT,
  internal_notes     TEXT,
  started_at         TIMESTAMPTZ,
  completed_at       TIMESTAMPTZ,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT jobs_completion_recorded CHECK (
    status <> 'COMPLETED' OR completed_at IS NOT NULL
  )
);

-- docs/DATABASE.md §45
CREATE INDEX jobs_status_idx ON jobs (status);
CREATE INDEX jobs_vehicle_id_idx ON jobs (vehicle_id);
CREATE INDEX jobs_customer_id_idx ON jobs (customer_id);

CREATE TRIGGER jobs_set_updated_at
  BEFORE UPDATE ON jobs
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();


-- Staff assigned to a job. Modelled independently so more than one
-- person can contribute (docs/ARCHITECTURE.md §22).
CREATE TABLE job_assignments (
  id              UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id          UUID            NOT NULL REFERENCES jobs (id) ON DELETE CASCADE,
  staff_id        UUID            NOT NULL REFERENCES staff (id) ON DELETE RESTRICT,
  assignment_role assignment_role NOT NULL,
  assigned_at     TIMESTAMPTZ     NOT NULL DEFAULT now(),
  unassigned_at   TIMESTAMPTZ,
  created_at      TIMESTAMPTZ     NOT NULL DEFAULT now(),

  -- One person holds one role on a given job.
  CONSTRAINT job_assignments_unique UNIQUE (job_id, staff_id)
);

CREATE INDEX job_assignments_job_id_idx ON job_assignments (job_id);
CREATE INDEX job_assignments_staff_id_idx ON job_assignments (staff_id);


-- Individual work notes/stages, giving a richer history than one large
-- notes field (docs/DATABASE.md §21).
CREATE TABLE work_entries (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id      UUID        NOT NULL REFERENCES jobs (id) ON DELETE CASCADE,
  staff_id    UUID        REFERENCES staff (id) ON DELETE SET NULL,
  title       VARCHAR(160) NOT NULL,
  description TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX work_entries_job_id_idx ON work_entries (job_id);

CREATE TRIGGER work_entries_set_updated_at
  BEFORE UPDATE ON work_entries
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();


-- Before / during / after job photos (docs/DATABASE.md §22).
-- These are INTERNAL media by default and must never become public by
-- accident (docs/DATABASE.md §30).
CREATE TABLE job_media (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id     UUID        NOT NULL REFERENCES jobs (id) ON DELETE CASCADE,
  media_id   UUID        NOT NULL REFERENCES media (id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT job_media_unique UNIQUE (job_id, media_id)
);

CREATE INDEX job_media_media_id_idx ON job_media (media_id);
