import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { strapiBase, strapiToken, type StrapiComponent } from "../strapi.js";
import { formatComponent } from "../formatter.js";

export function register(server: McpServer) {
  server.registerTool(
    "get_component",
    {
      description:
        "Returns everything needed to implement a Brandsync design system component — spec, usage rules, guidelines, accessibility, and design tokens — in a single call.",
      inputSchema: {
        component: z
          .string()
          .describe("Component name e.g. 'Buttons', 'Input Fields', 'Accordion'"),
      },
    },
    async ({ component }) => {
      // Step 1: find by name
      let listData: unknown;
      try {
        const params = new URLSearchParams({
          "filters[Title][$eqi]": component,
          "pagination[pageSize]": "1",
        });
        const url = `${strapiBase}/api/components?${params.toString()}`;
        const res = await fetch(url, {
          headers: { Authorization: `Bearer ${strapiToken}` },
        });
        if (!res.ok) throw new Error(`${res.status}: ${await res.text()}`);
        listData = await res.json();
      } catch (err) {
        return {
          isError: true,
          content: [{ type: "text", text: `Strapi request failed: ${err}` }],
        };
      }

      const items = (
        listData as { data?: { documentId: string; Title: string }[] }
      ).data ?? [];

      if (items.length === 0) {
        return {
          content: [
            {
              type: "text",
              text: `Component "${component}" not found. Use list_components to see available components.`,
            },
          ],
        };
      }

      const { documentId } = items[0];

      // Step 2: fetch full spec with deep populate
      let fullData: unknown;
      try {
        const deepParams = new URLSearchParams({
          "populate[Overview][populate][Anatomy][populate]": "*",
          "populate[Overview][populate][Type][populate]":    "*",
          "populate[Overview][populate][States][populate]":  "*",
          "populate[Specification]":                         "true",
          "populate[Usage][populate]":                       "*",
          "populate[Guidelines][populate]":                  "*",
          "populate[Accessiblity][populate]":                "*",
        });
        const res = await fetch(
          `${strapiBase}/api/components/${documentId}?${deepParams.toString()}`,
          { headers: { Authorization: `Bearer ${strapiToken}` } }
        );
        if (!res.ok) throw new Error(`${res.status}: ${await res.text()}`);
        fullData = await res.json();
      } catch (err) {
        return {
          isError: true,
          content: [{ type: "text", text: `Strapi fetch failed: ${err}` }],
        };
      }

      const item = (fullData as { data?: StrapiComponent }).data;
      if (!item) {
        return {
          content: [
            { type: "text", text: `Component "${component}" returned no data.` },
          ],
        };
      }

      const blocks = await formatComponent(item);
      return { content: blocks };
    }
  );
}
