import { useDailyStore } from './useDailyStore'
import type { PersistedState } from '../../../shared/types'

const STORE_CHANGED = 'store:state-changed'

export async function hydrateFromMain(): Promise<void> {
  const state = await window.api.store.getAll()
  useDailyStore.getState().setHydrated(state)

  window.api.timer.onStateChanged((timer) => {
    useDailyStore.getState().setTimer(timer)
  })

  window.electron.ipcRenderer.on(STORE_CHANGED, (_e, next: PersistedState) => {
    useDailyStore.getState().setHydrated(next)
  })
}
