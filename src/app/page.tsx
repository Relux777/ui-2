import Link from "next/link";
import ChevronRightSVG from '@/assets/svg/chevron-right.svg';

export default function Home() {
  return (
    <main>
      <section>
        <div className="container text-center pt-88 min-h-[calc(100dvh_-_56px)] max-sm:pt-40">
            <div className={[
                'sticky',
                'flex justify-center place-items-center',
                'top-15 z-30 br-36 font-12 h-24 px-10 gap-7',
                'shadow-glass backdrop-blur-4',
                'm-auto w-fit',

                'max-sm:relative',
                'max-sm:z-10'
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
            <div className="row gutter-20 text-left">
              <div className="col-12 sm:col-6 lg:col-3">
                <h2 className="font-36/40 font-w-400 mb-10">Готовые компоненты для ваших проектов</h2>
                <p className="text-gray-500 mb-10">Красивые, доступные и гибкие компоненты для создания современных интерфейсов.</p>
                <button type="button" className="liquid-glass p-10 br-full">Перейти к компонентам</button>
              </div>
              <div className="col-12 sm:col-6 lg:col-3">
                <Link href='/' className="p-20 shadow-7 br-36 w-full block">
                  <div className="flex justify-between ">
                    <div>
                      <h3 className="mb-7 font-20 font-w-400">Кнопки</h3>
                      <p className="text-gray-500">Гибкие кнопки <br /> для любых задач</p>
                    </div>
                    <button type="button" className="grid place-items-center shrink-0 size-36 bg-surface-muted/50 br-full">
                      <ChevronRightSVG
                        width={20}
                        height={20}
                        aria-hidden="true"
                      />
                    </button>
                  </div>
                  <div className="flex gap-10 mt-10">
                      <button type="button" className="flex-1 shadow-8 p-10 br-full">Пример 1</button>
                      <button type="button" className="flex-1 shadow-7 p-10 br-full">Пример 2</button>
                  </div>
                </Link>
              </div>
              <div className="col-12 sm:col-6 lg:col-3">
                <Link href='/' className="p-20 shadow-7 br-36 w-full block">
                  <div className="flex justify-between ">
                    <div>
                      <h3 className="mb-7 font-20 font-w-400">Кнопки</h3>
                      <p className="text-gray-500">Гибкие кнопки <br /> для любых задач</p>
                    </div>
                    <button type="button" className="grid place-items-center shrink-0 size-36 bg-surface-muted/50 br-full">
                      <ChevronRightSVG
                        width={20}
                        height={20}
                        aria-hidden="true"
                      />
                    </button>
                  </div>
                  <div className="flex gap-10 mt-10">
                      <button type="button" className="flex-1 shadow-8 p-10 br-full">Пример 1</button>
                      <button type="button" className="flex-1 shadow-7 p-10 br-full">Пример 2</button>
                  </div>
                </Link>
              </div>
              <div className="col-12 sm:col-6 lg:col-3">
                <Link href='/' className="p-20 shadow-7 br-36 w-full block">
                  <div className="flex justify-between ">
                    <div>
                      <h3 className="mb-7 font-20 font-w-400">Кнопки</h3>
                      <p className="text-gray-500">Гибкие кнопки <br /> для любых задач</p>
                    </div>
                    <button type="button" className="grid place-items-center shrink-0 size-36 bg-surface-muted/50 br-full">
                      <ChevronRightSVG
                        width={20}
                        height={20}
                        aria-hidden="true"
                      />
                    </button>
                  </div>
                  <div className="flex gap-10 mt-10">
                      <button type="button" className="flex-1 shadow-8 p-10 br-full">Пример 1</button>
                      <button type="button" className="flex-1 shadow-7 p-10 br-full">Пример 2</button>
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
