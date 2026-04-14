import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { writeFileSync, readFileSync, mkdirSync, existsSync } from "fs";
import { join } from "path";
import { homedir } from "os";
import { upsertCorpusEntry } from "../db/index.js";

const HANDOFF_DIR   = join(homedir(), ".brandsync", "handoff");
const BRAIN_ROOT    = process.env.BRAIN_ROOT ?? process.cwd();
const CORPUS_ROOT   = join(BRAIN_ROOT, "corpus");
const DECISIONS_DIR = join(CORPUS_ROOT, "decisions");
const GAPS_DIR      = join(CORPUS_ROOT, "gaps");

type HandoffFile = {
  ticket: string;
  status: string;
  updated_at: string;
  corpus_entry_written: boolean;
  framework?: string;
  pocket3?: {
    attempt_count: number;
    attempts: Array<{
      attempt: number;
      saved_at: string;
      feedback?: string;
      feedback_note?: string;
    }>;
  };
  gap_summary?: string;
};

function ticketPath(ticket: string): string {
  return join(HANDOFF_DIR, `${ticket.toUpperCase()}.json`);
}

function loadHandoffFile(ticket: string): HandoffFile | null {
  const path = ticketPath(ticket);
  if (!existsSync(path)) return null;
  return JSON.parse(readFileSync(path, "utf-8")) as HandoffFile;
}

function saveHandoffFile(data: HandoffFile): void {
  mkdirSync(HANDOFF_DIR, { recursive: true });
  writeFileSync(ticketPath(data.ticket), JSON.stringify(data, null, 2), "utf-8");
}

function lines(...parts: (string | string[])[]): string {
  return parts.flat().join("\n");
}

export function register(server: McpServer) {
  server.registerTool(
    "write_corpus_entry",
    {
      description:
        "Write a decision or gap entry to the corpus so future pipeline runs can learn from it. " +
        "'decision' — records what worked. Call after a Pocket 3 code attempt is accepted by the user. " +
        "'gap' — records a missing pattern. Call after gap_detected status is set (3+ rejections on one ticket).",
      inputSchema: {
        ticket: z.string().describe("Jira ticket key e.g. 'APT-202'"),
        type: z
          .enum(["decision", "gap"])
          .describe("'decision' for accepted solutions, 'gap' for missing patterns"),
        data: z.record(z.unknown()).describe(
          "decision: { summary, screens, framework, components?, tokens?, notes? }. " +
          "gap: { summary, screens, components_tried?, suggested_pattern_name? }"
        ),
      },
    },
    async ({ ticket, type, data }) => {
      const key = ticket.toUpperCase();
      const now = new Date().toISOString();
      const slug = key.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      const filename = `${slug}.md`;

      const arr = (val: unknown): string[] =>
        Array.isArray(val) ? val.map(String) : val ? [String(val)] : [];

      let md: string;

      const corpusType = type === "decision" ? "pattern" as const : "gap" as const;
      const corpusSlug = `corpus/${type === "decision" ? "decisions" : "gaps"}/${filename}`;

      if (type === "decision") {
        md = lines(
          `# Decision: ${key}`,
          ``,
          `**Type:** Accepted Solution`,
          `**Ticket:** ${key}`,
          `**Framework:** ${data.framework ?? "Not specified"}`,
          `**Date:** ${now}`,
          ``,
          `## Summary`,
          ``,
          String(data.summary ?? ""),
          ``,
          `## Screens`,
          ``,
          arr(data.screens).map(s => `- ${s}`),
          ``,
          ...(data.components
            ? [`## Components Used`, ``, ...arr(data.components).map(c => `- ${c}`), ``]
            : []),
          ...(data.tokens
            ? [`## Tokens Used`, ``, ...arr(data.tokens).map(t => `- \`${t}\``), ``]
            : []),
          ...(data.notes ? [`## Notes`, ``, String(data.notes), ``] : []),
        );
      } else {
        const suggested = data.suggested_pattern_name
          ? String(data.suggested_pattern_name)
          : key;
        md = lines(
          `# Gap: ${key}`,
          ``,
          `**Type:** Missing Pattern`,
          `**Ticket:** ${key}`,
          `**Date:** ${now}`,
          ``,
          `## Summary`,
          ``,
          String(data.summary ?? ""),
          ``,
          `## Screens That Triggered This Gap`,
          ``,
          arr(data.screens).map(s => `- ${s}`),
          ``,
          ...(data.components_tried
            ? [`## Components Tried`, ``, ...arr(data.components_tried).map(c => `- ${c}`), ``]
            : []),
          ...(data.suggested_pattern_name
            ? [`## Suggested New Pattern`, ``, String(data.suggested_pattern_name), ``]
            : []),
          `## Next Step`,
          ``,
          `Add this pattern to the corpus and run seed-supabase to include it in the knowledge base.`,
          ``,
        );
      }

      // 1. Write to Supabase
      const { error: dbError } = await upsertCorpusEntry({
        slug: corpusSlug,
        type: corpusType,
        path: corpusSlug,
        content: md,
        org_id: null,
        created_by: key.toLowerCase(),
      });

      // 2. Write to local disk (backup, only if BRAIN_ROOT is set)
      try {
        mkdirSync(type === "decision" ? DECISIONS_DIR : GAPS_DIR, { recursive: true });
        writeFileSync(join(type === "decision" ? DECISIONS_DIR : GAPS_DIR, filename), md, "utf-8");
      } catch {
        // Non-fatal — local disk write optional
      }

      // 3. Mark corpus_entry_written on the handoff file
      const hf = loadHandoffFile(key);
      if (hf) {
        hf.corpus_entry_written = true;
        hf.updated_at = now;
        saveHandoffFile(hf);
      }

      const dir = type === "decision" ? "corpus/decisions/" : "corpus/gaps/";
      const dbNote = dbError ? ` (Supabase error: ${dbError})` : "";
      return {
        content: [{ type: "text" as const, text: `Corpus entry written: ${dir}${filename}${dbNote}` }],
      };
    }
  );

  server.registerTool(
    "get_attempt_history",
    {
      description:
        "Get the full attempt history for a ticket — how many code attempts, feedback per attempt, current status, and whether a corpus entry was written. " +
        "Use before starting a new code attempt to understand what was tried and why it was rejected.",
      inputSchema: {
        ticket: z.string().describe("Jira ticket key e.g. 'APT-202'"),
      },
    },
    async ({ ticket }) => {
      const key = ticket.toUpperCase();
      const hf = loadHandoffFile(key);

      if (!hf) {
        return {
          content: [{
            type: "text" as const,
            text: `No history found for ${key}. This ticket has not been through the pipeline yet.`,
          }],
        };
      }

      const out = {
        ticket: hf.ticket,
        status: hf.status,
        framework: hf.framework,
        attempt_count: hf.pocket3?.attempt_count ?? 0,
        corpus_entry_written: hf.corpus_entry_written,
        gap_summary: hf.gap_summary ?? null,
        attempts: (hf.pocket3?.attempts ?? []).map(a => ({
          attempt: a.attempt,
          saved_at: a.saved_at,
          feedback: a.feedback ?? null,
          feedback_note: a.feedback_note ?? null,
        })),
      };

      return {
        content: [{ type: "text" as const, text: JSON.stringify(out, null, 2) }],
      };
    }
  );
}
