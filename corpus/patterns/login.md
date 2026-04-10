# Login

**Type:** UI Pattern (full screen)
**Category:** auth
**Responsive:** Desktop, Tablet, Mobile

## Use Case

User authentication entry point. Use when a product requires email/password login, SSO sign-in, or any screen where a user must identify themselves before accessing the app.

## Components Used

- Input Fields
- Buttons
- Checkbox
- Links
- Card

## Design Tokens

- `--bs-color-surface-base`
- `--bs-color-text-default`
- `--typography-font-family-body`
- `--bs-color-border-neutral-focus`
- `--bs-border-width-medium`
- `--bs-spacing-25`

## Layout

Two-column split — decorative image left, form right. On mobile collapses to single-column form only.

## States

- Default
- Loading
- Error

## Dark Mode

Supported via `data-theme="dark"`

## Related Patterns

- Personal Details
- Dashboard

## Tags

authentication, login, signin, form, password, email, SSO
