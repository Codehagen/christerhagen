"use client"

import * as React from "react"

import { Bracket, C, RING, fontMono } from "../../kit"

/**
 * Group-local parts for round 1 / a (reading and margin notes): the white
 * post page cropped by the tile's bottom edge, the benji section heading with
 * a hairline running right, and a bracket that draws in top to bottom.
 */

export const LINE = "rgba(18,18,18,0.13)"

export const PART_CSS = `
.r1a-draw { display: block; clip-path: inset(-0.4cqw -0.4cqw 100% -0.4cqw);
  transition-property: clip-path; transition-duration: 560ms; transition-timing-function: cubic-bezier(.55,0,.25,1); }
.r1a-draw[data-on] { clip-path: inset(-0.4cqw -0.4cqw -0.4cqw -0.4cqw); }
.r1a-write { clip-path: inset(-30% 100% -30% -4%);
  transition-property: clip-path; transition-duration: 900ms; transition-timing-function: cubic-bezier(.4,0,.3,1); }
.r1a-write[data-on] { clip-path: inset(-30% -4% -30% -4%); }
@media (prefers-reduced-motion: reduce) {
  .r1a-draw, .r1a-write { transition-duration: 0ms !important; transition-delay: 0ms !important; }
}
`

/** The white page, from `top` down past the tile's bottom edge. */
export function PageCard({ width = "58cqw" }: { width?: string }) {
  return (
    <div
      aria-hidden
      className="absolute top-0 left-0 rounded-[2.4cqw]"
      style={{ width, background: C.white, boxShadow: RING, bottom: "-40cqw" }}
    />
  )
}

/** A post title with the hairline running right, and its date line below. */
export function PostHead({ title, meta }: { title: string; meta: string }) {
  return (
    <span className="block">
      <span className="flex items-center gap-[1.8cqw]">
        <span className="shrink-0" style={{ fontWeight: 560 }}>
          {title}
        </span>
        <span aria-hidden className="h-px flex-1" style={{ background: LINE }} />
      </span>
      <span
        className="mt-[0.5cqw] block tabular-nums"
        style={{ fontFamily: fontMono, fontSize: "1.8cqw", color: C.grey }}
      >
        {meta}
      </span>
    </span>
  )
}

/** The kit bracket, revealed top to bottom the way a pen draws it. */
export function DrawnBracket({
  color,
  on,
  delay = 0,
  className = "",
}: {
  color: string
  on: boolean
  delay?: number
  className?: string
}) {
  return (
    <span
      className={`r1a-draw ${className}`}
      data-on={on || undefined}
      style={{ transitionDelay: on ? `${delay}ms` : "0ms" }}
    >
      <Bracket color={color} className="h-full w-full" />
    </span>
  )
}

/** Re-runs a seen-triggered sequence: off for a beat, then on again. */
export function useReplay(seen: boolean, gap = 450): [boolean, () => void] {
  const [replay, setReplay] = React.useState(false)
  const t = React.useRef<number | undefined>(undefined)
  React.useEffect(() => () => window.clearTimeout(t.current), [])
  const run = React.useCallback(() => {
    setReplay(true)
    window.clearTimeout(t.current)
    t.current = window.setTimeout(() => setReplay(false), gap)
  }, [gap])
  return [seen && !replay, run]
}
