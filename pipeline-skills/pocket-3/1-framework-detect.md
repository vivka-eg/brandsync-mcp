# Pocket 3 — Step 1: Framework Detection & Foundation Setup

## Goal
Detect the target framework from the codebase, then ensure BrandSync foundation tokens are installed and imported before generating any UI.

---

## 1a — Detect framework

Read `package.json` in the current working directory (the target frontend project — not BrandSync MCP itself).

Check `dependencies` and `devDependencies` for these markers:

| Package present | Framework |
|---|---|
| `react` or `react-dom` | React |
| `vue` | Vue |
| `@angular/core` | Angular |
| None of the above | Ask the user |

If `package.json` is missing or the project root is unclear, ask: "Which framework is this project using? React / Vue / Angular / HTML"

If the user has a previous attempt with `framework` set in the handoff (from `get_attempt_history`), confirm with them before using it — the project may have changed.

**Output (internal):**
```
framework: React | Vue | Angular | HTML
```

---

## 1b — Install BrandSync foundation tokens

Check whether `brandsync-tokens` is already in `package.json` dependencies.

**If not installed:**
```bash
npm install brandsync-tokens
```

Then import the token CSS into the project's global entry point:

| Framework | Where to import |
|---|---|
| React | `src/index.tsx` or `src/main.tsx` — add `import 'brandsync-tokens/dist/css/tokens.css'` |
| Vue | `src/main.ts` — add `import 'brandsync-tokens/dist/css/tokens.css'` |
| Angular | `angular.json` → `projects.<name>.architect.build.options.styles` array — add `"node_modules/brandsync-tokens/dist/css/tokens.css"` |
| HTML | Add `<link rel="stylesheet" href="node_modules/brandsync-tokens/dist/css/tokens.css">` to the HTML `<head>` |

**If already installed:** confirm the import exists in the entry point. If not, add it.

---

## Rules
- Always install tokens before generating any component code — the CSS vars must exist at runtime.
- Never hardcode hex values or pixel sizes — all styling uses `var(--token-name)`.
- The tokens CSS file exposes `--bs-*` variables. In component code, use the short-name aliases from `Patterns/_tokens.css` (e.g. `--surface-base`, `--text-default`) — these are defined in BrandSync corpus. If the target project does not have `_tokens.css`, check `corpus/tokens.md` for the full alias list.
