---
name: lofi-screens
description: Produce structured lo-fi screen definitions for every key state in a feature — content zones and hierarchy only, no component names or tokens. Output feeds directly into the FigJam board writer.
---

# Lo-fi Screens

You are producing structural lo-fi screen definitions for a feature. These are layout blueprints at the **content zone level** — what areas exist on a screen, what they contain, and in what order. No Brandsync component names. No tokens. No variants. That detail belongs in Pocket 2.

## What a Lo-fi Screen Is

A lo-fi screen defines:
- The screen name and which state it represents
- The content zones from top to bottom (what lives where)
- The actions available on the screen
- The breakpoint (mobile first)

Nothing else.

## Input

- Jira ticket (requirements)
- State machine output (all states and transitions from skill 3)

## Screen Definition Format

Produce one screen block per key state that has a meaningfully different layout:

```
SCREEN: [Screen Name] — [State]
Persona: [who is using this]
Breakpoint: Mobile

Zones (top → bottom):
- [Zone Name]: [one-line description of content]
- [Zone Name]: [one-line description of content]
- [Zone Name]: [one-line description of content]

Primary action: [what the user does here]
Secondary actions: [optional, e.g. cancel, back]
Open questions:
- [anything the Jira ticket doesn't answer about this screen]
```

## Zone Naming Rules

Use plain language. Not component names:

| Wrong (Pocket 2) | Right (Pocket 1) |
|---|---|
| `[EG Button — Primary]` | `Submit Action` |
| `[Input Fields — outlined — MD]` | `Form Fields` |
| `[EG Navigation — collapsed]` | `Navigation Bar` |
| `[Radio Button — Category]` | `Category Selection` |

## States to Cover

From the state machine output, produce a screen for each state that changes the layout:

- **Idle / Default** — what the user sees on arrival
- **Error** — validation failed or something went wrong
- **Loading** — async operation in progress
- **Success / Confirmation** — task completed
- **Empty** — no data to show (list/dashboard screens only)

Do not skip error and loading screens. They are as important as the happy path.

## Example Output

```
SCREEN: Create Service Request — Idle
Persona: Employee
Breakpoint: Mobile

Zones (top → bottom):
- Navigation Bar: back navigation + page title "New Request"
- Category Selection: choose request type (IT / Facility / HR / Other)
- Form Fields: title input + description textarea
- Priority Selection: low / medium / high
- Submit Action: primary submit button (disabled until form valid)

Primary action: Submit the request
Secondary actions: Cancel / back
Open questions:
- Does category selection change which form fields appear?
- Is there a character limit on description?

---

SCREEN: Create Service Request — Error
Persona: Employee
Breakpoint: Mobile

Zones (top → bottom):
- Navigation Bar: back navigation + page title "New Request"
- Category Selection: selected value preserved
- Form Fields: inline error messages below invalid fields
- Priority Selection: selected value preserved
- Submit Action: primary button enabled, triggers re-validation on tap

Primary action: Fix errors and resubmit
Open questions:
- Are errors shown on blur or only on submit attempt?

---

SCREEN: Create Service Request — Loading
Persona: Employee
Breakpoint: Mobile

Zones (top → bottom):
- Navigation Bar: back navigation disabled during submission
- Loading Indicator: full-screen or inline progress
- Form Fields: locked / read-only

Primary action: None — user waits

---

SCREEN: Create Service Request — Success
Persona: Employee
Breakpoint: Mobile

Zones (top → bottom):
- Navigation Bar: title "Request Submitted"
- Confirmation Message: request ID + summary
- Next Steps: what happens next, expected response time
- Action: go to request list or create another

Primary action: View my requests
```

## Rules

- One screen per layout-changing state
- Mobile-first — only add desktop block if the layout structure genuinely differs
- Every screen must have at least one open question — if the Jira ticket answered everything, the screen is over-specified or the ticket is unusually thorough (note this)
- Do not reference Brandsync components, tokens, or variants
- Keep zone descriptions to one line — this is a skeleton, not a spec
