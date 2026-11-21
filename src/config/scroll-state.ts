
// Hysteresis thresholds (px)
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
  let isScrolled = root.hasAttribute('data-scrolled');

  function update() {
    const y = Math.max(0, w.scrollY);
    const next = isScrolled ? y > off : y >= on;

    if (next === isScrolled) return;

    isScrolled = next;
    root.toggleAttribute('data-scrolled', next);
  }

  w.addEventListener('scroll', update);
  w.addEventListener('pageshow', update);

  update();
}

export const SCROLL_SCRIPT =
  `(${watchScroll.toString()})(window,${SCROLL_THRESHOLD_ON},${SCROLL_THRESHOLD_OFF});`;
