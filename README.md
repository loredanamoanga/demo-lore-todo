# demo-lore-todo

> **This is a demo, not a product.** It exists to show an AI software factory building a feature
> from a frozen spec, end to end, under human gates. Nothing here is meant to run in production.

## What this is

A small team todo service: an Angular frontend, a Spring Boot backend on Java 21, a PostgreSQL
database. The repository holds only the walking skeleton and its plumbing. The feature itself,
the todo list from `spec/SPEC.md`, is built by the factory's agents from Jira and GitHub issues,
through pull requests that a person reviews and merges into `dev`.

The agents read `context/` first: `DESIGN.md` for every UI value, `CONVENTIONS.md` for how work
lands, `ACCEPTANCE.md` for the examples that become tests, `ADR-001-stack.md` for why the stack is
what it is. Specs the factory writes live under `openspec/`.

## Layout

| path | what |
|---|---|
| `backend/` | Spring Boot service. Only the actuator health endpoint exists today. |
| `frontend/` | Angular workspace holding the app shell from `context/DESIGN.md`. |
| `e2e/` | Playwright tests against the running stack. |
| `context/` | Shared context for agents and people. |
| `spec/SPEC.md` | The frozen feature spec, with versioned API paths. |
| `openspec/` | OpenSpec capabilities and changes. Empty until the first change. |
| `.lore/` | What the factory reads: the test-command manifest and the ingest manifest. |
| `scripts/` | File-scoped lint, single-test runners, the changed-files coverage check. |
| `.github/workflows/ci.yml` | Every gate: format, lint, static analysis, tests, coverage, secrets, vulnerabilities, end to end. |

## Running it

```
docker compose up -d
cd backend && ./mvnw spring-boot:run
cd frontend && npm start
```

Then open http://localhost:4200. The health endpoint is http://localhost:8080/actuator/health.

## Resetting the demo

The tag `v0-skeleton` marks the merge commit of this skeleton on `dev`. Every rehearsal starts
from it.
