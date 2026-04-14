-- BrandSync Brain — Supabase Schema
-- Safe to re-run — uses IF NOT EXISTS and DROP POLICY IF EXISTS

-- corpus_entries
CREATE TABLE IF NOT EXISTS corpus_entries (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug        text NOT NULL,
  type        text NOT NULL CHECK (type IN ('component', 'component_html', 'pattern', 'pattern_html', 'pattern_css', 'gap', 'token', 'graph')),
  path        text NOT NULL,
  content     text NOT NULL,
  org_id      uuid DEFAULT NULL,
  created_by  text DEFAULT 'seed',
  created_at  timestamptz DEFAULT now(),
  updated_at  timestamptz DEFAULT now(),
  UNIQUE(slug, type, org_id)
);

-- graph_snapshots
CREATE TABLE IF NOT EXISTS graph_snapshots (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id      uuid DEFAULT NULL,
  graph       jsonb NOT NULL,
  built_at    timestamptz DEFAULT now()
);

-- api_tokens
CREATE TABLE IF NOT EXISTS api_tokens (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  token       text UNIQUE NOT NULL,
  org_id      uuid DEFAULT NULL,
  org_name    text,
  created_for text,
  created_at  timestamptz DEFAULT now()
);

-- generation_outcomes
CREATE TABLE IF NOT EXISTS generation_outcomes (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id           uuid DEFAULT NULL,
  user_id          text,
  ticket_id        text,
  pattern_ids      text[],
  component_ids    text[],
  accepted         boolean,
  rejection_reason text,
  attempt_number   int DEFAULT 1,
  created_at       timestamptz DEFAULT now()
);

-- RLS
ALTER TABLE corpus_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE graph_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE generation_outcomes ENABLE ROW LEVEL SECURITY;

-- Policies — drop first so re-runs don't fail
DROP POLICY IF EXISTS service_full_access ON corpus_entries;
DROP POLICY IF EXISTS service_full_access ON graph_snapshots;
DROP POLICY IF EXISTS service_full_access ON generation_outcomes;

CREATE POLICY service_full_access ON corpus_entries
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY service_full_access ON graph_snapshots
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY service_full_access ON generation_outcomes
  FOR ALL USING (auth.role() = 'service_role');
