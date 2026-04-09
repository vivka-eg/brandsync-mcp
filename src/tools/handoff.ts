import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { writeFileSync, readFileSync, mkdirSync } from "fs";
import { join } from "path";
import { tmpdir } from "os";

const HANDOFF_DIR = join(tmpdir(), "brandsync-handoff");

function ensureDir() {
  mkdirSync(HANDOFF_DIR, { recursive: true });
}

export function register(server: McpServer) {
  server.registerTool(
    "save_handoff",
    {
      description:
        "Save pipeline state at the end of a pocket so the next pocket can resume without re-fetching. " +
        "Call at the end of Pocket 1 (saves FigJam output) and Pocket 2 (saves Figma frame output).",
      inputSchema: {
        ticket: z.string().describe("Jira ticket key e.g. 'APT-202'"),
        pocket: z.number().int().min(1).max(2).describe("Pocket number being completed (1 or 2)"),
        data: z.record(z.unknown()).describe(
          "Structured state to pass forward. " +
          "Pocket 1 example: { figjam_file_key, screens, component_names, open_questions }. " +
          "Pocket 2 example: { figma_file_key, frames: [{ name, node_id, components, tokens }] }"
        ),
      },
    },
    async ({ ticket, pocket, data }) => {
      ensureDir();
      const filename = `${ticket.toUpperCase()}-pocket${pocket}.json`;
      const path = join(HANDOFF_DIR, filename);
      const payload = {
        ticket: ticket.toUpperCase(),
        pocket,
        saved_at: new Date().toISOString(),
        ...data,
      };
      writeFileSync(path, JSON.stringify(payload, null, 2), "utf-8");
      return {
        content: [{ type: "text" as const, text: `Handoff saved: ${filename}` }],
      };
    }
  );

  server.registerTool(
    "load_handoff",
    {
      description:
        "Load the pipeline handoff written by the previous pocket. " +
        "Call at the start of Pocket 2 (load pocket=1) and Pocket 3 (load pocket=2).",
      inputSchema: {
        ticket: z.string().describe("Jira ticket key e.g. 'APT-202'"),
        pocket: z.number().int().min(1).max(2).describe("Which pocket's output to load (1 or 2)"),
      },
    },
    async ({ ticket, pocket }) => {
      const filename = `${ticket.toUpperCase()}-pocket${pocket}.json`;
      const path = join(HANDOFF_DIR, filename);
      let raw: string;
      try {
        raw = readFileSync(path, "utf-8");
      } catch {
        return {
          isError: true,
          content: [{
            type: "text" as const,
            text: `No handoff found for ${ticket.toUpperCase()} pocket ${pocket}. Complete Pocket ${pocket} first.`,
          }],
        };
      }
      return {
        content: [{ type: "text" as const, text: raw }],
      };
    }
  );
}
