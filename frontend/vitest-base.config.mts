import { defineConfig } from 'vitest/config';

// Coverage floor for the frontend; the per-changed-file check runs in CI on top of it.
export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      thresholds: { lines: 80, statements: 80, functions: 80, branches: 80 },
    },
  },
});
