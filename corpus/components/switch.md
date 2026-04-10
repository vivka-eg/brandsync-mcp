# Switch

**Type:** UI Component
**Source:** BrandSync Design System (Strapi)

## Description

A switch lets users turn a setting or feature on or off with a single tap or click.

## Variants

- Large
- Medium

## Frameworks

- HTML

## Design Tokens

- `--bs-spacing-100`
- `--bs-font-size-sm`
- `--bs-text-default`
- `--bs-border-radius-full`
- `--bs-surface-hover`
- `--bs-border-default`
- `--bs-surface-base`
- `--bs-shadow-elevation-xs`
- `--bs-spacing-600`
- `--bs-spacing-350`
- `--bs-font-size-2xl`
- `--bs-font-size-xl`
- `--bs-font-size-md`
- `--bs-color-primary-default`
- `--bs-color-neutral-default`
- `--bs-color-primary-hover`
- `--bs-border-neutral-focus`
- `--bs-surface-action-disabled`
- `--bs-text-on-disabled`
- `--bs-spacing-200`

## CSS Classes

- `bs-switch`
- `bs-switch--lg`
- `bs-switch__track`
- `bs-switch__thumb`
- `bs-switch--disabled`
- `bs-switch--md`

## Code Examples

#### Large (HTML)

```html
<!-- brandsync: Switch / Large | requires: brandsync-tokens -->
<style>
.bs-switch {
  position: relative;
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  gap: var(--bs-spacing-100);
  font-family: inherit;
  font-size: var(--bs-font-size-sm);
  color: var(--bs-text-default);
  user-select: none;
}
.bs-switch input { position: absolute; opacity: 0; width: 0; height: 0; }
.bs-switch__track {
  position: relative;
  border-radius: var(--bs-border-radius-full);
  background: var(--bs-surface-hover);
  border: 1.bs-5px solid var(--bs-border-default);
  transition: all 0.bs-15s ease;
  flex-shrink: 0;
}
.bs-switch__thumb {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  border-radius: 50%;
  background: var(--bs-surface-base);
  transition: all 0.bs-15s ease;
  box-shadow: var(--bs-shadow-elevation-xs);
}
/* Large */
.bs-switch--lg .bs-switch__track { width: var(--bs-spacing-600); height: var(--bs-spacing-350); }
.bs-switch--lg .bs-switch__thumb { width: var(--bs-font-size-2xl); height: var(--bs-font-size-2xl); left: 1px; }
/* Medium */
.bs-switch--md .bs-switch__track { width: 36px; height: var(--bs-font-size-xl); }
.bs-switch--md .bs-switch__thumb { width: var(--bs-font-size-md); height: var(--bs-font-size-md); left: 1px; }
/* Checked */
.bs-switch input:checked ~ .bs-switch__track {
  background: var(--bs-color-primary-default);
  border-color: var(--bs-color-primary-default);
}
.bs-switch--lg input:checked ~ .bs-switch__track .bs-switch__thumb { left: calc(48px - 24px - 3px); }
.bs-switch--md input:checked ~ .bs-switch__track .bs-switch__thumb { left: calc(36px - 16px - 3px); }
/* Hover */
.bs-switch:hover .bs-switch__track { border-color: var(--bs-color-neutral-default); }
.bs-switch:hover input:checked ~ .bs-switch__track { background: var(--bs-color-primary-hover); border-color: var(--bs-color-primary-hover); }
/* Focus */
.bs-switch input:focus-visible ~ .bs-switch__track { outline: 2px solid var(--bs-border-neutral-focus); outline-offset: 2px; }
/* Disabled */
.bs-switch--disabled { cursor: not-allowed; opacity: 0.bs-5; pointer-events: none; }
.bs-switch--disabled .bs-switch__track { background: var(--bs-surface-action-disabled); border-color: transparent; }
.bs-switch--disabled .bs-switch__thumb { background: var(--bs-text-on-disabled); }
</style>
<div style="display:flex;flex-direction:column;gap: var(--bs-spacing-200);">
<label class="bs-switch bs-switch--lg"><input type="checkbox" ><span class="bs-switch__track"><span class="bs-switch__thumb"></span></span>Off</label>
<label class="bs-switch bs-switch--lg"><input type="checkbox" checked><span class="bs-switch__track"><span class="bs-switch__thumb"></span></span>On</label>
<label class="bs-switch bs-switch--lg bs-switch--disabled"><input type="checkbox" disabled><span class="bs-switch__track"><span class="bs-switch__thumb"></span></span>Disabled off</label>
<label class="bs-switch bs-switch--lg bs-switch--disabled"><input type="checkbox" checked disabled><span class="bs-switch__track"><span class="bs-switch__thumb"></span></span>Disabled on</label>
</div>
<script>
document.querySelectorAll('.bs-switch:not(.bs-switch--disabled) .bs-switch__track').forEach(function(track) {
  track.addEventListener('click', function() {
    var input = this.closest('.switch').querySelector('input');
    if (input) input.checked = !input.checked;
  });
});
</script>
```

#### Medium (HTML)

```html
<!-- brandsync: Switch / Medium | requires: brandsync-tokens -->
<style>
.bs-switch {
  position: relative;
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  gap: var(--bs-spacing-100);
  font-family: inherit;
  font-size: var(--bs-font-size-sm);
  color: var(--bs-text-default);
  user-select: none;
}
.bs-switch input { position: absolute; opacity: 0; width: 0; height: 0; }
.bs-switch__track {
  position: relative;
  border-radius: var(--bs-border-radius-full);
  background: var(--bs-surface-hover);
  border: 1.bs-5px solid var(--bs-border-default);
  transition: all 0.bs-15s ease;
  flex-shrink: 0;
}
.bs-switch__thumb {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  border-radius: 50%;
  background: var(--bs-surface-base);
  transition: all 0.bs-15s ease;
  box-shadow: var(--bs-shadow-elevation-xs);
}
/* Large */
.bs-switch--lg .bs-switch__track { width: var(--bs-spacing-600); height: var(--bs-spacing-350); }
.bs-switch--lg .bs-switch__thumb { width: var(--bs-font-size-2xl); height: var(--bs-font-size-2xl); left: 1px; }
/* Medium */
.bs-switch--md .bs-switch__track { width: 36px; height: var(--bs-font-size-xl); }
.bs-switch--md .bs-switch__thumb { width: var(--bs-font-size-md); height: var(--bs-font-size-md); left: 1px; }
/* Checked */
.bs-switch input:checked ~ .bs-switch__track {
  background: var(--bs-color-primary-default);
  border-color: var(--bs-color-primary-default);
}
.bs-switch--lg input:checked ~ .bs-switch__track .bs-switch__thumb { left: calc(48px - 24px - 3px); }
.bs-switch--md input:checked ~ .bs-switch__track .bs-switch__thumb { left: calc(36px - 16px - 3px); }
/* Hover */
.bs-switch:hover .bs-switch__track { border-color: var(--bs-color-neutral-default); }
.bs-switch:hover input:checked ~ .bs-switch__track { background: var(--bs-color-primary-hover); border-color: var(--bs-color-primary-hover); }
/* Focus */
.bs-switch input:focus-visible ~ .bs-switch__track { outline: 2px solid var(--bs-border-neutral-focus); outline-offset: 2px; }
/* Disabled */
.bs-switch--disabled { cursor: not-allowed; opacity: 0.bs-5; pointer-events: none; }
.bs-switch--disabled .bs-switch__track { background: var(--bs-surface-action-disabled); border-color: transparent; }
.bs-switch--disabled .bs-switch__thumb { background: var(--bs-text-on-disabled); }
</style>
<div style="display:flex;flex-direction:column;gap: var(--bs-spacing-200);">
<label class="bs-switch bs-switch--md"><input type="checkbox" ><span class="bs-switch__track"><span class="bs-switch__thumb"></span></span>Off</label>
<label class="bs-switch bs-switch--md"><input type="checkbox" checked><span class="bs-switch__track"><span class="bs-switch__thumb"></span></span>On</label>
<label class="bs-switch bs-switch--md bs-switch--disabled"><input type="checkbox" disabled><span class="bs-switch__track"><span class="bs-switch__thumb"></span></span>Disabled off</label>
<label class="bs-switch bs-switch--md bs-switch--disabled"><input type="checkbox" checked disabled><span class="bs-switch__track"><span class="bs-switch__thumb"></span></span>Disabled on</label>
</div>
<script>
document.querySelectorAll('.bs-switch:not(.bs-switch--disabled) .bs-switch__track').forEach(function(track) {
  track.addEventListener('click', function() {
    var input = this.closest('.switch').querySelector('input');
    if (input) input.checked = !input.checked;
  });
});
</script>
```
