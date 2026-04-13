import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { readFileSync, existsSync } from "fs";
import { join } from "path";

const BRAIN_ROOT = process.env.BRAIN_ROOT ?? process.cwd();
const GRAPH_PATH = join(BRAIN_ROOT, "graphify-out", "graph.json");

// ─── Graph loader (fresh read on every call) ──────────────────────────────────

type NodeData = {
  id: string;
  label?: string;
  source_file?: string;
  file_type?: string;
  community?: number;
  [key: string]: unknown;
};

type EdgeData = {
  source: string;
  target: string;
  relation?: string;
  confidence?: string;
  confidence_score?: number;
  weight?: number;
  [key: string]: unknown;
};

type Graph = {
  nodes: Map<string, NodeData>;
  adj: Map<string, Map<string, EdgeData>>;
  communities: Map<number, string[]>;
};

function loadGraph(): Graph | null {
  if (!existsSync(GRAPH_PATH)) return null;
  const raw = JSON.parse(readFileSync(GRAPH_PATH, "utf-8"));

  const nodes = new Map<string, NodeData>();
  for (const n of raw.nodes ?? []) {
    nodes.set(n.id, n);
  }

  const adj = new Map<string, Map<string, EdgeData>>();
  for (const e of raw.links ?? raw.edges ?? []) {
    const src = typeof e.source === "object" ? e.source.id : e.source;
    const tgt = typeof e.target === "object" ? e.target.id : e.target;
    if (!adj.has(src)) adj.set(src, new Map());
    adj.get(src)!.set(tgt, e);
    // undirected — add reverse
    if (!adj.has(tgt)) adj.set(tgt, new Map());
    adj.get(tgt)!.set(src, e);
  }

  const communities = new Map<number, string[]>();
  for (const [id, data] of nodes) {
    const cid = data.community;
    if (cid != null) {
      if (!communities.has(cid)) communities.set(cid, []);
      communities.get(cid)!.push(id);
    }
  }

  return { nodes, adj, communities };
}

function notFound(): { content: [{ type: "text"; text: string }] } {
  return {
    content: [{
      type: "text" as const,
      text: `graph.json not found at ${GRAPH_PATH}. Set BRAIN_ROOT or run update_graph first.`,
    }],
  };
}

function scoreNodes(nodes: Map<string, NodeData>, terms: string[]): [number, string][] {
  const scored: [number, string][] = [];
  for (const [id, d] of nodes) {
    const label = (d.label ?? "").toLowerCase();
    const src = (d.source_file ?? "").toLowerCase();
    const score = terms.reduce((s, t) => s + (label.includes(t) ? 1 : 0) + (src.includes(t) ? 0.5 : 0), 0);
    if (score > 0) scored.push([score, id]);
  }
  return scored.sort((a, b) => b[0] - a[0]);
}

function bfs(adj: Map<string, Map<string, EdgeData>>, starts: string[], depth: number): { nodes: Set<string>; edges: [string, string][] } {
  const visited = new Set(starts);
  let frontier = new Set(starts);
  const edges: [string, string][] = [];
  for (let d = 0; d < depth; d++) {
    const next = new Set<string>();
    for (const n of frontier) {
      for (const [nb] of adj.get(n) ?? []) {
        if (!visited.has(nb)) {
          next.add(nb);
          edges.push([n, nb]);
        }
      }
    }
    for (const n of next) visited.add(n);
    frontier = next;
  }
  return { nodes: visited, edges };
}

function dfs(adj: Map<string, Map<string, EdgeData>>, starts: string[], depth: number): { nodes: Set<string>; edges: [string, string][] } {
  const visited = new Set<string>();
  const edges: [string, string][] = [];
  const stack: [string, number][] = starts.map(s => [s, 0] as [string, number]).reverse();
  while (stack.length) {
    const [node, d] = stack.pop()!;
    if (visited.has(node) || d > depth) continue;
    visited.add(node);
    for (const [nb] of adj.get(node) ?? []) {
      if (!visited.has(nb)) {
        stack.push([nb, d + 1]);
        edges.push([node, nb]);
      }
    }
  }
  return { nodes: visited, edges };
}

function subgraphText(g: Graph, nodes: Set<string>, edges: [string, string][], budget = 2000): string {
  const lines: string[] = [];
  for (const id of nodes) {
    const d = g.nodes.get(id);
    if (!d) continue;
    lines.push(`NODE ${d.label ?? id}  [src=${d.source_file ?? ""}]`);
  }
  for (const [u, v] of edges) {
    if (!nodes.has(u) || !nodes.has(v)) continue;
    const e: EdgeData = g.adj.get(u)?.get(v) ?? { source: u, target: v };
    lines.push(`EDGE ${g.nodes.get(u)?.label ?? u} --${e.relation ?? ""}[${e.confidence ?? ""}]--> ${g.nodes.get(v)?.label ?? v}`);
  }
  const text = lines.join("\n");
  const charBudget = budget * 4;
  return text.length > charBudget ? text.slice(0, charBudget) + "\n…(truncated)" : text;
}

// ─── Register all 7 graph query tools ─────────────────────────────────────────

export function register(server: McpServer) {

  // 1. query_graph
  server.registerTool("query_graph", {
    description: "Search the BrandSync knowledge graph by question or keywords. Returns relevant nodes and edges. Use before writing code to find matching patterns, component relationships, or design system concepts.",
    inputSchema: {
      question: z.string().describe("Natural language question or keyword search"),
      mode: z.enum(["bfs", "dfs"]).optional().default("bfs").describe("bfs=broad context, dfs=trace a specific path"),
      depth: z.number().int().min(1).max(6).optional().default(3),
      token_budget: z.number().int().optional().default(2000),
    },
  }, async ({ question, mode, depth, token_budget }) => {
    const g = loadGraph();
    if (!g) return notFound();

    const terms = question.toLowerCase().split(/\s+/).filter(t => t.length > 2);
    const scored = scoreNodes(g.nodes, terms);
    const starts = scored.slice(0, 3).map(([, id]) => id);
    if (!starts.length) return { content: [{ type: "text" as const, text: `No nodes matched: ${terms.join(", ")}` }] };

    const traverse = mode === "dfs" ? dfs : bfs;
    const { nodes, edges } = traverse(g.adj, starts, depth ?? 3);
    return { content: [{ type: "text" as const, text: subgraphText(g, nodes, edges, token_budget ?? 2000) }] };
  });

  // 2. get_node
  server.registerTool("get_node", {
    description: "Get full details for a single graph node by ID — its source file, community, degree, and all connections.",
    inputSchema: {
      node_id: z.string().describe("Exact node ID from the graph"),
    },
  }, async ({ node_id }) => {
    const g = loadGraph();
    if (!g) return notFound();

    const d = g.nodes.get(node_id);
    if (!d) return { content: [{ type: "text" as const, text: `Node '${node_id}' not found.` }] };

    const neighbors = [...(g.adj.get(node_id)?.entries() ?? [])];
    const lines = [
      `Node: ${d.label ?? node_id}`,
      `  id: ${node_id}`,
      `  source: ${d.source_file ?? "?"}`,
      `  type: ${d.file_type ?? "?"}`,
      `  community: ${d.community ?? "?"}`,
      `  degree: ${neighbors.length}`,
      "",
      "Connections:",
      ...neighbors.map(([nb, e]) => `  --${e.relation ?? ""}[${e.confidence ?? ""}]--> ${g.nodes.get(nb)?.label ?? nb}`),
    ];
    return { content: [{ type: "text" as const, text: lines.join("\n") }] };
  });

  // 3. get_neighbors
  server.registerTool("get_neighbors", {
    description: "Get all neighbors of a node up to a given depth.",
    inputSchema: {
      node_id: z.string(),
      depth: z.number().int().min(1).max(4).optional().default(1),
    },
  }, async ({ node_id, depth }) => {
    const g = loadGraph();
    if (!g) return notFound();
    if (!g.nodes.has(node_id)) return { content: [{ type: "text" as const, text: `Node '${node_id}' not found.` }] };

    const { nodes, edges } = bfs(g.adj, [node_id], depth ?? 1);
    return { content: [{ type: "text" as const, text: subgraphText(g, nodes, edges) }] };
  });

  // 4. get_community
  server.registerTool("get_community", {
    description: "List all nodes in a community by community ID.",
    inputSchema: {
      community_id: z.number().int(),
    },
  }, async ({ community_id }) => {
    const g = loadGraph();
    if (!g) return notFound();

    const members = g.communities.get(community_id);
    if (!members?.length) return { content: [{ type: "text" as const, text: `Community ${community_id} not found.` }] };

    const lines = [`Community ${community_id} (${members.length} nodes):`,
      ...members.map(id => `  ${g.nodes.get(id)?.label ?? id}  (${g.nodes.get(id)?.source_file ?? ""})`)];
    return { content: [{ type: "text" as const, text: lines.join("\n") }] };
  });

  // 5. god_nodes
  server.registerTool("god_nodes", {
    description: "Return the highest-degree nodes — the most connected concepts in the design system. Useful for understanding what the pipeline depends on most.",
    inputSchema: {
      top_n: z.number().int().min(1).max(30).optional().default(10),
    },
  }, async ({ top_n }) => {
    const g = loadGraph();
    if (!g) return notFound();

    const ranked = [...g.nodes.entries()]
      .map(([id, d]) => ({ id, label: d.label ?? id, src: d.source_file ?? "", degree: g.adj.get(id)?.size ?? 0 }))
      .sort((a, b) => b.degree - a.degree)
      .slice(0, top_n ?? 10);

    const lines = [`Top ${top_n} god nodes:`, ...ranked.map(n => `  [${String(n.degree).padStart(3)}] ${n.label}  (${n.src})`)];
    return { content: [{ type: "text" as const, text: lines.join("\n") }] };
  });

  // 6. graph_stats
  server.registerTool("graph_stats", {
    description: "Return node count, edge count, community count, and graph freshness.",
    inputSchema: {},
  }, async () => {
    const g = loadGraph();
    if (!g) return notFound();

    const edgeCount = [...g.adj.values()].reduce((s, m) => s + m.size, 0) / 2;
    const lines = [
      `Nodes: ${g.nodes.size}`,
      `Edges: ${Math.round(edgeCount)}`,
      `Communities: ${g.communities.size}`,
      `Graph: ${GRAPH_PATH}`,
    ];
    return { content: [{ type: "text" as const, text: lines.join("\n") }] };
  });

  // 7. shortest_path
  server.registerTool("shortest_path", {
    description: "Find the shortest path between two named concepts in the design system graph.",
    inputSchema: {
      source: z.string().describe("Source concept name or keyword"),
      target: z.string().describe("Target concept name or keyword"),
      max_hops: z.number().int().min(1).max(10).optional().default(6),
    },
  }, async ({ source, target, max_hops }) => {
    const g = loadGraph();
    if (!g) return notFound();

    const find = (term: string) => {
      const terms = term.toLowerCase().split(/\s+/).filter(t => t.length > 2);
      const scored = scoreNodes(g.nodes, terms);
      return scored[0]?.[1] ?? null;
    };

    const srcId = find(source);
    const tgtId = find(target);
    if (!srcId || !tgtId) return { content: [{ type: "text" as const, text: `Could not find nodes for '${source}' or '${target}'.` }] };

    // BFS shortest path
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

    if (!found) return { content: [{ type: "text" as const, text: `No path found between '${source}' and '${target}'.` }] };

    const path: string[] = [];
    let cur: string | undefined = tgtId;
    while (cur) { path.unshift(cur); cur = prev.get(cur); }

    if (path.length - 1 > (max_hops ?? 6)) {
      return { content: [{ type: "text" as const, text: `Path too long (${path.length - 1} hops, max ${max_hops}).` }] };
    }

    const segments: string[] = [];
    for (let i = 0; i < path.length - 1; i++) {
      const e: EdgeData = g.adj.get(path[i])?.get(path[i + 1]) ?? { source: path[i], target: path[i + 1] };
      if (i === 0) segments.push(g.nodes.get(path[i])?.label ?? path[i]);
      segments.push(`--${e.relation ?? ""}[${e.confidence ?? ""}]--> ${g.nodes.get(path[i + 1])?.label ?? path[i + 1]}`);
    }
    return { content: [{ type: "text" as const, text: `Shortest path (${path.length - 1} hops):\n  ${segments.join(" ")}` }] };
  });
}
