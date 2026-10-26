# ADR-001: the stack

Status: accepted, 2026-10-26.

## Decision

Angular with Angular Material for the frontend, Spring Boot on Java 21 with Spring Data JPA and
Flyway for the backend, PostgreSQL for storage. Tests run against a real Postgres through
Testcontainers; the frontend tests run on Vitest through the Angular CLI; Playwright covers the
whole stack end to end. CI lives in GitHub Actions, and every gate lives in the pipeline: there is
no external quality service.

The demo stops at a merged pull request on `dev`. There is no deploy job, no Helm release and no
GitOps tooling in this repository.

## Reasoning

The stack mirrors the one the factory is being built for, so what the agents learn here carries
over: the same build tools, the same test style, the same gates. Angular Material is themed from
the tokens in `context/DESIGN.md` so the shell looks native next to a developer portal. Flyway
keeps the schema under version control and makes "a new migration, never an edited one" a rule
the build can enforce. Testcontainers removes the gap between what a test proves and what
production runs. Keeping the gates in the pipeline keeps them readable in one file, which is
what an agent fixing a red build needs.

Deploying is out of scope on purpose: the factory's job ends when a person merges, and a deploy
would need credentials the factory must never hold.
