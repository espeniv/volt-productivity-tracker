import { useDailyStore } from '../store/useDailyStore'
import { tr, type TranslationKey } from './translations'

export function useT(): (key: TranslationKey) => string {
  const lang = useDailyStore((s) => s.settings.language)
  return (key) => tr(key, lang)
}
