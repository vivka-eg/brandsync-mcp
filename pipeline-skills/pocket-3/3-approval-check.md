# Pocket 3 — Step 3: Approval Check & Feedback Loop

## Goal
Show the generated code to the user, collect feedback, save the attempt, and trigger the appropriate follow-up.

## Present the output

Show each generated file with its name and content:

```
Generated files:

── src/components/DataTable.tsx ──────────────────────
<code here>

── src/components/DataTable.module.css ───────────────
<code here>
```

Then ask exactly one question:
> Does this look good? Reply **yes** to accept, or **no** with notes on what to change.

Do not ask multiple questions. Do not explain design decisions unless asked. Wait for the user's reply.

## On YES (accepted)

1. Load `retrieved_node_ids` from handoff: `load_handoff(session_id, 3)` → read `retrieved_node_ids`.
2. Call `save_handoff(session_id, 3, { framework, files, feedback: "accepted", retrieved_node_ids: [...] })`
3. Call `write_corpus_entry` with structured fields — no prose:
   ```
   write_corpus_entry(
     ticket: session_id,        ← ticket key if one exists, otherwise session_id
     type: "decision",
     data: {
       intent:       "<what the user asked for>",
       screens:      ["DataTable"],
       framework:    "angular",
       components:   ["BsTable", "BsButton"],
       tokens:       ["--bs-surface-base", "--bs-border-default"],
       pattern_ids:  retrieved_node_ids
     }
   )
   ```
4. Print: `✅ Done — recorded in corpus.`
5. Proceed to **Step 4 — Corpus Learning**.

## On NO (rejected)

1. Note the user's feedback in `feedback_note`.
2. Load `retrieved_node_ids`: `load_handoff(session_id, 3)` → read `retrieved_node_ids`.
3. Call `save_handoff(session_id, 3, { framework, files, feedback: "rejected", feedback_note: "<user note>", retrieved_node_ids: [...] })`
4. Read the tool response:
   - `rejected` (attempt < 3): print rejection count, ask if user wants another attempt.
   - `gap_detected` (attempt ≥ 3): see Gap Detection below.
5. Proceed to **Step 4 — Corpus Learning**.

## Gap Detection (attempt 3+)

When `save_handoff` returns `status: gap_detected`:

Print:
```
⚠️  Pattern gap detected

This UI has been rejected 3 times. The required pattern may not exist in the BrandSync corpus yet.
Recording this as a gap so it can be prioritised for design.
```

Then call `write_corpus_entry`:
```
write_corpus_entry(
  ticket: session_id,
  type: "gap",
  data: {
    intent:                 "<what the user asked for>",
    screens:                ["DataTable"],
    components_tried:       ["BsTable", "BsInput"],
    suggested_pattern_name: "FilterableDataTable",
    rejection_reasons:      ["wrong layout", "missing pagination"]
  }
)
```

Then proceed to **Step 4 — Corpus Learning**.

## Rules
- Never auto-accept. Always ask the user.
- Never skip `write_corpus_entry` on accept or gap_detected.
- Always include `retrieved_node_ids` in save_handoff.
- `ticket` field in write_corpus_entry uses the Jira key if one exists, otherwise session_id.
- Carry all previous `feedback_note` values forward into the next attempt's context.
- Intent is always required in write_corpus_entry data — this is what makes learnings ticket-agnostic.
