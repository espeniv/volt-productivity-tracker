import { BrowserWindow } from 'electron'
import { join } from 'path'
import { is } from '@electron-toolkit/utils'

const tracked: Record<string, BrowserWindow | null> = {}

export function showFloatingWindow(kind: 'onboarding' | 'morning'): BrowserWindow {
  const existing = tracked[kind]
  if (existing && !existing.isDestroyed()) {
    existing.show()
    existing.focus()
    return existing
  }

  const win = new BrowserWindow({
    width: 480,
    height: 600,
    show: false,
    frame: false,
    resizable: false,
    fullscreenable: false,
    backgroundColor: '#ECEEF1',
    titleBarStyle: 'hiddenInset',
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  win.on('ready-to-show', () => win.show())
  win.on('closed', () => {
    tracked[kind] = null
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    win.loadURL(`${process.env['ELECTRON_RENDERER_URL']}/#/${kind}`)
    win.webContents.once('did-frame-finish-load', () => win.webContents.openDevTools({ mode: 'detach' }))
  } else {
    win.loadFile(join(__dirname, '../renderer/index.html'), { hash: `/${kind}` })
  }

  tracked[kind] = win
  return win
}
