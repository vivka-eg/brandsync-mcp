# Empty State

**Type:** UI Pattern (full screen)
**Category:** feedback, data-display
**Responsive:** Desktop, Tablet, Mobile

## Use Case

Shown inside the app shell whenever a list, table, or content area has no data to display. Covers three triggers: no items exist yet (zero state), no search/filter results (no match), or an error preventing data load (error state). Use this pattern as a slot inside any list view to handle the empty case gracefully.

## Components Used

- Navigation Drawer
- Tabs
- Buttons
- Input Fields
- Chips

## Design Tokens

- `--bs-color-surface-base`
- `--bs-color-surface-container`
- `--bs-color-surface-hover`
- `--bs-color-text-default`
- `--bs-color-text-secondary`
- `--bs-color-text-muted`
- `--bs-color-icons-neutral-default`
- `--bs-color-icons-muted`
- `--bs-color-border-default`

## Layout

App shell with sidebar and tabs. Centered empty state content (icon + heading + body + CTA) fills the main content area.

## States

- Zero State
- No Results
- Error State

## Dark Mode

Supported via `data-theme="dark"`

## Related Patterns

- Dashboard
- User Management
- Search Results
- Form

## Tags

empty-state, zero-state, no-results, error-state, feedback
