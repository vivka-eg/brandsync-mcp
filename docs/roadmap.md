# BrandSync MCP — Roadmap

**Date:** 2026-04-13  
**Status:** Living document

---

## Where we are now

BrandSync MCP runs locally. One user, one machine, stdio transport.
Core pipeline (Pocket 3) works end-to-end. Basic corpus learning via git push works.
Instrumentation (retrieved_node_ids) is wired but has no DB destination yet.

---

## Phase 1 — Stable Local (done)

| | |
|---|---|
| MCP server in TypeScript | ✅ |
| 7 graph query tools | ✅ |
| Pocket 3 full pipeline | ✅ |
| Corpus learning → graph rebuild → git push | ✅ |
| Handoff storage fixed (homedir) | ✅ |
| retrieved_node_ids threaded through pipeline | ✅ |
| brandsync-brain cleaned (corpus + graph.json only) | ✅ |
| Structured write_corpus_entry (no prose) | ✅ |
| query_graph in retrieval path | ✅ |

---

## Phase 2 — Supabase Foundation

**Goal:** Single source of truth. Strapi out of runtime. Ready to host.

### 2a — DB abstraction layer
- `src/db/index.ts` — `BrainDB` interface
- `src/db/supabase.ts` — Supabase implementation
- `src/db/aws.ts` — stub (for future migration)
- Env var `DB_PROVIDER` switches implementation

### 2b — Schema
```sql
corpus_entries        -- components, patterns, tokens, learnings
graph_snapshots       -- graph.json as JSONB, per org_id
api_tokens            -- token → org_id mapping
generation_outcomes   -- feedback loop (wired but not yet read)
```

### 2c — Seed script
- One-time: reads `brandsync-brain/corpus/` → INSERTs into `corpus_entries`
- Admin re-runs when Strapi design system updates
- `npx brandsync-mcp seed --supabase-url=... --supabase-key=...`

### 2d — Rewrite tools to read Supabase
- `graph.ts loadGraph()` → `db.getGraphSnapshot(orgId)`
- `get_component` → `db.getComponentBySlug(slug, orgId)`
- `get_tokens` → `db.getTokens(orgId)`
- `search_guidelines` → `db.searchCorpus(query, orgId)`
- `write_corpus_entry` → `db.insertCorpusEntry(entry)`
- `update_graph` → SELECT corpus → /tmp → graphify → UPDATE graph_snapshots

**Outcome:** Strapi creds removed from user config. BRAIN_ROOT gone. brandsync-brain repo archived.

---

## Phase 3 — Hosted Multi-User

**Goal:** Any developer at EG connects with URL + Bearer token. Zero local setup.

### 3a — HTTP transport
- `src/index.ts` — `MCP_PORT` env var switches stdio → `StreamableHTTPServerTransport`
- Bearer token middleware — resolves org_id from token
- Local dev still works via stdio (no MCP_PORT set)

### 3b — Per-BU isolation
- `org_id` column on all tables
- Supabase RLS: shared base (org_id = NULL) readable by all, BU learnings isolated
- Admin creates token per BU — one SQL INSERT

### 3c — Deploy
- Railway or Fly.io (auto-deploy from GitHub)
- Env vars: `SUPABASE_URL`, `SUPABASE_KEY`, `MCP_PORT`, `MCP_SECRET`, `STRAPI_*` (admin only)
- User config: URL + Bearer token only

### 3d — npm package (optional)
- `npm install -g brandsync-mcp` for users who want local fallback
- `npx brandsync-mcp init` — clones config, prints setup instructions

**Outcome:** Developer gets URL + token from admin, pastes 4 lines into claude config, done.

---

## Phase 4 — Learning Loop

**Goal:** System improves with use. Retrieval gets better over time without manual curation.

### 4a — Outcome recording (write_outcome tool)
- New MCP tool: `write_outcome`
- Called by approval check after every accept/reject
- INSERTs into `generation_outcomes` (pattern_ids, accepted, rejection_reason, org_id)
- retrieved_node_ids from handoff flows here automatically

### 4b — Retrieval re-ranking
- `query_graph` reads acceptance rates from `generation_outcomes`
- Re-ranks BFS/DFS candidates: `score = label_match × 0.6 + acceptance_rate × 0.4`
- New patterns default to 0.5 (neutral) until enough data
- **This is where the system starts actually learning**

### 4c — Graph evolution (nightly cron)
- Reads co-occurrence of pattern_ids in accepted outcomes
- Updates `confidence_score` on graph edges
- Rebuilds graph_snapshot
- Graph topology reflects real usage, not just graphify's initial extraction

### 4d — Pattern synthesis (weekly Claude API agent)
- `src/workers/pattern-synthesis.ts`
- Pulls accepted outcomes from Supabase
- Clusters by similarity using embeddings (pgvector in Supabase)
- For clusters of 5+ similar accepted UIs → calls Claude API directly
- Claude writes generalised pattern entry → pending review queue
- Admin approves → feeds next graph rebuild

**Outcome:** Graph improves automatically. Proven patterns float up. Bad patterns sink. New patterns discovered without manual curation.

---

## Phase 5 — AWS Migration

**Goal:** Move from Supabase to AWS for enterprise compliance and EG infrastructure alignment.

- Swap `src/db/supabase.ts` → `src/db/aws.ts` (RDS Postgres, same schema)
- Set `DB_PROVIDER=aws`
- Token auth → AWS Cognito or custom token table
- Cron → Lambda + EventBridge
- Pattern synthesis worker → Lambda
- Zero changes to MCP tools (all call `BrainDB` interface)

**Outcome:** One file changes. Everything else stays identical.

---

## Summary timeline

```
Phase 1 — Local stable         ✅ done
Phase 2 — Supabase foundation  next
Phase 3 — Hosted multi-user    after Phase 2
Phase 4 — Learning loop        after Phase 3
Phase 5 — AWS migration        when EG IT requires it
```

---

## Open decisions

| Decision | Options | Current thinking |
|---|---|---|
| Shared brain vs per-BU | Shared base + BU learning layer | Per-BU isolation with shared base |
| Pocket 1 Jira | External Jira MCP or build in | External for now |
| Framework detection | Claude call vs script | Replace with script (Phase 2) |
| Pattern synthesis auth | Anthropic API key server-side | Yes — never in user config |
| npm package | Yes / No | Optional, Phase 3 |
