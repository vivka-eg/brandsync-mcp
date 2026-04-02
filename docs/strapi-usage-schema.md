# Usage — Strapi Schema + Buttons Content

---

## Intro (single component)

| Field | Value |
|---|---|
| `Description` | Buttons help users get things done. Use primary buttons for the main action, like "Submit." Supportive buttons are for related actions that help complete the task, such as "Save as Draft." They have visual weight but don't overshadow the primary action. Outlined buttons are great for neutral actions like "Cancel" or "Back". Text buttons work well for low-priority options like "Learn more" or "View details." |

---

## LayoutRules (repeatable component)

### Entry 1

| Field | Value |
|---|---|
| `Title` | Layout |
| `Description` | Buttons can either wrap around their content or expand to fill the available space. On smaller screens or containers, they often stretch full width for better tap targets. On wider screens, they either stay compact or follow a max width to maintain visual balance and preserve the button-like appearance. |

#### Variants (repeatable, inside Entry 1)

**Variant 1**

| Field | Value |
|---|---|
| `Title` | Mobile |
| `Description` | On mobile screens, when buttons hug their content, align them to the right to make them easier to reach with the thumb. |
| `Image 1` | button-usage-layout-mobile1.svg |
| `Image 2` | button-usage-layout-mobile2.svg |

> Note: if Variant only supports one image, split into two separate Variant entries.

**Variant 2**

| Field | Value |
|---|---|
| `Title` | Wide Screen |
| `Description` | On wide screens, set a max width for buttons to keep them looking like buttons, not stretched-out bars. |
| `Image` | button-usage-layout-wide screen1.svg |

---

## CombinationRules (repeatable component)

### Entry 1

| Field | Value |
|---|---|
| `Name` | Primary + Neutral |
| `Pattern` | Recommended. Clean hierarchy. |
| `WhenToUse` | Two actions, one clearly dominant and safe. |
| `Image` | button-usage-combination-1.svg |

### Entry 2

| Field | Value |
|---|---|
| `Name` | Primary + Subtle |
| `Pattern` | Best for destructive or cancel actions. |
| `WhenToUse` | Secondary action is deprioritized or non-critical. |
| `Image` | button-usage-combination-2.svg |

### Entry 3

| Field | Value |
|---|---|
| `Name` | Primary + Outline |
| `Pattern` | Use when secondary action needs visibility but shouldn't compete with Primary. |
| `WhenToUse` | More attention needed on the second option without elevating it. |
| `Image` | button-usage-combination-3.svg |

---

## Examples (repeatable component)

### Entry 1

| Field | Value |
|---|---|
| `Caption` | Buttons can be set to hug its contents with required padding on either side. |
| `Image` | button-usage-ex1.svg |

### Entry 2

| Field | Value |
|---|---|
| `Caption` | Buttons can stretch full width on small containers or mobile screens. |
| `Image` | button-usage-ex2.svg |

### Entry 3

| Field | Value |
|---|---|
| `Caption` | In this example, supportive buttons were used in each table row to avoid visual clutter. Primary buttons are meant for key actions, while supportive or outlined buttons keep repeated actions subtle and less distracting. |
| `Image` | button-usage-ex3.svg |

### Entry 4

| Field | Value |
|---|---|
| `Caption` | Small buttons work well in tight spaces like filter dropdowns. |
| `Image` | button-usage-ex5.svg |

---

## Schema summary (for Strapi content type builder)

```
Usage
  ├── Intro (single component)
  │     └── Description: long text
  │
  ├── LayoutRules (repeatable component)
  │     ├── Title: short text
  │     ├── Description: long text
  │     └── Variants (repeatable component)
  │           ├── Title: short text
  │           ├── Description: long text
  │           └── Image: media (single)
  │
  ├── CombinationRules (repeatable component)
  │     ├── Name: short text
  │     ├── Pattern: short text
  │     ├── WhenToUse: long text
  │     └── Image: media (single)
  │
  └── Examples (repeatable component)
        ├── Caption: long text
        └── Image: media (single)
```
