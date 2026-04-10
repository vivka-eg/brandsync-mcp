# Search Results

**Type:** UI Pattern (full screen)
**Category:** search, data-display
**Responsive:** Desktop, Tablet, Mobile

## Use Case

Full-page search results screen. Triggered from the global search bar. Shows results across multiple entity types (documents, users, risks, locations) with a filter sidebar for narrowing results by type, date, and status. Use whenever the product has cross-entity search functionality.

## Components Used

- Navigation Drawer
- Input Fields
- Tabs
- Chips
- Buttons
- Pagination
- Empty State

## Design Tokens

- `--bs-color-surface-base`
- `--bs-color-surface-container`
- `--bs-color-surface-hover`
- `--bs-color-surface-selected`
- `--bs-color-text-default`
- `--bs-color-text-secondary`
- `--bs-color-text-muted`
- `--bs-color-border-default`

## Layout

App shell: search bar header (full-width), type tabs, two-column body: filter sidebar (240px) + results grid.

## States

- Default
- Loading
- No Results
- Filtered

## Dark Mode

Supported via `data-theme="dark"`

## Related Patterns

- Dashboard
- Empty State
- User Management

## Tags

search, results, filter, cross-entity, faceted-search, sidebar
