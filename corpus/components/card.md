# Card

**Type:** UI Component
**Source:** BrandSync Design System (Strapi)

## Description

Cards are surfaces that contain related content and actions about a single subject. They group information into scannable units for grid and list layouts.

## Variants

- Default
- Media
- Interactive

## Frameworks

- HTML

## Design Tokens

- `--bs-surface-base`
- `--bs-border-default`
- `--bs-border-radius-150`
- `--bs-spacing-300`
- `--bs-spacing-150`
- `--bs-shadow-elevation-xs`
- `--bs-font-size-lg`
- `--bs-text-default`
- `--bs-font-size-md`
- `--bs-text-muted`
- `--bs-line-height-normal`
- `--bs-spacing-100`
- `--bs-spacing-50`
- `--bs-spacing-250`
- `--bs-border-radius-100`
- `--bs-font-size-sm`
- `--bs-color-primary-default`
- `--bs-text-inverse`
- `--bs-color-primary-hover`
- `--bs-border-primary`
- `--bs-color-primary-focused`
- `--bs-color-primary-pressed`
- `--bs-color-neutral-container`
- `--bs-color-neutral-default`
- `--bs-color-neutral-container-hover`
- `--bs-color-neutral-container-pressed`
- `--bs-surface-container`
- `--bs-font-size-xs`
- `--bs-spacing-75`
- `--bs-spacing-200`
- `--bs-shadow-elevation-sm`
- `--bs-spacing-600`
- `--bs-color-primary-container`
- `--bs-font-size-xl`

## CSS Classes

- `bs-card`
- `bs-card-title`
- `bs-card-body`
- `bs-card-actions`
- `bs-btn`
- `bs-btn-primary`
- `bs-btn-neutral`
- `bs-card-media`
- `bs-card-content`
- `bs-card-tag`
- `bs-card-footer`
- `bs-card-meta`
- `bs-btn-subtle`
- `bs-card-icon`

## Code Examples

### Variants

#### Default (HTML)

```html
<!-- brandsync: Card / Variants / Default | requires: brandsync-tokens -->
<style>
.bs-card { background: var(--bs-surface-base); border: 1px solid var(--bs-border-default); border-radius: var(--bs-border-radius-150); padding: var(--bs-spacing-300); display: flex; flex-direction: column; gap: var(--bs-spacing-150); width: 320px; box-shadow: var(--bs-shadow-elevation-xs); }
.bs-card-title { font-size: var(--bs-font-size-lg); font-weight: 700; color: var(--bs-text-default); margin: 0; }
.bs-card-body { font-size: var(--bs-font-size-md); color: var(--bs-text-muted); line-height: var(--bs-line-height-normal); margin: 0; }
.bs-card-actions { display: flex; gap: var(--bs-spacing-100); margin-top: var(--bs-spacing-50); }
.bs-btn { padding: var(--bs-spacing-100) var(--bs-spacing-250); border-radius: var(--bs-border-radius-100); font-weight: 600; font-size: var(--bs-font-size-sm); cursor: pointer; transition: all 0.bs-15s; font-family: inherit; border: none; }
.bs-btn-primary { background: var(--bs-color-primary-default); color: var(--bs-text-inverse); }
.bs-btn-primary:hover { background: var(--bs-color-primary-hover); }
.bs-btn-primary:focus-visible { outline: 3px solid var(--bs-border-primary); outline-offset: 2px; background: var(--bs-color-primary-focused); }
.bs-btn-primary:active { background: var(--bs-color-primary-pressed); }
.bs-btn-neutral { background: var(--bs-color-neutral-container); color: var(--bs-color-neutral-default); border: 1px solid var(--bs-color-neutral-container-hover); }
.bs-btn-neutral:hover { background: var(--bs-color-neutral-container-hover); border-color: var(--bs-color-neutral-default); }
.bs-btn-neutral:focus-visible { outline: 3px solid var(--bs-border-primary); outline-offset: 2px; }
.bs-btn-neutral:active { background: var(--bs-color-neutral-container-pressed); }
.bs-btn-subtle { background: transparent; color: var(--bs-color-neutral-default); border: none; }
.bs-btn-subtle:hover { background: var(--bs-color-neutral-container); }
.bs-btn-subtle:focus-visible { outline: 3px solid var(--bs-border-primary); outline-offset: 2px; }
</style>
<div class="bs-card">
  <h3 class="bs-card-title">Card title</h3>
  <p class="bs-card-body">Cards group related content into a scannable surface. Keep content focused on a single subject.</p>
  <div class="bs-card-actions">
    <button class="bs-btn bs-btn-primary">Primary</button>
    <button class="bs-btn bs-btn-neutral">Secondary</button>
  </div>
</div>
```

#### Media (HTML)

```html
<!-- brandsync: Card / Variants / Media | requires: brandsync-tokens -->
<style>
.bs-card { background: var(--bs-surface-base); border: 1px solid var(--bs-border-default); border-radius: var(--bs-border-radius-150); overflow: hidden; width: 320px; box-shadow: var(--bs-shadow-elevation-xs); }
.bs-card-media { width: 100%; height: 180px; background: var(--bs-surface-container); display: flex; align-items: center; justify-content: center; color: var(--bs-text-muted); font-size: var(--bs-font-size-sm); }
.bs-card-content { padding: var(--bs-spacing-300); display: flex; flex-direction: column; gap: var(--bs-spacing-100); }
.bs-card-tag { font-size: var(--bs-font-size-xs); font-weight: 600; color: var(--bs-color-primary-default); text-transform: uppercase; letter-spacing: 0.bs-5px; }
.bs-card-title { font-size: var(--bs-font-size-lg); font-weight: 700; color: var(--bs-text-default); margin: 0; }
.bs-card-body { font-size: var(--bs-font-size-sm); color: var(--bs-text-muted); line-height: var(--bs-line-height-normal); }
.bs-card-footer { display: flex; justify-content: space-between; align-items: center; margin-top: var(--bs-spacing-100); }
.bs-card-meta { font-size: var(--bs-font-size-xs); color: var(--bs-text-muted); }
.bs-btn { padding: var(--bs-spacing-75) var(--bs-spacing-150); border-radius: var(--bs-border-radius-100); font-weight: 600; font-size: var(--bs-font-size-sm); cursor: pointer; transition: all 0.bs-15s; font-family: inherit; border: none; }
.bs-btn-subtle { background: transparent; color: var(--bs-color-neutral-default); }
.bs-btn-subtle:hover { background: var(--bs-color-neutral-container); }
.bs-btn-subtle:focus-visible { outline: 3px solid var(--bs-border-primary); outline-offset: 2px; }
</style>
<div class="bs-card">
  <div class="bs-card-media" role="img" aria-label="Article image placeholder">Image placeholder</div>
  <div class="bs-card-content">
    <span class="bs-card-tag">Design System</span>
    <h3 class="bs-card-title">Building accessible components</h3>
    <p class="bs-card-body">Learn how to build fully accessible UI components using Brandsync tokens and ARIA patterns.</p>
    <div class="bs-card-footer">
      <span class="bs-card-meta">Apr 7, 2026 · 5 min read</span>
      <button class="bs-btn bs-btn-subtle">Read more</button>
    </div>
  </div>
</div>
```

#### Interactive (HTML)

```html
<!-- brandsync: Card / Variants / Interactive | requires: brandsync-tokens -->
<style>
.bs-card { background: var(--bs-surface-base); border: 1px solid var(--bs-border-default); border-radius: var(--bs-border-radius-150); padding: var(--bs-spacing-300); display: flex; gap: var(--bs-spacing-200); align-items: flex-start; width: 400px; box-shadow: var(--bs-shadow-elevation-xs); cursor: pointer; transition: box-shadow 0.bs-2s, transform 0.bs-2s; text-decoration: none; color: inherit; }
.bs-card:hover { box-shadow: var(--bs-shadow-elevation-sm); transform: translateY(-2px); }
.bs-card:focus-visible { outline: 3px solid var(--bs-border-primary); outline-offset: 2px; }
.bs-card-icon { width: var(--bs-spacing-600); height: var(--bs-spacing-600); background: var(--bs-color-primary-container); border-radius: var(--bs-border-radius-100); display: flex; align-items: center; justify-content: center; font-size: var(--bs-font-size-xl); flex-shrink: 0; }
.bs-card-content { display: flex; flex-direction: column; gap: var(--bs-spacing-50); }
.bs-card-title { font-size: var(--bs-font-size-md); font-weight: 700; color: var(--bs-text-default); margin: 0; }
.bs-card-body { font-size: var(--bs-font-size-sm); color: var(--bs-text-muted); line-height: var(--bs-line-height-normal); }
</style>
<a href="#" class="bs-card" role="article">
  <div class="bs-card-icon" aria-hidden="true">⚡</div>
  <div class="bs-card-content">
    <h3 class="bs-card-title">Quick start guide</h3>
    <p class="bs-card-body">Get up and running with Brandsync in under 10 minutes. Tokens, components, and layouts.</p>
  </div>
</a>
```
