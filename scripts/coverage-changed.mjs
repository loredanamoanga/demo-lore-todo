#!/usr/bin/env node
// Enforces 80 percent line coverage on the source files a change touched: the "coverage on new
// code" gate, computed deterministically from the reports the suites already write.
//
//   scripts/coverage-changed.mjs <base ref> [backend/target/site/jacoco/jacoco.xml] [frontend/coverage/frontend/coverage-final.json]
//
// Files with no executable lines in the report (interfaces, pure types) pass. A changed source
// file that no report mentions fails: it was never executed by a test.
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';

const MINIMUM = 80;
const [baseRef, jacocoPath = 'backend/target/site/jacoco/jacoco.xml', istanbulPath = 'frontend/coverage/frontend/coverage-final.json'] =
  process.argv.slice(2);
if (!baseRef) {
  console.error('usage: coverage-changed.mjs <base ref> [jacoco.xml] [coverage-final.json]');
  process.exit(2);
}

const changed = execFileSync('git', ['diff', '--name-only', '--diff-filter=AM', `${baseRef}...HEAD`], { encoding: 'utf8' })
  .split('\n')
  .filter((file) => /^backend\/src\/main\/java\/.*\.java$/.test(file) || /^frontend\/src\/.*\.ts$/.test(file))
  .filter((file) => !/\.spec\.ts$/.test(file) && !/^frontend\/src\/main\.ts$/.test(file));

const lineCoverage = new Map();

if (existsSync(jacocoPath)) {
  const xml = readFileSync(jacocoPath, 'utf8');
  for (const pkg of xml.matchAll(/<package name="([^"]+)">([\s\S]*?)<\/package>/g)) {
    for (const source of pkg[2].matchAll(/<sourcefile name="([^"]+)">([\s\S]*?)<\/sourcefile>/g)) {
      let covered = 0;
      let total = 0;
      for (const line of source[2].matchAll(/<line nr="\d+" mi="(\d+)" ci="(\d+)"/g)) {
        total += 1;
        if (Number(line[2]) > 0) covered += 1;
      }
      lineCoverage.set(`backend/src/main/java/${pkg[1]}/${source[1]}`, { covered, total });
    }
  }
}

if (existsSync(istanbulPath)) {
  const report = JSON.parse(readFileSync(istanbulPath, 'utf8'));
  for (const entry of Object.values(report)) {
    const file = entry.path.replace(/^.*\/frontend\//, 'frontend/');
    const counts = Object.values(entry.l ?? lineCountsFromStatements(entry));
    lineCoverage.set(file, { covered: counts.filter((hits) => hits > 0).length, total: counts.length });
  }
}

function lineCountsFromStatements(entry) {
  const byLine = {};
  for (const [id, statement] of Object.entries(entry.statementMap)) {
    const line = statement.start.line;
    byLine[line] = Math.max(byLine[line] ?? 0, entry.s[id]);
  }
  return byLine;
}

let failed = false;
for (const file of changed) {
  const counts = lineCoverage.get(file);
  if (!counts) {
    console.log(`FAIL  ${file}: not in any coverage report (no test executed it)`);
    failed = true;
    continue;
  }
  if (counts.total === 0) {
    console.log(`ok    ${file}: no executable lines`);
    continue;
  }
  const percent = Math.round((100 * counts.covered) / counts.total);
  const verdict = percent >= MINIMUM ? 'ok   ' : 'FAIL ';
  if (percent < MINIMUM) failed = true;
  console.log(`${verdict} ${file}: ${percent}% (${counts.covered}/${counts.total} lines)`);
}
if (changed.length === 0) console.log('no changed source files to check');
process.exit(failed ? 1 : 0);
