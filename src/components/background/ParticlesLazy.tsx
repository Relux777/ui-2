'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'

// Частицы — чистая декорация: canvas во весь экран перерисовывается каждый кадр и заставляет
// браузер заново считать все «стеклянные» (backdrop-filter) блоки поверх него — даже когда страницу
// никто не листает. На телефоне эффекта «притяжения к курсору» нет, а слабые Android от этого
// заметно тормозят и греются. Поэтому код частиц — отдельным чанком и только там, где он уместен.
const Particles = dynamic(() => import('./Particles'), { ssr: false })

type NavigatorHints = Navigator & {
  connection?: { saveData?: boolean }
  deviceMemory?: number
}

function canRunParticles() {
  // мышь/трекпад как основной ввод (не телефон и не планшет)
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return false
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false

  const nav = navigator as NavigatorHints
  // включён режим экономии трафика
  if (nav.connection?.saveData) return false
  // совсем слабое железо (2 ядра / ≤2 ГБ памяти); если браузер не сообщает — считаем, что нормальное
  if ((nav.hardwareConcurrency ?? 8) <= 2) return false
  if ((nav.deviceMemory ?? 8) <= 2) return false

  return true
}

export default function ParticlesLazy({ className }: { className?: string }) {
  const [enabled, setEnabled] = useState(false)

  // решение принимается только на клиенте: на сервере про устройство ничего не известно
  useEffect(() => {
    setEnabled(canRunParticles())
  }, [])

  return enabled ? <Particles className={className} /> : null
}
