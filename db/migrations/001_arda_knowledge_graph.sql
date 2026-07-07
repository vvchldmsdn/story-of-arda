-- Story of Arda knowledge graph expansion.
-- This migration is intentionally additive. It does not drop or rename the
-- existing page/region/event/character tables used by the current app.

CREATE EXTENSION IF NOT EXISTS postgis;

CREATE TABLE IF NOT EXISTS arda_era (
  id SERIAL PRIMARY KEY,
  slug VARCHAR(80) UNIQUE NOT NULL,
  name VARCHAR(120) NOT NULL,
  sort_order INTEGER NOT NULL,
  period_label VARCHAR(160),
  summary TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS arda_map_profile (
  id SERIAL PRIMARY KEY,
  era_id INTEGER REFERENCES arda_era(id),
  legacy_map_id INTEGER REFERENCES map(id),
  map_name VARCHAR(120) UNIQUE NOT NULL,
  image_url TEXT NOT NULL,
  title VARCHAR(180) NOT NULL,
  description TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS arda_place (
  id SERIAL PRIMARY KEY,
  page_id INTEGER REFERENCES page(id),
  map_profile_id INTEGER REFERENCES arda_map_profile(id),
  slug VARCHAR(160) UNIQUE NOT NULL,
  name VARCHAR(180) NOT NULL,
  english_name VARCHAR(180),
  kind VARCHAR(80) NOT NULL DEFAULT 'place',
  default_point GEOMETRY(Point, 4326),
  spoiler_level INTEGER NOT NULL DEFAULT 0,
  summary TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS arda_place_alias (
  id SERIAL PRIMARY KEY,
  place_id INTEGER NOT NULL REFERENCES arda_place(id) ON DELETE CASCADE,
  alias VARCHAR(180) NOT NULL,
  language_code VARCHAR(24),
  era_id INTEGER REFERENCES arda_era(id)
);

CREATE TABLE IF NOT EXISTS arda_event (
  id SERIAL PRIMARY KEY,
  page_id INTEGER REFERENCES page(id),
  era_id INTEGER REFERENCES arda_era(id),
  slug VARCHAR(180) UNIQUE NOT NULL,
  title VARCHAR(220) NOT NULL,
  event_kind VARCHAR(80) NOT NULL DEFAULT 'journey',
  date_label VARCHAR(120),
  sequence_order INTEGER NOT NULL DEFAULT 0,
  spoiler_level INTEGER NOT NULL DEFAULT 0,
  summary TEXT NOT NULL,
  consequence TEXT
);

ALTER TABLE arda_event
  ADD COLUMN IF NOT EXISTS event_kind VARCHAR(80) NOT NULL DEFAULT 'journey';

CREATE TABLE IF NOT EXISTS arda_event_location (
  id SERIAL PRIMARY KEY,
  event_id INTEGER NOT NULL REFERENCES arda_event(id) ON DELETE CASCADE,
  place_id INTEGER REFERENCES arda_place(id),
  map_profile_id INTEGER REFERENCES arda_map_profile(id),
  point GEOMETRY(Point, 4326),
  location_order INTEGER NOT NULL DEFAULT 0,
  note TEXT
);

CREATE TABLE IF NOT EXISTS arda_character_relation (
  id SERIAL PRIMARY KEY,
  source_character_id INTEGER REFERENCES character(id),
  target_character_id INTEGER REFERENCES character(id),
  source_page_id INTEGER REFERENCES page(id),
  target_page_id INTEGER REFERENCES page(id),
  relation_type VARCHAR(80) NOT NULL,
  era_id INTEGER REFERENCES arda_era(id),
  spoiler_level INTEGER NOT NULL DEFAULT 0,
  description TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS arda_item_history (
  id SERIAL PRIMARY KEY,
  item_id INTEGER REFERENCES item(id),
  item_page_id INTEGER REFERENCES page(id),
  holder_page_id INTEGER REFERENCES page(id),
  place_id INTEGER REFERENCES arda_place(id),
  event_id INTEGER REFERENCES arda_event(id),
  era_id INTEGER REFERENCES arda_era(id),
  sequence_order INTEGER NOT NULL,
  date_label VARCHAR(120),
  note TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS arda_journey (
  id SERIAL PRIMARY KEY,
  slug VARCHAR(160) UNIQUE NOT NULL,
  title VARCHAR(220) NOT NULL,
  subtitle VARCHAR(220),
  description TEXT NOT NULL,
  spoiler_level INTEGER NOT NULL DEFAULT 0,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS arda_journey_step (
  id SERIAL PRIMARY KEY,
  journey_id INTEGER NOT NULL REFERENCES arda_journey(id) ON DELETE CASCADE,
  event_id INTEGER REFERENCES arda_event(id),
  place_id INTEGER REFERENCES arda_place(id),
  map_profile_id INTEGER REFERENCES arda_map_profile(id),
  step_order INTEGER NOT NULL,
  title VARCHAR(220) NOT NULL,
  point GEOMETRY(Point, 4326),
  summary TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS arda_content_block (
  id SERIAL PRIMARY KEY,
  page_id INTEGER NOT NULL REFERENCES page(id) ON DELETE CASCADE,
  block_type VARCHAR(80) NOT NULL DEFAULT 'body',
  title VARCHAR(220),
  body TEXT NOT NULL,
  source_scope VARCHAR(80) NOT NULL DEFAULT 'legendarium',
  spoiler_level INTEGER NOT NULL DEFAULT 0,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS arda_faction (
  id SERIAL PRIMARY KEY,
  page_id INTEGER REFERENCES page(id),
  slug VARCHAR(160) UNIQUE NOT NULL,
  name VARCHAR(180) NOT NULL,
  summary TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS arda_faction_influence (
  id SERIAL PRIMARY KEY,
  faction_id INTEGER NOT NULL REFERENCES arda_faction(id) ON DELETE CASCADE,
  map_profile_id INTEGER REFERENCES arda_map_profile(id),
  era_id INTEGER REFERENCES arda_era(id),
  influence_shape GEOMETRY(MultiPolygon, 4326),
  label VARCHAR(180),
  summary TEXT
);

CREATE TABLE IF NOT EXISTS arda_contribution (
  id SERIAL PRIMARY KEY,
  page_id INTEGER REFERENCES page(id),
  contribution_type VARCHAR(80) NOT NULL,
  status VARCHAR(40) NOT NULL DEFAULT 'pending',
  payload JSONB NOT NULL,
  reviewer_note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS arda_place_default_point_gix ON arda_place USING GIST (default_point);
CREATE INDEX IF NOT EXISTS arda_event_location_point_gix ON arda_event_location USING GIST (point);
CREATE INDEX IF NOT EXISTS arda_journey_step_point_gix ON arda_journey_step USING GIST (point);
CREATE INDEX IF NOT EXISTS arda_event_sequence_idx ON arda_event (era_id, sequence_order);
CREATE INDEX IF NOT EXISTS arda_content_block_page_idx ON arda_content_block (page_id, spoiler_level, sort_order);
CREATE INDEX IF NOT EXISTS arda_contribution_status_idx ON arda_contribution (status, created_at);
