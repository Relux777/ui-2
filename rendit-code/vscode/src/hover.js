// При наведении на класс — CSS, который сгенерирует движок.
const vscode = require("vscode");
const { projectFor } = require("./project");
const { classStringBefore, tokenRangeAt } = require("./context");
const { cssFor } = require("./css");

const hoverProvider = {
  async provideHover(doc, pos) {
    const range = tokenRangeAt(doc, pos);
    if (range.isEmpty) return null;
    if (classStringBefore(doc, range.start) === null) return null;

    const project = await projectFor(doc);
    if (!project) return null;

    const cls = doc.getText(range);
    const css = cssFor(project, cls);
    if (!css) return null;

    const md = new vscode.MarkdownString();
    md.appendCodeblock(css, "css");
    md.appendMarkdown(`\n*RenDit Code v${project.config.version}*`);
    return new vscode.Hover(md, range);
  },
};

module.exports = { hoverProvider };
