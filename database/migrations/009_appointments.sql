-- 009_appointments.sql
--
-- Scheduled workshop interactions. Separate from service requests
-- because a request can exist with no appointment
-- (docs/ARCHITECTURE.md §20).
-- Source: docs/DATABASE.md §15, §16, §45
--
-- CRITICAL RULE (docs/DATABASE.md §16, AGENTS.md §11): a customer's
-- preferred date is a request, not a confirmation. Every appointment
-- therefore starts in 'REQUESTED' and only FORauto may move it to
-- 'CONFIRMED'.

-- Reference format not yet specified in docs/DATABASE.md. The 'FA-' style
-- of service_requests (§12) is followed here for consistency; revise
-- before launch if the business prefers a different scheme.
CREATE SEQUENCE appointment_reference_seq START 1000;

CREATE TABLE appointments (
  id                 UUID               PRIMARY KEY DEFAULT gen_random_uuid(),
  reference          VARCHAR(20)        NOT NULL UNIQUE
                       DEFAULT 'FA-AP-' || lpad(nextval('appointment_reference_seq')::TEXT, 4, '0'),
  customer_id        UUID               NOT NULL REFERENCES customers (id) ON DELETE RESTRICT,
  vehicle_id         UUID               REFERENCES vehicles (id) ON DELETE SET NULL,
  service_request_id UUID               REFERENCES service_requests (id) ON DELETE SET NULL,
  scheduled_date     DATE               NOT NULL,
  start_time         TIME,
  end_time           TIME,
  status             appointment_status NOT NULL DEFAULT 'REQUESTED',
  notes              TEXT,
  confirmed_at       TIMESTAMPTZ,
  created_at         TIMESTAMPTZ        NOT NULL DEFAULT now(),
  updated_at         TIMESTAMPTZ        NOT NULL DEFAULT now(),

  CONSTRAINT appointments_time_order CHECK (
    start_time IS NULL OR end_time IS NULL OR end_time > start_time
  )
);

-- docs/DATABASE.md §45
CREATE INDEX appointments_scheduled_date_idx ON appointments (scheduled_date);
CREATE INDEX appointments_status_idx ON appointments (status);
CREATE INDEX appointments_customer_id_idx ON appointments (customer_id);

CREATE TRIGGER appointments_set_updated_at
  BEFORE UPDATE ON appointments
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
