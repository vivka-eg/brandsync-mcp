# Avatar

**Type:** UI Component
**Source:** BrandSync Design System (Strapi)

## Description

Avatars represent a user or entity with an image, initials, or icon.

## Variants

- Image
- Initials
- Icon
- Group

## Frameworks

- HTML

## Design Tokens

- `--bs-color-primary-default`
- `--bs-surface-container`
- `--bs-text-default`
- `--bs-color-primary-hover`
- `--bs-color-primary-pressed`
- `--bs-border-neutral-focus`
- `--bs-font-size-2xl`
- `--bs-font-size-2xs`
- `--bs-spacing-400`
- `--bs-font-size-xs`
- `--bs-spacing-500`
- `--bs-font-size-sm`
- `--bs-spacing-600`
- `--bs-font-size-md`
- `--bs-spacing-700`
- `--bs-font-size-lg`
- `--bs-spacing-200`
- `--bs-color-neutral-default`
- `--bs-icon-muted`
- `--bs-color-neutral-container`
- `--bs-text-muted`

## CSS Classes

- `bs-avatar`
- `bs-avatar--xs`
- `bs-avatar--sm`
- `bs-avatar--md`
- `bs-avatar--lg`
- `bs-avatar--xl`
- `bs-avatar-group`

## Code Examples

#### Image (HTML)

```html
<!-- brandsync: Avatar / Image | requires: brandsync-tokens -->
<style>
.bs-avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  border: 1.bs-5px solid var(--bs-color-primary-default);
  background: var(--bs-surface-container);
  overflow: hidden;
  flex-shrink: 0;
  font-family: inherit;
  font-weight: 500;
  color: var(--bs-text-default);
  position: relative;
  transition: all 0.bs-15s ease;
}
.bs-avatar:hover { border-color: var(--bs-color-primary-hover); }
.bs-avatar:active { border-color: var(--bs-color-primary-pressed); }
.bs-avatar:focus-visible { outline: 2px solid var(--bs-border-neutral-focus); outline-offset: 2px; }
.bs-avatar--xs { width: var(--bs-font-size-2xl); height: var(--bs-font-size-2xl); font-size: var(--bs-font-size-2xs); }
.bs-avatar--sm { width: var(--bs-spacing-400); height: var(--bs-spacing-400); font-size: var(--bs-font-size-xs); }
.bs-avatar--md { width: var(--bs-spacing-500); height: var(--bs-spacing-500); font-size: var(--bs-font-size-sm); }
.bs-avatar--lg { width: var(--bs-spacing-600); height: var(--bs-spacing-600); font-size: var(--bs-font-size-md); }
.bs-avatar--xl { width: var(--bs-spacing-700); height: var(--bs-spacing-700); font-size: var(--bs-font-size-lg); }
.bs-avatar img { width: 100%; height: 100%; object-fit: cover; display: block; }
.bs-avatar svg { width: 55%; height: 55%; }
.bs-avatar-group {
  display: inline-flex;
  align-items: center;
}
.bs-avatar-group .bs-avatar {
  margin-left: -8px;
  border: 2px solid var(--bs-surface-container);
  box-sizing: content-box;
}
.bs-avatar-group .bs-avatar:first-child { margin-left: 0; }
</style>
<div style='display:flex;align-items:center;gap: var(--bs-spacing-200);flex-wrap:wrap;'>
<div class="bs-avatar bs-avatar--xs" title="XS"><svg viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="20" fill="var(--bs-color-neutral-default)"/><circle cx="20" cy="16" r="7" fill="var(--bs-icon-muted)"/><ellipse cx="20" cy="32" rx="11" ry="7" fill="var(--bs-icon-muted)"/></svg></div>
<div class="bs-avatar bs-avatar--sm" title="SM"><svg viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="20" fill="var(--bs-color-neutral-default)"/><circle cx="20" cy="16" r="7" fill="var(--bs-icon-muted)"/><ellipse cx="20" cy="32" rx="11" ry="7" fill="var(--bs-icon-muted)"/></svg></div>
<div class="bs-avatar bs-avatar--md" title="MD"><svg viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="20" fill="var(--bs-color-neutral-default)"/><circle cx="20" cy="16" r="7" fill="var(--bs-icon-muted)"/><ellipse cx="20" cy="32" rx="11" ry="7" fill="var(--bs-icon-muted)"/></svg></div>
<div class="bs-avatar bs-avatar--lg" title="LG"><svg viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="20" fill="var(--bs-color-neutral-default)"/><circle cx="20" cy="16" r="7" fill="var(--bs-icon-muted)"/><ellipse cx="20" cy="32" rx="11" ry="7" fill="var(--bs-icon-muted)"/></svg></div>
<div class="bs-avatar bs-avatar--xl" title="XL"><svg viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="20" fill="var(--bs-color-neutral-default)"/><circle cx="20" cy="16" r="7" fill="var(--bs-icon-muted)"/><ellipse cx="20" cy="32" rx="11" ry="7" fill="var(--bs-icon-muted)"/></svg></div>
</div>
```

#### Initials (HTML)

```html
<!-- brandsync: Avatar / Initials | requires: brandsync-tokens -->
<style>
.bs-avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  border: 1.bs-5px solid var(--bs-color-primary-default);
  background: var(--bs-surface-container);
  overflow: hidden;
  flex-shrink: 0;
  font-family: inherit;
  font-weight: 500;
  color: var(--bs-text-default);
  position: relative;
  transition: all 0.bs-15s ease;
}
.bs-avatar:hover { border-color: var(--bs-color-primary-hover); }
.bs-avatar:active { border-color: var(--bs-color-primary-pressed); }
.bs-avatar:focus-visible { outline: 2px solid var(--bs-border-neutral-focus); outline-offset: 2px; }
.bs-avatar--xs { width: var(--bs-font-size-2xl); height: var(--bs-font-size-2xl); font-size: var(--bs-font-size-2xs); }
.bs-avatar--sm { width: var(--bs-spacing-400); height: var(--bs-spacing-400); font-size: var(--bs-font-size-xs); }
.bs-avatar--md { width: var(--bs-spacing-500); height: var(--bs-spacing-500); font-size: var(--bs-font-size-sm); }
.bs-avatar--lg { width: var(--bs-spacing-600); height: var(--bs-spacing-600); font-size: var(--bs-font-size-md); }
.bs-avatar--xl { width: var(--bs-spacing-700); height: var(--bs-spacing-700); font-size: var(--bs-font-size-lg); }
.bs-avatar img { width: 100%; height: 100%; object-fit: cover; display: block; }
.bs-avatar svg { width: 55%; height: 55%; }
.bs-avatar-group {
  display: inline-flex;
  align-items: center;
}
.bs-avatar-group .bs-avatar {
  margin-left: -8px;
  border: 2px solid var(--bs-surface-container);
  box-sizing: content-box;
}
.bs-avatar-group .bs-avatar:first-child { margin-left: 0; }
</style>
<div style='display:flex;align-items:center;gap: var(--bs-spacing-200);flex-wrap:wrap;'>
<div class="bs-avatar bs-avatar--xs" title="XS">JD</div>
<div class="bs-avatar bs-avatar--sm" title="SM">JD</div>
<div class="bs-avatar bs-avatar--md" title="MD">JD</div>
<div class="bs-avatar bs-avatar--lg" title="LG">JD</div>
<div class="bs-avatar bs-avatar--xl" title="XL">JD</div>
</div>
```

#### Icon (HTML)

```html
<!-- brandsync: Avatar / Icon | requires: brandsync-tokens -->
<style>
.bs-avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  border: 1.bs-5px solid var(--bs-color-primary-default);
  background: var(--bs-surface-container);
  overflow: hidden;
  flex-shrink: 0;
  font-family: inherit;
  font-weight: 500;
  color: var(--bs-text-default);
  position: relative;
  transition: all 0.bs-15s ease;
}
.bs-avatar:hover { border-color: var(--bs-color-primary-hover); }
.bs-avatar:active { border-color: var(--bs-color-primary-pressed); }
.bs-avatar:focus-visible { outline: 2px solid var(--bs-border-neutral-focus); outline-offset: 2px; }
.bs-avatar--xs { width: var(--bs-font-size-2xl); height: var(--bs-font-size-2xl); font-size: var(--bs-font-size-2xs); }
.bs-avatar--sm { width: var(--bs-spacing-400); height: var(--bs-spacing-400); font-size: var(--bs-font-size-xs); }
.bs-avatar--md { width: var(--bs-spacing-500); height: var(--bs-spacing-500); font-size: var(--bs-font-size-sm); }
.bs-avatar--lg { width: var(--bs-spacing-600); height: var(--bs-spacing-600); font-size: var(--bs-font-size-md); }
.bs-avatar--xl { width: var(--bs-spacing-700); height: var(--bs-spacing-700); font-size: var(--bs-font-size-lg); }
.bs-avatar img { width: 100%; height: 100%; object-fit: cover; display: block; }
.bs-avatar svg { width: 55%; height: 55%; }
.bs-avatar-group {
  display: inline-flex;
  align-items: center;
}
.bs-avatar-group .bs-avatar {
  margin-left: -8px;
  border: 2px solid var(--bs-surface-container);
  box-sizing: content-box;
}
.bs-avatar-group .bs-avatar:first-child { margin-left: 0; }
</style>
<div style='display:flex;align-items:center;gap: var(--bs-spacing-200);flex-wrap:wrap;'>
<div class="bs-avatar bs-avatar--xs" title="XS"><svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4" stroke="var(--bs-color-primary-default)" stroke-width="1.5"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="var(--bs-color-primary-default)" stroke-width="1.5" stroke-linecap="round"/></svg></div>
<div class="bs-avatar bs-avatar--sm" title="SM"><svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4" stroke="var(--bs-color-primary-default)" stroke-width="1.5"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="var(--bs-color-primary-default)" stroke-width="1.5" stroke-linecap="round"/></svg></div>
<div class="bs-avatar bs-avatar--md" title="MD"><svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4" stroke="var(--bs-color-primary-default)" stroke-width="1.5"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="var(--bs-color-primary-default)" stroke-width="1.5" stroke-linecap="round"/></svg></div>
<div class="bs-avatar bs-avatar--lg" title="LG"><svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4" stroke="var(--bs-color-primary-default)" stroke-width="1.5"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="var(--bs-color-primary-default)" stroke-width="1.5" stroke-linecap="round"/></svg></div>
<div class="bs-avatar bs-avatar--xl" title="XL"><svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4" stroke="var(--bs-color-primary-default)" stroke-width="1.5"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="var(--bs-color-primary-default)" stroke-width="1.5" stroke-linecap="round"/></svg></div>
</div>
```

#### Group (HTML)

```html
<!-- brandsync: Avatar / Group | requires: brandsync-tokens -->
<style>
.bs-avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  border: 1.bs-5px solid var(--bs-color-primary-default);
  background: var(--bs-surface-container);
  overflow: hidden;
  flex-shrink: 0;
  font-family: inherit;
  font-weight: 500;
  color: var(--bs-text-default);
  position: relative;
  transition: all 0.bs-15s ease;
}
.bs-avatar:hover { border-color: var(--bs-color-primary-hover); }
.bs-avatar:active { border-color: var(--bs-color-primary-pressed); }
.bs-avatar:focus-visible { outline: 2px solid var(--bs-border-neutral-focus); outline-offset: 2px; }
.bs-avatar--xs { width: var(--bs-font-size-2xl); height: var(--bs-font-size-2xl); font-size: var(--bs-font-size-2xs); }
.bs-avatar--sm { width: var(--bs-spacing-400); height: var(--bs-spacing-400); font-size: var(--bs-font-size-xs); }
.bs-avatar--md { width: var(--bs-spacing-500); height: var(--bs-spacing-500); font-size: var(--bs-font-size-sm); }
.bs-avatar--lg { width: var(--bs-spacing-600); height: var(--bs-spacing-600); font-size: var(--bs-font-size-md); }
.bs-avatar--xl { width: var(--bs-spacing-700); height: var(--bs-spacing-700); font-size: var(--bs-font-size-lg); }
.bs-avatar img { width: 100%; height: 100%; object-fit: cover; display: block; }
.bs-avatar svg { width: 55%; height: 55%; }
.bs-avatar-group {
  display: inline-flex;
  align-items: center;
}
.bs-avatar-group .bs-avatar {
  margin-left: -8px;
  border: 2px solid var(--bs-surface-container);
  box-sizing: content-box;
}
.bs-avatar-group .bs-avatar:first-child { margin-left: 0; }
</style>
<div class="bs-avatar-group">
  <div class="bs-avatar bs-avatar--md"><svg viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="20" fill="var(--bs-color-neutral-default)"/><circle cx="20" cy="16" r="7" fill="var(--bs-icon-muted)"/><ellipse cx="20" cy="32" rx="11" ry="7" fill="var(--bs-icon-muted)"/></svg></div>
  <div class="bs-avatar bs-avatar--md">JD</div>
  <div class="bs-avatar bs-avatar--md"><svg viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="20" fill="var(--bs-color-neutral-default)"/><circle cx="20" cy="16" r="7" fill="var(--bs-icon-muted)"/><ellipse cx="20" cy="32" rx="11" ry="7" fill="var(--bs-icon-muted)"/></svg></div>
  <div class="bs-avatar bs-avatar--md">AB</div>
  <div class="bs-avatar bs-avatar--md" style="background:var(--bs-color-neutral-container);color:var(--bs-text-muted);font-size: var(--bs-font-size-xs);">+3</div>
</div>
```
