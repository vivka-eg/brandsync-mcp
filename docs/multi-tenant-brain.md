# BrandSync Brain — Multi-Tenant Architecture

**Date:** 2026-04-11  
**Status:** Decision record — not yet implemented

---

## Problem

BrandSync MCP is moving from a single local instance (one developer, Claude Desktop) to a hosted server accessible to multiple users simultaneously. Each user generates UI, learns new patterns, and writes back to the shared knowledge base.

This creates two conflicts:

1. **Write conflict** — two users update the same corpus file at the same time, one overwrites the other
2. **Graph race** — two users trigger `update_graph` simultaneously, the second rebuild overwrites the first using a stale snapshot

---

## Key Insight: Corpus is an Append-Only Log

The root cause of both conflicts is treating corpus files as mutable records. If we change the corpus to an **append-only log of learnings**, conflicts become impossible — no two users ever touch the same file.

### Current (mutable, conflict-prone)

```
corpus/
  components/modal.md       ← User A updates this
                            ← User B updates this (overwrites A)
  patterns/form.md          ← same problem
```

### Proposed (append-only, conflict-free)

```
corpus/
  components/               ← base from Strapi ETL (read-only after import)
  patterns/                 ← base patterns (read-only after import)
  learnings/                ← all user contributions land here
    2026-04-11_vivka_modal-form.md
    2026-04-11_john_modal-confirm.md
    2026-04-11_sara_table-pagination.md
```

Every `write_corpus_entry` call creates a new uniquely-named file using `{date}_{user}_{slug}.md`. The base corpus is never modified after initial ETL. Zero conflicts by design.

This is the event sourcing pattern — **immutable events, derived state**.

---

## Storage: S3

`brandsync-brain` moves from a git repo to S3 for hosted multi-tenant use.

| Path | Contents |
|------|----------|
| `s3://brandsync-brain/corpus/components/` | Base component docs (from Strapi ETL) |
| `s3://brandsync-brain/corpus/patterns/` | Base patterns |
| `s3://brandsync-brain/corpus/learnings/` | User-contributed learnings (append-only) |
| `s3://brandsync-brain/graphify-out/graph.json` | Computed knowledge graph |

**S3 does not learn on its own.** It stays current because:
1. `write_corpus_entry` pushes new `.md` files to S3
2. `update_graph` pulls corpus from S3, runs `graphify --update`, pushes `graph.json` back

---

## Graph Rebuild: Async, Not Per-User

Rebuilding the graph synchronously inside `update_graph` per user call creates the race condition. Instead, decouple the write from the rebuild:

```
User writes pattern → PUT to S3 immediately (fast, always succeeds)
                           ↓
              Cron / S3 event (every 15 min)
                           ↓
              Pull all corpus from S3
                           ↓
              graphify --update (incremental, only new files)
                           ↓
              Push graph.json back to S3
```

graphify's `--update` + cache means it only processes new files each run — fast even at scale.

---

## Query: Local TTL Cache

`graph.ts` loads `graph.json` fresh on every call today (reads local disk). In hosted mode:

```
query_graph:
  if local graph.json is < 15 min old → use it
  else → download from S3, save locally, use it
```

This avoids an S3 read on every tool call while keeping the graph reasonably fresh.

---

## Code Changes Required

| File | Current | Change |
|------|---------|--------|
| `feedback.ts` (write_corpus_entry) | writes to `BRAIN_ROOT/corpus/` | PUT to `s3://brain/learnings/{ts}_{user}_{slug}.md` |
| `update_graph.ts` | sync run per user call | triggered by cron or S3 event; sync corpus down, run graphify, push graph.json up |
| `graph.ts` (loadGraph) | reads local file | checks local TTL → S3 download if stale |
| `src/index.ts` | StdioServerTransport | env-switched: `MCP_PORT` → StreamableHTTPServerTransport |

---

## Quality Control (Future)

When open to multiple orgs, raw user learnings should not immediately influence everyone's graph. A simple two-stage landing:

```
corpus/learnings/pending/    ← user writes land here first
corpus/learnings/approved/   ← reviewed, feeds the graph
```

A lightweight review step (even just one human approving files) prevents bad patterns from polluting shared knowledge. Not needed for a single trusted team.

---

## What Does Not Change

- **graphify itself** — still runs as a CLI called via `execSync`. No changes.
- **The graph query tools** — `query_graph`, `get_node`, etc. work the same; only `loadGraph()` gains an S3 fallback.
- **The pipeline flow** — Pocket 3 still calls `write_corpus_entry` then `update_graph`. The internals change, not the interface.
- **BRAIN_ROOT pattern** — becomes an S3 bucket URL instead of a local path, or a separate `BRAIN_S3_BUCKET` env var.

---

---

## Finding: Does BrandSync Brain Actually Learn?

**Date:** 2026-04-11

Short answer: **no — not in any meaningful sense.** It is a curated knowledge base with graph retrieval, not a learning system.

### What it actually does

The "learning" step is Claude writing a corpus entry. The system itself does nothing intelligent — it stores and indexes what Claude writes. If Claude writes a vague or wrong pattern, the brain gets dumber.

```
Human (Claude) writes corpus entry
    ↓
graphify extracts structure deterministically
    ↓
graph indexes it for BFS/DFS retrieval
    ↓
next query finds it
```

### What true learning requires

| Property | Knowledge Base (what it is) | Learning System (what it isn't) |
|---|---|---|
| Improves with use? | Only if Claude writes good entries | Improves automatically |
| Learns from rejections? | No | Weights adjust on rejection |
| Synthesises patterns? | No — human writes them | Inferred from outcomes |
| Edge weights update? | Never after extraction | After every outcome |
| Forgets bad patterns? | Never — append only | Downweights / prunes |

### What would make it actually learn

1. **Outcome tracking** — record which patterns led to accepted vs rejected UIs
2. **Edge weight feedback** — update `confidence_score` on graph edges based on real acceptance rates
3. **Rejection signal** — rejection reason ("wrong layout", "wrong token") feeds back into graph, not just a gap file
4. **Pattern synthesis** — a scheduled job reads 20 accepted UIs, clusters commonalities, auto-writes a generalisation

The graph infrastructure already supports this — `confidence_score` exists on every edge. It is a pipeline design gap, not an architecture problem.

---

## Finding: Relational DB as Feedback Layer

**Date:** 2026-04-11

Adding a relational DB does not replace the graph — it adds the outcome signal the graph currently lacks.

### The split

| Layer | What it holds | Technology |
|---|---|---|
| **Graph** | What is related to what — semantic structure, component relationships, pattern topology | graphify → graph.json |
| **Relational DB** | What worked in practice — outcomes, usage history, rejection reasons, confidence over time | Postgres / Supabase |

The graph answers "what is relevant to this prompt". The DB answers "of the relevant results, which ones actually worked".

### Minimum viable schema

```sql
CREATE TABLE generation_outcomes (
  id               uuid PRIMARY KEY,
  user_id          text,
  org_id           uuid,
  ticket_id        text,
  pattern_ids      text[],       -- which corpus nodes were retrieved
  component_ids    text[],       -- which components were used
  accepted         boolean,
  rejection_reason text,         -- 'wrong layout' | 'wrong token' | 'missing component'
  attempt_number   int,
  created_at       timestamptz
);
```

### How it feeds back into retrieval

```
score = label_match_score + (acceptance_rate × 0.4)
```

Patterns that consistently produce accepted UIs float to the top. Patterns that get rejected sink. This is the minimum change that makes the system actually improve with use.

### Graph rebuild with outcome data

```
update_graph (cron):
  1. Pull new corpus from Supabase
  2. graphify --update
  3. Update edge confidence_scores from DB acceptance rate averages
  4. Push graph.json back to Supabase
```

---

## Finding: Supabase Over S3 — Clear Winner for This Use Case

**Date:** 2026-04-11

After evaluating S3 + Postgres vs Supabase alone, Supabase is the right choice. Not because S3 is wrong in general — but because it adds a second system that solves no additional problem at this scale.

### Why S3 was on the table

S3 was proposed as the storage layer for corpus `.md` files and `graph.json`. It is cheap, durable, and scales. Valid choice in isolation.

### The constraint that doesn't go away

Regardless of where corpus is stored, **graphify reads `.md` files from disk**. So the flow always requires a sync step before graphify runs:

```
Storage → SELECT or s3 sync → /tmp/corpus/ → graphify --update → write graph back
```

With Postgres this sync is a `SELECT content FROM corpus_entries`. With S3 it is `aws s3 sync`. Postgres is actually simpler.

### Why Supabase is the clear winner for BrandSync specifically

| Requirement | S3 + Postgres | Supabase |
|---|---|---|
| Store corpus entries | S3 objects | `corpus_entries` table — same result |
| Store graph.json | S3 object | `graph_snapshots` JSONB column — same result |
| Store outcome data | Postgres | Postgres — identical |
| Per-org data isolation | S3 bucket policies + Postgres RLS — two systems | RLS alone — one policy |
| Auth for hosted MCP | DIY | Built in |
| Systems to operate | 2 | 1 |
| Cron trigger for rebuild | Lambda on S3 event | Supabase Edge Function or pg_cron |
| Real-time graph freshness | S3 polling | Supabase Realtime subscription |

**BrandSync has no large binary files, no CDN requirement, no media.** Every piece of data is either markdown text, JSON, or outcome records. S3's advantages (object storage at scale, CDN, presigned URLs) are irrelevant here.

### The per-org isolation point specifically

The multi-tenant problem — User A's learnings should not pollute User B's org — is solved in Supabase with one SQL policy:

```sql
CREATE POLICY org_isolation ON generation_outcomes
  USING (org_id = current_setting('app.org_id'));
```

With S3 + Postgres you'd need to configure S3 bucket policies AND Postgres RLS. Two systems, two configs, two failure surfaces.

### Schema in Supabase

```sql
-- Corpus files as rows (replaces S3 objects)
CREATE TABLE corpus_entries (
  id          uuid PRIMARY KEY,
  slug        text,
  type        text,        -- 'component' | 'pattern' | 'gap' | 'learning'
  content     text,        -- the markdown content
  org_id      uuid,
  created_by  text,
  created_at  timestamptz
);

-- Graph snapshot (replaces graph.json in S3)
CREATE TABLE graph_snapshots (
  id          uuid PRIMARY KEY,
  org_id      uuid,
  graph       jsonb,
  built_at    timestamptz
);

-- Outcome signal (net new — not possible with S3 alone)
CREATE TABLE generation_outcomes (
  id               uuid PRIMARY KEY,
  org_id           uuid,
  user_id          text,
  ticket_id        text,
  pattern_ids      text[],
  component_ids    text[],
  accepted         boolean,
  rejection_reason text,
  attempt_number   int,
  created_at       timestamptz
);
```

### Updated code changes

| File | Current | Change |
|---|---|---|
| `feedback.ts` | writes to local `BRAIN_ROOT/corpus/` | INSERT into `corpus_entries` |
| `update_graph.ts` | calls graphify locally | SELECT corpus → /tmp → graphify → UPDATE graph_snapshots |
| `graph.ts` (loadGraph) | reads local file | SELECT latest graph_snapshot, cache with TTL |
| `src/index.ts` | StdioServerTransport | env-switched: `MCP_PORT` → StreamableHTTPServerTransport |

---

## Remaining Open Questions

1. **Single shared brain or per-org?**
   - Shared: faster knowledge accumulation, risk of cross-org contamination
   - Per-org: isolated, safe, but each org starts from zero
   - Hybrid: shared read-only base + per-org write layer (correct long-term, more complex)

2. **Who triggers the cron rebuild?** Lambda on S3 event, GitHub Actions, or a background worker in the MCP server itself?

3. **Auth on the hosted MCP?** Bearer token check in the HTTP transport, or delegated to infra (Cloudflare Access, nginx)?

4. **Graph freshness SLA?** 15 min TTL is a guess — depends on how frequently teams generate and how much freshness matters for retrieval quality.
