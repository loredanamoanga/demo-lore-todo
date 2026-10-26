# Project context for OpenSpec

Specs in this repository are written as OpenSpec: one living spec per capability under
`openspec/specs/<capability>/spec.md`, and every change as a folder under
`openspec/changes/<change>/` holding `proposal.md`, `design.md`, `tasks.md` and a delta spec,
archived after the change merges.

## Purpose

A shared team todo list: one service, one entity. The frozen feature spec the first capability is
built from is `spec/SPEC.md`; the acceptance examples are `context/ACCEPTANCE.md`.

## Tech stack

- Backend: Spring Boot on Java 21, Spring Data JPA, Flyway migrations, PostgreSQL. Maven wrapper.
- Frontend: Angular with Angular Material, themed from the tokens in `context/DESIGN.md`.
- Tests: JUnit and Testcontainers for the backend, Vitest for the frontend, Playwright end to end.

## Conventions

See `context/CONVENTIONS.md` for branches, commits, pull requests, the definition of done and
the file-scoped lint commands. API paths are versioned from the start: `/api/v1/...`.

## Capabilities

None yet. The first change is the walking skeleton; the todo capability follows it.
