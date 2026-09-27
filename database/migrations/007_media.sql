-- 007_media.sql
--
-- Central media METADATA only. Binary content lives in object storage
-- (docs/ARCHITECTURE.md §25; AGENTS.md §21).
-- Source: docs/DATABASE.md §29, §30
--
-- Created before the join tables that reference it.

CREATE TABLE media (
  id                UUID             PRIMARY KEY DEFAULT gen_random_uuid(),
  storage_provider  VARCHAR(40)      NOT NULL,
  storage_key       TEXT             NOT NULL,
  original_filename TEXT,
  mime_type         VARCHAR(120)     NOT NULL,
  size_bytes        BIGINT           NOT NULL,
  width             INTEGER,
  height            INTEGER,
  visibility        media_visibility NOT NULL DEFAULT 'PRIVATE',
  uploaded_by       UUID             REFERENCES users (id) ON DELETE SET NULL,
  created_at        TIMESTAMPTZ      NOT NULL DEFAULT now(),

  -- docs/ARCHITECTURE.md §38: server-generated storage keys, never the
  -- client-supplied filename. Uniqueness enforces that.
  CONSTRAINT media_storage_key_unique UNIQUE (storage_provider, storage_key),
  CONSTRAINT media_size_bytes_positive CHECK (size_bytes >= 0)
);

-- The storage provider itself is not yet chosen
-- (docs/ARCHITECTURE.md §25), so no provider CHECK constraint is
-- applied and no default is hard-coded.
