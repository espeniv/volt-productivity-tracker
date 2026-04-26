import { useState } from 'react'
import { useDailyStore } from '../../store/useDailyStore'
import { Icon } from '../../design/Icon'
import { fmtDuration, fmtTimeOfDay, dateKey } from '../../design/format'
import type { DailyEntry, Session } from '../../../../shared/types'

function todayKey(rolloverHour: number): string {
  return dateKey(Date.now(), rolloverHour)
}

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

export function TodayTab(): React.JSX.Element {
  const settings = useDailyStore((s) => s.settings)
  const entries = useDailyStore((s) => s.entries)
  const sessions = useDailyStore((s) => s.sessions)
  const upsertEntry = useDailyStore((s) => s.upsertEntry)

  const today = todayKey(settings.dayRolloverHour)
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
  const [editingDump, setEditingDump] = useState(false)

  const persist = (patch: Partial<DailyEntry>): void => {
    const next = { ...entry, ...patch }
    upsertEntry(next)
    window.api.store.updateEntry(next)
  }

  return (
    <div style={{ padding: '32px 44px 44px', maxWidth: 720 }}>
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
          Today&apos;s focus
        </div>
        <button
          onClick={() => setEditingGoal((v) => !v)}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--ink-4)',
            fontSize: 11,
            padding: 0,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            cursor: 'pointer'
          }}
        >
          <Icon name="edit" size={11} /> {editingGoal ? 'done' : 'edit'}
        </button>
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
          placeholder="Set today's focus"
          className="display focus-ring"
          style={{
            width: '100%',
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
          toward <span style={{ color: 'var(--ink-3)' }}>{settings.overarchingGoal}</span>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 32, marginTop: 32 }}>
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
              Sessions
            </h3>
            <span style={{ fontSize: 12, color: 'var(--ink-3)' }}>
              <span
                className="display tnum"
                style={{ fontSize: 17, color: 'var(--ink)', fontWeight: 600 }}
              >
                {fmtDuration(totalToday)}
              </span>{' '}
              total
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
                No sessions yet today. Start one from the menu bar.
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
              Brain dump
            </h3>
            <button
              onClick={() => setEditingDump((v) => !v)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--ink-4)',
                fontSize: 11,
                padding: 0,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                cursor: 'pointer'
              }}
            >
              <Icon name="edit" size={11} /> {editingDump ? 'done' : 'edit'}
            </button>
          </div>
          {editingDump || !entry.brainDump ? (
            <textarea
              autoFocus={editingDump}
              value={entry.brainDump}
              onChange={(e) => persist({ brainDump: e.target.value })}
              onBlur={() => setEditingDump(false)}
              placeholder="Anything noisy in your head…"
              className="focus-ring"
              style={{
                width: '100%',
                height: 160,
                resize: 'none',
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
          ) : (
            <div
              onClick={() => setEditingDump(true)}
              style={{
                width: '100%',
                minHeight: 100,
                padding: 14,
                background: 'var(--bg-sunken)',
                borderRadius: 10,
                border: '0.5px solid var(--line)',
                fontSize: 14,
                lineHeight: 1.6,
                color: 'var(--ink-2)',
                whiteSpace: 'pre-wrap',
                cursor: 'text'
              }}
            >
              {entry.brainDump}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
