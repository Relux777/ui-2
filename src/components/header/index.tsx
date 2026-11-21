
import Link from 'next/link';

import GitHubSVG from '@/assets/svg/github.svg';
import SearchComponent from './SearchComponent';

export default function HeaderComponent() {
  return (
    <header className="sticky z-30 top-[calc(5px+env(safe-area-inset-top))] mt-[env(safe-area-inset-top)]">
      <nav className="container grid grid-cols-[1fr_auto_1fr] items-center h-48">

        <ul className="flex items-center gap-10 justify-self-start">
          <li>1</li>
        </ul>

        <div className="flex col-start-3 justify-self-end items-center gap-10">
          <div className="flex items-center justify-between gap-5 p-4 h-44 br-full transition-[background-color,backdrop-filter,box-shadow] duration-300 ease-out max-sm:max-w-248 overflow-hidden [:is([data-scrolled],[data-search])_&]:shadow-glass [:is([data-scrolled],[data-search])_&]:bg-background/50 [:is([data-scrolled],[data-search])_&]:backdrop-blur-12 [[data-search]_&]:flex-none ">
            <SearchComponent />
            <Link
              href="/"
              className="grid place-items-center transition-[width,scale,padding,opacity] duration-300 ease-out hover:opacity-85 px-16 h-36 bg-primary text-primary-foreground br-full font-14 font-w-500 active:scale-95"
            >
              Начать
            </Link>
          </div>

          <a
            href="https://github.com/Relux777/ui"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub проекта"
            className="grid place-items-center  transition-[background-color,opacity,scale,backdrop-filter, box-shadow]  duration-250 [[data-scrolled]_&]:backdrop-blur-4 [[data-scrolled]_&]:shadow-9 [[data-scrolled]_&]:bg-background/50 size-44 opacity-80 hover:opacity-100 br-full text-primary active:bg-surface-muted/50 active:scale-92 [[data-search]_&]:w-0"
          >
            <GitHubSVG width={24} height={24} aria-hidden="true" />
          </a>

        </div>
      </nav>
    </header>
  );
}
