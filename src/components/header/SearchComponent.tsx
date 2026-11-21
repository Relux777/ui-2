
'use client';

import { useEffect, useId, useRef, useState } from 'react';
import SearchSVG from '@/assets/svg/search.svg';
import XSVG from '@/assets/svg/x.svg';

export default function SearchComponent() {
  const [isOpen, setIsOpen] = useState(false);

  const formRef = useRef<HTMLFormElement>(null);
  const searchRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const contentId = useId();

  useEffect(() => {
    const html = document.documentElement;

    if (!isOpen) {
      html.removeAttribute('data-search');
      return;
    }

    html.setAttribute('data-search', '');
    inputRef.current?.focus({ preventScroll: true });

    const handlePointerDown = (event: PointerEvent) => {
      if (
        event.target instanceof Node &&
        !formRef.current?.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape' || event.defaultPrevented) return;

      event.preventDefault();
      setIsOpen(false);
      searchRef.current?.focus({ preventScroll: true });
    };

    document.addEventListener('pointerdown', handlePointerDown, true);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      html.removeAttribute('data-search');
      document.removeEventListener('pointerdown', handlePointerDown, true);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const closeSearch = () => {
    setIsOpen(false);
    searchRef.current?.focus({ preventScroll: true });
  };

  return (
    <form
      ref={formRef}
      role="search"
      aria-label="Поиск по сайту"
      onSubmit={(event) => event.preventDefault()}
      className={`flex items-center shrink-0 br-full h-36 overflow-hidden transition-[width,background-color] duration-300 ease-out motion-reduce:transition-none ${isOpen ? 'w-240 max-sm:w-240 bg-foreground/5' : 'w-36 bg-transparent'}`}
    >
      <button
        ref={searchRef}
        type="button"
        tabIndex={0}
        aria-label="Поиск"
        aria-expanded={isOpen}
        aria-controls={contentId}
        onClick={() => {
          if (isOpen) {
            inputRef.current?.focus({ preventScroll: true });
          } else {
            setIsOpen(true);
          }
        }}
        className="grid place-items-center shrink-0 size-36 br-full text-foreground opacity-80 transition-[opacity,background-color,scale] duration-200 ease-out hover:opacity-100 active:scale-92 focus-visible:outline-2 focus-visible:outline-blue-500 focus-visible:outline-offset-[-3px]"
      >
        <SearchSVG width={20} height={20} aria-hidden="true" />
      </button>

      <div
        id={contentId}
        inert={!isOpen}
        className={`flex flex-1 min-w-0 h-full items-center overflow-hidden transition-opacity duration-200 ${isOpen ? 'visible opacity-100 pointer-events-auto' : 'invisible opacity-0 pointer-events-none'}`}
      >
        <input
          ref={inputRef}
          tabIndex={isOpen ? 0 : -1}
          id={`${contentId}-input`}
          type="search"
          name="q"
          placeholder="Поиск..."
          aria-label="Поисковый запрос"
          className="flex-1 min-w-0 w-full h-36 outline-none bg-transparent font-14 caret-blue-500 touch:text-[16px] [&::-webkit-search-cancel-button]:hidden placeholder:text-foreground-subtle"
        />

        <button
          type="button"
          tabIndex={isOpen ? 0 : -1}
          aria-label="Закрыть поиск"
          onClick={closeSearch}
          className="grid place-items-center shrink-0 size-28 shadow-1 mr-4 br-full text-foreground/70 transition-[color,scale] duration-200 ease-out hover:text-foreground active:scale-92 focus-visible:outline-2 focus-visible:outline-blue-500 focus-visible:outline-offset-[-3px]"
        >
          <XSVG width={16} height={16} aria-hidden="true" />
        </button>
      </div>
    </form>
  );
}
