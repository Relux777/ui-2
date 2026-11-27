// Загрузка движка проекта и общий каталог подсказок. Своих правил у расширения нет:
// оно импортирует rendit-code/core из папки проекта и спрашивает его, поэтому подсказки
// всегда совпадают с тем, что реально попадёт в CSS.
const vscode = require("vscode");
const path = require("node:path");
const { pathToFileURL } = require("node:url");
const state = require("./state");
const { summarize, propertyOf } = require("./describe");

const cap = (value, max = 56) =>
  value.length > max ? `${value.slice(0, max - 1)}…` : value;

// Понятные подписи частых вариантов; остальные показывают селектор/@media как есть.
const VARIANT_LABEL = {
  hover: ":hover (мышь)",
  focus: ":focus",
  "focus-visible": ":focus-visible",
  "focus-within": ":focus-within",
  active: ":active",
  disabled: ":disabled",
  checked: ":checked",
  before: "::before",
  after: "::after",
  placeholder: "::placeholder",
  dark: "тёмная тема",
  touch: "@media (hover: none)",
  mouse: "@media (hover: hover) and (pointer: fine)",
  "motion-reduce": "@media (prefers-reduced-motion: reduce)",
  "motion-safe": "@media (prefers-reduced-motion: no-preference)",
  print: "@media print",
};

async function loadProject(root) {
  const stamp = Date.now();
  const load = (file) =>
    import(
      `${pathToFileURL(path.join(root, "rendit-code", "core", file)).href}?v=${stamp}`
    );
  const [
    { loadConfig },
    { createGenerator },
    { buildCatalog, classColor },
    { createVariants },
    { splitTopLevel },
  ] = await Promise.all([
    load("config.mjs"),
    load("generator.mjs"),
    load("catalog.mjs"),
    load("variants.mjs"),
    load("parser.mjs"),
  ]);

  const started = Date.now();
  const config = await loadConfig(root);
  const generator = createGenerator(config.theme, config);
  const catalog = buildCatalog(config, generator);
  const variants = createVariants(config);

  // Один проход по каталогу: цвет для образца, короткое описание и CSS-свойство для каждой подсказки.
  // compile кэшируется в генераторе, поэтому лишней работы нет.
  const colors = new Map();
  const descriptions = new Map();
  // CSS-свойство → классы. По нему ввод «padding-bottom» подсказывает pb-*, даже если класс забыт.
  const propertyIndex = new Map();
  for (const cls of catalog.utilities) {
    const item = generator.compile(cls);
    if (!item) continue;
    const color = classColor(cls, config, generator);
    if (color) colors.set(cls, color);
    const summary = summarize(item.rules[0].decls);
    if (summary) descriptions.set(cls, summary);
    const prop = propertyOf(item.rules[0].decls);
    if (prop) {
      if (!propertyIndex.has(prop)) propertyIndex.set(prop, []);
      propertyIndex.get(prop).push(cls);
    }
  }

  const variantInfo = new Map();
  for (const name of catalog.variants) {
    const resolved = variants.resolve(name);
    const raw = resolved
      ? (resolved.at ??
        resolved.sel?.replaceAll("&", "") ??
        resolved.pseudo ??
        "")
      : "";
    variantInfo.set(name, cap(VARIANT_LABEL[name] ?? raw));
  }

  state.log?.appendLine(
    `[${root}] RenDit Code v${config.version}: ${catalog.utilities.length} классов, ${catalog.variants.length} вариантов, ` +
      `${colors.size} цветов — за ${Date.now() - started} мс${config.tokenInfo.warning ? ` (⚠ ${config.tokenInfo.warning})` : ""}`,
  );

  return {
    root,
    config,
    generator,
    catalog,
    variants,
    colors,
    descriptions,
    propertyIndex,
    variantInfo,
    splitTopLevel,
    colorOf: (cls) => colors.get(cls) ?? classColor(cls, config, generator),
    items: null, // готовые CompletionItem без префикса — собираются при первом запросе
  };
}

function getProject(root) {
  if (!state.projects.has(root)) {
    const p = loadProject(root).catch((err) => {
      state.log?.appendLine(
        `[${root}] ✖ не удалось загрузить движок: ${err?.stack ?? err}`,
      );
      state.projects.delete(root);
      return null;
    });
    state.projects.set(root, p);
  }
  return state.projects.get(root);
}

async function findRoots() {
  const files = await vscode.workspace.findFiles(
    "**/rendit.config.mjs",
    "**/node_modules/**",
    20,
  );
  state.roots = files
    .map((f) => path.dirname(f.fsPath))
    .sort((a, b) => b.length - a.length);
}

// Проект, в котором лежит файл (самая глубокая папка с rendit.config.mjs).
function projectFor(doc) {
  const file = doc.uri.fsPath.toLowerCase();
  const root = state.roots.find((r) =>
    file.startsWith(r.toLowerCase() + path.sep),
  );
  return root ? getProject(root) : Promise.resolve(null);
}

function reloadAll() {
  state.projects.clear();
  return findRoots();
}

// Конфиг движка или токены изменились — перезагрузить проект. Срабатывает на watcher в extension.js.
async function onConfigChange(uri) {
  if (uri.fsPath.includes(`${path.sep}node_modules${path.sep}`)) return;
  if (uri.fsPath.endsWith("rendit.config.mjs")) return reloadAll();
  for (const [root, p] of state.projects) {
    const project = await p;
    const isToken = project?.config.tokenInfo.files.some(
      (f) => path.resolve(f).toLowerCase() === uri.fsPath.toLowerCase(),
    );
    const isPkg =
      uri.fsPath.toLowerCase() ===
      path.join(root, "package.json").toLowerCase();
    if (isToken || isPkg) state.projects.delete(root);
  }
}

module.exports = {
  getProject,
  findRoots,
  projectFor,
  reloadAll,
  onConfigChange,
};
