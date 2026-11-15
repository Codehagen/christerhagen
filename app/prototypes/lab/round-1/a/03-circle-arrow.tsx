"use client"

import * as React from "react"

import { Bar, C, Lead, Tile, fontHand, useSeen } from "../../kit"
import { PART_CSS, PageCard, PostHead, useReplay } from "./parts"

/**
 * The Bodø post with a red pen: one phrase ringed, a curved arrow out to the
 * margin, one line of note. The ring and arrow are measured from the real
 * text, so they hold at any tile width. Tapping the page draws them again.
 */

const RED = "oklch(0.56 0.2 27)"

const css = `
${PART_CSS}
.r1a3-stroke { stroke-dasharray: 1 1; stroke-dashoffset: 1;
  transition-property: stroke-dashoffset; transition-timing-function: cubic-bezier(.45,0,.25,1); transition-duration: 0ms; }
.r1a3-stroke[data-on] { stroke-dashoffset: 0; }
.r1a3-ring[data-on] { transition-duration: 640ms; }
.r1a3-arrow[data-on] { transition-duration: 420ms; transition-delay: 560ms; }
.r1a3-head[data-on] { transition-duration: 160ms; transition-delay: 960ms; }
.r1a3-note { opacity: 0; transition-property: opacity; transition-duration: 0ms; }
.r1a3-note[data-on] { opacity: 1; transition-duration: 320ms; transition-delay: 1040ms; }
@media (prefers-reduced-motion: reduce) {
  .r1a3-stroke, .r1a3-stroke[data-on], .r1a3-note, .r1a3-note[data-on] { transition-duration: 0ms; transition-delay: 0ms; }
}
`

type Geo = { ring: string; arrow: string; head: string; sw: number }

function draw(box: DOMRect, p: DOMRect, n: DOMRect): Geo {
  const W = box.width
  const x = p.left - box.left
  const y = p.top - box.top
  const cx = x + p.width / 2
  const cy = y + p.height / 2
  const rx = p.width / 2 + W * 0.016
  const ry = p.height / 2 + W * 0.009

  // A loop that starts top-left, goes round once and overshoots its start.
  const ring = [
    `M ${cx - rx * 0.88} ${cy - ry * 0.78}`,
    `C ${cx - rx * 0.3} ${cy - ry * 1.18}, ${cx + rx * 1.04} ${cy - ry * 1.12}, ${cx + rx} ${cy + ry * 0.04}`,
    `C ${cx + rx * 0.97} ${cy + ry * 1.14}, ${cx - rx * 0.62} ${cy + ry * 1.22}, ${cx - rx * 1.02} ${cy + ry * 0.18}`,
    `C ${cx - rx * 1.1} ${cy - ry * 0.52}, ${cx - rx * 0.46} ${cy - ry * 1.08}, ${cx + rx * 0.22} ${cy - ry * 1.04}`,
  ].join(" ")

  const sx = cx + rx * 0.72
  const sy = cy - ry * 1.02
  const ex = n.left - box.left - W * 0.014
  const ey = n.top - box.top + n.height * 0.42
  const c1x = sx + (ex - sx) * 0.12
  const c1y = Math.min(sy, ey) - W * 0.07
  const c2x = ex - (ex - sx) * 0.34
  const c2y = ey - W * 0.012
  const arrow = `M ${sx} ${sy} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${ex} ${ey}`

  const a = Math.atan2(ey - c2y, ex - c2x)
  const L = W * 0.02
  const h1 = [ex - L * Math.cos(a - 0.5), ey - L * Math.sin(a - 0.5)]
  const h2 = [ex - L * Math.cos(a + 0.5), ey - L * Math.sin(a + 0.5)]
  const head = `M ${h1[0]} ${h1[1]} L ${ex} ${ey} L ${h2[0]} ${h2[1]}`

  return { ring, arrow, head, sw: Math.max(1.2, W * 0.0028) }
}

export default function CircleArrow() {
  const [seenRef, seen] = useSeen<HTMLDivElement>()
  const [on, replay] = useReplay(seen)
  const boxRef = React.useRef<HTMLButtonElement>(null)
  const phraseRef = React.useRef<HTMLSpanElement>(null)
  const noteRef = React.useRef<HTMLSpanElement>(null)
  const [geo, setGeo] = React.useState<Geo | null>(null)

  React.useLayoutEffect(() => {
    const box = boxRef.current
    const ph = phraseRef.current
    const nt = noteRef.current
    if (!box || !ph || !nt) return
    let alive = true
    const measure = () => {
      if (!alive) return
      setGeo(draw(box.getBoundingClientRect(), ph.getBoundingClientRect(), nt.getBoundingClientRect()))
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(box)
    ro.observe(ph)
    document.fonts?.ready.then(measure)
    return () => {
      alive = false
      ro.disconnect()
    }
  }, [])

  const d = on && geo ? true : undefined

  return (
    <Tile>
      <style>{css}</style>
      <Lead
        bold="Ring the number, say why."
        grey="A red pen on the Bodø post: one phrase circled, one arrow, one line in the margin."
      />

      <div ref={seenRef} className="absolute top-[21cqw] right-0 left-[5.4cqw]">
        <PageCard />
        <button
          ref={boxRef}
          type="button"
          onClick={replay}
          aria-label="Draw the note again"
          className="relative grid w-full cursor-pointer grid-cols-[58cqw_1fr] text-left"
          style={{ touchAction: "manipulation" }}
        >
          <span className="col-start-1 block px-[3.4cqw] pt-[3cqw] pb-[1.6cqw]">
            <PostHead title="Why I build companies in Bodø" meta="Nov 2025 · 2 min" />
          </span>
          <span className="relative col-start-2">
            <span
              ref={noteRef}
              className="r1a3-note absolute top-[5.2cqw] left-[3.6cqw] block w-[24cqw] -rotate-3 leading-[0.95]"
              data-on={d}
              style={{ fontFamily: fontHand, fontSize: "3.8cqw", color: RED }}
            >
              north of oslo. the whole post is this number
            </span>
          </span>

          <span className="col-start-1 block px-[3.4cqw] py-[1cqw]">
            People assume you have to move to Oslo, or further, to build technology
            companies. I have built mine{" "}
            <span ref={phraseRef} className="inline-block whitespace-nowrap">
              1,200 kilometres
            </span>{" "}
            north of the capital, and I would not change it.
          </span>
          <span className="col-start-2" />

          <span className="col-start-1 block px-[3.4cqw] py-[1cqw]" style={{ color: C.grey }}>
            Bodø is small enough that you know everyone worth knowing within a week, and
            serious enough that real companies — in software, real estate and energy —
            actually get built here.
          </span>
          <span className="col-start-2" />

          <span className="col-start-1 flex flex-col gap-[1.3cqw] px-[3.4cqw] pt-[1.2cqw] pb-[6cqw]">
            <Bar w="80%" />
            <Bar w="66%" />
          </span>

          {geo ? (
            <svg
              aria-hidden
              className="pointer-events-none absolute inset-0 h-full w-full"
              style={{ overflow: "visible" }}
            >
              <g fill="none" stroke={RED} strokeWidth={geo.sw} strokeLinecap="round" strokeLinejoin="round">
                <path className="r1a3-stroke r1a3-ring" data-on={d} pathLength={1} d={geo.ring} />
                <path className="r1a3-stroke r1a3-arrow" data-on={d} pathLength={1} d={geo.arrow} />
                <path className="r1a3-stroke r1a3-head" data-on={d} pathLength={1} d={geo.head} />
              </g>
            </svg>
          ) : null}
        </button>
      </div>
    </Tile>
  )
}
