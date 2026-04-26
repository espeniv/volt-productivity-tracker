import { useEffect } from 'react'
import { useDailyStore } from '../store/useDailyStore'
import { hexA } from './format'

function resolveTheme(mode: 'light' | 'dark' | 'system'): 'light' | 'dark' {
  if (mode === 'system') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }
  return mode
}

export function useApplyTheme(): void {
  const accent = useDailyStore((s) => s.settings.accent)
  const themeMode = useDailyStore((s) => s.settings.theme)

  useEffect(() => {
    const root = document.documentElement
    const apply = (): void => {
      root.dataset.theme = resolveTheme(themeMode)
    }
    apply()
    if (themeMode === 'system') {
      const mq = window.matchMedia('(prefers-color-scheme: dark)')
      mq.addEventListener('change', apply)
      return () => mq.removeEventListener('change', apply)
    }
    return undefined
  }, [themeMode])

  useEffect(() => {
    const root = document.documentElement
    root.style.setProperty('--accent', accent)
    root.style.setProperty('--accent-soft', hexA(accent, 0.12))
    root.style.setProperty('--accent-ring', hexA(accent, 0.35))
  }, [accent])
}
