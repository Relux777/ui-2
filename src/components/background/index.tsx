import ParticlesLazy from './ParticlesLazy'

export default function BackgroundComponent() {
  return (
    <>
      <div
        aria-hidden="true"
        className={[
          'fixed inset-0',
          'z-[-1]',
          'overflow-hidden pointer-events-none',
        ].join(' ')}
      >
        <ParticlesLazy className=' w-full h-full' />
      </div>

      {/* Обертка фона */}
        <div className="bg w-full h-full isolate pointer-events-none absolute overflow-x-clip inset-0 z-[-1]">
          <div
            aria-hidden="true"
            className={[
              'absolute z-[-1]',
              '-right-100 -top-100',
              'w-500 h-600',
              'rotate-150 blur-40 opacity-30',
              '[border-radius:50%_50%_50%_50%_/_60%_40%_60%_40%]',
              'bg-[radial-gradient(circle_at_30%_30%,var(--violet-700)_0%,transparent_60%),radial-gradient(circle_at_70%_70%,var(--violet-500)_0%,transparent_60%)]',
            ].join(' ')}
          />

          <div
            aria-hidden="true"
            className={[
              'absolute z-[-1]',
              '-left-200 top-[70%]',
              'w-500 h-600',
              'rotate-30 blur-40 opacity-30',
              '[border-radius:42%_58%_63%_37%_/_48%_42%_58%_52%]',
              'bg-[radial-gradient(circle_at_35%_35%,var(--violet-500)_0%,transparent_60%),radial-gradient(circle_at_75%_65%,var(--violet-700)_0%,transparent_65%)]',
            ].join(' ')}
          />
        </div>
        
    </>
  );
}
