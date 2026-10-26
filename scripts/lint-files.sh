#!/usr/bin/env bash
# Formats and lints only the files given, never the whole repository: what an agent runs at delivery
# over the files it changed, with the same rule sets CI enforces repo-wide.
#
#   scripts/lint-files.sh backend/src/main/java/demo/todo/Foo.java frontend/src/app/app.ts ...
#
# Java files: Spotless (google-java-format) applied to those files, then Checkstyle on those files.
# Frontend files (.ts, .html, .scss, .json under frontend/): Prettier written, then ESLint with --fix.
# SpotBugs works on compiled classes and cannot be scoped to a file list; CI runs it.
# Exit status is non-zero when a check still fails after formatting.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "${ROOT}"

java_files=()
frontend_files=()
for file in "$@"; do
  case "${file}" in
    backend/*.java) java_files+=("${file}") ;;
    frontend/*.ts|frontend/*.html|frontend/*.scss|frontend/*.json) frontend_files+=("${file}") ;;
    *) echo "[lint-files] skipped ${file}: not a Java or frontend source file" ;;
  esac
done

status=0

if [ "${#java_files[@]}" -gt 0 ]; then
  spotless_patterns=""
  checkstyle_includes=""
  for file in "${java_files[@]}"; do
    absolute="${ROOT}/${file}"
    spotless_patterns="${spotless_patterns:+${spotless_patterns},}${absolute//./\\.}"
    relative="${file#backend/src/main/java/}"
    relative="${relative#backend/src/test/java/}"
    checkstyle_includes="${checkstyle_includes:+${checkstyle_includes},}${relative}"
  done
  echo "[lint-files] spotless:apply + checkstyle:check on ${#java_files[@]} Java file(s)"
  (cd backend && ./mvnw -q -DspotlessFiles="${spotless_patterns}" spotless:apply) || status=1
  (cd backend && ./mvnw -q -Dcheckstyle.includes="${checkstyle_includes}" checkstyle:check) || status=1
fi

if [ "${#frontend_files[@]}" -gt 0 ]; then
  relative_files=()
  for file in "${frontend_files[@]}"; do relative_files+=("${file#frontend/}"); done
  echo "[lint-files] prettier --write + eslint --fix on ${#frontend_files[@]} frontend file(s)"
  (cd frontend && npx prettier --write "${relative_files[@]}") || status=1
  lintable=()
  for file in "${relative_files[@]}"; do
    case "${file}" in *.ts|*.html) lintable+=("${file}") ;; esac
  done
  if [ "${#lintable[@]}" -gt 0 ]; then
    (cd frontend && npx eslint --fix "${lintable[@]}") || status=1
  fi
fi

exit "${status}"
