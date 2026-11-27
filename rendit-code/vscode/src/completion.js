// Автодополнение классов и вариантов RenDit Code.
//
// Поведение:
//   • сразу после кавычки (className="") — весь список классов;
//   • вводишь «p» — сверху p-*, pb-*, pt-* … (префикс), ниже — gap-*, opacity-* (подстрока);
//   • вводишь «padding» или «padding-bottom» — классы по CSS-свойству (pb-*), даже если класс забыт;
//   • после пробела (между классами) список не открывается — ждёт первую букву;
//   • после варианта (hover:, md:) — список классов с этим вариантом.
const vscode = require("vscode");
const { projectFor } = require("./project");
const { classStringBefore } = require("./context");
const { cssFor, oneLine } = require("./css");
const { classScore } = require("./score");

const Color = vscode.CompletionItemKind.Color;
const Constant = vscode.CompletionItemKind.Constant;
const Keyword = vscode.CompletionItemKind.Keyword;

// Потолок для поиска по CSS-свойству: «color» даёт много свойств, длинный список не нужен.
const PROPERTY_LIMIT = 60;

function toHex({ r, g, b }) {
  const h = (x) =>
    Math.round(x * 255)
      .toString(16)
      .padStart(2, "0");
  return `#${h(r)}${h(g)}${h(b)}`;
}

// Готовые CompletionItem без префикса: собираются один раз на проект.
function baseItems(project) {
  if (project.items) return project.items;

  const utilities = project.catalog.utilities.map((cls, i) => {
    const color = project.colors.get(cls);
    const item = new vscode.CompletionItem(cls, color ? Color : Constant);
    item.sortText = `1${String(i).padStart(5, "0")}`;
    item.detail = project.descriptions.get(cls) ?? undefined;
    // для цвета VS Code рисует образец, если documentation — строка с цветом
    if (color) item.documentation = toHex(color);
    item.renditClass = cls;
    return item;
  });

  const variants = project.catalog.variants.map((name, i) => {
    const item = new vscode.CompletionItem(`${name}:`, Keyword);
    item.sortText = `0${String(i).padStart(5, "0")}`;
    item.detail = project.variantInfo.get(name) || "вариант RenDit Code";
    item.command = { command: "editor.action.triggerSuggest", title: "" };
    item.renditVariant = name;
    return item;
  });

  // класс → готовый элемент, чтобы быстро искать его по CSS-свойству
  const utilityByClass = new Map(utilities.map((u) => [u.renditClass, u]));

  project.items = { utilities, variants, utilityByClass };
  return project.items;
}

const completionProvider = {
  async provideCompletionItems(doc, pos) {
    const content = classStringBefore(doc, pos);
    if (content === null) return null;

    const project = await projectFor(doc);
    if (!project) return null;

    const token = content.split(/\s+/).pop() ?? "";
    const parts = project.splitTopLevel(token, ":");
    if (!parts) return null;

    // Уже введённая цепочка вариантов: hover:md: → префикс hover:md:
    const currentPart = parts[parts.length - 1] ?? "";
    const important = currentPart.startsWith("!");
    const query = important ? currentPart.slice(1) : currentPart;
    const base = parts.length > 1 ? `${parts.slice(0, -1).join(":")}:` : "";
    const prefix = base + (important ? "!" : "");

    const { utilities, variants, utilityByClass } = baseItems(project);
    const range = new vscode.Range(pos.translate(0, -token.length), pos);

    const make = (item, text, score) => {
      // label = text: чтобы вариант показывался целиком (hover:pb-4, а не pb-4)
      const completion = new vscode.CompletionItem(text, item.kind);
      completion.sortText = `${String(score).padStart(5, "0")}${item.sortText}`;
      completion.detail = item.detail;
      completion.documentation = item.documentation;
      completion.command = item.command;
      completion.insertText = text;
      completion.filterText = text;
      completion.range = range;
      if (item.renditClass) {
        completion.renditClass = text;
        completion.renditProject = project; // для resolve — не заглядываем в активный редактор
      }
      return completion;
    };

    const matches = [];

    if (query === "") {
      // Пусто: сразу после кавычки (content === "") или после варианта (hover:).
      // После пробела (между классами) — не подсказываем.
      if (parts.length === 1 && content !== "") return null;
      for (const utility of utilities) {
        matches.push({
          item: utility,
          text: `${prefix}${utility.renditClass}`,
          score: 0,
        });
      }
    } else {
      for (const variant of variants) {
        const score = classScore(query, variant.renditVariant);
        if (score === -1) continue;
        matches.push({
          item: variant,
          text: `${prefix.replace(/!$/, "")}${variant.renditVariant}:`,
          score,
        });
      }
      for (const utility of utilities) {
        const score = classScore(query, utility.renditClass);
        if (score === -1) continue;
        matches.push({
          item: utility,
          text: `${prefix}${utility.renditClass}`,
          score,
        });
      }

      // Ввод по CSS-свойству: «padding», «padding-bottom» → pb-* — даже если класс забыт.
      // Свойства сортируем по релевантности (точное → префикс → вхождение) и берём
      // по несколько классов из каждого, чтобы pb-* не терялся за p-*.
      if (/^[a-z][a-z-]+$/i.test(query)) {
        const q = query.toLowerCase();
        const props = [...project.propertyIndex.keys()]
          .filter((p) => p.includes(q))
          .sort((a, b) => {
            const rank = (p) => (p === q ? 0 : p.startsWith(q) ? 1 : 2);
            return rank(a) - rank(b) || a.localeCompare(b);
          });
        const perProp = Math.max(3, Math.ceil(PROPERTY_LIMIT / props.length));
        const seen = new Set();
        for (const prop of props) {
          let added = 0;
          for (const cls of project.propertyIndex.get(prop)) {
            if (seen.size >= PROPERTY_LIMIT) break;
            if (seen.has(cls)) continue;
            seen.add(cls);
            const item = utilityByClass.get(cls);
            if (item) {
              matches.push({
                item,
                text: `${prefix}${cls}`,
                score: 1000 + seen.size,
              });
              added++;
            }
            if (added >= perProp) break;
          }
        }
      }
    }

    matches.sort((a, b) => a.score - b.score);
    return new vscode.CompletionList(
      matches.map(({ item, text, score }) => make(item, text, score)),
      false,
    );
  },

  // Полный CSS генерируется только для выбранной подсказки — на лету, без лишней работы в списке.
  async resolveCompletionItem(item) {
    if (!item.renditClass) return item;
    const project = item.renditProject;
    if (!project) return item;

    const css = cssFor(project, item.renditClass);
    if (!css) return item;

    if (item.kind === Color) {
      item.detail = oneLine(css);
    } else {
      item.documentation = new vscode.MarkdownString().appendCodeblock(
        css,
        "css",
      );
    }
    return item;
  },
};

module.exports = { completionProvider };
