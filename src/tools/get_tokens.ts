import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { loadTokenCSS, parseTokens } from "../tokens.js";

export function register(server: McpServer) {
  server.tool(
    "get_tokens",
    "Returns live design tokens from the brandsync-tokens npm package. Optionally filter by category prefix (e.g. 'color', 'spacing', 'font').",
    {
      filter: z
        .string()
        .optional()
        .describe("Optional prefix to filter tokens e.g. 'color', 'spacing', 'font-size'"),
      format: z
        .enum(["flat", "grouped"])
        .optional()
        .default("flat")
        .describe("'flat' returns all tokens as key/value pairs. 'grouped' groups by category."),
    },
    async ({ filter, format }) => {
      const css = loadTokenCSS();
      let tokens = parseTokens(css);

      if (filter) {
        const prefix = `--bs-${filter}`;
        tokens = Object.fromEntries(
          Object.entries(tokens).filter(([k]) => k.startsWith(prefix))
        );
      }

      if (Object.keys(tokens).length === 0) {
        return {
          content: [
            {
              type: "text",
              text: `No tokens found${filter ? ` matching '--bs-${filter}'` : ""}.`,
            },
          ],
        };
      }

      if (format === "grouped") {
        const groups: Record<string, Record<string, string>> = {};
        for (const [k, v] of Object.entries(tokens)) {
          const seg = k.split("-")[2] ?? "other";
          groups[seg] ??= {};
          groups[seg][k] = v;
        }
        return {
          content: [{ type: "text", text: JSON.stringify(groups, null, 2) }],
        };
      }

      return {
        content: [{ type: "text", text: JSON.stringify(tokens, null, 2) }],
      };
    }
  );
}
