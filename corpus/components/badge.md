# Badge

**Type:** UI Component
**Source:** BrandSync Design System (Strapi)

## Description

Badges are small status indicators that display counts, labels, or states on elements.

## Variants

- Numeric
- Dot
- Icon
- Tab Counter

## Frameworks

- HTML

## Design Tokens

- `--bs-font-size-xs`
- `--bs-font-size-md`
- `--bs-font-size-2xs`
- `--bs-spacing-100`
- `--bs-font-size-2xl`
- `--bs-border-radius-full`
- `--bs-color-primary-default`
- `--bs-text-inverse`
- `--bs-color-success-default`
- `--bs-color-warning-default`
- `--bs-color-error-default`
- `--bs-color-info-default`
- `--bs-color-neutral-default`
- `--bs-color-primary-container`
- `--bs-surface-success`
- `--bs-text-success`
- `--bs-surface-warning`
- `--bs-text-warning`
- `--bs-surface-error`
- `--bs-text-error`
- `--bs-surface-info`
- `--bs-text-info`
- `--bs-surface-container`
- `--bs-text-muted`
- `--bs-spacing-200`

## CSS Classes

- `bs-badge`
- `bs-badge--numeric`
- `bs-badge--primary`
- `bs-badge--success`
- `bs-badge--warning`
- `bs-badge--error`
- `bs-badge--info`
- `bs-badge--neutral`
- `bs-badge--primary-c`
- `bs-badge--success-c`
- `bs-badge--warning-c`
- `bs-badge--error-c`
- `bs-badge--info-c`
- `bs-badge--neutral-c`
- `bs-badge--dot`
- `bs-badge--icon`
- `bs-badge--tab`

## Code Examples

#### Numeric (HTML)

```html
<!-- brandsync: Badge / Numeric | requires: brandsync-tokens -->
<style>
.bs-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: inherit;
  font-weight: 500;
  font-size: var(--bs-font-size-xs);
  line-height: var(--bs-font-size-md);
  white-space: nowrap;
}
/* Numeric */
.bs-badge--numeric {
  width: var(--bs-font-size-md);
  height: var(--bs-font-size-md);
  border-radius: 50%;
  font-size: var(--bs-font-size-2xs);
  line-height: 1;
}
/* Dot */
.bs-badge--dot {
  width: var(--bs-spacing-100);
  height: var(--bs-spacing-100);
  border-radius: 50%;
  padding: 0;
}
/* Icon */
.bs-badge--icon {
  width: var(--bs-font-size-md);
  height: var(--bs-font-size-md);
  border-radius: 50%;
}
.bs-badge--icon svg { width: var(--bs-font-size-xs); height: var(--bs-font-size-xs); display: block; }
/* Tab Counter */
.bs-badge--tab {
  height: var(--bs-font-size-2xl);
  border-radius: var(--bs-border-radius-full);
  padding: 0 8px;
}
/* Colors */
.bs-badge--primary   { background: var(--bs-color-primary-default);   color: var(--bs-text-inverse); }
.bs-badge--success   { background: var(--bs-color-success-default);   color: var(--bs-text-inverse); }
.bs-badge--warning   { background: var(--bs-color-warning-default);   color: var(--bs-text-inverse); }
.bs-badge--error     { background: var(--bs-color-error-default);     color: var(--bs-text-inverse); }
.bs-badge--info      { background: var(--bs-color-info-default);      color: var(--bs-text-inverse); }
.bs-badge--neutral   { background: var(--bs-color-neutral-default);   color: var(--bs-text-inverse); }
.bs-badge--primary-c { background: var(--bs-color-primary-container);   color: var(--bs-text-inverse); }
.bs-badge--success-c { background: var(--bs-surface-success);   color: var(--bs-text-success); }
.bs-badge--warning-c { background: var(--bs-surface-warning);   color: var(--bs-text-warning); }
.bs-badge--error-c   { background: var(--bs-surface-error);     color: var(--bs-text-error);   }
.bs-badge--info-c    { background: var(--bs-surface-info);      color: var(--bs-text-info);    }
.bs-badge--neutral-c { background: var(--bs-surface-container);   color: var(--bs-text-muted); }
</style>
<div style="display:flex;flex-wrap:wrap;gap: var(--bs-spacing-200);align-items:center;">
<span class="bs-badge bs-badge--numeric bs-badge--primary">5</span>
<span class="bs-badge bs-badge--numeric bs-badge--success">5</span>
<span class="bs-badge bs-badge--numeric bs-badge--warning">5</span>
<span class="bs-badge bs-badge--numeric bs-badge--error">5</span>
<span class="bs-badge bs-badge--numeric bs-badge--info">5</span>
<span class="bs-badge bs-badge--numeric bs-badge--neutral">5</span>
<span class="bs-badge bs-badge--numeric bs-badge--primary-c">5</span>
<span class="bs-badge bs-badge--numeric bs-badge--success-c">5</span>
<span class="bs-badge bs-badge--numeric bs-badge--warning-c">5</span>
<span class="bs-badge bs-badge--numeric bs-badge--error-c">5</span>
<span class="bs-badge bs-badge--numeric bs-badge--info-c">5</span>
<span class="bs-badge bs-badge--numeric bs-badge--neutral-c">5</span>
</div>
```

#### Dot (HTML)

```html
<!-- brandsync: Badge / Dot | requires: brandsync-tokens -->
<style>
.bs-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: inherit;
  font-weight: 500;
  font-size: var(--bs-font-size-xs);
  line-height: var(--bs-font-size-md);
  white-space: nowrap;
}
/* Numeric */
.bs-badge--numeric {
  width: var(--bs-font-size-md);
  height: var(--bs-font-size-md);
  border-radius: 50%;
  font-size: var(--bs-font-size-2xs);
  line-height: 1;
}
/* Dot */
.bs-badge--dot {
  width: var(--bs-spacing-100);
  height: var(--bs-spacing-100);
  border-radius: 50%;
  padding: 0;
}
/* Icon */
.bs-badge--icon {
  width: var(--bs-font-size-md);
  height: var(--bs-font-size-md);
  border-radius: 50%;
}
.bs-badge--icon svg { width: var(--bs-font-size-xs); height: var(--bs-font-size-xs); display: block; }
/* Tab Counter */
.bs-badge--tab {
  height: var(--bs-font-size-2xl);
  border-radius: var(--bs-border-radius-full);
  padding: 0 8px;
}
/* Colors */
.bs-badge--primary   { background: var(--bs-color-primary-default);   color: var(--bs-text-inverse); }
.bs-badge--success   { background: var(--bs-color-success-default);   color: var(--bs-text-inverse); }
.bs-badge--warning   { background: var(--bs-color-warning-default);   color: var(--bs-text-inverse); }
.bs-badge--error     { background: var(--bs-color-error-default);     color: var(--bs-text-inverse); }
.bs-badge--info      { background: var(--bs-color-info-default);      color: var(--bs-text-inverse); }
.bs-badge--neutral   { background: var(--bs-color-neutral-default);   color: var(--bs-text-inverse); }
.bs-badge--primary-c { background: var(--bs-color-primary-container);   color: var(--bs-text-inverse); }
.bs-badge--success-c { background: var(--bs-surface-success);   color: var(--bs-text-success); }
.bs-badge--warning-c { background: var(--bs-surface-warning);   color: var(--bs-text-warning); }
.bs-badge--error-c   { background: var(--bs-surface-error);     color: var(--bs-text-error);   }
.bs-badge--info-c    { background: var(--bs-surface-info);      color: var(--bs-text-info);    }
.bs-badge--neutral-c { background: var(--bs-surface-container);   color: var(--bs-text-muted); }
</style>
<div style="display:flex;flex-wrap:wrap;gap: var(--bs-spacing-200);align-items:center;">
<span class="bs-badge bs-badge--dot bs-badge--primary"></span>
<span class="bs-badge bs-badge--dot bs-badge--success"></span>
<span class="bs-badge bs-badge--dot bs-badge--warning"></span>
<span class="bs-badge bs-badge--dot bs-badge--error"></span>
<span class="bs-badge bs-badge--dot bs-badge--info"></span>
<span class="bs-badge bs-badge--dot bs-badge--neutral"></span>
</div>
```

#### Icon (HTML)

```html
<!-- brandsync: Badge / Icon | requires: brandsync-tokens -->
<style>
.bs-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: inherit;
  font-weight: 500;
  font-size: var(--bs-font-size-xs);
  line-height: var(--bs-font-size-md);
  white-space: nowrap;
}
/* Numeric */
.bs-badge--numeric {
  width: var(--bs-font-size-md);
  height: var(--bs-font-size-md);
  border-radius: 50%;
  font-size: var(--bs-font-size-2xs);
  line-height: 1;
}
/* Dot */
.bs-badge--dot {
  width: var(--bs-spacing-100);
  height: var(--bs-spacing-100);
  border-radius: 50%;
  padding: 0;
}
/* Icon */
.bs-badge--icon {
  width: var(--bs-font-size-md);
  height: var(--bs-font-size-md);
  border-radius: 50%;
}
.bs-badge--icon svg { width: var(--bs-font-size-xs); height: var(--bs-font-size-xs); display: block; }
/* Tab Counter */
.bs-badge--tab {
  height: var(--bs-font-size-2xl);
  border-radius: var(--bs-border-radius-full);
  padding: 0 8px;
}
/* Colors */
.bs-badge--primary   { background: var(--bs-color-primary-default);   color: var(--bs-text-inverse); }
.bs-badge--success   { background: var(--bs-color-success-default);   color: var(--bs-text-inverse); }
.bs-badge--warning   { background: var(--bs-color-warning-default);   color: var(--bs-text-inverse); }
.bs-badge--error     { background: var(--bs-color-error-default);     color: var(--bs-text-inverse); }
.bs-badge--info      { background: var(--bs-color-info-default);      color: var(--bs-text-inverse); }
.bs-badge--neutral   { background: var(--bs-color-neutral-default);   color: var(--bs-text-inverse); }
.bs-badge--primary-c { background: var(--bs-color-primary-container);   color: var(--bs-text-inverse); }
.bs-badge--success-c { background: var(--bs-surface-success);   color: var(--bs-text-success); }
.bs-badge--warning-c { background: var(--bs-surface-warning);   color: var(--bs-text-warning); }
.bs-badge--error-c   { background: var(--bs-surface-error);     color: var(--bs-text-error);   }
.bs-badge--info-c    { background: var(--bs-surface-info);      color: var(--bs-text-info);    }
.bs-badge--neutral-c { background: var(--bs-surface-container);   color: var(--bs-text-muted); }
</style>
<div style="display:flex;flex-wrap:wrap;gap: var(--bs-spacing-200);align-items:center;">
<span class="bs-badge bs-badge--icon bs-badge--primary"><svg viewBox="0 0 12 12" fill="none"><path d="M6 1a3.5 3.5 0 0 0-3.5 3.5v2L1 8h10l-1.5-1.5v-2A3.5 3.5 0 0 0 6 1zM5 9.5a1 1 0 0 0 2 0" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
<span class="bs-badge bs-badge--icon bs-badge--success"><svg viewBox="0 0 12 12" fill="none"><path d="M6 1a3.5 3.5 0 0 0-3.5 3.5v2L1 8h10l-1.5-1.5v-2A3.5 3.5 0 0 0 6 1zM5 9.5a1 1 0 0 0 2 0" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
<span class="bs-badge bs-badge--icon bs-badge--warning"><svg viewBox="0 0 12 12" fill="none"><path d="M6 1a3.5 3.5 0 0 0-3.5 3.5v2L1 8h10l-1.5-1.5v-2A3.5 3.5 0 0 0 6 1zM5 9.5a1 1 0 0 0 2 0" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
<span class="bs-badge bs-badge--icon bs-badge--error"><svg viewBox="0 0 12 12" fill="none"><path d="M6 1a3.5 3.5 0 0 0-3.5 3.5v2L1 8h10l-1.5-1.5v-2A3.5 3.5 0 0 0 6 1zM5 9.5a1 1 0 0 0 2 0" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
<span class="bs-badge bs-badge--icon bs-badge--info"><svg viewBox="0 0 12 12" fill="none"><path d="M6 1a3.5 3.5 0 0 0-3.5 3.5v2L1 8h10l-1.5-1.5v-2A3.5 3.5 0 0 0 6 1zM5 9.5a1 1 0 0 0 2 0" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
<span class="bs-badge bs-badge--icon bs-badge--neutral"><svg viewBox="0 0 12 12" fill="none"><path d="M6 1a3.5 3.5 0 0 0-3.5 3.5v2L1 8h10l-1.5-1.5v-2A3.5 3.5 0 0 0 6 1zM5 9.5a1 1 0 0 0 2 0" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
<span class="bs-badge bs-badge--icon bs-badge--primary-c"><svg viewBox="0 0 12 12" fill="none"><path d="M6 1a3.5 3.5 0 0 0-3.5 3.5v2L1 8h10l-1.5-1.5v-2A3.5 3.5 0 0 0 6 1zM5 9.5a1 1 0 0 0 2 0" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
<span class="bs-badge bs-badge--icon bs-badge--success-c"><svg viewBox="0 0 12 12" fill="none"><path d="M6 1a3.5 3.5 0 0 0-3.5 3.5v2L1 8h10l-1.5-1.5v-2A3.5 3.5 0 0 0 6 1zM5 9.5a1 1 0 0 0 2 0" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
<span class="bs-badge bs-badge--icon bs-badge--warning-c"><svg viewBox="0 0 12 12" fill="none"><path d="M6 1a3.5 3.5 0 0 0-3.5 3.5v2L1 8h10l-1.5-1.5v-2A3.5 3.5 0 0 0 6 1zM5 9.5a1 1 0 0 0 2 0" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
<span class="bs-badge bs-badge--icon bs-badge--error-c"><svg viewBox="0 0 12 12" fill="none"><path d="M6 1a3.5 3.5 0 0 0-3.5 3.5v2L1 8h10l-1.5-1.5v-2A3.5 3.5 0 0 0 6 1zM5 9.5a1 1 0 0 0 2 0" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
<span class="bs-badge bs-badge--icon bs-badge--info-c"><svg viewBox="0 0 12 12" fill="none"><path d="M6 1a3.5 3.5 0 0 0-3.5 3.5v2L1 8h10l-1.5-1.5v-2A3.5 3.5 0 0 0 6 1zM5 9.5a1 1 0 0 0 2 0" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
<span class="bs-badge bs-badge--icon bs-badge--neutral-c"><svg viewBox="0 0 12 12" fill="none"><path d="M6 1a3.5 3.5 0 0 0-3.5 3.5v2L1 8h10l-1.5-1.5v-2A3.5 3.5 0 0 0 6 1zM5 9.5a1 1 0 0 0 2 0" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
</div>
```

#### Tab Counter (HTML)

```html
<!-- brandsync: Badge / Tab Counter | requires: brandsync-tokens -->
<style>
.bs-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: inherit;
  font-weight: 500;
  font-size: var(--bs-font-size-xs);
  line-height: var(--bs-font-size-md);
  white-space: nowrap;
}
/* Numeric */
.bs-badge--numeric {
  width: var(--bs-font-size-md);
  height: var(--bs-font-size-md);
  border-radius: 50%;
  font-size: var(--bs-font-size-2xs);
  line-height: 1;
}
/* Dot */
.bs-badge--dot {
  width: var(--bs-spacing-100);
  height: var(--bs-spacing-100);
  border-radius: 50%;
  padding: 0;
}
/* Icon */
.bs-badge--icon {
  width: var(--bs-font-size-md);
  height: var(--bs-font-size-md);
  border-radius: 50%;
}
.bs-badge--icon svg { width: var(--bs-font-size-xs); height: var(--bs-font-size-xs); display: block; }
/* Tab Counter */
.bs-badge--tab {
  height: var(--bs-font-size-2xl);
  border-radius: var(--bs-border-radius-full);
  padding: 0 8px;
}
/* Colors */
.bs-badge--primary   { background: var(--bs-color-primary-default);   color: var(--bs-text-inverse); }
.bs-badge--success   { background: var(--bs-color-success-default);   color: var(--bs-text-inverse); }
.bs-badge--warning   { background: var(--bs-color-warning-default);   color: var(--bs-text-inverse); }
.bs-badge--error     { background: var(--bs-color-error-default);     color: var(--bs-text-inverse); }
.bs-badge--info      { background: var(--bs-color-info-default);      color: var(--bs-text-inverse); }
.bs-badge--neutral   { background: var(--bs-color-neutral-default);   color: var(--bs-text-inverse); }
.bs-badge--primary-c { background: var(--bs-color-primary-container);   color: var(--bs-text-inverse); }
.bs-badge--success-c { background: var(--bs-surface-success);   color: var(--bs-text-success); }
.bs-badge--warning-c { background: var(--bs-surface-warning);   color: var(--bs-text-warning); }
.bs-badge--error-c   { background: var(--bs-surface-error);     color: var(--bs-text-error);   }
.bs-badge--info-c    { background: var(--bs-surface-info);      color: var(--bs-text-info);    }
.bs-badge--neutral-c { background: var(--bs-surface-container);   color: var(--bs-text-muted); }
</style>
<div style="display:flex;flex-wrap:wrap;gap: var(--bs-spacing-200);align-items:center;">
<span class="bs-badge bs-badge--tab bs-badge--primary">12</span>
<span class="bs-badge bs-badge--tab bs-badge--success">12</span>
<span class="bs-badge bs-badge--tab bs-badge--warning">12</span>
<span class="bs-badge bs-badge--tab bs-badge--error">12</span>
<span class="bs-badge bs-badge--tab bs-badge--info">12</span>
<span class="bs-badge bs-badge--tab bs-badge--neutral">12</span>
<span class="bs-badge bs-badge--tab bs-badge--primary-c">12</span>
<span class="bs-badge bs-badge--tab bs-badge--success-c">12</span>
<span class="bs-badge bs-badge--tab bs-badge--warning-c">12</span>
<span class="bs-badge bs-badge--tab bs-badge--error-c">12</span>
<span class="bs-badge bs-badge--tab bs-badge--info-c">12</span>
<span class="bs-badge bs-badge--tab bs-badge--neutral-c">12</span>
</div>
```
