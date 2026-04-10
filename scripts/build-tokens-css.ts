/**
 * build-tokens-css.ts
 *
 * Auto-generates Patterns/_tokens.css from the installed brandsync-tokens package.
 *
 * What it does:
 *   1. Reads node_modules/brandsync-tokens/dist/css/tokens.css
 *   2. Extracts semantic --bs-* variables (color, spacing, border, sizing)
 *   3. Strips the "bs-" prefix to create short aliases:
 *        --bs-color-surface-base  →  --color-surface-base: var(--bs-color-surface-base)
 *   4. Writes the generated :root block into Patterns/_tokens.css
 *
 * Run:
 *   npm run build:tokens-css
 *   npx tsx scripts/build-tokens-css.ts
 */

import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

const SOURCE = join(ROOT, "node_modules/brandsync-tokens/dist/css/tokens.css");
const OUTPUT = join(ROOT, "Patterns/_tokens.css");

// ─── Semantic categories to include ──────────────────────────────────────────
// Component-specific tokens (--bs-button-*, --bs-chip-*, etc.) are excluded.

const INCLUDE_PREFIXES = [
  "--bs-color-surface-",
  "--bs-color-text-",
  "--bs-color-icons-",
  "--bs-color-border-",
  "--bs-color-primary-",
  "--bs-color-neutral-",
  "--bs-color-success-",
  "--bs-color-error-",
  "--bs-color-warning-",
  "--bs-color-info-",
  "--bs-color-accent-",
  "--bs-color-elevation-",
  "--bs-spacing-",
  "--bs-border-radius-",
  "--bs-border-width-",
  "--bs-sizing-",
];

const CATEGORY_LABELS: Record<string, string> = {
  "color-surface":    "Surface",
  "color-text":       "Text",
  "color-icons":      "Icons",
  "color-border":     "Borders",
  "color-primary":    "Primary",
  "color-neutral":    "Neutral interactive",
  "color-success":    "Status — Success",
  "color-error":      "Status — Error",
  "color-warning":    "Status — Warning",
  "color-info":       "Status — Info",
  "color-accent":     "Accent",
  "color-elevation":  "Elevation",
  "spacing":          "Spacing",
  "border-radius":    "Border Radius",
  "border-width":     "Border Width",
  "sizing":           "Sizing",
};

// ─── Parse ────────────────────────────────────────────────────────────────────

const css = readFileSync(SOURCE, "utf-8");
const tokenRe = /\s*(--bs-[\w-]+)\s*:/g;

const seen = new Set<string>();
const groups: Record<string, string[]> = {};

let match: RegExpExecArray | null;
while ((match = tokenRe.exec(css)) !== null) {
  const fullName = match[1];
  if (seen.has(fullName)) continue;
  seen.add(fullName);

  const category = INCLUDE_PREFIXES.find(p => fullName.startsWith(p));
  if (!category) continue;

  const aliasName = fullName.replace(/^--bs-/, "--");
  const groupKey = category.replace(/^--bs-/, "").replace(/-$/, "");
  if (!groups[groupKey]) groups[groupKey] = [];
  groups[groupKey].push(`  ${(aliasName + ":").padEnd(46)} var(${fullName});`);
}

// ─── Build output ─────────────────────────────────────────────────────────────

const totalAliases = Object.values(groups).reduce((n, arr) => n + arr.length, 0);

const out: string[] = [
  `/**`,
  ` * BrandSync Pattern Tokens — AUTO-GENERATED, do not edit`,
  ` * Source: brandsync-tokens npm package`,
  ` * Regenerate: npm run build:tokens-css`,
  ` *`,
  ` * Aliases strip the "bs-" prefix so pattern CSS stays readable:`,
  ` *   --bs-color-surface-base  →  --color-surface-base`,
  ` *`,
  ` * For target projects (no _tokens.css), use --bs-* names directly.`,
  ` */`,
  ``,
  `@import '../node_modules/brandsync-tokens/dist/css/tokens.css';`,
  ``,
  `/* ─── Typography (package exports these without --bs- prefix) ───────── */`,
  `:root {`,
  `  --font-family-body:    var(--typography-font-family-body), system-ui, sans-serif;`,
  `  --font-family-heading: var(--typography-font-family-heading), system-ui, sans-serif;`,
  ``,
  `  --font-size-small: var(--font-size-sm);   /* 14px */`,
  `  --font-size-base:  var(--font-size-md);   /* 16px */`,
  `  --font-size-large: var(--font-size-lg);   /* 18px */`,
  ``,
  `  --font-weight-regular:  var(--typography-font-weight-regular);`,
  `  --font-weight-medium:   var(--typography-font-weight-medium);`,
  `  --font-weight-semibold: var(--typography-font-weight-semibold);`,
  `  --font-weight-bold:     var(--typography-font-weight-bold);`,
  `}`,
  ``,
  `/* ─── Semantic aliases — --bs-* stripped to --* ─────────────────────── */`,
  `:root {`,
];

for (const [key, aliases] of Object.entries(groups)) {
  const label = CATEGORY_LABELS[key] ?? key;
  out.push(``, `  /* ${label} */`);
  out.push(...aliases);
}

out.push(`}`);

// Dark mode — references raw palette vars, must be hand-maintained
out.push(
  ``,
  `/* ─── Dark mode ──────────────────────────────────────────────────────── */`,
  `/* brandsync-tokens v1 ships light values only.                          */`,
  `/* These overrides use raw palette vars already defined by the package.  */`,
  `[data-theme="dark"] {`,
  `  --color-surface-base:              var(--neutral-900);`,
  `  --color-surface-raised:            var(--neutral-800);`,
  `  --color-surface-container:         var(--neutral-800);`,
  `  --color-surface-hover:             var(--neutral-700);`,
  `  --color-surface-pressed:           var(--neutral-600);`,
  `  --color-surface-selected:          var(--neutral-800);`,
  `  --color-surface-active:            var(--neutral-700);`,
  ``,
  `  --color-text-default:              var(--white);`,
  `  --color-text-secondary:            var(--neutral-200);`,
  `  --color-text-muted:                var(--neutral-300);`,
  `  --color-text-inverse:              var(--white);`,
  `  --color-text-on-action:            var(--white);`,
  ``,
  `  --color-icons-default:             var(--white);`,
  `  --color-icons-neutral-default:     var(--neutral-200);`,
  `  --color-icons-muted:               var(--neutral-400);`,
  ``,
  `  --color-border-default:            var(--neutral-700);`,
  `  --color-border-neutral-focus:      var(--brand-400);`,
  `  --color-border-primary:            var(--brand-400);`,
  ``,
  `  --color-primary-default:           var(--brand-400);`,
  `  --color-primary-hover:             var(--brand-300);`,
  `  --color-primary-pressed:           var(--brand-200);`,
  `  --color-primary-container:         var(--brand-800);`,
  `}`,
  ``,
);

writeFileSync(OUTPUT, out.join("\n"), "utf-8");
console.log(`Patterns/_tokens.css updated — ${totalAliases} aliases from ${seen.size} --bs-* tokens parsed`);
