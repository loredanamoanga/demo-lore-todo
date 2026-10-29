Set up the minimal static page structure needed for the repository root entry page and establish the test workspace shape the feature will use.

**Strategy: scaffold** because `.factory/tests.yml` was `build: none`, so this story must create the smallest runnable static page and Playwright test workspace.

## Facets
- [ ] Add minimal root `index.html` with one visible blue `300px` by `300px` rectangle.
- [ ] Scaffold Playwright test workspace (`package.json`, config, `tests/` layout).
- [ ] Write one acceptance test per listed scenario for `index-html`.
- [ ] Update `.factory/tests.yml` to real `tests` globs and `compile` command.
- [ ] Compile tests using manifest compile command only.
- [ ] Commit and push branch `story/10-scaffold-the-project-and-its-test-worksp`.
