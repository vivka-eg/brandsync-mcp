/**
 * build-corpus.ts
 *
 * Builds two sets of Markdown files for Graphify's semantic extraction:
 *
 *   corpus/components/<slug>.md  — one per Strapi component, with variants,
 *                                  tokens, classes, and code examples
 *   corpus/patterns/<slug>.md    — one per UI pattern, sourced from meta.json
 *
 * Pattern metadata lives in Patterns/<Name>/meta.json — structured JSON that
 * designers and developers can edit directly. The HTML/CSS files are browser
 * previews only; Graphify reads the .md files.
 *
 * Adding a new pattern:
 *   1. Create Patterns/<Name>/<name>.html  (preview)
 *   2. Create Patterns/<Name>/<name>.css   (styles)
 *   3. Create Patterns/<Name>/meta.json    (metadata — drives the corpus)
 *   4. Run: npm run build:corpus
 *
 * Usage:
 *   npm run build:corpus
 *   npx tsx scripts/build-corpus.ts --strapi http://localhost:1337
 */

import { writeFileSync, readFileSync, mkdirSync, readdirSync, statSync, existsSync } from "fs";
import { join, dirname, extname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const BRAIN_ROOT = process.env.BRAIN_ROOT ?? ROOT;

// ─── Config ──────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const strapiArg = args.find(a => a.startsWith("--strapi="))?.split("=")[1]
               ?? args[args.indexOf("--strapi") + 1];

const STRAPI_BASE = strapiArg
  ?? (() => {
    const raw = process.env.STRAPI_BASE_URL;
    if (!raw) return "http://localhost:1337";
    try { const u = new URL(raw); return `${u.protocol}//${u.host}`; } catch { return raw; }
  })();

const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN ?? "";

const COMPONENTS_DIR = join(BRAIN_ROOT, "corpus", "components");
const PATTERNS_DIR   = join(BRAIN_ROOT, "corpus", "patterns");
const PATTERNS_SRC   = join(BRAIN_ROOT, "Patterns");

// ─── Types ───────────────────────────────────────────────────────────────────

type CodeExample = {
  id: number;
  Framework: string;
  Variant: string;
  Group: string | null;
  Code: string;
};

type DoAndDontItem = {
  Description?: string;
  CodeSnippet?: string;
  CodeExtension?: string;
};

type DoAndDont = {
  Do: DoAndDontItem;
  Dont: DoAndDontItem;
};

type GuidelineElement = {
  ElementTitle?: string;
  Description?: string;
  DoAndDont?: DoAndDont[];
};

type Guideline = {
  Title?: string;
  GuidelineElement?: GuidelineElement[];
};

// Note: Strapi field is misspelled as "Accessiblity" — must match exactly
type AccessibilityElement = {
  ElementTitle?: string;
  Description?: string;
  DoAndDont?: DoAndDont[];
};

type AccessibilitySection = {
  Title?: string;
  AccessiblityElement?: AccessibilityElement[];
};

type TypeElement = {
  PrimaryTitle?: string;
  SecondaryTitle?: string;
  Decription?: string; // Note: Strapi typo — missing 's'
};

type Overview = {
  Anatomy?: { Description?: string };
  Type?: { Description?: string; TypeElements?: TypeElement[] };
  States?: { Description?: string };
};

type StrapiComponent = {
  documentId: string;
  Title: string;
  Description?: string;
  Usage?: { Content?: string };
  Guidelines?: Guideline[];
  Accessiblity?: AccessibilitySection[]; // Note: Strapi typo
  Overview?: Overview;
  CodeExamples?: CodeExample[];
};

type PatternMeta = {
  name: string;
  category: string[];
  useCase: string;
  responsive: string[];
  components: string[];
  tokens: string[];
  layout?: string;
  states?: string[];
  darkMode?: boolean;
  relatedPatterns?: string[];
  tags?: string[];
};

// ─── Validation ──────────────────────────────────────────────────────────────

const REQUIRED_META_FIELDS: (keyof PatternMeta)[] = [
  "name", "category", "useCase", "responsive", "components", "tokens",
];

function validatePatternMeta(meta: unknown, filePath: string): PatternMeta {
  if (typeof meta !== "object" || meta === null) {
    throw new Error(`${filePath}: meta.json must be a JSON object`);
  }
  const m = meta as Record<string, unknown>;
  const errors: string[] = [];

  for (const field of REQUIRED_META_FIELDS) {
    if (!(field in m)) {
      errors.push(`missing required field "${field}"`);
      continue;
    }
    if (field === "useCase") {
      if (typeof m[field] !== "string" || (m[field] as string).trim() === "") {
        errors.push(`"${field}" must be a non-empty string`);
      }
    } else if (field === "name") {
      if (typeof m[field] !== "string" || (m[field] as string).trim() === "") {
        errors.push(`"${field}" must be a non-empty string`);
      }
    } else {
      if (!Array.isArray(m[field]) || (m[field] as unknown[]).length === 0) {
        errors.push(`"${field}" must be a non-empty array`);
      }
    }
  }

  const optionalArrayFields: (keyof PatternMeta)[] = ["states", "relatedPatterns", "tags"];
  for (const field of optionalArrayFields) {
    if (field in m && !Array.isArray(m[field])) {
      errors.push(`"${field}" must be an array if present`);
    }
  }

  if ("darkMode" in m && typeof m.darkMode !== "boolean") {
    errors.push(`"darkMode" must be a boolean`);
  }

  if (errors.length > 0) {
    throw new Error(`${filePath}:\n  ${errors.join("\n  ")}`);
  }

  return m as unknown as PatternMeta;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function slugify(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function extractTokens(code: string): string[] {
  const matches = code.matchAll(/var\(--([\w-]+)\)/g);
  return [...new Set([...matches].map(m => `--${m[1]}`))];
}

function extractClasses(code: string): string[] {
  const matches = code.matchAll(/class="([^"]+)"/g);
  const classes = [...matches].flatMap(m => m[1].split(/\s+/));
  return [...new Set(classes.filter(Boolean))];
}

// ─── "Why" layer builders ─────────────────────────────────────────────────────

function buildOverviewSection(overview: Overview | undefined): string {
  if (!overview) return "";
  const lines: string[] = ["## Overview", ""];

  const anatomy = overview.Anatomy?.Description;
  if (anatomy) lines.push(`**Anatomy:** ${anatomy}`, "");

  const type = overview.Type;
  if (type?.Description) lines.push(`**Types:** ${type.Description}`, "");
  if (type?.TypeElements?.length) {
    for (const el of type.TypeElements) {
      const label = [el.PrimaryTitle, el.SecondaryTitle].filter(Boolean).join(" — ");
      // Strapi typo: field is "Decription" not "Description"
      if (label || el.Decription) {
        lines.push(`- **${label}:** ${el.Decription ?? ""}`.trimEnd());
      }
    }
    lines.push("");
  }

  const states = overview.States?.Description;
  if (states) lines.push(`**States:** ${states}`, "");

  return lines.join("\n");
}

function buildUsageSection(usage: { Content?: string } | undefined): string {
  if (!usage?.Content?.trim()) return "";
  // Strip S3 image markdown and Strapi shortcodes — they're URLs, not useful in corpus
  const cleaned = usage.Content
    .split("\n")
    .filter(line => !line.trim().startsWith("!["))     // remove image lines
    .filter(line => !/\{\{[^}]+\}\}/.test(line))       // remove {{shortcode}} lines
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")                        // collapse excess blank lines
    .trim();
  if (!cleaned) return "";
  return ["## Usage", "", cleaned, ""].join("\n");
}

function buildGuidelinesSection(guidelines: Guideline[] | undefined): string {
  if (!guidelines?.length) return "";
  const lines: string[] = ["## Guidelines", ""];

  for (const section of guidelines) {
    if (section.Title?.trim()) lines.push(`### ${section.Title}`, "");
    for (const el of section.GuidelineElement ?? []) {
      if (el.ElementTitle) lines.push(`#### ${el.ElementTitle}`, "");
      if (el.Description) lines.push(el.Description, "");
      for (const pair of el.DoAndDont ?? []) {
        if (pair.Do?.Description) lines.push(`**Do:** ${pair.Do.Description}`);
        if (pair.Dont?.Description) lines.push(`**Don't:** ${pair.Dont.Description}`);
        lines.push("");
      }
    }
  }

  return lines.join("\n");
}

function buildAccessibilitySection(sections: AccessibilitySection[] | undefined): string {
  if (!sections?.length) return "";
  const lines: string[] = ["## Accessibility", ""];

  for (const section of sections) {
    if (section.Title) lines.push(`### ${section.Title}`, "");
    // Strapi typo: field is "AccessiblityElement"
    for (const el of section.AccessiblityElement ?? []) {
      if (el.ElementTitle) lines.push(`#### ${el.ElementTitle}`, "");
      if (el.Description) lines.push(el.Description, "");
      for (const pair of el.DoAndDont ?? []) {
        if (pair.Do?.Description) lines.push(`**Do:** ${pair.Do.Description}`);
        if (pair.Do?.CodeSnippet) {
          lines.push(`\`\`\`${pair.Do.CodeExtension ?? ""}`);
          lines.push(pair.Do.CodeSnippet.trim());
          lines.push("```");
        }
        if (pair.Dont?.Description) lines.push(`**Don't:** ${pair.Dont.Description}`);
        if (pair.Dont?.CodeSnippet) {
          lines.push(`\`\`\`${pair.Dont.CodeExtension ?? ""}`);
          lines.push(pair.Dont.CodeSnippet.trim());
          lines.push("```");
        }
        lines.push("");
      }
    }
  }

  return lines.join("\n");
}

// ─── Component → Markdown ────────────────────────────────────────────────────

function buildComponentMarkdown(component: StrapiComponent): string {
  const examples = component.CodeExamples ?? [];
  const allTokens = [...new Set(examples.flatMap(e => extractTokens(e.Code)))];
  const allClasses = [...new Set(examples.flatMap(e => extractClasses(e.Code)))];
  const variants = [...new Set(examples.map(e => e.Variant).filter(Boolean))];
  const frameworks = [...new Set(examples.map(e => e.Framework).filter(Boolean))];

  const byGroup = new Map<string, CodeExample[]>();
  for (const ex of examples) {
    const g = ex.Group ?? "Default";
    if (!byGroup.has(g)) byGroup.set(g, []);
    byGroup.get(g)!.push(ex);
  }

  const lines: string[] = [
    `# ${component.Title}`,
    ``,
    `**Type:** UI Component`,
    `**Source:** BrandSync Design System (Strapi)`,
    ``,
  ];

  if (component.Description) {
    lines.push(`## Description`, ``, component.Description, ``);
  }

  const overviewSection = buildOverviewSection(component.Overview);
  if (overviewSection) lines.push(overviewSection);

  const usageSection = buildUsageSection(component.Usage);
  if (usageSection) lines.push(usageSection);

  const guidelinesSection = buildGuidelinesSection(component.Guidelines);
  if (guidelinesSection) lines.push(guidelinesSection);

  const accessibilitySection = buildAccessibilitySection(component.Accessiblity);
  if (accessibilitySection) lines.push(accessibilitySection);

  lines.push(
    `## Variants`,
    ``,
    variants.map(v => `- ${v}`).join("\n") || "- Default",
    ``,
    `## Frameworks`,
    ``,
    frameworks.map(f => `- ${f}`).join("\n"),
    ``,
    `## Design Tokens`,
    ``,
    allTokens.length ? allTokens.map(t => `- \`${t}\``).join("\n") : "- (none detected)",
    ``,
    `## CSS Classes`,
    ``,
    allClasses.length ? allClasses.slice(0, 40).map(c => `- \`${c}\``).join("\n") : "- (none detected)",
    ``,
    `## Code Examples`,
    ``,
  );

  for (const [group, groupExamples] of byGroup) {
    if (group !== "Default") lines.push(`### ${group}`, ``);
    for (const ex of groupExamples) {
      lines.push(
        `#### ${ex.Variant} (${ex.Framework})`,
        ``,
        `\`\`\`${ex.Framework.toLowerCase()}`,
        ex.Code.trim(),
        `\`\`\``,
        ``,
      );
    }
  }

  return lines.join("\n");
}

// ─── Pattern meta.json → Markdown ────────────────────────────────────────────

/**
 * Reads Patterns/<folder>/meta.json and converts it to structured Markdown
 * for Graphify. Falls back to parsing the HTML comment block if meta.json
 * is not present (for backwards compatibility during migration).
 */
function buildPatternMarkdown(folderPath: string, folderName: string): string {
  const metaPath = join(folderPath, "meta.json");

  if (existsSync(metaPath)) {
    const raw = JSON.parse(readFileSync(metaPath, "utf-8"));
    const meta = validatePatternMeta(raw, metaPath);
    return buildPatternMarkdownFromMeta(meta);
  }

  // Fallback: parse HTML comment (deprecated — add a meta.json instead)
  const htmlFiles = readdirSync(folderPath).filter(f => extname(f) === ".html");
  if (htmlFiles.length === 0) return "";
  console.warn(`  ⚠️  ${folderName}: no meta.json found, falling back to HTML comment parsing`);
  return buildPatternMarkdownFromHtml(join(folderPath, htmlFiles[0]), folderName);
}

function buildPatternMarkdownFromMeta(meta: PatternMeta): string {
  const lines: string[] = [
    `# ${meta.name}`,
    ``,
    `**Type:** UI Pattern (full screen)`,
    `**Category:** ${meta.category.join(", ")}`,
    `**Responsive:** ${meta.responsive.join(", ")}`,
    ``,
    `## Use Case`,
    ``,
    meta.useCase,
    ``,
  ];

  if (meta.components.length) {
    lines.push(`## Components Used`, ``);
    lines.push(...meta.components.map(c => `- ${c}`));
    lines.push(``);
  }

  if (meta.tokens.length) {
    lines.push(`## Design Tokens`, ``);
    lines.push(...meta.tokens.map(t => `- \`${t}\``));
    lines.push(``);
  }

  if (meta.layout) {
    lines.push(`## Layout`, ``, meta.layout, ``);
  }

  if (meta.states?.length) {
    lines.push(`## States`, ``);
    lines.push(...meta.states.map(s => `- ${s}`));
    lines.push(``);
  }

  lines.push(
    `## Dark Mode`,
    ``,
    meta.darkMode ? "Supported via `data-theme=\"dark\"`" : "Not supported",
    ``,
    `## Related Patterns`,
    ``,
    ...(meta.relatedPatterns?.length ? meta.relatedPatterns.map(r => `- ${r}`) : ["- None"]),
    ``,
    `## Tags`,
    ``,
    meta.tags?.join(", ") ?? "",
    ``,
  );

  return lines.join("\n");
}

/** Legacy fallback — parses HTML comment block. Use meta.json instead. */
function buildPatternMarkdownFromHtml(htmlPath: string, folderName: string): string {
  const html = readFileSync(htmlPath, "utf-8");
  const commentMatch = html.match(/<!--([\s\S]*?)-->/);
  const comment = commentMatch ? commentMatch[1] : "";

  const field = (label: string): string => {
    const re = new RegExp(`${label}:\\s*([^\\n]+(?:\\n(?!\\s{2,}\\w.*:)[^\\n]*)*)`, "i");
    const m = comment.match(re);
    return m ? m[1].replace(/\s+/g, " ").trim() : "";
  };

  const listField = (label: string): string[] => {
    const re = new RegExp(`${label}:[\\s\\S]*?(?=\\n\\s{2}\\w|$)`, "i");
    const block = comment.match(re)?.[0] ?? "";
    return block.split("\n").filter(l => l.trim().startsWith("-"))
      .map(l => l.replace(/^\s*-\s*/, "").trim()).filter(Boolean);
  };

  const name       = field("BrandSync UI Pattern") || folderName.replace(/-/g, " ");
  const category   = field("Category");
  const useCase    = field("Use case");
  const responsive = field("Responsive");
  const layout     = field("Layout");
  const states     = field("States");
  const darkMode   = field("Dark mode");
  const related    = field("Related patterns");
  const tags       = field("Tags");
  const components = listField("Components used");
  const tokens     = field("Design tokens used");

  const lines: string[] = [
    `# ${name}`, ``,
    `**Type:** UI Pattern (full screen)`,
    `**Category:** ${category}`,
    `**Responsive:** ${responsive}`, ``,
    `## Use Case`, ``, useCase, ``,
  ];
  if (components.length) { lines.push(`## Components Used`, ``); lines.push(...components.map(c => `- ${c}`)); lines.push(``); }
  if (tokens) lines.push(`## Design Tokens`, ``, tokens, ``);
  if (layout) lines.push(`## Layout`, ``, layout, ``);
  if (states) { lines.push(`## States`, ``); lines.push(...states.split(",").map(s => `- ${s.trim()}`)); lines.push(``); }
  lines.push(`## Dark Mode`, ``, darkMode || "Not specified", ``, `## Related Patterns`, ``, ...(related ? related.split(",").map(r => `- ${r.trim()}`) : ["- None"]), ``, `## Tags`, ``, tags, ``);
  return lines.join("\n");
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  // ── Phase 1: Components from Strapi ──────────────────────────────────────
  console.log(`Fetching components from ${STRAPI_BASE}...`);

  const components = await fetchComponents();
  const withExamples = components.filter(c => c.CodeExamples?.length);
  console.log(`Found ${components.length} components, ${withExamples.length} with code examples`);

  mkdirSync(COMPONENTS_DIR, { recursive: true });

  let compWritten = 0;
  for (const component of withExamples) {
    const filename = `${slugify(component.Title)}.md`;
    const filepath = join(COMPONENTS_DIR, filename);
    writeFileSync(filepath, buildComponentMarkdown(component), "utf-8");
    console.log(`  ✅ ${component.Title} → corpus/components/${filename} (${component.CodeExamples!.length} examples)`);
    compWritten++;
  }

  console.log(`\nDone. ${compWritten} markdown files written to corpus/components/`);

  // ── Phase 2: UI Patterns ─────────────────────────────────────────────────
  console.log(`\nGenerating pattern markdown from Patterns/ → corpus/patterns/...`);

  mkdirSync(PATTERNS_DIR, { recursive: true });

  const entries = readdirSync(PATTERNS_SRC);
  let patWritten = 0;

  for (const entry of entries) {
    const src = join(PATTERNS_SRC, entry);
    if (!statSync(src).isDirectory()) continue;

    // Need either a meta.json or an HTML file to build from
    const files = readdirSync(src);
    const hasMeta = files.includes("meta.json");
    const htmlFiles = files.filter(f => extname(f) === ".html");
    if (!hasMeta && htmlFiles.length === 0) continue;

    const slug = slugify(entry);
    const mdPath = join(PATTERNS_DIR, `${slug}.md`);
    const md = buildPatternMarkdown(src, entry);
    if (!md) continue;

    writeFileSync(mdPath, md, "utf-8");
    const source = hasMeta ? "meta.json" : "HTML comment";
    console.log(`  ✅ ${entry} → corpus/patterns/${slug}.md (from ${source})`);
    patWritten++;
  }

  console.log(`\nDone. ${patWritten} markdown files written to corpus/patterns/`);

  // ── Summary ───────────────────────────────────────────────────────────────
  console.log(`\n─────────────────────────────────────────`);
  console.log(`Corpus ready for Graphify:`);
  console.log(`  corpus/components/  ${compWritten} .md files (component specs)`);
  console.log(`  corpus/patterns/    ${patWritten} .md files (UI pattern specs)`);
  console.log(`\nNext: /graphify corpus/`);
}

async function fetchComponents(): Promise<StrapiComponent[]> {
  const params = new URLSearchParams({ "pagination[pageSize]": "100" });

  // Populate all fields needed for the "why" layer — not just code examples.
  // Field names must match Strapi exactly (including typos like "Accessiblity").
  const populateFields = [
    "Usage",
    "Guidelines",
    "Guidelines.GuidelineElement",
    "Guidelines.GuidelineElement.DoAndDont",
    "Guidelines.GuidelineElement.DoAndDont.Do",
    "Guidelines.GuidelineElement.DoAndDont.Dont",
    "Accessiblity",
    "Accessiblity.AccessiblityElement",
    "Accessiblity.AccessiblityElement.DoAndDont",
    "Accessiblity.AccessiblityElement.DoAndDont.Do",
    "Accessiblity.AccessiblityElement.DoAndDont.Dont",
    "Overview",
    "Overview.Anatomy",
    "Overview.Type",
    "Overview.Type.TypeElements",
    "Overview.States",
    "CodeExamples",
  ];
  populateFields.forEach((field, i) => params.set(`populate[${i}]`, field));

  const headers: Record<string, string> = {};
  if (STRAPI_TOKEN) headers["Authorization"] = `Bearer ${STRAPI_TOKEN}`;
  const res = await fetch(`${STRAPI_BASE}/api/components?${params}`, { headers });
  if (!res.ok) throw new Error(`Strapi ${res.status}: ${await res.text()}`);
  const json = (await res.json()) as { data: StrapiComponent[] };
  return json.data ?? [];
}

main().catch(err => {
  console.error("Error:", err.message);
  process.exit(1);
});
