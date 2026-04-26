import { useEffect, useMemo, useRef, useState } from 'react'
import { useDailyStore } from '../store/useDailyStore'
import { Icon } from '../design/Icon'
import { PrimaryButton, GhostButton } from '../design/Buttons'
import { todayLong, fmtDuration, dateKey } from '../design/format'
import type { DailyEntry } from '../../../shared/types'

const W = 480
const H = 600

function RitualGreeting({
  userName,
  yesterdayTotal,
  yesterdayGoal
}: {
  userName: string
  yesterdayTotal: number
  yesterdayGoal: string
}): React.JSX.Element {
  return (
    <div
      style={{
        height: '100%',
        padding: '52px 48px 32px',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <div
        style={{
          fontSize: 11,
          color: 'var(--ink-3)',
          textTransform: 'uppercase',
          letterSpacing: '0.12em',
          marginBottom: 18,
          fontWeight: 500
        }}
        className="tnum"
      >
        {todayLong()}
      </div>
      <div
        className="display"
        style={{
          fontSize: 42,
          lineHeight: 1.05,
          letterSpacing: '-0.025em',
          color: 'var(--ink)',
          fontWeight: 600
        }}
      >
        Good morning,
        <br />
        <span style={{ color: 'var(--ink-3)', fontWeight: 500 }}>
          {userName ? `${userName}.` : 'friend.'}
        </span>
      </div>

      <div style={{ flex: 1 }} />

      {yesterdayTotal > 0 && (
        <div
          className="glass-2"
          style={{ padding: 18, borderRadius: 14, border: '0.5px solid var(--line)' }}
        >
          <div
            style={{
              fontSize: 11,
              color: 'var(--ink-3)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: 8,
              fontWeight: 500
            }}
          >
            Yesterday
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
            <span
              className="display tnum"
              style={{ fontSize: 28, color: 'var(--ink)', fontWeight: 600 }}
            >
              {fmtDuration(yesterdayTotal)}
            </span>
            {yesterdayGoal && (
              <span style={{ fontSize: 13, color: 'var(--ink-3)', lineHeight: 1.5 }}>
                on{' '}
                <span style={{ color: 'var(--ink-2)', fontWeight: 500 }}>{yesterdayGoal}</span>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function RitualBrainDump({
  value,
  onChange
}: {
  value: string
  onChange: (v: string) => void
}): React.JSX.Element {
  const ref = useRef<HTMLTextAreaElement | null>(null)
  useEffect(() => {
    ref.current?.focus()
  }, [])
  return (
    <div
      style={{
        height: '100%',
        padding: '40px 48px 20px',
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
          marginBottom: 8,
          fontWeight: 600,
          letterSpacing: '-0.02em'
        }}
      >
        What&apos;s on your mind?
      </div>
      <div style={{ fontSize: 13.5, color: 'var(--ink-3)', lineHeight: 1.55, marginBottom: 18 }}>
        Anything noisy in your head — worries, ideas, what you slept badly about. Write it down so
        it stops following you around.
      </div>
      <textarea
        ref={ref}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Start typing…"
        className="focus-ring thin-scroll"
        style={{
          flex: 1,
          width: '100%',
          background: 'transparent',
          border: 'none',
          outline: 'none',
          resize: 'none',
          fontSize: 15,
          lineHeight: 1.65,
          color: 'var(--ink-2)',
          padding: 0,
          letterSpacing: '-0.005em'
        }}
      />
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          marginTop: 12,
          padding: '10px 12px',
          background: 'var(--bg-sunken)',
          borderRadius: 10,
          border: '0.5px solid var(--line)'
        }}
      >
        <Icon name="sparkle" size={12} color="var(--ink-3)" />
        <span style={{ fontSize: 12, color: 'var(--ink-3)', lineHeight: 1.4 }}>
          Even a sentence helps.{' '}
          <span style={{ color: 'var(--ink-2)' }}>
            Most days are quieter when you write the noise down first.
          </span>
        </span>
      </div>
    </div>
  )
}

function RitualMainGoal({
  value,
  onChange,
  overarchingGoal
}: {
  value: string
  onChange: (v: string) => void
  overarchingGoal: string
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
      {overarchingGoal && (
        <>
          <div
            style={{
              fontSize: 11,
              color: 'var(--ink-3)',
              textTransform: 'uppercase',
              letterSpacing: '0.10em',
              marginBottom: 6,
              fontWeight: 500
            }}
          >
            Working toward
          </div>
          <div style={{ fontSize: 14, color: 'var(--ink-2)', lineHeight: 1.45, marginBottom: 32 }}>
            {overarchingGoal}
          </div>
        </>
      )}
      <div
        className="display"
        style={{
          fontSize: 28,
          lineHeight: 1.2,
          color: 'var(--ink)',
          marginBottom: 18,
          fontWeight: 600,
          letterSpacing: '-0.02em'
        }}
      >
        What&apos;s the one thing for today?
      </div>
      <input
        ref={ref}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Finish thesis chapter 3 draft"
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
      <div style={{ fontSize: 12.5, color: 'var(--ink-4)', marginTop: 14, lineHeight: 1.5 }}>
        Make it specific enough that you&apos;ll know if you did it.
      </div>
    </div>
  )
}

function RitualReady({
  mainGoal,
  overarchingGoal
}: {
  mainGoal: string
  overarchingGoal: string
}): React.JSX.Element {
  return (
    <div
      style={{
        height: '100%',
        padding: '56px 48px 32px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start'
      }}
    >
      <div
        style={{
          fontSize: 11,
          color: 'var(--ink-3)',
          textTransform: 'uppercase',
          letterSpacing: '0.10em',
          marginBottom: 18,
          fontWeight: 500
        }}
      >
        Today
      </div>
      <div
        className="display"
        style={{
          fontSize: 30,
          lineHeight: 1.2,
          color: 'var(--ink)',
          letterSpacing: '-0.02em',
          marginBottom: 24,
          fontWeight: 600
        }}
      >
        {mainGoal}
      </div>

      {overarchingGoal && (
        <>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
            <span style={{ width: 24, height: 1, background: 'var(--ink-4)' }} />
            <span style={{ fontSize: 12, color: 'var(--ink-3)', fontWeight: 500 }}>
              a step toward
            </span>
            <span style={{ width: 24, height: 1, background: 'var(--ink-4)' }} />
          </div>
          <div
            style={{
              fontSize: 16,
              color: 'var(--ink-2)',
              lineHeight: 1.5,
              marginBottom: 32,
              fontWeight: 500
            }}
          >
            {overarchingGoal}
          </div>
        </>
      )}

      <div style={{ flex: 1 }} />

      <div
        className="glass-2"
        style={{
          fontSize: 13,
          color: 'var(--ink-3)',
          lineHeight: 1.6,
          padding: '12px 14px',
          borderRadius: 12,
          border: '0.5px solid var(--line)',
          width: '100%'
        }}
      >
        <span style={{ color: 'var(--ink-2)', fontWeight: 500 }}>The menu bar is yours.</span> Tap
        the icon up top to start a session whenever you&apos;re ready.
      </div>
    </div>
  )
}

export function MorningRitual(): React.JSX.Element {
  const settings = useDailyStore((s) => s.settings)
  const entries = useDailyStore((s) => s.entries)
  const sessions = useDailyStore((s) => s.sessions)
  const upsertEntry = useDailyStore((s) => s.upsertEntry)

  const today = dateKey(Date.now(), settings.dayRolloverHour)
  const yesterday = dateKey(Date.now() - 86400_000, settings.dayRolloverHour)
  const yesterdayEntry = entries[yesterday]
  const yesterdayTotal = useMemo(
    () =>
      Object.values(sessions)
        .filter((s) => s.date === yesterday)
        .reduce((acc, s) => acc + s.duration, 0),
    [sessions, yesterday]
  )

  const existing = entries[today]
  const [step, setStep] = useState(0)
  const [brainDump, setBrainDump] = useState(existing?.brainDump || '')
  const [mainGoal, setMainGoal] = useState(existing?.mainGoal || '')
  const total = 4

  const finish = async (): Promise<void> => {
    const next: DailyEntry = {
      date: today,
      mainGoal,
      brainDump,
      sessions: existing?.sessions || []
    }
    upsertEntry(next)
    await window.api.store.updateEntry(next)
    window.api.window.closeSelf()
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
              fontWeight: 500,
              pointerEvents: 'none'
            }}
          >
            Morning · {step + 1} of {total}
          </div>
        </div>

        <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
          {step === 0 && (
            <RitualGreeting
              userName={settings.userName}
              yesterdayTotal={yesterdayTotal}
              yesterdayGoal={yesterdayEntry?.mainGoal || ''}
            />
          )}
          {step === 1 && <RitualBrainDump value={brainDump} onChange={setBrainDump} />}
          {step === 2 && (
            <RitualMainGoal
              value={mainGoal}
              onChange={setMainGoal}
              overarchingGoal={settings.overarchingGoal}
            />
          )}
          {step === 3 && (
            <RitualReady mainGoal={mainGoal} overarchingGoal={settings.overarchingGoal} />
          )}
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
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            {step > 0 && (
              <GhostButton size="sm" onClick={() => setStep(step - 1)}>
                Back
              </GhostButton>
            )}
            {step === 1 && !brainDump.trim() && (
              <button
                onClick={() => setStep(step + 1)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--ink-3)',
                  fontSize: 13,
                  padding: '6px 10px',
                  borderRadius: 6,
                  cursor: 'pointer'
                }}
              >
                Skip for today
              </button>
            )}
            {step < total - 1 && (
              <PrimaryButton
                size="md"
                onClick={() => setStep(step + 1)}
                iconRight="arrow-right"
                tone={step === 2 && !mainGoal.trim() ? 'ghost' : 'accent'}
                disabled={step === 2 && !mainGoal.trim()}
              >
                {step === 0 ? 'Begin' : step === 1 ? 'Continue' : 'Set focus'}
              </PrimaryButton>
            )}
            {step === total - 1 && (
              <PrimaryButton size="md" onClick={finish} iconRight="arrow-right">
                Start the day
              </PrimaryButton>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
