"use client"

import * as React from "react"

import type { Lang } from "@/lib/companies"
import { aboutContent } from "@/lib/content"

import { fontSerif } from "../../kit"
import { Caption, FigNote, type FigureProps, LongPost, PenSvg, Stroke, handArrow, tightRing, useFigureRects } from "./_long"

/**
 * 71 — The clipping.
 *
 * The Docdir post, long. Where benji illustrates with a demo on a grey stage,
 * this figure is evidence: the Avisa Nordland piece on the sale, set as a
 * newspaper clipping cut out and laid on the ground, its headline verbatim
 * from lib/content (the press list carries no date, so none is printed). The
 * article's own text is not ours, so it stands as grey newsprint. The pen
 * rings the fact in the headline, the sale, and from the column's left,
 * beside the cutting, says what was sold to whom; the caption links to the
 * article.
 */

const ITEM = aboutContent.en.press[0]
const RINGED = "Solgt"
const REST = ITEM.title.slice(RINGED.length)

const T: Record<Lang, { note: string; read: string; label: string }> = {
  en: { note: "sold: docdir, to visma", read: "Read the article", label: `Clipping from ${ITEM.outlet}: ${ITEM.title}` },
  no: { note: "solgt: docdir, til visma", read: "Les saken", label: `Utklipp fra ${ITEM.outlet}: ${ITEM.title}` },
}

/** A scissor cut: never quite straight, never quite square. */
const CUT =
  "polygon(0.6% 1.4%, 18% 0.4%, 41% 1.1%, 63% 0%, 86% 0.9%, 99.4% 0.2%, 100% 22%, 99.2% 47%, 99.8% 71%, 99.1% 98.6%, 77% 99.6%, 52% 98.9%, 28% 100%, 6% 99.2%, 0.3% 99.7%, 0.9% 74%, 0% 49%, 0.7% 23%)"

const PRINT = "rgba(18,18,18,0.12)"

function Newsprint({ widths }: { widths: string[] }) {
  return (
    <span className="flex flex-col" style={{ gap: "0.62cqw" }}>
      {widths.map((w, i) => (
        <span key={i} className="block" style={{ width: w, height: "0.55cqw", background: PRINT }} />
      ))}
    </span>
  )
}

function Clipping({ lang, on, color }: FigureProps) {
  const t = T[lang]
  const boxRef = React.useRef<HTMLElement>(null)
  const { rects, u } = useFigureRects(boxRef, lang)
  const ring = rects.sold
  const note = rects.note
  const arrow = ring && note && u ? handArrow(note.x + note.w + u * 0.6, note.y + note.h * 0.35, ring.x - u * 1.4, ring.y + ring.h * 0.45, u, 1.6) : null

  return (
    <figure ref={boxRef} className="relative" style={{ margin: 0 }}>
      <div style={{ width: "32cqw", marginLeft: "12cqw", rotate: "-1.4deg", filter: "drop-shadow(0 0 0.6px rgba(18,18,18,0.28)) drop-shadow(0 7px 9px rgba(18,18,18,0.07))" }}>
        <div
          lang="nb"
          role="img"
          aria-label={t.label}
          style={{ clipPath: CUT, background: "#FFFFFF", padding: "2cqw 2.2cqw 2.4cqw", fontFamily: fontSerif }}
        >
          <span
            aria-hidden
            className="flex items-baseline justify-between"
            style={{ paddingBottom: "0.7cqw", borderBottom: `1px solid rgba(18,18,18,0.55)`, fontSize: "1.35cqw", letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 600 }}
          >
            {ITEM.outlet}
            <span style={{ width: "6cqw", height: "0.5cqw", background: PRINT }} />
          </span>
          <span
            aria-hidden
            className="block"
            style={{ margin: "1.3cqw 0 1.5cqw", fontSize: "2.95cqw", lineHeight: 1.08, fontWeight: 600, letterSpacing: "-0.012em", textWrap: "balance" }}
          >
            <span data-mark="sold">{RINGED}</span>
            {REST}
          </span>
          <span aria-hidden className="grid grid-cols-2" style={{ gap: "1.6cqw" }}>
            <Newsprint widths={["100%", "96%", "100%", "88%", "100%", "62%"]} />
            <Newsprint widths={["100%", "100%", "92%", "100%", "97%", "100%"]} />
          </span>
        </div>
      </div>

      <FigNote on={on} delay={1300} style={{ left: 0, top: "4.6cqw", width: "9.6cqw" }}>
        <span data-mark="note">{t.note}</span>
      </FigNote>

      <PenSvg u={u} color={color}>
        {ring ? <Stroke d={tightRing(ring, u)} on={on} delay={250} dur={640} /> : null}
        {arrow ? <Stroke d={arrow.line} on={on} delay={810} dur={420} /> : null}
        {arrow ? <Stroke d={arrow.head} on={on} delay={1210} dur={160} /> : null}
      </PenSvg>

      <Caption style={{ marginLeft: "12cqw" }}>
        {ITEM.outlet}.{" "}
        <a href={ITEM.url} target="_blank" rel="noopener noreferrer" className="o5-link h2-press">
          {t.read} ↗
        </a>
      </Caption>
    </figure>
  )
}

export default function TheClipping() {
  return (
    <LongPost
      label="The long Docdir post, the Avisa Nordland clipping"
      lang="no"
      figure={{ slug: "docdir-visma", section: 1, after: 0, Figure: Clipping }}
    />
  )
}
