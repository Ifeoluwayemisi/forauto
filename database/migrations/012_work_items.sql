-- 012_work_items.sql
--
-- Published real-world FORauto work (the portfolio / "Our Work" gallery).
-- Source: docs/DATABASE.md §31, §32, §45
--
-- SCOPE NOTE: `work_item_media` is not listed in the MVP table set in
-- docs/ROADMAP.md §7.4, but docs/DATABASE.md §32 defines it as part of the
-- `work_items` design and docs/API.md §11/§28 expose cover images for work
-- items. It is included because a work item without images cannot satisfy
-- the documented public contract. Revisit if the MVP scope is narrowed.
--
-- NOTE: there is deliberately no `services` table. docs/API.md §9 notes
-- that some public content may be served directly by the frontend, and
-- docs/ROADMAP.md §5 requires the real service catalogue to be confirmed
-- before it is modelled or published. Inventing service rows now would
-- breach AGENTS.md §8 and §7.

CREATE TABLE work_items (
  id             UUID              PRIMARY KEY DEFAULT gen_random_uuid(),
  slug           VARCHAR(160)      NOT NULL UNIQUE,
  title          VARCHAR(200)      NOT NULL,
  category       VARCHAR(80),
  vehicle_make   VARCHAR(80),
  vehicle_model  VARCHAR(80),
  problem        TEXT,
  work_performed TEXT,
  description    TEXT,
  status         work_item_status  NOT NULL DEFAULT 'DRAFT',
  published_at   TIMESTAMPTZ,
  created_at     TIMESTAMPTZ       NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ       NOT NULL DEFAULT now(),

  -- docs/API.md §29: only PUBLISHED items are public. A published item
  -- must record when it went live.
  CONSTRAINT work_items_published_at_present CHECK (
    status <> 'PUBLISHED' OR published_at IS NOT NULL
  )
);

-- docs/DATABASE.md §45
CREATE INDEX work_items_status_idx ON work_items (status);

CREATE TRIGGER work_items_set_updated_at
  BEFORE UPDATE ON work_items
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();


CREATE TABLE work_item_media (
  work_item_id UUID    NOT NULL REFERENCES work_items (id) ON DELETE CASCADE,
  media_id     UUID    NOT NULL REFERENCES media (id) ON DELETE CASCADE,
  sort_order   INTEGER NOT NULL DEFAULT 0,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT work_item_media_pk PRIMARY KEY (work_item_id, media_id)
);

CREATE INDEX work_item_media_media_id_idx ON work_item_media (media_id);
