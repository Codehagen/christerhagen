"use client"

import * as React from "react"

import { companyOrder } from "@/lib/companies"

import { C, fontHand, useSeen } from "../../kit"
import { Ground, HAIR, RULE, Ring, ringCss, useReplay } from "./_ledger"

/**
 * 35 — The numbers.
 *
 * Every figure the site states, as one ledger: the number flush right in
 * tabular figures, what it counts, and where on the site it is said. The pen
 * from 03 rings one — the top 4% — and runs an arrow down off the ledger to
 * say the thing the row leaves out: it was the same year Docdir sold. Tapping the ledger draws it again.
 */

const PEN = "oklch(0.55 0.14 152)"

const ROWS: { fig: string; what: string; where: string; ring?: boolean }[] = [
  { fig: "2016", what: "the first company, Refenze", where: "Portfolio" },
  { fig: "25%", what: "growth a month, at Refenze's peak", where: "Apparel post" },
  { fig: "2017", what: "Codebase, the studio, founded", where: "Work" },
  { fig: String(companyOrder.length), what: "companies built or backed", where: "Portfolio" },
  { fig: "2.7k", what: "GitHub stars on Badget", where: "Open source" },
  { fig: "2M+", what: "Norwegian companies in Bedrifty", where: "Portfolio" },
  { fig: "1,200 km", what: "north of Oslo, where they're built", where: "Bodø post" },
  { fig: "2nd", what: "Bodø company Visma has bought", where: "Docdir post" },
  { fig: "top 4%", what: "Norwegian AI Championship, 2026", where: "About", ring: true },
]

const L = 5.4
const W = 70
const COLS = "14cqw 1fr 15cqw"

const css = `
${ringCss}
.g35-arrow { stroke-dasharray: 1; stroke-dashoffset: 1; transition-property: stroke-dashoffset; transition-duration: 0ms; }
.g35-arrow[data-on] { stroke-dashoffset: 0; transition-duration: 420ms; transition-delay: 600ms; transition-timing-function: cubic-bezier(.45,0,.25,1); }
.g35-head[data-on] { transition-duration: 140ms; transition-delay: 1000ms; }
.g35-note { opacity: 0; transition-property: opacity; transition-duration: 0ms; }
.g35-note[data-on] { opacity: 1; transition-duration: 320ms; transition-delay: 1080ms; }
@media (prefers-reduced-motion: reduce) {
  .g35-arrow, .g35-arrow[data-on], .g35-note, .g35-note[data-on] { transition-duration: 0ms; transition-delay: 0ms; }
}
`

type Geo = { arrow: string; head: string; sw: number }

/**
 * An arrow from under the ring down off the ledger and out to the note,
 * measured from the real boxes, so it crosses no row.
 */
function draw(box: DOMRect, f: DOMRect, n: DOMRect): Geo {
  const Wpx = box.width
  const sx = f.right - box.left - f.width * 0.15
  const sy = f.bottom - box.top + Wpx * 0.01
  const ex = n.left - box.left - Wpx * 0.014
  const ey = n.top - box.top + n.height * 0.55
  const c1x = sx + Wpx * 0.004
  const c1y = ey + Wpx * 0.004
  const c2x = ex - (ex - sx) * 0.45
  const c2y = ey + Wpx * 0.006
  const a = Math.atan2(ey - c2y, ex - c2x)
  const Lh = Wpx * 0.018
  const h1 = [ex - Lh * Math.cos(a - 0.5), ey - Lh * Math.sin(a - 0.5)]
  const h2 = [ex - Lh * Math.cos(a + 0.5), ey - Lh * Math.sin(a + 0.5)]
  return {
    arrow: `M ${sx} ${sy} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${ex} ${ey}`,
    head: `M ${h1[0]} ${h1[1]} L ${ex} ${ey} L ${h2[0]} ${h2[1]}`,
    sw: Math.max(1.2, Wpx * 0.0026),
  }
}

export default function TheNumbers() {
  const [seenRef, seen] = useSeen<HTMLDivElement>()
  const [on, replay] = useReplay(seen)
  const boxRef = React.useRef<HTMLDivElement>(null)
  const figRef = React.useRef<HTMLSpanElement>(null)
  const noteRef = React.useRef<HTMLParagraphElement>(null)
  const [geo, setGeo] = React.useState<Geo | null>(null)

  React.useLayoutEffect(() => {
    const box = boxRef.current
    const fig = figRef.current
    const note = noteRef.current
    if (!box || !fig || !note) return
    let alive = true
    const measure = () => {
      if (!alive) return
      setGeo(draw(box.getBoundingClientRect(), fig.getBoundingClientRect(), note.getBoundingClientRect()))
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(box)
    ro.observe(fig)
    document.fonts?.ready.then(measure)
    return () => {
      alive = false
      ro.disconnect()
    }
  }, [])

  const d = on && geo ? true : undefined

  return (
    <Ground
      bold="The numbers, in one column."
      grey="Every figure the site states, flush right. The pen rings one and says what it leaves out."
    >
      <style>{css}</style>

      <div ref={boxRef} className="absolute inset-0">
        <div
          ref={seenRef}
          className="absolute tabular-nums"
          style={{ top: "19.6cqw", left: `${L}cqw`, width: `${W}cqw`, fontSize: "2.1cqw", lineHeight: 1.2 }}
        >
          <button
            type="button"
            onClick={replay}
            aria-label="Draw the ring again"
            className="block w-full cursor-pointer text-left"
            style={{ touchAction: "manipulation" }}
          >
            <span className="grid pb-[0.8cqw]" style={{ gridTemplateColumns: COLS, color: C.faint, fontSize: "1.85cqw" }}>
              <span className="pr-[2.6cqw] text-right">Figure</span>
              <span>What it counts</span>
              <span className="text-right">Said in</span>
            </span>
            {ROWS.map((r, i) => (
              <span
                key={r.fig + r.what}
                className="grid items-center"
                style={{ gridTemplateColumns: COLS, height: "4.4cqw", borderTop: `1px solid ${i === 0 ? RULE : HAIR}` }}
              >
                <span className="pr-[2.6cqw] text-right whitespace-nowrap" style={{ fontWeight: 560 }}>
                  {r.ring ? (
                    <span ref={figRef} className="relative inline-block">
                      {r.fig}
                      <Ring on={Boolean(d)} color={PEN} inset="-0.9cqw -1.3cqw -0.8cqw -1.4cqw" />
                    </span>
                  ) : (
                    r.fig
                  )}
                </span>
                <span style={{ color: C.grey }}>{r.what}</span>
                <span className="text-right" style={{ color: C.faint }}>
                  {r.where}
                </span>
              </span>
            ))}
          </button>
        </div>

        <p
          ref={noteRef}
          aria-hidden
          className="g35-note absolute -rotate-2 whitespace-nowrap leading-[0.95]"
          data-on={d}
          style={{
            top: "66.4cqw",
            left: "26cqw",
            fontFamily: fontHand,
            fontSize: "3.6cqw",
            color: PEN,
          }}
        >
          the same year docdir sold
        </p>

        {geo ? (
          <svg aria-hidden className="pointer-events-none absolute inset-0 h-full w-full" style={{ overflow: "visible" }}>
            <g fill="none" stroke={PEN} strokeWidth={geo.sw} strokeLinecap="round" strokeLinejoin="round">
              <path className="g35-arrow" data-on={d} pathLength={1} d={geo.arrow} />
              <path className="g35-arrow g35-head" data-on={d} pathLength={1} d={geo.head} />
            </g>
          </svg>
        ) : null}
      </div>
    </Ground>
  )
}
