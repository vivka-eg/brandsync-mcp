import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { searchCorpus } from "../db/index.js";

export function register(server: McpServer) {
  server.tool(
    "search_guidelines",
    "Searches Brandsync design system guidelines and patterns by keyword. Returns matching corpus entries.",
    {
      query: z
        .string()
        .describe(
          "Keyword or phrase to search for e.g. 'color contrast', 'spacing', 'layout'"
        ),
      maxResults: z
        .number()
        .int()
        .min(1)
        .max(40)
        .optional()
        .default(5)
        .describe("Maximum number of results to return (default 5, max 40)"),
    },
    async ({ query, maxResults }) => {
      const entries = await searchCorpus(query, ["pattern", "component"], maxResults ?? 5);

      if (!entries.length) {
        return {
          content: [
            {
              type: "text" as const,
              text: `No guidelines found matching "${query}".`,
            },
          ],
        };
      }

      const sections = entries.map(e => `### ${e.slug}\n\n${e.content}`);
      return {
        content: [{ type: "text" as const, text: sections.join("\n\n---\n\n") }],
      };
    }
  );
}
