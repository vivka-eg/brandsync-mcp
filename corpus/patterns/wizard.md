# Wizard / Multi-Step Form

**Type:** UI Pattern (full screen)
**Category:** form, workflow, onboarding
**Responsive:** Desktop, Tablet, Mobile

## Use Case

Guides the user through a complex task split into sequential steps — onboarding, creating a new record (risk assessment, document, user invite), or a multi-stage configuration process. Each step validates before advancing. Use whenever a task has 3+ distinct phases that should not all be visible at once.

## Components Used

- Navigation Drawer
- Progress Stepper
- Input Fields
- Select
- Radio Button
- Checkbox
- Buttons
- Card

## Design Tokens

- `--bs-color-surface-base`
- `--bs-color-surface-container`
- `--bs-color-surface-hover`
- `--bs-color-text-default`
- `--bs-color-text-secondary`
- `--bs-color-text-muted`
- `--bs-color-primary-default`

## Layout

App shell with sidebar, horizontal stepper at top, step content card in center, sticky footer with Back/Next actions.

## States

- Step 1
- Step N
- Review
- Success

## Dark Mode

Supported via `data-theme="dark"`

## Related Patterns

- Form
- Settings
- User Management

## Tags

wizard, multi-step, form, onboarding, workflow, stepper, sequential
