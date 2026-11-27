// Общее состояние расширения. Без require("vscode") — чтобы чистую логику можно было запускать в Node.
module.exports = {
  // корень проекта (папка с rendit.config.mjs) → Promise<Project | null>
  projects: new Map(),
  // корни проектов, отсортированные от самого глубокого к корню
  roots: [],
  // vscode.OutputChannel и DiagnosticCollection — выставляются в activate()
  log: null,
  diagnostics: null,
};
