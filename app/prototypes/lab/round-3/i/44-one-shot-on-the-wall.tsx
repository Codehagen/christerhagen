"use client"

import * as React from "react"

import type { Lang } from "@/lib/companies"

import { Bar, C, RING } from "../../kit"
import { wall } from "../../round-1/c/ground"
import { G } from "../../round-2/h/chrome"
import { DesktopPost } from "./desktop"

/**
 * 44 — One shot on the wall.
 *
 * The Docdir post in Norwegian, with 13's grid wall brought back as it was
 * asked to come back: not the page, but a stage inside the column, holding
 * the one product shot the post is about, the sales prospectus. The sheet
 * arrives a little off the grid and settles onto its lines. Its green
 * checks are the pen's green: one accent for the page, shot and all.
 */

const GREEN = "#178A5A"
const WASH = "color-mix(in oklch, #178A5A 16%, transparent)"

/** The wall's cell in cqw; the stage and the sheet land on its lines. */
const CELL = 4
const STAGE = { w: 44, h: 28 }
const SHEET = { w: 20, h: 20, x: 12, y: 4 }
const OFF = { x: 13.6, y: 5.3 }

const SHOT: Record<Lang, { title: string; foot: string; caption: string; label: string }> = {
  en: {
    title: "Sales prospectus",
    foot: "Quality-checked",
    caption: "The sales prospectus: the part of the deal Docdir hands to software.",
    label: "A sales prospectus, assembled and quality-checked",
  },
  no: {
    title: "Salgsoppgave",
    foot: "Kvalitetssikret",
    caption: "Salgsoppgaven: delen av handelen Docdir gir til programvaren.",
    label: "En salgsoppgave, satt sammen og kvalitetssikret",
  },
}

const css = `
.i44-sheet { transition-property: translate; transition-duration: 520ms; transition-timing-function: cubic-bezier(.2,.8,.2,1); }
@media (prefers-reduced-motion: reduce) { .i44-sheet { transition-duration: 0ms; } }
`

function Stage({ lang, settle }: { lang: Lang; settle: boolean }) {
  const t = SHOT[lang]
  const at = settle ? SHEET : OFF
  return (
    <figure style={{ margin: "2.4cqw 0 0" }}>
      <div
        role="img"
        aria-label={t.label}
        className="relative overflow-hidden"
        style={{
          width: `${STAGE.w}cqw`,
          height: `${STAGE.h}cqw`,
          background: C.page,
          ...wall(`${CELL}cqw`),
          boxShadow: `inset 0 0 0 1px ${G.hair}`,
        }}
      >
        <div
          aria-hidden
          className="i44-sheet absolute top-0 left-0 flex flex-col"
          style={{
            width: `${SHEET.w}cqw`,
            height: `${SHEET.h}cqw`,
            translate: `${at.x}cqw ${at.y}cqw`,
            padding: "2cqw",
            gap: "1.3cqw",
            background: C.white,
            borderRadius: "0.8cqw",
            boxShadow: RING,
          }}
        >
          <span style={{ fontWeight: 560, fontSize: "1.9cqw" }}>{t.title}</span>
          {["78%", "64%", "84%", "52%"].map((w) => (
            <span key={w} className="flex items-center" style={{ gap: "1cqw" }}>
              <svg viewBox="0 0 12 12" style={{ width: "1.5cqw", height: "1.5cqw", flexShrink: 0 }}>
                <path d="M2 6.4 4.8 9 10 3" fill="none" stroke={GREEN} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <Bar w={w} />
            </span>
          ))}
          <span style={{ marginTop: "auto", color: G.grey, fontSize: "1.7cqw" }}>{t.foot}</span>
        </div>
      </div>
      <figcaption style={{ marginTop: "1.2cqw", fontSize: "1.75cqw", color: G.grey }}>{t.caption}</figcaption>
    </figure>
  )
}

export default function OneShotOnTheWall() {
  return (
    <DesktopPost
      label="The Docdir post in Norwegian, the prospectus on the wall"
      slug="docdir-visma"
      lang="no"
      color={GREEN}
      wash={WASH}
      css={css}
      afterParagraph={(p, { slug, lang, seen, armed }) =>
        slug === "docdir-visma" && p === 0 ? <Stage lang={lang} settle={seen && armed} /> : null
      }
    />
  )
}
