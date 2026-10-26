# DESIGN.md — todo demo UI (Backstage-aligned)

Context file for the `demo-lore-todo` repo. This file lives in the shared context directory and is read by every agent that plans or builds UI. It is the single source of design truth for the demo: agents take every color, size and pattern from here and invent nothing. If a value is missing, the agent escalates rather than guessing.

## Design direction

The todo app follows Backstage's design language, so it looks native next to a developer portal the client team already lives in: a dark navigation rail, a colored page header band, content as white cards on a near-white canvas, dense rows, status as colored chips with text. The tokens below are the Backstage default theme values. If the client's Backstage instance carries a custom theme (app-config.yaml, `app.branding.theme`), lift their values into the token block and change nothing else in this file.

## Tokens

Define once as CSS custom properties on `:root`; components reference tokens only, never raw hexes.

| Token | Value | Use |
|---|---|---|
| --color-primary | #1F5493 | Primary actions, links, focus, active nav indicator fallback |
| --color-header-bg | #005B4B | Page header band |
| --color-header-text | #FFFFFF | Text on the header band |
| --color-nav-bg | #171717 | Sidebar background |
| --color-nav-text | #B5B5B5 | Sidebar item text |
| --color-nav-selected | #FFFFFF | Selected sidebar item text |
| --color-nav-indicator | #9BF0E1 | Selected sidebar item indicator bar |
| --color-canvas | #F8F8F8 | App background |
| --color-surface | #FFFFFF | Cards, dialogs, form fields |
| --color-text | #000000 | Primary text on light surfaces |
| --color-text-subtle | #6E6E6E | Secondary text, timestamps, helper text |
| --color-ok | #1DB954 | Done state |
| --color-error | #E22134 | Overdue state, destructive actions, errors |
| --color-warning | #FF9800 | Due today; always with black text |
| --color-running | #1F5493 | In-progress/async states |
| --color-border | #DDDDDD | Hairlines, card borders, dividers |

Typography: Roboto, fallback Helvetica, Arial, sans-serif (Angular Material default; matches Backstage). Scale: 24px/500 page title (in the header band), 18px/500 card titles, 14px/400 body and rows, 12px/400 helper text. No other sizes. Spacing on an 8px grid; card padding 16px, page gutter 24px. Radius 4px on cards, fields and chips (chips may be full-round). Elevation: one soft shadow level for cards, none for rows.

## Layout

App shell, Backstage-shaped: a fixed left sidebar (--color-nav-bg, 224px, collapsible to icons) holding the demo's single nav entry plus a demo banner badge; a page header band (--color-header-bg) with the page title, a one-line subtitle, and the primary action "Add item" right-aligned; content area on --color-canvas, max width 1200px, holding one card with the todo list. No other chrome. Mobile is out of scope for the demo; the layout may assume >= 1280px.

## Components

**Todo list card.** One card, dense rows (48px). Each row: done checkbox, title, due date (subtle), status chip, overflow menu (edit, delete). Rows divided by --color-border hairlines. Sort: overdue first, then by due date ascending, done items last.

**Status chips.** Text plus color, never color alone: "Open" (outline, subtle), "Due today" (--color-warning background, black text), "Overdue" (--color-error background, white text), "Done" (--color-ok background, white text). Chip text is the status word, no icons required.

**Overdue rule.** An item is overdue when its due date is before today in the user's timezone and it is not done. Overdue rows also render the due date in --color-error. This mirrors the acceptance examples; the chip and the date are the only overdue signals.

**Add/edit form.** Outlined fields on --color-surface: title (required, max 120 chars), due date (date picker, optional). Primary button --color-primary, text button to cancel. Inline validation text in --color-error under the field.

**Empty state.** Centered in the card: one sentence ("No items yet. Add the first one.") in --color-text-subtle and the primary action. No illustrations.

**Feedback.** Mutations confirm with a snackbar (surface dark #171717, white text, 3s). Errors from the API show a snackbar in plain words plus the row returning to its previous state; no toasts stacking.

## Angular Material mapping

Angular Material with a custom theme: primary palette built from #1F5493, warn from #E22134. Components: mat-sidenav (sidebar), custom header band (plain div, not mat-toolbar), mat-card, mat-table or mat-list for rows, mat-checkbox, mat-chip, mat-form-field (outline), mat-datepicker, mat-menu, mat-snack-bar. Density: -1 on the table. Anything Material does not cover is a plain element styled with the tokens.

## Accessibility

WCAG AA. Warning chips take black text (#FF9800 fails AA with white). Focus is always visible: 2px --color-primary outline, offset 2px. All controls reachable by keyboard; checkbox and menu have aria-labels naming the item ("Mark 'Buy milk' done"). Hit targets >= 44px including row controls. Status is readable without color (the chip text).

## Rules for agents

Take values only from this file; a hex not listed here is a bug. Do not add components, pages, themes, dark mode, animations or icons beyond what is listed. Keep the demo banner visible in the sidebar at all times. When a ticket asks for UI this file does not cover, escalate with the specific missing decision rather than improvising. When this file and a ticket conflict, the ticket wins and this file gets a follow-up change in the same PR.
