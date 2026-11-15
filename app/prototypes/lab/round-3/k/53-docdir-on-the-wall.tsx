"use client"

import * as React from "react"

import { companies, uiCopy, type Lang } from "@/lib/companies"
import { posts, writingCopy } from "@/lib/posts"

import { Bar, C, RING, useSeen } from "../../kit"
import { useReducedMotion, wall } from "../../round-1/c/ground"
import { useSeenIn } from "../../round-2/f/frame"
import { Frame } from "../../round-2/h/chrome"
import { CompanyHead, Facts } from "./_company"
import { COL, Column, Footer, G, Header, K_CSS, Page, ReadNext, Rule, href, stay } from "./_page"

/**
 * 53 — Docdir, with the product on the wall.
 *
 * The company page from 29: back to Portfolio, the name, the facts as a
 * ledger with one green ring on Acquired and the pen in the margin. Below it
 * 13's grid wall is used for one thing only: a full-width stage for the
 * product. The sales prospectus arrives a little off the grid and settles
 * onto its lines the first time you scroll to it. Then the story, the post
 * about the sale, 19's read next and 38's footer. Green is the pen, the
 * passed checks and the copy, and nothing else.
 */

const GREEN = "#178A5A"
const CELL = 4
const STAGE_H = 32
const CARD = { w: 20, h: 24 }
const REST = { x: 40, y: 4 }
const OFF = { x: 41.6, y: 5.4 }

const CARD_COPY: Record<Lang, { title: string; foot: string; caption: string }> = {
  en: { title: "Sales prospectus", foot: "Quality-checked", caption: "The sales prospectus every Norwegian property sale depends on, checked." },
  no: { title: "Salgsoppgave", foot: "Kvalitetssikret", caption: "Salgsoppgaven hver norske eiendomshandel er avhengig av, kontrollert." },
}

function Stage({ lang, scrollerRef }: { lang: Lang; scrollerRef: React.RefObject<HTMLDivElement | null> }) {
  const reduced = useReducedMotion()
  const stageRef = React.useRef<HTMLDivElement>(null)
  const seen = useSeenIn(scrollerRef, stageRef, 0.8)
  const [pos, setPos] = React.useState(OFF)
  const t = CARD_COPY[lang]

  // One shot (13): it lands a little off the grid, then settles onto it.
  React.useEffect(() => {
    if (!seen) return
    const id = window.setTimeout(() => setPos(REST), reduced ? 0 : 650)
    return () => window.clearTimeout(id)
  }, [seen, reduced])

  return (
    <figure style={{ margin: "7cqw 0 0" }}>
      <div
        ref={stageRef}
        className="relative"
        style={{
          height: `${STAGE_H}cqw`,
          ...wall(`${CELL}cqw`),
          boxShadow: `inset 0 1px 0 ${G.hair}, inset 0 -1px 0 ${G.hair}`,
        }}
      >
        <div
          role="img"
          aria-label={`${t.title}: four checks passed. ${t.foot}.`}
          className="absolute flex flex-col"
          style={{
            left: 0,
            top: 0,
            width: `${CARD.w}cqw`,
            height: `${CARD.h}cqw`,
            padding: "2cqw",
            gap: "1.3cqw",
            background: C.white,
            borderRadius: "0.8cqw",
            boxShadow: RING,
            transform: `translate(${pos.x}cqw, ${pos.y}cqw)`,
            opacity: seen ? 1 : 0,
            transitionProperty: "transform, opacity",
            transitionDuration: reduced ? "0ms, 200ms" : "300ms, 260ms",
            transitionTimingFunction: "cubic-bezier(0.2, 0.8, 0.2, 1)",
          }}
        >
          <span style={{ fontWeight: 560, fontSize: "1.9cqw" }}>{t.title}</span>
          {["78%", "64%", "84%", "52%"].map((w, i) => (
            <span key={i} className="flex items-center" style={{ gap: "1cqw" }}>
              <svg viewBox="0 0 12 12" aria-hidden style={{ width: "1.5cqw", height: "1.5cqw", flexShrink: 0 }}>
                <path d="M2 6.4 4.8 9 10 3" fill="none" stroke={GREEN} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <Bar w={w} />
            </span>
          ))}
          <span style={{ marginTop: "auto", color: G.grey, fontSize: "1.7cqw" }}>{t.foot}</span>
        </div>
      </div>
      <figcaption style={{ marginLeft: `${COL.left}cqw`, width: `${COL.width}cqw`, marginTop: "1.6cqw", color: G.faint, fontSize: "1.85cqw" }}>
        {t.caption}
      </figcaption>
    </figure>
  )
}

export default function DocdirOnTheWall() {
  const [seenRef, seen] = useSeen<HTMLDivElement>()
  const scrollerRef = React.useRef<HTMLDivElement>(null)
  const [lang, setLang] = React.useState<Lang>("en")
  const c = companies[lang].docdir
  const post = posts[lang]["docdir-visma"]

  return (
    <Frame label="christerhagen.com/portfolio/docdir, the product on the grid wall">
      <style>{K_CSS}</style>
      <div ref={seenRef} className="absolute inset-0">
        <Page
          label="The Docdir page"
          lang={lang}
          pen={GREEN}
          scrollerRef={scrollerRef}
          header={<Header lang={lang} setLang={setLang} on={seen} pen={GREEN} exact={false} />}
        >
          <Column style={{ paddingTop: "5.6cqw" }}>
            <CompanyHead slug="docdir" lang={lang} />
            <Facts slug="docdir" lang={lang} pen={GREEN} on={seen} />
          </Column>

          <Stage lang={lang} scrollerRef={scrollerRef} />

          <Column>
            <div style={{ marginTop: "6cqw" }}>
              {c.body.map((para, i) => (
                <p key={i} style={{ marginTop: i ? "1.6cqw" : 0, textWrap: "pretty" }}>
                  {para}
                </p>
              ))}
              <p style={{ marginTop: "1.6cqw" }}>
                <a className="k-link inline-flex items-center" href={c.site} target="_blank" rel="noopener noreferrer" style={{ minHeight: 44 }}>
                  {uiCopy[lang].visitLabel} ↗
                </a>
              </p>
            </div>

            <Rule top="5cqw">{writingCopy[lang].kicker}</Rule>
            <a
              href={href("/writing/docdir-visma", lang)}
              onClick={stay}
              className="flex items-center justify-between"
              style={{ minHeight: 44, gap: "2cqw", color: G.ink, textDecoration: "none" }}
            >
              <span className="k-link">{post.title}</span>
              <span className="shrink-0 tabular-nums" style={{ color: G.faint }}>
                {post.date}
              </span>
            </a>

            <ReadNext slug="docdir" lang={lang} />
          </Column>

          <Footer lang={lang} pen={GREEN} />
        </Page>
      </div>
    </Frame>
  )
}
