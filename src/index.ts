import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

import * as getTokens       from "./tools/get_tokens.js";
import * as listComponents  from "./tools/list_components.js";
import * as getComponent    from "./tools/get_component.js";
import * as searchGuidelines from "./tools/search_guidelines.js";

// ─── Server ──────────────────────────────────────────────────────────────────

const server = new McpServer({
  name: "brandsync-mcp",
  version: "0.1.0",
});

// ─── Register tools ───────────────────────────────────────────────────────────

getTokens.register(server);
listComponents.register(server);
getComponent.register(server);
searchGuidelines.register(server);

// ─── Start ───────────────────────────────────────────────────────────────────

const transport = new StdioServerTransport();
await server.connect(transport);
