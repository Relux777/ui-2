// Ранжирование совпадений для подсказок. Чистая функция — без vscode, тестируется в Node.
//
// Возвращает число «чем меньше, тем выше в списке», либо -1 если не совпало:
//   0            — класс начинается с запроса (p → p-4, pb-4 …);
//   1..N         — запрос есть подстрокой (раньше в имени — лучше);
//   100+gaps     — символы запроса идут по порядку с пропусками (подпоследовательность);
//   -1           — не совпало.
//
// Так «p» ставит p-* выше gap-*/opacity-*, а «pb» — только pb-* (без шума от px-, pe- …).

function classScore(query, candidate) {
  if (!query) return 0;
  const q = query.toLowerCase();
  const c = candidate.toLowerCase();

  if (c.startsWith(q)) return 0;

  const idx = c.indexOf(q);
  if (idx !== -1) return 1 + idx;

  let previous = -1;
  let gaps = 0;
  for (const ch of q) {
    const i = c.indexOf(ch, previous + 1);
    if (i === -1) return -1;
    gaps += i - previous - 1;
    previous = i;
  }
  return 100 + gaps;
}

module.exports = { classScore };
