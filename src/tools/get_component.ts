import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { findCorpusEntry } from "../db/index.js";

/** Normalize a user-supplied component name to a slug fragment, e.g. "Input Fields" → "input-fields" */
function toSlug(name: string): string {
  return name.toLowerCase().replace(/\s+/g, "-");
}

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
      const slug = toSlug(component);

      const entry = await findCorpusEntry(slug, "component");

      if (!entry) {
        return {
          content: [
            {
              type: "text" as const,
              text: `Component "${component}" not found in corpus. Use list_components to see available components.`,
            },
          ],
        };
      }

      // Also fetch the HTML examples for this component (if any)
      const htmlEntry = await findCorpusEntry(slug, "component_html");

      const parts: string[] = [entry.content];

      if (htmlEntry) {
        parts.push("\n\n## Code Examples\n\n```html\n" + htmlEntry.content + "\n```");
      }

      return {
        content: [{ type: "text" as const, text: parts.join("") }],
      };
    }
  );
}
