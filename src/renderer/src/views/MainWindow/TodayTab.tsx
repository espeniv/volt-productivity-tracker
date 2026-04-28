import { useEffect, useRef } from 'react'
import { useDailyStore } from '../../store/useDailyStore'
import { Icon } from '../../design/Icon'
import { fmtDuration, fmtTimeOfDay, dateKey, nowWithOffset } from '../../design/format'
import { useT } from '../../i18n/useT'
import type { DailyEntry, Session } from '../../../../shared/types'

const MOOD_EMOJI: Record<number, string> = { 1: '☹️', 2: '🙁', 3: '😐', 4: '🙂', 5: '😊' }
const ENERGY_EMOJI: Record<number, string> = { 1: '🪫', 2: '😴', 3: '😌', 4: '🙂', 5: '⚡' }

function SessionBar({ duration }: { duration: number }): React.JSX.Element {
  const pct = Math.min(1, duration / (90 * 60))
  return (
    <div
      style={{
        flex: 1,
        height: 5,
        background: 'var(--bg-sunken)',
        borderRadius: 999,
        overflow: 'hidden'
      }}
    >
      <div
        style={{
          width: `${pct * 100}%`,
          height: '100%',
          background: 'var(--accent)',
          opacity: 0.85
        }}
      />
    </div>
  )
}

function AutoTextarea({
  value,
  onChange,
  placeholder
}: {
  value: string
  onChange: (v: string) => void
  placeholder: string
}): React.JSX.Element {
  const ref = useRef<HTMLTextAreaElement | null>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.max(el.scrollHeight, 56)}px`
  }, [value])
  return (
    <textarea
      ref={ref}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="focus-ring daily-notes"
      rows={2}
      style={{
        width: '100%',
        minHeight: 40,
        resize: 'none',
        overflow: 'hidden',
        background: 'transparent',
        border: 'none',
        outline: 'none',
        padding: 0,
        color: 'var(--ink-2)',
        fontSize: 14,
        lineHeight: 1.6,
        fontFamily: 'var(--font-sans)'
      }}
    />
  )
}

function MorningGate(): React.JSX.Element {
  const t = useT()
  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 6%'
      }}
    >
      <div style={{ textAlign: 'center', maxWidth: 380 }}>
        <div
          className="display"
          style={{
            fontSize: 24,
            lineHeight: 1.25,
            fontWeight: 600,
            color: 'var(--ink)',
            letterSpacing: '-0.01em',
            marginBottom: 8
          }}
        >
          {t('morning_not_done_title')}
        </div>
        <div style={{ fontSize: 14, color: 'var(--ink-3)', lineHeight: 1.55, marginBottom: 22 }}>
          {t('morning_not_done_sub')}
        </div>
        <button
          onClick={() => window.api.openMorningRitual()}
          className="focus-ring"
          style={{
            height: 44,
            padding: '0 22px',
            background: 'var(--accent)',
            color: 'var(--accent-ink)',
            border: 'none',
            borderRadius: 999,
            fontSize: 14,
            fontWeight: 500,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            cursor: 'pointer',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <Icon name="play" size={13} />
          <span>{t('start_check_in')}</span>
        </button>
      </div>
    </div>
  )
}

export function TodayTab(): React.JSX.Element {
  const settings = useDailyStore((s) => s.settings)
  const entries = useDailyStore((s) => s.entries)
  const sessions = useDailyStore((s) => s.sessions)
  const upsertEntry = useDailyStore((s) => s.upsertEntry)
  const t = useT()

  const today = dateKey(nowWithOffset(settings.devDayOffset), settings.dayRolloverHour)
  const entry: DailyEntry = entries[today] || {
    date: today,
    goals: [],
    brainDump: '',
    sessions: []
  }

  const morningDone = entry.goals.length > 0
  if (!morningDone) return <MorningGate />

  const todaysSessions: Session[] = Object.values(sessions)
    .filter((s) => s.date === today && s.endTime !== null)
    .sort((a, b) => a.startTime - b.startTime)

  const totalToday = todaysSessions.reduce((acc, s) => acc + s.duration, 0)

  const pendingRef = useRef(entry)
  pendingRef.current = entry
  const flushTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const flush = (): void => {
    if (flushTimerRef.current) {
      clearTimeout(flushTimerRef.current)
      flushTimerRef.current = null
    }
    window.api.store.updateEntry(pendingRef.current)
  }

  useEffect(() => {
    return () => {
      if (flushTimerRef.current) {
        clearTimeout(flushTimerRef.current)
        window.api.store.updateEntry(pendingRef.current)
      }
    }
  }, [])

  const persist = (patch: Partial<DailyEntry>, immediate = false): void => {
    const next = { ...entry, ...patch }
    pendingRef.current = next
    upsertEntry(next)
    if (immediate) {
      flush()
      return
    }
    if (flushTimerRef.current) clearTimeout(flushTimerRef.current)
    flushTimerRef.current = setTimeout(flush, 350)
  }

  const setGoalAt = (i: number, v: string): void => {
    const next = entry.goals.slice()
    next[i] = v
    persist({ goals: next })
  }
  const removeGoalAt = (i: number): void => {
    persist({ goals: entry.goals.filter((_, idx) => idx !== i) }, true)
  }
  const addGoal = (): void => {
    persist({ goals: [...entry.goals, ''] }, true)
  }

  return (
    <div style={{ padding: '32px 6% 44px', width: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, marginBottom: 6 }}>
        <div
          style={{
            fontSize: 11,
            color: 'var(--ink-3)',
            textTransform: 'uppercase',
            letterSpacing: '0.10em',
            fontWeight: 500
          }}
        >
          {t('goals_label')}
        </div>
        {(entry.mood || entry.energy) && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              marginLeft: 'auto',
              fontSize: 13,
              color: 'var(--ink-3)'
            }}
          >
            {entry.mood && (
              <span style={{ display: 'inline-flex', gap: 6, alignItems: 'center' }}>
                <span style={{ fontSize: 18 }}>{MOOD_EMOJI[entry.mood]}</span>
                <span>{t('mood_label')}</span>
              </span>
            )}
            {entry.energy && (
              <span style={{ display: 'inline-flex', gap: 6, alignItems: 'center' }}>
                <span style={{ fontSize: 18 }}>{ENERGY_EMOJI[entry.energy]}</span>
                <span>{t('energy_label')}</span>
              </span>
            )}
          </div>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 12 }}>
        {entry.goals.map((g, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: 'var(--accent)',
                flexShrink: 0
              }}
            />
            <input
              value={g}
              onChange={(e) => setGoalAt(i, e.target.value)}
              className="display focus-ring"
              style={{
                fieldSizing: 'content',
                minWidth: 220,
                maxWidth: '100%',
                background: 'transparent',
                border: 'none',
                outline: 'none',
                fontSize: 22,
                padding: '4px 0',
                color: 'var(--ink)',
                fontWeight: 600,
                letterSpacing: '-0.015em'
              }}
            />
            {entry.goals.length > 1 && (
              <button
                onClick={() => removeGoalAt(i)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--ink-4)',
                  padding: 4,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center'
                }}
                aria-label="Remove"
              >
                <Icon name="x" size={14} />
              </button>
            )}
          </div>
        ))}
        <button
          onClick={addGoal}
          style={{
            alignSelf: 'flex-start',
            background: 'transparent',
            border: 'none',
            color: 'var(--ink-3)',
            fontSize: 12.5,
            fontWeight: 500,
            padding: '4px 0',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            cursor: 'pointer',
            marginTop: 2
          }}
        >
          <Icon name="plus" size={13} /> {t('add_goal')}
        </button>
      </div>

      {settings.overarchingGoal && (
        <div style={{ fontSize: 13, color: 'var(--ink-4)', marginTop: 14 }}>
          {t('working_toward')}:{' '}
          <span style={{ color: 'var(--ink-3)' }}>{settings.overarchingGoal}</span>
        </div>
      )}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 32,
          marginTop: 32
        }}
      >
        <section>
          <div
            style={{
              height: 24,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 14
            }}
          >
            <h3
              style={{
                fontSize: 11,
                fontWeight: 500,
                color: 'var(--ink-3)',
                textTransform: 'uppercase',
                letterSpacing: '0.10em',
                margin: 0
              }}
            >
              {t('sessions_label')}
            </h3>
            <span style={{ fontSize: 12, color: 'var(--ink-3)' }}>
              <span
                className="display tnum"
                style={{ fontSize: 17, color: 'var(--ink)', fontWeight: 600 }}
              >
                {fmtDuration(totalToday)}
              </span>{' '}
              {t('total_label')}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {todaysSessions.length === 0 ? (
              <div
                style={{
                  padding: 22,
                  textAlign: 'center',
                  background: 'var(--bg-sunken)',
                  borderRadius: 10,
                  fontSize: 13,
                  color: 'var(--ink-3)'
                }}
              >
                {t('no_sessions_today')}
              </div>
            ) : (
              todaysSessions.map((s, i) => (
                <div
                  key={s.id}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '60px 1fr auto',
                    gap: 12,
                    alignItems: 'center',
                    padding: '12px 0',
                    borderBottom:
                      i === todaysSessions.length - 1 ? 'none' : '0.5px solid var(--line)'
                  }}
                >
                  <div className="tnum" style={{ fontSize: 13, color: 'var(--ink-3)' }}>
                    {fmtTimeOfDay(new Date(s.startTime), settings.language)}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span
                      style={{
                        width: 5,
                        height: 5,
                        borderRadius: '50%',
                        background: 'var(--accent)'
                      }}
                    />
                    <SessionBar duration={s.duration} />
                  </div>
                  <div
                    className="tnum display"
                    style={{ fontSize: 16, color: 'var(--ink)', fontWeight: 600 }}
                  >
                    {fmtDuration(s.duration)}
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        <section>
          <div
            style={{
              height: 24,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 14
            }}
          >
            <h3
              style={{
                fontSize: 11,
                fontWeight: 500,
                color: 'var(--ink-3)',
                textTransform: 'uppercase',
                letterSpacing: '0.10em',
                margin: 0
              }}
            >
              {t('daily_notes')}
            </h3>
          </div>
          <AutoTextarea
            value={entry.brainDump}
            onChange={(v) => persist({ brainDump: v })}
            placeholder={t('notes_placeholder')}
          />
        </section>
      </div>
    </div>
  )
}
