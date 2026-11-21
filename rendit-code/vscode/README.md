# RenDit Code IntelliSense

Подсказки классов RenDit Code в VS Code:

- автодополнение классов и вариантов (`hover:`, `md:`, `dark:` …) в `className="…"`, `class="…"`, `cn("…")`;
- CSS класса при наведении;
- образцы цвета рядом с `bg-…`, `text-…`, `border-…`.

Расширение не содержит своих правил — оно загружает движок проекта (`rendit-code/core`), поэтому подсказки
всегда совпадают с тем, что попадёт в CSS.

## Установка

Если расширение доступно в Marketplace, найдите **RenDit Code IntelliSense** в разделе Extensions и нажмите
**Install**.

Для установки из файла `.vsix`:

1. В VS Code откройте Extensions (`Ctrl+Shift+X`).
2. Откройте меню `…` и выберите **Install from VSIX…**.
3. Выберите скачанный `rendit-code.vsix`, затем перезагрузите окно VS Code, если появится запрос.

Также можно установить файл командой:

```sh
code --install-extension rendit-code.vsix
```

Для работы откройте в доверенной папке проект, содержащий `rendit.config.mjs` и каталог `rendit-code/`.
Настраивать манифест или копировать файлы вручную не нужно.
