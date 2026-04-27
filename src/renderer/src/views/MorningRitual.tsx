import { useEffect, useMemo, useRef, useState } from 'react'
import { useDailyStore } from '../store/useDailyStore'
import { PrimaryButton, GhostButton } from '../design/Buttons'
import { Icon } from '../design/Icon'
import { todayLong, fmtDuration, dateKey, nowWithOffset } from '../design/format'
import { useT } from '../i18n/useT'
import type { TranslationKey } from '../i18n/translations'

function greetingKey(): TranslationKey {
  const h = new Date().getHours()
  if (h < 12) return 'good_morning'
  if (h < 18) return 'good_afternoon'
  return 'good_evening'
}
import type { DailyEntry } from '../../../shared/types'

const W = 480
const H = 600

const MOOD_OPTIONS: Array<{ value: number; emoji: string; key: TranslationKey }> = [
  { value: 1, emoji: '☹️', key: 'mood_terrible' },
  { value: 2, emoji: '🙁', key: 'mood_low' },
  { value: 3, emoji: '😐', key: 'mood_okay' },
  { value: 4, emoji: '🙂', key: 'mood_good' },
  { value: 5, emoji: '😊', key: 'mood_great' }
]

const ENERGY_OPTIONS: Array<{ value: number; emoji: string; key: TranslationKey }> = [
  { value: 1, emoji: '🪫', key: 'energy_drained' },
  { value: 2, emoji: '😴', key: 'energy_low' },
  { value: 3, emoji: '😌', key: 'energy_okay' },
  { value: 4, emoji: '🙂', key: 'energy_good' },
  { value: 5, emoji: '⚡', key: 'energy_high' }
]

function FaceScale({
  value,
  onChange,
  options
}: {
  value: number | undefined
  onChange: (v: number) => void
  options: typeof MOOD_OPTIONS
}): React.JSX.Element {
  const t = useT()
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'stretch',
        justifyContent: 'space-between',
        gap: 8
      }}
    >
      {options.map((opt) => {
        const active = value === opt.value
        return (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            style={{
              flex: 1,
              background: active ? 'var(--accent-soft)' : 'var(--bg-sunken)',
              border: '0.5px solid var(--line)',
              borderRadius: 12,
              padding: '16px 8px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 8,
              cursor: 'pointer',
              boxShadow: active ? 'inset 0 0 0 1.5px var(--accent)' : 'none',
              transition: 'background 120ms, box-shadow 120ms'
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
  )
}

function StepShell({
  title,
  subtitle,
  children
}: {
  title: string
  subtitle?: string
  children: React.ReactNode
}): React.JSX.Element {
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
          marginBottom: subtitle ? 8 : 28,
          fontWeight: 600,
          letterSpacing: '-0.02em'
        }}
      >
        {title}
      </div>
      {subtitle && (
        <div style={{ fontSize: 13.5, color: 'var(--ink-3)', lineHeight: 1.55, marginBottom: 28 }}>
          {subtitle}
        </div>
      )}
      {children}
    </div>
  )
}

function RitualIntro({
  showYesterday,
  yesterdayTotal,
  rating,
  onRate
}: {
  showYesterday: boolean
  yesterdayTotal: number
  rating: number | undefined
  onRate: (v: number) => void
}): React.JSX.Element {
  const t = useT()
  return (
    <div
      style={{
        height: '100%',
        padding: '48px 48px 28px',
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
          marginBottom: 14,
          fontWeight: 500
        }}
        className="tnum"
      >
        {todayLong()}
      </div>
      <div
        className="display"
        style={{
          fontSize: 38,
          lineHeight: 1.05,
          letterSpacing: '-0.025em',
          color: 'var(--ink)',
          fontWeight: 600,
          marginBottom: showYesterday ? 28 : 0
        }}
      >
        {t(greetingKey())}.
      </div>

      {showYesterday && (
        <>
          <div
            className="glass-2"
            style={{
              padding: 16,
              borderRadius: 14,
              border: '0.5px solid var(--line)',
              marginBottom: 20
            }}
          >
            <div
              style={{
                fontSize: 11,
                color: 'var(--ink-3)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: 6,
                fontWeight: 500
              }}
            >
              {t('yesterday')}
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
              <span style={{ fontSize: 13, color: 'var(--ink-3)' }}>
                {t('yesterday_focused_for')}
              </span>
              <span
                className="display tnum"
                style={{ fontSize: 26, color: 'var(--ink)', fontWeight: 600 }}
              >
                {fmtDuration(yesterdayTotal)}
              </span>
            </div>
          </div>
          <div
            style={{
              fontSize: 13,
              color: 'var(--ink-3)',
              lineHeight: 1.55,
              marginBottom: 14
            }}
          >
            {t('yesterday_question')}
          </div>
          <FaceScale value={rating} onChange={onRate} options={MOOD_OPTIONS} />
        </>
      )}
    </div>
  )
}

function RitualMood({
  value,
  onChange
}: {
  value: number | undefined
  onChange: (v: number) => void
}): React.JSX.Element {
  const t = useT()
  return (
    <StepShell title={t('mood_question')} subtitle={t('mood_subtitle')}>
      <FaceScale value={value} onChange={onChange} options={MOOD_OPTIONS} />
    </StepShell>
  )
}

function RitualEnergy({
  value,
  onChange
}: {
  value: number | undefined
  onChange: (v: number) => void
}): React.JSX.Element {
  const t = useT()
  return (
    <StepShell title={t('energy_question')} subtitle={t('energy_subtitle')}>
      <FaceScale value={value} onChange={onChange} options={ENERGY_OPTIONS} />
    </StepShell>
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
          marginBottom: 6,
          fontWeight: 600,
          letterSpacing: '-0.02em'
        }}
      >
        {t('daily_notes')}
      </div>
      <div
        style={{
          fontSize: 13,
          color: 'var(--ink-3)',
          lineHeight: 1.55,
          marginBottom: 18
        }}
      >
        {t('daily_notes_hint')}
      </div>
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

function RitualGoals({
  goals,
  onChange,
  overarchingGoal
}: {
  goals: string[]
  onChange: (g: string[]) => void
  overarchingGoal: string
}): React.JSX.Element {
  const t = useT()
  const list = goals.length === 0 ? [''] : goals
  const lastRef = useRef<HTMLInputElement | null>(null)
  useEffect(() => {
    lastRef.current?.focus()
  }, [list.length])

  const setAt = (i: number, v: string): void => {
    const next = list.slice()
    next[i] = v
    onChange(next.filter((s, idx) => idx === next.length - 1 || s.trim().length > 0))
  }
  const removeAt = (i: number): void => {
    onChange(list.filter((_, idx) => idx !== i))
  }
  const addBlank = (): void => {
    onChange([...list, ''])
  }

  return (
    <div
      style={{
        height: '100%',
        padding: '40px 48px 24px',
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
          <div style={{ fontSize: 14, color: 'var(--ink-2)', lineHeight: 1.45, marginBottom: 24 }}>
            {overarchingGoal}
          </div>
        </>
      )}
      <div
        className="display"
        style={{
          fontSize: 26,
          lineHeight: 1.2,
          color: 'var(--ink)',
          marginBottom: 16,
          fontWeight: 600,
          letterSpacing: '-0.02em'
        }}
      >
        {t('one_thing_today')}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {list.map((g, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span
              style={{
                width: 5,
                height: 5,
                borderRadius: '50%',
                background: 'var(--accent)',
                flexShrink: 0
              }}
            />
            <input
              ref={i === list.length - 1 ? lastRef : null}
              value={g}
              onChange={(e) => setAt(i, e.target.value)}
              className="focus-ring display"
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                outline: 'none',
                borderBottom: '1px solid var(--line-strong)',
                fontSize: 18,
                lineHeight: 1.4,
                padding: '6px 0',
                color: 'var(--ink)',
                fontWeight: 500,
                letterSpacing: '-0.01em'
              }}
            />
            {list.length > 1 && (
              <button
                onClick={() => removeAt(i)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--ink-4)',
                  padding: 4,
                  cursor: 'pointer',
                  display: 'inline-flex'
                }}
                aria-label="Remove"
              >
                <Icon name="x" size={14} />
              </button>
            )}
          </div>
        ))}
        <button
          onClick={addBlank}
          style={{
            alignSelf: 'flex-start',
            marginLeft: 13,
            background: 'transparent',
            border: 'none',
            color: 'var(--ink-3)',
            fontSize: 13,
            fontWeight: 500,
            padding: '4px 0',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            cursor: 'pointer',
            opacity: 0.35,
            transition: 'opacity 120ms ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = '0.75'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = '0.35'
          }}
        >
          <Icon name="plus" size={14} /> {t('add_goal')}
        </button>
      </div>
    </div>
  )
}

type StepKey = 'intro' | 'mood' | 'energy' | 'notes' | 'goals'

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
  const showYesterday = yesterdayTotal > 0 || !!yesterdayEntry

  const existing = entries[today]
  const [mood, setMood] = useState<number | undefined>(existing?.mood)
  const [energy, setEnergy] = useState<number | undefined>(existing?.energy)
  const [yesterdayRating, setYesterdayRating] = useState<number | undefined>(
    yesterdayEntry?.dayRating
  )
  const [brainDump, setBrainDump] = useState(existing?.brainDump || '')
  const [goals, setGoals] = useState<string[]>(existing?.goals || [])

  const stepKeys: StepKey[] = useMemo(
    () => ['intro', 'mood', 'energy', 'notes', 'goals'],
    []
  )
  const total = stepKeys.length

  const [step, setStep] = useState(0)
  const stepKey = stepKeys[step]

  const finish = async (): Promise<void> => {
    const cleanedGoals = goals.map((g) => g.trim()).filter(Boolean)
    const next: DailyEntry = {
      date: today,
      goals: cleanedGoals,
      brainDump,
      sessions: existing?.sessions || [],
      mood,
      energy,
      dayRating: existing?.dayRating
    }
    upsertEntry(next)
    await window.api.store.updateEntry(next)

    if (showYesterday && yesterdayRating !== undefined) {
      const yEntry: DailyEntry = yesterdayEntry
        ? { ...yesterdayEntry, dayRating: yesterdayRating }
        : {
            date: yesterday,
            goals: [],
            brainDump: '',
            sessions: [],
            dayRating: yesterdayRating
          }
      upsertEntry(yEntry)
      await window.api.store.updateEntry(yEntry)
    }

    await window.api.showTrayWindow()
    window.api.window.closeSelf()
  }

  const isLastStep = step === total - 1
  const canAdvance = (() => {
    if (stepKey === 'mood') return mood !== undefined
    if (stepKey === 'energy') return energy !== undefined
    if (stepKey === 'goals') return goals.some((g) => g.trim().length > 0)
    return true
  })()

  const handlePrimary = (): void => {
    if (isLastStep) finish()
    else setStep(step + 1)
  }

  const primaryLabel =
    stepKey === 'intro'
      ? t('begin')
      : isLastStep
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
          {stepKey === 'intro' && (
            <RitualIntro
              showYesterday={showYesterday}
              yesterdayTotal={yesterdayTotal}
              rating={yesterdayRating}
              onRate={setYesterdayRating}
            />
          )}
          {stepKey === 'mood' && <RitualMood value={mood} onChange={setMood} />}
          {stepKey === 'energy' && <RitualEnergy value={energy} onChange={setEnergy} />}
          {stepKey === 'notes' && <RitualBrainDump value={brainDump} onChange={setBrainDump} />}
          {stepKey === 'goals' && (
            <RitualGoals
              goals={goals}
              onChange={setGoals}
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
            {stepKey === 'notes' && !brainDump.trim() && (
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
