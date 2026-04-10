# Accordion

**Type:** UI Component
**Source:** BrandSync Design System (Strapi)

## Description

Accordions show and hide sections of content to reduce cognitive load. Use when users need selective access to content on a page.

## Variants

- States
- Interactive

## Frameworks

- HTML

## Design Tokens

- `--bs-spacing-300`
- `--bs-surface-container`
- `--bs-border-radius-100`
- `--bs-surface-hover`
- `--bs-color-primary-default`
- `--bs-spacing-150`
- `--bs-spacing-200`
- `--bs-font-size-sm`
- `--bs-text-default`
- `--bs-icon-default`
- `--bs-text-secondary`
- `--bs-line-height-normal`
- `--bs-spacing-100`

## CSS Classes

- `bs-acc-states`
- `bs-acc-item`
- `bs-acc-header`
- `bs-acc-label`
- `bs-acc-chevron`
- `bs-acc-body`
- `bs-is-hover`
- `bs-is-focused`
- `bs-is-active`
- `bs-up`
- `bs-accordion`
- `bs-open`

## Code Examples

### States

#### States (HTML)

```html
<!-- brandsync: Accordion / States / States | requires: brandsync-tokens -->
<style>
.bs-acc-states {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--bs-spacing-300);
  width: 100%;
}
.bs-acc-item {
  background: var(--bs-surface-container);
  border-radius: var(--bs-border-radius-100);
  border: 1.bs-5px solid transparent;
}
.bs-acc-item.bs-is-hover { background: var(--bs-surface-hover); }
.bs-acc-item.bs-is-focused { box-shadow: 0 0 0 1.bs-5px var(--bs-color-primary-default) inset; }
.bs-acc-item.bs-is-active { border-color: var(--bs-color-primary-default); }
.bs-acc-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--bs-spacing-150) var(--bs-spacing-200);
  gap: var(--bs-spacing-150);
}
.bs-acc-label {
  font-size: var(--bs-font-size-sm);
  font-weight: 700;
  color: var(--bs-text-default);
  margin: 0;
}
.bs-acc-chevron {
  flex-shrink: 0;
  color: var(--bs-icon-default);
  display: flex;
  align-items: center;
}
.bs-acc-chevron.bs-up { transform: rotate(180deg); }
.bs-acc-body {
  padding: 0 var(--bs-spacing-200) var(--bs-spacing-150);
  font-size: var(--bs-font-size-sm);
  color: var(--bs-text-secondary);
  line-height: var(--bs-line-height-normal);
}
</style>

<div class="bs-acc-states">
  <!-- Row 1: Collapsed (chevron down) -->
  <div class="bs-acc-item">
    <div class="bs-acc-header">
      <span class="bs-acc-label">Label</span>
      <span class="bs-acc-chevron"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg></span>
    </div>
    <div class="bs-acc-body">This is placeholder content that expands to show more details...</div>
  </div>
  <div class="bs-acc-item bs-is-hover">
    <div class="bs-acc-header">
      <span class="bs-acc-label">Label</span>
      <span class="bs-acc-chevron"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg></span>
    </div>
    <div class="bs-acc-body">This is placeholder content that expands to show more details...</div>
  </div>
  <div class="bs-acc-item bs-is-focused">
    <div class="bs-acc-header">
      <span class="bs-acc-label">Label</span>
      <span class="bs-acc-chevron"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg></span>
    </div>
    <div class="bs-acc-body">This is placeholder content that expands to show more details...</div>
  </div>
  <div class="bs-acc-item bs-is-active">
    <div class="bs-acc-header">
      <span class="bs-acc-label">Label</span>
      <span class="bs-acc-chevron"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg></span>
    </div>
    <div class="bs-acc-body">This is placeholder content that expands to show more details...</div>
  </div>

  <!-- Row 2: Expanded (chevron up) -->
  <div class="bs-acc-item">
    <div class="bs-acc-header">
      <span class="bs-acc-label">Label</span>
      <span class="bs-acc-chevron bs-up"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg></span>
    </div>
    <div class="bs-acc-body">This is placeholder content that expands to show more details when needed.</div>
  </div>
  <div class="bs-acc-item bs-is-hover">
    <div class="bs-acc-header">
      <span class="bs-acc-label">Label</span>
      <span class="bs-acc-chevron bs-up"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg></span>
    </div>
    <div class="bs-acc-body">This is placeholder content that expands to show more details when needed.</div>
  </div>
  <div class="bs-acc-item bs-is-focused">
    <div class="bs-acc-header">
      <span class="bs-acc-label">Label</span>
      <span class="bs-acc-chevron bs-up"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg></span>
    </div>
    <div class="bs-acc-body">This is placeholder content that expands to show more details when needed.</div>
  </div>
  <div class="bs-acc-item bs-is-active">
    <div class="bs-acc-header">
      <span class="bs-acc-label">Label</span>
      <span class="bs-acc-chevron bs-up"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg></span>
    </div>
    <div class="bs-acc-body">This is placeholder content that expands to show more details when needed.</div>
  </div>
</div>
```

### Variants

#### Interactive (HTML)

```html
<!-- brandsync: Accordion / Variants / Interactive | requires: brandsync-tokens -->
<style>
.bs-accordion {
  display: flex;
  flex-direction: column;
  gap: var(--bs-spacing-100);
  width: 100%;
  max-width: 480px;
}
.bs-acc-item {
  background: var(--bs-surface-container);
  border-radius: var(--bs-border-radius-100);
  border: 1.bs-5px solid transparent;
  overflow: hidden;
  transition: border-color 0.bs-15s;
}
.bs-acc-item.bs-is-active { border-color: var(--bs-color-primary-default); }
.bs-acc-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--bs-spacing-150) var(--bs-spacing-200);
  gap: var(--bs-spacing-150);
  cursor: pointer;
  background: transparent;
  border: none;
  width: 100%;
  text-align: left;
  font-family: inherit;
  transition: background 0.bs-12s;
}
.bs-acc-header:hover { background: var(--bs-surface-hover); }
.bs-acc-header:focus-visible {
  outline: none;
  box-shadow: 0 0 0 1.bs-5px var(--bs-color-primary-default) inset;
}
.bs-acc-label {
  font-size: var(--bs-font-size-sm);
  font-weight: 700;
  color: var(--bs-text-default);
}
.bs-acc-chevron {
  flex-shrink: 0;
  color: var(--bs-icon-default);
  display: flex;
  align-items: center;
  transition: transform 0.bs-2s;
}
.bs-acc-item.bs-open .bs-acc-chevron { transform: rotate(180deg); }
.bs-acc-body {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.bs-25s ease, padding 0.bs-25s;
  padding: 0 var(--bs-spacing-200);
  font-size: var(--bs-font-size-sm);
  color: var(--bs-text-secondary);
  line-height: var(--bs-line-height-normal);
}
.bs-acc-item.bs-open .bs-acc-body {
  max-height: 200px;
  padding: 0 var(--bs-spacing-200) var(--bs-spacing-200);
}
</style>

<div class="bs-accordion">
  <div class="bs-acc-item bs-open">
    <button class="bs-acc-header" aria-expanded="true" aria-controls="panel-1"
      onclick="var i=this.closest('.acc-item');i.classList.toggle('open');this.setAttribute('aria-expanded',i.classList.contains('open'))">
      <span class="bs-acc-label">Label</span>
      <span class="bs-acc-chevron" aria-hidden="true"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg></span>
    </button>
    <div class="bs-acc-body" id="panel-1" role="region">
      This is placeholder content that expands to show more details when needed.
    </div>
  </div>

  <div class="bs-acc-item">
    <button class="bs-acc-header" aria-expanded="false" aria-controls="panel-2"
      onclick="var i=this.closest('.acc-item');i.classList.toggle('open');this.setAttribute('aria-expanded',i.classList.contains('open'))">
      <span class="bs-acc-label">Label</span>
      <span class="bs-acc-chevron" aria-hidden="true"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg></span>
    </button>
    <div class="bs-acc-body" id="panel-2" role="region">
      This is placeholder content that expands to show more details when needed.
    </div>
  </div>

  <div class="bs-acc-item">
    <button class="bs-acc-header" aria-expanded="false" aria-controls="panel-3"
      onclick="var i=this.closest('.acc-item');i.classList.toggle('open');this.setAttribute('aria-expanded',i.classList.contains('open'))">
      <span class="bs-acc-label">Label</span>
      <span class="bs-acc-chevron" aria-hidden="true"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg></span>
    </button>
    <div class="bs-acc-body" id="panel-3" role="region">
      This is placeholder content that expands to show more details when needed.
    </div>
  </div>

  <div class="bs-acc-item bs-is-active">
    <button class="bs-acc-header" aria-expanded="false" aria-controls="panel-4"
      onclick="var i=this.closest('.acc-item');i.classList.toggle('open');this.setAttribute('aria-expanded',i.classList.contains('open'))">
      <span class="bs-acc-label">Label</span>
      <span class="bs-acc-chevron" aria-hidden="true"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg></span>
    </button>
    <div class="bs-acc-body" id="panel-4" role="region">
      This is placeholder content that expands to show more details when needed.
    </div>
  </div>
</div>
```
