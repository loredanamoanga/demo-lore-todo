import { existsSync, readFileSync } from "fs";

function expect(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(message);
  }
}

expect(existsSync("index.html"), "expected root index.html to exist");
const page = readFileSync("index.html", "utf8");
expect(page.includes("<!doctype html>"), "expected static html doctype");
expect(page.includes("blue-rectangle"), "expected blue rectangle markup");
