
import Link from "next/link";

import ChevronRightSVG from '@/assets/svg/chevron-right.svg';
import TachometerSVG from '@/assets/svg/tachometer-alt.svg';
import { Spotlight } from "@/components/ui/Spotlight"; 
import { ThemeToggleComponent } from "@/components/ui/ThemeToggle";
import OTPInput from "@/components/ui/OTPinput";

export default function Home() {
  return (
    <main>
      <section>
        <div className="container pt-88 pb-100 max-sm:pt-40 text-center">
              <div className={[
                'sticky',
                'flex justify-center place-items-center',
                'top-15 z-30 br-36 font-12 h-24 px-10 gap-7',
                'shadow-glass backdrop-blur-4',
                'm-auto w-fit',

                'max-sm:relative',
                'max-sm:z-10',
                'max-sm:bg-background/50'
              ].join(' ')}>
              <span className="w-5 h-5 bg-violet-500 br-full"></span>
              <span>RenDit UI — свой движок классов</span>
            </div>
            <h1 className="font-42/50 font-w-400 my-20">Создавайте веб интерфейсы <br />
            <span className="text-violet-500">которыми вы будете гордиться</span></h1>
            <p className="text-gray-500">RenDit UI это Мощный SCSS-движок, продуманная система токенов и готовые React-компоненты для ваших самых амбициозных проектов.</p>
            <div className="flex justify-center gap-10 my-20">

              <button type="button" className={[
                'h-40 px-15 shadow-3 br-full bg-violet-500 text-white',

                'transition-[opacity,scale]',
                'duration-200 ease-out',

                'hover:opacity-85 active:scale-95',
              ].join(' ')}>Начать работу</button>

              <button type="button" className={[
                'h-40 px-15 shadow-3 br-full backdrop-blur-4',

                'transition-[background,scale]',
                'duration-200 ease-out',

                'hover:bg-surface-muted/50 active:scale-95'
              ].join(' ')}
               >Документация</button>
            </div>
        </div>
      </section>

      <section>
        <div className="container mb-40">
          <div className="row gutter-20 text-center">
              <div className="col-6 md:col-6 lg:col-2 mb-20">
                <div className="relative p-20 shadow-7 br-36 w-full block isolate bg-background cursor-pointer transition-transform duration-300 ease-out hover:translate-y-[-5px]">
                  <TachometerSVG
                    width={40}
                    height={40}
                    aria-hidden="true"
                    className="fill-violet-500 m-auto"
                  />
                  <h3 className="mt-10 mb-5">Движок</h3>
                  <p className="text-gray-400">Гибкая система стилей</p>
                </div>
              </div>
              <div className="col-6 md:col-6 lg:col-2 mb-20">
                <div className="relative p-20 shadow-7 br-36 w-full block isolate bg-background cursor-pointer transition-transform duration-300 ease-out hover:translate-y-[-5px]">
                  <TachometerSVG
                    width={40}
                    height={40}
                    aria-hidden="true"
                    className="fill-violet-500 m-auto"
                  />
                  <h3 className="mt-10 mb-5">Движок</h3>
                  <p className="text-gray-400">Гибкая система стилей</p>
                </div>
              </div>
              <div className="col-6 md:col-6 lg:col-2 mb-20">
                <div className="relative p-20 shadow-7 br-36 w-full block isolate bg-background cursor-pointer transition-transform duration-300 ease-out hover:translate-y-[-5px]">
                  <TachometerSVG
                    width={40}
                    height={40}
                    aria-hidden="true"
                    className="fill-violet-500 m-auto"
                  />
                  <h3 className="mt-10 mb-5">Движок 777</h3>
                  <p className="text-gray-400">Гибкая система стилей</p>
                </div>
              </div>
              <div className="col-6 md:col-6 lg:col-2 mb-20">
                <div className="relative p-20 shadow-7 br-36 w-full block isolate bg-background cursor-pointer transition-transform duration-300 ease-out hover:translate-y-[-5px]">
                  <TachometerSVG
                    width={40}
                    height={40}
                    aria-hidden="true"
                    className="fill-violet-500 m-auto"
                  />
                  <h3 className="mt-10 mb-5">Движок</h3>
                  <p className="text-gray-400">Гибкая система стилей</p>
                </div>
              </div>
              <div className="col-6 md:col-6 lg:col-2 mb-20">
                <div className="relative p-20 shadow-7 br-36 w-full block isolate bg-background cursor-pointer transition-transform duration-300 ease-out hover:translate-y-[-5px]">
                  <TachometerSVG
                    width={40}
                    height={40}
                    aria-hidden="true"
                    className="fill-violet-500 m-auto"
                  />
                  <h3 className="mt-10 mb-5">Движок</h3>
                  <p className="text-gray-400">Гибкая система стилей</p>
                </div>
              </div>
              <div className="col-6 md:col-6 lg:col-2 mb-20">
                <div className="relative p-20 shadow-7 br-36 w-full block isolate bg-background cursor-pointer transition-transform duration-300 ease-out hover:translate-y-[-5px]">
                  <TachometerSVG
                    width={40}
                    height={40}
                    aria-hidden="true"
                    className="fill-violet-500 m-auto"
                  />
                  <h3 className="mt-10 mb-5">Движок</h3>
                  <p className="text-gray-400">Гибкая система стилей</p>
                </div>
              </div>
          </div>
        </div>
      </section>

      <section>
        <div className="container">
          <div className="row gutter-20">
              <div className="col-12 sm:col-6 lg:col-3 max-sm:text-center max-sm:mt-40">
                <h2 className="font-36/40 font-w-400 mb-10">Готовые компоненты для ваших проектов</h2>
                <p className="text-gray-500 mb-10">Красивые, доступные и гибкие компоненты для создания современных интерфейсов.</p>
                <button type="button" className="bg-background shadow-8 border-solid p-10 br-full transition-[scale, opacity] duration-200 ease-out hover:opacity-80 active:scale-95 ">Перейти к компонентам</button>
              </div>
              <div className="col-12 sm:col-6 lg:col-3">
                <Link href='/' className="relative group p-20 shadow-7 br-36 w-full block isolate bg-background">
                <Spotlight />
                  <div className="flex justify-between ">
                    <div>
                      <h3 className="mb-7 font-20 font-w-400">Кнопки</h3>
                      <p className="text-gray-500">Гибкие кнопки <br /> для любых задач</p>
                    </div>
                    <button
                      type="button"
                      className={[
                        "grid place-items-center shrink-0 size-36",
                        "bg-surface-muted/50 br-full border",
                        "transition-colors duration-200",
                        "group-hover:bg-surface-muted/70",
                      ].join(" ")}
                    >
                      <ChevronRightSVG
                        width={20}
                        height={20}
                        aria-hidden="true"
                        className="transition-colors duration-200 group-hover:fill-violet-500"
                      />
                    </button>
                  </div>
                  <div className="flex gap-10 mt-10">
                      <button type="button" className="flex-1 inline-flex items-center justify-center gap-8 h-44 px-20 br-full font-13 font-w-600 select-none transition-[background-color,border-color,color,box-shadow,translate,scale] duration-200 ease-out motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary active:scale-97 border border-secondary text-secondary bg-[linear-gradient(90deg,var(--secondary)_50%,transparent_50%)] bg-[size:210%_100%] bg-[position:100%_0] transition-[background-position,color] duration-500 ease-out hover:bg-[position:0%_0] hover:text-secondary-foreground">Заливка</button>
                      <button type="button" className="flex-1 inline-flex items-center justify-center gap-8 h-44 px-20 br-full font-13 font-w-600 select-none transition-[background-color,border-color,color,box-shadow,translate,scale] duration-200 ease-out motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary active:scale-97 liquid-glass text-foreground hover:bg-white/10">Стекло</button>
                  </div>
                </Link>
              </div>
              
              <div className="col-12 sm:col-6 lg:col-3">
                <Link href='/' className="relative group p-20 shadow-7 br-36 w-full block isolate bg-background ">
                <Spotlight />
                  <div className="flex justify-between ">
                    <div>
                      <h3 className="mb-7 font-20 font-w-400">Коды</h3>
                      <p className="text-gray-500">Ввод символов<br /> для доступа</p>
                    </div>
                    <button
                      type="button"
                      className={[
                        "grid place-items-center shrink-0 size-36",
                        "bg-surface-muted/50 br-full border",
                        "transition-colors duration-200",
                        "group-hover:bg-surface-muted/70",
                      ].join(" ")}
                    >
                      <ChevronRightSVG
                        width={20}
                        height={20}
                        aria-hidden="true"
                        className="transition-colors duration-200 group-hover:fill-violet-500"
                      />
                    </button>
                  </div>
                  <div className="flex gap-10 mt-10">
                      <OTPInput />
                  </div>
                </Link>
              </div>

              <div className="col-12 sm:col-6 lg:col-3">
                <Link href='/' className="relative group p-20 shadow-7 br-36 w-full block isolate bg-background">
                <Spotlight />
                  <div className="flex justify-between">
                    <div>
                      <h3 className="mb-7 font-20 font-w-400">Тема</h3>
                      <p className="text-gray-500">
                        Смена режима <br />в один клик
                      </p>
                    </div>
                    <button
                      type="button"
                      className={[
                        "grid place-items-center shrink-0 size-36",
                        "bg-surface-muted/50 br-full border",
                        "transition-colors duration-200",
                        "group-hover:bg-surface-muted/70",
                      ].join(" ")}
                    >
                      <ChevronRightSVG
                        width={20}
                        height={20}
                        aria-hidden="true"
                        className="transition-colors duration-200 group-hover:fill-violet-500"
                      />
                    </button>
                  </div>
                  <div className="flex gap-10 mt-10">
                    <ThemeToggleComponent />
                  </div>
                </Link>
              </div>
              
            </div>
        </div>
      </section>

      <section>
        <div className="h-1000">beta</div>
      </section>

    </main>
  );
}
