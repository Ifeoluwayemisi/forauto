-- 005_staff.sql
--
-- Internal FORauto workers. `user_id` is required: staff must be
-- authenticated to reach any operational endpoint
-- (docs/DATABASE.md §8; AGENTS.md §13).
-- Source: docs/DATABASE.md §8

CREATE TABLE staff (
  id         UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID         NOT NULL UNIQUE REFERENCES users (id) ON DELETE CASCADE,
  first_name VARCHAR(120) NOT NULL,
  last_name  VARCHAR(120),
  phone      VARCHAR(32),
  role       staff_role   NOT NULL,
  specialty  VARCHAR(160),
  status     staff_status NOT NULL DEFAULT 'ACTIVE',
  created_at TIMESTAMPTZ  NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE TRIGGER staff_set_updated_at
  BEFORE UPDATE ON staff
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
