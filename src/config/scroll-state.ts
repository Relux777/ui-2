
export const SCROLL_THRESHOLD_ON = 20;
export const SCROLL_THRESHOLD_OFF = 8;

export function watchScroll(
  w: Window,
  on: number,
  off: number,
): void {
  if (!Number.isFinite(on) || !Number.isFinite(off) || off >= on) {
    throw new RangeError('SCROLL_OFF must be less than SCROLL_ON');
  }

  const root = w.document.documentElement;

  let isScrolled = false;
  let initialized = false;

  // До первой синхронизации запрещаем анимации шапки.
  root.setAttribute('data-scroll-init', '');

  function update() {
    const y = Math.max(0, w.scrollY);
    const next = isScrolled ? y > off : y >= on;

    if (next === isScrolled) return;

    isScrolled = next;
    root.toggleAttribute('data-scrolled', next);
  }

  function finishInitialization() {
    if (initialized) return;

    initialized = true;

    w.requestAnimationFrame(() => {
      update();

      w.requestAnimationFrame(() => {
        root.removeAttribute('data-scroll-init');
      });
    });
  }

  function handlePageShow() {
    // Повторная синхронизация при возврате из BFCache
    // и восстановлении страницы браузером.
    initialized = false;
    root.setAttribute('data-scroll-init', '');

    update();
    finishInitialization();
  }

  // Синхронно устанавливаем состояние до появления шапки.
  update();
  finishInitialization();

  w.addEventListener('scroll', update, { passive: true });
  w.addEventListener('pageshow', handlePageShow);
}

export const SCROLL_SCRIPT =
  `(${watchScroll.toString()})(window,${SCROLL_THRESHOLD_ON},${SCROLL_THRESHOLD_OFF});`;
