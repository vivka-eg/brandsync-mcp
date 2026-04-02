# Typography Guidelines

## Type Scale

Brandsync uses a modular type scale via `--bs-typography-*` tokens.

### Scale Steps

| Token | Size | Usage |
|---|---|---|
| `--bs-typography-display-size` | 3rem | Hero headings |
| `--bs-typography-h1-size` | 2rem | Page titles |
| `--bs-typography-h2-size` | 1.5rem | Section headings |
| `--bs-typography-h3-size` | 1.25rem | Sub-section headings |
| `--bs-typography-body-size` | 1rem | Body copy |
| `--bs-typography-label-size` | 0.875rem | Labels, buttons, captions |
| `--bs-typography-caption-size` | 0.75rem | Fine print, metadata |

## Font Families

- `--bs-typography-font-sans` — primary sans-serif stack
- `--bs-typography-font-mono` — code and technical content

## Line Heights

Use `--bs-typography-leading-tight` (1.25) for headings and `--bs-typography-leading-normal` (1.5) for body text.

## Usage Rules

- Never set font sizes below `--bs-typography-caption-size`.
- Use semantic HTML elements (`<h1>`–`<h6>`, `<p>`) alongside visual styles.
- Limit line length to 65–80 characters for comfortable reading.
