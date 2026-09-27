-- 011_service_records.sql
--
-- Completed service history for a vehicle. Derived from completed work
-- rather than maintained by hand, so there is exactly one copy of the
-- event (docs/ARCHITECTURE.md §24).
-- Source: docs/DATABASE.md §23, §45

CREATE TABLE service_records (
  id             UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id     UUID        NOT NULL REFERENCES vehicles (id) ON DELETE RESTRICT,
  job_id         UUID        UNIQUE REFERENCES jobs (id) ON DELETE SET NULL,
  service_date   DATE        NOT NULL,
  summary        TEXT        NOT NULL,
  work_performed TEXT,
  notes          TEXT,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- docs/DATABASE.md §45. Also the access path for
-- GET /vehicles/:id/service-history (docs/API.md §14).
CREATE INDEX service_records_vehicle_id_idx ON service_records (vehicle_id, service_date DESC);

CREATE TRIGGER service_records_set_updated_at
  BEFORE UPDATE ON service_records
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
