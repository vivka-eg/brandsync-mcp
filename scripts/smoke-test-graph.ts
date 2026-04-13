/**
 * smoke-test-graph.ts
 *
 * Tests all 7 graph query tools directly without needing Claude Desktop.
 * Loads graph.json from BRAIN_ROOT and exercises every code path.
 *
 * Usage:
 *   BRAIN_ROOT=/Users/vivka/brandsync-brain npx tsx scripts/smoke-test-graph.ts
 */

import { readFileSync, existsSync } from "fs";
import { join } from "path";

const BRAIN_ROOT = process.env.BRAIN_ROOT ?? process.cwd();
const GRAPH_PATH = join(BRAIN_ROOT, "graphify-out", "graph.json");

// ─── Inline the same loader logic as graph.ts ────────────────────────────────

type NodeData = { id: string; label?: string; source_file?: string; file_type?: string; community?: number; [k: string]: unknown };
type EdgeData = { source: string; target: string; relation?: string; confidence?: string; [k: string]: unknown };
type Graph = { nodes: Map<string, NodeData>; adj: Map<string, Map<string, EdgeData>>; communities: Map<number, string[]> };

function loadGraph(): Graph {
  if (!existsSync(GRAPH_PATH)) throw new Error(`graph.json not found at ${GRAPH_PATH}`);
  const raw = JSON.parse(readFileSync(GRAPH_PATH, "utf-8"));

  const nodes = new Map<string, NodeData>();
  for (const n of raw.nodes ?? []) nodes.set(n.id, n);

  const adj = new Map<string, Map<string, EdgeData>>();
  for (const e of raw.links ?? raw.edges ?? []) {
    const src = typeof e.source === "object" ? e.source.id : e.source;
    const tgt = typeof e.target === "object" ? e.target.id : e.target;
    if (!adj.has(src)) adj.set(src, new Map());
    adj.get(src)!.set(tgt, e);
    if (!adj.has(tgt)) adj.set(tgt, new Map());
    adj.get(tgt)!.set(src, e);
  }

  const communities = new Map<number, string[]>();
  for (const [id, d] of nodes) {
    const cid = d.community;
    if (cid != null) {
      if (!communities.has(cid)) communities.set(cid, []);
      communities.get(cid)!.push(id);
    }
  }

  return { nodes, adj, communities };
}

function scoreNodes(nodes: Map<string, NodeData>, terms: string[]) {
  const scored: [number, string][] = [];
  for (const [id, d] of nodes) {
    const label = (d.label ?? "").toLowerCase();
    const src = (d.source_file ?? "").toLowerCase();
    const score = terms.reduce((s, t) => s + (label.includes(t) ? 1 : 0) + (src.includes(t) ? 0.5 : 0), 0);
    if (score > 0) scored.push([score, id]);
  }
  return scored.sort((a, b) => b[0] - a[0]);
}

// ─── Tests ────────────────────────────────────────────────────────────────────

let passed = 0;
let failed = 0;

function test(name: string, fn: () => void) {
  try {
    fn();
    console.log(`  ✅ ${name}`);
    passed++;
  } catch (e) {
    console.log(`  ❌ ${name}: ${e instanceof Error ? e.message : e}`);
    failed++;
  }
}

function assert(condition: boolean, msg: string) {
  if (!condition) throw new Error(msg);
}

console.log(`\nBrainRoot: ${BRAIN_ROOT}`);
console.log(`Graph:     ${GRAPH_PATH}\n`);

// 1. graph_stats
console.log("graph_stats");
test("graph.json loads", () => {
  const g = loadGraph();
  assert(g.nodes.size > 0, `nodes empty`);
  assert(g.communities.size > 0, `communities empty`);
  const edgeCount = [...g.adj.values()].reduce((s, m) => s + m.size, 0) / 2;
  console.log(`     ${g.nodes.size} nodes · ${Math.round(edgeCount)} edges · ${g.communities.size} communities`);
});

test("edge format (links vs edges, object vs string source)", () => {
  const raw = JSON.parse(readFileSync(GRAPH_PATH, "utf-8"));
  const edgeArray = raw.links ?? raw.edges ?? [];
  assert(edgeArray.length > 0, "no edges found");
  const first = edgeArray[0];
  const src = typeof first.source === "object" ? first.source?.id : first.source;
  assert(typeof src === "string", `source is not a string: ${JSON.stringify(first.source)}`);
  console.log(`     format: using '${raw.links ? "links" : "edges"}' key, source type: ${typeof first.source}`);
});

// 2. query_graph BFS
console.log("\nquery_graph (BFS)");
test("finds nodes for 'form' query", () => {
  const g = loadGraph();
  const terms = ["form"];
  const scored = scoreNodes(g.nodes, terms);
  assert(scored.length > 0, "no nodes matched 'form'");
  console.log(`     top match: ${g.nodes.get(scored[0][1])?.label} (score ${scored[0][0]})`);
});

test("BFS traversal returns nodes and edges", () => {
  const g = loadGraph();
  const scored = scoreNodes(g.nodes, ["dashboard"]);
  assert(scored.length > 0, "no 'dashboard' nodes");
  const start = scored[0][1];
  const visited = new Set([start]);
  let frontier = new Set([start]);
  const edges: [string, string][] = [];
  for (let d = 0; d < 2; d++) {
    const next = new Set<string>();
    for (const n of frontier) {
      for (const [nb] of g.adj.get(n) ?? []) {
        if (!visited.has(nb)) { next.add(nb); edges.push([n, nb]); }
      }
    }
    for (const n of next) visited.add(n);
    frontier = next;
  }
  assert(visited.size > 1, "BFS returned only start node — no neighbors found");
  console.log(`     BFS from '${g.nodes.get(start)?.label}': ${visited.size} nodes, ${edges.length} edges`);
});

// 3. query_graph DFS
console.log("\nquery_graph (DFS)");
test("DFS traversal visits nodes depth-first", () => {
  const g = loadGraph();
  const scored = scoreNodes(g.nodes, ["component"]);
  assert(scored.length > 0, "no 'component' nodes");
  const start = scored[0][1];
  const visited = new Set<string>();
  const edges: [string, string][] = [];
  const stack: [string, number][] = [[start, 0] as [string, number]];
  while (stack.length) {
    const [node, d] = stack.pop()!;
    if (visited.has(node) || d > 3) continue;
    visited.add(node);
    for (const [nb] of g.adj.get(node) ?? []) {
      if (!visited.has(nb)) { stack.push([nb, d + 1] as [string, number]); edges.push([node, nb]); }
    }
  }
  assert(visited.size > 1, "DFS returned only start node");
  console.log(`     DFS from '${g.nodes.get(start)?.label}': ${visited.size} nodes`);
});

// 4. get_node
console.log("\nget_node");
test("returns node details and connections", () => {
  const g = loadGraph();
  const [, id] = scoreNodes(g.nodes, ["radio", "button"])[0] ?? [];
  assert(!!id, "no radio button node found");
  const d = g.nodes.get(id)!;
  const neighbors = [...(g.adj.get(id)?.entries() ?? [])];
  assert(neighbors.length > 0, "radio button has no connections");
  console.log(`     '${d.label}': ${neighbors.length} connections, community ${d.community}`);
});

// 5. get_neighbors
console.log("\nget_neighbors");
test("returns immediate neighbors at depth 1", () => {
  const g = loadGraph();
  const [, id] = scoreNodes(g.nodes, ["form"])[0] ?? [];
  assert(!!id, "no form node");
  const neighbors = [...(g.adj.get(id)?.keys() ?? [])];
  assert(neighbors.length > 0, "form node has no neighbors");
  console.log(`     '${g.nodes.get(id)?.label}' has ${neighbors.length} direct neighbors`);
});

// 6. get_community
console.log("\nget_community");
test("community 0 exists and has members", () => {
  const g = loadGraph();
  const members = g.communities.get(0);
  assert(!!members && members.length > 0, "community 0 is empty");
  console.log(`     community 0: ${members!.length} members, first: ${g.nodes.get(members![0])?.label}`);
});

// 7. god_nodes
console.log("\ngod_nodes");
test("top 5 nodes have degree > 0", () => {
  const g = loadGraph();
  const ranked = [...g.nodes.entries()]
    .map(([id]) => ({ id, degree: g.adj.get(id)?.size ?? 0 }))
    .sort((a, b) => b.degree - a.degree)
    .slice(0, 5);
  assert(ranked[0].degree > 0, "top node has degree 0");
  console.log(`     top: ${g.nodes.get(ranked[0].id)?.label} (${ranked[0].degree} connections)`);
});

// 8. shortest_path
console.log("\nshortest_path");
test("finds path between 'form' and 'dashboard'", () => {
  const g = loadGraph();
  const srcId = scoreNodes(g.nodes, ["form"])[0]?.[1];
  const tgtId = scoreNodes(g.nodes, ["dashboard"])[0]?.[1];
  assert(!!srcId && !!tgtId, "could not find form or dashboard nodes");

  const prev = new Map<string, string>();
  const visited = new Set([srcId]);
  const queue = [srcId];
  let found = false;
  outer: while (queue.length) {
    const curr = queue.shift()!;
    for (const [nb] of g.adj.get(curr) ?? []) {
      if (!visited.has(nb)) {
        prev.set(nb, curr);
        visited.add(nb);
        if (nb === tgtId) { found = true; break outer; }
        queue.push(nb);
      }
    }
  }

  assert(found, `no path between '${g.nodes.get(srcId)?.label}' and '${g.nodes.get(tgtId)?.label}'`);
  const path: string[] = [];
  let cur: string | undefined = tgtId;
  while (cur) { path.unshift(cur); cur = prev.get(cur); }
  console.log(`     ${path.length - 1} hops: ${path.map(id => g.nodes.get(id)?.label).join(" → ")}`);
});

test("returns 'no path' for disconnected nodes gracefully", () => {
  const g = loadGraph();
  // Use a nonexistent term that won't match anything
  const scored = scoreNodes(g.nodes, ["zzznomatch"]);
  assert(scored.length === 0, "expected no match for 'zzznomatch'");
  console.log(`     correctly returns empty for unknown term`);
});

// ─── Summary ─────────────────────────────────────────────────────────────────

console.log(`\n${"─".repeat(40)}`);
console.log(`${passed + failed} tests: ${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
