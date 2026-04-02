import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

// ─── Server ──────────────────────────────────────────────────────────────────

const server = new McpServer({
  name: "brandsync-mcp",
  version: "0.1.0",
});

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Reads live tokens.css from the installed brandsync-tokens npm package.
 *  import.meta.resolve respects the package exports map. */
function loadTokenCSS(): string {
  const tokenPath = fileURLToPath(import.meta.resolve("brandsync-tokens/tokens.css"));
  return fs.readFileSync(tokenPath, "utf8");
}

/** Parses tokens.css into a flat { '--bs-token': 'value' } map */
function parseTokens(css: string): Record<string, string> {
  const tokens: Record<string, string> = {};
  const re = /(--bs-[\w-]+)\s*:\s*([^;]+);/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(css)) !== null) {
    tokens[m[1].trim()] = m[2].trim();
  }
  return tokens;
}

/** Resolves the path to a component spec JSON file */
function specPath(component: string): string {
  return path.resolve(
    process.cwd(),
    "src/components",
    component,
    `${component}.spec.json`
  );
}

/** Resolves the guidelines directory */
function guidelinesDir(): string {
  return path.resolve(process.cwd(), "src/guidelines");
}

// ─── Tool: get_tokens ────────────────────────────────────────────────────────

server.tool(
  "get_tokens",
  "Returns live design tokens from the brandsync-tokens npm package. Optionally filter by category prefix (e.g. 'color', 'spacing', 'font').",
  {
    filter: z
      .string()
      .optional()
      .describe("Optional prefix to filter tokens e.g. 'color', 'spacing', 'font-size'"),
    format: z
      .enum(["flat", "grouped"])
      .optional()
      .default("flat")
      .describe("'flat' returns all tokens as key/value pairs. 'grouped' groups by category."),
  },
  async ({ filter, format }) => {
    const css = loadTokenCSS();
    let tokens = parseTokens(css);

    // Apply filter
    if (filter) {
      const prefix = `--bs-${filter}`;
      tokens = Object.fromEntries(
        Object.entries(tokens).filter(([k]) => k.startsWith(prefix))
      );
    }

    if (Object.keys(tokens).length === 0) {
      return {
        content: [{ type: "text", text: `No tokens found${filter ? ` matching '--bs-${filter}'` : ""}.` }],
      };
    }

    // Grouped format — bucket by second segment e.g. --bs-COLOR-xxx → color
    if (format === "grouped") {
      const groups: Record<string, Record<string, string>> = {};
      for (const [k, v] of Object.entries(tokens)) {
        const seg = k.split("-")[2] ?? "other";
        groups[seg] ??= {};
        groups[seg][k] = v;
      }
      return {
        content: [{ type: "text", text: JSON.stringify(groups, null, 2) }],
      };
    }

    return {
      content: [{ type: "text", text: JSON.stringify(tokens, null, 2) }],
    };
  }
);

// ─── Tool: get_component_spec ─────────────────────────────────────────────────

server.tool(
  "get_component_spec",
  "Returns the full structured spec for a Brandsync design system component — anatomy, variants, sizes, token mappings, usage rules, and accessibility requirements.",
  {
    component: z
      .string()
      .describe("Component name with correct casing e.g. 'Button', 'Input', 'Modal'"),
    section: z
      .enum(["overview", "specification", "usage", "guidelines", "accessibility", "all"])
      .optional()
      .default("all")
      .describe("Which section of the spec to return. Defaults to all."),
  },
  async ({ component, section }) => {
    const p = specPath(component);

    if (!fs.existsSync(p)) {
      // List available specs to help the caller
      const componentsDir = path.resolve(process.cwd(), "src/components");
      const available = fs.existsSync(componentsDir)
        ? fs.readdirSync(componentsDir).filter((d) =>
            fs.existsSync(path.join(componentsDir, d, `${d}.spec.json`))
          )
        : [];

      return {
        content: [
          {
            type: "text",
            text: `No spec found for "${component}".${
              available.length
                ? ` Available components: ${available.join(", ")}`
                : " No spec files exist yet — create src/components/{Name}/{Name}.spec.json"
            }`,
          },
        ],
      };
    }

    const spec = JSON.parse(fs.readFileSync(p, "utf8"));
    const result = section === "all" ? spec : { component: spec.component, [section]: spec[section] };

    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
    };
  }
);

// ─── Tool: search_guidelines ──────────────────────────────────────────────────

server.tool(
  "search_guidelines",
  "Searches Brandsync design system guidelines (markdown files) by keyword. Returns matching excerpts with file references.",
  {
    query: z.string().describe("Keyword or phrase to search for e.g. 'button', 'color contrast', 'spacing'"),
    maxResults: z
      .number()
      .optional()
      .default(5)
      .describe("Maximum number of matching excerpts to return"),
  },
  async ({ query, maxResults }) => {
    const dir = guidelinesDir();

    if (!fs.existsSync(dir)) {
      return {
        content: [
          {
            type: "text",
            text: "Guidelines directory not found at src/guidelines/. Create markdown files there to enable search.",
          },
        ],
      };
    }

    const files = fs
      .readdirSync(dir)
      .filter((f) => f.endsWith(".md"));

    if (files.length === 0) {
      return {
        content: [{ type: "text", text: "No guideline files found in src/guidelines/." }],
      };
    }

    const q = query.toLowerCase();
    const results: { file: string; excerpt: string }[] = [];

    for (const file of files) {
      if (results.length >= maxResults) break;
      const content = fs.readFileSync(path.join(dir, file), "utf8");
      const lines = content.split("\n");

      for (let i = 0; i < lines.length; i++) {
        if (results.length >= maxResults) break;
        if (lines[i].toLowerCase().includes(q)) {
          // Return a window of context around the match
          const start = Math.max(0, i - 2);
          const end = Math.min(lines.length - 1, i + 3);
          results.push({
            file,
            excerpt: lines.slice(start, end).join("\n").trim(),
          });
        }
      }
    }

    if (results.length === 0) {
      return {
        content: [{ type: "text", text: `No guidelines found matching "${query}".` }],
      };
    }

    const output = results
      .map((r, i) => `[${i + 1}] ${r.file}\n${r.excerpt}`)
      .join("\n\n---\n\n");

    return {
      content: [{ type: "text", text: output }],
    };
  }
);

// ─── Start ───────────────────────────────────────────────────────────────────

const transport = new StdioServerTransport();
await server.connect(transport);