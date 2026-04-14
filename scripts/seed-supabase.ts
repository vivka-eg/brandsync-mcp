/**
 * seed-supabase.ts
 *
 * Seeds all brandsync-brain corpus files and graph.json into Supabase.
 * Run once after creating the schema, or re-run to update.
 *
 * Usage:
 *   BRAIN_ROOT=/Users/vivka/brandsync-brain \
 *   SUPABASE_URL=https://xxx.supabase.co \
 *   SUPABASE_SERVICE_KEY=xxx \
 *   npx tsx scripts/seed-supabase.ts
 */

import { createClient } from "@supabase/supabase-js";
import { readFileSync, readdirSync, statSync, existsSync, writeFileSync } from "fs";
import { join, relative, extname, dirname, basename } from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));

const BRAIN_ROOT       = process.env.BRAIN_ROOT ?? "/Users/vivka/brandsync-brain";
const SUPABASE_URL     = process.env.SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY!;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_KEY");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// ─── File type detection ──────────────────────────────────────────────────────

function getType(filePath: string): string | null {
  const rel = relative(BRAIN_ROOT, filePath);
  const ext = extname(filePath);

  if (rel.startsWith("corpus/components/") && ext === ".md")   return "component";
  if (rel.startsWith("corpus/components/") && ext === ".html") return "component_html";
  if (rel.startsWith("corpus/patterns/")   && ext === ".md")   return "pattern";
  if (rel.startsWith("corpus/patterns/")   && ext === ".html") return "pattern_html";
  if (rel.startsWith("corpus/patterns/")   && ext === ".css")  return "pattern_css";
  if (rel.startsWith("corpus/decisions/")  && ext === ".md")   return "decision";
  if (rel.startsWith("corpus/gaps/")       && ext === ".md")   return "gap";
  if (rel === "corpus/tokens.md")                               return "token";
  return null;
}

function getSlug(filePath: string): string {
  return relative(BRAIN_ROOT, filePath).replace(/\\/g, "/");
}

// ─── Walk directory recursively ───────────────────────────────────────────────

function walk(dir: string): string[] {
  const results: string[] = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      results.push(...walk(full));
    } else {
      results.push(full);
    }
  }
  return results;
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function seed() {
  console.log(`\nBRAIN_ROOT: ${BRAIN_ROOT}`);
  console.log(`Supabase:   ${SUPABASE_URL}\n`);

  if (!existsSync(BRAIN_ROOT)) {
    console.error(`BRAIN_ROOT not found: ${BRAIN_ROOT}`);
    process.exit(1);
  }

  // ── 1. Seed corpus files ──────────────────────────────────────────────────
  console.log("── Seeding corpus files...");

  // Seed from brandsync-brain (components, patterns, gaps, tokens)
  // AND from brandsync-mcp/corpus (decisions, gaps written by write_corpus_entry)
  const MCP_ROOT   = join(__dirname, "..");
  const corpusDirs = [
    { dir: join(BRAIN_ROOT, "corpus"), root: BRAIN_ROOT },
    { dir: join(MCP_ROOT, "corpus"),   root: MCP_ROOT   },
  ].filter(({ dir }) => existsSync(dir));

  let inserted = 0;
  let skipped = 0;

  for (const { dir, root } of corpusDirs) {
    const files = walk(dir);
    for (const filePath of files) {
      // Use path relative to its own root for type detection
      const relToRoot = relative(root, filePath);
      const ext = extname(filePath);

      let type: string | null = null;
      if (relToRoot.startsWith("corpus/components/") && ext === ".md")   type = "component";
      if (relToRoot.startsWith("corpus/components/") && ext === ".html") type = "component_html";
      if (relToRoot.startsWith("corpus/patterns/")   && ext === ".md")   type = "pattern";
      if (relToRoot.startsWith("corpus/patterns/")   && ext === ".html") type = "pattern_html";
      if (relToRoot.startsWith("corpus/patterns/")   && ext === ".css")  type = "pattern_css";
      if (relToRoot.startsWith("corpus/decisions/")  && ext === ".md")   type = "decision";
      if (relToRoot.startsWith("corpus/gaps/")       && ext === ".md")   type = "gap";
      if (relToRoot === "corpus/tokens.md")                               type = "token";

      if (!type) { skipped++; continue; }

      const slug    = relToRoot.replace(/\\/g, "/");
      const content = readFileSync(filePath, "utf-8");

      const { error } = await supabase
        .from("corpus_entries")
        .upsert(
          { slug, type, path: slug, content, org_id: null, created_by: "seed" },
          { onConflict: "slug,type,org_id" }
        );

      if (error) {
        console.error(`  ❌ ${slug}: ${error.message}`);
      } else {
        console.log(`  ✅ ${type.padEnd(14)} ${slug}`);
        inserted++;
      }
    }
  }

  console.log(`\n  ${inserted} files seeded, ${skipped} skipped\n`);

  // ── 1b. Inject new pattern nodes into graph.json ──────────────────────────
  console.log("── Syncing graph.json with new patterns...");

  const graphPath    = join(BRAIN_ROOT, "graphify-out", "graph.json");
  const patchScript  = join(__dirname, "patch-graph-sizes.py");

  if (existsSync(graphPath)) {
    const graph = JSON.parse(readFileSync(graphPath, "utf-8"));
    const existingIds = new Set(graph.nodes.map((n: any) => n.id));

    // Build a file→id map from existing nodes so we can resolve Related Patterns
    const fileToId: Record<string, string> = {};
    for (const n of graph.nodes) {
      if (n.source_file) fileToId[basename(n.source_file)] = n.id;
    }

    // Helper: derive a stable node id from a markdown filename
    function toNodeId(filename: string): string {
      return filename.replace(/[^a-z0-9]/gi, "").toLowerCase() + "_pattern";
    }

    // Helper: extract title from markdown (first # heading)
    function extractTitle(content: string): string {
      const m = content.match(/^#\s+(.+)/m);
      return m ? m[1].trim() : "Unknown Pattern";
    }

    // Helper: extract Related Patterns filenames from markdown
    function extractRelated(content: string): string[] {
      const m = content.match(/##\s*Related Patterns\s*\n([\s\S]*?)(?:\n##|$)/);
      if (!m) return [];
      return [...m[1].matchAll(/`([^`]+\.md)`/g)].map(r => r[1]);
    }

    let graphChanged = false;
    const newNodeIds: string[] = [];

    // Walk brandsync-brain patterns only (source of pattern .md truth)
    const patternDir = join(BRAIN_ROOT, "corpus", "patterns");
    if (existsSync(patternDir)) {
      for (const file of walk(patternDir)) {
        if (extname(file) !== ".md") continue;
        const relFile = basename(file);
        const nodeId  = toNodeId(relFile.replace(".md", ""));
        const relPath = `corpus/patterns/${relFile}`;

        if (existingIds.has(nodeId)) continue; // already in graph

        const content = readFileSync(file, "utf-8");
        const label   = extractTitle(content);

        graph.nodes.push({
          id: nodeId, label,
          file_type: "document",
          source_file: relPath,
          source_location: null, source_url: null,
          captured_at: null, author: null, contributor: null,
          community: 6,
        });
        existingIds.add(nodeId);
        fileToId[relFile] = nodeId;
        newNodeIds.push(nodeId);
        graphChanged = true;
        console.log(`  + node  ${nodeId}  (${label})`);

        // Add edges from Related Patterns
        const existingEdges = new Set(
          graph.links.map((l: any) => `${l.source}→${l.target}`)
        );
        for (const related of extractRelated(content)) {
          const tgtId = fileToId[related] ?? toNodeId(related.replace(".md", ""));
          const key   = `${nodeId}→${tgtId}`;
          if (existingEdges.has(key)) continue;
          graph.links.push({
            relation: "references", confidence: "EXTRACTED", confidence_score: 1.0,
            source_file: relPath, source_location: "Related Patterns", weight: 1.0,
            _src: nodeId, _tgt: tgtId, source: nodeId, target: tgtId,
          });
          existingEdges.add(key);
          graphChanged = true;
          console.log(`  + edge  ${nodeId} → ${tgtId}`);
        }
      }
    }

    if (graphChanged) {
      writeFileSync(graphPath, JSON.stringify(graph, null, 2));
      console.log(`  ✅ graph.json updated — ${graph.nodes.length} nodes, ${graph.links.length} links`);

      // Patch sizes in graph.html
      if (existsSync(patchScript)) {
        try {
          execSync(`python3 "${patchScript}"`, {
            cwd: BRAIN_ROOT, env: { ...process.env, BRAIN_ROOT }, encoding: "utf-8",
          });
          console.log("  ✅ graph.html node sizes patched");
        } catch (e: any) {
          console.warn(`  ⚠️  patch-graph-sizes.py failed: ${e.message}`);
        }
      }
    } else {
      console.log("  ✅ graph.json already up to date — no new pattern nodes");
    }
  } else {
    console.warn("  ⚠️  graph.json not found — skipping graph node sync");
  }

  console.log();

  // ── 2. Seed graph.json ────────────────────────────────────────────────────
  console.log("── Seeding graph.json...");

  if (!existsSync(graphPath)) {
    console.warn("  ⚠️  graph.json not found — skipping graph snapshot");
  } else {
    const graph = JSON.parse(readFileSync(graphPath, "utf-8"));

    // Insert into graph_snapshots
    const { error: gsError } = await supabase
      .from("graph_snapshots")
      .insert({ org_id: null, graph, built_at: new Date().toISOString() });

    if (gsError) {
      console.error(`  ❌ graph_snapshots: ${gsError.message}`);
    } else {
      const nodeCount = graph.nodes?.length ?? 0;
      const edgeCount = graph.links?.length ?? graph.edges?.length ?? 0;
      console.log(`  ✅ graph_snapshots: ${nodeCount} nodes, ${edgeCount} edges\n`);
    }

    // Also insert graph.json as a corpus_entry for reference
    const { error: ceError } = await supabase
      .from("corpus_entries")
      .upsert(
        { slug: "graphify-out/graph.json", type: "graph", path: "graphify-out/graph.json",
          content: JSON.stringify(graph), org_id: null, created_by: "seed" },
        { onConflict: "slug,type,org_id" }
      );

    if (ceError) {
      console.error(`  ❌ corpus_entries/graph: ${ceError.message}`);
    }
  }

  // ── 3. Summary ───────────────────────────────────────────────────────────
  const { count } = await supabase
    .from("corpus_entries")
    .select("*", { count: "exact", head: true });

  const { data: snapshots } = await supabase
    .from("graph_snapshots")
    .select("id, built_at")
    .order("built_at", { ascending: false })
    .limit(1);

  console.log("── Summary");
  console.log(`  corpus_entries:  ${count} rows`);
  console.log(`  graph_snapshots: latest built ${snapshots?.[0]?.built_at ?? "none"}`);
  console.log("\n✅ Seed complete\n");
}

seed().catch(err => {
  console.error("Seed failed:", err);
  process.exit(1);
});
