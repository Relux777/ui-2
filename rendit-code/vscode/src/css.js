// CSS класса — для подсказки при наведении и для деталей в списке. Чистые функции: vscode здесь не нужен.
const state = require("./state");

// CSS одного класса без шапки файла и обёртки @layer.
function cssFor(project, cls) {
  if (!project.generator.isValid(cls)) return null;
  let css;
  try {
    ({ css } = project.generator.generate([cls]));
  } catch (error) {
    state.log?.appendLine(
      `[${project.root}] ✖ не удалось сгенерировать CSS для "${cls}": ${error?.stack ?? error}`,
    );
    return null;
  }
  const lines = css
    .split("\n")
    .filter((l) => !l.startsWith("/*!") && !l.startsWith("@property"));
  const start = lines.findIndex((l) => l.startsWith("@layer"));
  const body = lines.slice(start + 1, lines.lastIndexOf("}"));
  return body
    .map((l) => l.replace(/^ {2}/, ""))
    .join("\n")
    .trim();
}

// Одна строка из правил — для деталей в списке подсказок.
const oneLine = (css) =>
  css
    .split("\n")
    .filter((l) => /^\s+[\w-]+:/.test(l))
    .map((l) => l.trim())
    .join(" ");

module.exports = { cssFor, oneLine };
