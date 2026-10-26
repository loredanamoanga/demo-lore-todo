# SPEC.md — team todo service (frozen demo spec)

One service, one entity. A shared team todo list. This spec is the source of truth the factory builds from; agents implement nothing it does not state.

## Entity

TodoItem: id (uuid), title (string, required, max 120), dueDate (date, optional), done (boolean, default false), createdAt (timestamp, server-set).

## API

- GET /api/v1/items — all items, sorted: overdue first, then open by dueDate ascending (items without a due date after dated ones), done items last.
- POST /api/v1/items — create from title and optional dueDate; returns 201 with the item.
- PATCH /api/v1/items/{id} — partial update of title, dueDate, done; returns the item.
- DELETE /api/v1/items/{id} — returns 204.
- Validation errors return 400 with a field-level message.

## Rules

- Overdue: dueDate is before today in Europe/Amsterdam and done is false.
- Due today: dueDate equals today in Europe/Amsterdam and done is false.
- The UI follows DESIGN.md exactly; the feature renders only when the todo.enabled flag is true.

## Acceptance examples (these become executable tests)

- E1: POST title "Buy milk", dueDate tomorrow → 201; GET lists it as Open.
- E2: item dueDate yesterday, done false → GET lists it first; UI shows the Overdue chip and the due date in the error color.
- E3: item dueDate today, done false → UI shows the Due today chip with black text.
- E4: PATCH done=true on an open item → GET lists it last; UI shows the Done chip.
- E5: POST with empty title → 400 with a message on title; UI shows inline validation under the field.
- E6: given items A (due yesterday), B (due today), C (due in 3 days), D (no due date), E (done) → GET order is A, B, C, D, E.
