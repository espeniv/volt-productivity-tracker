import { useEffect, useRef, useState } from 'react'
import { useDailyStore } from '../store/useDailyStore'
import { Icon } from '../design/Icon'
import { PrimaryButton, GhostButton } from '../design/Buttons'

const W = 480
const H = 600

function OnbWelcome(): React.JSX.Element {
  return (
    <div
      style={{
        height: '100%',
        padding: '60px 48px 32px',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <div style={{ marginBottom: 32 }}>
        <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
          <circle cx="22" cy="22" r="9" stroke="var(--accent)" strokeWidth="1.8" />
          <line x1="6" y1="32" x2="38" y2="32" stroke="var(--ink-3)" strokeWidth="1" />
        </svg>
      </div>
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
        A small ritual for
        <br />
        <span style={{ color: 'var(--ink-3)', fontWeight: 500 }}>focused days.</span>
      </div>
      <div
        style={{ fontSize: 15.5, color: 'var(--ink-2)', lineHeight: 1.55, maxWidth: 360 }}
      >
        Each morning, choose one thing that matters. Track the time you spend on it.
      </div>
      <div style={{ flex: 1 }} />
      <div style={{ fontSize: 12, color: 'var(--ink-4)' }}>
        No accounts. No streaks. No notifications you didn&apos;t ask for.
      </div>
    </div>
  )
}

function OnbName({
  value,
  onChange
}: {
  value: string
  onChange: (v: string) => void
}): React.JSX.Element {
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
        What&apos;s your name?
      </div>
      <div style={{ fontSize: 14, color: 'var(--ink-3)', lineHeight: 1.55, marginBottom: 32 }}>
        So Daily can greet you each morning.
      </div>
      <input
        ref={ref}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Your name"
        className="focus-ring display"
        style={{
          width: '100%',
          background: 'transparent',
          border: 'none',
          outline: 'none',
          borderBottom: '1.5px solid var(--accent)',
          fontSize: 22,
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

function OnbOverarching({
  value,
  onChange
}: {
  value: string
  onChange: (v: string) => void
}): React.JSX.Element {
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
        What are you working toward?
      </div>
      <div style={{ fontSize: 14, color: 'var(--ink-3)', lineHeight: 1.55, marginBottom: 32 }}>
        Your big &ldquo;why&rdquo;. The thing each focused day adds up to. You can change this anytime.
      </div>
      <input
        ref={ref}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Submit dissertation by August"
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
      <div style={{ fontSize: 12, color: 'var(--ink-4)', marginTop: 14, lineHeight: 1.6 }}>
        Examples: Launch the side project · Learn Spanish to B1 · Finish the novel manuscript
      </div>
    </div>
  )
}

function OnbMenuBar(): React.JSX.Element {
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
        Daily lives in your menu bar.
      </div>
      <div style={{ fontSize: 14, color: 'var(--ink-3)', lineHeight: 1.55, marginBottom: 22 }}>
        Click the icon up top to start or stop a session. That&apos;s where you&apos;ll spend most of
        your time.
      </div>
      <div style={{ flex: 1 }} />
      <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {[
          ["Today's focus", 'Always visible at a glance.'],
          ['One-click timer', "Start when you're ready. End when you're done."],
          ['Open the full window', "For your day's log, calendar, and settings."]
        ].map(([t, d]) => (
          <li key={t} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
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
              <div style={{ fontSize: 13.5, color: 'var(--ink)', fontWeight: 500 }}>{t}</div>
              <div style={{ fontSize: 13, color: 'var(--ink-3)', lineHeight: 1.5 }}>{d}</div>
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

  const [step, setStep] = useState(0)
  const [name, setName] = useState(settings.userName)
  const [goal, setGoal] = useState(settings.overarchingGoal)
  const total = 4

  const finish = async (): Promise<void> => {
    const patch = { userName: name, overarchingGoal: goal, onboarded: true }
    updateSettingsLocal(patch)
    await window.api.store.updateSettings(patch)
    window.api.window.closeSelf()
  }

  const canContinue = (s: number): boolean => {
    if (s === 1) return !!name.trim()
    if (s === 2) return !!goal.trim()
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
            borderBottom: '0.5px solid var(--line)',
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
            Welcome to Daily
          </div>
        </div>

        <div style={{ flex: 1, overflow: 'hidden' }}>
          {step === 0 && <OnbWelcome />}
          {step === 1 && <OnbName value={name} onChange={setName} />}
          {step === 2 && <OnbOverarching value={goal} onChange={setGoal} />}
          {step === 3 && <OnbMenuBar />}
        </div>

        <div
          style={{
            height: 60,
            padding: '0 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '0.5px solid var(--line)'
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
                Back
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
                Continue
              </PrimaryButton>
            ) : (
              <PrimaryButton size="md" onClick={finish} iconRight="arrow-right">
                Begin
              </PrimaryButton>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// fallback to ensure Icon import is used (lint)
void Icon
