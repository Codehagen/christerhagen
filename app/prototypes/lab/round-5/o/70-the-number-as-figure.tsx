"use client"

import * as React from "react"

import type { Lang } from "@/lib/companies"

import { G } from "../../round-2/h/chrome"
import { COL, Caption, FigNote, type FigureProps, LongPost, PenSvg, Stroke, handArrow, tightRing, useFigureRects } from "./_long"

/**
 * 70 — The number as figure.
 *
 * The apparel post, long. benji's figure is a picture of an interface on a
 * grey stage; this one is made of a number: Refenze's growth at its peak, set
 * large and tabular in the column with its source line under it. The pen
 * rings the unit, because "a month" is the part a reader skips and the part
 * that makes the number true, and its note says what the site says: at the
 * peak, not every month.
 */

const T: Record<Lang, { figure: string; unit: string; note: string; source: string; caption: string; label: string }> = {
  en: {
    figure: "25%",
    unit: "a month",
    note: "at its peak, not every month",
    source: "Refenze, fitness apparel, 2016–2018",
    caption: "At its peak it grew around 25% a month.",
    label: "25% a month: Refenze's growth at its peak",
  },
  no: {
    figure: "25 %",
    unit: "i måneden",
    note: "på det meste, ikke hver måned",
    source: "Refenze, treningsklær, 2016–2018",
    caption: "På det meste vokste det rundt 25 % i måneden.",
    label: "25 % i måneden: Refenzes vekst på det meste",
  },
}

function Growth({ lang, on, color }: FigureProps) {
  const t = T[lang]
  const boxRef = React.useRef<HTMLElement>(null)
  const { rects, u } = useFigureRects(boxRef, lang)
  const unit = rects.unit
  const note = rects.note
  const arrow =
    unit && note && u ? handArrow(unit.x + unit.w + u * 1, unit.y + unit.h * 0.1, note.x - u * 0.9, note.y + note.h * 0.5, u, 2.2) : null

  return (
    <figure ref={boxRef} className="relative" style={{ margin: 0, paddingTop: "1.6cqw", borderTop: `1px solid ${G.hair}` }}>
      <p role="img" aria-label={t.label} className="flex items-baseline tabular-nums" style={{ margin: 0, gap: "1.8cqw" }}>
        <span aria-hidden style={{ fontSize: "14cqw", lineHeight: 0.92, fontWeight: 560, letterSpacing: "-0.045em" }}>
          {t.figure}
        </span>
        <span aria-hidden data-mark="unit" style={{ fontSize: "2.6cqw", fontWeight: 520, letterSpacing: "-0.012em", whiteSpace: "nowrap" }}>
          {t.unit}
        </span>
      </p>
      <Caption style={{ margin: "1.8cqw 0 0", paddingTop: "1cqw", borderTop: `1px solid ${G.hair}`, maxWidth: "none" }}>
        <span className="tabular-nums" style={{ color: G.ink }}>{t.source}.</span> {t.caption}
      </Caption>

      <FigNote on={on} delay={1300} style={{ left: `${COL + 3.4}cqw`, top: "3.4cqw", width: "19cqw" }}>
        <span data-mark="note">{t.note}</span>
      </FigNote>

      <PenSvg u={u} color={color}>
        {unit ? <Stroke d={tightRing(unit, u)} on={on} delay={250} dur={640} /> : null}
        {arrow ? <Stroke d={arrow.line} on={on} delay={810} dur={420} /> : null}
        {arrow ? <Stroke d={arrow.head} on={on} delay={1210} dur={160} /> : null}
      </PenSvg>
    </figure>
  )
}

export default function TheNumberAsFigure() {
  return (
    <LongPost
      label="The long apparel post, 25% a month as the figure"
      lang="en"
      figure={{ slug: "apparel-to-software", section: 0, after: 0, Figure: Growth }}
    />
  )
}
