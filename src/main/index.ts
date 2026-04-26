import { app, BrowserWindow } from 'electron'
import { electronApp, optimizer } from '@electron-toolkit/utils'
import { createTray } from './tray/tray'
import { createTrayWindow } from './windows/tray-window'
import { getSettings, initStore } from './store/store'
import { getTimerState, initTimer, stopTimer } from './timer/timer'
import { initPowerMonitor } from './power/power'
import { applySettingsSideEffects, registerIpcHandlers } from './ipc/ipc'

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.daily.app')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  initStore()
  applySettingsSideEffects(getSettings())
  initTimer()
  initPowerMonitor()
  registerIpcHandlers()

  createTrayWindow()
  createTray()
})

app.on('window-all-closed', () => {
  // Menu bar app — keep running when windows close.
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createTrayWindow()
})

app.on('before-quit', () => {
  // Flush in-flight session so duration reflects the last running interval.
  if (getTimerState().status !== 'idle') stopTimer()
})
