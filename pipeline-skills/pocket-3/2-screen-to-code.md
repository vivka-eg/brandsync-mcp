# Pocket 3 — Step 2: Screen to Code

## Goal
For each screen in the handoff, query the knowledge graph to find the matching BrandSync pattern, then use `get_component` for exact variant and token detail. Read the target project's actual structure, then build the UI into the project from scratch.

Do not invent structure. Do not generate boilerplate. Read first, then build.

---

## 2a — Query the knowledge graph

Before writing any code, call `query_graph` for the overall flow being built:

```
query_graph(question: "<brief description of what is being built>", mode: "bfs", depth: 3)
```

Examples:
- `query_graph("service request form dashboard list detail")`
- `query_graph("user login authentication form")`
- `query_graph("data table with filters and pagination")`

The graph returns matching patterns, component relationships, known variants, and cross-pattern connections from all previous pipeline runs.

**Record the node IDs returned.** After querying, immediately save them to the handoff:

```
save_handoff(ticket, 3, { retrieved_node_ids: [<list of node IDs from query result>] })
```

This is required for the learning loop — it connects the outcome back to which graph nodes were used.

If no nodes match, note it as a potential gap. Continue with components listed in the handoff's `component_names`.

---

## 2b — Read the target project structure

Before writing a single line of code, read the actual project:

1. **Read `package.json`** — confirm framework, check what component libraries, styling tools, and routing are already installed.
2. **Scan `src/`** (or equivalent) — identify:
   - Where screens/pages live (e.g. `src/pages/`, `src/views/`, `src/screens/`)
   - Where shared components live (e.g. `src/components/`)
   - How existing files are structured (naming convention, export style, file colocation)
   - Whether there's a global styles entry point where tokens are imported
3. **Read 1–2 existing screen files** — understand the actual code style (hooks pattern, how state is managed, how routing works, prop conventions)
4. **Check if `brandsync-tokens` is already imported** in the global entry point

Only after reading the project should you write any code.

---

## 2c — Resolve components

The graph result identifies which components are needed. For each component, call `get_component(name)` to get:
- Exact token names to use (`--bs-*`)
- All variants and their CSS classes
- States (loading, disabled, error, focus)
- Code examples per variant
- Accessibility requirements

Do not guess token names or variant class names. Every `var(--bs-*)` and every CSS class in the generated code must come from a `get_component` or `get_tokens` call.

Use `search_guidelines(query)` if you need to find a pattern by name and the graph result was not specific enough.

---

## 2d — Build into the project

Write files directly into the target project following its actual conventions:

- Place files where the project's existing screens live
- Follow the naming pattern of existing files (e.g. if existing screens are `UserList.tsx`, name new ones `Login.tsx` not `LoginScreen.tsx`)
- Use the same styling approach as the existing project (if it uses CSS Modules, use CSS Modules; if Tailwind, use Tailwind; if Styled Components, use Styled Components)
- Import tokens via `var(--bs-*)` — no hardcoded values
- Implement all states from the pattern spec: loading, empty, error, default
- Match the component structure to what the graph pattern describes — do not simplify or skip sections

For each screen file created, also check:
- Does it need a route registered? If so, note it.
- Does it need types/interfaces that belong in a shared types file?
- Does it need a shared sub-component that other screens will reuse?

---

## Rules

- **Query the graph first** — it finds the right pattern and related context.
- **Save retrieved_node_ids to handoff immediately after querying** — the learning loop depends on it.
- **Use get_component for exact variant/token detail** — the graph is too coarse for production code.
- **Read the project first. Always.** Never write code into a project you haven't read.
- **Never hardcode values** — all colours, spacing, radius from `var(--bs-*)`
- **If a required pattern doesn't exist in the graph**, note it as a gap in `feedback_note` when saving the attempt — do not approximate
- **One screen = one file** minimum. Split into sub-components if the pattern spec says so
- **Implement all states** — a screen with no loading/error state is incomplete
