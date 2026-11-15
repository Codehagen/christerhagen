"use client"

import { Stroke, Note, type Rect } from "../../round-2/e/pen"
import { COL, DesktopPost } from "./desktop"
import { MARKS } from "./marks"

/**
 * 45 — Read next is the last mark.
 *
 * The Bodø post, read with a rust pen that makes its three marks and then
 * one more: when you reach the end, it writes a line in the margin about the
 * post that comes next and draws an arrow from it back to read next, whose
 * own arrow takes the ink. The pen hands you on; follow it and the new page
 * gets its own pass, and its own last line.
 */

const RUST = "#C2410C"
const WASH = "color-mix(in oklch, #C2410C 15%, transparent)"

/** From the note's left edge back to read next's arrow, bowing up, with a head. */
function handOn(g: Rect, n: { x: number; y: number }, u: number) {
  const y = g.y + g.h * 0.55
  const sx = n.x - u * 1
  const sy = n.y + u * 1.3
  const ex = g.x + g.w + u * 1.4
  const ey = y
  const span = sx - ex
  const c1 = [sx - span * 0.28, Math.min(sy, ey) - u * 3.2]
  const c2 = [ex + span * 0.22, ey - u * 2.4]
  const line = `M ${sx} ${sy} C ${c1[0]} ${c1[1]}, ${c2[0]} ${c2[1]}, ${ex} ${ey}`
  const a = Math.atan2(ey - c2[1], ex - c2[0])
  const L = u * 1.8
  const h1 = [ex - L * Math.cos(a - 0.5), ey - L * Math.sin(a - 0.5)]
  const h2 = [ex - L * Math.cos(a + 0.5), ey - L * Math.sin(a + 0.5)]
  return { line, head: `M ${h1[0]} ${h1[1]} L ${ex} ${ey} L ${h2[0]} ${h2[1]}` }
}

const noteAt = (g: Rect, u: number) => ({ x: (COL + 3.4) * u, y: g.y - u * 0.6 })

export default function ReadNextIsTheLastMark() {
  return (
    <DesktopPost
      label="The Bodø post, the pen's last mark pointing to read next"
      slug="building-in-bodo"
      lang="en"
      color={RUST}
      wash={WASH}
      inkedNext={({ live, end }) => live && end}
      pen={({ rects, u }, { live, end }) => {
        const g = rects.nextArrow
        if (!g || !u) return null
        const h = handOn(g, noteAt(g, u), u)
        const on = live && end
        return (
          <>
            <Stroke d={h.line} on={on} delay={900} dur={520} />
            <Stroke d={h.head} on={on} delay={1400} dur={160} />
          </>
        )
      }}
      notes={({ rects, u, slug, lang }, { live, end }) => {
        const g = rects.nextArrow
        if (!g || !u) return null
        const n = noteAt(g, u)
        return (
          <Note color={RUST} on={live && end} delay={250} style={{ left: n.x, top: n.y, width: "19cqw" }}>
            {MARKS[lang][slug].next}
          </Note>
        )
      }}
    />
  )
}
