# BrandSync Pipeline — From Requirement to Figma Design

A fully connected pipeline from Jira ticket to production-ready Figma design.
No manual token lookups. No component guessing. No back-and-forth.

---

## Overview

```
Jira
  ↓
Claude Console Project
  (Atlassian MCP + BrandSync MCP + Designer Skills Chain)
  ↓
Structured Design Spec
  ↓
Figma Plugin
  ↓
Figma Design
```

Two personas. Two interfaces. One continuous pipeline.

- **PO** — works in Claude Console. Pulls tickets, refines requirements, outputs specs.
- **Designer** — works in Figma. Plugin reads the spec, generates designs.

---

## Phase 1 — Requirement Intake
**Status: Pending (Atlassian MCP integration)**

### What happens
New Jira tickets are pulled automatically into the Claude Console Project via the Atlassian MCP. As requirements come in, the project context builds up — each ticket adds to the history of what's been built, what components are in use, and what patterns are established.

### Tools
- **Atlassian MCP** — connects Claude Console to Jira, pulls tickets by ID or query
- **Claude Console Project** — accumulates context over time, gets smarter with every sprint

### Input
```
PO: "Refine PROJ-123"
```

### Output
Raw Jira ticket content — title, description, acceptance criteria — loaded into Claude's context.

### What's needed
- Atlassian MCP connected in Claude Console project settings
- Claude Console project created for the product team

---

## Phase 2 — Designer Skills Chain
**Status: Ready (skills exist, system prompt to be written)**

### What happens
Claude runs the raw requirement through the designer skills chain in sequence. Each skill builds on the previous one, progressively turning a rough ticket into a precise design brief. The chain cross-references the BrandSync component library and guidelines at every step.

### Skills chain

**Step 1 — UX Strategy**
- Why are we building this?
- What user problem does it solve?
- What is the success metric?
- What are the constraints?

**Step 2 — Design Research**
- Who is the user?
- What are their goals and pain points?
- What existing patterns apply?
- What are the edge cases?

**Step 3 — Interaction Design**
- What are the user flows?
- What states does each screen have?
- What are the error, empty, loading, and success states?
- What is the interaction model?

**Step 4 — Design Systems**
- Which BrandSync components cover this requirement?
- Which token categories apply (color, spacing, typography)?
- Are there any component gaps that need new patterns?
- What variants and sizes are needed?

### Tools
- **BrandSync MCP** — `list_components`, `search_guidelines`, `get_tokens`
- **Claude Console Project system prompt** — wires skills into ordered chain

### Input
Raw Jira ticket

### Output
Structured design brief:
- User flows
- Screen list with states
- Component mapping (BrandSync component → screen usage)
- Token references
- Acceptance criteria

### What's needed
- Claude Project system prompt written and tested
- Designer skills injected into the project context

---

## Phase 3 — Structured Design Spec
**Status: Format to be defined**

### What happens
The UI Design skill produces a structured output in an agreed format. This is the handoff document — the contract between Claude Console and the Figma plugin. It must be precise enough that the plugin can execute it without ambiguity.

### Spec format (to be defined)
```json
{
  "ticket": "PROJ-123",
  "screens": [
    {
      "name": "Settings — User Profile",
      "layout": "single-column-form",
      "components": [
        {
          "component": "bs-input",
          "variant": "default",
          "states": ["default", "focus", "error", "disabled"],
          "label": "Full name",
          "tokens": ["--bs-color-primary-default", "--bs-border-neutral-container"]
        },
        {
          "component": "bs-btn",
          "variant": "primary",
          "size": "MD",
          "label": "Save changes"
        }
      ],
      "flows": ["happy path", "validation error", "success confirmation"],
      "darkMode": true
    }
  ]
}
```

### What's needed
- Define the full spec schema
- Align schema between Claude output and Figma plugin input

---

## Phase 4 — Figma Plugin
**Status: To be built**

### What happens
The designer opens the BrandSync Figma plugin. It reads the structured design spec and generates Figma frames directly — using existing Figma variables (BrandSync tokens), following component structure, applying correct states and variants.

### What the plugin does
1. Reads structured spec (from clipboard, file, or direct Claude → plugin handoff)
2. Maps `bs-` components to Figma component library
3. Maps `--bs-*` token references to Figma variables (already synced via `sync-brandsync-tokens.mjs`)
4. Creates frames for each screen in the spec
5. Applies correct layout, spacing, states, and dark mode variants

### Tools
- **Figma Plugin API** — native write access, no Desktop Bridge needed
- **BrandSync tokens → Figma variables** — synced via `figma-console-mcp/scripts/sync-brandsync-tokens.mjs`
- **BrandSync component library** — existing Figma components mapped to `bs-` naming

### Input
Structured design spec (Phase 3 output)

### Output
Figma frames — production-ready, token-linked, ready for designer review and handoff

### What's needed
- Define spec format (Phase 3)
- Build Figma plugin
- Ensure Figma variables are synced (`node scripts/sync-brandsync-tokens.mjs`)

---

## Phase 5 — Jira Integration
**Status: Pending**

### What happens
Atlassian MCP connects Claude Console directly to Jira. New tickets trigger the pipeline automatically. PO no longer needs to paste ticket content — just references the ticket ID.

### Tools
- **Atlassian MCP** — official Atlassian MCP server for Claude Console

### What's needed
- Atlassian MCP configured and connected in Claude Console
- Claude Project updated to use `pull_ticket(id)` as entry point

---

## Current State Summary

| Phase | What | Status |
|-------|------|--------|
| 1 | Requirement intake via Jira | Pending — Atlassian MCP |
| 2 | Designer skills chain | Ready — system prompt to write |
| 3 | Structured design spec format | To define |
| 4 | Figma plugin | To build |
| 5 | Jira auto-trigger | Pending |

## What's already built and ready

| Component | Status |
|-----------|--------|
| BrandSync MCP — `get_tokens`, `get_component`, `list_components`, `search_guidelines` | ✅ |
| 218 component examples — `--bs-*` tokens, `bs-` namespaced, self-describing headers | ✅ |
| Dark mode — package-driven via `data-theme="dark"`, no hardcoded overrides | ✅ |
| Token sync script — `sync-brandsync-tokens.mjs` strips `bs-` for Figma variables | ✅ |
| Designer skills — full chain (ux-strategy, design-research, interaction-design, design-systems) | ✅ |
| Figma Console MCP — 94 tools, write access, Desktop Bridge | ✅ |

---

## Build Order

```
1. Define spec format (Phase 3)
        ↓
2. Write Claude Project system prompt (Phase 2)
        ↓
3. Build Figma plugin (Phase 4)
        ↓
4. Connect Atlassian MCP (Phase 1 + 5)
```

Spec format first — the plugin, the system prompt, and the Jira integration all depend on it.
