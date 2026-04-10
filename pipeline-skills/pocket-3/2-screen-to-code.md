# Pocket 3 — Step 2: Screen to Code

## Goal
Generate production-ready code for each screen defined in the Pocket 1 FigJam output, using BrandSync design tokens and corpus patterns.

## Inputs
- Pocket 1 handoff: `figjam_file_key`, `screens[]`, `component_names[]`
- Framework (from Step 1)
- BrandSync corpus: components + patterns + tokens

## Execution

### For each screen in `screens[]`:

**2a — Match corpus pattern**
Call `search_guidelines(query: "<screen name> pattern layout")` to find if a matching pattern exists in the corpus.
If a match is found: use it as the code skeleton. Reference `corpus/patterns/<slug>.md` for component list and token usage.
If no match: compose from individual components.

**2b — Resolve components**
For each component in the screen:
- Call `get_component(name)` to get full spec, variants, and code examples
- Use the code example matching the target framework
- Never invent component names — only use components returned by `list_components()` or `get_component()`

**2c — Resolve tokens**
Call `get_tokens()` once per screen. Apply tokens from the corpus pattern (if matched) or derive from component specs.
Rules:
- Surfaces: `--surface-base` → `--surface-raised` → `--surface-container` (never skip layers)
- Text: `--text-default` for body, `--text-secondary` for labels, `--text-on-action` for button text
- Never use raw hex values or hardcoded sizes — only `var(--token-name)`

**2d — Generate code**
Combine: pattern skeleton + component code examples + token values → output component file.

Output format per framework:
- **React**: `.tsx` file with named export, props typed, tokens as CSS vars in `style` or CSS module
- **Vue**: `.vue` SFC with `<template>`, `<script setup>`, `<style scoped>` using CSS vars
- **Angular**: `.component.ts` + `.component.html` + `.component.scss` with CSS vars
- **HTML**: `.html` with `<link rel="stylesheet">` to `_tokens.css`, BEM class names

**2e — Check previous attempt notes**
If `get_attempt_history` showed prior rejections with `feedback_note`, address those specific issues in this attempt.

## Output (internal — do not print raw code)
Collect all generated files as `{ name, content }` pairs. Pass to Step 3 (approval check).

## Rules
- One file per screen minimum. Split complex screens into layout + sub-components.
- All token references via `var(--token-name)` — no hardcoded values.
- No placeholder components — every component must exist in the BrandSync corpus.
- If a required component is not in the corpus: note it as a gap, do not invent it.
