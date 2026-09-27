-- 004_customers.sql
--
-- The business entity behind a customer. Exists with or without a
-- linked `users` row, which is what makes guest service requests
-- possible (docs/DATABASE.md §6, §7; docs/ARCHITECTURE.md §15).
-- Source: docs/DATABASE.md §6

CREATE TABLE customers (
  id             UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        UUID         UNIQUE REFERENCES users (id) ON DELETE SET NULL,
  first_name     VARCHAR(120) NOT NULL,
  last_name      VARCHAR(120),
  phone          VARCHAR(32)  NOT NULL,
  email          VARCHAR(320),
  whatsapp_phone VARCHAR(32),
  notes          TEXT,
  created_at     TIMESTAMPTZ  NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ  NOT NULL DEFAULT now()
);

-- phones are normalised to a single canonical representation before they
-- reach this column (AGENTS.md §19). The index is what makes that
-- lookup cheap when a guest request is matched to an existing customer.
CREATE INDEX customers_phone_idx ON customers (phone);

CREATE TRIGGER customers_set_updated_at
  BEFORE UPDATE ON customers
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
