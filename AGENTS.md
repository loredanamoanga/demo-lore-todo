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
- The first story scaffolds the project and its test workspace, with the smallest setup the
  feature needs, and replaces `build: none` with the real test globs and compile command.
- Do not run full test suites in this environment.

## Style
- Keep documentation direct and minimal.
- Preserve the OpenSpec structure: one change per folder, with `proposal.md`, `design.md`,
  `tasks.md`, and capability deltas under `specs/`.

## Do not touch
- Do not modify generated artifacts, vendored content, or files outside the documented change scope.
- Do not edit existing workflow files under `.github/workflows/`.

## Factory
CI runs the tests on the pull request; agents compile, never run tests; the test manifest is `.factory/tests.yml`.
