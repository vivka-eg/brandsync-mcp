import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { listCorpusByType } from "../db/index.js";

/** Extract a human-readable component name from a corpus slug.
 *  e.g. "corpus/components/input-fields.md" → "Input Fields"
 */
function nameFromSlug(slug: string): string {
  const file = slug.split("/").pop() ?? slug;
  const base = file.replace(/\.md$/, "");
  return base
    .split("-")
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export function register(server: McpServer) {
  server.registerTool(
    "list_components",
    { description: "Lists all available Brandsync design system components by name.", inputSchema: {} },
    async () => {
      const entries = await listCorpusByType("component");

      if (!entries.length) {
        return {
          content: [{ type: "text" as const, text: "No components found in corpus. Run seed-supabase to populate." }],
        };
      }

      const names = entries.map(e => nameFromSlug(e.slug)).sort();

      return {
        content: [
          {
            type: "text" as const,
            text:
              `${names.length} components available:\n\n` +
              names.map(n => `- ${n}`).join("\n") +
              `\n\nUse get_component("<name>") to get the full spec and tokens for any component.`,
          },
        ],
      };
    }
  );
}
