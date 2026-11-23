"use client";

import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";

import Desktop from "@/assets/svg/desktop-alt.svg";
import Moon from "@/assets/svg/moon.svg";
import Sun from "@/assets/svg/sun.svg";

const MODES = [
  { id: "light", title: "Светлая", Icon: Sun },
  { id: "dark", title: "Тёмная", Icon: Moon },
  { id: "system", title: "Система", Icon: Desktop },
];

export function ThemeToggleComponent() {
  const { theme = "system", setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [sliderTheme, setSliderTheme] = useState("system");
  const animationFrame = useRef<number | null>(null);

  useEffect(() => {
    if (animationFrame.current !== null) return;

    setMounted(true);
    setSliderTheme(theme);
  }, [theme]);

  useEffect(
    () => () => {
      if (animationFrame.current !== null) {
        window.cancelAnimationFrame(animationFrame.current);
      }
    },
    [],
  );

  function handleSelect(id: string) {
    setHasInteracted(true);
    setTheme(id);

    if (animationFrame.current !== null) {
      window.cancelAnimationFrame(animationFrame.current);
    }

    animationFrame.current = window.requestAnimationFrame(() => {
      animationFrame.current = window.requestAnimationFrame(() => {
        setSliderTheme(id);
        animationFrame.current = null;
      });
    });
  }

  const index = MODES.findIndex((mode) => mode.id === sliderTheme);

  return (
    <fieldset className="relative grid grid-cols-3 m-0 p-3 border-0 br-full bg-foreground/6">
      <legend className="sr-only">Тема</legend>
      <span
        aria-hidden="true"
        className={`absolute top-3 bottom-3 left-3 w-[calc((100%-6px)/3)] br-full bg-surface shadow-2 ${
          mounted ? "opacity-100" : "opacity-0"
        } ${
          hasInteracted
            ? "transition-[translate] duration-500 ease-spring motion-reduce:transition-none"
            : "transition-none"
        }`}
        style={{ translate: `${index * 100}% 0` }}
      />
      {MODES.map(({ id, title, Icon }) => (
        <button
          key={id}
          type="button"
          aria-pressed={mounted && theme === id}
          aria-label={title}
          onClick={() => handleSelect(id)}
          className="relative z-1 flex items-center justify-center gap-6 h-34 px-12 br-full text-foreground-muted aria-pressed:text-foreground"
        >
          <Icon width={18} height={18} aria-hidden="true" />
          {title}
        </button>
      ))}
    </fieldset>
  );
}
