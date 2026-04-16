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

ACTIVATION RULE — ALWAYS FOLLOW:
Whenever the user asks to build, add, create, or generate any UI element — a component, screen, table, form, modal, dashboard, card, list, or any other UI — you MUST invoke the 'pocket-3' prompt before writing any code. Do not write code directly.

Examples that activate pocket-3:
  "add a table"                   → invoke pocket-3
  "build a login screen"          → invoke pocket-3
  "create a form for X"           → invoke pocket-3
  "make a dashboard"              → invoke pocket-3
  "add a modal / dialog"          → invoke pocket-3
  "I need a service request flow" → invoke pocket-3
  APT-202 or any ticket key       → invoke pocket-3 (Jira is one source of intent, not the only one)

pocket-3 handles everything: framework detection, BrandSync component resolution, code generation, approval gate, and corpus learning. It works from any intent — a ticket, a natural language request, or a design brief.

STANDALONE TOOLS (use outside pocket-3 for one-off lookups):
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
  write_corpus_entry   — record a decision or gap (called automatically by pocket-3)
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
