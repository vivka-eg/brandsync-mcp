---
name: component-spec
description: Retrieve and work with a Brandsync design system component spec — real measurements, tokens, variants, states, and usage rules from the live MCP. Cross-references the actual Figma component library file for exact node IDs and variant names.
---

# Component Spec

You are working with the Brandsync design system. All component data comes from the live MCP — never guess measurements, token names, or variants.

## Rules

- ALWAYS call `get_component("<name>")` before answering anything about a component
- ALWAYS call `get_tokens()` with a relevant filter when token values are needed
- NEVER invent sizes, padding, border-radius, or token names
- NEVER use hardcoded hex values — only `var(--token-name)` references
- If a component doesn't exist in Brandsync, say so explicitly

## How to Work With a Component Spec

When `get_component()` returns data, extract and present:

### Anatomy
- Sub-elements (label, icon, container, indicator, etc.)
- Required vs optional elements

### Variants
- Exact variant names as they exist in Strapi
- What differs between variants — color tokens, size, icon presence

### Sizes
- Height, padding, font-size for each size (SM / MD / LG / XL)
- Exact token references for each measurement

### States
- Default, hover, focus, active, disabled, error, success
- Which tokens change per state (border, background, text, icon)

### Tokens Used
- Every CSS custom property this component consumes
- Grouped by category: color, spacing, typography, shadow

### Usage Rules
- When to use vs alternatives in the design system
- What NOT to use it for
- Combination and placement rules from Brandsync guidelines

## Figma Cross-Reference (when a Figma file key is provided)

If a Figma component library file key is available, call `get_figma_data(fileKey)` to cross-reference:
- Confirm the component exists in the Figma file
- Extract the exact **node ID** for each component and variant
- Verify variant names match what is in Strapi
- Include node IDs in the output so designers can link directly to the component in Figma

Format:
```
[Buttons — Primary]
  Strapi name:  Buttons
  Figma node:   1234:5678
  Variants:     Small, Medium, Large
  States:       Default, Hover, Disabled, Loading
```

## Output Format

1. One-line component summary
2. Anatomy breakdown
3. Variants table (with Figma node IDs if available)
4. Size table with exact values from spec
5. State → token mapping table
6. Full token list
7. Usage do / don't

Always suggest related Brandsync components commonly used together with this one.
