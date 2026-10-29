# Repository Conventions

This repository is a demo scaffold for an Angular frontend, Spring Boot backend, and PostgreSQL
stack defined in `context/ADR-001-stack.md` and the other files under `context/`.

## Layout
- `context/` holds the canonical product, design, and process context.
- `spec/SPEC.md` is the frozen feature spec.
- `openspec/specs/` holds living capability specs.
- `openspec/changes/` holds in-flight OpenSpec changes.
- `.github/` holds repository metadata and issue/pull-request templates.

## Build and validation
- Nothing is built yet: the repository holds context and specs only, and `.factory/tests.yml` says
  `build: none`.
- The first story scaffolds the project and its test workspace from `context/ADR-001-stack.md`, and
  replaces `build: none` with the real test globs and compile command.
- Do not run full test suites in this environment.

## Style
- Keep documentation direct, minimal, and aligned with the existing context files.
- Preserve the current OpenSpec structure: one change per folder, with `proposal.md`, `design.md`,
  `tasks.md`, and capability deltas under `specs/`.
- Use versioned API paths from the start (`/api/v1/...`) when describing APIs.

## Do not touch
- Do not modify generated artifacts, vendored content, or files outside the documented change scope.
- Do not rewrite existing context or spec files unless the task explicitly requires it.
- Do not edit workflow files under `.github/workflows/`.

## CI
- CI runs the pull-request test suite.
- Agents compile only; they do not run tests locally.
- The factory test manifest is `.factory/tests.yml`.

## Factory
CI runs the tests on the pull request; agents compile, never run tests; the test manifest is `.factory/tests.yml`.
