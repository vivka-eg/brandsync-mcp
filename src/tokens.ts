import * as fs from "fs";
import { fileURLToPath } from "url";

// ─── Load ─────────────────────────────────────────────────────────────────────

export function loadTokenCSS(): string {
  const tokenPath = fileURLToPath(import.meta.resolve("brandsync-tokens/tokens.css"));
  return fs.readFileSync(tokenPath, "utf8");
}

// ─── Parse ────────────────────────────────────────────────────────────────────

export function parseTokens(css: string): Record<string, string> {
  const tokens: Record<string, string> = {};
  const re = /(--[\w-]+)\s*:\s*([^;]+);/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(css)) !== null) {
    tokens[m[1].trim()] = m[2].trim();
  }
  return tokens;
}

// ─── Resolve ──────────────────────────────────────────────────────────────────

/** Follows var() references up to 5 levels deep. */
export function resolveToken(
  value: string,
  all: Record<string, string>,
  depth = 0
): string {
  if (depth > 5) return value;
  const match = value.match(/^var\((--[\w-]+)\)$/);
  if (!match) return value;
  const referenced = all[match[1]];
  if (!referenced) return value;
  return resolveToken(referenced.trim(), all, depth + 1);
}

// ─── Component token mapping ─────────────────────────────────────────────────

/** Maps component names to their dedicated token prefix. */
export const COMPONENT_TOKEN_PREFIX: Record<string, string> = {
  "buttons":      "button",
  "button":       "button",
  "input fields": "input",
  "input":        "input",
  "badge":        "badge",
  "radio button": "radio",
  "radio":        "radio",
  "switch":       "switch",
  "avatar":       "avatar",
  "chip":         "chip",
  "paper":        "paper",
};

/** Semantic token groups used as fallback when no component tokens exist. */
export const SEMANTIC_GROUPS = [
  "bs-color-surface",
  "bs-color-border",
  "bs-color-text",
  "bs-color-icons",
];

// ─── Build token section ──────────────────────────────────────────────────────

export function buildTokenSection(component: string): string {
  const css = loadTokenCSS();
  const all = parseTokens(css);
  const prefix = COMPONENT_TOKEN_PREFIX[component.toLowerCase()];
  const lines: string[] = [];

  if (prefix) {
    lines.push("## Tokens\n");
    lines.push("Component-specific tokens — use these instead of raw semantic tokens.\n");
    for (const [key, raw] of Object.entries(all).filter(([k]) =>
      k.startsWith(`--bs-${prefix}-`)
    )) {
      const resolved = resolveToken(raw, all);
      lines.push(`${key}: ${raw}${resolved !== raw ? ` → ${resolved}` : ""}`);
    }
  } else {
    lines.push("## Tokens\n");
    lines.push("No dedicated component tokens yet — use these semantic tokens:\n");
    for (const group of SEMANTIC_GROUPS) {
      const groupTokens = Object.entries(all).filter(([k]) =>
        k.startsWith(`--${group}-`)
      );
      if (!groupTokens.length) continue;
      lines.push(`\n### ${group}`);
      for (const [key, raw] of groupTokens) {
        const resolved = resolveToken(raw, all);
        lines.push(`${key}: ${raw}${resolved !== raw ? ` → ${resolved}` : ""}`);
      }
    }
  }

  lines.push("\n### Interaction states");
  for (const key of ["--opacity-hover", "--opacity-focus", "--opacity-disabled"]) {
    if (all[key]) lines.push(`${key}: ${all[key]}`);
  }

  lines.push("\n### Breakpoints");
  for (const [key, val] of Object.entries(all).filter(
    ([k]) => k.startsWith("--breakpoint-") && !k.includes("max") && !k.includes("min")
  )) {
    lines.push(`${key}: ${val}`);
  }

  return lines.join("\n");
}
