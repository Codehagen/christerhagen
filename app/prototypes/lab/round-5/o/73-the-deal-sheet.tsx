"use client"

import * as React from "react"

import { companies, type Lang } from "@/lib/companies"
import { homeContent } from "@/lib/content"

import { G } from "../../round-2/h/chrome"
import { COL, Caption, FigNote, type FigureProps, LongPost, PenSvg, Stroke, tightRing, useFigureRects } from "./_long"

/**
 * 73 — The deal sheet.
 *
 * The Docdir post, long. benji's figure would be a demo on a grey stage; this
 * one is the outcome set down the way a deal is: a small term-sheet ledger,
 * tabular, on the ground with no card around it. Every value is one the site
 * already states (lib/companies, lib/posts). Price is not on the site, so the
 * sheet has no price row. The pen rings one figure, the 2 beside Docdir in
 * Visma's Bodø purchases, ticks out to the margin and says it.
 */

const RULE = "rgba(18,18,18,0.14)"

type Sheet = {
  title: string
  outcome: string
  rows: [string, string][]
  bodo: string
  buys: [string, string][]
  note: string
  label: string
}

function sheet(lang: Lang): Sheet {
  const d = companies[lang].docdir
  const en = lang === "en"
  return {
    title: "Docdir → Broker AS",
    outcome: `${d.stage}, 2026`,
    rows: en
      ? [
          ["Company", `${d.name}, ${d.sector}`],
          ["Buyer", "Broker AS, part of the Visma group"],
          ["Closed", "Early 2026"],
          ["Built in", "Bodø"],
          ["My role", d.role],
        ]
      : [
          ["Selskap", `${d.name}, ${d.sector}`],
          ["Kjøper", "Broker AS, en del av Visma-konsernet"],
          ["Gjennomført", "Tidlig i 2026"],
          ["Bygget i", "Bodø"],
          ["Min rolle", d.role],
        ],
    bodo: en ? "Visma in Bodø" : "Visma i Bodø",
    buys: [
      ["1", "PowerOffice"],
      ["2", "Docdir"],
    ],
    note: en ? "the second bodø company visma bought" : "det andre bodø-selskapet visma kjøpte",
    label: en ? "Deal sheet: Docdir acquired by Broker AS, part of the Visma group, in 2026" : "Avtaleark: Docdir kjøpt av Broker AS, en del av Visma-konsernet, i 2026",
  }
}

const cell: React.CSSProperties = { padding: "1.05cqw 0", borderTop: `1px solid ${G.hair}` }

function DealSheet({ lang, on, color }: FigureProps) {
  const s = sheet(lang)
  const boxRef = React.useRef<HTMLElement>(null)
  const { rects, u } = useFigureRects(boxRef, lang)
  const two = rects.two
  const tick = two && u ? `M ${COL * u + u * 1.3} ${two.y + two.h * 0.5} L ${COL * u + u * 2.7} ${two.y + two.h * 0.42}` : null

  return (
    <figure ref={boxRef} className="relative" aria-label={s.label} style={{ margin: 0 }}>
      <div className="flex items-baseline justify-between" style={{ paddingBottom: "1.05cqw" }}>
        <span style={{ fontWeight: 560, letterSpacing: "-0.006em" }}>{s.title}</span>
        <span className="tabular-nums" style={{ color: G.grey }}>
          {s.outcome}
        </span>
      </div>
      <dl className="tabular-nums" style={{ margin: 0, display: "grid", gridTemplateColumns: "11.5cqw 1fr" }}>
        {s.rows.map(([k, v], i) => (
          <React.Fragment key={k}>
            <dt style={{ ...cell, color: G.grey, borderTopColor: i === 0 ? RULE : G.hair }}>{k}</dt>
            <dd style={{ ...cell, margin: 0, textAlign: "right", borderTopColor: i === 0 ? RULE : G.hair }}>{v}</dd>
          </React.Fragment>
        ))}
        <dt style={{ ...cell, color: G.grey }}>{s.bodo}</dt>
        <dd style={{ ...cell, margin: 0, borderBottom: `1px solid ${G.hair}` }}>
          {s.buys.map(([n, name]) => (
            <span key={n} className="flex items-baseline justify-end" style={{ gap: "1.6cqw", lineHeight: 1.6 }}>
              <span>{name}</span>
              <span data-mark={n === "2" ? "two" : undefined} style={{ color: n === "2" ? G.ink : G.grey, fontWeight: n === "2" ? 560 : 460, minWidth: "1.4cqw", textAlign: "right" }}>
                {n}
              </span>
            </span>
          ))}
        </dd>
      </dl>
      <span className="sr-only">{s.note}</span>

      {two && u ? (
        <FigNote on={on} delay={1100} style={{ left: (COL + 3.4) * u, top: two.y - 0.4 * u, width: "19cqw" }}>
          {s.note}
        </FigNote>
      ) : null}

      <PenSvg u={u} color={color}>
        {two ? <Stroke d={tightRing(two, u)} on={on} delay={250} dur={640} /> : null}
        {tick ? <Stroke d={tick} on={on} delay={800} dur={320} /> : null}
      </PenSvg>

      <Caption>{homeContent[lang].exits[0].desc}</Caption>
    </figure>
  )
}

export default function TheDealSheet() {
  return (
    <LongPost
      label="The long Docdir post, the sale as a deal sheet"
      lang="en"
      figure={{ slug: "docdir-visma", section: 1, after: 0, Figure: DealSheet }}
    />
  )
}
