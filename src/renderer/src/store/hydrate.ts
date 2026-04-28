import { useDailyStore } from './useDailyStore'
import type { PersistedState } from '../../../shared/types'
import { IpcChannels } from '../../../shared/ipc-channels'

export async function hydrateFromMain(): Promise<void> {
  const state = await window.api.store.getAll()
  useDailyStore.getState().setHydrated(state)

  window.api.timer.onStateChanged((timer) => {
    useDailyStore.getState().setTimer(timer)
  })

  window.electron.ipcRenderer.on(IpcChannels.StoreStateChanged, (_e, next: PersistedState) => {
    useDailyStore.getState().replaceState(next)
  })
}
