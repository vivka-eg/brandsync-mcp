# BrandSync MCP — Architecture Overview

## What is this?

BrandSync MCP is a hosted Model Context Protocol server that gives AI agents (Claude Desktop, Claude Code, or any MCP client) live access to the EG design system. It enables a pipeline where a Jira ticket becomes a fully coded, on-brand UI screen — with the system learning from every accepted result.

---

## The Big Picture

```
Designer (Strapi CMS)
  → publishes components, tokens, patterns
  → build:corpus script runs
  → markdown files written to brandsync-brain/corpus/
  → graphify builds graph.json (knowledge graph)

Developer (Claude IDE)
  → connects MCP server with bearer token
  → runs pipeline: Jira ticket → FigJam flow → on-brand code
  → MCP tools read corpus + graph in real time
  → accepted results write back to corpus (learning loop)

BrandSync Website
  → user sees live pipeline status in /mcp/pipeline
  → token issued in /settings/generate-token
```

---

## Repositories

| Repo | What it owns |
|---|---|
| `brandsync-mcp` | MCP server, tools, pipeline prompts, skills |
| `brandsync-brain` | Corpus markdown files, graph.json, graphify memory |
| `eg-brandsync/frontend` | BrandSync website (Next.js) — landing zone, token UI |
| `eg-brandsync/backend` | Strapi CMS — designer-facing, source of component specs |

---

## Data Flow

### Build time (design system update)

```
Strapi (components, tokens, patterns)
  ↓  build:corpus (scripts/build-corpus.ts)
brandsync-brain/corpus/
  ├── components/   ← one .md per BrandSync component
  ├── patterns/     ← one .md per UI pattern (dashboard, form, etc.)
  ├── decisions/    ← learnings from accepted pipeline runs
  └── gaps/         ← missing patterns flagged during runs
  ↓  graphify
graphify-out/graph.json   ← knowledge graph (nodes + edges)
graphify-out/memory/      ← Q&A feedback loop entries
```

Strapi is only involved at build time. The MCP server never calls Strapi at runtime.

### Runtime (Claude session)

```
Claude connects → Authorization: Bearer <token>
  ↓
MCP server (brandsync-mcp)
  ↓ reads
brandsync-brain/corpus/    ← component specs, patterns
brandsync-brain/graph.json ← knowledge graph queries
  ↓ writes (learning loop)
corpus/decisions/  ← what worked
corpus/gaps/       ← what's missing
graphify-out/memory/ ← graph feedback entries
```

---

## MCP Server Structure (`src/`)

```
src/
  index.ts          ← server entry, registers all tools, stdio transport
  pipeline.ts       ← registers the 'pocket-3' MCP prompt
  db/index.ts       ← Vector DB client (future: AWS RDS / pgvector)
  tools/
    get_tokens.ts         ← fetch design tokens from corpus
    get_component.ts      ← fetch component spec by name
    list_components.ts    ← list all available components
    search_guidelines.ts  ← keyword search across corpus
    handoff.ts            ← save_handoff / load_handoff (pipeline state)
    feedback.ts           ← write_corpus_entry, get_attempt_history
    update_graph.ts       ← inject new corpus entries into graph memory
    graph.ts              ← query_graph, get_node, get_neighbors,
                             get_community, god_nodes, graph_stats,
                             shortest_path
```

---

## The Pipeline (3 Pockets)

The pipeline turns a Jira ticket into coded screens. It runs inside Claude — the MCP tools are the machine's hands.

```
Pocket 1 — Design Brief
  load ticket → generate Mermaid user flow → write to FigJam → save_handoff

Pocket 2 — (skipped in current config)

Pocket 3 — Screen to Code
  Step 1: framework-detect  → identify Angular/React/Vue, install bransync-tokens
  Step 2: screen-to-code    → query_graph → get_component → generate files
  Step 3: approval-check    → show output to user → yes/no
  Step 4: corpus-learning   → write_corpus_entry → update_graph → save_handoff
```

Pipeline skills live in `pipeline-skills/pocket-3/` as markdown files. They are loaded at server start and registered as a single MCP prompt named `pocket-3`.

### Handoff state machine

```
pending → running (pocket starts)
running → needs-you (Step 3: approval gate)
needs-you → running (user accepts/rejects)
running → done (Step 4 complete, accepted)
running → blocked (tool error / timeout)
blocked → running (retry)
needs-you → gap_detected (3+ rejections on same ticket)
```

---

## Corpus & Learning Loop

The corpus is the system's long-term memory. It grows with every accepted pipeline run.

```
write_corpus_entry(type="decision")
  → corpus/decisions/{ticket}.md
  → what worked, which components, which framework

write_corpus_entry(type="gap")
  → corpus/gaps/{ticket}.md
  → what was missing, what was improvised

update_graph()
  → injects new entries into graphify-out/memory/
  → future query_graph calls surface these patterns
```

### Known issue: overwrite bug

`write_corpus_entry` currently overwrites `{ticket}.md` on each call. Multiple decisions per ticket lose all but the last. Fix: append entries instead of upsert by filename.

---

## Multi-BU Pattern Inheritance (planned)

Each business unit maintains its own corpus layer on top of the global baseline:

```
corpus/
  global/
    patterns/form.md         ← applies to all BUs
    patterns/dashboard.md
  bu/
    construction/
      patterns/dashboard.md  ← overrides global for this BU
      decisions/             ← construction-specific learnings
    healthcare/
      patterns/dashboard.md
      decisions/
```

Resolution order: BU corpus → global corpus → fallback to improvise.

Promotion: BU-level decisions are manually reviewed before being merged into global. No auto-promotion.

---

## Token Identity & Multi-tenancy

```
User logs in via Keycloak (BrandSync website)
  → /auth/token issues bearer token (bs_live_...)
  → shown once in /settings/generate-token
  → user adds to Claude MCP config

Claude connects to MCP server
  → Authorization: Bearer bs_live_abc123
  → MCP middleware: sha256(token) → tenant_id
  → tenant_id tags all tool calls, corpus writes, pipeline runs
```

Every corpus entry, pipeline run, and handoff is scoped to a tenant. Different orgs never see each other's data.

---

## Landing Zone (`/mcp/pipeline`) — planned

The landing zone is a page on the BrandSync website that shows live pipeline status for the authenticated user's token.

```
NEEDS YOU          RUNNING              QUEUED        DONE
────────           ───────              ──────        ────
APT-202            APT-205              APT-208       APT-201 ✓
Approval           screen-to-code                     APT-198 ✓
6 files ready      P3 · Step 2
[Review]
```

**How it works:**
- MCP server wraps every tool call with `withTracking()` middleware
- On each tool call: upsert a row in `pipeline_runs` (tenant_id, ticket, pocket, step, status, log)
- Landing zone polls `/api/pipeline-runs/me` every 5s
- Rows grouped by status → rendered as swimlanes

---

## Storage (current → planned)

| Data | Current | Planned |
|---|---|---|
| Corpus (components, patterns) | Markdown files in brandsync-brain | Vector DB |
| Knowledge graph | graph.json + graphify BFS/DFS | Vector embeddings + similarity search |
| Graph snapshots | Supabase (`graph_snapshots` table) | Vector DB |
| Corpus entries | Supabase (`corpus_entries` table) | Vector DB |
| Pipeline runs | Not yet implemented | AWS Postgres (RDS) |
| Tenants | Not yet implemented | AWS Postgres (RDS) |

Moving corpus to a vector DB replaces `query_graph` BFS traversal with semantic similarity search — `get_component("bs-table")` becomes an embedding lookup rather than a graph walk.

---

## Database Design

### DB 1 — Vector DB (corpus + knowledge graph)

Stores all design system knowledge as embeddings. Every corpus entry — component spec, pattern, decision, gap — is embedded and queryable by semantic similarity.

**Collections / namespaces:**

```
components
  id, slug, org_id, bu
  content        ← full markdown spec
  embedding      ← vector of content
  metadata: { title, variants[], tokens[], classes[], framework, source: "strapi" }

patterns
  id, slug, org_id, bu
  content        ← full markdown spec
  embedding
  metadata: { name, category[], useCase, components[], tokens[], relatedPatterns[] }

decisions
  id, ticket, org_id, bu
  content        ← what worked
  embedding
  metadata: { framework, screens[], components[], date }

gaps
  id, ticket, org_id, bu
  content        ← what was missing
  embedding
  metadata: { suggestedPattern, componentsTried[], screens[], date }

graph_snapshots
  id, org_id, built_at
  graph          ← full graph.json blob (JSON)
  ← kept for visual rendering only; queries go to embeddings not this
```

**Query pattern:**

```
get_component("bs-table")
  → embed("bs-table")
  → similarity search in components collection
  → filter: org_id = tenant OR org_id = null (global)
  → return top 1 result
```

**BU isolation:**
- `org_id = null` → global baseline (applies to all BUs)
- `org_id = "eg:construction"` → construction-specific overrides
- Query always checks BU first, falls back to global

---

### DB 2 — AWS Postgres RDS (operational state)

Stores transactional pipeline state. Not suited for vector search — exact lookups, upserts, status tracking.

**`tenants` table**

```sql
id            uuid PRIMARY KEY
token_hash    text UNIQUE NOT NULL   -- sha256 of bearer token, never raw token
org_id        text NOT NULL          -- e.g. "eg-brandsync"
bu            text                   -- e.g. "construction", "healthcare", null = all
plan          text DEFAULT 'free'
created_at    timestamptz DEFAULT now()
```

**`pipeline_runs` table**

```sql
id            uuid PRIMARY KEY
tenant_id     uuid REFERENCES tenants(id)
org_id        text NOT NULL
bu            text
ticket        text NOT NULL          -- e.g. "APT-202"
pocket        int                    -- 1, 2, or 3
step          text                   -- "framework-detect" | "screen-to-code" |
                                     --   "approval-check" | "corpus-learning"
status        text NOT NULL          -- "pending" | "running" | "needs-you" |
                                     --   "blocked" | "done" | "gap_detected"
attempt       int DEFAULT 1          -- increments on rejection + retry
stuck_since   timestamptz            -- set when status becomes needs-you or blocked
log           jsonb DEFAULT '[]'     -- array of { ts, tool, result, note }
created_at    timestamptz DEFAULT now()
updated_at    timestamptz DEFAULT now()

INDEX (tenant_id)
INDEX (status)
INDEX (ticket, tenant_id)
```

**`handoffs` table**

```sql
id            uuid PRIMARY KEY
tenant_id     uuid REFERENCES tenants(id)
ticket        text NOT NULL
pocket        int NOT NULL
attempt       int NOT NULL DEFAULT 1
data          jsonb                  -- pocket 1: { figjam_file_key, screens, component_names }
                                     -- pocket 3: { framework, files[], feedback, gap_summary }
feedback      text                   -- "accepted" | "rejected" | null
created_at    timestamptz DEFAULT now()

UNIQUE (tenant_id, ticket, pocket, attempt)
```

**`corpus_writes` table** ← audit trail for decisions/gaps

```sql
id            uuid PRIMARY KEY
tenant_id     uuid REFERENCES tenants(id)
ticket        text NOT NULL
type          text NOT NULL          -- "decision" | "gap"
summary       text
vector_id     text                   -- ID of the vector DB entry created
created_at    timestamptz DEFAULT now()
```

---

### How the two DBs connect at runtime

```
MCP tool call arrives
  ↓
1. Resolve tenant: SELECT * FROM tenants WHERE token_hash = sha256(bearer)
   → get tenant_id, org_id, bu

2. Tool reads design system data:
   → Vector DB: similarity search filtered by org_id / bu

3. Tool writes pipeline state:
   → Postgres: UPSERT pipeline_runs SET step, status, log

4. On corpus learning (Step 4):
   → Vector DB: embed + upsert new decision/gap entry
   → Postgres: INSERT corpus_writes (audit trail)

5. Landing zone reads:
   → Postgres: SELECT pipeline_runs WHERE tenant_id = X ORDER BY updated_at
```

No cross-DB joins. Postgres handles "what is happening". Vector DB handles "what do we know".

---

## Environment Variables

```
BRAIN_ROOT            path to brandsync-brain repo (defaults to cwd)
SUPABASE_URL          Supabase project URL (current, to be replaced)
SUPABASE_SERVICE_KEY  Supabase service key (current, to be replaced)
STRAPI_BASE_URL       Strapi CMS base URL (build time only)
STRAPI_API_TOKEN      Strapi API token (build time only)
```

---

## Key Conventions

- MCP server uses **stdio transport** (not HTTP) — token capture for landing zone requires intercepting at the session layer
- All component class definitions (`.bs-btn`, `.bs-card`, etc.) must go in global `styles.scss` — `bransync-tokens` npm package only ships CSS custom properties (`--bs-*`)
- Angular: always use `[ngClass]` for dynamic modifier classes, never `[class]=` (it replaces the entire class attribute)
- Corpus writes go to `brandsync-brain/`, not inside `brandsync-mcp/`
- Strapi is never called at MCP runtime — corpus is the source of truth for agents
