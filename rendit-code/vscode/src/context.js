// Где мы в файле: внутри строки с классами? И вспомогательные функции по тексту.
const vscode = require("vscode");

// Символы, которые могут входить в токен класса (всё, кроме пробела и кавычек/скобок).
const TOKEN_CHAR = /[^\s"'`{}]/;

const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Функции, в строках которых тоже подсказываются классы: cn("…"), clsx("…"), cva("…")…
function classFunctions() {
  return vscode.workspace
    .getConfiguration("renditCode")
    .get("classFunctions", ["cn", "clsx", "cva", "twMerge", "tv"]);
}

// Текст строки с классами от её начала до позиции (или null, если позиция не в такой строке).
function classStringBefore(doc, pos) {
  const offset = doc.offsetAt(pos);
  const before = doc.getText(
    new vscode.Range(doc.positionAt(Math.max(0, offset - 3000)), pos),
  );

  // className="…  class='…  className={`…
  const attr = /\b(?:className|class)\s*=\s*(?:\{\s*)?(["'`])([^"'`]*)$/i.exec(
    before,
  );
  if (attr) return attr[2];

  // className={["flex", "gap-…"].join(" ")}
  const arrayStart = /\bclassName\s*=\s*\{\s*\[/g;
  let arrayMatch = arrayStart.exec(before);
  let lastArrayMatch;
  while (arrayMatch !== null) {
    lastArrayMatch = arrayMatch;
    arrayMatch = arrayStart.exec(before);
  }
  if (lastArrayMatch) {
    let depth = 1;
    let quote = null;
    let quoteStart = -1;
    let escaped = false;
    const start = lastArrayMatch.index + lastArrayMatch[0].length;

    for (let i = start; i < before.length; i++) {
      const ch = before[i];
      if (quote) {
        if (escaped) {
          escaped = false;
        } else if (ch === "\\") {
          escaped = true;
        } else if (ch === quote) {
          quote = null;
        }
      } else if (ch === "'" || ch === '"' || ch === "`") {
        quote = ch;
        quoteStart = i;
      } else if (ch === "[") {
        depth++;
      } else if (ch === "]" && --depth === 0) {
        break;
      }
    }

    if (quote) return before.slice(quoteStart + 1);
  }

  // cn("a", "b…  — открытый вызов, и курсор внутри строки
  const fns = classFunctions().map(escapeRe).join("|");
  if (!fns) return null;
  const call = new RegExp(`\\b(?:${fns})\\(([^()]*)$`).exec(before);
  if (!call) return null;
  const args = call[1];
  const lastQuote = Math.max(
    args.lastIndexOf('"'),
    args.lastIndexOf("'"),
    args.lastIndexOf("`"),
  );
  if (lastQuote === -1) return null;
  const q = args[lastQuote];
  const count = args.split(q).length - 1;
  return count % 2 === 1 ? args.slice(lastQuote + 1) : null;
}

// Границы класса вокруг позиции в строке (без пробелов и кавычек).
function tokenRangeAt(doc, pos) {
  const line = doc.lineAt(pos.line).text;
  let start = pos.character;
  let end = pos.character;
  while (start > 0 && TOKEN_CHAR.test(line[start - 1])) start--;
  while (end < line.length && TOKEN_CHAR.test(line[end])) end++;
  return new vscode.Range(pos.line, start, pos.line, end);
}

// Все строки классов в документе: { start, value } — для цветов и проверки классов.
function classStrings(text) {
  const out = [];
  const attr = /\b(?:className|class)\s*=\s*(?:\{\s*)?(["'`])([^"'`]*)\1/gi;
  for (const m of text.matchAll(attr))
    out.push({ start: m.index + m[0].indexOf(m[1]) + 1, value: m[2] });

  const fns = classFunctions().map(escapeRe).join("|");
  if (fns) {
    for (const call of text.matchAll(
      new RegExp(`\\b(?:${fns})\\(([^()]*)\\)`, "g"),
    )) {
      const argsStart = call.index + call[0].indexOf("(") + 1;
      for (const s of call[1].matchAll(/(["'`])([^"'`]*)\1/g))
        out.push({ start: argsStart + s.index + 1, value: s[2] });
    }
  }
  return out;
}

module.exports = {
  classFunctions,
  classStringBefore,
  tokenRangeAt,
  classStrings,
};
