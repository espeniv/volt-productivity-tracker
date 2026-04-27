import { app, BrowserWindow } from 'electron'
import { electronApp, optimizer } from '@electron-toolkit/utils'
import { createTray } from './tray/tray'
import { createTrayWindow } from './windows/tray-window'
import { showFloatingWindow } from './windows/floating-window'
import { getSettings, initStore } from './store/store'
import { getTimerState, initTimer, stopTimer } from './timer/timer'
import { initPowerMonitor } from './power/power'
import { applySettingsSideEffects, registerIpcHandlers } from './ipc/ipc'
import { initAutoUpdater } from './updater/updater'
import { initMorningReminder } from './notifications/morning-reminder'

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.voltapp.app')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  initStore()
  const settings = getSettings()
  applySettingsSideEffects(settings)
  initTimer()
  initPowerMonitor()
  registerIpcHandlers()

  createTrayWindow()
  createTray()

  if (!settings.onboarded) {
    if (process.platform === 'darwin') app.dock?.show()
    showFloatingWindow('onboarding')
  }

  initAutoUpdater()
  initMorningReminder()
})

app.on('window-all-closed', () => {
  // Menu bar app — keep running when windows close.
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createTrayWindow()
})

app.on('before-quit', () => {
  if (getTimerState().status !== 'idle') stopTimer()
})
