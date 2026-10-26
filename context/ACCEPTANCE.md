# ACCEPTANCE.md — acceptance examples

Extracted from spec/SPEC.md. These become executable tests: the factory writes them first, then the code that makes them pass.


- E1: POST title "Buy milk", dueDate tomorrow → 201; GET lists it as Open.
- E2: item dueDate yesterday, done false → GET lists it first; UI shows the Overdue chip and the due date in the error color.
- E3: item dueDate today, done false → UI shows the Due today chip with black text.
- E4: PATCH done=true on an open item → GET lists it last; UI shows the Done chip.
- E5: POST with empty title → 400 with a message on title; UI shows inline validation under the field.
- E6: given items A (due yesterday), B (due today), C (due in 3 days), D (no due date), E (done) → GET order is A, B, C, D, E.
