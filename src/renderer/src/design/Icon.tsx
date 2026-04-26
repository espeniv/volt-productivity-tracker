import type { CSSProperties } from 'react'

export type IconName =
  | 'play'
  | 'pause'
  | 'stop'
  | 'expand'
  | 'gear'
  | 'check'
  | 'arrow-right'
  | 'arrow-left'
  | 'plus'
  | 'edit'
  | 'menu-bar-icon'
  | 'sun'
  | 'moon'
  | 'calendar'
  | 'today'
  | 'chevron-down'
  | 'chevron-right'
  | 'sparkle'
  | 'circle'
  | 'circle-fill'
  | 'dot'
  | 'x'
  | 'check-circle'
  | 'eye-off'

interface Props {
  name: IconName
  size?: number
  stroke?: number
  color?: string
  style?: CSSProperties
}

export function Icon({ name, size = 16, stroke = 1.5, color, style }: Props): React.JSX.Element | null {
  const props = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: color || 'currentColor',
    strokeWidth: stroke,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    style
  }
  switch (name) {
    case 'play':
      return (
        <svg {...props}>
          <path d="M7 5.5v13l11-6.5L7 5.5z" fill="currentColor" stroke="none" />
        </svg>
      )
    case 'pause':
      return (
        <svg {...props}>
          <rect x="6" y="5" width="4" height="14" rx="1" fill="currentColor" stroke="none" />
          <rect x="14" y="5" width="4" height="14" rx="1" fill="currentColor" stroke="none" />
        </svg>
      )
    case 'stop':
      return (
        <svg {...props}>
          <rect x="6" y="6" width="12" height="12" rx="1.5" fill="currentColor" stroke="none" />
        </svg>
      )
    case 'expand':
      return (
        <svg {...props}>
          <path d="M9 3H4v5M15 3h5v5M9 21H4v-5M15 21h5v-5" />
        </svg>
      )
    case 'gear':
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="3" />
          <path d="M19.43 12.98a7.97 7.97 0 0 0 0-1.96l2.11-1.65a.5.5 0 0 0 .12-.64l-2-3.46a.5.5 0 0 0-.6-.22l-2.49 1a8 8 0 0 0-1.7-.98l-.38-2.65A.5.5 0 0 0 14 2h-4a.5.5 0 0 0-.49.42l-.38 2.65a8 8 0 0 0-1.7.98l-2.49-1a.5.5 0 0 0-.6.22l-2 3.46a.5.5 0 0 0 .12.64l2.11 1.65a7.97 7.97 0 0 0 0 1.96l-2.11 1.65a.5.5 0 0 0-.12.64l2 3.46a.5.5 0 0 0 .6.22l2.49-1a8 8 0 0 0 1.7.98l.38 2.65A.5.5 0 0 0 10 22h4a.5.5 0 0 0 .49-.42l.38-2.65a8 8 0 0 0 1.7-.98l2.49 1a.5.5 0 0 0 .6-.22l2-3.46a.5.5 0 0 0-.12-.64l-2.11-1.65z" />
        </svg>
      )
    case 'check':
      return (
        <svg {...props}>
          <path d="M5 12.5l4.5 4.5L19 7" />
        </svg>
      )
    case 'arrow-right':
      return (
        <svg {...props}>
          <path d="M5 12h14M13 5l7 7-7 7" />
        </svg>
      )
    case 'arrow-left':
      return (
        <svg {...props}>
          <path d="M19 12H5M11 5l-7 7 7 7" />
        </svg>
      )
    case 'plus':
      return (
        <svg {...props}>
          <path d="M12 5v14M5 12h14" />
        </svg>
      )
    case 'edit':
      return (
        <svg {...props}>
          <path d="M12 20h9" />
          <path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
        </svg>
      )
    case 'sun':
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
        </svg>
      )
    case 'moon':
      return (
        <svg {...props}>
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      )
    case 'calendar':
      return (
        <svg {...props}>
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <path d="M16 2v4M8 2v4M3 10h18" />
        </svg>
      )
    case 'today':
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 2" />
        </svg>
      )
    case 'chevron-down':
      return (
        <svg {...props}>
          <path d="M6 9l6 6 6-6" />
        </svg>
      )
    case 'chevron-right':
      return (
        <svg {...props}>
          <path d="M9 6l6 6-6 6" />
        </svg>
      )
    case 'sparkle':
      return (
        <svg {...props}>
          <path d="M12 3l1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5L12 3z" fill="currentColor" stroke="none" />
        </svg>
      )
    case 'circle':
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="9" />
        </svg>
      )
    case 'circle-fill':
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="9" fill="currentColor" stroke="none" />
        </svg>
      )
    case 'dot':
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="3" fill="currentColor" stroke="none" />
        </svg>
      )
    case 'x':
      return (
        <svg {...props}>
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
      )
    case 'check-circle':
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="9" />
          <path d="M8 12.5l3 3 5-6" />
        </svg>
      )
    case 'eye-off':
      return (
        <svg {...props}>
          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24M1 1l22 22" />
        </svg>
      )
    case 'menu-bar-icon':
      return (
        <svg {...props} stroke="none" fill="currentColor">
          <path d="M12 3a9 9 0 1 0 9 9h-9V3z" />
          <circle cx="12" cy="12" r="2.2" fill={color || 'var(--bg)'} />
        </svg>
      )
    default:
      return null
  }
}
