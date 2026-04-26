import { ElectronAPI } from '@electron-toolkit/preload'
import type { DailyApi } from './index'

declare global {
  interface Window {
    electron: ElectronAPI
    api: DailyApi
  }
}
