import { useEffect } from 'react'
import { useDailyStore } from '../store/useDailyStore'
import { hexA } from './format'

function relativeLuminance(hex: string): number {
  const v = hex.replace('#', '')
  const expand = v.length === 3 ? v.split('').map((c) => c + c).join('') : v
  const r = parseInt(expand.slice(0, 2), 16) / 255
  const g = parseInt(expand.slice(2, 4), 16) / 255
  const b = parseInt(expand.slice(4, 6), 16) / 255
  const f = (c: number): number => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4))
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b)
}

export function useApplyTheme(): void {
  const accent = useDailyStore((s) => s.settings.accent)

  useEffect(() => {
    const root = document.documentElement
    root.style.setProperty('--accent', accent)
    root.style.setProperty('--accent-soft', hexA(accent, 0.12))
    root.style.setProperty('--accent-ring', hexA(accent, 0.35))
    root.style.setProperty('--accent-ink', relativeLuminance(accent) > 0.40 ? '#1C1100' : '#FFFFFF')
  }, [accent])
}
