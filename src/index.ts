import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

import * as getTokens        from "./tools/get_tokens.js";
import * as listComponents   from "./tools/list_components.js";
import * as getComponent     from "./tools/get_component.js";
import * as searchGuidelines from "./tools/search_guidelines.js";
import * as handoff          from "./tools/handoff.js";
import * as feedback         from "./tools/feedback.js";
import * as updateGraph      from "./tools/update_graph.js";
import * as graph            from "./tools/graph.js";
import * as pipeline         from "./pipeline.js";

// ─── Server ──────────────────────────────────────────────────────────────────

const server = new McpServer(
  { name: "brandsync-mcp", version: "0.1.0" },
  {
    instructions: `\
BrandSync MCP — EG design system tools.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ACTIVATION RULE — ALWAYS FOLLOW:
Whenever the user asks to build, add, create, or generate any UI element — a component, screen, table, form, modal, dashboard, card, list, or any other UI — run the Pocket 3 pipeline below before writing any code. Do not write code directly.

Examples that activate Pocket 3:
  "add a table"                   → run Pocket 3
  "build a login screen"          → run Pocket 3
  "create a form for X"           → run Pocket 3
  "make a dashboard"              → run Pocket 3
  "add a modal / dialog"          → run Pocket 3
  "I need a service request flow" → run Pocket 3
  APT-202 or any ticket key       → run Pocket 3

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
POCKET 3 PIPELINE — run these steps in order:

## Step 1 — Framework Detection & Token Setup

a) Read package.json in the target project (NOT BrandSync MCP). Check dependencies for: react/react-dom → React | vue → Vue | @angular/core → Angular | none → ask user.

b) Check if brandsync-tokens is in package.json. If not: run \`npm install brandsync-tokens\`, then import the CSS into the project entry point:
   - React: src/index.tsx → \`import 'brandsync-tokens/dist/css/tokens.css'\`
   - Vue: src/main.ts → same import
   - Angular: angular.json styles array → \`"node_modules/brandsync-tokens/dist/css/tokens.css"\`
   - HTML: <link> in <head>

Rules: Never hardcode hex values or pixel sizes. Use var(--bs-*) for all styling.

## Step 2 — Screen to Code

a) Resolve screens: if Jira ticket → load_handoff(ticket, 1). Otherwise derive from intent (e.g. "add a table" → one component file, "build a login screen" → Login + optional ForgotPassword). Use minimum screens needed.

b) Query the graph BEFORE writing any code:
   query_graph(question: "<intent in plain words>", mode: "bfs", depth: 3)
   Save returned node IDs immediately: save_handoff(session_id, 3, { retrieved_node_ids: [...], intent: "..." })
   If no nodes match, note as potential gap and continue.

c) Read the target project: package.json, scan src/, read 1-2 existing screen files to learn conventions (hooks, routing, styling approach, file naming).

d) For each component the graph identifies, call get_component(name) for exact token names, variants, CSS classes, states, and accessibility requirements. Never guess token names or class names.

e) Write files into the project following its conventions — same folder structure, same naming, same styling approach (CSS Modules / Tailwind / SCSS — match what exists). Implement all states: loading, empty, error, default. Check if routes, shared types, or sub-components are needed.

Rules: Query graph first always. Save retrieved_node_ids immediately. Read project before writing code. Never hardcode values.

## Step 3 — Approval Check

Show each generated file:
  ── src/components/DataTable.tsx ──
  <code>

Ask exactly one question: "Does this look good? Reply yes to accept, or no with notes."

On YES:
  1. load_handoff(session_id, 3) → read retrieved_node_ids
  2. save_handoff(session_id, 3, { framework, files, feedback: "accepted", retrieved_node_ids: [...] })
  3. write_corpus_entry(ticket: session_id, type: "decision", data: { intent, screens, framework, components, tokens, pattern_ids: retrieved_node_ids })
  4. Print: ✅ Done — recorded in corpus.
  5. Proceed to Step 4.

On NO:
  1. save_handoff(session_id, 3, { framework, files, feedback: "rejected", feedback_note: "<user note>", retrieved_node_ids: [...] })
  2. If response is gap_detected (attempt ≥ 3): write_corpus_entry(ticket: session_id, type: "gap", data: { intent, screens, components_tried, suggested_pattern_name, rejection_reasons })
  3. Proceed to Step 4.

Rules: Never auto-accept. Never skip write_corpus_entry on accept or gap_detected. Always include retrieved_node_ids in save_handoff.

## Step 4 — Corpus Learning (runs on every outcome)

Scan what was built and write generalizable knowledge:

- No matching corpus pattern → write corpus/patterns/<kebab-name>.md with: Use Case, Components Used, Design Tokens, Layout, States, Dark Mode, Related Patterns, Tags
- Component missing from BrandSync → write corpus/gaps/<kebab-name>.md with: What was needed, Intent, Temporary solution, Suggested BrandSync name, Priority
- BrandSync component extended beyond spec → append to corpus/components/<name>.md: ## Undocumented Variant section
- Token name mismatch → append to corpus/gaps/token-naming-drift.md

Print a learning summary, then call: update_graph()
This injects new corpus entries into the graph feedback loop so future query_graph calls surface them.

Rules: Only write generalizable knowledge, not instance-specific details (Step 3 handles those). Check corpus/patterns/ before writing a new pattern — never duplicate. Never invent token names.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STANDALONE TOOLS (use outside Pocket 3 for one-off lookups):
  get_tokens           — fetch design tokens
  get_component        — fetch component spec by name
  list_components      — list all available BrandSync components
  search_guidelines    — keyword search across design guidelines
  query_graph          — semantic graph traversal (BFS/DFS)
  get_node             — full detail for a single graph node
  get_neighbors        — neighbors of a node up to N hops
  get_community        — all nodes in a graph community
  god_nodes            — highest-degree (most connected) nodes
  graph_stats          — node/edge/community counts
  shortest_path        — shortest path between two concepts
  save_handoff         — save pipeline state between steps
  load_handoff         — load pipeline state
  write_corpus_entry   — record a decision or gap
  get_attempt_history  — check prior attempts for an intent
  update_graph         — rebuild knowledge graph after corpus learning

To run the full Jira-to-FigJam pipeline (Pocket 1), invoke the 'design-pipeline' prompt.\
`,
  },
);

// ─── Register tools ───────────────────────────────────────────────────────────

getTokens.register(server);
listComponents.register(server);
getComponent.register(server);
searchGuidelines.register(server);
handoff.register(server);
feedback.register(server);
updateGraph.register(server);
graph.register(server);

// ─── Register pipeline prompt + skill resources ───────────────────────────────

pipeline.register(server);

// ─── Start ───────────────────────────────────────────────────────────────────

const transport = new StdioServerTransport();
await server.connect(transport);
