import type { ReactNode } from 'react'
import { useDailyStore } from '../../store/useDailyStore'
import type { Settings } from '../../../../shared/types'

const ACCENTS = ['#5B9DD9', '#3FB364', '#D97757', '#EAB308']

function SettingsGroup({
  title,
  subtitle,
  children
}: {
  title: string
  subtitle?: string
  children: ReactNode
}): React.JSX.Element {
  return (
    <div style={{ marginBottom: 30 }}>
      <h3
        style={{
          fontSize: 11,
          color: 'var(--ink-3)',
          textTransform: 'uppercase',
          letterSpacing: '0.10em',
          margin: '0 0 4px',
          fontWeight: 500
        }}
      >
        {title}
      </h3>
      {subtitle && (
        <div
          style={{ fontSize: 12, color: 'var(--ink-4)', marginBottom: 12, lineHeight: 1.5 }}
        >
          {subtitle}
        </div>
      )}
      {!subtitle && <div style={{ height: 8 }} />}
      {children}
    </div>
  )
}

function SettingsRow({
  label,
  desc,
  children
}: {
  label: string
  desc?: string
  children: ReactNode
}): React.JSX.Element {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 0',
        borderBottom: '0.5px solid var(--line)'
      }}
    >
      <div>
        <div style={{ fontSize: 14, color: 'var(--ink)' }}>{label}</div>
        {desc && <div style={{ fontSize: 12, color: 'var(--ink-4)', marginTop: 2 }}>{desc}</div>}
      </div>
      <div>{children}</div>
    </div>
  )
}

function SettingsInput({
  value,
  onChange,
  small,
  mono,
  type
}: {
  value: string
  onChange: (v: string) => void
  small?: boolean
  mono?: boolean
  type?: string
}): React.JSX.Element {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      type={type}
      className={mono ? 'mono focus-ring' : 'focus-ring'}
      style={{
        width: small ? 100 : '100%',
        background: 'var(--bg-sunken)',
        border: '0.5px solid var(--line)',
        borderRadius: 8,
        padding: '8px 10px',
        fontSize: 14,
        color: 'var(--ink)',
        outline: 'none'
      }}
    />
  )
}

function Toggle({
  value,
  onChange
}: {
  value: boolean
  onChange: (v: boolean) => void
}): React.JSX.Element {
  return (
    <button
      onClick={() => onChange(!value)}
      style={{
        width: 36,
        height: 20,
        borderRadius: 999,
        background: value ? 'var(--accent)' : 'var(--ink-5)',
        border: 'none',
        position: 'relative',
        transition: 'background 150ms',
        flexShrink: 0,
        cursor: 'pointer'
      }}
    >
      <span
        style={{
          position: 'absolute',
          top: 2,
          left: value ? 18 : 2,
          width: 16,
          height: 16,
          borderRadius: '50%',
          background: 'white',
          boxShadow: '0 1px 2px rgba(0,0,0,0.2)',
          transition: 'left 150ms'
        }}
      />
    </button>
  )
}


function rolloverString(hour: number): string {
  return `${String(hour).padStart(2, '0')}:00`
}

function parseRollover(s: string): number {
  const m = s.match(/^(\d{1,2})/)
  if (!m) return 0
  return Math.max(0, Math.min(23, parseInt(m[1], 10)))
}

export function SettingsTab(): React.JSX.Element {
  const settings = useDailyStore((s) => s.settings)
  const updateSettingsLocal = useDailyStore((s) => s.updateSettings)

  const save = (patch: Partial<Settings>): void => {
    updateSettingsLocal(patch)
    window.api.store.updateSettings(patch)
  }

  return (
    <div style={{ padding: '24px 6% 44px', width: '100%' }}>
      <div
        style={{
          marginBottom: 22,
          paddingBottom: 14,
          borderBottom: '0.5px solid var(--line)'
        }}
      >
        <div
          style={{
            fontSize: 20,
            fontWeight: 600,
            letterSpacing: '-0.01em',
            color: 'var(--ink)'
          }}
        >
          Settings
        </div>
        <div style={{ fontSize: 12, color: 'var(--ink-4)', marginTop: 2 }}>Customize Daily.</div>
      </div>

      <SettingsGroup
        title="Overarching goal"
        subtitle="The thing each focused day adds up to."
      >
        <textarea
          value={settings.overarchingGoal}
          onChange={(e) => save({ overarchingGoal: e.target.value })}
          rows={2}
          className="focus-ring"
          style={{
            width: '100%',
            resize: 'none',
            background: 'var(--bg-sunken)',
            border: '0.5px solid var(--line)',
            borderRadius: 10,
            padding: 14,
            fontSize: 16,
            lineHeight: 1.45,
            color: 'var(--ink)',
            outline: 'none',
            fontWeight: 500,
            letterSpacing: '-0.01em'
          }}
        />
      </SettingsGroup>

      <SettingsGroup
        title="Day rollover"
        subtitle="When 'today' resets. Useful if you work past midnight."
      >
        <SettingsInput
          value={rolloverString(settings.dayRolloverHour)}
          onChange={(v) => save({ dayRolloverHour: parseRollover(v) })}
          small
          mono
        />
      </SettingsGroup>

      <SettingsGroup title="Appearance">
        <SettingsRow label="Accent">
          <div style={{ display: 'flex', gap: 8 }}>
            {ACCENTS.map((c) => (
              <button
                key={c}
                onClick={() => save({ accent: c })}
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: 999,
                  background: c,
                  border:
                    settings.accent === c
                      ? '2px solid var(--ink)'
                      : '1px solid var(--line-strong)',
                  outline: settings.accent === c ? '2px solid var(--bg)' : 'none',
                  outlineOffset: -3,
                  cursor: 'pointer'
                }}
              />
            ))}
          </div>
        </SettingsRow>
      </SettingsGroup>

      <SettingsGroup title="Behavior">
        <SettingsRow
          label="Hide app icon in dock"
          desc="Daily lives only in the menu bar."
        >
          <Toggle value={settings.hideDock} onChange={(v) => save({ hideDock: v })} />
        </SettingsRow>
        <SettingsRow label="Launch at login">
          <Toggle value={settings.autoLaunch} onChange={(v) => save({ autoLaunch: v })} />
        </SettingsRow>
        <SettingsRow
          label="Gentle reminder if you haven't started"
          desc="Sent at 10:30 AM. Off by default."
        >
          <Toggle value={settings.gentleReminder} onChange={(v) => save({ gentleReminder: v })} />
        </SettingsRow>
      </SettingsGroup>

      <SettingsGroup
        title="Developer"
        subtitle="Wipes all sessions, entries and settings, then relaunches."
      >
        <button
          onClick={() => {
            if (confirm('Reset all Daily data? This cannot be undone.')) {
              window.api.dev.resetData()
            }
          }}
          style={{
            background: 'transparent',
            border: '0.5px solid var(--line-strong)',
            color: '#C24545',
            padding: '8px 14px',
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 500,
            cursor: 'pointer'
          }}
        >
          Reset all data
        </button>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginTop: 14,
            flexWrap: 'wrap'
          }}
        >
          <button
            onClick={() => save({ devDayOffset: settings.devDayOffset + 1 })}
            style={{
              background: 'transparent',
              border: '0.5px solid var(--line-strong)',
              color: 'var(--ink-2)',
              padding: '8px 14px',
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 500,
              cursor: 'pointer'
            }}
          >
            Skip ahead 1 day
          </button>
          <button
            onClick={() => save({ devDayOffset: settings.devDayOffset - 1 })}
            style={{
              background: 'transparent',
              border: '0.5px solid var(--line-strong)',
              color: 'var(--ink-2)',
              padding: '8px 14px',
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 500,
              cursor: 'pointer'
            }}
          >
            Go back 1 day
          </button>
          {settings.devDayOffset !== 0 && (
            <button
              onClick={() => save({ devDayOffset: 0 })}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--ink-3)',
                padding: '8px 6px',
                fontSize: 12,
                cursor: 'pointer'
              }}
            >
              Reset offset
            </button>
          )}
          <span style={{ fontSize: 12, color: 'var(--ink-4)' }} className="tnum">
            {settings.devDayOffset === 0
              ? 'Real time'
              : `${settings.devDayOffset > 0 ? '+' : ''}${settings.devDayOffset} day${
                  Math.abs(settings.devDayOffset) === 1 ? '' : 's'
                }`}
          </span>
        </div>
      </SettingsGroup>

      <div
        style={{
          fontSize: 11,
          color: 'var(--ink-4)',
          marginTop: 32,
          textAlign: 'center'
        }}
      >
        Daily 1.0 · Made for quiet days.
      </div>
    </div>
  )
}
