"use client"

import * as React from "react"

import type { Lang } from "@/lib/companies"

import { G } from "../../round-2/h/chrome"
import { Caption, FigNote, type FigureProps, LongPost, PenSvg, Stroke, handArrow, tightRing, useFigureRects } from "./_long"

/**
 * 69 — The document as figure.
 *
 * The Docdir post, long. Where benji would put a grey stage with a live demo,
 * the figure is the document itself: a sales prospectus drawn as paper lying
 * on the ground, a second sheet under it (assembled), its contents only
 * grey lines and a photo block, since what is written in one is not ours to
 * invent. The pen rings the one line that is Docdir's: quality-checked.
 */

const T: Record<Lang, { title: string; foot: string; note: string; caption: string; label: string }> = {
  en: {
    title: "Sales prospectus",
    foot: "Quality-checked",
    note: "the part we let software do",
    caption: "The worst part of a real-estate transaction.",
    label: "A sales prospectus, drawn as a sheet of paper, marked quality-checked",
  },
  no: {
    title: "Salgsoppgave",
    foot: "Kvalitetssikret",
    note: "delen vi lot programvare gjøre",
    caption: "Den verste delen av en eiendomshandel.",
    label: "En salgsoppgave, tegnet som et ark, merket kvalitetssikret",
  },
}

const SHEET = { w: 21, h: 29.7 }
const PAPER = "0 0 0 1px rgba(18,18,18,0.07), 0 1px 2px rgba(18,18,18,0.04), 0 10px 22px -14px rgba(18,18,18,0.16)"

/** A grey line standing in for words that are not ours to write. */
function Ln({ w, h }: { w: string; h: number }) {
  return <span aria-hidden className="block rounded-full" style={{ width: w, height: `${h}cqw`, background: "rgba(18,18,18,0.075)" }} />
}

function Row({ a, b }: { a: string; b: string }) {
  return (
    <span className="flex items-center justify-between" style={{ padding: "0.55cqw 0", borderTop: `1px solid ${G.hair}` }}>
      <Ln w={a} h={0.75} />
      <Ln w={b} h={0.75} />
    </span>
  )
}

function Prospectus({ lang, on, color }: FigureProps) {
  const t = T[lang]
  const boxRef = React.useRef<HTMLElement>(null)
  const { rects, u } = useFigureRects(boxRef, lang)
  const foot = rects.foot
  const note = rects.note
  const arrow = foot && note && u ? handArrow(foot.x + foot.w + u * 1.1, foot.y - u * 0.2, note.x - u * 0.9, note.y + note.h * 0.55, u, 1.8) : null

  return (
    <figure ref={boxRef} className="relative" style={{ margin: 0 }}>
      <div role="img" aria-label={t.label} className="relative" style={{ width: `${SHEET.w + 1.4}cqw`, height: `${SHEET.h + 1}cqw` }}>
        {/* the sheet under it: the prospectus is assembled from many */}
        <span
          aria-hidden
          className="absolute block"
          style={{ left: "1.2cqw", top: "0.9cqw", width: `${SHEET.w}cqw`, height: `${SHEET.h}cqw`, background: "#FFFFFF", boxShadow: PAPER, rotate: "2.2deg", borderRadius: "0.25cqw" }}
        />
        <span
          aria-hidden
          className="absolute top-0 left-0 flex flex-col"
          style={{ width: `${SHEET.w}cqw`, height: `${SHEET.h}cqw`, padding: "2cqw 2cqw 1.8cqw", gap: "1cqw", background: "#FFFFFF", boxShadow: PAPER, rotate: "-0.6deg", borderRadius: "0.25cqw" }}
        >
          <Ln w="32%" h={0.7} />
          <span style={{ fontWeight: 560, fontSize: "1.75cqw", letterSpacing: "-0.01em", lineHeight: 1.1, marginTop: "0.6cqw" }}>{t.title}</span>
          <Ln w="58%" h={0.75} />
          <span className="block" style={{ height: "7.4cqw", marginTop: "0.4cqw", background: "rgba(18,18,18,0.05)", borderRadius: "0.2cqw" }} />
          <span className="flex flex-col" style={{ marginTop: "0.3cqw" }}>
            <Row a="34%" b="22%" />
            <Row a="26%" b="30%" />
            <Row a="38%" b="18%" />
            <Row a="30%" b="26%" />
          </span>
          <span className="flex flex-col" style={{ gap: "0.6cqw", marginTop: "0.4cqw" }}>
            <Ln w="92%" h={0.7} />
            <Ln w="86%" h={0.7} />
            <Ln w="64%" h={0.7} />
          </span>
          <span className="flex items-center" style={{ marginTop: "auto", paddingTop: "1cqw", borderTop: `1px solid ${G.hair}` }}>
            <span data-mark="foot" style={{ fontSize: "1.45cqw", fontWeight: 520, letterSpacing: "-0.004em" }}>
              {t.foot}
            </span>
          </span>
        </span>
      </div>

      <FigNote on={on} delay={1300} style={{ left: `${SHEET.w + 5}cqw`, top: `${SHEET.h - 7.4}cqw`, width: "16cqw" }}>
        <span data-mark="note">{t.note}</span>
      </FigNote>

      <PenSvg u={u} color={color}>
        {foot ? <Stroke d={tightRing(foot, u)} on={on} delay={250} dur={640} /> : null}
        {arrow ? <Stroke d={arrow.line} on={on} delay={810} dur={420} /> : null}
        {arrow ? <Stroke d={arrow.head} on={on} delay={1210} dur={160} /> : null}
      </PenSvg>

      <Caption>{t.caption}</Caption>
    </figure>
  )
}

export default function TheDocumentAsFigure() {
  return (
    <LongPost
      label="The long Docdir post, the prospectus as a sheet of paper"
      lang="en"
      figure={{ slug: "docdir-visma", section: 0, after: 1, Figure: Prospectus }}
    />
  )
}
