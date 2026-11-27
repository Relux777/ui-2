// Короткое описание класса для списка подсказок. Чистая функция — без vscode, тестируется в Node.
//
// decls — массив [свойство, значение] из первого правила compiled-класса (generator.compile(cls).rules[0].decls).
// Возвращает строку вида «padding-bottom: 4px» — по ней видно, что pb-4 это нижний отступ.
const cap = (value, max = 48) =>
  value.length > max ? `${value.slice(0, max - 1)}…` : value;

function summarize(decls) {
  if (!Array.isArray(decls) || decls.length === 0) return null;

  // translate-x / translate-y: показываем ось и значение, а не var(--rd-tx) var(--rd-ty)
  const tx = decls.find(([p]) => p === "--rd-tx");
  const ty = decls.find(([p]) => p === "--rd-ty");
  if (tx && !ty) return `translate-x: ${cap(tx[1])}`;
  if (ty && !tx) return `translate-y: ${cap(ty[1])}`;

  // content псевдоэлемента: настоящее значение лежит в --rd-content
  const rd = decls.find(([p]) => p === "--rd-content");
  if (rd) return `content: ${cap(rd[1])}`;

  // обычные свойства (без внутренних --rd-*)
  const real = decls.filter(([p]) => !p.startsWith("--"));
  if (real.length === 0) return null;
  if (real.length === 1) return `${real[0][0]}: ${cap(real[0][1])}`;
  if (real.length === 2)
    return `${real[0][0]}: ${cap(real[0][1])}; ${real[1][0]}: ${cap(real[1][1])}`;
  return `${real[0][0]}: ${cap(real[0][1])}; …`;
}

// Главное CSS-свойство класса: по нему ищется обратная связь «padding-bottom → pb-*».
function propertyOf(decls) {
  if (!Array.isArray(decls) || decls.length === 0) return null;

  const tx = decls.find(([p]) => p === "--rd-tx");
  const ty = decls.find(([p]) => p === "--rd-ty");
  if (tx && !ty) return "translate-x";
  if (ty && !tx) return "translate-y";

  if (decls.some(([p]) => p === "--rd-content")) return "content";

  const real = decls.filter(([p]) => !p.startsWith("--"));
  return real.length > 0 ? real[0][0] : null;
}

module.exports = { summarize, propertyOf };
