// Образцы цвета рядом с bg-…, text-…, border-… (значения токенов светлой темы).
const vscode = require("vscode");
const { projectFor } = require("./project");
const { classStrings } = require("./context");

const colorProvider = {
  async provideDocumentColors(doc) {
    if (
      !vscode.workspace
        .getConfiguration("renditCode")
        .get("colorDecorators", true)
    )
      return [];
    const project = await projectFor(doc);
    if (!project) return [];

    const result = [];
    for (const { start, value } of classStrings(doc.getText())) {
      for (const m of value.matchAll(/\S+/g)) {
        const color = project.colorOf(m[0]);
        if (!color) continue;
        const from = doc.positionAt(start + m.index);
        const to = doc.positionAt(start + m.index + m[0].length);
        result.push(
          new vscode.ColorInformation(
            new vscode.Range(from, to),
            new vscode.Color(color.r, color.g, color.b, color.a),
          ),
        );
      }
    }
    return result;
  },

  // Выбор в палитре ничего не меняет: цвет класса задаётся токеном, а не hex.
  provideColorPresentations(_color, { document, range }) {
    return [new vscode.ColorPresentation(document.getText(range))];
  },
};

module.exports = { colorProvider };
