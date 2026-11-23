
import Link from 'next/link';

import GitHubSVG from '@/assets/svg/github.svg';
import LogoSVG from '@/assets/svg/logo.svg';
import ChevronRightSVG from '@/assets/svg/chevron-right.svg';

import SearchComponent from './SearchComponent';

export default function HeaderComponent() {
  return (
    <header
      className={[
        'sticky z-30',
        'top-[calc(0px+env(safe-area-inset-top))]',
        'py-4',

        'before:fixed before:inset-x-0 before:top-0',
        'before:h-90 before:-z-2',
        'before:pointer-events-none',
        'before:bg-[linear-gradient(to_bottom,var(--background)_0%,color-mix(in_oklab,var(--background)_60%,transparent)_50%,transparent_100%)]',
        'before:opacity-0',
        'before:transition-opacity before:duration-200',

        '[[data-scroll-init]_&]:before:transition-none',

        '[[data-scrolled]_&]:before:opacity-100',

        'motion-reduce:before:transition-none',
      ].join(' ')}
    >
      <nav className="container grid grid-cols-[1fr_auto_1fr] items-center h-48">
        <ul className="flex items-center justify-self-start gap-10">
          <li>
            <Link
              href="/"
              className={[
                'flex items-center justify-between',
                'br-100 h-44 w-131 max-sm:w-44',
                'overflow-hidden',

                'transition-[background-color,opacity,scale, width]',
                'duration-200 ease-out',
                'motion-reduce:transition-none',
                '[[data-scroll-init]_&]:transition-none',

                'hover:opacity-85 active:scale-95',

                '[[data-scrolled]_&]:shadow-9',
                '[[data-scrolled]_&]:backdrop-blur-4',
                '[[data-scrolled]_&]:bg-background/50',
                '[[data-scrolled]_&]:w-44',
              ].join(' ')}
            >
              <div className="grid place-items-center shrink-0 w-44 h-44 overflow-hidden">
                <LogoSVG
                  width={27}
                  height={27}
                  aria-hidden="true"
                />
              </div>

              <h2 className="truncate max-sm:hidden">
                RenDit <span className="text-violet-500">UI</span>
              </h2>
            </Link>
          </li>

          <li>
            <Link
              href="/"
              className={[
                'grid place-items-center',
                'w-44 h-24 br-36 font-12',
                'overflow-hidden bg-violet-500 text-white',

                'transition-[opacity,scale, width, heigth]',
                'duration-200 ease-out',
                'motion-reduce:transition-none',
                '[[data-scroll-init]_&]:transition-none',

                'hover:opacity-85 active:scale-95',

                '[:is([data-scrolled],[data-search])_&]:max-sm:w-0',
                '[:is([data-scrolled],[data-search])_&]:max-sm:h-0',
              ].join(' ')}
            >
              <span>v0.0.1</span>
            </Link>
          </li>
        </ul>

        <div
          className={[
            'flex items-center justify-self-end col-start-3',
            'gap-10',

            'transition-[gap]',
            'duration-200 ease-out',
            'motion-reduce:transition-none',
            '[[data-scroll-init]_&]:transition-none',

            '[[data-search]_&]:max-sm:gap-0',
          ].join(' ')}
        >
          <div
            className={[
              'flex items-center justify-between',
              'gap-5 p-4 h-44 br-full w-113',
              'overflow-hidden',

              'transition-[width,background-color]',
              'duration-200 ease-out',
              'motion-reduce:transition-none',
              '[[data-scroll-init]_&]:transition-none',

              '[[data-scrolled]_&]:w-85',
              '[[data-search]_&]:w-248',
              '[[data-search]_&]:flex-none',

              '[:is([data-scrolled],[data-search])_&]:shadow-glass',
              '[:is([data-scrolled],[data-search])_&]:backdrop-blur-4',
              '[:is([data-scrolled],[data-search])_&]:bg-background/50',
            ].join(' ')}
          >
            <SearchComponent />

            <Link
              href="/"
              className={[
                'flex items-center justify-between shrink-0',
                'w-64 h-36 font-14 font-w-500',
                'br-full bg-primary text-primary-foreground',

                'transition-[opacity,scale,width]',
                'duration-200 ease-out',
                'motion-reduce:transition-none',
                '[[data-scroll-init]_&]:transition-none',

                'hover:opacity-85 active:scale-95',
                '[[data-scrolled]_&]:w-36',
              ].join(' ')}
              >
              <div 
                className={[
                  'grid place-items-center shrink-0',
                  'w-64',
                  'overflow-hidden',

                  'transition-[width]',
                  'duration-200 ease-out',
                  'motion-reduce:transition-none',
                  '[[data-scroll-init]_&]:transition-none',

                  '[[data-scrolled]_&]:w-0',
                ].join(' ')}
                >
                Начать
              </div>
              <div 
                className={[
                  'grid place-items-center ',
                  'w-36',
                ].join(' ')}
                >
                  <ChevronRightSVG
                    width={20}
                    height={20}
                    aria-hidden="true"
                />
              </div>
            </Link>
          </div>

          <a
            href="https://github.com/Relux777/ui"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub проекта"
            className={[
              'grid place-items-center shrink-0',
              'w-44 h-44 br-full',
              'text-primary opacity-80 overflow-hidden',

              'transition-[width,opacity,scale]',
              'duration-200 ease-out',
              'motion-reduce:transition-none',
              '[[data-scroll-init]_&]:transition-none',

              'hover:opacity-100',
              'active:bg-surface-muted/50 active:scale-92',

              '[[data-scrolled]_&]:shadow-9',
              '[[data-scrolled]_&]:bg-background/50',
              '[[data-scrolled]_&]:backdrop-blur-4',

              '[[data-search]_&]:max-sm:w-0',
              '[[data-search]_&]:max-sm:opacity-0',
              '[[data-search]_&]:max-sm:invisible',
              '[[data-search]_&]:pointer-events-none',
            ].join(' ')}
          >
            <GitHubSVG
              width={24}
              height={24}
              aria-hidden="true"
            />
          </a>
        </div>
      </nav>
    </header>
  );
}
