import type { ReactNode } from 'react'
import { useDailyStore } from '../../store/useDailyStore'
import { Logo } from '../../design/Logo'
import { useT } from '../../i18n/useT'
import type { Language, Settings } from '../../../../shared/types'

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
        width: small ? 70 : '100%',
        textAlign: small ? 'center' : 'left',
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
  const t = useT()

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
          {t('settings')}
        </div>
        <div style={{ fontSize: 12, color: 'var(--ink-4)', marginTop: 2 }}>{t('customize_daily')}</div>
      </div>

      <SettingsGroup
        title={t('overarching_goal')}
        subtitle={t('overarching_goal_sub')}
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

      <SettingsGroup title={t('day_rollover')} subtitle={t('day_rollover_sub')}>
        <SettingsInput
          value={rolloverString(settings.dayRolloverHour)}
          onChange={(v) => save({ dayRolloverHour: parseRollover(v) })}
          small
          mono
        />
      </SettingsGroup>

      <SettingsGroup title={t('appearance')}>
        <SettingsRow label={t('accent')}>
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
        <SettingsRow label={t('language_label')}>
          <select
            value={settings.language}
            onChange={(e) => save({ language: e.target.value as Language })}
            className="focus-ring"
            style={{
              appearance: 'none',
              WebkitAppearance: 'none',
              MozAppearance: 'none',
              background:
                "var(--bg-sunken) url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M6 9l6 6 6-6'/></svg>\") no-repeat right 10px center",
              border: '0.5px solid var(--line)',
              borderRadius: 8,
              padding: '6px 32px 6px 10px',
              fontSize: 13,
              color: 'var(--ink)',
              fontFamily: 'inherit',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="en" style={{ color: '#000' }}>{t('english')}</option>
            <option value="no" style={{ color: '#000' }}>{t('norwegian')}</option>
          </select>
        </SettingsRow>
      </SettingsGroup>

      <SettingsGroup title={t('behavior')}>
        <SettingsRow label={t('hide_dock')} desc={t('hide_dock_sub')}>
          <Toggle value={settings.hideDock} onChange={(v) => save({ hideDock: v })} />
        </SettingsRow>
        <SettingsRow label={t('launch_at_login')}>
          <Toggle value={settings.autoLaunch} onChange={(v) => save({ autoLaunch: v })} />
        </SettingsRow>
        <SettingsRow label={t('gentle_reminder')} desc={t('gentle_reminder_sub')}>
          <Toggle value={settings.gentleReminder} onChange={(v) => save({ gentleReminder: v })} />
        </SettingsRow>
      </SettingsGroup>

      <SettingsGroup title={t('suggestions_title')} subtitle={t('suggestions_sub')}>
        <button
          onClick={() => window.api.shell.openExternal('mailto:volt@espeniv.com')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            background: 'transparent',
            border: '0.5px solid var(--line-strong)',
            color: 'var(--ink)',
            padding: '8px 14px',
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 500,
            cursor: 'pointer'
          }}
        >
          {t('send_feedback')} <span style={{ color: 'var(--ink-3)' }}>· volt@espeniv.com</span>
        </button>
      </SettingsGroup>

      <SettingsGroup
        title="Developer"
        subtitle="Wipes all sessions, entries and settings, then relaunches."
      >
        <button
          onClick={() => {
            if (confirm('Reset all Volt data? This cannot be undone.')) {
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
          <button
            onClick={() => window.api.dev.testReminder()}
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
            Test reminder now
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
          marginTop: 36,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 8
        }}
      >
        <Logo size={28} title="Volt" />
        <div
          style={{
            fontSize: 11,
            color: 'var(--ink-4)',
            textAlign: 'center'
          }}
        >
          {t('made_for_quiet_days')}
        </div>
      </div>
    </div>
  )
}
