#!/usr/bin/env python3
"""
patch-graph-sizes.py

Rewrites node sizes in graphify-out/graph.html based on semantic layer
rather than raw degree centrality.

Layer hierarchy (for the Jira → Figma pipeline):
  pattern   → always large  (40-50)  — pipeline entry points
  component → medium        (19-30)  — scaled by reuse across patterns
  concept   → small         (11-17)  — design system concepts / a11y patterns
  meta      → small          (9-15)  — system anchors, framework refs
  token     → very small     (5-9)   — implementation detail, should recede

Run:
  python3 scripts/patch-graph-sizes.py
  npm run patch:graph          # via package.json
"""

import re
import json
import sys
from pathlib import Path

HTML_PATH = Path("graphify-out/graph.html")

if not HTML_PATH.exists():
    print("ERROR: graphify-out/graph.html not found. Run /graphify corpus/ first.")
    sys.exit(1)

html = HTML_PATH.read_text(encoding="utf-8")
m = re.search(r"const RAW_NODES = (\[.*?\]);", html, re.DOTALL)
if not m:
    print("ERROR: could not find RAW_NODES in graph.html")
    sys.exit(1)

nodes = json.loads(m.group(1))


def node_layer(n: dict) -> str:
    src   = n.get("source_file", "")
    nid   = n.get("id", "")
    label = n.get("label", "")

    # Tokens — check id prefix first (they can come from any source file)
    if nid.startswith("token_") or label.startswith("Token:"):
        return "token"

    # Full-page UI patterns from corpus/patterns/
    if src.startswith("corpus/patterns/") and nid.endswith("_pattern"):
        return "pattern"

    # Design-system concepts and accessibility patterns
    if nid.endswith("_pattern") or nid.endswith("_concept") or nid.startswith("concept_"):
        return "concept"

    # Component specs from corpus/components/
    if src.startswith("corpus/components/") or nid.endswith("_component"):
        return "component"

    # System anchors, rationale nodes, framework refs
    return "meta"


LAYER_PARAMS = {
    #            base  scale   cap  font_size
    "pattern":  ( 34,   1.2,   50,   13),
    "component":( 18,   0.6,   30,   11),
    "concept":  ( 11,   0.5,   18,   10),
    "meta":     (  9,   0.3,   15,   10),
    "token":    (  5,   0.1,    9,    9),
}

layer_counts: dict[str, int] = {}
for n in nodes:
    layer = node_layer(n)
    base, scale, cap, fsize = LAYER_PARAMS[layer]
    deg = n.get("degree", 1)
    n["size"] = round(min(base + deg * scale, cap), 1)
    n["font"] = {**n.get("font", {}), "size": fsize}
    layer_counts[layer] = layer_counts.get(layer, 0) + 1

new_nodes_json = json.dumps(nodes, separators=(",", ":"))
new_html = html[: m.start(1)] + new_nodes_json + html[m.end(1) :]
HTML_PATH.write_text(new_html, encoding="utf-8")

print("Node layer sizing applied:")
for layer in ["pattern", "component", "concept", "meta", "token"]:
    count = layer_counts.get(layer, 0)
    layer_nodes = [n for n in nodes if node_layer(n) == layer]
    if layer_nodes:
        sizes = [n["size"] for n in layer_nodes]
        print(f"  {layer:10s} {count:3d} nodes  size {min(sizes):.0f}–{max(sizes):.0f}")

print(f"\ngraphify-out/graph.html updated ({len(nodes)} nodes)")
