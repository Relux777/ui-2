
const INTERACTION_EVENTS = [
  'pointerdown',
  'keydown',
  'popstate',
] as const;

// Отключает анимацию при первой загрузке.
export function firstLoadGate(w: Window): void {
  const doc = w.document;
  const root = doc.documentElement;

  let interacted = false;
  let finished = false;

  root.setAttribute('data-first-load', '');

  function finish() {
    if (finished || !interacted || doc.readyState === 'loading') return;

    finished = true;
    root.removeAttribute('data-first-load');

    doc.removeEventListener('DOMContentLoaded', finish);

    for (const type of INTERACTION_EVENTS) {
      w.removeEventListener(type, handleInteraction, true);
    }
  }

  function handleInteraction() {
    interacted = true;
    finish();
  }

  // Если пользователь взаимодействовал до завершения HTML,
  // снимаем атрибут сразу после разбора документа.
  doc.addEventListener('DOMContentLoaded', finish, { once: true });

  for (const type of INTERACTION_EVENTS) {
    w.addEventListener(type, handleInteraction, true);
  }
}

export const ROUTE_ENTER_SCRIPT =
  `(${firstLoadGate.toString()})(window);`;
