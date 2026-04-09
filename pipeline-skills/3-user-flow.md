---
name: user-flow
description: Map the user journey as a sequence of screens and user actions — design-specific, not technical. Produces two outputs: a user flow for FigJam and an internal state map for edge case awareness.
---

# User Flow

You produce two outputs from the Jira requirements. Keep them strictly separate.

---

## Output A — User Flow (goes to FigJam)

This is design language. Screens and user actions only. No API calls, no system states, no technical terms.

### Format

Each node is a **screen** — what the user sees.
Each connector is a **user action** — what the user does to move forward.

```
[Screen Name]
  → "user action label" → [Next Screen]
  → "error action label" → [Error Screen]
```

### Rules
- Node labels = screen names (what the designer will build)
- Connector labels = user actions in plain language ("taps Submit", "selects category", "pulls to refresh")
- Never use: API calls, HTTP status codes, system events, state names like "idle/submitting/success"
- Include: happy path, error recovery path, empty state path
- Every screen must have at least one way forward — no dead ends

### Example (correct — design language)

```
[My Requests List]
  → "taps New Request" → [Create Request Form]

[Create Request Form]
  → "fills form, taps Submit" → [Submitting — Loading]
  → "leaves field empty, taps Submit" → [Form with Errors]

[Form with Errors]
  → "fixes errors, taps Submit" → [Submitting — Loading]

[Submitting — Loading]
  → "request created" → [Request Confirmed]
  → "something went wrong" → [Error — Try Again]

[Error — Try Again]
  → "taps Retry" → [Submitting — Loading]

[Request Confirmed]
  → "taps View My Requests" → [My Requests List]
```

### Example (wrong — technical language, do not do this)

```
idle → submit event → submitting → API 200 → success   ✗
```

---

## Output B — Internal State Map (never shown in FigJam)

Use this to ensure edge cases are captured. This stays in your reasoning only — never write it to FigJam or print it to the console.

Map:
- All UI states (idle, loading, error, empty, success)
- All events that trigger transitions
- Guards (validation conditions, permission checks)
- Entry/exit actions (what happens when a state is entered or left)

This is the engineering contract. It informs skill 4 (lo-fi screens) to ensure every state that has a distinct layout gets a screen definition. But it does not appear on the FigJam board.

---

## Producing the User Flow

For each Jira ticket in the feature:
1. Identify the screens involved (one per distinct user task)
2. Map the happy path first — what does the user do when everything works?
3. Add error paths — what does the user see when something fails?
4. Add edge cases — empty state, locked state, already-done state
5. Check: every screen has a way forward. No dead ends.

Produce one user flow per Jira ticket. If the epic has 4 child tickets, produce 4 user flows. Label each with the ticket key.
