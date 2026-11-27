// Mock модуля "vscode" для запуска расширения в Node (без VS Code). CommonJS.
// Используется тестами: перехватывает провайдеров и отдаёт настраиваемые findFiles/настройки.

class Position {
  constructor(line, character) {
    this.line = line;
    this.character = character;
  }
  translate(dl, dc) {
    return new Position(this.line + dl, this.character + dc);
  }
  isEqual(o) {
    return o.line === this.line && o.character === this.character;
  }
}

class Range {
  constructor(start, end) {
    this.start = start;
    this.end = end;
  }
  get isEmpty() {
    return this.start.isEqual(this.end);
  }
}

class CompletionItem {
  constructor(label, kind) {
    this.label = label;
    this.kind = kind;
  }
}

class CompletionList {
  constructor(items, incomplete) {
    this.items = items;
    this.isIncomplete = incomplete;
  }
}

class MarkdownString {
  constructor(value) {
    this.value = value ?? "";
  }
  appendCodeblock(code, lang) {
    this.value += `\n\`\`\`${lang}\n${code}\n\`\`\``;
    return this;
  }
  appendMarkdown(md) {
    this.value += md;
    return this;
  }
}

class Hover {
  constructor(contents, range) {
    this.contents = contents;
    this.range = range;
  }
}

class Color {
  constructor(r, g, b, a) {
    this.red = r;
    this.green = g;
    this.blue = b;
    this.alpha = a;
  }
}

class ColorInformation {
  constructor(range, color) {
    this.range = range;
    this.color = color;
  }
}

class ColorPresentation {
  constructor(label) {
    this.label = label;
  }
}

class Diagnostic {
  constructor(range, message, severity) {
    this.range = range;
    this.message = message;
    this.severity = severity;
  }
}

const disposable = () => ({ dispose() {} });
const noop = () => {};

function createMockVscode() {
  const providers = { completion: null, hover: null, color: null };
  let findRootsResult = [];
  const settings = {
    classFunctions: ["cn", "clsx", "cva", "twMerge", "tv"],
    colorDecorators: true,
    validateClasses: false,
  };

  return {
    Position,
    Range,
    CompletionItem,
    CompletionList,
    MarkdownString,
    Hover,
    Color,
    ColorInformation,
    ColorPresentation,
    Diagnostic,
    CompletionItemKind: { Color: 16, Constant: 14, Keyword: 17, Value: 12 },
    DiagnosticSeverity: { Warning: 2 },

    window: {
      createOutputChannel: () => ({
        appendLine: noop,
        show: noop,
        dispose: noop,
      }),
      setStatusBarMessage: noop,
      activeTextEditor: undefined,
    },

    languages: {
      createDiagnosticCollection: () => ({
        set: noop,
        delete: noop,
        clear: noop,
        dispose: noop,
      }),
      registerCompletionItemProvider: (_sel, provider) => {
        providers.completion = provider;
        return disposable();
      },
      registerHoverProvider: (_sel, provider) => {
        providers.hover = provider;
        return disposable();
      },
      registerColorProvider: (_sel, provider) => {
        providers.color = provider;
        return disposable();
      },
    },

    commands: { registerCommand: () => disposable() },

    workspace: {
      findFiles: async () => findRootsResult,
      createFileSystemWatcher: () => ({
        onDidChange: () => disposable(),
        onDidCreate: () => disposable(),
        onDidDelete: () => disposable(),
        dispose: noop,
      }),
      onDidOpenTextDocument: () => disposable(),
      onDidSaveTextDocument: () => disposable(),
      onDidChangeTextDocument: () => disposable(),
      getConfiguration: () => ({
        get: (_key, dflt) => settings[_key.replace(/^.*\./, "")] ?? dflt,
      }),
    },

    __setFindRoots(files) {
      findRootsResult = files;
    },
    __setSetting(name, value) {
      settings[name] = value;
    },
    __getProviders() {
      return providers;
    },
  };
}

module.exports = { createMockVscode };
