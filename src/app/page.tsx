
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
            <h1 className="font-42/55 font-w-400 my-20">Создавайте веб интерфейсы <br />
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
        <div className="h-1000">beta</div>
      </section>
    </main>
  );
}
