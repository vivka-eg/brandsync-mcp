# Tooltip

**Type:** UI Component
**Source:** BrandSync Design System (Strapi)

## Description

Tooltips display brief informative text when users hover, focus, or tap an element. They provide contextual help without interrupting the user's flow.

## Variants

- Default
- Bottom
- Info

## Frameworks

- HTML

## Design Tokens

- `--bs-spacing-100`
- `--bs-spacing-150`
- `--bs-surface-container`
- `--bs-border-default`
- `--bs-border-radius-100`
- `--bs-font-size-sm`
- `--bs-text-default`
- `--bs-border-neutral-focus`
- `--bs-color-neutral-default`
- `--bs-text-inverse`
- `--bs-font-size-xs`
- `--bs-spacing-75`
- `--bs-border-radius-50`
- `--bs-spacing-250`
- `--bs-border-radius-full`
- `--bs-color-info-default`

## CSS Classes

- `bs-tooltip-wrapper`
- `bs-tooltip-trigger`
- `bs-tooltip`
- `bs-tooltip-bottom`
- `bs-info-icon`

## Code Examples

### Variants

#### Default (HTML)

```html
<!-- brandsync: Tooltip / Variants / Default | requires: brandsync-tokens -->
<style>
.bs-tooltip-wrapper { position: relative; display: inline-block; }
.bs-tooltip-trigger { padding: var(--bs-spacing-100) var(--bs-spacing-150); background: var(--bs-surface-container); border: 1px solid var(--bs-border-default); border-radius: var(--bs-border-radius-100); font-size: var(--bs-font-size-sm); cursor: default; color: var(--bs-text-default); font-family: inherit; }
.bs-tooltip-trigger:focus-visible { outline: 2px solid var(--bs-border-neutral-focus); outline-offset: 2px; }
.bs-tooltip { position: absolute; bottom: calc(100% + var(--bs-spacing-100)); left: 50%; transform: translateX(-50%); background: var(--bs-color-neutral-default); color: var(--bs-text-inverse); font-size: var(--bs-font-size-xs); padding: var(--bs-spacing-75) var(--bs-spacing-100); border-radius: var(--bs-border-radius-50); white-space: nowrap; pointer-events: none; opacity: 0; transition: opacity 0.bs-15s; z-index: 100; }
.bs-tooltip::after { content: ''; position: absolute; top: 100%; left: 50%; transform: translateX(-50%); border: 4px solid transparent; border-top-color: var(--bs-color-neutral-default); }
.bs-tooltip-wrapper:hover .bs-tooltip,
.bs-tooltip-wrapper:focus-within .bs-tooltip { opacity: 1; }
</style>
<div class="bs-tooltip-wrapper">
  <button class="bs-tooltip-trigger" tabindex="0">Hover me</button>
  <div class="bs-tooltip" role="tooltip">This is a helpful tooltip</div>
</div>
```

#### Bottom (HTML)

```html
<!-- brandsync: Tooltip / Variants / Bottom | requires: brandsync-tokens -->
<style>
.bs-tooltip-wrapper { position: relative; display: inline-block; }
.bs-tooltip-trigger { padding: var(--bs-spacing-100) var(--bs-spacing-150); background: var(--bs-surface-container); border: 1px solid var(--bs-border-default); border-radius: var(--bs-border-radius-100); font-size: var(--bs-font-size-sm); cursor: default; color: var(--bs-text-default); font-family: inherit; }
.bs-tooltip-bottom { position: absolute; top: calc(100% + var(--bs-spacing-100)); left: 50%; transform: translateX(-50%); background: var(--bs-color-neutral-default); color: var(--bs-text-inverse); font-size: var(--bs-font-size-xs); padding: var(--bs-spacing-75) var(--bs-spacing-100); border-radius: var(--bs-border-radius-50); white-space: nowrap; pointer-events: none; opacity: 0; transition: opacity 0.bs-15s; z-index: 100; }
.bs-tooltip-bottom::before { content: ''; position: absolute; bottom: 100%; left: 50%; transform: translateX(-50%); border: 4px solid transparent; border-bottom-color: var(--bs-color-neutral-default); }
.bs-tooltip-wrapper:hover .bs-tooltip-bottom,
.bs-tooltip-wrapper:focus-within .bs-tooltip-bottom { opacity: 1; }
</style>
<div class="bs-tooltip-wrapper">
  <button class="bs-tooltip-trigger" tabindex="0">Bottom tooltip</button>
  <div class="bs-tooltip-bottom" role="tooltip">Appears below</div>
</div>
```

#### Info (HTML)

```html
<!-- brandsync: Tooltip / Variants / Info | requires: brandsync-tokens -->
<style>
.bs-tooltip-wrapper { position: relative; display: inline-block; }
.bs-info-icon { width: var(--bs-spacing-250); height: var(--bs-spacing-250); border-radius: var(--bs-border-radius-full); background: var(--bs-color-info-default); color: var(--bs-text-inverse); font-size: var(--bs-font-size-xs); font-weight: 700; display: flex; align-items: center; justify-content: center; cursor: pointer; border: none; font-family: inherit; }
.bs-info-icon:focus-visible { outline: 2px solid var(--bs-border-neutral-focus); outline-offset: 2px; }
.bs-tooltip { position: absolute; bottom: calc(100% + var(--bs-spacing-100)); left: 50%; transform: translateX(-50%); background: var(--bs-color-neutral-default); color: var(--bs-text-inverse); font-size: var(--bs-font-size-xs); padding: var(--bs-spacing-75) var(--bs-spacing-150); border-radius: var(--bs-border-radius-50); white-space: nowrap; pointer-events: none; opacity: 0; transition: opacity 0.bs-15s; z-index: 100; }
.bs-tooltip-wrapper:hover .bs-tooltip,
.bs-tooltip-wrapper:focus-within .bs-tooltip { opacity: 1; }
</style>
<div class="bs-tooltip-wrapper">
  <button class="bs-info-icon" tabindex="0" aria-label="More information">i</button>
  <div class="bs-tooltip" role="tooltip">Additional context here</div>
</div>
```
