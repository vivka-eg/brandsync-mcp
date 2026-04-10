# Notifications / Alerts

**Type:** UI Pattern (full screen)
**Category:** feedback, communication
**Responsive:** Desktop, Tablet, Mobile

## Use Case

Notification centre showing system alerts, activity updates, and risk flags. Accessed from a bell icon in the header or as a dedicated page. Tabs separate All / Unread / Archived. Each item shows icon, title, description, timestamp, and an action. Use for any in-app messaging or alert feed.

## Components Used

- Navigation Drawer
- Tabs
- Badge
- Buttons
- Chips
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

App shell with sidebar, notification feed with top tabs and filter chips. Items grouped by date with dividers.

## States

- Default
- Unread
- Archived
- Empty

## Dark Mode

Supported via `data-theme="dark"`

## Related Patterns

- Dashboard
- Empty State

## Tags

notifications, alerts, feed, communication, badge, unread
