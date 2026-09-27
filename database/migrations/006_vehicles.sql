-- 006_vehicles.sql
--
-- Customer vehicles. One customer may own many (docs/DATABASE.md §9).
-- Source: docs/DATABASE.md §9, §10, §46, §47

CREATE TABLE vehicles (
  id                   UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id          UUID         NOT NULL REFERENCES customers (id) ON DELETE RESTRICT,
  make                 VARCHAR(80)  NOT NULL,
  model                VARCHAR(80)  NOT NULL,
  year                 SMALLINT,
  registration_number  VARCHAR(32),
  vin                  VARCHAR(64),
  mileage              INTEGER,
  notes                TEXT,
  created_at           TIMESTAMPTZ  NOT NULL DEFAULT now(),
  updated_at           TIMESTAMPTZ  NOT NULL DEFAULT now(),

  -- docs/DATABASE.md §47
  CONSTRAINT vehicles_year_sane CHECK (year IS NULL OR year > 1885),
  CONSTRAINT vehicles_mileage_non_negative CHECK (mileage IS NULL OR mileage >= 0)
);

-- docs/DATABASE.md §45
CREATE INDEX vehicles_customer_id_idx ON vehicles (customer_id);
CREATE INDEX vehicles_registration_number_idx ON vehicles (registration_number);

-- docs/DATABASE.md §46 notes that registration numbers *may* need
-- uniqueness, but warns that real-world data quality and legitimate
-- duplicates must be considered first. Not enforced until confirmed.

CREATE TRIGGER vehicles_set_updated_at
  BEFORE UPDATE ON vehicles
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
