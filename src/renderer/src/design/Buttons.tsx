import type { CSSProperties, MouseEvent, ReactNode } from 'react'
import { Icon, type IconName } from './Icon'

type Tone = 'accent' | 'ink' | 'ghost'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps {
  children?: ReactNode
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void
  size?: Size
  tone?: Tone
  icon?: IconName
  iconRight?: IconName
  full?: boolean
  disabled?: boolean
  style?: CSSProperties
  title?: string
}

const SIZES: Record<Size, { h: number; px: number; fs: number; gap: number }> = {
  sm: { h: 30, px: 12, fs: 13, gap: 6 },
  md: { h: 38, px: 16, fs: 14, gap: 8 },
  lg: { h: 48, px: 22, fs: 15, gap: 10 }
}

const TONES: Record<Tone, { bg: string; fg: string; border: string }> = {
  accent: { bg: 'var(--accent)', fg: 'var(--accent-ink)', border: 'var(--accent)' },
  ink: { bg: 'var(--ink)', fg: 'var(--bg)', border: 'var(--ink)' },
  ghost: { bg: 'transparent', fg: 'var(--ink)', border: 'var(--line-strong)' }
}

export function PrimaryButton({
  children,
  onClick,
  size = 'md',
  tone = 'accent',
  icon,
  iconRight,
  full,
  disabled,
  style,
  title
}: ButtonProps): React.JSX.Element {
  const s = SIZES[size]
  const t = TONES[tone]
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className="focus-ring"
      style={{
        height: s.h,
        padding: `0 ${s.px}px`,
        fontSize: s.fs,
        fontWeight: 500,
        background: t.bg,
        color: t.fg,
        border: `1px solid ${t.border}`,
        borderRadius: 999,
        display: 'inline-flex',
        alignItems: 'center',
        gap: s.gap,
        justifyContent: 'center',
        width: full ? '100%' : 'auto',
        boxShadow: tone === 'ghost' ? 'none' : 'var(--shadow-sm)',
        opacity: disabled ? 0.5 : 1,
        transition: 'transform 120ms ease, box-shadow 120ms ease, opacity 120ms',
        letterSpacing: '-0.005em',
        cursor: disabled ? 'default' : 'pointer',
        ...style
      }}
    >
      {icon && <Icon name={icon} size={s.fs + 2} />}
      <span>{children}</span>
      {iconRight && <Icon name={iconRight} size={s.fs + 2} />}
    </button>
  )
}

export function GhostButton(props: ButtonProps): React.JSX.Element {
  return <PrimaryButton tone="ghost" {...props} />
}

export function Divider({ style }: { style?: CSSProperties }): React.JSX.Element {
  return <div style={{ height: 1, background: 'var(--line)', ...style }} />
}
