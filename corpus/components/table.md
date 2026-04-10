# Table

**Type:** UI Component
**Source:** BrandSync Design System (Strapi)

## Description

Tables display structured data in rows and columns. They support sorting, selection, filtering, and inline actions for data-rich interfaces.

## Variants

- Default
- Sortable
- Selectable

## Frameworks

- HTML

## Design Tokens

- `--bs-border-default`
- `--bs-border-radius-100`
- `--bs-font-size-sm`
- `--bs-surface-container`
- `--bs-spacing-150`
- `--bs-spacing-200`
- `--bs-font-size-xs`
- `--bs-text-muted`
- `--bs-text-default`
- `--bs-surface-base`
- `--bs-surface-hover`
- `--bs-spacing-100`
- `--bs-border-radius-full`
- `--bs-surface-success`
- `--bs-text-success`
- `--bs-surface-warning`
- `--bs-text-warning`
- `--bs-surface-error`
- `--bs-text-error`
- `--bs-font-size-2xs`
- `--bs-color-primary-default`
- `--bs-border-neutral-focus`
- `--bs-color-primary-container`
- `--bs-spacing-75`
- `--bs-color-error-default`
- `--bs-spacing-500`

## CSS Classes

- `bs-table-wrapper`
- `bs-badge`
- `bs-badge-success`
- `bs-badge-warning`
- `bs-badge-error`
- `bs-sortable`
- `bs-sort-asc`
- `bs-bulk-bar`
- `bs-bulk-count`
- `bs-bulk-actions`
- `bs-btn-sm`
- `bs-danger`
- `bs-selected`

## Code Examples

### Variants

#### Default (HTML)

```html
<!-- brandsync: Table / Variants / Default | requires: brandsync-tokens -->
<style>
.bs-table-wrapper { border: 1px solid var(--bs-border-default); border-radius: var(--bs-border-radius-100); overflow: hidden; width: 100%; }
table { width: 100%; border-collapse: collapse; font-size: var(--bs-font-size-sm); }
thead { background: var(--bs-surface-container); }
th { padding: var(--bs-spacing-150) var(--bs-spacing-200); text-align: left; font-size: var(--bs-font-size-xs); font-weight: 700; text-transform: uppercase; letter-spacing: 0.bs-5px; color: var(--bs-text-muted); border-bottom: 1px solid var(--bs-border-default); white-space: nowrap; }
td { padding: var(--bs-spacing-150) var(--bs-spacing-200); color: var(--bs-text-default); border-bottom: 1px solid var(--bs-border-default); vertical-align: middle; }
tr:last-child td { border-bottom: none; }
tbody tr { background: var(--bs-surface-base); transition: background 0.bs-1s; }
tbody tr:hover { background: var(--bs-surface-hover); }
.bs-badge { display: inline-flex; align-items: center; padding: 2px var(--bs-spacing-100); border-radius: var(--bs-border-radius-full); font-size: var(--bs-font-size-xs); font-weight: 600; }
.bs-badge-success { background: var(--bs-surface-success); color: var(--bs-text-success); }
.bs-badge-warning { background: var(--bs-surface-warning); color: var(--bs-text-warning); }
.bs-badge-error { background: var(--bs-surface-error); color: var(--bs-text-error); }
</style>
<div class="bs-table-wrapper" role="region" aria-label="Components table" tabindex="0">
  <table>
    <thead>
      <tr>
        <th scope="col">Component</th>
        <th scope="col">Category</th>
        <th scope="col">Status</th>
        <th scope="col">Version</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Button</strong></td>
        <td>Forms</td>
        <td><span class="bs-badge bs-badge-success">Stable</span></td>
        <td>2.1.0</td>
      </tr>
      <tr>
        <td><strong>Input</strong></td>
        <td>Forms</td>
        <td><span class="bs-badge bs-badge-success">Stable</span></td>
        <td>2.0.3</td>
      </tr>
      <tr>
        <td><strong>Tooltip</strong></td>
        <td>Overlay</td>
        <td><span class="bs-badge bs-badge-warning">Beta</span></td>
        <td>1.2.0</td>
      </tr>
      <tr>
        <td><strong>Carousel</strong></td>
        <td>Data Display</td>
        <td><span class="bs-badge bs-badge-warning">Beta</span></td>
        <td>1.0.0</td>
      </tr>
      <tr>
        <td><strong>Tree</strong></td>
        <td>Data Display</td>
        <td><span class="bs-badge bs-badge-error">Experimental</span></td>
        <td>0.9.0</td>
      </tr>
    </tbody>
  </table>
</div>
```

#### Sortable (HTML)

```html
<!-- brandsync: Table / Variants / Sortable | requires: brandsync-tokens -->
<style>
.bs-table-wrapper { border: 1px solid var(--bs-border-default); border-radius: var(--bs-border-radius-100); overflow: hidden; width: 100%; }
table { width: 100%; border-collapse: collapse; font-size: var(--bs-font-size-sm); }
thead { background: var(--bs-surface-container); }
th { padding: var(--bs-spacing-150) var(--bs-spacing-200); text-align: left; font-size: var(--bs-font-size-xs); font-weight: 700; text-transform: uppercase; letter-spacing: 0.bs-5px; color: var(--bs-text-muted); border-bottom: 1px solid var(--bs-border-default); white-space: nowrap; }
th.bs-sortable { cursor: pointer; user-select: none; }
th.bs-sortable:hover { background: var(--bs-surface-hover); color: var(--bs-text-default); }
th.bs-sort-asc::after { content: ' ▲'; font-size: var(--bs-font-size-2xs); color: var(--bs-color-primary-default); }
th.bs-sort-desc::after { content: ' ▼'; font-size: var(--bs-font-size-2xs); color: var(--bs-color-primary-default); }
th:focus-visible { outline: 2px solid var(--bs-border-neutral-focus); outline-offset: -2px; }
td { padding: var(--bs-spacing-150) var(--bs-spacing-200); color: var(--bs-text-default); border-bottom: 1px solid var(--bs-border-default); vertical-align: middle; }
tr:last-child td { border-bottom: none; }
tbody tr { background: var(--bs-surface-base); transition: background 0.bs-1s; }
tbody tr:hover { background: var(--bs-surface-hover); }
</style>
<div class="bs-table-wrapper" role="region" aria-label="Sortable data table" tabindex="0">
  <table>
    <thead>
      <tr>
        <th scope="col" class="bs-sortable bs-sort-asc" tabindex="0" aria-sort="ascending" onclick="this.classList.toggle('sort-asc');this.classList.toggle('sort-desc');this.setAttribute('aria-sort', this.classList.contains('sort-asc')?'ascending':'descending')">Name</th>
        <th scope="col" class="bs-sortable" tabindex="0" aria-sort="none" onclick="this.classList.toggle('sort-asc');this.classList.toggle('sort-desc')">Size</th>
        <th scope="col" class="bs-sortable" tabindex="0" aria-sort="none" onclick="this.classList.toggle('sort-asc');this.classList.toggle('sort-desc')">Modified</th>
        <th scope="col">Type</th>
      </tr>
    </thead>
    <tbody>
      <tr><td>button.css</td><td>4.2 KB</td><td>Apr 6, 2026</td><td>CSS</td></tr>
      <tr><td>card.css</td><td>2.8 KB</td><td>Apr 5, 2026</td><td>CSS</td></tr>
      <tr><td>dialog.css</td><td>3.6 KB</td><td>Apr 7, 2026</td><td>CSS</td></tr>
      <tr><td>tokens.css</td><td>12.1 KB</td><td>Apr 1, 2026</td><td>CSS</td></tr>
    </tbody>
  </table>
</div>
```

#### Selectable (HTML)

```html
<!-- brandsync: Table / Variants / Selectable | requires: brandsync-tokens -->
<style>
.bs-table-wrapper { border: 1px solid var(--bs-border-default); border-radius: var(--bs-border-radius-100); overflow: hidden; width: 100%; }
.bs-bulk-bar { display: flex; align-items: center; gap: var(--bs-spacing-200); padding: var(--bs-spacing-150) var(--bs-spacing-200); background: var(--bs-color-primary-container); border-bottom: 1px solid var(--bs-border-default); }
.bs-bulk-count { font-size: var(--bs-font-size-sm); font-weight: 600; color: var(--bs-color-primary-default); }
.bs-bulk-actions { display: flex; gap: var(--bs-spacing-100); }
.bs-btn-sm { padding: var(--bs-spacing-75) var(--bs-spacing-150); border-radius: var(--bs-border-radius-100); font-size: var(--bs-font-size-xs); font-weight: 600; cursor: pointer; font-family: inherit; border: 1px solid var(--bs-border-default); background: var(--bs-surface-base); color: var(--bs-text-default); }
.bs-btn-sm:hover { background: var(--bs-surface-hover); }
.bs-btn-sm.bs-danger { color: var(--bs-color-error-default); border-color: var(--bs-color-error-default); }
table { width: 100%; border-collapse: collapse; font-size: var(--bs-font-size-sm); }
thead { background: var(--bs-surface-container); }
th { padding: var(--bs-spacing-150) var(--bs-spacing-200); text-align: left; font-size: var(--bs-font-size-xs); font-weight: 700; text-transform: uppercase; letter-spacing: 0.bs-5px; color: var(--bs-text-muted); border-bottom: 1px solid var(--bs-border-default); }
td { padding: var(--bs-spacing-150) var(--bs-spacing-200); color: var(--bs-text-default); border-bottom: 1px solid var(--bs-border-default); }
tr:last-child td { border-bottom: none; }
tbody tr { background: var(--bs-surface-base); transition: background 0.bs-1s; }
tbody tr:hover { background: var(--bs-surface-hover); }
tbody tr.bs-selected { background: var(--bs-color-primary-container); }
input[type="checkbox"] { accent-color: var(--bs-color-primary-default); width: var(--bs-spacing-200); height: var(--bs-spacing-200); cursor: pointer; }
</style>
<div class="bs-table-wrapper">
  <div class="bs-bulk-bar" style="display:none" id="bulk-bar">
    <span class="bs-bulk-count" id="bulk-count">2 selected</span>
    <div class="bs-bulk-actions">
      <button class="bs-btn-sm">Export</button>
      <button class="bs-btn-sm">Archive</button>
      <button class="bs-btn-sm bs-danger">Delete</button>
    </div>
  </div>
  <table>
    <thead>
      <tr>
        <th scope="col" style="width:var(--bs-spacing-500)"><input type="checkbox" aria-label="Select all" /></th>
        <th scope="col">Name</th>
        <th scope="col">Role</th>
        <th scope="col">Status</th>
      </tr>
    </thead>
    <tbody>
      <tr class="bs-selected"><td><input type="checkbox" checked aria-label="Select Alice" /></td><td>Alice Chen</td><td>Designer</td><td>Active</td></tr>
      <tr class="bs-selected"><td><input type="checkbox" checked aria-label="Select Bob" /></td><td>Bob Kim</td><td>Engineer</td><td>Active</td></tr>
      <tr><td><input type="checkbox" aria-label="Select Carol" /></td><td>Carol Davis</td><td>Product</td><td>Active</td></tr>
      <tr><td><input type="checkbox" aria-label="Select David" /></td><td>David Park</td><td>Designer</td><td>Away</td></tr>
    </tbody>
  </table>
</div>
```
