import { useEffect, useRef, useState } from 'react'
import { useDailyStore } from '../store/useDailyStore'
import { Icon } from '../design/Icon'
import { Divider } from '../design/Buttons'
import { fmtClock, fmtDuration, todayLong, dateKey, nowWithOffset } from '../design/format'
import { useT } from '../i18n/useT'
import type { CSSProperties } from 'react'

const MENU_W = 320

function useTodayKey(): string {
  const rollover = useDailyStore((s) => s.settings.dayRolloverHour)
  const offset = useDailyStore((s) => s.settings.devDayOffset)
  return dateKey(nowWithOffset(offset), rollover)
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

function FooterRow({ secondary }: { secondary?: string }): React.JSX.Element {
  const t = useT()
  return (
    <div style={{ padding: 8, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <button
        onClick={() => {
          window.api.showMainWindow()
          window.api.hideTrayWindow()
        }}
        style={{
          background: 'transparent',
          border: 'none',
          padding: '6px 10px',
          borderRadius: 6,
          color: 'var(--ink-3)',
          fontSize: 12,
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          cursor: 'pointer'
        }}
      >
        {t('open_app')} <Icon name="arrow-right" size={12} />
      </button>
      {secondary && (
        <span style={{ fontSize: 11, color: 'var(--ink-4)', paddingRight: 10 }}>{secondary}</span>
      )}
    </div>
  )
}

function OverarchingRow({ goal }: { goal: string }): React.JSX.Element {
  const t = useT()
  return (
    <div style={{ padding: '12px 18px' }}>
      <div
        style={{
          fontSize: 10,
          color: 'var(--ink-4)',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          marginBottom: 4,
          fontWeight: 500
        }}
      >
        {t('working_toward')}
      </div>
      <div style={{ fontSize: 13, color: 'var(--ink-2)', lineHeight: 1.4 }}>{goal}</div>
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
          justifyContent: 'space-between',
          marginTop: 12
        }}
      >
        <div>
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
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
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
          fontWeight: 600
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
            flex: 1.4,
            height: 40,
            background: '#1A1F2A',
            color: '#F4F6FA',
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
      <div
        style={{
          fontSize: 11,
          color: 'var(--ink-4)',
          marginTop: 8,
          textAlign: 'center',
          lineHeight: 1.4
        }}
      >
        {t('end_session_help')}
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
  const settings = useDailyStore((s) => s.settings)
  const entries = useDailyStore((s) => s.entries)
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
    fontFamily: 'var(--font-sans)'
  }

  const isActive = timer.status === 'running' || timer.status === 'paused'
  const hasGoal = !!todaysEntry?.mainGoal?.trim()
  const showOverarching = !!settings.overarchingGoal?.trim()

  // Pre-ritual: no main goal set today and timer idle
  if (!hasGoal && !isActive) {
    return (
      <div ref={rootRef} style={wrap}>
        <div style={{ padding: '20px 18px 14px' }}>
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
        <Divider />
        <FooterRow />
      </div>
    )
  }

  return (
    <div ref={rootRef} style={wrap}>
      {hasGoal && (
        <>
          <div style={{ padding: '16px 18px 14px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
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
                {todayLong().split(',')[0]}
              </div>
            </div>
            <div
              className="display"
              style={{
                fontSize: 17,
                lineHeight: 1.35,
                color: 'var(--ink)',
                fontWeight: 500,
                letterSpacing: '-0.01em'
              }}
            >
              {todaysEntry?.mainGoal}
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

      {showOverarching && (
        <>
          <Divider />
          <OverarchingRow goal={settings.overarchingGoal} />
        </>
      )}

      <Divider />
      <FooterRow />
    </div>
  )
}
