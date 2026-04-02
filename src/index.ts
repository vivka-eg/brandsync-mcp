#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Resolve the path to a file inside the brandsync-tokens npm package.
 *  Uses import.meta.resolve so it follows Node's standard ESM resolution —
 *  i.e. it reads from whatever version `npm install brandsync-tokens` put in node_modules. */
async function resolveTokensFile(filename: string): Promise<string> {
  // Try direct resolution first (works when package exports the file)
  try {
    return fileURLToPath(await import.meta.resolve(`brandsync-tokens/${filename}`));
  } catch {
    // Fallback: resolve via package root
    const pkgUrl = await import.meta.resolve("brandsync-tokens/package.json");
    return path.join(path.dirname(fileURLToPath(pkgUrl)), filename);
  }
}

/** Parse a CSS file and return all custom properties (--bs-* lines). */
function parseCssTokens(
  css: string,
  prefix?: string
): Record<string, string> {
  const result: Record<string, string> = {};
  // Match lines like:  --bs-color-primary-default: #1a2b3c;
  const re = /^\s*(--bs-[a-z0-9-]+)\s*:\s*(.+?);?\s*$/gm;
  let m: RegExpExecArray | null;
  while ((m = re.exec(css)) !== null) {
    const [, name, value] = m;
    if (!prefix || name.startsWith(`--bs-${prefix}`)) {
      result[name] = value.trim();
    }
  }
  return result;
}

/** Walk a directory recursively and collect files matching a glob-like predicate. */
async function walkDir(
  dir: string,
  predicate: (file: string) => boolean
): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const results: string[] = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...(await walkDir(full, predicate)));
    } else if (predicate(full)) {
      results.push(full);
    }
  }
  return results;
}

// ---------------------------------------------------------------------------
// Server
// ---------------------------------------------------------------------------

const server = new McpServer({
  name: "brandsync",
  version: "0.1.0",
});

// ------------------------------------------------------------------
// Tool: get_tokens
// ------------------------------------------------------------------
server.tool(
  "get_tokens",
  "Read live design tokens from the brandsync-tokens npm package. Optionally filter by a prefix segment (e.g. 'color', 'spacing', 'typography').",
  {
    prefix: z
      .string()
      .optional()
      .describe(
        "Optional token category prefix without --bs- (e.g. 'color', 'spacing'). Omit to return all tokens."
      ),
  },
  async ({ prefix }) => {
    let css: string;
    try {
      const tokenFile = await resolveTokensFile("tokens.css");
      css = await fs.readFile(tokenFile, "utf-8");
    } catch {
      return {
        isError: true,
        content: [
          {
            type: "text",
            text: "Could not read tokens.css from brandsync-tokens. Make sure the package is installed.",
          },
        ],
      };
    }

    const tokens = parseCssTokens(css, prefix);
    const count = Object.keys(tokens).length;

    if (count === 0) {
      return {
        content: [
          {
            type: "text",
            text: prefix
              ? `No tokens found matching prefix "--bs-${prefix}".`
              : "No tokens found in tokens.css.",
          },
        ],
      };
    }

    const lines = Object.entries(tokens)
      .map(([name, value]) => `${name}: ${value};`)
      .join("\n");

    return {
      content: [
        {
          type: "text",
          text: `Found ${count} token(s)${prefix ? ` for prefix "${prefix}"` : ""}:\n\n${lines}`,
        },
      ],
    };
  }
);

// ------------------------------------------------------------------
// Tool: get_component_spec
// ------------------------------------------------------------------
server.tool(
  "get_component_spec",
  "Read the design spec JSON for a Brandsync component. Specs live at src/components/{Name}/{Name}.spec.json.",
  {
    name: z
      .string()
      .describe(
        "Component name in PascalCase (e.g. 'Button', 'InputField'). Case-insensitive."
      ),
  },
  async ({ name }) => {
    // Support both PascalCase and lowercase input
    const pascal = name.charAt(0).toUpperCase() + name.slice(1);
    const specPath = path.join(
      process.cwd(),
      "src",
      "components",
      pascal,
      `${pascal}.spec.json`
    );

    let raw: string;
    try {
      raw = await fs.readFile(specPath, "utf-8");
    } catch {
      // Try a case-insensitive search in the components directory
      const componentsDir = path.join(process.cwd(), "src", "components");
      try {
        const entries = await fs.readdir(componentsDir, {
          withFileTypes: true,
        });
        const match = entries.find(
          (e) => e.isDirectory() && e.name.toLowerCase() === pascal.toLowerCase()
        );
        if (match) {
          const alt = path.join(
            componentsDir,
            match.name,
            `${match.name}.spec.json`
          );
          raw = await fs.readFile(alt, "utf-8");
        } else {
          return {
            isError: true,
            content: [
              {
                type: "text",
                text: `No spec found for component "${pascal}". Expected at src/components/${pascal}/${pascal}.spec.json`,
              },
            ],
          };
        }
      } catch {
        return {
          isError: true,
          content: [
            {
              type: "text",
              text: `No spec found for component "${pascal}". Expected at src/components/${pascal}/${pascal}.spec.json`,
            },
          ],
        };
      }
    }

    // Validate it's valid JSON before returning
    try {
      JSON.parse(raw);
    } catch {
      return {
        isError: true,
        content: [
          {
            type: "text",
            text: `Spec file for "${pascal}" exists but contains invalid JSON.`,
          },
        ],
      };
    }

    return {
      content: [{ type: "text", text: raw }],
    };
  }
);

// ------------------------------------------------------------------
// Tool: search_guidelines
// ------------------------------------------------------------------
server.tool(
  "search_guidelines",
  "Search Brandsync guideline markdown files by keyword. Returns matching excerpts with file names.",
  {
    keyword: z
      .string()
      .describe("Search term (case-insensitive). Supports plain text."),
    max_results: z
      .number()
      .int()
      .min(1)
      .max(20)
      .optional()
      .default(5)
      .describe("Maximum number of matching excerpts to return (default 5)."),
  },
  async ({ keyword, max_results }) => {
    const guidelinesDir = path.join(process.cwd(), "src", "guidelines");

    let mdFiles: string[];
    try {
      mdFiles = await walkDir(
        guidelinesDir,
        (f) => f.endsWith(".md") || f.endsWith(".mdx")
      );
    } catch {
      return {
        isError: true,
        content: [
          {
            type: "text",
            text: "Could not read src/guidelines/ directory. Make sure it exists.",
          },
        ],
      };
    }

    if (mdFiles.length === 0) {
      return {
        content: [
          {
            type: "text",
            text: "No markdown files found in src/guidelines/.",
          },
        ],
      };
    }

    const needle = keyword.toLowerCase();
    const excerpts: string[] = [];

    for (const file of mdFiles) {
      if (excerpts.length >= max_results) break;
      const content = await fs.readFile(file, "utf-8");
      const lines = content.split("\n");
      const relative = path.relative(process.cwd(), file);

      for (let i = 0; i < lines.length; i++) {
        if (excerpts.length >= max_results) break;
        if (lines[i].toLowerCase().includes(needle)) {
          // Grab up to 3 lines of context
          const start = Math.max(0, i - 1);
          const end = Math.min(lines.length - 1, i + 2);
          const snippet = lines.slice(start, end + 1).join("\n");
          excerpts.push(`**${relative}** (line ${i + 1}):\n\`\`\`\n${snippet}\n\`\`\``);
        }
      }
    }

    if (excerpts.length === 0) {
      return {
        content: [
          {
            type: "text",
            text: `No results found for "${keyword}" across ${mdFiles.length} guideline file(s).`,
          },
        ],
      };
    }

    return {
      content: [
        {
          type: "text",
          text: `Found ${excerpts.length} result(s) for "${keyword}":\n\n${excerpts.join("\n\n---\n\n")}`,
        },
      ],
    };
  }
);

// ---------------------------------------------------------------------------
// Start
// ---------------------------------------------------------------------------

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  // MCP servers communicate over stdio — do not write to stdout
  process.stderr.write("Brandsync MCP server running on stdio\n");
}

main().catch((err) => {
  process.stderr.write(`Fatal: ${err}\n`);
  process.exit(1);
});
