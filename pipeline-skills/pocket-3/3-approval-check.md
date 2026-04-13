# Pocket 3 — Step 3: Approval Check & Feedback Loop

## Goal
Show the generated code to the user, collect feedback, save the attempt, and trigger the appropriate follow-up action.

## Present the output

Show each generated file with its name and content. Keep presentation clean:

```
Generated files for APT-202:

── src/screens/Login.tsx ─────────────────────────────
<code here>

── src/screens/Login.module.css ──────────────────────
<code here>
```

Then ask exactly one question:
> Does this look good? Reply **yes** to accept, or **no** with notes on what to change.

Do not ask multiple questions. Do not explain design decisions unless asked. Wait for the user's reply.

## On YES (accepted)

1. Load retrieved_node_ids from handoff: `load_handoff(ticket, 3)` → read `retrieved_node_ids` field.
2. Call `save_handoff(ticket, 3, { framework, files, feedback: "accepted", retrieved_node_ids: [...] })`
3. The tool will respond with a prompt to write a corpus entry.
4. Call `write_corpus_entry` with structured data — no prose, exact fields only:
   ```
   write_corpus_entry(ticket, "decision", {
     screens:      ["Dashboard", "Create", "Detail"],   ← screen names from handoff
     framework:    "angular",                            ← from handoff
     components:   ["BsButton", "BsTag", "BsInput"],    ← BrandSync components used
     tokens:       ["--bs-color-primary", "--bs-surface-base"],  ← tokens referenced
     pattern_ids:  retrieved_node_ids                   ← from handoff
   })
   ```
   No summary prose. The fields are the record.
5. Print: `✅ Done — code accepted and recorded in corpus/decisions/`
6. Proceed to **Step 4 — Corpus Learning** *(skill: pocket-3/4-corpus-learning)*

## On NO (rejected)

1. Note the user's feedback in `feedback_note`.
2. Load retrieved_node_ids from handoff: `load_handoff(ticket, 3)` → read `retrieved_node_ids` field.
3. Call `save_handoff(ticket, 3, { framework, files, feedback: "rejected", feedback_note: "<user note>", retrieved_node_ids: [...] })`
4. Read the tool response:
   - If status is `rejected` (attempt < 3): print the rejection count and ask the user if they want another attempt or want to stop.
   - If status is `gap_detected` (attempt >= 3): see Gap Detection section below.
5. Proceed to **Step 4 — Corpus Learning** *(skill: pocket-3/4-corpus-learning)*

## Gap Detection (triggered at attempt 3+)

When `save_handoff` returns `status: gap_detected`:

Print this message (and nothing else):
```
⚠️  Pattern gap detected for APT-202

This UI has been rejected 3 times. The required pattern may not exist in the BrandSync corpus yet.

I'll record this as a gap so it can be prioritised for design.
```

Then call `write_corpus_entry` with structured data:
```
write_corpus_entry(ticket, "gap", {
  screens:                 ["Dashboard", "Create"],   ← screen names from handoff
  components_tried:        ["BsButton", "BsInput"],   ← what was attempted
  suggested_pattern_name:  "ServiceRequest",          ← PascalCase name for missing pattern
  rejection_reasons:       ["wrong layout", "missing star rating component"]  ← from feedback_notes
})
```

After writing the gap entry, print:
```
Gap recorded: corpus/gaps/<ticket>.md
Next step: create Patterns/<PatternName>/meta.json to add the missing pattern, then re-run the pipeline.
```

Then proceed to **Step 4 — Corpus Learning** *(skill: pocket-3/4-corpus-learning)*

## Rules
- Never auto-accept. Always ask the user.
- Never skip `write_corpus_entry` on accept — the feedback loop depends on it.
- Never skip `write_corpus_entry` on gap_detected — that's what grows the corpus.
- Always include `retrieved_node_ids` in save_handoff — it connects outcomes to graph nodes.
- write_corpus_entry uses structured fields only — no prose summary.
- Carry `feedback_note` forward: if the user rejects again, include all previous notes in the next attempt's context.
