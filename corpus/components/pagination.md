# Pagination

**Type:** UI Component
**Source:** BrandSync Design System (Strapi)

## Description

Pagination allows users to navigate between pages of content.

## Variants

- Default
- Input Pagination

## Frameworks

- HTML

## Design Tokens

- `--bs-spacing-50`
- `--bs-font-size-md`
- `--bs-font-size-2xl`
- `--bs-spacing-550`
- `--bs-border-radius-100`
- `--bs-border-default`
- `--bs-text-default`
- `--bs-surface-hover`
- `--bs-border-neutral-hover`
- `--bs-surface-active`
- `--bs-border-neutral-focus`
- `--bs-color-primary-default`
- `--bs-text-inverse`
- `--bs-color-primary-hover`
- `--bs-text-on-disabled`
- `--bs-font-size-xl`
- `--bs-text-secondary`
- `--bs-spacing-150`
- `--bs-spacing-800`
- `--bs-surface-base`
- `--bs-border-primary`

## CSS Classes

- `bs-pagination`
- `bs-page-btn`
- `bs-page-btn--disabled`
- `bs-page-btn--active`
- `bs-page-ellipsis`
- `bs-pagination--input`
- `bs-pagination__label`
- `bs-pagination__input`

## Code Examples

#### Default (HTML)

```html
<!-- brandsync: Pagination / Default | requires: brandsync-tokens -->
<style>
.bs-pagination {
  display: inline-flex;
  align-items: center;
  gap: var(--bs-spacing-50);
  font-family: inherit;
  font-size: var(--bs-font-size-md);
  line-height: var(--bs-font-size-2xl);
}
.bs-page-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: var(--bs-spacing-550);
  height: var(--bs-spacing-550);
  border-radius: var(--bs-border-radius-100);
  border: 1px solid var(--bs-border-default);
  background: transparent;
  color: var(--bs-text-default);
  font-family: inherit;
  font-size: var(--bs-font-size-md);
  font-weight: 400;
  cursor: pointer;
  transition: all 0.bs-15s ease;
  outline: none;
  flex-shrink: 0;
}
.bs-page-btn:hover { background: var(--bs-surface-hover); border-color: var(--bs-border-neutral-hover); }
.bs-page-btn:active { background: var(--bs-surface-active); }
.bs-page-btn:focus-visible { outline: 2px solid var(--bs-border-neutral-focus); outline-offset: 2px; }
.bs-page-btn--active {
  background: var(--bs-color-primary-default);
  border-color: var(--bs-color-primary-default);
  color: var(--bs-text-inverse);
  font-weight: 600;
}
.bs-page-btn--active:hover { background: var(--bs-color-primary-hover); border-color: var(--bs-color-primary-hover); }
.bs-page-btn--disabled { color: var(--bs-text-on-disabled); border-color: var(--bs-border-default); cursor: not-allowed; pointer-events: none; opacity: 0.bs-5; }
.bs-page-btn svg { width: var(--bs-font-size-xl); height: var(--bs-font-size-xl); }
.bs-page-ellipsis {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: var(--bs-spacing-550);
  height: var(--bs-spacing-550);
  color: var(--bs-text-secondary);
  font-size: var(--bs-font-size-md);
  letter-spacing: 1px;
}
/* Input pagination */
.bs-pagination--input {
  gap: var(--bs-spacing-150);
}
.bs-pagination__label {
  color: var(--bs-text-default);
  font-size: var(--bs-font-size-md);
  white-space: nowrap;
}
.bs-pagination__input {
  width: var(--bs-spacing-800);
  height: var(--bs-spacing-550);
  border-radius: var(--bs-border-radius-100);
  border: 1px solid var(--bs-border-default);
  background: var(--bs-surface-base);
  color: var(--bs-text-default);
  font-family: inherit;
  font-size: var(--bs-font-size-md);
  text-align: center;
  outline: none;
  transition: all 0.bs-15s ease;
}
.bs-pagination__input:focus { border-color: var(--bs-border-primary); outline: 2px solid var(--bs-border-neutral-focus); outline-offset: 2px; }
</style>
<div style="display:flex;flex-direction:column;gap:24px;align-items:flex-start;">
<div class="bs-pagination"><button class="bs-page-btn bs-page-btn--disabled" aria-label="Previous"><svg viewBox="0 0 20 20" fill="none"><path d="M13 4l-6 6 6 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></button><button class="bs-page-btn bs-page-btn--active">1</button><button class="bs-page-btn">2</button><button class="bs-page-btn">3</button><span class="bs-page-ellipsis">···</span><button class="bs-page-btn">8</button><button class="bs-page-btn">9</button><button class="bs-page-btn" aria-label="Next"><svg viewBox="0 0 20 20" fill="none"><path d="M7 4l6 6-6 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></button></div>
</div>
```

#### Input Pagination (HTML)

```html
<!-- brandsync: Pagination / Input Pagination | requires: brandsync-tokens -->
<style>
.bs-pagination {
  display: inline-flex;
  align-items: center;
  gap: var(--bs-spacing-50);
  font-family: inherit;
  font-size: var(--bs-font-size-md);
  line-height: var(--bs-font-size-2xl);
}
.bs-page-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: var(--bs-spacing-550);
  height: var(--bs-spacing-550);
  border-radius: var(--bs-border-radius-100);
  border: 1px solid var(--bs-border-default);
  background: transparent;
  color: var(--bs-text-default);
  font-family: inherit;
  font-size: var(--bs-font-size-md);
  font-weight: 400;
  cursor: pointer;
  transition: all 0.bs-15s ease;
  outline: none;
  flex-shrink: 0;
}
.bs-page-btn:hover { background: var(--bs-surface-hover); border-color: var(--bs-border-neutral-hover); }
.bs-page-btn:active { background: var(--bs-surface-active); }
.bs-page-btn:focus-visible { outline: 2px solid var(--bs-border-neutral-focus); outline-offset: 2px; }
.bs-page-btn--active {
  background: var(--bs-color-primary-default);
  border-color: var(--bs-color-primary-default);
  color: var(--bs-text-inverse);
  font-weight: 600;
}
.bs-page-btn--active:hover { background: var(--bs-color-primary-hover); border-color: var(--bs-color-primary-hover); }
.bs-page-btn--disabled { color: var(--bs-text-on-disabled); border-color: var(--bs-border-default); cursor: not-allowed; pointer-events: none; opacity: 0.bs-5; }
.bs-page-btn svg { width: var(--bs-font-size-xl); height: var(--bs-font-size-xl); }
.bs-page-ellipsis {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: var(--bs-spacing-550);
  height: var(--bs-spacing-550);
  color: var(--bs-text-secondary);
  font-size: var(--bs-font-size-md);
  letter-spacing: 1px;
}
/* Input pagination */
.bs-pagination--input {
  gap: var(--bs-spacing-150);
}
.bs-pagination__label {
  color: var(--bs-text-default);
  font-size: var(--bs-font-size-md);
  white-space: nowrap;
}
.bs-pagination__input {
  width: var(--bs-spacing-800);
  height: var(--bs-spacing-550);
  border-radius: var(--bs-border-radius-100);
  border: 1px solid var(--bs-border-default);
  background: var(--bs-surface-base);
  color: var(--bs-text-default);
  font-family: inherit;
  font-size: var(--bs-font-size-md);
  text-align: center;
  outline: none;
  transition: all 0.bs-15s ease;
}
.bs-pagination__input:focus { border-color: var(--bs-border-primary); outline: 2px solid var(--bs-border-neutral-focus); outline-offset: 2px; }
</style>
<div style="display:flex;flex-direction:column;gap:24px;align-items:flex-start;">
<div class="bs-pagination bs-pagination--input"><button class="bs-page-btn bs-page-btn--disabled" aria-label="Previous"><svg viewBox="0 0 20 20" fill="none"><path d="M13 4l-6 6 6 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></button><button class="bs-page-btn bs-page-btn--active">1</button><button class="bs-page-btn">2</button><button class="bs-page-btn">3</button><span class="bs-page-ellipsis">···</span><button class="bs-page-btn">9</button><button class="bs-page-btn" aria-label="Next"><svg viewBox="0 0 20 20" fill="none"><path d="M7 4l6 6-6 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></button></div><div class="bs-pagination bs-pagination--input" style="align-items:center;"><span class="bs-pagination__label">Go to page</span><input class="bs-pagination__input" type="number" min="1" max="9" value="1" aria-label="Go to page"><span class="bs-pagination__label">of 9</span></div>
</div>
```
