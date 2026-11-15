"use client"

import * as React from "react"
import Image from "next/image"

import { aboutContent, homeContent } from "@/lib/content"

import { useSeenIn } from "../../round-2/f/frame"
import { LINKS, WorkLedger, split } from "./46-home"
import { G, Ledger, Linked, META, Rail, Rule, Site, TITLE, useSections, type Lang } from "./site"

/**
 * 50 — The whole site on one page.
 *
 * Home, about and writing as one long page. With nothing else to go to, the
 * band holds only the name and EN / NO, and the ring that marked the current
 * page in 36 moves into 02's rail: it sits round the section you are reading
 * and is drawn again round the next one as you scroll. 07's links, 32's
 * ledger under a green wash, 38's footer at the end.
 */

const PEN = "#15803D"

export default function OnePage() {
  const scrollerRef = React.useRef<HTMLDivElement>(null)
  const listRef = React.useRef<HTMLUListElement>(null)
  const [lang, setLang] = React.useState<Lang>("en")
  const { active, go } = useSections(scrollerRef)
  const seen = useSeenIn(scrollerRef, listRef, 0.5)
  const c = homeContent[lang]
  const a = aboutContent[lang]
  const { now, before } = split(c)
  const rail = [c.lblAbout, c.lblNow, a.lblBackground, c.lblWriting, a.lblPress, c.lblContact]

  return (
    <Site
      label="christerhagen.com as a single page"
      pen={PEN}
      current="home"
      nav={false}
      lang={lang}
      setLang={setLang}
      scrollerRef={scrollerRef}
      rail={(on) => <Rail items={rail} active={active} onPick={go} ring={{ pen: PEN, on }} />}
    >
      <section data-section>
        <div className="flex items-start" style={{ gap: "3.4cqw" }}>
          <div className="min-w-0 flex-1">
            <h1 style={{ ...TITLE, margin: 0 }}>{c.heroHead}</h1>
            <p style={{ margin: "1.6cqw 0 0", color: G.grey, textWrap: "pretty" }}>{c.heroSub}</p>
            <p style={{ margin: "1.6cqw 0 0", ...META, color: G.faint }}>{c.aboutRole.split(" · ")[1]}</p>
          </div>
          <div
            className="relative shrink-0 overflow-hidden"
            style={{ width: "11.4cqw", aspectRatio: "236 / 300", borderRadius: "0.6cqw", boxShadow: `0 0 0 1px ${G.hair}` }}
          >
            <Image
              src="/images/christer-hagen-portrait.jpg"
              alt="Christer Hagen"
              fill
              sizes="120px"
              className="object-cover"
              style={{ objectPosition: "center 22%" }}
            />
          </div>
        </div>
        <Rule>{c.lblAbout}</Rule>
        <Linked text={c.aboutBody} links={LINKS[lang]} lang={lang} />
        <p style={{ margin: "1.6cqw 0 0", color: G.grey, textWrap: "pretty" }}>{a.bio[0]}</p>
      </section>

      <section data-section>
        <Rule>{c.lblNow}</Rule>
        <WorkLedger rows={now} />
        <Rule top="3.4cqw">{lang === "en" ? "Before" : "Før"}</Rule>
        <WorkLedger rows={before} />
      </section>

      <section data-section>
        <Rule>{a.lblBackground}</Rule>
        <ul>
          {a.timeline.map((t, i) => (
            <li
              key={t.year}
              className="flex items-baseline"
              style={{ gap: "3cqw", padding: "0.8cqw 0", borderTop: i ? `1px solid ${G.hair}` : undefined }}
            >
              <span className="shrink-0 tabular-nums" style={{ width: "6cqw", color: G.grey }}>
                {t.year}
              </span>
              <span>{t.event}</span>
            </li>
          ))}
        </ul>
      </section>

      <section data-section>
        <Rule>{c.lblWriting}</Rule>
        <Ledger lang={lang} on={seen} listRef={listRef} excerpts />
      </section>

      <section data-section>
        <Rule>{a.lblPress}</Rule>
        <ul>
          {a.press.map((p, i) => (
            <li
              key={p.url}
              className="flex items-baseline justify-between"
              style={{ gap: "2.4cqw", padding: "0.8cqw 0", borderTop: i ? `1px solid ${G.hair}` : undefined }}
            >
              <a className="j-link min-w-0" href={p.url} target="_blank" rel="noopener noreferrer" lang="nb">
                {p.title}
              </a>
              <span className="shrink-0" style={{ ...META, color: G.faint }}>
                {p.outlet}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section data-section>
        <Rule>{c.lblContact}</Rule>
        <p style={{ margin: 0, fontWeight: 560 }}>{c.ctaHead}</p>
        <p style={{ margin: "0.6cqw 0 0", color: G.grey, textWrap: "pretty" }}>{c.ctaBody}</p>
      </section>
    </Site>
  )
}
