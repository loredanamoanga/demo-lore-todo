#!/usr/bin/env bash
# Runs one backend test for Lore and prints what it covered as Lore's JSON shape.
#
#   scripts/lore-test-run.sh <selector>
#
# The selector is either a test file (`backend/src/test/java/demo/todo/FooTest.java`, as CI passes
# it) or a descriptor id from scripts/lore-test-list.py (`demo.todo.FooTest#method`). Both become a
# Maven `-Dtest=Class#method` filter; integration tests (*IntegrationTest) run through failsafe,
# which needs Docker. Run from backend/.
set -euo pipefail

selector="${1:?usage: lore-test-run.sh <test file | package.Class#method>}"
here="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if [[ "${selector}" == *.java ]]; then
  relative="${selector#backend/}"
  relative="${relative#src/test/java/}"
  filter="$(basename "${relative}" .java)"
else
  filter="${selector##*.}"
fi

skip_gates=(-Dspotless.check.skip=true -Dcheckstyle.skip=true -Dspotbugs.skip=true)
if [[ "${filter}" == *IntegrationTest* ]]; then
  ./mvnw -q -B verify -Dtest=none -Dsurefire.failIfNoSpecifiedTests=false \
    -Dit.test="${filter}" -Dfailsafe.failIfNoSpecifiedTests=false "${skip_gates[@]}" >&2 && passed=true || passed=false
else
  ./mvnw -q -B verify -Dtest="${filter}" -Dsurefire.failIfNoSpecifiedTests=false \
    -Dit.test=none -Dfailsafe.failIfNoSpecifiedTests=false "${skip_gates[@]}" >&2 && passed=true || passed=false
fi

python3 "${here}/jacoco-to-lore.py" target/site/jacoco/jacoco.xml "${passed}"
