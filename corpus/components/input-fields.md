# Input Fields

**Type:** UI Component
**Source:** BrandSync Design System (Strapi)

## Description

Input fields allow users to enter and edit text. They come in different states and sizes to suit various contexts and use cases.

## Variants

- Default
- Focus
- Filled
- Error
- Disabled
- Success
- Large
- Medium
- Small

## Frameworks

- HTML

## Design Tokens

- `--bs-spacing-50`
- `--bs-font-size-sm`
- `--bs-font-size-xl`
- `--bs-text-default`
- `--bs-spacing-550`
- `--bs-border-default`
- `--bs-border-radius-100`
- `--bs-surface-base`
- `--bs-spacing-100`
- `--bs-font-size-md`
- `--bs-font-size-2xl`
- `--bs-text-muted`
- `--bs-font-size-xs`
- `--bs-color-primary-default`
- `--bs-border-primary-focus`
- `--bs-color-error-default`
- `--bs-text-error`
- `--bs-text-on-disabled`
- `--bs-surface-action-disabled`
- `--bs-border-success`
- `--bs-color-success-default`
- `--bs-text-success`
- `--bs-font-size-lg`
- `--bs-spacing-350`
- `--bs-border-radius-75`

## CSS Classes

- `bs-input-wrapper`
- `bs-input-label`
- `bs-input-container`
- `bs-input-field`
- `bs-input-helper`
- `bs-input-icon-end`
- `bs-input-error-msg`
- `bs-input-success-msg`

## Code Examples

### States

#### Default (HTML)

```html
<!-- brandsync: Input Fields / States / Default | requires: brandsync-tokens -->
<!DOCTYPE html>
<html>
<head>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; font-family: inherit; }
  .bs-input-wrapper {
    display: flex;
    flex-direction: column;
    gap: var(--bs-spacing-50);
    width: 320px;
  }
  .bs-input-label {
    font-size: var(--bs-font-size-sm);
    font-weight: 500;
    line-height: var(--bs-font-size-xl);
    color: var(--bs-text-default);
  }
  .bs-input-container {
    display: flex;
    align-items: center;
    height: var(--bs-spacing-550);
    padding: 0 12px;
    border: 1px solid var(--bs-border-default);
    border-radius: var(--bs-border-radius-100);
    background: var(--bs-surface-base);
    gap: var(--bs-spacing-100);
  }
  .bs-input-field {
    flex: 1;
    border: none;
    outline: none;
    background: transparent;
    font-size: var(--bs-font-size-md);
    line-height: var(--bs-font-size-2xl);
    color: var(--bs-text-default);
  }
  .bs-input-field::placeholder {
    color: var(--bs-text-muted);
  }
  .bs-input-helper {
    font-size: var(--bs-font-size-xs);
    line-height: var(--bs-font-size-md);
    color: var(--bs-text-muted);
  }
</style>
</head>
<body>
  <div class="bs-input-wrapper">
    <label class="bs-input-label">Label</label>
    <div class="bs-input-container">
      <input class="bs-input-field" type="text" placeholder="Placeholder text" />
    </div>
    <span class="bs-input-helper">Helper text</span>
  </div>
</body>
</html>
```

#### Focus (HTML)

```html
<!-- brandsync: Input Fields / States / Focus | requires: brandsync-tokens -->
<!DOCTYPE html>
<html>
<head>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; font-family: inherit; }
  .bs-input-wrapper {
    display: flex;
    flex-direction: column;
    gap: var(--bs-spacing-50);
    width: 320px;
  }
  .bs-input-label {
    font-size: var(--bs-font-size-sm);
    font-weight: 500;
    line-height: var(--bs-font-size-xl);
    color: var(--bs-color-primary-default);
  }
  .bs-input-container {
    display: flex;
    align-items: center;
    height: var(--bs-spacing-550);
    padding: 0 12px;
    border: 2px solid var(--bs-color-primary-default);
    border-radius: var(--bs-border-radius-100);
    background: var(--bs-surface-base);
    gap: var(--bs-spacing-100);
    box-shadow: 0 0 0 3px var(--bs-border-primary-focus);
  }
  .bs-input-field {
    flex: 1;
    border: none;
    outline: none;
    background: transparent;
    font-size: var(--bs-font-size-md);
    line-height: var(--bs-font-size-2xl);
    color: var(--bs-text-default);
  }
  .bs-input-field::placeholder {
    color: var(--bs-text-muted);
  }
  .bs-input-helper {
    font-size: var(--bs-font-size-xs);
    line-height: var(--bs-font-size-md);
    color: var(--bs-text-muted);
  }
</style>
</head>
<body>
  <div class="bs-input-wrapper">
    <label class="bs-input-label">Label</label>
    <div class="bs-input-container">
      <input class="bs-input-field" type="text" placeholder="Placeholder text" />
    </div>
    <span class="bs-input-helper">Helper text</span>
  </div>
</body>
</html>
```

#### Filled (HTML)

```html
<!-- brandsync: Input Fields / States / Filled | requires: brandsync-tokens -->
<!DOCTYPE html>
<html>
<head>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; font-family: inherit; }
  .bs-input-wrapper {
    display: flex;
    flex-direction: column;
    gap: var(--bs-spacing-50);
    width: 320px;
  }
  .bs-input-label {
    font-size: var(--bs-font-size-sm);
    font-weight: 500;
    line-height: var(--bs-font-size-xl);
    color: var(--bs-text-default);
  }
  .bs-input-container {
    display: flex;
    align-items: center;
    height: var(--bs-spacing-550);
    padding: 0 12px;
    border: 1px solid var(--bs-border-default);
    border-radius: var(--bs-border-radius-100);
    background: var(--bs-surface-base);
    gap: var(--bs-spacing-100);
  }
  .bs-input-field {
    flex: 1;
    border: none;
    outline: none;
    background: transparent;
    font-size: var(--bs-font-size-md);
    line-height: var(--bs-font-size-2xl);
    color: var(--bs-text-default);
  }
  .bs-input-helper {
    font-size: var(--bs-font-size-xs);
    line-height: var(--bs-font-size-md);
    color: var(--bs-text-muted);
  }
</style>
</head>
<body>
  <div class="bs-input-wrapper">
    <label class="bs-input-label">Label</label>
    <div class="bs-input-container">
      <input class="bs-input-field" type="text" value="Filled value" />
    </div>
    <span class="bs-input-helper">Helper text</span>
  </div>
</body>
</html>
```

#### Error (HTML)

```html
<!-- brandsync: Input Fields / States / Error | requires: brandsync-tokens -->
<!DOCTYPE html>
<html>
<head>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; font-family: inherit; }
  .bs-input-wrapper {
    display: flex;
    flex-direction: column;
    gap: var(--bs-spacing-50);
    width: 320px;
  }
  .bs-input-label {
    font-size: var(--bs-font-size-sm);
    font-weight: 500;
    line-height: var(--bs-font-size-xl);
    color: var(--bs-text-default);
  }
  .bs-input-container {
    display: flex;
    align-items: center;
    height: var(--bs-spacing-550);
    padding: 0 12px;
    border: 1px solid var(--bs-color-error-default);
    border-radius: var(--bs-border-radius-100);
    background: var(--bs-surface-base);
    gap: var(--bs-spacing-100);
  }
  .bs-input-field {
    flex: 1;
    border: none;
    outline: none;
    background: transparent;
    font-size: var(--bs-font-size-md);
    line-height: var(--bs-font-size-2xl);
    color: var(--bs-text-default);
  }
  .bs-input-field::placeholder {
    color: var(--bs-text-muted);
  }
  .bs-input-icon-end {
    width: var(--bs-font-size-xl);
    height: var(--bs-font-size-xl);
    color: var(--bs-color-error-default);
    flex-shrink: 0;
  }
  .bs-input-error-msg {
    font-size: var(--bs-font-size-xs);
    line-height: var(--bs-font-size-md);
    color: var(--bs-text-error);
    display: flex;
    align-items: center;
    gap: var(--bs-spacing-50);
  }
</style>
</head>
<body>
  <div class="bs-input-wrapper">
    <label class="bs-input-label">Label</label>
    <div class="bs-input-container">
      <input class="bs-input-field" type="text" value="Invalid value" />
      <svg class="bs-input-icon-end" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="8" x2="12" y2="12"/>
        <line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
    </div>
    <span class="bs-input-error-msg">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="8" x2="12" y2="12"/>
        <line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
      This field has an error
    </span>
  </div>
</body>
</html>
```

#### Disabled (HTML)

```html
<!-- brandsync: Input Fields / States / Disabled | requires: brandsync-tokens -->
<!DOCTYPE html>
<html>
<head>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; font-family: inherit; }
  .bs-input-wrapper {
    display: flex;
    flex-direction: column;
    gap: var(--bs-spacing-50);
    width: 320px;
  }
  .bs-input-label {
    font-size: var(--bs-font-size-sm);
    font-weight: 500;
    line-height: var(--bs-font-size-xl);
    color: var(--bs-text-on-disabled);
  }
  .bs-input-container {
    display: flex;
    align-items: center;
    height: var(--bs-spacing-550);
    padding: 0 12px;
    border: 1px solid var(--bs-border-default);
    border-radius: var(--bs-border-radius-100);
    background: var(--bs-surface-action-disabled);
    gap: var(--bs-spacing-100);
    cursor: not-allowed;
  }
  .bs-input-field {
    flex: 1;
    border: none;
    outline: none;
    background: transparent;
    font-size: var(--bs-font-size-md);
    line-height: var(--bs-font-size-2xl);
    color: var(--bs-text-on-disabled);
    cursor: not-allowed;
  }
  .bs-input-field::placeholder {
    color: var(--bs-text-on-disabled);
  }
  .bs-input-helper {
    font-size: var(--bs-font-size-xs);
    line-height: var(--bs-font-size-md);
    color: var(--bs-text-on-disabled);
  }
</style>
</head>
<body>
  <div class="bs-input-wrapper">
    <label class="bs-input-label">Label</label>
    <div class="bs-input-container">
      <input class="bs-input-field" type="text" placeholder="Disabled" disabled />
    </div>
    <span class="bs-input-helper">Helper text</span>
  </div>
</body>
</html>
```

#### Success (HTML)

```html
<!-- brandsync: Input Fields / States / Success | requires: brandsync-tokens -->
<!DOCTYPE html>
<html>
<head>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; font-family: inherit; }
  .bs-input-wrapper {
    display: flex;
    flex-direction: column;
    gap: var(--bs-spacing-50);
    width: 320px;
  }
  .bs-input-label {
    font-size: var(--bs-font-size-sm);
    font-weight: 500;
    line-height: var(--bs-font-size-xl);
    color: var(--bs-text-default);
  }
  .bs-input-container {
    display: flex;
    align-items: center;
    height: var(--bs-spacing-550);
    padding: 0 12px;
    border: 1px solid var(--bs-border-success);
    border-radius: var(--bs-border-radius-100);
    background: var(--bs-surface-base);
    gap: var(--bs-spacing-100);
  }
  .bs-input-field {
    flex: 1;
    border: none;
    outline: none;
    background: transparent;
    font-size: var(--bs-font-size-md);
    line-height: var(--bs-font-size-2xl);
    color: var(--bs-text-default);
  }
  .bs-input-icon-end {
    width: var(--bs-font-size-xl);
    height: var(--bs-font-size-xl);
    color: var(--bs-color-success-default);
    flex-shrink: 0;
  }
  .bs-input-success-msg {
    font-size: var(--bs-font-size-xs);
    line-height: var(--bs-font-size-md);
    color: var(--bs-text-success);
    display: flex;
    align-items: center;
    gap: var(--bs-spacing-50);
  }
</style>
</head>
<body>
  <div class="bs-input-wrapper">
    <label class="bs-input-label">Label</label>
    <div class="bs-input-container">
      <input class="bs-input-field" type="text" value="Valid input" />
      <svg class="bs-input-icon-end" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="20 6 9 17 4 12"/>
      </svg>
    </div>
    <span class="bs-input-success-msg">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="20 6 9 17 4 12"/>
      </svg>
      Looks good!
    </span>
  </div>
</body>
</html>
```

### Sizes

#### Large (HTML)

```html
<!-- brandsync: Input Fields / Sizes / Large | requires: brandsync-tokens -->
<!DOCTYPE html>
<html>
<head>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; font-family: inherit; }
  .bs-input-wrapper {
    display: flex;
    flex-direction: column;
    gap: var(--bs-spacing-50);
    width: 320px;
  }
  .bs-input-label {
    font-size: var(--bs-font-size-sm);
    font-weight: 500;
    line-height: var(--bs-font-size-xl);
    color: var(--bs-text-default);
  }
  .bs-input-container {
    display: flex;
    align-items: center;
    height: 52px;
    padding: 0 16px;
    border: 1px solid var(--bs-border-default);
    border-radius: var(--bs-border-radius-100);
    background: var(--bs-surface-base);
    gap: var(--bs-spacing-100);
  }
  .bs-input-field {
    flex: 1;
    border: none;
    outline: none;
    background: transparent;
    font-size: var(--bs-font-size-lg);
    line-height: var(--bs-spacing-350);
    color: var(--bs-text-default);
  }
  .bs-input-field::placeholder {
    color: var(--bs-text-muted);
  }
</style>
</head>
<body>
  <div class="bs-input-wrapper">
    <label class="bs-input-label">Label</label>
    <div class="bs-input-container">
      <input class="bs-input-field" type="text" placeholder="Large input" />
    </div>
  </div>
</body>
</html>
```

#### Medium (HTML)

```html
<!-- brandsync: Input Fields / Sizes / Medium | requires: brandsync-tokens -->
<!DOCTYPE html>
<html>
<head>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; font-family: inherit; }
  .bs-input-wrapper {
    display: flex;
    flex-direction: column;
    gap: var(--bs-spacing-50);
    width: 320px;
  }
  .bs-input-label {
    font-size: var(--bs-font-size-sm);
    font-weight: 500;
    line-height: var(--bs-font-size-xl);
    color: var(--bs-text-default);
  }
  .bs-input-container {
    display: flex;
    align-items: center;
    height: var(--bs-spacing-550);
    padding: 0 12px;
    border: 1px solid var(--bs-border-default);
    border-radius: var(--bs-border-radius-100);
    background: var(--bs-surface-base);
    gap: var(--bs-spacing-100);
  }
  .bs-input-field {
    flex: 1;
    border: none;
    outline: none;
    background: transparent;
    font-size: var(--bs-font-size-md);
    line-height: var(--bs-font-size-2xl);
    color: var(--bs-text-default);
  }
  .bs-input-field::placeholder {
    color: var(--bs-text-muted);
  }
</style>
</head>
<body>
  <div class="bs-input-wrapper">
    <label class="bs-input-label">Label</label>
    <div class="bs-input-container">
      <input class="bs-input-field" type="text" placeholder="Medium input" />
    </div>
  </div>
</body>
</html>
```

#### Small (HTML)

```html
<!-- brandsync: Input Fields / Sizes / Small | requires: brandsync-tokens -->
<!DOCTYPE html>
<html>
<head>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; font-family: inherit; }
  .bs-input-wrapper {
    display: flex;
    flex-direction: column;
    gap: var(--bs-spacing-50);
    width: 320px;
  }
  .bs-input-label {
    font-size: var(--bs-font-size-sm);
    font-weight: 500;
    line-height: var(--bs-font-size-xl);
    color: var(--bs-text-default);
  }
  .bs-input-container {
    display: flex;
    align-items: center;
    height: 36px;
    padding: 0 8px;
    border: 1px solid var(--bs-border-default);
    border-radius: var(--bs-border-radius-75);
    background: var(--bs-surface-base);
    gap: var(--bs-spacing-100);
  }
  .bs-input-field {
    flex: 1;
    border: none;
    outline: none;
    background: transparent;
    font-size: var(--bs-font-size-sm);
    line-height: var(--bs-font-size-xl);
    color: var(--bs-text-default);
  }
  .bs-input-field::placeholder {
    color: var(--bs-text-muted);
  }
</style>
</head>
<body>
  <div class="bs-input-wrapper">
    <label class="bs-input-label">Label</label>
    <div class="bs-input-container">
      <input class="bs-input-field" type="text" placeholder="Small input" />
    </div>
  </div>
</body>
</html>
```
