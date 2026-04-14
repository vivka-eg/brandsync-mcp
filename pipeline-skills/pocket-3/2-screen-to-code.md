# Pocket 3 — Step 2: Screen to Code

## Goal
Resolve the intent into BrandSync components, read the target project, then build the UI into it. The intent may come from a Jira handoff, a natural language request, or anything else.

Do not invent structure. Do not generate boilerplate. Read first, then build.

---

## 2a — Resolve screens from intent

If a Jira ticket was provided and `load_handoff(ticket, 1)` returned screen names, use those.

Otherwise derive screens from the user's intent directly:

| Intent | Screens to generate |
|---|---|
| "add a table" | one component file with the table |
| "build a login screen" | Login screen + optional ForgotPassword |
| "create a service request form" | Form, Confirm, Detail |
| "make a dashboard" | Dashboard with metrics + list |
| Anything else | ask the user: "Which screens should I generate?" |

Use the minimum number of screens that fully covers the intent. Do not add screens the user didn't ask for.

---

## 2b — Query the knowledge graph

Before writing any code, call `query_graph` with the intent:

```
query_graph(question: "<intent in plain words>", mode: "bfs", depth: 3)
```

Examples:
- `query_graph("data table with filters")`
- `query_graph("login authentication form")`
- `query_graph("service request form dashboard list detail")`
- `query_graph("dashboard metrics cards")`

The graph returns matching patterns, component relationships, known variants, and learnings from all previous runs across all users.

**Record the node IDs returned.** Save them immediately:

```
save_handoff(session_id, 3, { retrieved_node_ids: [<node IDs>], intent: "<user's intent>" })
```

Use `session_id` if no ticket exists. If a ticket exists, use the ticket key.

If no nodes match, note it as a potential gap. Continue with components inferred from the intent.

---

## 2c — Read the target project structure

Before writing a single line of code, read the actual project:

1. **Read `package.json`** — confirm framework, installed libraries, routing, styling approach.
2. **Scan `src/`** — identify where screens/pages live, where shared components live, naming conventions, file structure.
3. **Read 1–2 existing screen files** — understand actual code style: hooks, state management, routing, prop conventions.
4. **Check if `brandsync-tokens` is already imported** in the global entry point.

Only after reading the project should you write any code.

---

## 2d — Resolve components

For each component the graph or intent identifies, call `get_component(name)` to get:
- Exact token names (`--bs-*`)
- All variants and CSS classes
- States (loading, disabled, error, focus)
- Code examples per variant
- Accessibility requirements

Do not guess token names or variant class names. Every `var(--bs-*)` and CSS class must come from a `get_component` or `get_tokens` call.

Use `search_guidelines(query)` if the graph result was not specific enough.

---

## 2e — Build into the project

Write files directly into the target project following its conventions:

- Place files where the project's existing screens live
- Follow the naming pattern of existing files
- Use the same styling approach (CSS Modules, Tailwind, Styled Components, SCSS — match what's already there)
- Import tokens via `var(--bs-*)` — no hardcoded values
- Implement all states: loading, empty, error, default
- Match component structure to what the graph pattern describes

For each file created, also check:
- Does it need a route registered?
- Does it need shared types?
- Does it need a shared sub-component?

---

## Rules

- **Query the graph first** — even for simple intents like "add a table". Previous learnings may apply.
- **Save retrieved_node_ids immediately after querying** — the learning loop depends on it.
- **Use get_component for exact variant/token detail** — the graph is too coarse for production code.
- **Read the project first. Always.**
- **Never hardcode values** — all colours, spacing, radius from `var(--bs-*)`
- **If a required pattern doesn't exist**, note it as a gap in `feedback_note` — do not approximate
- **One screen = one file** minimum. Split into sub-components if the pattern spec says so.
- **Implement all states** — a screen with no loading/error state is incomplete.
- **Ticket is optional** — session_id is sufficient. Never block on a missing ticket.
