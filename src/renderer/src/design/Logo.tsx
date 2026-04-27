import type { CSSProperties } from 'react'

interface Props {
  size?: number
  /** Render only the bolt mark in `currentColor` (no rounded background). */
  monochrome?: boolean
  style?: CSSProperties
  title?: string
}

/**
 * Daily logo — a tilted lightning bolt inside a rounded-square accent tile.
 * Use `monochrome` for inline UI marks where the surrounding context already
 * sets the color (settings footer, etc).
 */
export function Logo({ size = 32, monochrome, style, title }: Props): React.JSX.Element {
  if (monochrome) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="currentColor"
        style={style}
        aria-label={title}
        role={title ? 'img' : undefined}
      >
        <path d="M 14 4 L 4.6 14 L 11 14 L 10 20 L 19.4 10 L 13 10 Z" />
      </svg>
    )
  }
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      style={style}
      aria-label={title}
      role={title ? 'img' : undefined}
    >
      <defs>
        <linearGradient id="dailyLogoBg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7AB3E0" />
          <stop offset="1" stopColor="#3F73A8" />
        </linearGradient>
        <radialGradient id="dailyLogoGlow" cx="0.5" cy="0.38" r="0.55">
          <stop offset="0" stopColor="#FFFFFF" stopOpacity="0.22" />
          <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect x="0" y="0" width="24" height="24" rx="5.25" ry="5.25" fill="url(#dailyLogoBg)" />
      <rect x="0" y="0" width="24" height="24" rx="5.25" ry="5.25" fill="url(#dailyLogoGlow)" />
      <path
        d="M 14 4 L 4.6 14 L 11 14 L 10 20 L 19.4 10 L 13 10 Z"
        fill="#FFFFFF"
        stroke="#FFFFFF"
        strokeWidth="0.4"
        strokeLinejoin="round"
      />
    </svg>
  )
}
