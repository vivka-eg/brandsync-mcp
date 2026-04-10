# Dialog

**Type:** UI Component
**Source:** BrandSync Design System (Strapi)

## Description

Dialogs interrupt users to present critical information, require decisions, or complete sub-tasks. Use sparingly — they block the underlying page.

## Variants

- Default
- Destructive
- With Form

## Frameworks

- HTML

## Design Tokens

- `--bs-surface-base`
- `--bs-border-radius-150`
- `--bs-spacing-400`
- `--bs-shadow-elevation-md`
- `--bs-spacing-300`
- `--bs-font-size-xl`
- `--bs-text-default`
- `--bs-font-size-md`
- `--bs-text-muted`
- `--bs-spacing-150`
- `--bs-spacing-100`
- `--bs-spacing-200`
- `--bs-border-radius-100`
- `--bs-font-size-sm`
- `--bs-color-primary-default`
- `--bs-text-inverse`
- `--bs-color-primary-hover`
- `--bs-border-default`
- `--bs-surface-hover`
- `--bs-border-neutral-focus`
- `--bs-spacing-600`
- `--bs-surface-error`
- `--bs-border-radius-full`
- `--bs-color-error-default`
- `--bs-color-error-hover`
- `--bs-spacing-50`
- `--bs-border-radius-50`
- `--bs-spacing-75`
- `--bs-border-primary-focus`

## CSS Classes

- `bs-dialog-overlay`
- `bs-dialog`
- `bs-dialog-title`
- `bs-dialog-body`
- `bs-dialog-actions`
- `bs-btn`
- `bs-btn-ghost`
- `bs-btn-primary`
- `bs-dialog-icon`
- `bs-btn-destructive`
- `bs-dialog-header`
- `bs-close-btn`
- `bs-form-group`

## Code Examples

### Variants

#### Default (HTML)

```html
<!-- brandsync: Dialog / Variants / Default | requires: brandsync-tokens -->
<style>
.bs-dialog-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.bs-5); display: flex; align-items: center; justify-content: center; z-index: 200; }
.bs-dialog { background: var(--bs-surface-base); border-radius: var(--bs-border-radius-150); padding: var(--bs-spacing-400); width: min(90vw, 480px); box-shadow: var(--bs-shadow-elevation-md); display: flex; flex-direction: column; gap: var(--bs-spacing-300); }
.bs-dialog-title { font-size: var(--bs-font-size-xl); font-weight: 700; color: var(--bs-text-default); margin: 0; }
.bs-dialog-body { font-size: var(--bs-font-size-md); color: var(--bs-text-muted); line-height: 1.bs-5; }
.bs-dialog-actions { display: flex; gap: var(--bs-spacing-150); justify-content: flex-end; }
.bs-btn { padding: var(--bs-spacing-100) var(--bs-spacing-200); border-radius: var(--bs-border-radius-100); font-size: var(--bs-font-size-sm); font-weight: 600; cursor: pointer; border: none; font-family: inherit; }
.bs-btn-primary { background: var(--bs-color-primary-default); color: var(--bs-text-inverse); }
.bs-btn-primary:hover { background: var(--bs-color-primary-hover); }
.bs-btn-ghost { background: transparent; color: var(--bs-text-default); border: 1px solid var(--bs-border-default); }
.bs-btn-ghost:hover { background: var(--bs-surface-hover); }
.bs-btn:focus-visible { outline: 2px solid var(--bs-border-neutral-focus); outline-offset: 2px; }
</style>
<div class="bs-dialog-overlay" role="dialog" aria-modal="true" aria-labelledby="dialog-title">
  <div class="bs-dialog">
    <h2 class="bs-dialog-title" id="dialog-title">Confirm action</h2>
    <p class="bs-dialog-body">Are you sure you want to proceed? This action cannot be undone.</p>
    <div class="bs-dialog-actions">
      <button class="bs-btn bs-btn-ghost">Cancel</button>
      <button class="bs-btn bs-btn-primary">Confirm</button>
    </div>
  </div>
</div>
```

#### Destructive (HTML)

```html
<!-- brandsync: Dialog / Variants / Destructive | requires: brandsync-tokens -->
<style>
.bs-dialog-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.bs-5); display: flex; align-items: center; justify-content: center; z-index: 200; }
.bs-dialog { background: var(--bs-surface-base); border-radius: var(--bs-border-radius-150); padding: var(--bs-spacing-400); width: min(90vw, 480px); box-shadow: var(--bs-shadow-elevation-md); display: flex; flex-direction: column; gap: var(--bs-spacing-300); }
.bs-dialog-icon { width: var(--bs-spacing-600); height: var(--bs-spacing-600); background: var(--bs-surface-error); border-radius: var(--bs-border-radius-full); display: flex; align-items: center; justify-content: center; font-size: var(--bs-font-size-xl); }
.bs-dialog-title { font-size: var(--bs-font-size-xl); font-weight: 700; color: var(--bs-text-default); margin: 0; }
.bs-dialog-body { font-size: var(--bs-font-size-md); color: var(--bs-text-muted); line-height: 1.bs-5; }
.bs-dialog-actions { display: flex; gap: var(--bs-spacing-150); justify-content: flex-end; }
.bs-btn { padding: var(--bs-spacing-100) var(--bs-spacing-200); border-radius: var(--bs-border-radius-100); font-size: var(--bs-font-size-sm); font-weight: 600; cursor: pointer; border: none; font-family: inherit; }
.bs-btn-destructive { background: var(--bs-color-error-default); color: var(--bs-text-inverse); }
.bs-btn-destructive:hover { background: var(--bs-color-error-hover); }
.bs-btn-ghost { background: transparent; color: var(--bs-text-default); border: 1px solid var(--bs-border-default); }
.bs-btn-ghost:hover { background: var(--bs-surface-hover); }
.bs-btn:focus-visible { outline: 2px solid var(--bs-border-neutral-focus); outline-offset: 2px; }
</style>
<div class="bs-dialog-overlay" role="alertdialog" aria-modal="true" aria-labelledby="dialog-title">
  <div class="bs-dialog">
    <div class="bs-dialog-icon" aria-hidden="true">⚠️</div>
    <h2 class="bs-dialog-title" id="dialog-title">Delete item</h2>
    <p class="bs-dialog-body">This will permanently delete the item. You cannot undo this action.</p>
    <div class="bs-dialog-actions">
      <button class="bs-btn bs-btn-ghost">Cancel</button>
      <button class="bs-btn bs-btn-destructive">Delete</button>
    </div>
  </div>
</div>
```

#### With Form (HTML)

```html
<!-- brandsync: Dialog / Variants / With Form | requires: brandsync-tokens -->
<style>
.bs-dialog-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.bs-5); display: flex; align-items: center; justify-content: center; z-index: 200; }
.bs-dialog { background: var(--bs-surface-base); border-radius: var(--bs-border-radius-150); padding: var(--bs-spacing-400); width: min(90vw, 480px); box-shadow: var(--bs-shadow-elevation-md); display: flex; flex-direction: column; gap: var(--bs-spacing-300); }
.bs-dialog-header { display: flex; justify-content: space-between; align-items: center; }
.bs-dialog-title { font-size: var(--bs-font-size-xl); font-weight: 700; color: var(--bs-text-default); margin: 0; }
.bs-close-btn { background: none; border: none; font-size: var(--bs-font-size-xl); cursor: pointer; color: var(--bs-text-muted); padding: var(--bs-spacing-50); border-radius: var(--bs-border-radius-50); }
.bs-close-btn:hover { background: var(--bs-surface-hover); }
.bs-form-group { display: flex; flex-direction: column; gap: var(--bs-spacing-75); }
label { font-size: var(--bs-font-size-sm); font-weight: 600; color: var(--bs-text-default); }
input { padding: var(--bs-spacing-100) var(--bs-spacing-150); border: 1px solid var(--bs-border-default); border-radius: var(--bs-border-radius-100); font-size: var(--bs-font-size-md); color: var(--bs-text-default); background: var(--bs-surface-base); font-family: inherit; }
input:focus { outline: 2px solid var(--bs-border-primary-focus); border-color: var(--bs-color-primary-default); }
.bs-dialog-actions { display: flex; gap: var(--bs-spacing-150); justify-content: flex-end; }
.bs-btn { padding: var(--bs-spacing-100) var(--bs-spacing-200); border-radius: var(--bs-border-radius-100); font-size: var(--bs-font-size-sm); font-weight: 600; cursor: pointer; border: none; font-family: inherit; }
.bs-btn-primary { background: var(--bs-color-primary-default); color: var(--bs-text-inverse); }
.bs-btn-ghost { background: transparent; color: var(--bs-text-default); border: 1px solid var(--bs-border-default); }
</style>
<div class="bs-dialog-overlay" role="dialog" aria-modal="true" aria-labelledby="dialog-title">
  <div class="bs-dialog">
    <div class="bs-dialog-header">
      <h2 class="bs-dialog-title" id="dialog-title">Edit profile</h2>
      <button class="bs-close-btn" aria-label="Close dialog">✕</button>
    </div>
    <div class="bs-form-group">
      <label for="name-input">Name</label>
      <input id="name-input" type="text" placeholder="Enter your name" value="John Doe" />
    </div>
    <div class="bs-form-group">
      <label for="email-input">Email</label>
      <input id="email-input" type="email" placeholder="Enter your email" value="john@example.com" />
    </div>
    <div class="bs-dialog-actions">
      <button class="bs-btn bs-btn-ghost">Cancel</button>
      <button class="bs-btn bs-btn-primary">Save changes</button>
    </div>
  </div>
</div>
```
