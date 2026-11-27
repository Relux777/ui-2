// Тесты ранжирования подсказок (чистая функция, без vscode).

import assert from "node:assert/strict";
import { test } from "node:test";
import { classScore } from "../src/score.js";

test("префикс — лучший результат (0)", () => {
  assert.equal(classScore("p", "p-4"), 0);
  assert.equal(classScore("pb", "pb-4"), 0);
  assert.equal(classScore("flex", "flex-col"), 0);
  assert.equal(classScore("", "p-4"), 0);
});

test("подстрока хуже префикса, раньше в имени — лучше", () => {
  assert.equal(classScore("b-4", "pb-4"), 1 + 1); // 'b-4' внутри 'pb-4' на позиции 1
  assert.equal(classScore("4", "p-4"), 1 + 2);
  assert.ok(classScore("p", "pb-4") < classScore("p", "gap-4"));
});

test("подпоследовательность хуже подстроки", () => {
  const sub = classScore("gap", "gap-4");
  const seq = classScore("ga4", "gap-4");
  assert.equal(sub, 0); // префикс
  assert.ok(seq > sub);
  assert.ok(seq >= 100);
});

test("нет совпадения → -1", () => {
  assert.equal(classScore("pb", "px-4"), -1);
  assert.equal(classScore("zzz", "flex"), -1);
  assert.equal(classScore("color", "pb-4"), -1);
});

test("регистр не важен", () => {
  assert.equal(classScore("PB", "pb-4"), 0);
  assert.equal(classScore("Flex", "flex-col"), 0);
});
