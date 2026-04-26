import { useEffect, useMemo, useRef, useState } from 'react'
import { useDailyStore } from '../store/useDailyStore'
import { PrimaryButton, GhostButton } from '../design/Buttons'
import { todayLong, fmtDuration, dateKey, nowWithOffset } from '../design/format'
import { useT } from '../i18n/useT'
import type { TranslationKey } from '../i18n/translations'
import type { DailyEntry } from '../../../shared/types'

const W = 480
const H = 600

function RitualGreeting({
  yesterdayTotal,
  yesterdayGoal
}: {
  yesterdayTotal: number
  yesterdayGoal: string
}): React.JSX.Element {
  const t = useT()
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
        {t('good_morning')}.
        <br />
        <span style={{ color: 'var(--ink-3)', fontWeight: 500 }}>{t('give_what_you_got')}</span>
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
            {t('yesterday')}
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
                {t('on_word')}{' '}
                <span style={{ color: 'var(--ink-2)', fontWeight: 500 }}>{yesterdayGoal}</span>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

const MOOD_OPTIONS: Array<{ value: number; emoji: string; key: TranslationKey }> = [
  { value: 1, emoji: '☹️', key: 'mood_terrible' },
  { value: 2, emoji: '🙁', key: 'mood_low' },
  { value: 3, emoji: '😐', key: 'mood_okay' },
  { value: 4, emoji: '🙂', key: 'mood_good' },
  { value: 5, emoji: '😊', key: 'mood_great' }
]

function RitualMood({
  value,
  onChange
}: {
  value: number | undefined
  onChange: (v: number) => void
}): React.JSX.Element {
  const t = useT()
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
          marginBottom: 8,
          fontWeight: 600,
          letterSpacing: '-0.02em'
        }}
      >
        {t('mood_question')}
      </div>
      <div style={{ fontSize: 13.5, color: 'var(--ink-3)', lineHeight: 1.55, marginBottom: 28 }}>
        {t('mood_subtitle')}
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'stretch',
          justifyContent: 'space-between',
          gap: 8
        }}
      >
        {MOOD_OPTIONS.map((opt) => {
          const active = value === opt.value
          return (
            <button
              key={opt.value}
              onClick={() => onChange(opt.value)}
              style={{
                flex: 1,
                background: active ? 'var(--accent-soft)' : 'var(--bg-sunken)',
                border: active ? '1.5px solid var(--accent)' : '0.5px solid var(--line)',
                borderRadius: 12,
                padding: '16px 8px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 8,
                cursor: 'pointer',
                transition: 'background 120ms, border-color 120ms'
              }}
            >
              <span style={{ fontSize: 32, lineHeight: 1 }}>{opt.emoji}</span>
              <span
                style={{
                  fontSize: 11,
                  color: active ? 'var(--ink)' : 'var(--ink-3)',
                  fontWeight: active ? 500 : 400
                }}
              >
                {t(opt.key)}
              </span>
            </button>
          )
        })}
      </div>
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
  const t = useT()
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
        {t('daily_notes')}
      </div>
      <div style={{ marginBottom: 18 }} />
      <textarea
        ref={ref}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={t('start_typing')}
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
            {t('working_toward')}
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
        {t('one_thing_today')}
      </div>
      <input
        ref={ref}
        value={value}
        onChange={(e) => onChange(e.target.value)}
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

export function MorningRitual(): React.JSX.Element {
  const settings = useDailyStore((s) => s.settings)
  const entries = useDailyStore((s) => s.entries)
  const sessions = useDailyStore((s) => s.sessions)
  const upsertEntry = useDailyStore((s) => s.upsertEntry)
  const t = useT()

  const nowMs = nowWithOffset(settings.devDayOffset)
  const today = dateKey(nowMs, settings.dayRolloverHour)
  const yesterday = dateKey(nowMs - 86400_000, settings.dayRolloverHour)
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
  const [mood, setMood] = useState<number | undefined>(existing?.mood)
  const [brainDump, setBrainDump] = useState(existing?.brainDump || '')
  const [mainGoal, setMainGoal] = useState(existing?.mainGoal || '')
  const total = 4

  const finish = async (): Promise<void> => {
    const next: DailyEntry = {
      date: today,
      mainGoal,
      brainDump,
      sessions: existing?.sessions || [],
      mood
    }
    upsertEntry(next)
    await window.api.store.updateEntry(next)
    await window.api.showTrayWindow()
    window.api.window.closeSelf()
  }

  const isLastStep = step === total - 1
  // Last step requires a main goal; mood step requires a selection
  const canAdvance =
    (step === 1 && mood === undefined) ? false :
    (isLastStep ? mainGoal.trim().length > 0 : true)

  const handlePrimary = (): void => {
    if (isLastStep) finish()
    else setStep(step + 1)
  }

  const primaryLabel =
    step === 0
      ? t('begin')
      : step === total - 1
        ? t('start_the_day')
        : t('continue_label')

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
              fontWeight: 500,
              pointerEvents: 'none'
            }}
          >
            {t('check_in')} · {step + 1} {t('of')} {total}
          </div>
        </div>

        <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
          {step === 0 && (
            <RitualGreeting
              yesterdayTotal={yesterdayTotal}
              yesterdayGoal={yesterdayEntry?.mainGoal || ''}
            />
          )}
          {step === 1 && <RitualMood value={mood} onChange={setMood} />}
          {step === 2 && <RitualBrainDump value={brainDump} onChange={setBrainDump} />}
          {step === 3 && (
            <RitualMainGoal
              value={mainGoal}
              onChange={setMainGoal}
              overarchingGoal={settings.overarchingGoal}
            />
          )}
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
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            {step === 2 && !brainDump.trim() && (
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
                {t('skip_today')}
              </button>
            )}
            {step > 0 && (
              <GhostButton size="md" onClick={() => setStep(step - 1)}>
                {t('back')}
              </GhostButton>
            )}
            <PrimaryButton
              size="md"
              onClick={handlePrimary}
              iconRight="arrow-right"
              tone={canAdvance ? 'accent' : 'ghost'}
              disabled={!canAdvance}
            >
              {primaryLabel}
            </PrimaryButton>
          </div>
        </div>
      </div>
    </div>
  )
}
