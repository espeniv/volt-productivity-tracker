import { useEffect, useState } from 'react'
import { Icon } from '../../design/Icon'
import { todayLong } from '../../design/format'
import { useT } from '../../i18n/useT'
import { useDailyStore } from '../../store/useDailyStore'
import { TodayTab } from './TodayTab'
import { CalendarTab } from './CalendarTab'
import { SettingsTab } from './SettingsTab'

type Tab = 'today' | 'history' | 'settings'

export function MainWindow(): React.JSX.Element {
  const t = useT()
  const lang = useDailyStore((s) => s.settings.language)
  const [tab, setTab] = useState<Tab>('today')
  const [lastTab, setLastTab] = useState<Exclude<Tab, 'settings'>>('today')

  useEffect(() => {
    if (tab === 'today' || tab === 'history') setLastTab(tab)
  }, [tab])

  const settingsOpen = tab === 'settings'
  const highlightTab: Tab = settingsOpen ? lastTab : tab

  return (
    <div
      className="glass"
      style={{
        width: '100vw',
        height: '100vh',
        borderRadius: 16,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'var(--font-sans)',
        position: 'relative'
      }}
    >
      <div
        style={{
          height: 48,
          display: 'flex',
          alignItems: 'center',
          padding: '0 14px 0 84px',
          borderBottom: '0.5px solid var(--line)',
          gap: 18,
          // @ts-expect-error - non-standard CSS
          WebkitAppRegion: 'drag'
        }}
      >
        <div
          style={{
            display: 'flex',
            gap: 2,
            height: '100%',
            // @ts-expect-error - non-standard CSS
            WebkitAppRegion: 'no-drag'
          }}
        >
          {(['today', 'history'] as const).map((tabKey) => {
            const active = highlightTab === tabKey && !settingsOpen
            const label = tabKey === 'today' ? t('tab_today') : t('tab_history')
            return (
              <button
                key={tabKey}
                onClick={() => setTab(tabKey)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  borderBottom: active ? '2px solid var(--accent)' : '2px solid transparent',
                  padding: '0 12px',
                  fontSize: 13,
                  color: active ? 'var(--ink)' : 'var(--ink-4)',
                  fontWeight: active ? 600 : 400,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  cursor: 'pointer',
                  transition: 'color 120ms ease, border-color 120ms ease'
                }}
              >
                <Icon name={tabKey === 'today' ? 'today' : 'calendar'} size={13} stroke={active ? 2 : 1.5} />
                <span>{label}</span>
              </button>
            )
          })}
        </div>

        <div style={{ flex: 1 }} />
        <div style={{ fontSize: 12, color: 'var(--ink-4)' }} className="tnum">
          {todayLong(new Date(), lang)}
        </div>

        <button
          onClick={() => setTab(settingsOpen ? lastTab : 'settings')}
          aria-label="Settings"
          style={{
            width: 28,
            height: 28,
            borderRadius: 8,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: settingsOpen ? 'var(--bg-sunken)' : 'transparent',
            border: 'none',
            cursor: 'pointer',
            color: settingsOpen ? 'var(--accent)' : 'var(--ink-4)',
            transition: 'color 120ms ease',
            // @ts-expect-error - non-standard CSS
            WebkitAppRegion: 'no-drag'
          }}
        >
          <Icon name="gear" size={15} stroke={settingsOpen ? 2 : 1.5} />
        </button>
      </div>

      <div style={{ flex: 1, overflow: 'auto' }} className="thin-scroll">
        {highlightTab === 'today' && !settingsOpen && <TodayTab />}
        {highlightTab === 'history' && !settingsOpen && <CalendarTab />}
        {settingsOpen && <SettingsTab />}
      </div>
    </div>
  )
}
