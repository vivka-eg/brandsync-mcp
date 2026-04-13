# Token Optimisation — BrandSync Pipeline

**Date:** 2026-04-11  
**Status:** Decision record — not yet implemented

---

## Principle

Use Claude only where it adds creative or interpretive value. Everything deterministic, structural, or mechanical should be code.

---

## Where AI Is Genuinely Needed

```
screen-to-code          ← creative generation, needs Claude
approval interpretation ← understanding natural language feedback
pattern synthesis       ← writing a new generalised pattern entry
```

Three places. Everything else is a candidate for removal.

---

## Where AI Is Used But Shouldn't Be

### 1. Framework Detection (Pocket 3 Step 1)

Currently calls Claude to determine the project framework. This is a file existence check:

```typescript
if (existsSync("angular.json"))       return "angular";
if (existsSync("next.config.js"))     return "next";
if (existsSync("vite.config.ts"))     return "vite";
// fallback: check package.json dependencies
```

Zero AI needed. Deterministic, instant, free.

**Saving: ~850 tokens per run.**

---

### 2. Handoff Between Pipeline Steps

Currently Claude writes natural language prose summaries to pass state between Pocket 1 → Pocket 3 and between steps within Pocket 3. Natural language handoff introduces drift — one Claude misreads a previous Claude's summary and the pipeline goes sideways.

Should be structured JSON:

```json
{
  "ticket_id": "APT-202",
  "framework": "angular",
  "retrieved_node_ids": ["service-request", "form-pattern", "radio-card"],
  "generated_components": ["ServiceRequestListComponent", "CreateRequestComponent"],
  "screens": ["Dashboard", "Create", "Detail", "Feedback"],
  "rejection_reason": null,
  "attempt_number": 1
}
```

Machine-readable, exact, never misinterpreted by the next Claude context.

**Saving: ~5,000 tokens per run (3–4 handoffs × ~800–1,200 tokens each).**

---

### 3. write_corpus_entry — Claude Writing Prose

Currently Claude writes a markdown prose entry summarising the learning. But the actual data is already known at approval time:

```
pattern_ids used:    [service-request, form-pattern, radio-card]
accepted:            true
ticket:              APT-202
rejection_reason:    null
```

This is a structured Supabase INSERT, not a prose-writing task. The useful generalised pattern entry — worth writing in prose — happens once during pattern synthesis, not on every approval.

**Saving: ~3,800 tokens per run.**

---

### 4. Pattern Synthesis Clustering (Future)

Finding which accepted generations are similar should use embeddings + cosine similarity — pure vector math, no Claude. Claude only enters at the final step: "here are 8 similar accepted UIs, write a generalised pattern entry."

**Saving: significant — clustering 100 outcomes via Claude vs. a similarity function is the difference between an API call and zero cost.**

---

## Token Budget Per Run

### Today (before optimisation)

| Step | Input | Output | Total |
|---|---|---|---|
| Framework detection | ~800 | ~50 | ~850 |
| Handoff prose (×4) | ~3,200 | ~800 | ~4,000 |
| write_corpus_entry | ~3,000 | ~800 | ~3,800 |
| screen-to-code | ~15,000 | ~8,000 | ~23,000 |
| Approval check | ~10,000 | ~1,500 | ~11,500 |
| **Total** | | | **~43,150 tokens** |

### After Optimisation

| Step | Input | Output | Total |
|---|---|---|---|
| Framework detection | 0 | 0 | 0 (code) |
| Handoff (structured JSON) | 0 | 0 | 0 (code) |
| write_outcome | 0 | 0 | 0 (Supabase INSERT) |
| screen-to-code | ~15,000 | ~8,000 | ~23,000 |
| Approval check | ~10,000 | ~1,500 | ~11,500 |
| **Total** | | | **~34,500 tokens** |

**Saving: ~8,650 tokens per run (~22%)**

---

## At Scale

```
10 runs/day:
  Before:  431,500 tokens/day
  After:   345,000 tokens/day
  Saved:   86,500 tokens/day

At ~$3/MTok input, ~$15/MTok output (Sonnet pricing):
  ~$0.15–0.30 saved per run
  ~$1.50–3.00 saved per day at 10 runs
```

Not transformative at small scale. At 100 runs/day it becomes meaningful.

---

## The Real Value Is Not Tokens

The 22% saving is real but secondary. The primary benefit is reliability.

### Handoff drift
A prose handoff is interpreted by the next Claude context. Interpretation introduces variance. A structured JSON handoff is exact — no reading between the lines.

**One pipeline derailment from drift costs a full re-run: ~43,000 tokens. Preventing one per 10 runs saves more than all optimisations combined.**

### Framework detection accuracy
Claude occasionally gets this wrong on unusual project structures. A file check never does.

### Corpus consistency
Claude-written corpus entries vary in format, tag depth, and structure. Inconsistent entries produce inconsistent graph extraction. A structured INSERT produces identical schema every time.

---

## Summary

| Change | Token saving | Real benefit |
|---|---|---|
| Framework detection as script | ~850/run | Always correct, instant |
| Structured JSON handoff | ~5,000/run | No pipeline drift |
| Structured write_outcome | ~3,800/run | Consistent corpus quality |
| Embeddings for clustering (future) | significant | Fast, cheap, deterministic |
| **Total current** | **~9,650/run (22%)** | **Reliable pipeline** |

---

## Implementation Order

1. **Structured JSON handoff** — fixes drift across the entire pipeline, highest reliability impact
2. **Framework detection script** — one hour, immediate saving on every Pocket 3 run
3. **Structured write_outcome** — replaces Claude prose with a Supabase INSERT
4. **Embeddings for clustering** — build when pattern synthesis is ready

None of these require architectural changes. They are targeted fixes to existing pipeline skill files and tools.
