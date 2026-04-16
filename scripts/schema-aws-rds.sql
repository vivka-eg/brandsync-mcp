-- BrandSync Brain — AWS RDS PostgreSQL Schema
-- Safe to re-run — uses IF NOT EXISTS / CREATE OR REPLACE
--
-- Differences from Supabase schema:
--   • No RLS (removed ALTER TABLE ... ENABLE ROW LEVEL SECURITY)
--   • No Supabase auth policies (auth.role() doesn't exist on RDS)
--   • Access control is handled at application level via api_tokens
--   • Added 'decision' to corpus_entries type CHECK (seed script uses it)
--   • Added indexes for common query patterns
--   • Added updated_at trigger on corpus_entries
--
-- Requires: PostgreSQL 13+ (gen_random_uuid() is built-in)
-- For PostgreSQL < 13, uncomment: CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ─── Tables ───────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS corpus_entries (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  slug        text        NOT NULL,
  type        text        NOT NULL CHECK (type IN (
                'component',
                'component_html',
                'pattern',
                'pattern_html',
                'pattern_css',
                'decision',
                'gap',
                'token',
                'graph'
              )),
  path        text        NOT NULL,
  content     text        NOT NULL,
  org_id      uuid        DEFAULT NULL,
  created_by  text        DEFAULT 'seed',
  created_at  timestamptz DEFAULT now(),
  updated_at  timestamptz DEFAULT now(),
  UNIQUE (slug, type, org_id)
);

CREATE TABLE IF NOT EXISTS graph_snapshots (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id      uuid        DEFAULT NULL,
  graph       jsonb       NOT NULL,
  built_at    timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS api_tokens (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  token       text        UNIQUE NOT NULL,
  org_id      uuid        DEFAULT NULL,
  org_name    text,
  created_for text,
  created_at  timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS generation_outcomes (
  id               uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id           uuid        DEFAULT NULL,
  user_id          text,
  ticket_id        text,
  pattern_ids      text[],
  component_ids    text[],
  accepted         boolean,
  rejection_reason text,
  attempt_number   int         DEFAULT 1,
  created_at       timestamptz DEFAULT now()
);

-- ─── Indexes ──────────────────────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_corpus_entries_slug        ON corpus_entries (slug);
CREATE INDEX IF NOT EXISTS idx_corpus_entries_type        ON corpus_entries (type);
CREATE INDEX IF NOT EXISTS idx_corpus_entries_org_id      ON corpus_entries (org_id);
CREATE INDEX IF NOT EXISTS idx_corpus_slug_type_org       ON corpus_entries (slug, type, org_id);

CREATE INDEX IF NOT EXISTS idx_graph_snapshots_org_id     ON graph_snapshots (org_id);
CREATE INDEX IF NOT EXISTS idx_graph_snapshots_built_at   ON graph_snapshots (built_at DESC);

CREATE INDEX IF NOT EXISTS idx_api_tokens_token           ON api_tokens (token);
CREATE INDEX IF NOT EXISTS idx_api_tokens_org_id          ON api_tokens (org_id);

CREATE INDEX IF NOT EXISTS idx_gen_outcomes_org_id        ON generation_outcomes (org_id);
CREATE INDEX IF NOT EXISTS idx_gen_outcomes_ticket_id     ON generation_outcomes (ticket_id);

-- ─── updated_at trigger ───────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION fn_update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_corpus_entries_updated_at ON corpus_entries;
CREATE TRIGGER trg_corpus_entries_updated_at
  BEFORE UPDATE ON corpus_entries
  FOR EACH ROW EXECUTE FUNCTION fn_update_updated_at();
