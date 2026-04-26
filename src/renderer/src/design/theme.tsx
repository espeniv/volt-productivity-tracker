import { useEffect } from 'react'
import { useDailyStore } from '../store/useDailyStore'
import { hexA } from './format'

export function useApplyTheme(): void {
  const accent = useDailyStore((s) => s.settings.accent)

  useEffect(() => {
    const root = document.documentElement
    root.style.setProperty('--accent', accent)
    root.style.setProperty('--accent-soft', hexA(accent, 0.12))
    root.style.setProperty('--accent-ring', hexA(accent, 0.35))
    root.style.setProperty('--accent-ink', '#FFFFFF')
  }, [accent])
}
