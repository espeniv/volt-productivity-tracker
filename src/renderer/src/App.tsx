import { TrayPanel } from './views/TrayPanel'
import { MainPanel } from './views/MainPanel'

function App(): React.JSX.Element {
  const route = window.location.hash.replace(/^#/, '') || '/main'
  if (route.startsWith('/tray')) return <TrayPanel />
  return <MainPanel />
}

export default App
