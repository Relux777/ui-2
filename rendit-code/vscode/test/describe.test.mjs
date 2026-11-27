// Тесты описаний классов (summarize/propertyOf) на реальном движке ui-2.

import assert from "node:assert/strict";
import path from "node:path";
import { before, test } from "node:test";
import { fileURLToPath } from "node:url";
import { loadConfig } from "../../core/config.mjs";
import { createGenerator } from "../../core/generator.mjs";
import { propertyOf, summarize } from "../src/describe.js";

const ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../..",
);

let generator;

before(async () => {
  const config = await loadConfig(ROOT);
  generator = createGenerator(config.theme, config);
});

const compile = (cls) => {
  const item = generator.compile(cls);
  return item ? item.rules[0].decls : null;
};

test("summarize: pb-4 → padding-bottom", () => {
  assert.equal(summarize(compile("pb-4")), "padding-bottom: 4px");
});

test("summarize: простые и составные классы", () => {
  assert.equal(summarize(compile("flex")), "display: flex");
  assert.equal(summarize(compile("p-10")), "padding: 10px");
  assert.equal(summarize(compile("size-4")), "width: 4px; height: 4px");
  assert.equal(summarize(compile("br-full")), "border-radius: 9999px");
});

test("summarize: translate и content — читабельно", () => {
  assert.equal(summarize(compile("translate-x-4")), "translate-x: 4px");
  assert.equal(summarize(compile("-translate-y-2")), "translate-y: -2px");
});

test("summarize: пусто и только внутренние свойства → null", () => {
  assert.equal(summarize([]), null);
  assert.equal(summarize(null), null);
  assert.equal(summarize([["--rd-x", "1"]]), null);
});

test("propertyOf: главное CSS-свойство", () => {
  assert.equal(propertyOf(compile("pb-4")), "padding-bottom");
  assert.equal(propertyOf(compile("p-10")), "padding");
  assert.equal(propertyOf(compile("mt-4")), "margin-top");
  assert.equal(propertyOf(compile("flex")), "display");
  assert.equal(propertyOf(compile("bg-primary")), "background-color");
  assert.equal(propertyOf(compile("text-white")), "color");
  assert.equal(propertyOf(compile("translate-x-4")), "translate-x");
  assert.equal(propertyOf(compile("br-full")), "border-radius");
});

test("propertyOf: пусто → null", () => {
  assert.equal(propertyOf([]), null);
  assert.equal(propertyOf(null), null);
});
