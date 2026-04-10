# Graph Report - corpus  (2026-04-10)

## Corpus Check
- 40 files · ~26,799 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 97 nodes · 393 edges · 14 communities detected
- Extraction: 82% EXTRACTED · 18% INFERRED · 0% AMBIGUOUS · INFERRED: 70 edges (avg confidence: 0.84)
- Token cost: 0 input · 0 output

## God Nodes (most connected - your core abstractions)
1. `BrandSync Design System` - 30 edges
2. `Token: --bs-color-primary-default` - 24 edges
3. `Table` - 21 edges
4. `Pagination` - 18 edges
5. `Token: --bs-border-neutral-focus` - 18 edges
6. `Navigation Drawer` - 18 edges
7. `Buttons` - 17 edges
8. `File Upload` - 16 edges
9. `Dashboard (List View) Pattern` - 15 edges
10. `BrandSync Tokens` - 15 edges

## Surprising Connections (you probably didn't know these)
- `Buttons` --semantically_similar_to--> `Tag`  [INFERRED] [semantically similar]
  corpus/components/buttons.md → corpus/components/tag.md
- `Menu` --semantically_similar_to--> `Select`  [INFERRED] [semantically similar]
  corpus/components/menu.md → corpus/components/select.md
- `Checkbox` --shares_data_with--> `Table Selectable + Bulk Action Pattern`  [INFERRED]
  corpus/components/checkbox.md → corpus/components/table.md
- `Dialog` --semantically_similar_to--> `Snackbar`  [INFERRED] [semantically similar]
  corpus/components/dialog.md → corpus/components/snackbar.md
- `Notifications / Alerts Pattern` --semantically_similar_to--> `Empty State Pattern`  [INFERRED] [semantically similar]
  corpus/patterns/notifications.md → corpus/patterns/empty-state.md

## Hyperedges (group relationships)
- **App Shell Navigation Patterns** — dashboard_pattern, notifications_pattern, usermanagement_pattern, searchresults_pattern, personaldetails_pattern, emptystate_pattern, wizard_pattern [EXTRACTED 0.95]
- **Primary User Navigation Flow: Login to Dashboard to Detail** — login_pattern, dashboard_pattern, personaldetails_pattern, usermanagement_pattern [EXTRACTED 0.92]
- **Form-Based Data Entry Pattern Family** — form_pattern, wizard_pattern, settings_pattern, personaldetails_pattern [INFERRED 0.80]
- **Shared Focus-Visible Accessibility Pattern Across Interactive Components** — accordion_component, buttons_component, slider_component, menu_component, card_component, toolbar_component, carousel_component, checkbox_component, pagination_component, select_component, list_component, file_upload_component, focus_visible_pattern [INFERRED 0.90]
- **Shared Disabled State Token Pattern** — buttons_component, slider_component, checkbox_component, select_component, pagination_component, token_bs_surface_action_disabled, token_bs_text_on_disabled, disabled_state_pattern [INFERRED 0.88]
- **Components Consuming Semantic Status Color Tokens** — buttons_component, tag_component, table_component, token_bs_surface_success, token_bs_surface_error, token_bs_surface_warning, semantic_status_colors [INFERRED 0.85]
- **Semantic Status Components sharing success/warning/error/info palette** — chips_component, snackbar_component, badge_component, input_fields_component [INFERRED 0.90]
- **Navigation Structure Components forming hierarchical navigation pattern** — breadcrumb_component, tree_component, navigation_drawer_component, tabs_component [INFERRED 0.80]
- **Form Selection Controls for binary and single-choice user input** — radio_button_component, switch_component, input_fields_component [INFERRED 0.85]

## Communities

### Community 0 - "Core Design System & Atomic Components"
Cohesion: 0.26
Nodes (24): Avatar, Breadcrumb, Empty State Component, App Shell Layout Concept, Authentication Entry Point Concept, CRUD Operations Concept, Dark Mode (data-theme dark) Concept, Faceted / Cross-Entity Search Concept (+16 more)

### Community 1 - "Status & Feedback Components"
Cohesion: 0.4
Nodes (10): Dialog, Form Input Pattern, Input Fields, Radio Button, Switch, Token: --bs-border-neutral-focus, Token: --bs-color-error-default, Token: --bs-color-primary-default (+2 more)

### Community 2 - "Form Controls & Interaction Primitives"
Cohesion: 0.5
Nodes (9): Badge, Chips, Feedback and Notification Pattern, Semantic Status Color Palette (success/warning/error/info), Snackbar, Token: --bs-surface-error, Token: --bs-surface-info, Token: --bs-surface-success (+1 more)

### Community 3 - "UI Patterns (App Shell)"
Cohesion: 0.31
Nodes (9): Carousel, Carousel should be used sparingly: static content preferred, File Upload, Token: --bs-border-radius-150, Token: --bs-border-radius-full, Token: --bs-color-primary-container, Token: --bs-icon-default, Token: --bs-shadow-elevation-xs (+1 more)

### Community 4 - "Profile & Identity Patterns"
Cohesion: 0.46
Nodes (8): HTML Framework, List, Menu, Slider, Token: --bs-shadow-elevation-sm, Token: --bs-surface-hover, Token: --bs-text-default, Token: --bs-text-muted

### Community 5 - "Content & Media Components"
Cohesion: 0.6
Nodes (6): BrandSync Tokens, Buttons, Card, Focus Visible Accessibility Pattern, Token: --bs-color-neutral-default, Toolbar

### Community 6 - "Wizard & Multi-Step Forms"
Cohesion: 0.4
Nodes (6): Checkbox, Disabled State Pattern, Select, Select used for 5+ options to save space, Token: --bs-color-primary-hover, Token: --bs-text-on-disabled

### Community 7 - "List & Overlay Components"
Cohesion: 0.33
Nodes (6): Accordion reduces cognitive load by hiding content, Accordion, Token: --bs-color-info-default, Token: --bs-font-size-sm, Token: --bs-surface-container, Tooltip

### Community 8 - "Token System & Design Rationale"
Cohesion: 0.33
Nodes (6): BrandSync Design System, Links, Progress Indicator, Token: --bs-color-neutral-container, Token: --bs-color-success-default, Token: --bs-text-action-hover

### Community 9 - "Pagination & Progress Indicators"
Cohesion: 0.7
Nodes (5): Pagination, Progress Stepper, Token: --bs-border-default, Token: --bs-surface-base, Token: --bs-text-inverse

### Community 10 - "Data Management Patterns"
Cohesion: 0.5
Nodes (4): Semantic Status Color System, Table, Table Selectable + Bulk Action Pattern, Token: --bs-border-radius-100

### Community 11 - "Community 11"
Cohesion: 1.0
Nodes (2): Tag, Tags are non-interactive unlike Chips

### Community 12 - "Community 12"
Cohesion: 1.0
Nodes (1): Design Tokens Concept

### Community 13 - "Community 13"
Cohesion: 1.0
Nodes (1): Responsive Layout (Desktop/Tablet/Mobile) Concept

## Knowledge Gaps
- **16 isolated node(s):** `Design Tokens Concept`, `CRUD Operations Concept`, `Authentication Entry Point Concept`, `Multi-Step Sequential Validation Concept`, `Faceted / Cross-Entity Search Concept` (+11 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `Community 11`** (2 nodes): `Tag`, `Tags are non-interactive unlike Chips`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 12`** (1 nodes): `Design Tokens Concept`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 13`** (1 nodes): `Responsive Layout (Desktop/Tablet/Mobile) Concept`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `BrandSync Design System` connect `Token System & Design Rationale` to `Core Design System & Atomic Components`, `Status & Feedback Components`, `Form Controls & Interaction Primitives`, `UI Patterns (App Shell)`, `Profile & Identity Patterns`, `Content & Media Components`, `Wizard & Multi-Step Forms`, `List & Overlay Components`, `Pagination & Progress Indicators`, `Data Management Patterns`, `Community 11`?**
  _High betweenness centrality (0.188) - this node is a cross-community bridge._
- **Why does `Token: --bs-color-primary-default` connect `Status & Feedback Components` to `Core Design System & Atomic Components`, `Form Controls & Interaction Primitives`, `UI Patterns (App Shell)`, `Profile & Identity Patterns`, `Content & Media Components`, `Wizard & Multi-Step Forms`, `List & Overlay Components`, `Token System & Design Rationale`, `Pagination & Progress Indicators`, `Data Management Patterns`, `Community 11`?**
  _High betweenness centrality (0.096) - this node is a cross-community bridge._
- **Why does `Table` connect `Data Management Patterns` to `Core Design System & Atomic Components`, `Status & Feedback Components`, `Form Controls & Interaction Primitives`, `UI Patterns (App Shell)`, `Profile & Identity Patterns`, `Content & Media Components`, `Wizard & Multi-Step Forms`, `List & Overlay Components`, `Token System & Design Rationale`, `Pagination & Progress Indicators`?**
  _High betweenness centrality (0.075) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `Table` (e.g. with `Semantic Status Color System` and `Focus Visible Accessibility Pattern`) actually correct?**
  _`Table` has 2 INFERRED edges - model-reasoned connections that need verification._
- **Are the 3 inferred relationships involving `Pagination` (e.g. with `Progress Stepper` and `Disabled State Pattern`) actually correct?**
  _`Pagination` has 3 INFERRED edges - model-reasoned connections that need verification._
- **What connects `Design Tokens Concept`, `CRUD Operations Concept`, `Authentication Entry Point Concept` to the rest of the system?**
  _16 weakly-connected nodes found - possible documentation gaps or missing edges._