import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { IpcChannels } from '../shared/ipc-channels'
import type { DailyEntry, PersistedState, Settings, TimerState } from '../shared/types'

const api = {
  showMainWindow: (): Promise<void> => ipcRenderer.invoke(IpcChannels.WindowShowMain),
  hideTrayWindow: (): Promise<void> => ipcRenderer.invoke(IpcChannels.WindowHideTray),
  showTrayWindow: (): Promise<void> => ipcRenderer.invoke(IpcChannels.WindowShowTray),
  openMorningRitual: (): Promise<void> => ipcRenderer.invoke(IpcChannels.WindowOpenMorning),
  openOnboarding: (): Promise<void> => ipcRenderer.invoke(IpcChannels.WindowOpenOnboarding),
  window: {
    closeSelf: (): Promise<void> => ipcRenderer.invoke(IpcChannels.WindowCloseSelf)
  },
  dev: {
    resetData: (): Promise<void> => ipcRenderer.invoke(IpcChannels.DevResetData)
  },
  tray: {
    resize: (height: number): Promise<void> => ipcRenderer.invoke(IpcChannels.TrayResize, height)
  },
  store: {
    getAll: (): Promise<PersistedState> => ipcRenderer.invoke(IpcChannels.StoreGetAll),
    updateEntry: (entry: DailyEntry): Promise<void> =>
      ipcRenderer.invoke(IpcChannels.StoreUpdateEntry, entry),
    updateSettings: (patch: Partial<Settings>): Promise<Settings> =>
      ipcRenderer.invoke(IpcChannels.StoreUpdateSettings, patch)
  },
  timer: {
    start: (): Promise<TimerState> => ipcRenderer.invoke(IpcChannels.TimerStart),
    stop: (): Promise<TimerState> => ipcRenderer.invoke(IpcChannels.TimerStop),
    pause: (): Promise<TimerState> => ipcRenderer.invoke(IpcChannels.TimerPause),
    resume: (): Promise<TimerState> => ipcRenderer.invoke(IpcChannels.TimerResume),
    onStateChanged: (cb: (state: TimerState) => void): (() => void) => {
      const listener = (_e: Electron.IpcRendererEvent, state: TimerState): void => cb(state)
      ipcRenderer.on(IpcChannels.TimerStateChanged, listener)
      return () => ipcRenderer.off(IpcChannels.TimerStateChanged, listener)
    }
  }
}

export type DailyApi = typeof api

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
