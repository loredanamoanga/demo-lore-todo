#!/usr/bin/env python3
"""Turns a JaCoCo XML report into Lore's `{passed, covered: [{file, startLine, endLine}]}`.

Usage: jacoco-to-lore.py <jacoco.xml> <true|false>. Paths are repository-relative
(`backend/src/main/java/...`). A missing report means nothing ran: empty coverage, not an error.
"""
import json
import pathlib
import sys
import xml.etree.ElementTree as ElementTree


def ranges(numbers):
    start = previous = None
    for number in numbers:
        if start is None:
            start = previous = number
        elif number == previous + 1:
            previous = number
        else:
            yield start, previous
            start = previous = number
    if start is not None:
        yield start, previous


def covered_chunks(report: pathlib.Path):
    if not report.is_file():
        return
    for package in ElementTree.parse(report).getroot().iter("package"):
        for source in package.iter("sourcefile"):
            path = f"backend/src/main/java/{package.get('name')}/{source.get('name')}"
            covered = sorted(int(line.get("nr")) for line in source.iter("line") if int(line.get("ci", "0")) > 0)
            for start, end in ranges(covered):
                yield {"file": path, "startLine": start, "endLine": end}


def main() -> int:
    report = pathlib.Path(sys.argv[1])
    passed = sys.argv[2].lower() == "true"
    json.dump({"passed": passed, "covered": list(covered_chunks(report))}, sys.stdout)
    return 0


if __name__ == "__main__":
    sys.exit(main())
