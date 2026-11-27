// Языки и триггеры автодополнения. Без vscode — чтобы чистая логика тестировалась в Node.
// Файловые языки, в которых ищутся классы RenDit Code.
const LANGUAGES = [
  "typescriptreact",
  "javascriptreact",
  "typescript",
  "javascript",
  "html",
  "mdx",
  "markdown",
  "vue",
  "svelte",
  "astro",
];

// Символы, после которых VS Code вызывает provideCompletionItems.
// " " нужен, чтобы перезапустить подсказки после пробела (между классами); пустой
// префикс при этом не выводит список — см. completion.js.
const TRIGGER_CHARS = ['"', "'", "`", " ", ":", "-", "/"];

const isClassDocument = (doc) =>
  doc.uri.scheme === "file" && LANGUAGES.includes(doc.languageId);

module.exports = { LANGUAGES, TRIGGER_CHARS, isClassDocument };
