-- 001_extensions.sql
--
-- Extensions required by the initial FORauto schema.
-- Source: docs/DATABASE.md §57, §43 (UUID strategy).

-- gen_random_uuid() provides UUID primary keys.
-- Available in PostgreSQL core since 13, but enabled explicitly here so
-- the dependency is declared rather than assumed.
CREATE EXTENSION IF NOT EXISTS pgcrypto;
