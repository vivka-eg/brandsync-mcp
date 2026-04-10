# BrandSync Design Tokens

**Type:** Token System
**Source:** brandsync-tokens npm package (`dist/css/tokens.css`)

All tokens use the canonical `--bs-*` variable names exported by the `brandsync-tokens` package.
Import `brandsync-tokens/dist/css/tokens.css` in the project entry point to use these names.

In pattern HTML/CSS within this repo, `Patterns/_tokens.css` provides short aliases
(`--color-surface-base`, `--color-text-default`, etc.) that map to the `--bs-*` names below.

## Surface Tokens

Layered background surfaces ordered by elevation.

- `--bs-color-surface-base` — page / app background (lowest layer)
- `--bs-color-surface-raised` — cards, panels raised above base
- `--bs-color-surface-container` — contained sections, sidebars, drawers
- `--bs-color-surface-hover` — hover state background
- `--bs-color-surface-pressed` — active / pressed state background
- `--bs-color-surface-selected` — selected row or item background
- `--bs-color-surface-active` — active nav item background
- `--bs-color-surface-overlay` — modal and drawer scrim
- `--bs-color-surface-inset` — inset / recessed background
- `--bs-color-surface-inverse` — inverted surface (dark on light, light on dark)

**Rule:** Never skip layers. A card on `--bs-color-surface-base` uses `--bs-color-surface-raised`. Content inside that card uses `--bs-color-surface-container`.

## Text Tokens

- `--bs-color-text-default` — primary body text
- `--bs-color-text-secondary` — labels, captions, supporting text
- `--bs-color-text-muted` — placeholder text, disabled labels
- `--bs-color-text-inverse` — text on dark/filled backgrounds
- `--bs-color-text-on-action` — text on primary action surfaces (buttons)
- `--bs-color-text-link` — hyperlink text
- `--bs-color-text-on-disabled` — text on disabled elements

## Icon Tokens

- `--bs-color-icons-default` — primary icon color
- `--bs-color-icons-neutral-default` — supporting / decorative icons
- `--bs-color-icons-muted` — disabled or placeholder icons
- `--bs-color-icons-inverse` — icons on dark backgrounds
- `--bs-color-icons-action` — icons on primary action surfaces

## Border Tokens

- `--bs-color-border-default` — standard dividers and input borders
- `--bs-color-border-neutral-focus` — keyboard focus ring (all interactive elements)
- `--bs-color-border-primary` — primary-colored border (active inputs, selected items)

### Border Widths

- `--bs-border-width-thin` — hairline borders, dividers
- `--bs-border-width-medium` — input and card borders
- `--bs-border-width-thick` — focus rings, emphasis borders

### Border Radii

- `--bs-border-radius-50` — subtle rounding (chips inner)
- `--bs-border-radius-75` — tags, badges
- `--bs-border-radius-100` — inputs, cards (default)
- `--bs-border-radius-150` — modals, drawers
- `--bs-border-radius-200` — large cards
- `--bs-border-radius-300` — extra-large surfaces
- `--bs-border-radius-full` — pills, avatars, circular elements

## Spacing Tokens

All spacing uses a 4px base grid.

- `--bs-spacing-0` — 0px
- `--bs-spacing-25` — 2px (hairline gaps)
- `--bs-spacing-50` — 4px (tight inline spacing)
- `--bs-spacing-75` — 6px
- `--bs-spacing-100` — 8px (default gap between related items)
- `--bs-spacing-150` — 12px
- `--bs-spacing-200` — 16px (standard padding)
- `--bs-spacing-250` — 20px
- `--bs-spacing-300` — 24px (section padding)
- `--bs-spacing-350` — 28px
- `--bs-spacing-400` — 32px (large gaps)
- `--bs-spacing-500` — 40px
- `--bs-spacing-600` — 48px (section dividers)
- `--bs-spacing-700` — 56px
- `--bs-spacing-800` — 64px (hero spacing)

## Primary Color Tokens

Brand blue — use for primary CTAs, active states, links.

- `--bs-color-primary-default` — brand-600 (primary CTA background)
- `--bs-color-primary-hover` — hover state
- `--bs-color-primary-pressed` — pressed / active state
- `--bs-color-primary-container` — tinted primary background (chips, tags)
- `--bs-color-primary-focused` — focused state

## Neutral Interactive Tokens

For secondary actions, ghost buttons, neutral states.

- `--bs-color-neutral-default`
- `--bs-color-neutral-hover`
- `--bs-color-neutral-pressed`
- `--bs-color-neutral-container`

## Semantic Status Tokens

Used consistently across Badge, Chips, Snackbar, Input Fields (validation), and Alert components.

- `--bs-color-success-default` — green foreground
- `--bs-color-success-container` — green background container
- `--bs-color-error-default` — red foreground
- `--bs-color-error-container` — red background container
- `--bs-color-warning-default` — amber foreground
- `--bs-color-warning-container` — amber background container
- `--bs-color-info-default` — blue foreground
- `--bs-color-info-container` — blue background container

**Rule:** Always pair `*-default` (text/icon) with `*-container` (background). Never use `--bs-color-error-default` as a background.

## Typography Tokens

These tokens do not use the `--bs-` prefix — they are exported as-is by the package.

### Font Families

- `--typography-font-family-body` — body text, inputs, labels
- `--typography-font-family-heading` — headings, display text

### Font Sizes

- `--font-size-sm` — 14px — captions, helper text, labels
- `--font-size-md` — 16px — body text (default)
- `--font-size-lg` — 18px — subheadings, emphasis

### Font Weights

- `--typography-font-weight-regular` — 400 — body text
- `--typography-font-weight-medium` — 500 — labels, nav items
- `--typography-font-weight-semibold` — 600 — headings, button labels
- `--typography-font-weight-bold` — 700 — display headings

## Dark Mode

All surface and text tokens remap automatically under `[data-theme="dark"]` when using `Patterns/_tokens.css`.
For target projects, implement dark mode overrides manually referencing the neutral palette variables.
Apply dark mode at the root: `document.documentElement.dataset.theme = 'dark'`

## Related Concepts

- Components: all 30 BrandSync components consume these tokens
- Patterns: all 10 UI patterns reference these tokens
- Source: `node_modules/brandsync-tokens/dist/css/tokens.css`
- Aliases: `Patterns/_tokens.css` (auto-generated by `npm run build:tokens-css`)
