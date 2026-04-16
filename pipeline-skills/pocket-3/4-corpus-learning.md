# Pocket 3 — Step 4: Corpus Learning

## Goal

After every run — accepted, rejected, or gap-detected — scan what was built and write back **generalizable knowledge** to the corpus. This runs automatically. No user input required.

The key distinction:
- `write_corpus_entry` (Step 3) writes **instance-specific decisions** — what was built for this intent.
- This step writes **reusable knowledge** — what any future user running any intent should benefit from.

---

## What to scan

Review everything that happened and identify:

1. **Screens with no matching corpus pattern** — `search_guidelines` returned nothing, or you composed two patterns to cover one screen
2. **Components needed but absent from BrandSync** — you used a framework fallback (PrimeNG, MUI, Radix, etc.)
3. **Component variants built manually** — you used a BrandSync component but extended it beyond the spec
4. **Token naming drift** — corpus files use token names that don't match the project's actual tokens

---

## For each finding, write to corpus

### New pattern

**File:** `corpus/patterns/<kebab-case-name>.md`

```markdown
# <Pattern Name>

**Type:** UI Pattern (full screen)
**Category:** <e.g. data-display, form, feedback, admin>
**Responsive:** Desktop, Tablet, Mobile

## Use Case

<1–2 sentences. When should a developer reach for this pattern?>

## Components Used

<Bullet list of BrandSync component names>

## Design Tokens

<Bullet list of --bs-* tokens actually used>

## Layout

<Describe the layout in plain language>

## States

<List all states: Default, Loading, Empty, Error, Success>

## Dark Mode

Supported via `data-theme="dark"`

## Related Patterns

<Other corpus patterns this connects to>

## Tags

<comma-separated lowercase tags>
```

---

### Component gap

**File:** `corpus/gaps/<kebab-case-name>.md`

```markdown
# Gap: <Component Name>

**Detected in:** <session_id or ticket key>
**Date:** <YYYY-MM-DD>

## What was needed

<Describe the UI element — what it does, where it appears>

## Intent that triggered this

<What the user asked for e.g. "add a star rating to the feedback form">

## Temporary solution used

<What framework component was used as a fallback>

## Suggested BrandSync name

<PascalCase, e.g. StarRating>

## Priority

<Low / Medium / High — based on how visible and common this is>
```

---

### Component variant

If you used a BrandSync component but built a variant not in the spec, append to the existing component file.

**File:** `corpus/components/<component-name>.md` — append at the bottom

```markdown
## Undocumented Variant: <Variant Name>

**Detected in:** <session_id or ticket>
**Intent:** <what the user was building>
**What's different:** <structure, tokens, or behaviour that differs from the default>
**Tokens added:** <any additional --bs-* tokens used>
```

---

### Token naming drift

**File:** `corpus/gaps/token-naming-drift.md` — create if missing, or append

```markdown
## <date> — <file or pattern where drift was found>

- Corpus says: `<token name in corpus>`
- Project uses: `<token name in project>`
- Correct canonical name: `<which one is right>`
```

---

## Print a learning summary and rebuild

After writing all corpus files, print:

```
Corpus updated — N new learnings written:

New pattern:   corpus/patterns/<name>.md
Gap confirmed: corpus/gaps/<name>.md
Variant added: corpus/components/<name>.md → <Variant Name>
Token drift:   corpus/gaps/token-naming-drift.md
```

Then call:

```
update_graph()
```

This injects new corpus entries into the graph feedback loop so future `query_graph` calls surface them. If the tool returns an error, print it and stop.

---

## Rules

- Only write **generalizable knowledge** — not what was built for this specific intent
- Check `corpus/patterns/` before writing a new pattern — never duplicate
- Never invent token names — only document tokens you actually observed
- If unsure whether something is a new pattern or a variant — write it as a variant first
- Token drift entries are always appends, never rewrites
- This step runs even on rejection and gap detection — learning happens regardless of outcome
- Session_id and ticket are interchangeable here — use whichever exists
