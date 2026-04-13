# Pocket 3 — Step 4: Corpus Learning

## Goal

After every pipeline run — whether accepted, rejected, or gap-detected — scan what was built and write back **generalizable knowledge** to the corpus. New patterns, confirmed component gaps, undocumented component variants.

This is what makes the graph smarter for the next session. It runs automatically. It does not require user input.

The key distinction from `write_corpus_entry`:
- `write_corpus_entry` writes **instance-specific decisions** — what was built for this ticket.
- This step writes **reusable knowledge** — what the corpus should know for any future project.

---

## What to scan

Review everything that happened during this run and identify:

1. **Screens with no matching corpus pattern** — `search_guidelines` returned nothing, or the closest match was a stretch, or you composed two patterns to cover one screen
2. **Components needed but absent from BrandSync** — you used a framework fallback (PrimeNG, MUI, Radix, etc.) because the BrandSync component doesn't exist
3. **Component variants you built manually** — you used a BrandSync component but had to extend it in ways the spec doesn't document (e.g. radio buttons styled as cards)
4. **Token naming drift** — a corpus file uses token names that don't match what the project actually uses (e.g. `--surface-base` vs `--bs-surface-base` vs `--bs-color-surface-base`)

---

## For each finding, write to corpus

### New pattern

If a screen or flow had no matching corpus pattern, write a new pattern file.

**File:** `corpus/patterns/<kebab-case-name>.md`

```markdown
# <Pattern Name>

**Type:** UI Pattern (full screen)
**Category:** <e.g. data-display, form, feedback, admin>
**Responsive:** Desktop, Tablet, Mobile

## Use Case

<1–2 sentences. When should a designer or developer reach for this pattern?>

## Components Used

<Bullet list of BrandSync component names>

## Design Tokens

<Bullet list of --bs-* tokens actually used>

## Layout

<Describe the layout in plain language>

## States

<List all states: Default, Loading, Empty, Error, Success, etc.>

## Dark Mode

Supported via `data-theme="dark"`

## Related Patterns

<Other corpus patterns this connects to>

## Tags

<comma-separated lowercase tags>
```

---

### Component gap

If a component was needed but doesn't exist in BrandSync, write a gap file.

**File:** `corpus/gaps/<kebab-case-name>.md`

```markdown
# Gap: <Component Name>

**Detected in:** <ticket key>
**Date:** <YYYY-MM-DD>

## What was needed

<Describe the UI element that was missing — what it does, where it appears>

## Screens that needed it

<List of screen names>

## Temporary solution used

<What framework component was used as a fallback, e.g. PrimeNG p-rating>

## Suggested BrandSync name

<PascalCase, e.g. StarRating>

## Priority

<Low / Medium / High — based on how many screens needed it and how visible it is>
```

---

### Component variant

If you used a BrandSync component but had to build a variant not in the spec, append it to the existing component file.

**File:** `corpus/components/<component-name>.md` — append at the bottom

```markdown
## Undocumented Variant: <Variant Name>

**Detected in:** <ticket key>
**Use case:** <when this variant is needed vs the standard version>
**What's different:** <structure, tokens, or behaviour that differs from the default>
**Tokens added:** <any additional --bs-* tokens used>
```

---

### Token naming drift

If you found a token naming mismatch between corpus files and the actual project, note it.

**File:** `corpus/gaps/token-naming-drift.md` — create if it doesn't exist, or append

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
📚 Corpus updated — N new learnings written:

✅ New pattern:  corpus/patterns/<name>.md
⚠️  Gap confirmed:  corpus/gaps/<name>.md
📝 Variant added:  corpus/components/<name>.md → <Variant Name>
🔤 Token drift noted:  corpus/gaps/token-naming-drift.md
```

Then rebuild the graph by calling the BrandSync MCP tool:

```
update_graph()
```

This runs graphify `--update` on corpus/ (incremental — only changed files, no Strapi pull) and patches node sizes. It returns a summary of what changed.

If the tool returns an error, print it and stop — do not silently continue.

---

## Rules

- Only write **generalizable knowledge** — not what was built for this specific ticket (that's `write_corpus_entry`)
- Check `corpus/patterns/` before writing a new pattern — never duplicate an existing one
- Never invent token names — only document tokens you actually observed in use
- If unsure whether something is a new pattern or a variant — write it as a variant first, promote later
- Token drift entries are always appends, never rewrites
- This step runs even on rejection and gap detection — the learning happens regardless of outcome
