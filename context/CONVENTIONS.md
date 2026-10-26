# CONVENTIONS.md — how work lands in this repository

Read by every agent and every person before changing anything. `context/DESIGN.md` owns the UI,
`spec/SPEC.md` owns the todo feature, `openspec/` owns the specs the factory writes, and
`context/ADR-001-stack.md` fixes the stack.

## How code comes to exist here

The repository starts with context only. Every part of the product, the walking skeleton
included, is built by the factory: an epic in the tracker is refined into features, each feature
becomes an OpenSpec change under `openspec/changes/<change>/` with a proposal, a design, a delta
spec and a task list, and each task becomes a ticket that one agent run implements through one
pull request. A person approves every plan and merges every pull request. Nothing is written by
hand except this context.

## Layout the factory builds towards

| path | what goes there |
|---|---|
| `backend/` | Spring Boot on Java 21 with the Maven wrapper, Spring Data JPA, Flyway, PostgreSQL. |
| `frontend/` | An Angular workspace with Angular Material, themed from `context/DESIGN.md`. |
| `e2e/` | Playwright tests against the running stack. |
| `scripts/` | The file-scoped lint command and the single-test runners described below. |
| `.github/workflows/ci.yml` | Every gate. |
| `.lore/test-commands.yml` | The factory's single-test manifest, one entry per suite with its own `cwd`. |

## Branches and commits

- The default branch is `dev`. Every change is a branch off `dev` and a pull request into `dev`.
- Branch names: `feature/<ticket>-<slug>`, `fix/<ticket>-<slug>`, `prototype/<epic-key>`.
- Conventional commits: `feat:`, `fix:`, `test:`, `chore:`, `docs:`, `refactor:`, `ci:`, with
  the ticket in the body. One logical change per commit.
- Branches are updated by rebasing onto `dev`, never by merging `dev` in. When two pull requests
  overlap, the second rebases after the first merges; nothing is merged over a conflict.

## Pull requests

- A pull request names its ticket, says what overlaps with other open pull requests, and lists
  the files it touched against the ticket's territory (the files and directories the ticket may
  touch). A file outside the territory sends the change back, never to ready.
- Every check in `.github/workflows/ci.yml` is required and must be green before review.
- A person reviews and a person merges. The factory opens pull requests; it never merges, never
  approves, never changes a status in the tracker.

## Definition of done

- Tests are written first, from the acceptance examples in `context/ACCEPTANCE.md` and the
  ticket's acceptance criteria; the code that makes them pass comes after the red bar.
- 80 percent line coverage on the files a pull request changes, on top of each suite's own
  floor. Entry points are exempt because they hold wiring and no logic: the Spring
  `*Application` class, Angular's `main.ts` and `app.config.ts`. Nothing else is.
- No TODO, FIXME or commented-out code left behind.
- Persistence is tested against a real Postgres through Testcontainers. There is no H2 and no
  mocked repository in a test that exercises persistence.
- Schema changes are new Flyway migrations under `backend/src/main/resources/db/migration`,
  numbered after the last one. An existing migration is never edited.
- API paths are versioned from the start: `/api/v1/...`. The frozen spec in `spec/SPEC.md`
  already carries the versioned paths.
- The UI takes every value from `context/DESIGN.md`; a hex not listed there is a bug.
- End-to-end tests under `e2e/` cover every user-visible flow a ticket adds, through the real
  frontend and backend.

## The gates, all in `.github/workflows/ci.yml`

Backend: Spotless with google-java-format, Checkstyle with Google's checks, SpotBugs, unit tests
(`*Test`) and integration tests (`*IntegrationTest`, Testcontainers) with JaCoCo. Frontend:
Prettier, ESLint through angular-eslint, the Angular CLI's unit tests with coverage. Repository:
GitLeaks, a Trivy filesystem scan, Playwright end to end. Each is its own required check.

## Formatting and linting at delivery

CI runs everything repository-wide. At delivery, an agent runs only over the files it changed,
with the same rule sets, through one command from the repository root:

```
scripts/lint-files.sh <changed file> [<changed file> ...]
```

| language | what it must run on the given files |
|---|---|
| Java | `./mvnw spotless:apply -DspotlessFiles=<files>`, then `./mvnw checkstyle:check -Dcheckstyle.includes=<files>` |
| TypeScript, HTML, SCSS, JSON | `npx prettier --write <files>`, then `npx eslint --fix <files>` for `.ts` and `.html` |

SpotBugs works on compiled classes and cannot be scoped to a file list; it runs in CI only.

## Single tests for the factory

`.lore/test-commands.yml` declares, per suite and with its own `cwd`, a `list` command printing
JSON test descriptors and a `run` command taking `{selector}` as either a test file or a
descriptor id, printing coverage in a format Lore reads (`json` or `lcov`). Integration tests need
Docker, which an agent pod does not have: inside a pod an agent runs the unit tests and leaves
the integration tests and the end-to-end tests to CI.

## Running locally

A `docker-compose.yml` in the root starts Postgres; the backend runs with `./mvnw spring-boot:run`
on 8080, the frontend with `npm start` on 4200 proxying `/api` and `/actuator` to the backend,
and `npm test` in `e2e/` runs Playwright against the two.
