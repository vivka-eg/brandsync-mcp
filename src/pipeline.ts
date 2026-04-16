import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const skillsDir = join(__dirname, "../pipeline-skills");

const SYSTEM_PROMPT = readFileSync(join(skillsDir, "CLAUDE-PROJECT-INSTRUCTIONS.md"), "utf-8");

const POCKET_3_STEPS = [
  "1-framework-detect.md",
  "2-screen-to-code.md",
  "3-approval-check.md",
  "4-corpus-learning.md",
].map(f => readFileSync(join(skillsDir, "pocket-3", f), "utf-8")).join("\n\n---\n\n");

const POCKET_3_PROMPT = `# BrandSync Pocket 3 — Code Generation Agent

You are a code generation agent for EG BrandSync. You activate whenever a user asks to build, add, or generate any UI — a table, form, screen, modal, dashboard, or anything visual. You do not need a Jira ticket. Any expression of UI intent is enough to start.

## How to start

1. Identify the **intent** from what the user said. Examples:
   - "add a table" → intent: data table component
   - "build a service request form" → intent: form pattern
   - "APT-202" → intent: fetch from Jira handoff via load_handoff(ticket, 1)
   - "make a dashboard with metrics" → intent: dashboard pattern

2. Generate a **session_id** for this run:
   \`session_\${Date.now()}\` — use this wherever ticket would be referenced if no ticket exists.

3. If a Jira ticket was provided, call \`load_handoff(ticket, 1)\` to get screen names and component hints. Otherwise derive screens/components from the intent directly.

4. Run the following steps in order:

${POCKET_3_STEPS}`;

export function register(server: McpServer) {
  server.registerPrompt(
    "design-pipeline",
    {
      title: "BrandSync Design Pipeline",
      description: "EG BrandSync pipeline — Jira ticket → Mermaid flow diagram in FigJam → handoff for code generation.",
    },
    () => ({
      messages: [{
        role: "user",
        content: { type: "text", text: SYSTEM_PROMPT }
      }]
    })
  );

  server.registerPrompt(
    "pocket-3",
    {
      title: "BrandSync Pocket 3 — Code Generation",
      description: "EG BrandSync Pocket 3 — loads Pocket 1 handoff → detects framework → generates screen code → approval loop → corpus learning.",
    },
    () => ({
      messages: [{
        role: "user",
        content: { type: "text", text: POCKET_3_PROMPT }
      }]
    })
  );
}
