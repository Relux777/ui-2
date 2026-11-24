
"use client";

import { useEffect, useRef } from "react";

export function Spotlight({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const host = ref.current?.parentElement;

    if (
      !host ||
      !window.matchMedia("(hover: hover) and (pointer: fine)").matches
    ) {
      return;
    }

    let frame = 0;
    let clientX = 0;
    let clientY = 0;
    let active = false;

    const paint = () => {
      frame = 0;

      if (!active) return;

      const rect = host.getBoundingClientRect();

      host.style.setProperty("--mx", `${clientX - rect.left}px`);
      host.style.setProperty("--my", `${clientY - rect.top}px`);
    };

    const schedulePaint = () => {
      if (!frame) {
        frame = requestAnimationFrame(paint);
      }
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;

      clientX = event.clientX;
      clientY = event.clientY;

      schedulePaint();
    };

    const onEnter = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;

      active = true;
      onMove(event);
      host.dataset.spot = "";
    };

    const onLeave = () => {
      active = false;
      host.removeAttribute("data-spot");

      if (frame) {
        cancelAnimationFrame(frame);
        frame = 0;
      }
    };

    host.addEventListener("pointerenter", onEnter);
    host.addEventListener("pointermove", onMove);
    host.addEventListener("pointerleave", onLeave);

    return () => {
      host.removeEventListener("pointerenter", onEnter);
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);

      if (frame) {
        cancelAnimationFrame(frame);
      }

      host.removeAttribute("data-spot");
      host.style.removeProperty("--mx");
      host.style.removeProperty("--my");
    };
  }, []);

  return (
    <span
      ref={ref}
      className={`spotlight ${className}`}
      aria-hidden="true"
    />
  );
}
