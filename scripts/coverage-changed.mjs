#!/usr/bin/env node
// Enforces 80 percent line coverage on the source files a change touched: the "coverage on new
// code" gate, computed deterministically from the reports the suites already write.
//
//   scripts/coverage-changed.mjs <base ref> <jacoco.xml | none> <coverage-final.json | none>
//
// A suite is checked only when its report is given: the backend job passes JaCoCo's XML and
// `none`, the frontend job `none` and Vitest's istanbul JSON. Files with no executable lines
// (interfaces, pure types) pass. A changed source file that no report mentions fails: no test
// executed it. Entry points are exempt, since they hold wiring and no logic: the Spring
// `*Application.java` class, Angular's `main.ts` and `app.config.ts`.
import { execFileSync } from 'node:child_process';
import { readFileSync, statSync } from 'node:fs';

const MINIMUM = 80;
const [baseRef, jacocoPath = 'none', istanbulPath = 'none'] = process.argv.slice(2);
if (!baseRef) {
  console.error('usage: coverage-changed.mjs <base ref> <jacoco.xml | none> <coverage-final.json | none>');
  process.exit(2);
}

const EXEMPT = [/^backend\/src\/main\/java\/.*Application\.java$/, /^frontend\/src\/main\.ts$/, /^frontend\/src\/app\/app\.config\.ts$/];
const BACKEND_SOURCE = /^backend\/src\/main\/java\/.*\.java$/;
const FRONTEND_SOURCE = /^frontend\/src\/.*\.ts$/;

function report(path) {
  if (path === 'none') return null;
  try {
    return statSync(path).isFile() ? readFileSync(path, 'utf8') : null;
  } catch {
    return null;
  }
}

const jacoco = report(jacocoPath);
const istanbul = report(istanbulPath);
if (jacocoPath !== 'none' && jacoco === null) fail(`no JaCoCo report at ${jacocoPath}`);
if (istanbulPath !== 'none' && istanbul === null) fail(`no istanbul report at ${istanbulPath}`);

const changed = execFileSync('git', ['diff', '--name-only', '--diff-filter=AM', `${baseRef}...HEAD`], { encoding: 'utf8' })
  .split('\n')
  .filter((file) => (jacoco !== null && BACKEND_SOURCE.test(file)) || (istanbul !== null && FRONTEND_SOURCE.test(file)))
  .filter((file) => !/\.spec\.ts$/.test(file))
  .filter((file) => !EXEMPT.some((pattern) => pattern.test(file)));

const lineCoverage = new Map();

if (jacoco !== null) {
  for (const pkg of jacoco.matchAll(/<package name="([^"]+)">([\s\S]*?)<\/package>/g)) {
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

if (istanbul !== null) {
  for (const entry of Object.values(JSON.parse(istanbul))) {
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

function fail(message) {
  console.error(message);
  process.exit(1);
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
  if (percent < MINIMUM) failed = true;
  console.log(`${percent < MINIMUM ? 'FAIL ' : 'ok   '} ${file}: ${percent}% (${counts.covered}/${counts.total} lines)`);
}
if (changed.length === 0) console.log('no changed source files to check');
process.exit(failed ? 1 : 0);
