#!/usr/bin/env bash
# Runs one frontend spec file for Lore and prints its lcov coverage on stdout.
#
#   scripts/lore-vitest-run.sh <selector>
#
# The selector is a spec file (`frontend/src/app/app.spec.ts`, as CI passes it) or a descriptor id
# from scripts/lore-vitest-list.mjs (`frontend/src/app/app.spec.ts::name`); the whole file runs
# either way. Run from frontend/.
set -euo pipefail

selector="${1:?usage: lore-vitest-run.sh <spec file | spec file::test name>}"
file="${selector%%::*}"
file="${file#frontend/}"

npx ng test --watch=false --coverage --coverage-reporters=lcovonly \
  --runner-config=vitest-base.config.mts --include "${file}" >&2

cat coverage/frontend/lcov.info | sed 's|^SF:|SF:frontend/|'
