import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

import * as getTokens        from "./tools/get_tokens.js";
import * as listComponents   from "./tools/list_components.js";
import * as getComponent     from "./tools/get_component.js";
import * as searchGuidelines from "./tools/search_guidelines.js";
import * as handoff          from "./tools/handoff.js";
import * as feedback         from "./tools/feedback.js";
import * as pipeline         from "./pipeline.js";

// ─── Server ──────────────────────────────────────────────────────────────────

const server = new McpServer(
  { name: "brandsync-mcp", version: "0.1.0" },
  {
    instructions:
      "BrandSync MCP — EG design system tools. " +
      "Use get_tokens, get_component, list_components, search_guidelines for design system lookups. " +
      "Use get_jira_ticket and search_jira for Jira. " +
      "Use save_handoff / load_handoff to pass state between pipeline pockets. " +
      "Use write_corpus_entry to record accepted solutions (type=decision) and missing patterns (type=gap). " +
      "Use get_attempt_history to check how many times a ticket has been attempted and why it was rejected. " +
      "To run the full Jira-to-Figma pipeline, invoke the 'design-pipeline' prompt.",
  },
);

// ─── Register tools ───────────────────────────────────────────────────────────

getTokens.register(server);
listComponents.register(server);
getComponent.register(server);
searchGuidelines.register(server);
handoff.register(server);
feedback.register(server);

// ─── Register pipeline prompt + skill resources ───────────────────────────────

pipeline.register(server);

// ─── Start ───────────────────────────────────────────────────────────────────

const transport = new StdioServerTransport();
await server.connect(transport);
