-- 008_service_requests.sql
--
-- The central customer enquiry entity (docs/DATABASE.md §11).
-- Source: docs/DATABASE.md §11, §12, §13, §14, §45

-- Human-readable customer reference, e.g. 'FA-1042' (docs/DATABASE.md §12).
-- Backed by a sequence rather than application logic so that concurrent
-- submissions cannot collide.
CREATE SEQUENCE service_request_reference_seq START 1000;

CREATE TABLE service_requests (
  id                   UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),
  reference            VARCHAR(20)              NOT NULL UNIQUE
                         DEFAULT 'FA-' || lpad(nextval('service_request_reference_seq')::TEXT, 4, '0'),
  customer_id          UUID                     NOT NULL REFERENCES customers (id) ON DELETE RESTRICT,
  vehicle_id           UUID                     REFERENCES vehicles (id) ON DELETE SET NULL,
  category             VARCHAR(40)              NOT NULL,
  description          TEXT                     NOT NULL,
  occurrence_details   TEXT,
  preferred_date       DATE,
  preferred_time_period preferred_time_period,
  contact_preference   contact_preference,
  status               service_request_status   NOT NULL DEFAULT 'NEW',
  internal_notes       TEXT,
  created_at           TIMESTAMPTZ              NOT NULL DEFAULT now(),
  updated_at           TIMESTAMPTZ              NOT NULL DEFAULT now(),
  contacted_at         TIMESTAMPTZ,
  completed_at         TIMESTAMPTZ,

  -- `description` is the customer's own account of the problem and is
  -- never overwritten by staff re-classification
  -- (docs/ARCHITECTURE.md §19).
  CONSTRAINT service_requests_description_present CHECK (btrim(description) <> '')
);

-- docs/DATABASE.md §13: `category` is deliberately VARCHAR, not an enum,
-- so the vocabulary can become database-managed later without a
-- destructive change. The initial values are enforced at the API
-- boundary (docs/API.md §40) and mirrored in
-- packages/types/src/status.ts.

-- docs/DATABASE.md §45
CREATE INDEX service_requests_status_idx ON service_requests (status);
CREATE INDEX service_requests_customer_id_idx ON service_requests (customer_id);
CREATE INDEX service_requests_vehicle_id_idx ON service_requests (vehicle_id);
CREATE INDEX service_requests_created_at_idx ON service_requests (created_at DESC);

CREATE TRIGGER service_requests_set_updated_at
  BEFORE UPDATE ON service_requests
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();


-- Customer photos/videos attached to a request (docs/DATABASE.md §14).
CREATE TABLE service_request_media (
  id                UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  service_request_id UUID       NOT NULL REFERENCES service_requests (id) ON DELETE CASCADE,
  media_id          UUID        NOT NULL REFERENCES media (id) ON DELETE CASCADE,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT service_request_media_unique UNIQUE (service_request_id, media_id)
);

CREATE INDEX service_request_media_media_id_idx
  ON service_request_media (media_id);
