"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { type CSSProperties, type MouseEvent, useRef, useState } from "react";

import BookOpen from "@/assets/svg/book-open.svg";
import BookOpenFilled from "@/assets/svg/filled/book-open.svg";
import HomeFilled from "@/assets/svg/filled/home.svg";
import MenuFilled from "@/assets/svg/filled/menu.svg";
import NewspaperFilled from "@/assets/svg/filled/newspaper.svg";
import Home from "@/assets/svg/home.svg";
import Menu from "@/assets/svg/menu.svg";
import Newspaper from "@/assets/svg/newspaper.svg";

import styles from "./navbar.module.scss";
import { activeIndex, ROUTES } from "./routes";
import { useTabDrag } from "./use-tab-drag";

const ICON_SIZE = 24;
const ICONS = [Home, BookOpen, Newspaper, Menu];
const FILLED = [HomeFilled, BookOpenFilled, NewspaperFilled, MenuFilled];
const ITEMS = ROUTES.map((route, i) => ({
  ...route,
  icon: ICONS[i],
  filled: FILLED[i],
}));

// пункт: и настоящий, и его копия в линзе — одного размера, иначе копия не ляжет ровно под ряд.
// Экран уже 380px — только иконки, пункт 50×50
const ITEM =
  "flex flex-none flex-col items-center justify-center gap-3 w-(--nb-w) h-54 br-full font-11 leading-1.2 [&>span]:max-w-[calc(100%-8px)] [&>span]:truncate max-[380px]:h-50 max-[380px]:[&>span]:hidden";
// цвета мягкие: пункты — 60 % цвета текста, выбранный — secondary чуть приглушённый (85 %)
const LINK = `${ITEM} font-w-500 text-foreground/60 transition-colors hover:text-foreground/85 focus-visible:outline-offset-[-3px]`;

export default function NavBarComponent() {
  const pathname = usePathname();
  const router = useRouter();
  const barRef = useRef<HTMLElement>(null);

  // выбранный пункт меняется сразу, ещё до перехода — линза не ждёт загрузки страницы
  const [active, setActive] = useState(() => activeIndex(pathname));
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setActive(activeIndex(pathname));
  }

  // false — у пункта нет страницы, линза вернётся на выбранный. Повторный выбор того же пункта
  // (после отпускания пальца браузер присылает ещё и click) ничего не делает
  const select = (i: number) => {
    const { href } = ITEMS[i];
    if (!href) return false;
    if (i === active) return true;
    setActive(i);
    router.push(href);
    return true;
  };

  // нажали на выбранный пункт — как таб-бар iOS и Android: с другой страницы раздела
  // — в его начало, уже в начале — плавно наверх страницы
  const reselect = (i: number) => {
    const { href } = ITEMS[i];
    if (!href) return;
    if (pathname !== href) {
      router.push(href);
      return;
    }
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  };

  const { shown, bind, onItemClick } = useTabDrag(barRef, {
    count: ITEMS.length,
    active,
    onSelect: select,
    onReselect: reselect,
  });

  const onLinkClick = (e: MouseEvent, i: number) => {
    // Ctrl/Cmd/Shift + клик — как у обычной ссылки (новая вкладка, окно)
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    onItemClick(i);
  };

  return (
    <>
      {/* место в конце страницы: иначе меню закрывало бы последний блок */}
      <div className="h-[calc(100px+env(safe-area-inset-bottom))] " />
      <div
        className={`${styles.enter} fixed left-1/2 z-30 -translate-x-1/2 [inset-block-end:20px]`}
      >
        <nav
          ref={barRef}
          aria-label="Основное меню"
          {...bind}
          style={{ "--nb-i": shown } as CSSProperties}
          className={`${styles.bar} liquid-glass relative [--nb-w:68px] max-[380px]:[--nb-w:50px] [--nb-pad:5px] p-(--nb-pad) br-full touch-pan-y select-none [[data-weak]_&]:[backdrop-filter:none] [[data-weak]_&]:bg-background/85`}
        >
          <ul className={`${styles.track} flex`}>
            {ITEMS.map((item, i) => {
              const { label, href, icon: Icon } = item;
              return (
                <li key={label}>
                  <Link
                    href={href}
                    data-nav-item
                    // ссылку браузер тащит как файл (drag-and-drop) и отменяет жест линзы
                    draggable={false}
                    onClick={(e) => onLinkClick(e, i)}
                    aria-current={i === active ? "page" : undefined}
                    className={LINK}
                  >
                    <Icon
                      width={ICON_SIZE}
                      height={ICON_SIZE}
                      aria-hidden="true"
                    />
                    <span>{label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* линза: копия ряда под увеличением, для скринридеров её нет */}
          <div
            className={`${styles.lens} absolute z-1 overflow-hidden br-full pointer-events-none`}
            aria-hidden="true"
          >
            <div className={`${styles.copy} absolute top-0 left-0 flex h-full`}>
              {ITEMS.map(({ label, filled: Icon }, i) => (
                <span
                  key={label}
                  data-on={i === shown || undefined}
                  className={`${ITEM} font-w-600 text-secondary/85`}
                >
                  <Icon width={ICON_SIZE} height={ICON_SIZE} />
                  <span>{label}</span>
                </span>
              ))}
            </div>
          </div>
        </nav>
      </div>
    </>
  );
}
