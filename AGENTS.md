# Repository Conventions

This repository starts empty: the factory builds everything in it from the features it is given.
There is no stack fixed in advance; a feature's plan and spec decide what gets built.

## Layout
- `openspec/specs/` holds living capability specs.
- `openspec/changes/` holds in-flight OpenSpec changes, one per folder.
- `openspec/templates/` holds the templates every change follows.
- `.factory/` holds the factory's manifests.

## Build and validation
- Nothing is built yet, and `.factory/tests.yml` says `build: none`.
- The first story scaffolds the project and its test workspace, following the conventions below,
  and replaces `build: none` with the real test globs and compile command.
- Do not run full test suites in this environment.

## Conventions
- Static HTML and CSS at the repository root until a feature needs more. Add a framework, a
  bundler or a backend only when a feature's plan asks for one.
- Never commit dependencies or build output: `node_modules/`, `dist/`, `test-results/` and
  `playwright-report/` stay out, and `.gitignore` lists them.
- Tests are Playwright tests in `tests/`, run in a real browser against the page, with `npm test`
  (`playwright test`). Check what a person sees: the element, its colour and its size.
- `package.json` holds only what the tests need: `@playwright/test` as the one dev dependency.
- `.github/workflows/ci.yml` runs on every pull request to `dev`: install with `npm ci`, install
  the Chromium browser, run `npm test`. A story that adds tests keeps this workflow passing.
- `.factory/tests.yml` uses top-level keys, with no `build:` once the project exists:

      tests:
        - "tests/**"
      compile: npx playwright test --list

## Style
- Keep documentation direct and minimal.
- Preserve the OpenSpec structure: one change per folder, with `proposal.md`, `design.md`,
  `tasks.md`, and capability deltas under `specs/`.

## Do not touch
- Do not modify generated artifacts, vendored content, or files outside the documented change scope.
- Do not edit existing workflow files under `.github/workflows/`.

## Factory
CI runs the tests on the pull request; agents compile, never run tests; the test manifest is `.factory/tests.yml`.
