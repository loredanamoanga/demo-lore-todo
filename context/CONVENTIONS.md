# CONVENTIONS.md — how work lands in this repository

Read by every agent and every person before changing code. `context/DESIGN.md` owns the UI,
`spec/SPEC.md` owns the feature, `openspec/` owns the specs the factory writes.

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
- 80 percent line coverage on the files a pull request changes, measured by
  `scripts/coverage-changed.mjs` in CI, on top of the suite's own floors.
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

## Formatting and linting

CI runs everything repository-wide. At delivery, an agent runs only over the files it changed,
with the same rule sets, through one command from the repository root:

```
scripts/lint-files.sh <changed file> [<changed file> ...]
```

| language | what it runs on the given files |
|---|---|
| Java | `./mvnw spotless:apply -DspotlessFiles=<files>` (google-java-format), then `./mvnw checkstyle:check -Dcheckstyle.includes=<files>` (Google checks) |
| TypeScript, HTML, SCSS, JSON | `npx prettier --write <files>`, then `npx eslint --fix <files>` for `.ts` and `.html` |

SpotBugs works on compiled classes and cannot be scoped to a file list; it runs in CI only.

## Tests

| suite | where | runs with |
|---|---|---|
| Backend unit tests, `*Test.java` | `backend/src/test/java` | `./mvnw test` |
| Backend integration tests, `*IntegrationTest.java` (Testcontainers, needs Docker) | `backend/src/test/java` | `./mvnw verify` |
| Frontend unit tests, `*.spec.ts` (Vitest through the Angular CLI) | `frontend/src` | `npm run test:ci` in `frontend/` |
| End to end (Playwright) | `e2e/tests` | `npm test` in `e2e/` against a running stack |

Single tests for the factory's TDD rounds are declared in `.lore/test-commands.yml`; the
backend entry maps a test file or a `package.Class#method` id onto Maven, the frontend entry runs
one spec file. Integration tests need Docker, which an agent pod does not have: inside a pod run the
unit tests and leave the integration tests and the end-to-end tests to CI.

## Running locally

```
docker compose up -d                       # Postgres on 5432
cd backend && ./mvnw spring-boot:run       # API on 8080, health at /actuator/health
cd frontend && npm start                   # UI on 4200, proxies /api and /actuator to 8080
cd e2e && npm test                         # against the two above
```
