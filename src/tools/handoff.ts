import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { writeFileSync, readFileSync, mkdirSync, existsSync } from "fs";
import { join } from "path";
import { tmpdir } from "os";

const HANDOFF_DIR = join(tmpdir(), "brandsync-handoff");
const GAP_THRESHOLD = 3;

type HandoffStatus =
  | "pending"
  | "flow_approved"
  | "code_pending"
  | "accepted"
  | "rejected"
  | "gap_detected";

type CodeAttempt = {
  attempt: number;
  saved_at: string;
  files?: Array<{ name: string; content: string }>;
  feedback?: "accepted" | "rejected";
  feedback_note?: string;
};

type HandoffFile = {
  ticket: string;
  status: HandoffStatus;
  created_at: string;
  updated_at: string;
  framework?: string;
  pocket1?: Record<string, unknown>;
  pocket3?: {
    attempt_count: number;
    attempts: CodeAttempt[];
  };
  gap_summary?: string;
  corpus_entry_written: boolean;
};

function ensureDir() {
  mkdirSync(HANDOFF_DIR, { recursive: true });
}

function ticketPath(ticket: string): string {
  return join(HANDOFF_DIR, `${ticket.toUpperCase()}.json`);
}

function loadFile(ticket: string): HandoffFile | null {
  const path = ticketPath(ticket);
  if (!existsSync(path)) return null;
  return JSON.parse(readFileSync(path, "utf-8")) as HandoffFile;
}

function saveFile(data: HandoffFile): void {
  ensureDir();
  writeFileSync(ticketPath(data.ticket), JSON.stringify(data, null, 2), "utf-8");
}

export function register(server: McpServer) {
  server.registerTool(
    "save_handoff",
    {
      description:
        "Save pipeline state after completing a pocket so the next pocket can resume without re-fetching. " +
        "Pocket 1 saves the approved FigJam flow output. " +
        "Pocket 3 records a code attempt with optional user feedback (accepted/rejected). " +
        "Automatically sets status=gap_detected after 3+ rejections — a signal to add a new pattern.",
      inputSchema: {
        ticket: z.string().describe("Jira ticket key e.g. 'APT-202'"),
        pocket: z
          .number()
          .int()
          .min(1)
          .max(3)
          .describe("Pocket being completed: 1 (FigJam flow) or 3 (code attempt). Pocket 2 is skipped."),
        data: z.record(z.unknown()).describe(
          "Pocket 1: { figjam_file_key, screens, component_names, open_questions }. " +
          "Pocket 3: { framework?, files?, feedback?, feedback_note?, gap_summary? }. " +
          "feedback = 'accepted' | 'rejected'. " +
          "files = [{ name, content }] for generated code files."
        ),
      },
    },
    async ({ ticket, pocket, data }) => {
      const key = ticket.toUpperCase();
      const now = new Date().toISOString();

      let hf = loadFile(key);
      if (!hf) {
        hf = {
          ticket: key,
          status: "pending",
          created_at: now,
          updated_at: now,
          corpus_entry_written: false,
        };
      }
      hf.updated_at = now;

      if (pocket === 2) {
        return {
          isError: true,
          content: [{ type: "text" as const, text: "Pocket 2 is skipped in this pipeline. Go directly from Pocket 1 to Pocket 3." }],
        };
      }

      if (pocket === 1) {
        hf.pocket1 = { saved_at: now, ...data };
        hf.status = "flow_approved";
        saveFile(hf);
        return {
          content: [{ type: "text" as const, text: `Pocket 1 handoff saved for ${key}. Status: flow_approved. Ready for Pocket 3 — code generation.` }],
        };
      }

      // pocket === 3
      if (!hf.pocket3) {
        hf.pocket3 = { attempt_count: 0, attempts: [] };
      }

      if (data.framework) hf.framework = data.framework as string;

      const feedback = data.feedback as "accepted" | "rejected" | undefined;
      const attemptNum = hf.pocket3.attempt_count + 1;

      hf.pocket3.attempts.push({
        attempt: attemptNum,
        saved_at: now,
        files: data.files as CodeAttempt["files"],
        feedback,
        feedback_note: data.feedback_note as string | undefined,
      });
      hf.pocket3.attempt_count = attemptNum;

      if (feedback === "accepted") {
        hf.status = "accepted";
      } else if (feedback === "rejected") {
        hf.status = hf.pocket3.attempt_count >= GAP_THRESHOLD ? "gap_detected" : "rejected";
        if (data.gap_summary) hf.gap_summary = data.gap_summary as string;
      } else {
        hf.status = "code_pending";
      }

      saveFile(hf);

      let msg = `Pocket 3 attempt ${attemptNum} saved for ${key}. Status: ${hf.status}.`;

      if (hf.status === "gap_detected") {
        msg +=
          `\n\n⚠️  GAP DETECTED after ${hf.pocket3.attempt_count} rejections.\n` +
          `The required UI pattern does not exist in the corpus.\n` +
          `Next step: call write_corpus_entry("${key}", "gap", { summary, screens, components_tried, suggested_pattern_name }) ` +
          `to record this gap, then create Patterns/<name>/meta.json to add the missing pattern.`;
      } else if (hf.status === "accepted") {
        msg +=
          `\n\n✅ Accepted!\n` +
          `Next step: call write_corpus_entry("${key}", "decision", { summary, screens, framework }) ` +
          `to record this solution in the corpus for future runs.`;
      } else if (hf.status === "rejected") {
        const remaining = GAP_THRESHOLD - hf.pocket3.attempt_count;
        msg += `\n\nAttempt ${attemptNum}/${GAP_THRESHOLD} — ${remaining} rejection(s) before gap detection triggers.`;
      }

      return { content: [{ type: "text" as const, text: msg }] };
    }
  );

  server.registerTool(
    "load_handoff",
    {
      description:
        "Load the pipeline handoff saved by a previous pocket. " +
        "Call at the start of Pocket 3 with pocket=1 to get the approved FigJam output. " +
        "Call with pocket=3 to get the full attempt history (status, framework, all attempts).",
      inputSchema: {
        ticket: z.string().describe("Jira ticket key e.g. 'APT-202'"),
        pocket: z
          .number()
          .int()
          .min(1)
          .max(3)
          .describe("1 = load FigJam handoff from Pocket 1, 3 = load full attempt history"),
      },
    },
    async ({ ticket, pocket }) => {
      const key = ticket.toUpperCase();
      const hf = loadFile(key);

      if (!hf) {
        return {
          isError: true,
          content: [{ type: "text" as const, text: `No handoff found for ${key}. Complete Pocket 1 first.` }],
        };
      }

      if (pocket === 2) {
        return {
          isError: true,
          content: [{ type: "text" as const, text: "Pocket 2 is skipped. Load pocket=1 (FigJam output) instead." }],
        };
      }

      if (pocket === 1) {
        if (!hf.pocket1) {
          return {
            isError: true,
            content: [{ type: "text" as const, text: `No Pocket 1 handoff for ${key}. Complete Pocket 1 (FigJam flow) first.` }],
          };
        }
        return { content: [{ type: "text" as const, text: JSON.stringify(hf.pocket1, null, 2) }] };
      }

      // pocket === 3 — return full state minus large file contents to keep response concise
      const summary: Record<string, unknown> = {
        ticket: hf.ticket,
        status: hf.status,
        framework: hf.framework,
        attempt_count: hf.pocket3?.attempt_count ?? 0,
        corpus_entry_written: hf.corpus_entry_written,
        gap_summary: hf.gap_summary,
        attempts: (hf.pocket3?.attempts ?? []).map(a => ({
          attempt: a.attempt,
          saved_at: a.saved_at,
          feedback: a.feedback,
          feedback_note: a.feedback_note,
          files: a.files?.map(f => f.name),
        })),
      };
      return { content: [{ type: "text" as const, text: JSON.stringify(summary, null, 2) }] };
    }
  );
}
