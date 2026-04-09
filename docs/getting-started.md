# Getting Started

These are the subpages under the Get Started section.

---

## 1. Introduction

### What is BrandSync MCP?

BrandSync MCP is a local Model Context Protocol server that wires your design system directly into Claude. When you ask Claude to build a UI, it doesn't guess — it reads your actual tokens, your component specs, your usage rules, and your live Figma file before generating a single line of code.

The result is components that are consistent, production-ready, and on-brand — without manual correction, without token lookups, and without a back-and-forth review cycle.

### How it fits your workflow

BrandSync sits between your design system and your AI assistant. You don't change how you work — you just stop losing information in translation.

**Before BrandSync:**
1. Designer documents a component in Figma
2. Design tokens live in a separate file
3. Developer prompts an AI — which has seen neither
4. AI invents values, ignores rules, produces generic output
5. Developer corrects, re-prompts, or gives up

**With BrandSync:**
1. Designer documents a component in Figma
2. Design tokens are published to `brandsync-tokens`
3. Developer prompts Claude — which has read both via MCP
4. Claude returns spec-accurate, token-referenced output
5. Developer pastes, done

### The two servers

BrandSync runs as two local MCP servers. Both run on your machine — no data leaves, no cloud dependency.

**`brandsync-mcp`** — your design system as context

| Tool | What it does |
|---|---|
| `get_tokens` | Streams the live token set from the `brandsync-tokens` package. Filter by category (color, spacing, typography). |
| `get_component` | Returns the full spec for any component — anatomy, states, variants, usage rules, guidelines, accessibility, and token references — in one call. |
| `list_components` | Lists all available components by name. |
| `search_guidelines` | Searches your foundation articles (color, typography, layout, accessibility) by keyword. |

**`figma-console-mcp`** — your Figma file as context

Gives Claude direct read and write access to your Figma file. 94+ tools covering variable extraction, component inspection, layout creation, token management, accessibility scanning, and real-time monitoring. Runs locally via NPX or local git.

### When to use which

Use `brandsync-mcp` alone when you're generating UI from a prompt and want spec-accurate, token-referenced output.

Add `figma-console-mcp` when you need Claude to read what's *actually in your Figma file* — specific variables, component states, layout values — or when you want Claude to create or edit designs directly inside Figma.

Used together, the two servers give Claude the full picture: the rules (brandsync-mcp) and the source of truth (figma-console-mcp).

---

## 2. Understanding Tokens

### What tokens are and why they matter

Design tokens are the atomic values of your design system — colors, spacing, typography, border radii, shadows — expressed as named CSS custom properties. Instead of writing `color: #0062C1`, you write `color: var(--primary-600)`. The name carries meaning. The value can change system-wide by changing one definition.

BrandSync's token system is defined in the `brandsync-tokens` package and follows a two-layer structure: **primitives** and **semantic tokens**.

---

### Layer 1 — Primitives

Primitives are raw values with no usage intent attached. They form the palette.

```css
--primary-600: #0062C1;
--neutral-200: #C2C7D3;
--spacing-300: 24px;
--border-radius-200: 16px;
```

You should never reference primitives directly in components. They exist to give semantic tokens something to point at.

---

### Layer 2 — Semantic tokens

Semantic tokens describe *intent*, not value. They tell the system what a token is *for*.

```css
--color-primary-default:   var(--primary-600);
--surface-base:            var(--static-white);
--text-secondary:          var(--neutral-600);
--border-neutral-container: var(--neutral-200);
```

When Claude builds a component, it references semantic tokens — not primitives, not hardcoded hex values. This is what makes output portable across themes and structurally consistent.

---

### Token categories

**Color**
- `--color-primary-*` — brand blue, interactive elements, CTAs
- `--color-neutral-*` — borders, backgrounds, disabled states
- `--color-success/warning/error/info-*` — feedback states

**Text**
- `--text-default` — primary body copy
- `--text-secondary` — supporting labels, metadata
- `--text-muted` — placeholders, de-emphasised content
- `--text-action` — links and interactive text
- `--text-inverse` — text on dark/action backgrounds

**Surface**
- `--surface-base` — page background
- `--surface-raised` — card, panel background
- `--surface-container` — inset, tinted containers
- `--surface-action` — filled button backgrounds

**Border**
- `--border-neutral-container` — default card/input borders
- `--border-primary` — focus rings, active indicators

**Spacing**
- `--spacing-50` through `--spacing-1500` — 2px to 120px in a consistent scale

**Border radius**
- `--border-radius-50` (4px) through `--border-radius-full` (120px)

**Typography**
- `--font-size-xs` through `--font-size-6xl`
- `--font-weight-regular` through `--font-weight-bold`
- `--line-height-tight` through `--line-height-loose`

**Elevation / Shadow**
- `--elevation-0` through `--elevation-6` — from flat to full-screen overlay depth

---

### How Claude uses tokens

When you ask Claude to build a component, `get_tokens` is called first. Claude receives the full resolved token set — every name and its computed value. From that point, Claude generates output that only references tokens by name. It cannot invent a token that doesn't exist.

**Example — what Claude produces:**

```css
.card {
  background: var(--surface-raised);
  border: 1px solid var(--border-neutral-container);
  border-radius: var(--border-radius-200);
  padding: var(--spacing-300);
  box-shadow: var(--elevation-1);
}
```

No hardcoded values. No approximations. The output is immediately correct in any environment that loads `brandsync-tokens`.

---

### Dark mode

All semantic tokens have dark mode counterparts defined under `[data-theme="dark"]`. Claude-generated components inherit dark mode automatically — no additional prompt instruction required, because the token layer handles it.

---

## 3. Understanding Patterns

### What patterns are

Patterns are complete, working UI examples generated by Claude using `brandsync-mcp` and `figma-console-mcp`. They are not abstract templates or wireframes — they are full HTML/CSS implementations built on the actual token system, following the actual component rules.

Each pattern demonstrates what the combined toolset produces when given a realistic prompt. They serve three purposes:

1. **Reference** — show what correct, on-brand output looks like
2. **Starting point** — copy and adapt a pattern as the base for your own screen
3. **Proof of coverage** — demonstrate the breadth of what the system can generate

---

### How patterns are structured

Every pattern is a self-contained HTML file. It imports no external libraries. All values come from design tokens via CSS custom properties. The HTML structure follows BrandSync component anatomy — the same structure `get_component` would return for each component used.

Patterns include inline comments that explain which design rules are being applied and why — so you can read the output and understand the system at the same time.

---

### Available pattern categories

**Dashboards**
Full-page dashboard layouts with navigation drawer, topbar, stat cards, data tables, and activity feeds. Shows how multiple components compose into a real product screen.

**Data Tables**
Sortable columns, row actions, status badges, bulk selection, pagination. Demonstrates the table component's full range of states and configurations.

**Forms**
Single-field inputs, multi-field forms, validation states (error, success, warning), required field marking, helper text, and disabled states. Grounded in the input field component rules.

**Auth Flows**
Login, sign-up, password reset, and email verification. Single-column centered layouts following the form and button component guidelines.

**User Management**
Role assignment tables, profile editing panels, permission toggles, and access control interfaces.

**Navigation**
Expanded and collapsed sidebar drawers, topbar configurations, tab systems, and breadcrumb patterns.

---

### How to use a pattern

1. Open the pattern HTML file in a browser to see the rendered output
2. Read the inline comments to understand which rules and tokens are in use
3. Copy the file as a starting point for your own screen
4. Modify component content — the token references and structure stay intact

To generate a new pattern variant, give Claude the pattern file as context alongside a description of what you need. It will adapt the structure while keeping all token references and component rules in place.

---

## How It Works — 4 Steps

### Step 1 — Browse the pattern library

Open the pattern library and find the closest match to the screen you need to build. Each pattern is labelled by type (Dashboard, Form, Table, Auth) and shows a live preview.

You don't need an exact match. Patterns are starting points — choose the one whose structure is closest to your target.

*[Visual: pattern library grid showing thumbnails — Dashboard, Login, Table, User Management]*

---

### Step 2 — Describe your screen to Claude

Tell Claude what you need. Reference the pattern if you have one, specify your framework, and describe any variations from the base pattern.

**Example prompt:**
```
Using the Dashboard pattern as a base, build an analytics overview page in React.
Use the Brandsync token system. The stat cards should show session count, bounce rate,
avg session duration, and conversion rate. Replace the orders table with a top pages table.
```

Claude will call `get_tokens` and `get_component` automatically — reading the live token set and component specs before generating output.

*[Visual: prompt input in Claude with the example text above]*

---

### Step 3 — Review the generated output

Claude returns complete, token-referenced code. Review the output — check that the component structure matches what you need, that the tokens are correctly applied, and that the layout matches your intent.

If you're using `figma-console-mcp`, Claude can also pull variable values and component data directly from your Figma file during generation — so the output reflects the actual file, not just the spec.

*[Visual: Claude's response showing generated HTML/React code with token references highlighted]*

---

### Step 4 — Paste into your codebase

Copy the output directly into your repo. No token translation. No reformatting. No color corrections.

If your project imports `brandsync-tokens`, every `var(--token-name)` resolves correctly on load. Dark mode, theming, and responsive layout work automatically because they're handled at the token layer.

*[Visual: generated component rendered in browser, matching the Figma design]*

---

## 4. Framework Support

### How framework output works

`brandsync-mcp` is framework-agnostic. The token system and component specs are format-independent — they describe structure, rules, and values, not syntax. When you specify a framework in your prompt, Claude generates output in that framework's native idiom, with the same token references throughout.

---

### HTML / CSS

The default and most portable output format. All pattern library examples are HTML. Token references appear as CSS custom properties (`var(--token-name)`). No build step required — works anywhere that loads `brandsync-tokens`.

**Example:**
```html
<button class="btn btn-primary">New order</button>
```
```css
.btn-primary {
  background: var(--color-primary-default);
  color: var(--text-inverse);
  border-radius: var(--border-radius-75);
  padding: var(--spacing-100) var(--spacing-200);
}
```

---

### React

Output uses functional components with inline styles or CSS Modules depending on your preference. Token references can be expressed as CSS custom properties (via a stylesheet or CSS-in-JS) or resolved to their computed values for use in style objects.

**Prompt tip:** Specify `React with CSS Modules` or `React with inline styles` to control the output format.

```tsx
export function PrimaryButton({ children }: { children: React.ReactNode }) {
  return (
    <button className={styles.btnPrimary}>
      {children}
    </button>
  );
}
```

---

### Vue

Output uses Single File Components (`.vue`). Token references appear in the `<style>` block as CSS custom properties. Scoped styles are used by default.

**Prompt tip:** Specify `Vue 3 SFC with scoped styles` for clean, isolated output.

---

### Other frameworks

Claude can generate output for any framework you specify — Svelte, Angular, Web Components, or others. The token layer is always the same. Only the component syntax changes.

**Prompt tip:** Always name the exact framework and version. The more specific you are, the more idiomatic the output.

---

### Resolved values for non-CSS targets

If your framework resolves tokens at build time (React Native, Flutter, Swift UI, Tailwind config), Claude can output flat resolved values instead of CSS custom property references.

Use `get_tokens` with `format: "flat"` to get the full resolved set, then specify in your prompt that you need hardcoded values rather than CSS variable references.

**Prompt tip:**
```
Generate this component for React Native. Use resolved token values, not CSS custom properties.
```
