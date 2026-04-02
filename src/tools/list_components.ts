import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { strapiQuery } from "../strapi.js";

export function register(server: McpServer) {
  server.registerTool(
    "list_components",
    { description: "Lists all available Brandsync design system components by name." },
    async () => {
      let data: unknown;
      try {
        const params = new URLSearchParams({ "pagination[pageSize]": "100" });
        data = await strapiQuery("components", params);
      } catch (err) {
        return {
          isError: true,
          content: [{ type: "text", text: `Strapi request failed: ${err}` }],
        };
      }

      const items = (data as { data?: { Title: string }[] }).data ?? [];
      const names = items.map((i) => i.Title).sort();

      return {
        content: [
          {
            type: "text",
            text: `${names.length} components available:\n\n${names.map((n) => `- ${n}`).join("\n")}\n\nUse get_component("<name>") to get the full spec and tokens for any component.`,
          },
        ],
      };
    }
  );
}
