import { useEffect, useState } from 'react'
import { Icon } from '../../design/Icon'
import { todayLong } from '../../design/format'
import { useT } from '../../i18n/useT'
import { TodayTab } from './TodayTab'
import { CalendarTab } from './CalendarTab'
import { SettingsTab } from './SettingsTab'

type Tab = 'today' | 'history' | 'settings'

export function MainWindow(): React.JSX.Element {
  const t = useT()
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
          height: 44,
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
            gap: 4,
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
                  background: active ? 'var(--bg-sunken)' : 'transparent',
                  border: 'none',
                  padding: '6px 12px',
                  borderRadius: 8,
                  fontSize: 13,
                  color: active ? 'var(--ink)' : 'var(--ink-3)',
                  fontWeight: active ? 500 : 400,
                  textTransform: 'capitalize',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  cursor: 'pointer'
                }}
              >
                <Icon name={tabKey === 'today' ? 'today' : 'calendar'} size={13} stroke={1.6} />
                <span>{label}</span>
              </button>
            )
          })}
        </div>

        <div style={{ flex: 1 }} />
        <div style={{ fontSize: 12, color: 'var(--ink-4)' }} className="tnum">
          {todayLong()}
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
            color: settingsOpen ? 'var(--ink)' : 'var(--ink-3)',
            transition: 'background 120ms ease, color 120ms ease',
            // @ts-expect-error - non-standard CSS
            WebkitAppRegion: 'no-drag'
          }}
        >
          <Icon name="gear" size={15} stroke={1.6} />
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
