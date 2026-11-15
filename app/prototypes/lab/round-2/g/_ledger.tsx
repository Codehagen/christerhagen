"use client"

import * as React from "react"

import { C, Lead, Tile } from "../../kit"

/**
 * Group g (round 2): ledgers that carry the pen. Every piece stands on
 * benji's ground exactly — #FDFDFC, a band a shade lighter at the top, one
 * hairline under it, nothing else — and sets a quiet tabular ledger straight
 * on that ground (no second sheet), then lets one pen mark it.
 */

export const HAIR = "rgba(18,18,18,0.09)"
export const RULE = "rgba(18,18,18,0.14)"

/** The page: benji's ground, the lighter band, the lead sentence below it. */
export function Ground({
  bold,
  grey,
  children,
  className = "",
}: {
  bold: string
  grey: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <Tile className={className} style={{ background: C.page }}>
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-[3.2cqw]"
        style={{ background: C.white, boxShadow: "0 1px 0 rgba(18,18,18,0.035)" }}
      />
      <Lead bold={bold} grey={grey} />
      {children}
    </Tile>
  )
}

/** A section label with the hairline running right, as on benji.org. */
export function Rule({
  label,
  right,
  className = "",
  style,
}: {
  label: React.ReactNode
  right?: React.ReactNode
  className?: string
  style?: React.CSSProperties
}) {
  return (
    <div className={`flex items-center gap-[1.6cqw] ${className}`} style={style}>
      <span style={{ color: C.grey }}>{label}</span>
      <span aria-hidden className="h-px flex-1" style={{ background: HAIR }} />
      {right ? <span style={{ color: C.faint }}>{right}</span> : null}
    </div>
  )
}

/* ------------------------------------------------------------- the pen ring */

/**
 * One loop, a little long, the end overshooting the start like a real pen
 * (the shape from round 1 / 20). Points live in a 100×40 box and are scaled
 * to the measured box, so the stroke stays one pen width at any length.
 */
const LOOP: number[][] = [
  [54, 4.5],
  [80, 3.5, 98, 9, 97.5, 20],
  [97, 32, 74, 37.5, 48, 37],
  [22, 36.5, 2.5, 31, 3, 19.5],
  [3.5, 8.5, 24, 3, 50, 4],
  [62, 4.4, 70, 6, 73, 8.5],
]

function loop(w: number, h: number) {
  const sx = w / 100
  const sy = h / 40
  const pt = (seg: number[]) => {
    const out: string[] = []
    for (let i = 0; i < seg.length; i += 2) {
      out.push(`${(seg[i] * sx).toFixed(1)} ${(seg[i + 1] * sy).toFixed(1)}`)
    }
    return out.join(", ")
  }
  const [m, ...cs] = LOOP
  return `M ${pt(m)} ` + cs.map((c) => `C ${pt(c)}`).join(" ")
}

export const ringCss = `
.g-ring path {
  stroke-dasharray: 1; stroke-dashoffset: 1; opacity: 0;
  transition-property: stroke-dashoffset, opacity;
  transition-duration: 180ms, 0ms;
  transition-delay: 0ms, 180ms;
  transition-timing-function: cubic-bezier(.4,0,1,1), linear;
}
.g-ring[data-on] path {
  stroke-dashoffset: 0; opacity: 1;
  transition-duration: 520ms, 0ms;
  transition-delay: var(--d, 60ms), var(--d, 60ms);
  transition-timing-function: cubic-bezier(.45,.05,.25,1), linear;
}
@media (prefers-reduced-motion: reduce) {
  .g-ring path { stroke-dashoffset: 0; transition-property: opacity; transition-duration: 160ms; transition-delay: 0ms; }
  .g-ring[data-on] path { transition-property: opacity; transition-duration: 160ms; transition-delay: 0ms; }
}
`

/** A measured pen loop around its positioned parent. Needs `ringCss`. */
export function Ring({
  on,
  color,
  inset = "-0.5em -0.6em -0.42em -0.62em",
  delay = 60,
}: {
  on: boolean
  color: string
  inset?: string
  delay?: number
}) {
  const ref = React.useRef<HTMLSpanElement>(null)
  const [box, setBox] = React.useState<[number, number] | null>(null)

  React.useEffect(() => {
    const el = ref.current
    if (!el) return
    const ro = new ResizeObserver(([e]) => {
      if (!e) return
      const { width, height } = e.contentRect
      setBox([Math.round(width), Math.round(height)])
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  return (
    <span
      ref={ref}
      aria-hidden
      className="g-ring"
      data-on={on || undefined}
      style={{ position: "absolute", inset, pointerEvents: "none", ["--d" as string]: `${delay}ms` }}
    >
      {box ? (
        <svg
          viewBox={`0 0 ${box[0]} ${box[1]}`}
          style={{ display: "block", width: "100%", height: "100%", overflow: "visible" }}
        >
          <path
            d={loop(box[0], box[1])}
            pathLength={1}
            fill="none"
            stroke={color}
            strokeWidth={1.4}
            strokeLinecap="round"
          />
        </svg>
      ) : null}
    </span>
  )
}

/** Re-runs a seen-triggered sequence: off for a beat, then on again. */
export function useReplay(seen: boolean, gap = 450): [boolean, () => void] {
  const [off, setOff] = React.useState(false)
  const t = React.useRef<number | undefined>(undefined)
  React.useEffect(() => () => window.clearTimeout(t.current), [])
  const run = React.useCallback(() => {
    setOff(true)
    window.clearTimeout(t.current)
    t.current = window.setTimeout(() => setOff(false), gap)
  }, [gap])
  return [seen && !off, run]
}
