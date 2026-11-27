// Интеграционные тесты автодополнения: запускаем расширение с mock-ом vscode
// и проверяем provideCompletionItems на разных вводах.

import assert from "node:assert/strict";
import Module, { createRequire } from "node:module";
import path from "node:path";
import { before, test } from "node:test";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const { createMockVscode } = require("../test-mock/vscode.cjs");
const vscode = createMockVscode();

// Перехват require("vscode") внутри расширения → mock.
const originalLoad = Module._load;
Module._load = function (request, parent, isMain) {
  if (request === "vscode") return vscode;
  return originalLoad.call(this, request, parent, isMain);
};

const { activate } = require("../extension.js");

// ui-2 (папка с rendit.config.mjs) — на два уровня выше test/.
const ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../..",
);

let provider;

before(async () => {
  vscode.__setFindRoots([{ fsPath: path.join(ROOT, "rendit.config.mjs") }]);
  await activate({ subscriptions: [] });
  provider = vscode.__getProviders().completion;
});

function docWith(text) {
  const lines = text.split("\n");
  return {
    uri: { fsPath: path.join(ROOT, "src", "app", "page.tsx"), scheme: "file" },
    languageId: "typescriptreact",
    offsetAt(pos) {
      let off = 0;
      for (let i = 0; i < pos.line; i++) off += lines[i].length + 1;
      return off + pos.character;
    },
    positionAt(off) {
      let acc = 0;
      for (let i = 0; i < lines.length; i++) {
        const len = lines[i].length + 1;
        if (acc + len > off) return new vscode.Position(i, off - acc);
        acc += len;
      }
      return new vscode.Position(
        lines.length - 1,
        lines[lines.length - 1].length,
      );
    },
    getText(range) {
      if (!range) return text;
      return text.slice(this.offsetAt(range.start), this.offsetAt(range.end));
    },
    lineAt(n) {
      return { text: lines[n] };
    },
    version: 1,
    isClosed: false,
  };
}

// typed — сколько символов введено после открывающей кавычки className=".
async function suggest(typed) {
  const snippet = `<div className="${typed}">x</div>`;
  const doc = docWith(snippet);
  const quote = snippet.indexOf('className="') + 'className="'.length;
  const pos = new vscode.Position(0, quote + typed.length);
  const result = await provider.provideCompletionItems(doc, pos);
  return result ? result.items : null;
}

test('className="" — сразу все классы', async () => {
  const items = await suggest("");
  assert.ok(
    items && items.length > 9000,
    `ожидалось >9000, получено ${items?.length}`,
  );
});

test('className="p" — префиксные классы сверху, p-4 раньше gap-4', async () => {
  const items = await suggest("p");
  assert.ok(items.length > 0);
  assert.ok(items[0].label.startsWith("p"), `первый: ${items[0].label}`);
  const p4 = items.findIndex((i) => i.label === "p-4");
  const gap = items.findIndex((i) => i.label === "gap-4");
  assert.ok(p4 >= 0);
  assert.ok(gap === -1 || p4 < gap, "p-4 должен идти раньше gap-4");
});

test('className="pb" — только pb-*, с описанием padding-bottom', async () => {
  const items = await suggest("pb");
  const pb4 = items.find((i) => i.label === "pb-4");
  assert.ok(pb4);
  assert.equal(pb4.detail, "padding-bottom: 4px");
  assert.ok(
    !items.some((i) => i.label === "px-4"),
    "px-4 не должен попасть при запросе pb",
  );
});

test('className="padding" — pb-* и p-* по CSS-свойству', async () => {
  const items = await suggest("padding");
  assert.ok(items.some((i) => i.label === "pb-4"));
  assert.ok(items.some((i) => i.label === "p-4"));
});

test('className="padding-bottom" — pb-* по свойству', async () => {
  const items = await suggest("padding-bottom");
  assert.ok(items.some((i) => i.label === "pb-4"));
});

test("пробел между классами → списка нет", async () => {
  const items = await suggest("flex ");
  assert.equal(items, null);
});

test('className="hover:" — классы с вариантом', async () => {
  const items = await suggest("hover:");
  assert.ok(items.length > 9000);
  assert.ok(items[0].label.startsWith("hover:"));
});

test('className="h" — вариант hover: присутствует', async () => {
  const items = await suggest("h");
  assert.ok(items.some((i) => i.label === "hover:"));
});

test("вне className — списка нет", async () => {
  const doc = docWith(`const x = 42;`);
  const pos = new vscode.Position(0, 12);
  const result = await provider.provideCompletionItems(doc, pos);
  assert.equal(result, null);
});
