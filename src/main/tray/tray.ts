import { Tray, Menu, nativeImage } from 'electron'
import { toggleTrayWindow } from '../windows/tray-window'
import { showMainWindow } from '../windows/main-window'
import iconPath from '../../../resources/icon.png?asset'
import iconActivePath from '../../../resources/icon-active.png?asset'

let tray: Tray | null = null

function loadImage(path: string): Electron.NativeImage {
  const img = nativeImage.createFromPath(path)
  img.setTemplateImage(true)
  return img
}

export function createTray(): Tray {
  tray = new Tray(loadImage(iconPath))
  tray.setToolTip('Volt')

  tray.on('click', (_event, bounds) => toggleTrayWindow(bounds))
  tray.on('right-click', () => {
    const menu = Menu.buildFromTemplate([
      { label: 'Open Volt', click: () => showMainWindow() },
      { type: 'separator' },
      { role: 'quit' }
    ])
    tray?.popUpContextMenu(menu)
  })

  return tray
}

export function setTrayActive(active: boolean): void {
  tray?.setImage(loadImage(active ? iconActivePath : iconPath))
  if (!active) tray?.setTitle('')
}

export function setTrayTitle(text: string): void {
  tray?.setTitle(text)
}

export function getTray(): Tray | null {
  return tray
}
