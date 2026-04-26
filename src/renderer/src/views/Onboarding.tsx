import { useEffect, useRef, useState } from 'react'
import { useDailyStore } from '../store/useDailyStore'
import { PrimaryButton, GhostButton } from '../design/Buttons'
import { useT } from '../i18n/useT'

const W = 480
const H = 600

function OnbWelcome(): React.JSX.Element {
  const t = useT()
  return (
    <div
      style={{
        height: '100%',
        padding: '60px 48px 32px',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <div
        className="display"
        style={{
          fontSize: 38,
          lineHeight: 1.1,
          color: 'var(--ink)',
          letterSpacing: '-0.025em',
          marginBottom: 18,
          fontWeight: 600
        }}
      >
        {t('small_ritual_for')}
        <br />
        <span style={{ color: 'var(--ink-3)', fontWeight: 500 }}>{t('focused_days')}</span>
      </div>
      <div
        style={{ fontSize: 15.5, color: 'var(--ink-2)', lineHeight: 1.55, maxWidth: 360 }}
      >
        {t('each_morning')}
      </div>
      <div style={{ flex: 1 }} />
      <div style={{ fontSize: 12, color: 'var(--ink-4)' }}>
        {t('no_accounts')}
      </div>
    </div>
  )
}

function OnbOverarching({
  value,
  onChange
}: {
  value: string
  onChange: (v: string) => void
}): React.JSX.Element {
  const t = useT()
  const ref = useRef<HTMLInputElement | null>(null)
  useEffect(() => {
    ref.current?.focus()
  }, [])
  return (
    <div
      style={{
        height: '100%',
        padding: '48px 48px 24px',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <div
        className="display"
        style={{
          fontSize: 28,
          lineHeight: 1.2,
          color: 'var(--ink)',
          marginBottom: 12,
          fontWeight: 600,
          letterSpacing: '-0.02em'
        }}
      >
        {t('what_are_you_working_toward')}
      </div>
      <div style={{ fontSize: 14, color: 'var(--ink-3)', lineHeight: 1.55, marginBottom: 32 }}>
        {t('why_subtitle')}
      </div>
      <input
        ref={ref}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={t('overarching_placeholder')}
        className="focus-ring display"
        style={{
          width: '100%',
          background: 'transparent',
          border: 'none',
          outline: 'none',
          borderBottom: '1.5px solid var(--accent)',
          fontSize: 20,
          lineHeight: 1.4,
          padding: '8px 0',
          color: 'var(--ink)',
          fontWeight: 500,
          letterSpacing: '-0.015em'
        }}
      />
    </div>
  )
}

function OnbMenuBar(): React.JSX.Element {
  const t = useT()
  const items: [string, string][] = [
    [t('todays_focus_visible'), t('todays_focus_visible_sub')],
    [t('one_click_timer'), t('one_click_timer_sub')],
    [t('open_full_window'), t('open_full_window_sub')]
  ]
  return (
    <div
      style={{
        height: '100%',
        padding: '40px 48px 24px',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <div
        className="display"
        style={{
          fontSize: 26,
          lineHeight: 1.2,
          color: 'var(--ink)',
          marginBottom: 12,
          fontWeight: 600,
          letterSpacing: '-0.02em'
        }}
      >
        {t('menu_bar_lives_here')}
      </div>
      <div style={{ fontSize: 14, color: 'var(--ink-3)', lineHeight: 1.55, marginBottom: 22 }}>
        {t('menu_bar_intro')}
      </div>
      <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {items.map(([title, sub]) => (
          <li key={title} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <span
              style={{
                width: 5,
                height: 5,
                borderRadius: '50%',
                background: 'var(--accent)',
                marginTop: 8,
                flexShrink: 0
              }}
            />
            <div>
              <div style={{ fontSize: 13.5, color: 'var(--ink)', fontWeight: 500 }}>{title}</div>
              <div style={{ fontSize: 13, color: 'var(--ink-3)', lineHeight: 1.5 }}>{sub}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function Onboarding(): React.JSX.Element {
  const settings = useDailyStore((s) => s.settings)
  const updateSettingsLocal = useDailyStore((s) => s.updateSettings)
  const t = useT()

  const [step, setStep] = useState(0)
  const [goal, setGoal] = useState(settings.overarchingGoal)
  const total = 3

  const finish = async (): Promise<void> => {
    const patch = { overarchingGoal: goal, onboarded: true }
    updateSettingsLocal(patch)
    await window.api.store.updateSettings(patch)
    window.api.window.closeSelf()
  }

  const canContinue = (s: number): boolean => {
    if (s === 1) return !!goal.trim()
    return true
  }

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <div
        className="glass"
        style={{
          width: W,
          height: H,
          borderRadius: 16,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          fontFamily: 'var(--font-sans)'
        }}
      >
        <div
          style={{
            height: 38,
            padding: '0 14px',
            display: 'flex',
            alignItems: 'center',
            position: 'relative',
            // @ts-expect-error
            WebkitAppRegion: 'drag'
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              textAlign: 'center',
              fontSize: 12,
              color: 'var(--ink-3)',
              fontWeight: 500
            }}
          >
            {t('welcome_to_daily')}
          </div>
        </div>

        <div style={{ flex: 1, overflow: 'hidden' }}>
          {step === 0 && <OnbWelcome />}
          {step === 1 && <OnbOverarching value={goal} onChange={setGoal} />}
          {step === 2 && <OnbMenuBar />}
        </div>

        <div
          style={{
            height: 60,
            padding: '0 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', gap: 5 }}>
            {Array.from({ length: total }).map((_, i) => (
              <span
                key={i}
                style={{
                  width: i === step ? 18 : 5,
                  height: 5,
                  borderRadius: 3,
                  background: i <= step ? 'var(--ink-2)' : 'var(--ink-5)',
                  transition: 'all 250ms ease'
                }}
              />
            ))}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {step > 0 && (
              <GhostButton size="md" icon="arrow-left" onClick={() => setStep(step - 1)}>
                {t('back')}
              </GhostButton>
            )}
            {step < total - 1 ? (
              <PrimaryButton
                size="md"
                onClick={() => setStep(step + 1)}
                iconRight="arrow-right"
                disabled={!canContinue(step)}
                tone={canContinue(step) ? 'accent' : 'ghost'}
              >
                {t('continue_label')}
              </PrimaryButton>
            ) : (
              <PrimaryButton size="md" onClick={finish} iconRight="arrow-right">
                {t('begin')}
              </PrimaryButton>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
