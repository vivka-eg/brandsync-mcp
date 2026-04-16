import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { execSync } from "child_process";
import { existsSync } from "fs";
import { join } from "path";

const REPO_ROOT  = process.cwd();
const BRAIN_ROOT = process.env.BRAIN_ROOT ?? REPO_ROOT;
const CORPUS_DIR = join(BRAIN_ROOT, "corpus");

function resolveGraphify(): string {
  try {
    return execSync("which graphify", { encoding: "utf-8" }).trim();
  } catch {
    // fallback common locations
    for (const p of ["/opt/homebrew/bin/graphify", "/usr/local/bin/graphify"]) {
      if (existsSync(p)) return p;
    }
    throw new Error("graphify not found. Run: pip install graphifyy");
  }
}

export function register(server: McpServer) {
  server.registerTool(
    "update_graph",
    {
      description:
        "Rebuild the BrandSync knowledge graph from the current corpus files. " +
        "Call this at the end of every Corpus Learning step (Step 4) after writing new patterns, gaps, variants, or token drift entries. " +
        "Runs graphify --update on corpus/ (incremental, no Strapi pull) then patches node sizes. " +
        "Returns a summary of what changed in the graph.",
      inputSchema: {},
    },
    async () => {
      if (!existsSync(CORPUS_DIR)) {
        return {
          content: [{
            type: "text" as const,
            text: `Error: corpus/ not found at ${BRAIN_ROOT}. Set BRAIN_ROOT env var to the brandsync-brain path.`,
          }],
        };
      }

      const env = { ...process.env, BRAIN_ROOT };
      const lines: string[] = [];

      try {
        // Step 1 — inject new corpus decisions/gaps into the graph feedback loop
        // graphify save-result registers learning so future queries surface it
        const graphifyBin = resolveGraphify();
        const corpusDecisionsDir = join(CORPUS_DIR, "decisions");
        const corpusGapsDir = join(CORPUS_DIR, "gaps");
        const { readdirSync, readFileSync: rfs, existsSync: exs } = await import("fs");
        const saved: string[] = [];

        for (const dir of [corpusDecisionsDir, corpusGapsDir]) {
          if (!exs(dir)) continue;
          const type = dir.endsWith("gaps") ? "gap" : "decision";
          for (const file of readdirSync(dir).filter((f: string) => f.endsWith(".md"))) {
            const content = rfs(join(dir, file), "utf-8");
            const firstLine = content.split("\n").find((l: string) => l.trim()) ?? file;
            const memDir = join(BRAIN_ROOT, "graphify-out", "memory");
            execSync(
              `"${graphifyBin}" save-result --question "corpus ${type}: ${file}" --answer ${JSON.stringify(content.slice(0, 800))} --type query --memory-dir ${JSON.stringify(memDir)}`,
              { cwd: BRAIN_ROOT, env, encoding: "utf-8", timeout: 30_000 }
            );
            saved.push(`  • ${type}/${file} — ${firstLine.replace(/^#+\s*/, "").slice(0, 60)}`);
          }
        }
        lines.push(`Injected ${saved.length} corpus entries into graph memory:\n${saved.join("\n")}`);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        return {
          content: [{
            type: "text" as const,
            text: `graph memory injection failed:\n${msg}`,
          }],
        };
      }

      try {
        // Step 2 — patch node sizes (reads/writes BRAIN_ROOT/graphify-out/graph.html)
        const patchOut = execSync(
          "npm run patch:graph --silent",
          { cwd: REPO_ROOT, env, encoding: "utf-8", timeout: 30_000 }
        );
        const patchSummary = patchOut
          .split("\n")
          .filter(l => l.includes("nodes") || l.includes("updated") || l.includes("sizing"))
          .join("\n")
          .trim();
        if (patchSummary) lines.push(patchSummary);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        return {
          content: [{
            type: "text" as const,
            text: `patch:graph failed:\n${msg}\n\nGraph was updated but node sizes were not patched.`,
          }],
        };
      }

      try {
        // Step 3 — auto-commit and push to brandsync-brain
        execSync("git add -A", { cwd: BRAIN_ROOT, encoding: "utf-8" });

        // Only commit if there are staged changes
        const diff = execSync("git diff --cached --name-only", { cwd: BRAIN_ROOT, encoding: "utf-8" }).trim();
        if (diff) {
          const date = new Date().toISOString().slice(0, 10);
          const changed = diff.split("\n").slice(0, 3).join(", ") + (diff.split("\n").length > 3 ? "…" : "");
          execSync(
            `git commit -m "corpus: auto-learning ${date} — ${changed}"`,
            { cwd: BRAIN_ROOT, encoding: "utf-8" }
          );
          execSync("git push", { cwd: BRAIN_ROOT, encoding: "utf-8", timeout: 30_000 });
          lines.push(`pushed to brandsync-brain (${diff.split("\n").length} file(s) updated)`);
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        lines.push(`⚠️  git push failed: ${msg}`);
        // Non-fatal — graph is still updated locally
      }

      lines.push("✅ Graph updated — corpus indexed and node sizes patched.");
      return {
        content: [{ type: "text" as const, text: lines.join("\n") }],
      };
    }
  );
}
