// RenDit Code IntelliSense — расширение VS Code. Точка входа: только регистрация провайдеров
// и общая инициализация. Логика разложена по src/*.js.
//
// Что делает:
//   • автодополнение классов и вариантов в className="…", class="…", cn("…") и т.п. — с коротким
//     описанием каждого класса (pb-4 → padding-bottom: 4px) и понятной подписью вариантов;
//   • при наведении на класс — CSS, который сгенерирует движок;
//   • образцы цвета рядом с bg-…, text-…, border-… (значения токенов светлой темы);
//   • опциональная проверка классов (renditCode.validateClasses).
//
// Своих правил у расширения нет: оно загружает движок проекта (rendit-code/core) и спрашивает его.
// Сборка и установка — node rendit-code/vscode/install.mjs.
const vscode = require("vscode");
const state = require("./src/state");
const { LANGUAGES, TRIGGER_CHARS } = require("./src/config");
const {
  getProject,
  findRoots,
  reloadAll,
  onConfigChange,
} = require("./src/project");
const { completionProvider } = require("./src/completion");
const { hoverProvider } = require("./src/hover");
const { colorProvider } = require("./src/color");
const { registerDiagnostics } = require("./src/diagnostics");

const SELECTOR = LANGUAGES.map((language) => ({ language, scheme: "file" }));

async function activate(context) {
  state.log = vscode.window.createOutputChannel("RenDit Code");
  state.diagnostics =
    vscode.languages.createDiagnosticCollection("rendit-code");

  await findRoots();

  context.subscriptions.push(
    state.log,
    state.diagnostics,
    vscode.languages.registerCompletionItemProvider(
      SELECTOR,
      completionProvider,
      ...TRIGGER_CHARS,
    ),
    vscode.languages.registerHoverProvider(SELECTOR, hoverProvider),
    vscode.languages.registerColorProvider(SELECTOR, colorProvider),
    vscode.commands.registerCommand("renditCode.reload", async () => {
      await reloadAll();
      vscode.window.setStatusBarMessage(
        "RenDit Code: конфиг и токены перезагружены",
        3000,
      );
    }),
  );

  registerDiagnostics(context);

  // Конфиг движка или токены изменились — перезагрузить проект.
  const watcher = vscode.workspace.createFileSystemWatcher(
    "**/{rendit.config.mjs,*.scss,package.json}",
  );
  context.subscriptions.push(
    watcher,
    watcher.onDidChange(onConfigChange),
    watcher.onDidCreate(onConfigChange),
    watcher.onDidDelete(onConfigChange),
  );

  // Прогреть движок заранее, чтобы первая подсказка была мгновенной.
  for (const root of state.roots) getProject(root);
}

function deactivate() {
  state.diagnostics?.clear();
  state.diagnostics?.dispose();
  state.diagnostics = null;
}

module.exports = { activate, deactivate };
