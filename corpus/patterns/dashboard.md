# Dashboard (List View)

**Type:** UI Pattern (full screen)
**Category:** dashboard, data-display
**Responsive:** Desktop, Tablet, Mobile

## Use Case

Primary landing screen after login. App shell pattern used across all EG products. Contains the full navigation structure (sidebar + tabs) with a main content area showing a searchable, filterable, paginated data table. Use this as the base layout for any screen that lists records and allows navigation between sections.

## Components Used

- Navigation Drawer
- Tabs
- Input Fields
- Buttons
- Table
- Pagination
- Avatar
- Menu
- Chips

## Design Tokens

- `--bs-color-surface-base`
- `--bs-color-surface-raised`
- `--bs-color-surface-overlay`
- `--bs-color-text-default`
- `--bs-color-text-secondary`
- `--bs-color-text-muted`
- `--bs-color-text-inverse`
- `--bs-color-border-default`
- `--bs-color-primary-default`
- `--bs-color-primary-hover`

## Layout

App shell: collapsible left sidebar (Navigation Drawer), top tabs, main content area with toolbar and data table.

## States

- Default
- Loading
- Empty

## Dark Mode

Supported via `data-theme="dark"`

## Related Patterns

- Login
- Form
- User Management
- Personal Details
- Empty State

## Tags

dashboard, list, data-table, app-shell, navigation, landing
