# Tabs

**Type:** UI Component
**Source:** BrandSync Design System (Strapi)

## Description

Tabs organise content across different screens, data sets, and other interactions.

## Variants

- Text
- Icon
- Horizontal Icon + Text
- Vertical Icon + Text

## Frameworks

- HTML

## Design Tokens

- `--bs-border-default`
- `--bs-surface-base`
- `--bs-spacing-50`
- `--bs-spacing-150`
- `--bs-spacing-200`
- `--bs-font-size-md`
- `--bs-font-size-2xl`
- `--bs-text-secondary`
- `--bs-spacing-25`
- `--bs-text-default`
- `--bs-surface-hover`
- `--bs-border-neutral-focus`
- `--bs-text-action`
- `--bs-color-primary-default`
- `--bs-text-on-disabled`

## CSS Classes

- `bs-tabs`
- `bs-tab`
- `bs-tab--active`
- `bs-tab--disabled`
- `bs-tabs--vertical`

## Code Examples

#### Text (HTML)

```html
<!-- brandsync: Tabs / Text | requires: brandsync-tokens -->
<style>
.bs-tabs {
  display: flex;
  border-bottom: 1px solid var(--bs-border-default);
  background: var(--bs-surface-base);
  width: 100%;
}
.bs-tabs--vertical {
  flex-direction: column;
  border-bottom: none;
  border-right: 1px solid var(--bs-border-default);
  width: auto;
  min-width: 180px;
}
.bs-tab {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--bs-spacing-50);
  padding: var(--bs-spacing-150) var(--bs-spacing-200);
  cursor: pointer;
  font-family: inherit;
  font-size: var(--bs-font-size-md);
  font-weight: 600;
  line-height: var(--bs-font-size-2xl);
  color: var(--bs-text-secondary);
  border: none;
  background: transparent;
  white-space: nowrap;
  transition: all 0.bs-15s ease;
  user-select: none;
  outline: none;
}
.bs-tab::after {
  content: '';
  position: absolute;
  border-radius: var(--bs-spacing-25);
  background: transparent;
  transition: all 0.bs-15s ease;
}
.bs-tabs:not(.bs-tabs--vertical) .bs-tab::after {
  bottom: -1px; left: 0; right: 0;
  height: var(--bs-spacing-25); width: auto;
}
.bs-tabs--vertical .bs-tab::after {
  top: 0; bottom: 0; right: -1px;
  width: var(--bs-spacing-25); height: auto;
}
.bs-tab:hover { color: var(--bs-text-default); background: var(--bs-surface-hover); }
.bs-tab:focus-visible { outline: 2px solid var(--bs-border-neutral-focus); outline-offset: -2px; }
.bs-tab--active { color: var(--bs-text-action); }
.bs-tab--active::after { background: var(--bs-color-primary-default); }
.bs-tab--disabled { color: var(--bs-text-on-disabled); cursor: not-allowed; pointer-events: none; }
.bs-tab svg { width: var(--bs-font-size-2xl); height: var(--bs-font-size-2xl); flex-shrink: 0; }
.bs-tabs--vertical .bs-tab { justify-content: flex-start; width: 100%; }
</style>
<div class="bs-tabs"><button class="bs-tab bs-tab--active">Overview</button><button class="bs-tab">Specification</button><button class="bs-tab">Usage</button><button class="bs-tab">Guidelines</button><button class="bs-tab bs-tab--disabled">Disabled</button></div>
<script>
document.querySelectorAll('.bs-tabs').forEach(function(tabs) {
  tabs.querySelectorAll('.bs-tab:not(.bs-tab--disabled)').forEach(function(tab) {
    tab.addEventListener('click', function() {
      tabs.querySelectorAll('.tab').forEach(function(t) { t.classList.remove('bs-tab--active'); });
      this.classList.add('bs-tab--active');
    });
  });
});
</script>
```

#### Icon (HTML)

```html
<!-- brandsync: Tabs / Icon | requires: brandsync-tokens -->
<style>
.bs-tabs {
  display: flex;
  border-bottom: 1px solid var(--bs-border-default);
  background: var(--bs-surface-base);
  width: 100%;
}
.bs-tabs--vertical {
  flex-direction: column;
  border-bottom: none;
  border-right: 1px solid var(--bs-border-default);
  width: auto;
  min-width: 180px;
}
.bs-tab {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--bs-spacing-50);
  padding: var(--bs-spacing-150) var(--bs-spacing-200);
  cursor: pointer;
  font-family: inherit;
  font-size: var(--bs-font-size-md);
  font-weight: 600;
  line-height: var(--bs-font-size-2xl);
  color: var(--bs-text-secondary);
  border: none;
  background: transparent;
  white-space: nowrap;
  transition: all 0.bs-15s ease;
  user-select: none;
  outline: none;
}
.bs-tab::after {
  content: '';
  position: absolute;
  border-radius: var(--bs-spacing-25);
  background: transparent;
  transition: all 0.bs-15s ease;
}
.bs-tabs:not(.bs-tabs--vertical) .bs-tab::after {
  bottom: -1px; left: 0; right: 0;
  height: var(--bs-spacing-25); width: auto;
}
.bs-tabs--vertical .bs-tab::after {
  top: 0; bottom: 0; right: -1px;
  width: var(--bs-spacing-25); height: auto;
}
.bs-tab:hover { color: var(--bs-text-default); background: var(--bs-surface-hover); }
.bs-tab:focus-visible { outline: 2px solid var(--bs-border-neutral-focus); outline-offset: -2px; }
.bs-tab--active { color: var(--bs-text-action); }
.bs-tab--active::after { background: var(--bs-color-primary-default); }
.bs-tab--disabled { color: var(--bs-text-on-disabled); cursor: not-allowed; pointer-events: none; }
.bs-tab svg { width: var(--bs-font-size-2xl); height: var(--bs-font-size-2xl); flex-shrink: 0; }
.bs-tabs--vertical .bs-tab { justify-content: flex-start; width: 100%; }
</style>
<div class="bs-tabs"><button class="bs-tab bs-tab--active"><svg viewBox="0 0 24 24" fill="none"><path d="M3 12L12 4l9 8v8a1 1 0 01-1 1h-5v-5H9v5H4a1 1 0 01-1-1v-8z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></button><button class="bs-tab"><svg viewBox="0 0 24 24" fill="none"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg></button><button class="bs-tab"><svg viewBox="0 0 24 24" fill="none"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></button><button class="bs-tab bs-tab--disabled"><svg viewBox="0 0 24 24" fill="none"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></button></div>
<script>
document.querySelectorAll('.bs-tabs').forEach(function(tabs) {
  tabs.querySelectorAll('.bs-tab:not(.bs-tab--disabled)').forEach(function(tab) {
    tab.addEventListener('click', function() {
      tabs.querySelectorAll('.tab').forEach(function(t) { t.classList.remove('bs-tab--active'); });
      this.classList.add('bs-tab--active');
    });
  });
});
</script>
```

#### Horizontal Icon + Text (HTML)

```html
<!-- brandsync: Tabs / Horizontal Icon + Text | requires: brandsync-tokens -->
<style>
.bs-tabs {
  display: flex;
  border-bottom: 1px solid var(--bs-border-default);
  background: var(--bs-surface-base);
  width: 100%;
}
.bs-tabs--vertical {
  flex-direction: column;
  border-bottom: none;
  border-right: 1px solid var(--bs-border-default);
  width: auto;
  min-width: 180px;
}
.bs-tab {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--bs-spacing-50);
  padding: var(--bs-spacing-150) var(--bs-spacing-200);
  cursor: pointer;
  font-family: inherit;
  font-size: var(--bs-font-size-md);
  font-weight: 600;
  line-height: var(--bs-font-size-2xl);
  color: var(--bs-text-secondary);
  border: none;
  background: transparent;
  white-space: nowrap;
  transition: all 0.bs-15s ease;
  user-select: none;
  outline: none;
}
.bs-tab::after {
  content: '';
  position: absolute;
  border-radius: var(--bs-spacing-25);
  background: transparent;
  transition: all 0.bs-15s ease;
}
.bs-tabs:not(.bs-tabs--vertical) .bs-tab::after {
  bottom: -1px; left: 0; right: 0;
  height: var(--bs-spacing-25); width: auto;
}
.bs-tabs--vertical .bs-tab::after {
  top: 0; bottom: 0; right: -1px;
  width: var(--bs-spacing-25); height: auto;
}
.bs-tab:hover { color: var(--bs-text-default); background: var(--bs-surface-hover); }
.bs-tab:focus-visible { outline: 2px solid var(--bs-border-neutral-focus); outline-offset: -2px; }
.bs-tab--active { color: var(--bs-text-action); }
.bs-tab--active::after { background: var(--bs-color-primary-default); }
.bs-tab--disabled { color: var(--bs-text-on-disabled); cursor: not-allowed; pointer-events: none; }
.bs-tab svg { width: var(--bs-font-size-2xl); height: var(--bs-font-size-2xl); flex-shrink: 0; }
.bs-tabs--vertical .bs-tab { justify-content: flex-start; width: 100%; }
</style>
<div class="bs-tabs"><button class="bs-tab bs-tab--active"><svg viewBox="0 0 24 24" fill="none"><path d="M3 12L12 4l9 8v8a1 1 0 01-1 1h-5v-5H9v5H4a1 1 0 01-1-1v-8z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>Overview</button><button class="bs-tab"><svg viewBox="0 0 24 24" fill="none"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>Specification</button><button class="bs-tab"><svg viewBox="0 0 24 24" fill="none"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>Notifications</button><button class="bs-tab bs-tab--disabled"><svg viewBox="0 0 24 24" fill="none"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>Disabled</button></div>
<script>
document.querySelectorAll('.bs-tabs').forEach(function(tabs) {
  tabs.querySelectorAll('.bs-tab:not(.bs-tab--disabled)').forEach(function(tab) {
    tab.addEventListener('click', function() {
      tabs.querySelectorAll('.tab').forEach(function(t) { t.classList.remove('bs-tab--active'); });
      this.classList.add('bs-tab--active');
    });
  });
});
</script>
```

#### Vertical Icon + Text (HTML)

```html
<!-- brandsync: Tabs / Vertical Icon + Text | requires: brandsync-tokens -->
<style>
.bs-tabs {
  display: flex;
  border-bottom: 1px solid var(--bs-border-default);
  background: var(--bs-surface-base);
  width: 100%;
}
.bs-tabs--vertical {
  flex-direction: column;
  border-bottom: none;
  border-right: 1px solid var(--bs-border-default);
  width: auto;
  min-width: 180px;
}
.bs-tab {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--bs-spacing-50);
  padding: var(--bs-spacing-150) var(--bs-spacing-200);
  cursor: pointer;
  font-family: inherit;
  font-size: var(--bs-font-size-md);
  font-weight: 600;
  line-height: var(--bs-font-size-2xl);
  color: var(--bs-text-secondary);
  border: none;
  background: transparent;
  white-space: nowrap;
  transition: all 0.bs-15s ease;
  user-select: none;
  outline: none;
}
.bs-tab::after {
  content: '';
  position: absolute;
  border-radius: var(--bs-spacing-25);
  background: transparent;
  transition: all 0.bs-15s ease;
}
.bs-tabs:not(.bs-tabs--vertical) .bs-tab::after {
  bottom: -1px; left: 0; right: 0;
  height: var(--bs-spacing-25); width: auto;
}
.bs-tabs--vertical .bs-tab::after {
  top: 0; bottom: 0; right: -1px;
  width: var(--bs-spacing-25); height: auto;
}
.bs-tab:hover { color: var(--bs-text-default); background: var(--bs-surface-hover); }
.bs-tab:focus-visible { outline: 2px solid var(--bs-border-neutral-focus); outline-offset: -2px; }
.bs-tab--active { color: var(--bs-text-action); }
.bs-tab--active::after { background: var(--bs-color-primary-default); }
.bs-tab--disabled { color: var(--bs-text-on-disabled); cursor: not-allowed; pointer-events: none; }
.bs-tab svg { width: var(--bs-font-size-2xl); height: var(--bs-font-size-2xl); flex-shrink: 0; }
.bs-tabs--vertical .bs-tab { justify-content: flex-start; width: 100%; }
</style>
<div class="bs-tabs bs-tabs--vertical"><button class="bs-tab bs-tab--active"><svg viewBox="0 0 24 24" fill="none"><path d="M3 12L12 4l9 8v8a1 1 0 01-1 1h-5v-5H9v5H4a1 1 0 01-1-1v-8z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>Overview</button><button class="bs-tab"><svg viewBox="0 0 24 24" fill="none"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>Specification</button><button class="bs-tab"><svg viewBox="0 0 24 24" fill="none"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>Notifications</button><button class="bs-tab bs-tab--disabled"><svg viewBox="0 0 24 24" fill="none"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>Disabled</button></div>
<script>
document.querySelectorAll('.bs-tabs').forEach(function(tabs) {
  tabs.querySelectorAll('.bs-tab:not(.bs-tab--disabled)').forEach(function(tab) {
    tab.addEventListener('click', function() {
      tabs.querySelectorAll('.tab').forEach(function(t) { t.classList.remove('bs-tab--active'); });
      this.classList.add('bs-tab--active');
    });
  });
});
</script>
```
