#!/usr/bin/env python3
"""Lists the backend's JUnit tests as Lore test descriptors, without running them.

Prints a JSON array of {id, name, file, startLine, endLine, suite} where id is
`package.Class#method`, the shape scripts/lore-test-run.sh accepts. Paths are repository-relative.
Run from backend/: `python3 ../scripts/lore-test-list.py`.
"""
import json
import pathlib
import re
import sys

TEST_ROOT = pathlib.Path("src/test/java")
PACKAGE = re.compile(r"^\s*package\s+([\w.]+)\s*;")
CLASS = re.compile(r"^\s*(?:public\s+|final\s+)*class\s+(\w+)")
TEST_ANNOTATION = re.compile(r"^\s*@(?:Test|ParameterizedTest|RepeatedTest)\b")
METHOD = re.compile(r"^\s*(?:public\s+|protected\s+|private\s+)?(?:static\s+)?[\w<>\[\], ]+\s+(\w+)\s*\(")


def descriptors(path: pathlib.Path):
    lines = path.read_text().splitlines()
    package = next((m.group(1) for line in lines if (m := PACKAGE.match(line))), "")
    class_name = next((m.group(1) for line in lines if (m := CLASS.match(line))), path.stem)
    repo_relative = "backend/" + str(path)
    found = []
    pending = None
    for number, line in enumerate(lines, start=1):
        if TEST_ANNOTATION.match(line):
            pending = number
            continue
        if pending is not None and (m := METHOD.match(line)):
            found.append((pending, m.group(1)))
            pending = None
    for index, (start, method) in enumerate(found):
        end = found[index + 1][0] - 1 if index + 1 < len(found) else len(lines)
        yield {
            "id": f"{package}.{class_name}#{method}",
            "name": method,
            "file": repo_relative,
            "startLine": start,
            "endLine": end,
            "suite": [class_name],
        }


def main() -> int:
    if not TEST_ROOT.is_dir():
        print(f"{TEST_ROOT} not found: run from backend/", file=sys.stderr)
        return 1
    tests = [d for path in sorted(TEST_ROOT.rglob("*.java")) for d in descriptors(path)]
    json.dump(tests, sys.stdout)
    return 0


if __name__ == "__main__":
    sys.exit(main())
