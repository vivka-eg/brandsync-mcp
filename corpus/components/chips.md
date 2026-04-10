# Chips

**Type:** UI Component
**Source:** BrandSync Design System (Strapi)

## Description

Chips are compact elements that represent an input, attribute, or action. They can be used to filter content, display tags, or trigger actions.

## Variants

- Primary
- Neutral
- Outlined
- Success
- Warning
- Error
- Info

## Frameworks

- HTML

## Design Tokens

- `--bs-spacing-50`
- `--bs-spacing-150`
- `--bs-border-radius-full`
- `--bs-font-size-xs`
- `--bs-line-height-snug`
- `--bs-color-primary-default`
- `--bs-text-inverse`
- `--bs-color-primary-hover`
- `--bs-color-primary-pressed`
- `--bs-color-neutral-container`
- `--bs-text-default`
- `--bs-border-default`
- `--bs-color-neutral-container-hover`
- `--bs-color-neutral-container-pressed`
- `--bs-color-primary-container`
- `--bs-color-primary-container-hover`
- `--bs-surface-success`
- `--bs-text-success`
- `--bs-border-success`
- `--bs-border-success-hover`
- `--bs-surface-warning`
- `--bs-text-warning`
- `--bs-border-warning`
- `--bs-border-warning-hover`
- `--bs-surface-error`
- `--bs-text-error`
- `--bs-border-error`
- `--bs-border-error-hover`
- `--bs-surface-info`
- `--bs-text-info`
- `--bs-border-info`
- `--bs-border-info-hover`

## CSS Classes

- `bs-chip`
- `bs-chip-primary`
- `bs-chip-neutral`
- `bs-chip-outlined`
- `bs-chip-success`
- `bs-chip-warning`
- `bs-chip-error`
- `bs-chip-info`

## Code Examples

### Informative

#### Primary (HTML)

```html
<!-- brandsync: Chips / Informative / Primary | requires: brandsync-tokens -->
<style>
.bs-chip {
  display: inline-flex;
  align-items: center;
  gap: var(--bs-spacing-50);
  padding: var(--bs-spacing-50) var(--bs-spacing-150);
  border-radius: var(--bs-border-radius-full);
  font-size: var(--bs-font-size-xs);
  font-weight: 600;
  font-family: inherit;
  border: 1.bs-5px solid transparent;
  cursor: default;
  transition: all 0.bs-15s ease;
  line-height: var(--bs-line-height-snug);
  white-space: nowrap;
}
.bs-chip-primary {
  background: var(--bs-color-primary-default);
  color: var(--bs-text-inverse);
  border-color: var(--bs-color-primary-default);
}
.bs-chip-primary:hover {
  background: var(--bs-color-primary-hover);
  border-color: var(--bs-color-primary-hover);
}
.bs-chip-primary:active {
  background: var(--bs-color-primary-pressed);
  border-color: var(--bs-color-primary-pressed);
}
</style>
<span class="bs-chip bs-chip-primary">Label</span>
```

#### Neutral (HTML)

```html
<!-- brandsync: Chips / Informative / Neutral | requires: brandsync-tokens -->
<style>
.bs-chip {
  display: inline-flex;
  align-items: center;
  gap: var(--bs-spacing-50);
  padding: var(--bs-spacing-50) var(--bs-spacing-150);
  border-radius: var(--bs-border-radius-full);
  font-size: var(--bs-font-size-xs);
  font-weight: 600;
  font-family: inherit;
  border: 1.bs-5px solid transparent;
  cursor: default;
  transition: all 0.bs-15s ease;
  line-height: var(--bs-line-height-snug);
  white-space: nowrap;
}
.bs-chip-neutral {
  background: var(--bs-color-neutral-container);
  color: var(--bs-text-default);
  border-color: var(--bs-border-default);
}
.bs-chip-neutral:hover {
  background: var(--bs-color-neutral-container-hover);
  border-color: var(--bs-border-default);
}
.bs-chip-neutral:active {
  background: var(--bs-color-neutral-container-pressed);
}
</style>
<span class="bs-chip bs-chip-neutral">Label</span>
```

#### Outlined (HTML)

```html
<!-- brandsync: Chips / Outlined | requires: brandsync-tokens -->
<style>
.bs-chip {
  display: inline-flex;
  align-items: center;
  gap: var(--bs-spacing-50);
  padding: var(--bs-spacing-50) var(--bs-spacing-150);
  border-radius: var(--bs-border-radius-full);
  font-size: var(--bs-font-size-xs);
  font-weight: 600;
  font-family: inherit;
  border: 1.bs-5px solid transparent;
  cursor: default;
  transition: all 0.bs-15s ease;
  line-height: var(--bs-line-height-snug);
  white-space: nowrap;
}
.bs-chip-outlined {
  background: transparent;
  color: var(--bs-color-primary-default);
  border-color: var(--bs-color-primary-default);
}
.bs-chip-outlined:hover {
  background: var(--bs-color-primary-container);
  border-color: var(--bs-color-primary-hover);
}
.bs-chip-outlined:active {
  background: var(--bs-color-primary-container-hover);
}
</style>
<span class="bs-chip bs-chip-outlined">Label</span>
```

#### Success (HTML)

```html
<!-- brandsync: Chips / Success | requires: brandsync-tokens -->
<style>
.bs-chip {
  display: inline-flex;
  align-items: center;
  gap: var(--bs-spacing-50);
  padding: var(--bs-spacing-50) var(--bs-spacing-150);
  border-radius: var(--bs-border-radius-full);
  font-size: var(--bs-font-size-xs);
  font-weight: 600;
  font-family: inherit;
  border: 1.bs-5px solid transparent;
  cursor: default;
  transition: all 0.bs-15s ease;
  line-height: var(--bs-line-height-snug);
  white-space: nowrap;
}
.bs-chip-success {
  background: var(--bs-surface-success);
  color: var(--bs-text-success);
  border-color: var(--bs-border-success);
}
.bs-chip-success:hover {
  border-color: var(--bs-border-success-hover);
}
</style>
<span class="bs-chip bs-chip-success">Label</span>
```

#### Warning (HTML)

```html
<!-- brandsync: Chips / Warning | requires: brandsync-tokens -->
<style>
.bs-chip {
  display: inline-flex;
  align-items: center;
  gap: var(--bs-spacing-50);
  padding: var(--bs-spacing-50) var(--bs-spacing-150);
  border-radius: var(--bs-border-radius-full);
  font-size: var(--bs-font-size-xs);
  font-weight: 600;
  font-family: inherit;
  border: 1.bs-5px solid transparent;
  cursor: default;
  transition: all 0.bs-15s ease;
  line-height: var(--bs-line-height-snug);
  white-space: nowrap;
}
.bs-chip-warning {
  background: var(--bs-surface-warning);
  color: var(--bs-text-warning);
  border-color: var(--bs-border-warning);
}
.bs-chip-warning:hover {
  border-color: var(--bs-border-warning-hover);
}
</style>
<span class="bs-chip bs-chip-warning">Label</span>
```

#### Error (HTML)

```html
<!-- brandsync: Chips / Error | requires: brandsync-tokens -->
<style>
.bs-chip {
  display: inline-flex;
  align-items: center;
  gap: var(--bs-spacing-50);
  padding: var(--bs-spacing-50) var(--bs-spacing-150);
  border-radius: var(--bs-border-radius-full);
  font-size: var(--bs-font-size-xs);
  font-weight: 600;
  font-family: inherit;
  border: 1.bs-5px solid transparent;
  cursor: default;
  transition: all 0.bs-15s ease;
  line-height: var(--bs-line-height-snug);
  white-space: nowrap;
}
.bs-chip-error {
  background: var(--bs-surface-error);
  color: var(--bs-text-error);
  border-color: var(--bs-border-error);
}
.bs-chip-error:hover {
  border-color: var(--bs-border-error-hover);
}
</style>
<span class="bs-chip bs-chip-error">Label</span>
```

#### Info (HTML)

```html
<!-- brandsync: Chips / Info | requires: brandsync-tokens -->
<style>
.bs-chip {
  display: inline-flex;
  align-items: center;
  gap: var(--bs-spacing-50);
  padding: var(--bs-spacing-50) var(--bs-spacing-150);
  border-radius: var(--bs-border-radius-full);
  font-size: var(--bs-font-size-xs);
  font-weight: 600;
  font-family: inherit;
  border: 1.bs-5px solid transparent;
  cursor: default;
  transition: all 0.bs-15s ease;
  line-height: var(--bs-line-height-snug);
  white-space: nowrap;
}
.bs-chip-info {
  background: var(--bs-surface-info);
  color: var(--bs-text-info);
  border-color: var(--bs-border-info);
}
.bs-chip-info:hover {
  border-color: var(--bs-border-info-hover);
}
</style>
<span class="bs-chip bs-chip-info">Label</span>
```
