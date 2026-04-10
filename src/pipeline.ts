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
  // Pocket 1 — Claude Desktop
  "1-design-brief":              readSkill("1-design-brief.md"),
  "2-user-persona":              readSkill("2-user-persona.md"),
  "3-user-flow":                 readSkill("3-user-flow.md"),
  "4-lofi-screens":              readSkill("4-lofi-screens.md"),
  "6-figjam-board":              readSkill("6-figjam-board.md"),
  // Pocket 3 — Claude Code
  "pocket3-framework-detect":    readSkill("pocket-3/1-framework-detect.md"),
  "pocket3-screen-to-code":      readSkill("pocket-3/2-screen-to-code.md"),
  "pocket3-approval-check":      readSkill("pocket-3/3-approval-check.md"),
};

export function register(server: McpServer) {

  // ─── Pipeline prompt ────────────────────────────────────────────────────────
  // Loaded automatically by any Claude client that connects.
  // Replaces the need for a Claude Project system prompt.

  server.registerPrompt(
    "design-pipeline",
    {
      title: "BrandSync Design Pipeline",
      description: "Full EG BrandSync design pipeline — Pocket 1 (Claude Desktop): Jira → FigJam flow. Pocket 3 (Claude Code): FigJam → production code with BrandSync tokens.",
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
