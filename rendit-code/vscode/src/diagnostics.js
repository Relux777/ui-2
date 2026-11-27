// Проверка классов (renditCode.validateClasses): неизвестные классы — как предупреждения.
// Раньше функция не была нигде подключена; теперь слушает открытие/изменение/сохранение документов.
const vscode = require("vscode");
const state = require("./state");
const { isClassDocument } = require("./config");
const { projectFor } = require("./project");
const { classStrings } = require("./context");

async function updateDiagnostics(doc) {
  if (doc.isClosed || !isClassDocument(doc)) return;

  const enabled = vscode.workspace
    .getConfiguration("renditCode")
    .get("validateClasses", false);
  if (!enabled) {
    state.diagnostics?.delete(doc.uri);
    return;
  }

  const version = doc.version;
  const project = await projectFor(doc);
  if (!project || doc.isClosed || doc.version !== version) return;

  const result = [];
  const source = doc.getText();

  for (const { start, value } of classStrings(source)) {
    for (const match of value.matchAll(/\S+/g)) {
      const cls = match[0];
      // Не проверяем динамические классы и слишком длинные значения.
      if (!cls || cls.length > 256 || cls.includes("${") || cls.includes("}"))
        continue;
      if (project.generator.isValid(cls)) continue;

      const from = doc.positionAt(start + match.index);
      const to = doc.positionAt(start + match.index + cls.length);
      const diagnostic = new vscode.Diagnostic(
        new vscode.Range(from, to),
        `Неизвестный класс RenDit Code: "${cls}"`,
        vscode.DiagnosticSeverity.Warning,
      );
      diagnostic.source = "RenDit Code";
      diagnostic.code = "unknown-class";
      result.push(diagnostic);
    }
  }

  if (doc.version === version && !doc.isClosed) {
    state.diagnostics?.set(doc.uri, result);
  }
}

const debounce = (fn, ms) => {
  let timer = null;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
};

// Подписки для проверки классов; собираются в activate().
function registerDiagnostics(context) {
  const onDoc = (doc) => updateDiagnostics(doc);
  const onEdit = debounce((e) => updateDiagnostics(e.document), 400);
  context.subscriptions.push(
    vscode.workspace.onDidOpenTextDocument(onDoc),
    vscode.workspace.onDidSaveTextDocument(onDoc),
    vscode.workspace.onDidChangeTextDocument(onEdit),
  );
}

module.exports = { updateDiagnostics, registerDiagnostics };
