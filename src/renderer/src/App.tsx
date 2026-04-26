import { useEffect, useState } from 'react'
import { useApplyTheme } from './design/theme'
import { MenuDropdown } from './views/MenuDropdown'
import { MainWindow } from './views/MainWindow'
import { Onboarding } from './views/Onboarding'
import { MorningRitual } from './views/MorningRitual'

function getRoute(): string {
  return window.location.hash.replace(/^#/, '') || '/main'
}

function App(): React.JSX.Element {
  useApplyTheme()
  const [route, setRoute] = useState(getRoute())

  useEffect(() => {
    const onHashChange = (): void => setRoute(getRoute())
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  useEffect(() => {
    document.body.dataset.scope = route.startsWith('/tray') ? 'tray' : 'window'
  }, [route])

  if (route.startsWith('/tray')) return <MenuDropdown />
  if (route.startsWith('/onboarding')) return <Onboarding />
  if (route.startsWith('/morning')) return <MorningRitual />
  return <MainWindow />
}

export default App
