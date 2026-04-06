import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { strapiQuery } from "../strapi.js";

export function register(server: McpServer) {
  server.tool(
    "search_guidelines",
    "Searches Brandsync design system guidelines in Strapi by keyword. Returns matching foundation articles.",
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
      let data: unknown;
      try {
        const params = new URLSearchParams({
          "populate[0]":                        "Article",
          "populate[1]":                        "Article.Blocks",
          "populate[2]":                        "Article.Video",
          "pagination[pageSize]":               String(maxResults),
          "filters[Article][Title][$containsi]": query,
        });
        data = await strapiQuery("foundations", params);
      } catch (err) {
        return {
          isError: true,
          content: [{ type: "text", text: `Strapi request failed: ${err}` }],
        };
      }

      const items = (data as { data?: unknown[] }).data ?? [];
      if (items.length === 0) {
        return {
          content: [
            {
              type: "text",
              text: `No guidelines found matching "${query}" in Strapi.`,
            },
          ],
        };
      }

      return {
        content: [{ type: "text", text: JSON.stringify(items, null, 2) }],
      };
    }
  );
}
