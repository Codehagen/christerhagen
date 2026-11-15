"use client"

import type { Lang } from "@/lib/companies"

import { G } from "../../round-2/h/chrome"
import { Caption, type FigureProps, LongPost, Stroke } from "./_long"

/**
 * 72 — The distance.
 *
 * The Bodø post, long. benji's figure is a stage holding a demo; this one is
 * the post's own fact drawn by hand: Oslo at the foot, Bodø at the top (north
 * is up, and the line leans a little east, as the two cities do), the line
 * between them drawn by the pen with a loop at each end, and the 1,200 km set
 * beside it in ink. No map, no tiles, no coastline: the distance is the
 * point, not the geography.
 */

const T: Record<Lang, { km: string; oslo: string; capital: string; bodo: string; caption: string; label: string }> = {
  en: {
    km: "1,200 km",
    oslo: "Oslo",
    capital: "the capital",
    bodo: "Bodø",
    caption: "Oslo to Bodø, in the north of Norway.",
    label: "A line drawn from Oslo north to Bodø, 1,200 km",
  },
  no: {
    km: "1 200 km",
    oslo: "Oslo",
    capital: "hovedstaden",
    bodo: "Bodø",
    caption: "Oslo til Bodø, i Nord-Norge.",
    label: "En linje tegnet fra Oslo nord til Bodø, 1 200 km",
  },
}

/** The figure's own grid, in cqw: 44 wide (the column), 30 tall. */
const W = 44
const H = 30
const OSLO = { x: 7, y: 26.4 }
const BODO = { x: 12.6, y: 3.4 }

/** A small loop drawn round a point, overshooting its start. */
function loop(x: number, y: number, r: number) {
  return `M ${x - r * 0.7} ${y - r * 0.8} C ${x + r * 0.4} ${y - r * 1.25}, ${x + r * 1.15} ${y - r * 0.2}, ${x + r * 0.9} ${y + r * 0.55} C ${x + r * 0.55} ${y + r * 1.25}, ${x - r * 0.9} ${y + r * 1.05}, ${x - r * 1.05} ${y + r * 0.1} C ${x - r * 1.1} ${y - r * 0.55}, ${x - r * 0.4} ${y - r * 1.1}, ${x + r * 0.25} ${y - r * 1.05}`
}

/** Oslo to Bodø, bowed slightly as a hand would draw it, ending short of each loop. */
const LINE = `M ${OSLO.x + 0.4} ${OSLO.y - 1.6} C ${OSLO.x + 0.2} ${OSLO.y - 9}, ${BODO.x + 0.9} ${BODO.y + 12}, ${BODO.x - 0.1} ${BODO.y + 1.7}`

function Distance({ lang, on, color }: FigureProps) {
  const t = T[lang]
  return (
    <figure className="relative" style={{ margin: 0 }}>
      <div role="img" aria-label={t.label} className="relative" style={{ width: `${W}cqw`, height: `${H}cqw` }}>
        <svg aria-hidden viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 h-full w-full" style={{ overflow: "visible" }}>
          <g fill="none" stroke={color} strokeWidth={0.26} strokeLinecap="round" strokeLinejoin="round">
            <Stroke d={loop(OSLO.x, OSLO.y, 1.1)} on={on} delay={250} dur={360} />
            <Stroke d={LINE} on={on} delay={560} dur={900} />
            <Stroke d={loop(BODO.x, BODO.y, 1.1)} on={on} delay={1400} dur={360} />
          </g>
          <circle cx={OSLO.x} cy={OSLO.y} r={0.32} fill={G.ink} />
          <circle cx={BODO.x} cy={BODO.y} r={0.32} fill={G.ink} />
        </svg>

        <span aria-hidden className="absolute" style={{ left: `${BODO.x + 2.6}cqw`, top: `${BODO.y - 1.3}cqw`, fontWeight: 560 }}>
          {t.bodo}
        </span>
        <span aria-hidden className="absolute" style={{ left: `${OSLO.x + 2.6}cqw`, top: `${OSLO.y - 1.3}cqw`, whiteSpace: "nowrap" }}>
          <span style={{ fontWeight: 560 }}>{t.oslo}</span> <span style={{ color: G.grey }}>{t.capital}</span>
        </span>
        <span
          aria-hidden
          className="absolute tabular-nums"
          style={{ left: "17.6cqw", top: "11.2cqw", fontSize: "6cqw", lineHeight: 1, fontWeight: 560, letterSpacing: "-0.035em", whiteSpace: "nowrap" }}
        >
          {t.km}
        </span>
      </div>
      <Caption>{t.caption}</Caption>
    </figure>
  )
}

export default function TheDistance() {
  return (
    <LongPost
      label="The long Bodø post, the distance from Oslo drawn by hand"
      lang="en"
      figure={{ slug: "building-in-bodo", section: 0, after: 0, Figure: Distance }}
    />
  )
}
