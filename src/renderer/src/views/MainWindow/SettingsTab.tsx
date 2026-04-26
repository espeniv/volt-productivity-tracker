import type { ReactNode, CSSProperties } from 'react'
import { useDailyStore } from '../../store/useDailyStore'
import { Icon, type IconName } from '../../design/Icon'
import type { Settings, ThemeMode } from '../../../../shared/types'

const ACCENTS = ['#5B9DD9', '#1F6B3A', '#B7791F', '#8E4F8E', '#0E7C70', '#4F5B6B']

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

interface SegmentedOption<T extends string> {
  value: T
  label: string
  icon?: IconName
}

function Segmented<T extends string>({
  value,
  onChange,
  options
}: {
  value: T
  onChange: (v: T) => void
  options: SegmentedOption<T>[]
}): React.JSX.Element {
  return (
    <div
      style={{
        display: 'inline-flex',
        background: 'var(--bg-sunken)',
        borderRadius: 10,
        padding: 2,
        border: '0.5px solid var(--line)'
      }}
    >
      {options.map((o) => {
        const active = value === o.value
        const style: CSSProperties = {
          background: active ? 'var(--glass-flat)' : 'transparent',
          border: 'none',
          padding: '5px 12px',
          borderRadius: 8,
          fontSize: 12,
          color: active ? 'var(--ink)' : 'var(--ink-3)',
          fontWeight: active ? 500 : 400,
          display: 'inline-flex',
          alignItems: 'center',
          gap: 5,
          boxShadow: active ? 'var(--shadow-sm)' : 'none',
          cursor: 'pointer'
        }
        return (
          <button key={o.value} onClick={() => onChange(o.value)} style={style}>
            {o.icon && <Icon name={o.icon} size={12} />}
            <span>{o.label}</span>
          </button>
        )
      })}
    </div>
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

export function SettingsTab({ onClose }: { onClose: () => void }): React.JSX.Element {
  const settings = useDailyStore((s) => s.settings)
  const updateSettingsLocal = useDailyStore((s) => s.updateSettings)

  const save = (patch: Partial<Settings>): void => {
    updateSettingsLocal(patch)
    window.api.store.updateSettings(patch)
  }

  return (
    <div style={{ padding: '24px 44px 44px', maxWidth: 640 }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          marginBottom: 22,
          paddingBottom: 14,
          borderBottom: '0.5px solid var(--line)'
        }}
      >
        <div>
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
        <button
          onClick={onClose}
          style={{
            background: 'transparent',
            border: '0.5px solid var(--line)',
            padding: '6px 12px',
            borderRadius: 8,
            fontSize: 12.5,
            color: 'var(--ink-2)',
            cursor: 'pointer',
            fontFamily: 'inherit'
          }}
        >
          Done
        </button>
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

      <SettingsGroup title="Your name">
        <SettingsInput
          value={settings.userName}
          onChange={(v) => save({ userName: v })}
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
        <SettingsRow label="Theme">
          <Segmented<ThemeMode>
            value={settings.theme}
            onChange={(v) => save({ theme: v })}
            options={[
              { value: 'light', label: 'Light', icon: 'sun' },
              { value: 'dark', label: 'Dark', icon: 'moon' },
              { value: 'system', label: 'System' }
            ]}
          />
        </SettingsRow>
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
