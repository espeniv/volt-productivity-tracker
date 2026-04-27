import type { CSSProperties } from 'react'

interface Props {
  size?: number
  /** Render only the bolt mark in `currentColor` (no rounded background). */
  monochrome?: boolean
  style?: CSSProperties
  title?: string
}

/**
 * Volt logo — a blue lightning bolt on a soft tile.
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
        <linearGradient id="voltLogoTile" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3A3A3D" />
          <stop offset="1" stopColor="#1F1F22" />
        </linearGradient>
        <linearGradient id="voltLogoBolt" x1="0.2" y1="0" x2="0.85" y2="1">
          <stop offset="0" stopColor="#A8DCFF" />
          <stop offset="0.55" stopColor="#5DA8F0" />
          <stop offset="1" stopColor="#3D7FCF" />
        </linearGradient>
        <linearGradient id="voltLogoShine" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFFFFF" stopOpacity="0.55" />
          <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="24" height="24" rx="5.25" ry="5.25" fill="url(#voltLogoTile)" />
      <path
        d="M 14 4 L 4.6 14 L 11 14 L 10 20 L 19.4 10 L 13 10 Z"
        fill="url(#voltLogoBolt)"
        strokeLinejoin="round"
      />
      <path
        d="M 13.6 4.6 L 5.4 13.5 L 10.2 13.5"
        fill="none"
        stroke="url(#voltLogoShine)"
        strokeWidth="0.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
