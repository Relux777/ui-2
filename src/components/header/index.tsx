
import Link from 'next/link';

import GitHubSVG from '@/assets/svg/github.svg';
import LogoSVG from '@/assets/svg/logo.svg';

import SearchComponent from './SearchComponent';

export default function HeaderComponent() {
  return (
    <header className="sticky z-30 top-[calc(5px+env(safe-area-inset-top))] mt-[env(safe-area-inset-top)]">
      <nav className="container grid grid-cols-[1fr_auto_1fr] items-center h-48">
        <ul className="flex items-center justify-self-start gap-10">
          <li>
            <Link
              href="/"
              className={[
                'flex items-center justify-between',
                'br-100 h-44 w-131',
                'overflow-hidden', 

                'transition-[width,background-color,backdrop-filter,box-shadow,scale]',
                'duration-300 ease-out',
                
                'hover:opacity-85 active:scale-95',

                '[[data-scrolled]_&]:backdrop-blur-4',
                '[[data-scrolled]_&]:shadow-9',
                '[[data-scrolled]_&]:bg-background/50',
                '[[data-scrolled]_&]:w-44',

                'max-sm:w-44',

              ].join(' ')}
            >
              <div 
                className={[
                  'grid place-items-center shrink-0',
                  'w-44 h-44',
                  'overflow-hidden ', 
                ].join(' ')}>
                <LogoSVG
                  width={27}
                  height={27}
                  aria-hidden="true"
                />
              </div>
              <h2 className='truncate max-sm:hidden'>RenDit <span className='text-violet-500'>UI</span></h2>
            </Link>
            </li>
          <li>
            <Link
              href="/"
              className={[
                'grid place-items-center',
                'w-44 h-24 br-36 font-12',
                'overflow-hidden bg-violet-500',
                
                'transition-[opacity,scale, width] ',
                'duration-300 ease-out',

                'hover:opacity-85 active:scale-95',

                '[:is([data-scrolled],[data-search])_&]:max-sm:w-0',
                '[:is([data-scrolled],[data-search])_&]:max-sm:h-0',

              ].join(' ')}
            >
              <span>v0.0.1</span>
            </Link>
          </li>
        </ul>
            
        <div className={[
            'flex items-center justify-self-end col-start-3',
            'gap-10',

            'transition-[gap]',
            'duration-300 ease-out',

            '[[data-search]_&]:max-sm:gap-0',
          ].join(' ')}>
          <div
            className={[
              'flex items-center justify-between',
              'gap-5 p-4 h-44 br-full w-124',
              'overflow-hidden',
              
              'transition-[background-color,backdrop-filter,box-shadow,width]',
              'duration-300 ease-out',

              '[[data-search]_&]:w-248',  
              '[[data-search]_&]:flex-none',

              '[:is([data-scrolled],[data-search])_&]:shadow-glass',
              '[:is([data-scrolled],[data-search])_&]:bg-background/50',
              '[:is([data-scrolled],[data-search])_&]:backdrop-blur-12',
              
            ].join(' ')}
          >
            <SearchComponent />

            <Link
              href="/"
              className={[
                'grid place-items-center shrink-0',
                'px-16 h-36 font-14 font-w-500',
                'br-full bg-primary text-primary-foreground',

                'transition-[opacity,scale] ',
                'duration-300 ease-out',

                'hover:opacity-85 active:scale-95',
              ].join(' ')}
            >
              Начать
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

                'transition-[width,opacity,visibility,background-color,backdrop-filter,box-shadow,scale]',
                'duration-250 ease-out',

                'hover:opacity-100',
                'active:bg-surface-muted/50 active:scale-92',

                '[[data-scrolled]_&]:backdrop-blur-4',
                '[[data-scrolled]_&]:shadow-9',
                '[[data-scrolled]_&]:bg-background/50',

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
