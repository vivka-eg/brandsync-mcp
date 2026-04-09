import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const skillsDir = join(__dirname, "../pipeline-skills");

function readSkill(filename: string): string {
  return readFileSync(join(skillsDir, filename), "utf-8");
}

const SYSTEM_PROMPT = readSkill("CLAUDE-PROJECT-INSTRUCTIONS.md");
const SKILLS = {
  "1-design-brief":        readSkill("1-design-brief.md"),
  "2-user-persona":        readSkill("2-user-persona.md"),
  "3-user-flow":           readSkill("3-user-flow.md"),
  "4-lofi-screens":        readSkill("4-lofi-screens.md"),
  "6-figjam-board":        readSkill("6-figjam-board.md"),
  "pocket2-wireframe":     readSkill("pocket-2/4-wireframe.md"),
  "pocket2-component-spec": readSkill("pocket-2/5-component-spec.md"),
};

export function register(server: McpServer) {

  // ─── Pipeline prompt ────────────────────────────────────────────────────────
  // Loaded automatically by any Claude client that connects.
  // Replaces the need for a Claude Project system prompt.

  server.registerPrompt(
    "design-pipeline",
    {
      title: "BrandSync Design Pipeline",
      description: "Full EG BrandSync design pipeline — transforms Jira tickets into FigJam boards, Figma designs, and production code across three pockets.",
    },
    () => ({
      messages: [{
        role: "user",
        content: { type: "text", text: SYSTEM_PROMPT }
      }]
    })
  );

  // ─── Skill resources ────────────────────────────────────────────────────────
  // Skills are available as MCP resources so the agent can read them on demand.
  // Replaces the need for Claude Project knowledge file uploads.

  for (const [name, content] of Object.entries(SKILLS)) {
    const uri = `skill://${name}`;
    server.registerResource(
      uri,
      uri,
      { description: `BrandSync pipeline skill: ${name}`, mimeType: "text/markdown" },
      () => ({
        contents: [{ uri, text: content, mimeType: "text/markdown" }]
      })
    );
  }
}
