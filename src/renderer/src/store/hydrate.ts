import { useDailyStore } from './useDailyStore'

export async function hydrateFromMain(): Promise<void> {
  const state = await window.api.store.getAll()
  useDailyStore.getState().setHydrated(state)

  window.api.timer.onStateChanged((timer) => {
    useDailyStore.getState().setTimer(timer)
  })
}
