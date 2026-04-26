import { useMemo, useState } from 'react'
import { useDailyStore } from '../../store/useDailyStore'
import { Icon } from '../../design/Icon'
import { fmtDuration, fmtTimeOfDay, dateKey, nowWithOffset } from '../../design/format'
import type { Session } from '../../../../shared/types'

function pad2(n: number): string {
  return String(n).padStart(2, '0')
}

function ymd(year: number, month: number, day: number): string {
  return `${year}-${pad2(month + 1)}-${pad2(day)}`
}

function NavBtn({ icon, onClick }: { icon: 'arrow-left' | 'arrow-right'; onClick: () => void }): React.JSX.Element {
  return (
    <button
      onClick={onClick}
      style={{
        width: 26,
        height: 26,
        borderRadius: 8,
        border: 'none',
        background: 'transparent',
        color: 'var(--ink-3)',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer'
      }}
    >
      <Icon name={icon} size={13} />
    </button>
  )
}

function Stat({ label, value }: { label: string; value: string | number }): React.JSX.Element {
  return (
    <div>
      <div
        style={{
          fontSize: 10,
          color: 'var(--ink-4)',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          fontWeight: 500
        }}
      >
        {label}
      </div>
      <div
        className="display tnum"
        style={{ fontSize: 22, color: 'var(--ink)', fontWeight: 600 }}
      >
        {value}
      </div>
    </div>
  )
}

function DayCell({
  day,
  seconds,
  isToday,
  selected,
  onClick
}: {
  day: number | null
  seconds: number
  isToday: boolean
  selected: boolean
  onClick: () => void
}): React.JSX.Element {
  if (day == null) return <div style={{ aspectRatio: '1 / 1' }} />
  const intensity = Math.min(1, seconds / (4 * 3600))
  const hasLoad = seconds > 0
  return (
    <button
      onClick={onClick}
      style={{
        position: 'relative',
        aspectRatio: '1 / 1',
        background: hasLoad
          ? `color-mix(in oklch, var(--accent) ${15 + intensity * 65}%, transparent)`
          : 'var(--bg-sunken)',
        border: selected
          ? '1.5px solid var(--ink)'
          : isToday
            ? '1px solid var(--accent)'
            : '0.5px solid var(--line)',
        borderRadius: 8,
        color: hasLoad && intensity > 0.55 ? 'white' : 'var(--ink-2)',
        fontSize: 12,
        fontWeight: 500,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'flex-end',
        padding: 4,
        cursor: 'pointer',
        transition: 'transform 100ms'
      }}
    >
      <span className="tnum">{day}</span>
      {isToday && (
        <span
          style={{
            position: 'absolute',
            bottom: 4,
            left: 4,
            width: 4,
            height: 4,
            borderRadius: 4,
            background: 'var(--accent)'
          }}
        />
      )}
    </button>
  )
}

export function CalendarTab(): React.JSX.Element {
  const sessions = useDailyStore((s) => s.sessions)
  const entries = useDailyStore((s) => s.entries)
  const settings = useDailyStore((s) => s.settings)

  const todayDateMs = nowWithOffset(settings.devDayOffset)
  const today = new Date(todayDateMs)
  const [view, setView] = useState({ year: today.getFullYear(), month: today.getMonth() })
  const todayStr = dateKey(todayDateMs, settings.dayRolloverHour)
  const [selectedDate, setSelectedDate] = useState<string>(todayStr)

  const sessionsByDate = useMemo(() => {
    const map: Record<string, Session[]> = {}
    for (const s of Object.values(sessions)) {
      if (s.endTime === null) continue
      ;(map[s.date] ||= []).push(s)
    }
    for (const k of Object.keys(map)) map[k].sort((a, b) => a.startTime - b.startTime)
    return map
  }, [sessions])

  const monthLabel = new Date(view.year, view.month, 1).toLocaleDateString(undefined, {
    month: 'long',
    year: 'numeric'
  })

  const firstDay = new Date(view.year, view.month, 1).getDay()
  const daysInMonth = new Date(view.year, view.month + 1, 0).getDate()
  const cells: (number | null)[] = []
  for (let i = 0; i < firstDay; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)
  while (cells.length < 42) cells.push(null)

  const selSessions = sessionsByDate[selectedDate] || []
  const selEntry = entries[selectedDate]
  const selTotalSeconds = selSessions.reduce((acc, s) => acc + s.duration, 0)
  const monthTotalSeconds = Object.entries(sessionsByDate)
    .filter(([k]) => k.startsWith(`${view.year}-${pad2(view.month + 1)}-`))
    .reduce((acc, [, list]) => acc + list.reduce((a, s) => a + s.duration, 0), 0)

  const stepMonth = (delta: number): void => {
    const m = view.month + delta
    const y = view.year + Math.floor(m / 12)
    const month = ((m % 12) + 12) % 12
    setView({ year: y, month })
  }

  const isToday = (day: number): boolean => ymd(view.year, view.month, day) === todayStr

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.25fr 1fr', height: '100%' }}>
      <div style={{ padding: '24px 28px', borderRight: '0.5px solid var(--line)' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 18
          }}
        >
          <h2
            className="display"
            style={{
              fontSize: 20,
              margin: 0,
              color: 'var(--ink)',
              fontWeight: 600,
              letterSpacing: '-0.015em'
            }}
          >
            {monthLabel}
          </h2>
          <div style={{ display: 'flex', gap: 4 }}>
            <NavBtn icon="arrow-left" onClick={() => stepMonth(-1)} />
            <NavBtn icon="arrow-right" onClick={() => stepMonth(1)} />
          </div>
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: 4,
            marginBottom: 6
          }}
        >
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
            <div
              key={i}
              style={{
                fontSize: 10,
                color: 'var(--ink-4)',
                textAlign: 'center',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                padding: '4px 0',
                fontWeight: 500
              }}
            >
              {d}
            </div>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
          {cells.map((d, i) => {
            const dateStr = d == null ? '' : ymd(view.year, view.month, d)
            const total = d == null ? 0 : (sessionsByDate[dateStr] || []).reduce((a, s) => a + s.duration, 0)
            return (
              <DayCell
                key={i}
                day={d}
                seconds={total}
                isToday={d != null && isToday(d)}
                selected={dateStr !== '' && dateStr === selectedDate}
                onClick={() => d && setSelectedDate(dateStr)}
              />
            )
          })}
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginTop: 22,
            fontSize: 11,
            color: 'var(--ink-4)'
          }}
        >
          <span>Less</span>
          {[0, 0.25, 0.55, 0.85, 1].map((o, i) => (
            <span
              key={i}
              style={{
                width: 14,
                height: 14,
                borderRadius: 4,
                background: o === 0 ? 'var(--bg-sunken)' : 'var(--accent)',
                opacity: o === 0 ? 1 : o,
                border: '0.5px solid var(--line)'
              }}
            />
          ))}
          <span>More</span>
          <div style={{ flex: 1 }} />
          <span className="tnum">
            {monthLabel.split(' ')[0].slice(0, 3)} · {fmtDuration(monthTotalSeconds)} logged
          </span>
        </div>
      </div>

      <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column' }}>
        <div
          style={{
            fontSize: 11,
            color: 'var(--ink-3)',
            textTransform: 'uppercase',
            letterSpacing: '0.10em',
            marginBottom: 4,
            fontWeight: 500
          }}
        >
          {selectedDate === todayStr
            ? 'Today'
            : new Date(selectedDate).toLocaleDateString(undefined, {
                month: 'long',
                day: 'numeric',
                year: 'numeric'
              })}
        </div>
        {selEntry?.mainGoal ? (
          <div
            className="display"
            style={{
              fontSize: 22,
              color: 'var(--ink)',
              lineHeight: 1.25,
              marginBottom: 14,
              letterSpacing: '-0.02em',
              fontWeight: 600
            }}
          >
            {selEntry.mainGoal}
          </div>
        ) : (
          <div
            className="display"
            style={{
              fontSize: 22,
              color: 'var(--ink-4)',
              marginBottom: 14,
              fontWeight: 500
            }}
          >
            {selSessions.length === 0 ? 'A quiet day.' : 'No goal logged.'}
          </div>
        )}

        {selSessions.length > 0 && (
          <div style={{ display: 'flex', gap: 16, marginBottom: 18 }}>
            <Stat label="Focused" value={fmtDuration(selTotalSeconds)} />
            <Stat label="Sessions" value={selSessions.length} />
          </div>
        )}

        {selEntry?.brainDump && (
          <div
            className="glass-2"
            style={{
              borderRadius: 10,
              padding: 12,
              fontSize: 13,
              color: 'var(--ink-2)',
              lineHeight: 1.55,
              marginBottom: 18,
              border: '0.5px solid var(--line)'
            }}
          >
            {selEntry.brainDump}
          </div>
        )}

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
          Sessions
        </div>
        <div style={{ flex: 1, overflow: 'auto' }} className="thin-scroll">
          {selSessions.length === 0 ? (
            <div style={{ fontSize: 13, color: 'var(--ink-4)' }}>—</div>
          ) : (
            selSessions.map((s, i) => (
              <div
                key={s.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '8px 0',
                  fontSize: 13,
                  color: 'var(--ink-2)',
                  borderBottom:
                    i === selSessions.length - 1 ? 'none' : '0.5px solid var(--line)'
                }}
              >
                <span className="tnum">{fmtTimeOfDay(new Date(s.startTime))}</span>
                <span className="tnum">{fmtDuration(s.duration)}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
