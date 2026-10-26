# demo-lore-todo

> **This is a demo, not a product.** It exists to show an AI software factory building a product
> from an epic, under human gates. Nothing here is meant to run in production.

## What this is

A small team todo service: an Angular frontend, a Spring Boot backend on Java 21, a PostgreSQL
database, as `context/ADR-001-stack.md` fixes it. The repository starts with context only.
Everything else, the walking skeleton included, is built by the factory: an epic in the tracker
is refined into features, each feature becomes an OpenSpec change with a task list, and each
task becomes a ticket that an agent implements through a pull request a person reviews and
merges into `dev`.

The agents read `context/` first: `DESIGN.md` for every UI value, `CONVENTIONS.md` for how work
lands and which gates and commands the code must provide, `ACCEPTANCE.md` for the examples that
become tests, `ADR-001-stack.md` for the stack. The frozen todo spec is `spec/SPEC.md`, with
versioned API paths. Specs the factory writes live under `openspec/`.

## Layout

| path | what |
|---|---|
| `context/` | Shared context for agents and people. |
| `spec/SPEC.md` | The frozen todo spec, with versioned API paths. |
| `openspec/` | OpenSpec capabilities and changes. Empty until the first change. |
| `.lore/ingest.yml` | What the factory ingests from this repository. |
| `.github/` | CODEOWNERS and the task issue template. |

## Resetting the demo

The tag `v0-context` marks this starting point on `dev`. Every rehearsal starts from it.
