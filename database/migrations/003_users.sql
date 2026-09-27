-- 003_users.sql
--
-- Authentication identities. Deliberately separate from `customers`
-- and `staff` (docs/DATABASE.md §7): a customer is a business entity,
-- a user is an authentication identity.
-- Source: docs/DATABASE.md §5

CREATE TABLE users (
  id            UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  email         VARCHAR(320),
  phone         VARCHAR(32),
  password_hash TEXT,
  role          user_role    NOT NULL,
  status        user_status  NOT NULL DEFAULT 'ACTIVE',
  created_at    TIMESTAMPTZ  NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ  NOT NULL DEFAULT now(),
  last_login_at TIMESTAMPTZ
);

-- docs/DATABASE.md §46: both columns are nullable ("nullable if
-- phone-first"), so uniqueness must be a partial index. A plain UNIQUE
-- constraint would not express "unique where provided" and would
-- restrict the table to a single NULL.
CREATE UNIQUE INDEX users_email_unique ON users (lower(email))
  WHERE email IS NOT NULL;

CREATE UNIQUE INDEX users_phone_unique ON users (phone)
  WHERE phone IS NOT NULL;

CREATE TRIGGER users_set_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
