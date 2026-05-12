import { useEffect, useRef, useState } from 'react'
import { useDailyStore } from '../store/useDailyStore'
import { Icon } from '../design/Icon'
import { Divider } from '../design/Buttons'
import { fmtClock, fmtDuration, todayLong, dateKey } from '../design/format'
import { useT } from '../i18n/useT'
import type { CSSProperties } from 'react'

const MENU_W = 320

function useNowTick(rolloverHour: number): number {
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout> | null = null

    const scheduleNextMidnight = (): void => {
      // dateKey() uses the UTC date of (now - rollover), so the next key-change is
      // the next UTC midnight in adjusted time.
      const adjusted = Date.now() - rolloverHour * 3600_000
      const nextUtcMidnight = (Math.floor(adjusted / 86400_000) + 1) * 86400_000
      const msUntil = nextUtcMidnight - adjusted + 5_000
      timeout = setTimeout(() => {
        setNow(Date.now())
        scheduleNextMidnight()
      }, msUntil)
    }
    scheduleNextMidnight()

    const refresh = (): void => setNow(Date.now())
    window.addEventListener('focus', refresh)
    document.addEventListener('visibilitychange', refresh)

    return () => {
      if (timeout) clearTimeout(timeout)
      window.removeEventListener('focus', refresh)
      document.removeEventListener('visibilitychange', refresh)
    }
  }, [rolloverHour])

  return now
}

function useTodayKey(): string {
  const rollover = useDailyStore((s) => s.settings.dayRolloverHour)
  const offset = useDailyStore((s) => s.settings.devDayOffset)
  const now = useNowTick(rollover)
  return dateKey(now + offset * 86400_000, rollover)
}

function useTodaysSessions(): { totalSeconds: number; count: number } {
  const sessions = useDailyStore((s) => s.sessions)
  const today = useTodayKey()
  let total = 0
  let count = 0
  for (const sess of Object.values(sessions)) {
    if (sess.date === today) {
      total += sess.duration
      count++
    }
  }
  return { totalSeconds: total, count }
}

function useLiveSeconds(): number {
  const timer = useDailyStore((s) => s.timer)
  const [, force] = useState(0)
  useEffect(() => {
    if (timer.status !== 'running') return
    const i = setInterval(() => force((n) => n + 1), 1000)
    return () => clearInterval(i)
  }, [timer.status])
  const baseMs = timer.accumulatedMs + (timer.startedAt ? Date.now() - timer.startedAt : 0)
  return Math.floor(baseMs / 1000)
}

function pillButton(tone: 'accent' | 'ghost', full = true): CSSProperties {
  if (tone === 'accent') {
    return {
      width: full ? '100%' : 'auto',
      height: 36,
      background: 'var(--accent)',
      color: 'var(--accent-ink)',
      border: '1px solid transparent',
      borderRadius: 10,
      fontSize: 13.5,
      fontWeight: 500,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 7,
      boxShadow: '0 1px 2px rgba(15,22,35,0.12), inset 0 1px 0 rgba(255,255,255,0.20)',
      transition: 'background 120ms, transform 120ms',
      letterSpacing: '-0.005em',
      cursor: 'pointer'
    }
  }
  return {
    width: full ? '100%' : 'auto',
    height: 36,
    background: 'transparent',
    color: 'var(--ink)',
    border: '1px solid var(--line-strong)',
    borderRadius: 10,
    fontSize: 13.5,
    fontWeight: 500,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    transition: 'background 120ms, transform 120ms',
    letterSpacing: '-0.005em',
    cursor: 'pointer'
  }
}

function DragStrip(): React.JSX.Element {
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        // Stop short of the corner controls so the buttons stay clickable.
        right: 70,
        height: 28,
        zIndex: 0,
        // @ts-expect-error - non-standard CSS for window dragging
        WebkitAppRegion: 'drag'
      }}
    />
  )
}

const cornerBtn: CSSProperties = {
  width: 24,
  height: 24,
  borderRadius: 6,
  background: 'transparent',
  border: 'none',
  outline: 'none',
  color: 'var(--ink-3)',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  transition: 'color 120ms ease',
  // @ts-expect-error - non-standard CSS region toggle for the drag strip
  WebkitAppRegion: 'no-drag'
}

function CornerControls({ alignTop }: { alignTop: number }): React.JSX.Element {
  const t = useT()
  const pinned = useDailyStore((s) => s.settings.pinTray)
  return (
    <div
      style={{
        position: 'absolute',
        top: alignTop,
        right: 12,
        display: 'inline-flex',
        gap: 2,
        zIndex: 1
      }}
    >
      {pinned && (
        <button
          onClick={async () => {
            await window.api.tray.setPinned(false)
            await window.api.hideTrayWindow()
          }}
          title={t('minimize_to_tray')}
          aria-label={t('minimize_to_tray')}
          style={cornerBtn}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = 'var(--ink)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--ink-3)'
          }}
        >
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 4h16" />
            <path d="M12 20V10" />
            <path d="M7 15l5-5 5 5" />
          </svg>
        </button>
      )}
      <button
        onClick={() => {
          window.api.showMainWindow()
          window.api.hideTrayWindow()
        }}
        title={t('open_app')}
        aria-label={t('open_app')}
        style={cornerBtn}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = 'var(--ink)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = 'var(--ink-3)'
        }}
      >
        <svg
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M14 4h6v6" />
          <path d="M20 4L12 12" />
          <path d="M19 13v5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h5" />
        </svg>
      </button>
    </div>
  )
}

function IdleStart({
  totalToday,
  sessionsLogged
}: {
  totalToday: number
  sessionsLogged: number
}): React.JSX.Element {
  const t = useT()
  return (
    <div>
      <button
        onClick={() => window.api.timer.start()}
        className="focus-ring"
        style={{
          width: '100%',
          height: 56,
          background: 'var(--accent)',
          color: 'var(--accent-ink)',
          border: 'none',
          borderRadius: 14,
          fontSize: 15,
          fontWeight: 500,
          letterSpacing: '-0.005em',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 10,
          boxShadow: '0 4px 14px -4px var(--accent-ring), inset 0 1px 0 rgba(255,255,255,0.22)',
          transition: 'transform 120ms',
          cursor: 'pointer'
        }}
      >
        <Icon name="play" size={15} />
        <span>{t('start_session')}</span>
      </button>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: 12
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              fontSize: 10.5,
              color: 'var(--ink-4)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: 2,
              fontWeight: 500
            }}
          >
            {t('today')}
          </div>
          <div className="tnum" style={{ fontSize: 16, color: 'var(--ink-2)', fontWeight: 500 }}>
            {totalToday > 0 ? fmtDuration(totalToday) : t('not_started')}
            {totalToday > 0 && (
              <span
                style={{ color: 'var(--ink-4)', fontWeight: 400, marginLeft: 6, fontSize: 12.5 }}
              >
                · {sessionsLogged} {sessionsLogged === 1 ? t('session_one') : t('session_many')}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function ActiveTimer({
  seconds,
  paused
}: {
  seconds: number
  paused: boolean
}): React.JSX.Element {
  const t = useT()
  return (
    <div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          marginBottom: 10
        }}
      >
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: paused ? 'var(--ink-4)' : 'var(--accent)',
            boxShadow: paused ? 'none' : '0 0 0 0 var(--accent-ring)',
            animation: paused ? 'none' : 'dailyPulse 2.2s ease-out infinite'
          }}
        />
        <span
          style={{
            fontSize: 12,
            color: 'var(--ink-3)',
            letterSpacing: '0.02em',
            fontWeight: 500
          }}
        >
          {paused ? t('paused') : t('focusing')}
        </span>
      </div>

      <div
        className="display tnum"
        style={{
          fontSize: 40,
          lineHeight: 1,
          color: 'var(--ink)',
          marginBottom: 14,
          letterSpacing: '-0.02em',
          fontWeight: 600,
          textAlign: 'center'
        }}
      >
        {fmtClock(seconds)}
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        <button
          onClick={() => (paused ? window.api.timer.resume() : window.api.timer.pause())}
          className="focus-ring"
          style={{
            flex: 1,
            height: 40,
            background: 'var(--accent)',
            color: 'var(--accent-ink)',
            border: 'none',
            borderRadius: 10,
            fontSize: 13,
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            cursor: 'pointer'
          }}
        >
          <Icon name={paused ? 'play' : 'pause'} size={12} />
          <span>{paused ? t('resume') : t('pause')}</span>
        </button>
        <button
          onClick={() => window.api.timer.stop()}
          className="focus-ring"
          title="End and log this session"
          style={{
            flex: 1,
            height: 40,
            background: 'var(--glass-flat)',
            color: 'var(--ink)',
            border: 'none',
            borderRadius: 10,
            fontSize: 13,
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.10)',
            cursor: 'pointer'
          }}
        >
          <Icon name="stop" size={11} />
          <span>{t('end_session')}</span>
        </button>
      </div>
      <style>{`
        @keyframes dailyPulse {
          0%   { box-shadow: 0 0 0 0 var(--accent-ring); }
          70%  { box-shadow: 0 0 0 10px transparent; }
          100% { box-shadow: 0 0 0 0 transparent; }
        }
      `}</style>
    </div>
  )
}

export function MenuDropdown(): React.JSX.Element {
  const timer = useDailyStore((s) => s.timer)
  const entries = useDailyStore((s) => s.entries)
  const lang = useDailyStore((s) => s.settings.language)
  const today = useTodayKey()
  const todaysEntry = entries[today]
  const { totalSeconds: totalToday, count: sessionsLogged } = useTodaysSessions()
  const liveSeconds = useLiveSeconds()
  const rootRef = useRef<HTMLDivElement | null>(null)
  const t = useT()

  useEffect(() => {
    const el = rootRef.current
    if (!el) return
    const ro = new ResizeObserver(() => {
      window.api.tray.resize(el.getBoundingClientRect().height)
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    // Strip any auto-applied focus from the first tabbable element when the
    // popover opens — macOS otherwise leaves a button looking pre-selected.
    const blur = (): void => {
      const active = document.activeElement
      if (active instanceof HTMLElement && active !== document.body) active.blur()
    }
    blur()
    const onShow = (): void => {
      requestAnimationFrame(blur)
    }
    window.addEventListener('focus', onShow)
    return () => window.removeEventListener('focus', onShow)
  }, [])

  const wrap: CSSProperties = {
    width: MENU_W,
    background: 'var(--glass)',
    backdropFilter: 'var(--blur)',
    WebkitBackdropFilter: 'var(--blur)',
    color: 'var(--ink)',
    borderRadius: 16,
    boxShadow: 'var(--shadow-glass)',
    border: '0.5px solid var(--line-strong)',
    overflow: 'hidden',
    fontFamily: 'var(--font-sans)',
    position: 'relative'
  }

  const isActive = timer.status === 'running' || timer.status === 'paused'
  const goals = todaysEntry?.goals?.filter((g) => g.trim().length > 0) || []
  const hasGoal = goals.length > 0

  // Pre-ritual: no main goal set today and timer idle
  if (!hasGoal && !isActive) {
    return (
      <div ref={rootRef} style={wrap}>
        <div style={{ padding: '20px 18px 14px', textAlign: 'center' }}>
          <div
            style={{
              fontSize: 11,
              color: 'var(--ink-3)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: 12,
              fontWeight: 500
            }}
          >
            {t('good_morning')}
          </div>
          <div
            className="display"
            style={{ fontSize: 22, lineHeight: 1.2, color: 'var(--ink)', marginBottom: 4 }}
          >
            {t('start_your_day')}
          </div>
          <div
            style={{
              fontSize: 13,
              color: 'var(--ink-3)',
              lineHeight: 1.5,
              marginBottom: 16
            }}
          >
            {t('two_minutes_focus')}
          </div>
          <button
            onClick={() => {
              window.api.openMorningRitual()
              window.api.hideTrayWindow()
            }}
            className="focus-ring"
            style={pillButton('accent')}
          >
            <span>{t('begin')}</span>
            <Icon name="arrow-right" size={14} />
          </button>
        </div>
        <DragStrip />
        <CornerControls alignTop={14} />
      </div>
    )
  }

  return (
    <div ref={rootRef} style={wrap}>
      <CornerControls alignTop={hasGoal ? 12 : 14} />
      {hasGoal && (
        <>
          <div style={{ padding: '16px 18px 14px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                marginBottom: 8
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  color: 'var(--ink-3)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  fontWeight: 500
                }}
              >
                {t('todays_goal')}
              </div>
              <div style={{ fontSize: 11, color: 'var(--ink-4)' }} className="tnum">
                · {todayLong(new Date(), lang).split(',')[0]}
              </div>
            </div>
            <div
              className="display"
              style={{
                fontSize: 17,
                lineHeight: 1.35,
                color: 'var(--ink)',
                fontWeight: 500,
                letterSpacing: '-0.01em',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                gap: 4
              }}
            >
              {goals.map((g, i) => (
                <span key={i}>{g}</span>
              ))}
            </div>
          </div>
          <Divider />
        </>
      )}

      <div style={{ padding: '16px 18px 16px' }}>
        {isActive ? (
          <ActiveTimer seconds={liveSeconds} paused={timer.status === 'paused'} />
        ) : (
          <IdleStart totalToday={totalToday} sessionsLogged={sessionsLogged} />
        )}
      </div>
      <DragStrip />
    </div>
  )
}
