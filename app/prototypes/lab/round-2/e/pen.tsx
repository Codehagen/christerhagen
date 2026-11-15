"use client"

import * as React from "react"

import { fontHand } from "../../kit"
import { DrawnBracket, PART_CSS } from "../../round-1/a/parts"

import { COLUMN } from "./frame"

/**
 * The kept pen marks, made to work on a whole post: the bracket that draws
 * down (01), the ring with an arrow to the margin (03), the highlighter that
 * sweeps stroke by stroke (05). Rings and arrows are measured from the real
 * text inside the article, so they scroll with it and hold at any width.
 */

export const PEN_CSS = `
${PART_CSS}
.e-stroke { stroke-dasharray: 1 1; stroke-dashoffset: 1;
  transition-property: stroke-dashoffset; transition-duration: 0ms; transition-timing-function: cubic-bezier(.45,0,.25,1); }
.e-stroke[data-on] { stroke-dashoffset: 0; transition-duration: var(--dur, 620ms); transition-delay: var(--d, 0ms); }
.e-hl { background-image: linear-gradient(var(--hl), var(--hl)); background-repeat: no-repeat;
  background-position: 0 62%; background-size: 0% 78%;
  transition-property: background-size; transition-duration: 0ms; transition-timing-function: cubic-bezier(.4,.1,.3,1); }
.e-hl[data-on] { background-size: 100% 78%; transition-duration: 380ms; transition-delay: var(--d, 0ms); }
.e-fade { opacity: 0; transition-property: opacity; transition-duration: 0ms; }
.e-fade[data-on] { opacity: 1; transition-duration: 320ms; transition-delay: var(--d, 0ms); }
.e-ink { transition-property: color; transition-duration: 500ms; transition-delay: var(--d, 0ms); }
/* Taking the pen away is quick and all at once, so the clean page comes back in one beat. */
[data-soft] .e-stroke:not([data-on]) { transition-duration: 260ms; }
[data-soft] .e-hl:not([data-on]) { transition-duration: 220ms; }
[data-soft] .e-fade:not([data-on]) { transition-duration: 180ms; }
[data-soft] .r1a-write:not([data-on]), [data-soft] .r1a-draw:not([data-on]) { transition-duration: 220ms; }
@media (prefers-reduced-motion: reduce) {
  .e-stroke, .e-stroke[data-on], .e-hl, .e-hl[data-on], .e-ink,
  [data-soft] .e-stroke:not([data-on]), [data-soft] .e-hl:not([data-on]) { transition-duration: 0ms !important; transition-delay: 0ms !important; }
  .e-fade, .e-fade[data-on] { transition-duration: 160ms !important; transition-delay: 0ms !important; }
}
`

export type Rect = { x: number; y: number; w: number; h: number }

/**
 * Every `[data-mark]` inside the box, in the box's own coordinates, plus `u`:
 * one cqw in px. Re-measured on resize, once fonts land, and when `key` changes.
 */
export function useRects(boxRef: React.RefObject<HTMLElement | null>, key: unknown = 0) {
  const [state, setState] = React.useState<{ rects: Record<string, Rect>; u: number }>({
    rects: {},
    u: 0,
  })

  React.useLayoutEffect(() => {
    const box = boxRef.current
    if (!box) return
    let alive = true
    const measure = () => {
      if (!alive) return
      const b = box.getBoundingClientRect()
      const rects: Record<string, Rect> = {}
      box.querySelectorAll<HTMLElement>("[data-mark]").forEach((el) => {
        const r = el.getBoundingClientRect()
        rects[el.dataset.mark!] = { x: r.left - b.left, y: r.top - b.top, w: r.width, h: r.height }
      })
      setState({ rects, u: b.width / COLUMN })
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(box)
    document.fonts?.ready.then(measure)
    return () => {
      alive = false
      ro.disconnect()
    }
  }, [boxRef, key])

  return state
}

/** A loop that starts top-left, goes round once and overshoots its start (03). */
export function ringPath(p: Rect, u: number) {
  const cx = p.x + p.w / 2
  const cy = p.y + p.h / 2
  const rx = p.w / 2 + u * 1.5
  const ry = p.h / 2 + u * 0.8
  return [
    `M ${cx - rx * 0.88} ${cy - ry * 0.78}`,
    `C ${cx - rx * 0.3} ${cy - ry * 1.18}, ${cx + rx * 1.04} ${cy - ry * 1.12}, ${cx + rx} ${cy + ry * 0.04}`,
    `C ${cx + rx * 0.97} ${cy + ry * 1.14}, ${cx - rx * 0.62} ${cy + ry * 1.22}, ${cx - rx * 1.02} ${cy + ry * 0.18}`,
    `C ${cx - rx * 1.1} ${cy - ry * 0.52}, ${cx - rx * 0.46} ${cy - ry * 1.08}, ${cx + rx * 0.22} ${cy - ry * 1.04}`,
  ].join(" ")
}

/** From the top of a ring out to the left edge of its note, with a head. */
export function arrowPath(p: Rect, n: Rect, u: number, lift = 4) {
  const cx = p.x + p.w / 2
  const cy = p.y + p.h / 2
  const rx = p.w / 2 + u * 1.5
  const ry = p.h / 2 + u * 0.8
  const sx = cx + rx * 0.72
  const sy = cy - ry * 1.02
  const ex = n.x - u * 1.2
  const ey = n.y + n.h * 0.42
  const c1x = sx + (ex - sx) * 0.12
  const c1y = Math.min(sy, ey) - u * lift
  const c2x = ex - (ex - sx) * 0.34
  const c2y = ey - u * 1.2
  const line = `M ${sx} ${sy} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${ex} ${ey}`
  const a = Math.atan2(ey - c2y, ex - c2x)
  const L = u * 1.8
  const h1 = [ex - L * Math.cos(a - 0.5), ey - L * Math.sin(a - 0.5)]
  const h2 = [ex - L * Math.cos(a + 0.5), ey - L * Math.sin(a + 0.5)]
  const head = `M ${h1[0]} ${h1[1]} L ${ex} ${ey} L ${h2[0]} ${h2[1]}`
  return { line, head }
}

/** The svg the measured strokes are drawn on: the article's own box. */
export function PenLayer({ color, u, children }: { color: string; u: number; children: React.ReactNode }) {
  if (!u) return null
  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute inset-0 h-full w-full"
      style={{ overflow: "visible" }}
    >
      <g
        fill="none"
        stroke={color}
        strokeWidth={Math.max(1.2, u * 0.26)}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {children}
      </g>
    </svg>
  )
}

export function Stroke({ d, on, delay = 0, dur = 620 }: { d: string; on: boolean; delay?: number; dur?: number }) {
  return (
    <path
      className="e-stroke"
      data-on={on || undefined}
      pathLength={1}
      d={d}
      style={{ ["--d" as string]: `${delay}ms`, ["--dur" as string]: `${dur}ms` }}
    />
  )
}

/** Ring, arrow, head: one gesture, timed the way 03 draws it. */
export function RingArrow({
  p,
  n,
  u,
  on,
  delay = 0,
  lift,
}: {
  p?: Rect
  n?: Rect
  u: number
  on: boolean
  delay?: number
  lift?: number
}) {
  if (!p) return null
  const a = n ? arrowPath(p, n, u, lift) : null
  return (
    <>
      <Stroke d={ringPath(p, u)} on={on} delay={delay} dur={640} />
      {a ? <Stroke d={a.line} on={on} delay={delay + 560} dur={420} /> : null}
      {a ? <Stroke d={a.head} on={on} delay={delay + 960} dur={160} /> : null}
    </>
  )
}

/** Splits `text` around `phrase`; the phrase must be in the site's own copy. */
export function cut(text: string, phrase: string): [string, string, string] {
  const i = text.indexOf(phrase)
  if (i < 0) return [text, "", ""]
  return [text.slice(0, i), phrase, text.slice(i + phrase.length)]
}

/**
 * A highlighter in the pen's own colour, broken where a hand lifts (after
 * each comma) so the sweep runs line by line instead of all at once.
 */
export function Highlight({
  text,
  on,
  color,
  delay = 0,
}: {
  text: string
  on: boolean
  color: string
  delay?: number
}) {
  const strokes = text.split(/(?<=,)/)
  return (
    <>
      {strokes.map((s, i) => (
        <span
          key={i}
          className="e-hl"
          data-on={on || undefined}
          style={{ ["--hl" as string]: color, ["--d" as string]: `${delay + i * 360}ms` }}
        >
          {s}
        </span>
      ))}
    </>
  )
}

/** A line or two of pen in the margin, written in left to right (01). */
export function Note({
  children,
  color,
  on,
  delay = 0,
  mark,
  style,
  className = "",
}: {
  children: React.ReactNode
  color: string
  on: boolean
  delay?: number
  mark?: string
  style?: React.CSSProperties
  className?: string
}) {
  return (
    <span
      aria-hidden
      data-mark={mark}
      className={`r1a-write absolute block leading-[0.98] ${className}`}
      data-on={on || undefined}
      style={{
        fontFamily: fontHand,
        fontSize: "2.5cqw",
        color,
        rotate: "-2deg",
        transitionDelay: on ? `${delay}ms` : "0ms",
        ...style,
      }}
    >
      {children}
    </span>
  )
}

/** The margin to the right of the column, where every note lives. */
export const MARGIN: React.CSSProperties = { left: "calc(100% + 3cqw)", width: "20cqw" }

/** 01's bracket down the side of a paragraph, with its note beside it. */
export function BracketNote({
  color,
  on,
  delay = 0,
  children,
}: {
  color: string
  on: boolean
  delay?: number
  children: React.ReactNode
}) {
  return (
    <span
      aria-hidden
      className="absolute flex items-center gap-[1.2cqw]"
      style={{ left: "calc(100% + 1.6cqw)", top: "0.3cqw", bottom: "0.3cqw", width: "22cqw" }}
    >
      <DrawnBracket color={color} on={on} delay={delay} className="h-full w-[1.6cqw] shrink-0" />
      <span
        className="r1a-write block leading-[0.98]"
        data-on={on || undefined}
        style={{
          fontFamily: fontHand,
          fontSize: "2.5cqw",
          color,
          rotate: "-2deg",
          transitionDelay: on ? `${delay + 520}ms` : "0ms",
        }}
      >
        {children}
      </span>
    </span>
  )
}

/** Where a margin note sits when it is level with a measured phrase. */
export function beside(r: Rect | undefined, u: number, dy = -0.4): Rect | undefined {
  if (!r || !u) return undefined
  return { x: (COLUMN + 3.4) * u, y: r.y + dy * u, w: 20 * u, h: 3 * u }
}

/** A note in the margin, level with the phrase it answers. */
export function MarginNote({
  at,
  color,
  on,
  delay,
  children,
}: {
  at?: Rect
  color: string
  on: boolean
  delay: number
  children: React.ReactNode
}) {
  if (!at) return null
  return (
    <Note color={color} on={on} delay={delay} style={{ left: at.x, top: at.y, width: "19cqw" }}>
      {children}
    </Note>
  )
}
