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

1. Call `save_handoff(ticket, 3, { framework, files, feedback: "accepted" })`
2. The tool will respond with a prompt to write a corpus entry.
3. Call `write_corpus_entry(ticket, "decision", { summary, screens, framework, components, tokens })`
   - `summary`: 1–2 sentence description of what was built and what pattern was used (or composed)
   - `screens`: array of screen names from the handoff
   - `components`: list of BrandSync component names used
   - `tokens`: list of CSS custom properties referenced
4. Print: `✅ Done — code accepted and recorded in corpus/decisions/`

## On NO (rejected)

1. Note the user's feedback in `feedback_note`.
2. Call `save_handoff(ticket, 3, { framework, files, feedback: "rejected", feedback_note: "<user note>" })`
3. Read the tool response:
   - If status is `rejected` (attempt < 3): print the rejection count and ask the user if they want another attempt or want to stop.
   - If status is `gap_detected` (attempt >= 3): see Gap Detection section below.

## Gap Detection (triggered at attempt 3+)

When `save_handoff` returns `status: gap_detected`:

Print this message (and nothing else):
```
⚠️  Pattern gap detected for APT-202

This UI has been rejected 3 times. The required pattern may not exist in the BrandSync corpus yet.

I'll record this as a gap so it can be prioritised for design.
```

Then call `write_corpus_entry(ticket, "gap", { summary, screens, components_tried, suggested_pattern_name })`:
- `summary`: describe what the screen was trying to do and why existing patterns didn't fit
- `screens`: the screen names from the handoff
- `components_tried`: BrandSync components that were used but weren't sufficient
- `suggested_pattern_name`: a PascalCase name for the new pattern e.g. `ServiceRequest`

After writing the gap entry, print:
```
Gap recorded: corpus/gaps/<ticket>.md
Next step: create Patterns/<PatternName>/meta.json to add the missing pattern, then re-run the pipeline.
```

## Rules
- Never auto-accept. Always ask the user.
- Never skip `write_corpus_entry` on accept — the feedback loop depends on it.
- Never skip `write_corpus_entry` on gap_detected — that's what grows the corpus.
- Carry `feedback_note` forward: if the user rejects again, include all previous notes in the next attempt's context.
