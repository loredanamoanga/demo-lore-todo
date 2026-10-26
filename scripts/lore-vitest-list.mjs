#!/usr/bin/env node
// Lists the frontend's Vitest specs as Lore test descriptors, without running them.
// Prints a JSON array of {id, name, file, startLine, endLine, suite}; id is `<file>::<name>`,
// the shape scripts/lore-vitest-run.sh accepts. Paths are repository-relative. Run from frontend/.
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const root = process.cwd();
const describeOrTest = /^\s*(describe|it|test)\s*\(\s*(['"`])((?:\\.|(?!\2).)*)\2/;

function* specFiles(dir) {
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) yield* specFiles(path);
    else if (entry.endsWith('.spec.ts')) yield path;
  }
}

function descriptors(path) {
  const lines = readFileSync(path, 'utf8').split('\n');
  const file = 'frontend/' + relative(root, path);
  const suite = [];
  const found = [];
  lines.forEach((line, index) => {
    const match = describeOrTest.exec(line);
    if (!match) return;
    if (match[1] === 'describe') suite.push(match[3]);
    else found.push({ start: index + 1, name: match[3], suite: [...suite] });
  });
  return found.map((test, index) => ({
    id: `${file}::${test.name}`,
    name: test.name,
    file,
    startLine: test.start,
    endLine: index + 1 < found.length ? found[index + 1].start - 1 : lines.length,
    suite: test.suite,
  }));
}

const tests = [...specFiles(join(root, 'src'))].flatMap(descriptors);
process.stdout.write(JSON.stringify(tests));
