// Сборка и установка расширения RenDit Code IntelliSense:
//   node rendit-code/vscode/install.mjs
//
// Скрипт сам проверяет окружение:
//   • Node.js 20+;
//   • файлы расширения;
//   • CLI VS Code (`code`);
//   • @vscode/vsce — если его нет локально, запускает через npx
//     (пакет скачается в кэш npm, package.json не меняется).
// Затем упаковывает папку в .vsix и устанавливает расширение.

import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const extDir = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(extDir, "../..");
const vsix = path.join(extDir, "rendit-code.vsix");
const isWindows = process.platform === "win32";

// ^ в командной строке Windows — спецсимвол, поэтому без него.
const VSCE_SPEC = "@vscode/vsce@3";

const quote = (value) =>
  isWindows
    ? `"${value.replaceAll('"', '""')}"`
    : `'${value.replaceAll("'", "'\\''")}'`;

function run(command, { cwd = rootDir, capture = false } = {}) {
  return execSync(command, {
    cwd,
    stdio: capture ? ["ignore", "pipe", "pipe"] : "inherit",
    ...(capture ? { encoding: "utf8" } : {}),
  });
}

function canRun(command) {
  try {
    run(command, { capture: true });
    return true;
  } catch {
    return false;
  }
}

function fail(message) {
  console.error(`\n✖ ${message}\n`);
  process.exit(1);
}

function step(message) {
  console.log(`\n• ${message}`);
}

// ── 1. Node.js ───────────────────────────────────────────────────────────────

const nodeMajor = Number(process.versions.node.split(".")[0]);
if (nodeMajor < 20) {
  fail(`Нужен Node.js 20 или новее. Сейчас: ${process.version}.`);
}

// ── 2. Файлы расширения ─────────────────────────────────────────────────────

for (const file of ["package.json", "extension.js"]) {
  const full = path.join(extDir, file);
  if (!fs.existsSync(full)) {
    fail(
      `Не найден ${path.relative(rootDir, full)}. ` +
        "Запустите скрипт из папки rendit-code/vscode проекта RenDit UI.",
    );
  }
}

if (!fs.existsSync(path.join(rootDir, "package.json"))) {
  fail("Не найден package.json в корне проекта.");
}

if (!fs.existsSync(path.join(rootDir, "rendit.config.mjs"))) {
  console.warn(
    "\n⚠ rendit.config.mjs не найден в корне проекта. " +
      "Расширение установится, но подсказки не включатся, пока конфиг не появится.",
  );
}

// ── 3. CLI VS Code ──────────────────────────────────────────────────────────

function findCodeCli() {
  if (canRun("code --version")) return "code";

  const candidates = [];

  if (isWindows) {
    if (process.env.LOCALAPPDATA) {
      candidates.push(
        path.join(
          process.env.LOCALAPPDATA,
          "Programs",
          "Microsoft VS Code",
          "bin",
          "code.cmd",
        ),
      );
    }
    if (process.env.ProgramFiles) {
      candidates.push(
        path.join(
          process.env.ProgramFiles,
          "Microsoft VS Code",
          "bin",
          "code.cmd",
        ),
      );
    }
    if (process.env["ProgramFiles(x86)"]) {
      candidates.push(
        path.join(
          process.env["ProgramFiles(x86)"],
          "Microsoft VS Code",
          "bin",
          "code.cmd",
        ),
      );
    }
  } else if (process.platform === "darwin") {
    candidates.push(
      "/Applications/Visual Studio Code.app/Contents/Resources/app/bin/code",
    );
  }

  for (const candidate of candidates) {
    if (fs.existsSync(candidate) && canRun(`${quote(candidate)} --version`)) {
      return quote(candidate);
    }
  }

  return null;
}

const codeCli = findCodeCli();
if (!codeCli) {
  fail(
    "CLI VS Code (`code`) не найден.\n" +
      "  Откройте VS Code → Ctrl+Shift+P → «Shell Command: Install 'code' command in PATH»\n" +
      "  и повторите запуск. Если VS Code не установлен: https://code.visualstudio.com/",
  );
}

// ── 4. @vscode/vsce ─────────────────────────────────────────────────────────

function findVsce() {
  // Прямой запуск JS-файла через node надёжнее, чем .cmd/.bin на Windows.
  const direct = path.join(rootDir, "node_modules", "@vscode", "vsce", "vsce");
  if (fs.existsSync(direct)) {
    return `${quote(process.execPath)} ${quote(direct)}`;
  }

  const bin = path.join(
    rootDir,
    "node_modules",
    ".bin",
    isWindows ? "vsce.cmd" : "vsce",
  );
  if (fs.existsSync(bin)) return quote(bin);

  return null;
}

let vsce = findVsce();
let usedNpx = false;

if (vsce && !canRun(`${vsce} --version`)) {
  console.warn("\n⚠ Установленный @vscode/vsce не запускается. Использую npx…");
  vsce = null;
}

if (!vsce) {
  usedNpx = true;

  if (!canRun("npx --version")) {
    fail(
      "npx не найден. Установите Node.js/npm или поставьте @vscode/vsce вручную:\n" +
        "    npm i -D @vscode/vsce",
    );
  }

  step(
    "@vscode/vsce не найден — скачиваю через npx " +
      "(один раз, дальше пакет берётся из кэша npm)…",
  );
  vsce = `npx --yes ${VSCE_SPEC}`;
}

// ── 5. Сборка .vsix ─────────────────────────────────────────────────────────

step("Собираю расширение…");
fs.rmSync(vsix, { force: true });

try {
  run(
    `${vsce} package --allow-missing-repository --skip-license --out ${quote(vsix)}`,
    { cwd: extDir },
  );
} catch {
  fail(
    "Не удалось собрать .vsix. Посмотрите ошибку выше.\n" +
      "  Если ошибка связана с @vscode/vsce, установите его вручную:\n" +
      "    npm i -D @vscode/vsce",
  );
}

if (!fs.existsSync(vsix)) {
  fail("vsce завершился без ошибки, но файл .vsix не создан.");
}

// ── 6. Установка в VS Code ──────────────────────────────────────────────────

step("Устанавливаю расширение в VS Code…");

try {
  run(`${codeCli} --install-extension ${quote(vsix)} --force`);
} catch {
  fail(
    "Не удалось установить расширение. Проверьте, что VS Code установлен, " +
      "а CLI `code` доступен в PATH.",
  );
}

console.log("\n✓ RenDit Code IntelliSense установлен.");
console.log("  В VS Code: Ctrl+Shift+P → Developer: Reload Window");

if (usedNpx) {
  console.log(
    "  Подсказка: чтобы не зависеть от кэша npx — поставьте @vscode/vsce в devDependencies.\n",
  );
} else {
  console.log("");
}
