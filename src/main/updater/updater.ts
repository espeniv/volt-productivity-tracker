import { autoUpdater } from 'electron-updater'
import { is } from '@electron-toolkit/utils'

export function initAutoUpdater(): void {
  if (is.dev) return

  autoUpdater.autoDownload = true
  autoUpdater.autoInstallOnAppQuit = true

  autoUpdater.on('error', (err) => {
    console.error('[updater]', err)
  })
  autoUpdater.on('update-available', (info) => {
    console.log('[updater] update available', info.version)
  })
  autoUpdater.on('update-downloaded', (info) => {
    console.log('[updater] update downloaded', info.version)
  })

  autoUpdater.checkForUpdatesAndNotify().catch((err) => {
    console.error('[updater] check failed', err)
  })
}
