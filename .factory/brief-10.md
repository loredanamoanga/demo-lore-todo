"Set up the minimal static page structure needed for the repository root entry page and establish the test workspace shape the feature will use."

**Strategy: scaffold** because `.factory/tests.yml` started at `build: none`, so this story must create the minimal runnable project and test workspace.

## Facets
- [ ] Add minimal root static page scaffold (`index.html`) for the entry point.
- [ ] Create minimal test workspace and one smoke acceptance test file under manifest test globs.
- [ ] Replace `.factory/tests.yml` `build: none` with real `compile` command and test globs.
- [ ] Compile tests with the manifest compile command.
- [ ] Commit and push branch `story/10-scaffold-the-project-and-its-test-worksp`.
