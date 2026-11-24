
"use client";

import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";

import Desktop from "@/assets/svg/desktop-alt.svg";
import Moon from "@/assets/svg/moon.svg";
import Sun from "@/assets/svg/sun.svg";

import { THEME_KEY } from "@/config/theme";

const MODES = [
  { id: "light", title: "Светлая", Icon: Sun },
  { id: "dark", title: "Тёмная", Icon: Moon },
  { id: "system", title: "Система", Icon: Desktop },
] as const;

type ModeId = (typeof MODES)[number]["id"];

const DURATION = 500;
const EASING = "cubic-bezier(0.34, 1.56, 0.64, 1)";

function isMode(value: string | null | undefined): value is ModeId {
  return MODES.some((mode) => mode.id === value);
}

function getStoredMode(fallback: ModeId): ModeId {
  try {
    const saved = localStorage.getItem(THEME_KEY);
    return isMode(saved) ? saved : fallback;
  } catch {
    return fallback;
  }
}

export function ThemeToggleComponent() {
  const { theme = "system", setTheme } = useTheme();

  const [mounted, setMounted] = useState(false);
  const [mode, setMode] = useState<ModeId>("system");

  const thumbRef = useRef<HTMLSpanElement>(null);
  const modeRef = useRef<ModeId>("system");

  // Первоначальная и последующая синхронизация темы.
  useEffect(() => {
    if (!mounted) {
      const initialMode = getStoredMode(
        isMode(theme) ? theme : "system",
      );

      modeRef.current = initialMode;
      setMode(initialMode);
      setMounted(true);

      return;
    }

    // Внешнее изменение темы — без анимации ползунка.
    if (!isMode(theme) || theme === modeRef.current) return;

    const thumb = thumbRef.current;

    if (thumb) {
      for (const animation of thumb.getAnimations()) {
        animation.cancel();
      }
    }

    modeRef.current = theme;
    setMode(theme);
  }, [theme, mounted]);

  function selectMode(id: ModeId) {
    if (!mounted || id === modeRef.current) return;

    const thumb = thumbRef.current;

    if (thumb) {
      const parent = thumb.parentElement;

      if (parent) {
        // Текущая визуальная позиция в px.
        const from =
          thumb.getBoundingClientRect().left -
          parent.getBoundingClientRect().left -
          parent.clientLeft -
          thumb.offsetLeft;

        // Прерываем предыдущую анимацию.
        for (const animation of thumb.getAnimations()) {
          animation.cancel();
        }

        const prefersReducedMotion = window.matchMedia(
          "(prefers-reduced-motion: reduce)",
        ).matches;

        if (!prefersReducedMotion) {
          const index = MODES.findIndex((item) => item.id === id);
          const to = index * thumb.offsetWidth;

          thumb.animate(
            [
              { translate: `${from}px 0px` },
              { translate: `${to}px 0px` },
            ],
            {
              duration: DURATION,
              easing: EASING,
            },
          );
        }
      }
    }

    modeRef.current = id;

    setMode(id);
    setTheme(id);
  }

  const index = MODES.findIndex((item) => item.id === mode);

  return (
    <fieldset className="relative grid grid-cols-3 m-0 p-3 border-0 br-full w-full bg-foreground/6">
      <legend className="sr-only">Тема оформления</legend>

      <span
        ref={thumbRef}
        aria-hidden="true"
        className={[
          "absolute top-3 bottom-3 left-3",
          "w-[calc((100%-6px)/3)]",
          "br-full bg-surface shadow-2",
          "transition-[opacity] duration-300 ease-out",
          "motion-reduce:transition-none",
          mounted ? "opacity-100" : "opacity-0",
        ].join(" ")}
        style={{ translate: `${index * 100}% 0` }}
      />

      {MODES.map(({ id, title, Icon }) => (
        <button
          key={id}
          type="button"
          aria-label={title}
          aria-pressed={mounted && mode === id}
          onClick={() => selectMode(id)}
          className={[
            "relative z-1",
            "flex items-center justify-center",
            "gap-6 h-34 px-12",
            "br-full",
            "text-foreground-muted",
            "aria-pressed:text-foreground",
          ].join(" ")}
        >
          <Icon width={18} height={18} aria-hidden="true" />
        </button>
      ))}
    </fieldset>
  );
}
