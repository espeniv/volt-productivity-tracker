import { useEffect, useRef, useState } from 'react'
import { useDailyStore } from '../../store/useDailyStore'
import { fmtDuration, fmtTimeOfDay, dateKey, nowWithOffset } from '../../design/format'
import { useT } from '../../i18n/useT'
import type { DailyEntry, Session } from '../../../../shared/types'

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
        minHeight: 56,
        resize: 'none',
        overflow: 'hidden',
        background: 'var(--bg-sunken)',
        border: '0.5px solid var(--line)',
        borderRadius: 10,
        outline: 'none',
        padding: 14,
        color: 'var(--ink-2)',
        fontSize: 14,
        lineHeight: 1.6,
        fontFamily: 'var(--font-sans)'
      }}
    />
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
    mainGoal: '',
    brainDump: '',
    sessions: []
  }

  const todaysSessions: Session[] = Object.values(sessions)
    .filter((s) => s.date === today && s.endTime !== null)
    .sort((a, b) => a.startTime - b.startTime)

  const totalToday = todaysSessions.reduce((acc, s) => acc + s.duration, 0)

  const [editingGoal, setEditingGoal] = useState(false)

  const persist = (patch: Partial<DailyEntry>): void => {
    const next = { ...entry, ...patch }
    upsertEntry(next)
    window.api.store.updateEntry(next)
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
          {t('todays_goal')}
        </div>
      </div>

      {editingGoal || !entry.mainGoal ? (
        <input
          autoFocus
          value={entry.mainGoal}
          onChange={(e) => persist({ mainGoal: e.target.value })}
          onBlur={() => setEditingGoal(false)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') setEditingGoal(false)
          }}
          placeholder={t('set_today_goal')}
          className="display focus-ring"
          style={{
            display: 'inline-block',
            fieldSizing: 'content',
            maxWidth: '100%',
            minWidth: 220,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            borderBottom: '1.5px solid var(--accent)',
            fontSize: 30,
            padding: '4px 0',
            color: 'var(--ink)',
            fontWeight: 600,
            letterSpacing: '-0.02em'
          }}
        />
      ) : (
        <div
          className="display"
          onClick={() => setEditingGoal(true)}
          style={{
            fontSize: 30,
            lineHeight: 1.2,
            color: 'var(--ink)',
            cursor: 'text',
            letterSpacing: '-0.02em',
            fontWeight: 600
          }}
        >
          {entry.mainGoal}
        </div>
      )}

      {settings.overarchingGoal && (
        <div style={{ fontSize: 13, color: 'var(--ink-4)', marginTop: 8 }}>
          {t('toward')} <span style={{ color: 'var(--ink-3)' }}>{settings.overarchingGoal}</span>
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
              display: 'flex',
              alignItems: 'baseline',
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
                    {fmtTimeOfDay(new Date(s.startTime))}
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
              display: 'flex',
              alignItems: 'baseline',
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
