"use client"

import * as React from "react"
import Image from "next/image"

import { homeContent, type HomeContent } from "@/lib/content"
import { writingCopy } from "@/lib/posts"

import { useSeenIn } from "../../round-2/f/frame"
import { G, Ledger, Linked, META, Rail, Rule, Site, TITLE, Go, useSections, type Lang, type PKey } from "./site"

/**
 * 46 — The home page, as we would ship it.
 *
 * 36's header (home, so nothing is ringed: the name is where you are), 02's
 * rail over the four sections, 26's hero and now/before, the about paragraph
 * with 07's colourless links, 32's ledger with the newest under a blue wash,
 * and 38's footer as the contact. One blue pen for all of it.
 */

const PEN = "#2B5CD8"

export const LINKS: Record<Lang, [string, PKey][]> = {
  en: [
    ["Codebase", "codebase"],
    ["Not Another VC", "nav"],
    ["Advanti Estate", "advanti-estate"],
    ["writes software in the open", "github"],
    ["Docdir", "docdir"],
  ],
  no: [
    ["Codebase", "codebase"],
    ["Not Another VC", "nav"],
    ["Advanti Estate", "advanti-estate"],
    ["skriver programvare i åpen kildekode", "github"],
    ["Docdir", "docdir"],
  ],
}

const NOTE: Record<Lang, string> = {
  en: "the second bodø company visma bought",
  no: "det andre bodø-selskapet visma kjøpte",
}

export function split(c: HomeContent) {
  const now = c.work.filter((w) => !w.period.startsWith("Sunset"))
  const before = c.work.filter((w) => w.period.startsWith("Sunset")).map((w) => ({ ...w, period: w.period.replace(/^Sunset · /, "") }))
  return { now, before }
}

export function WorkLedger({ rows }: { rows: { name: string; role: string; period: string }[] }) {
  return (
    <ul>
      {rows.map((r, i) => (
        <li
          key={r.name}
          className="flex items-baseline justify-between"
          style={{ gap: "2cqw", padding: "0.8cqw 0", borderTop: i ? `1px solid ${G.hair}` : undefined }}
        >
          <span className="min-w-0">
            <span style={{ fontWeight: 520 }}>{r.name}</span> <span style={{ color: G.faint }}>{r.role.split(" · ")[1]}</span>
          </span>
          <span className="shrink-0 tabular-nums" style={{ color: G.grey }}>
            {r.period.replace(/^(Since|Siden) /, (m) => m.toLowerCase())}
          </span>
        </li>
      ))}
    </ul>
  )
}

export default function Home() {
  const scrollerRef = React.useRef<HTMLDivElement>(null)
  const listRef = React.useRef<HTMLUListElement>(null)
  const [lang, setLang] = React.useState<Lang>("en")
  const { active, go } = useSections(scrollerRef)
  const seen = useSeenIn(scrollerRef, listRef, 0.9)
  const c = homeContent[lang]
  const { now, before } = split(c)

  return (
    <Site
      label="christerhagen.com, the home page"
      pen={PEN}
      current="home"
      lang={lang}
      setLang={setLang}
      scrollerRef={scrollerRef}
      rail={() => <Rail items={[c.lblAbout, c.lblNow, c.lblWriting, c.lblContact]} active={active} onPick={go} />}
    >
      <section data-section>
        <div className="flex items-start" style={{ gap: "3.4cqw" }}>
          <div className="min-w-0 flex-1">
            <h1 style={{ ...TITLE, margin: 0 }}>{c.heroHead}</h1>
            <p style={{ margin: "1.6cqw 0 0", color: G.grey, textWrap: "pretty" }}>{c.heroSub}</p>
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
      </section>

      <section data-section>
        <Rule>{c.lblNow}</Rule>
        <WorkLedger rows={now} />
        <Rule top="3.4cqw">{lang === "en" ? "Before" : "Før"}</Rule>
        <WorkLedger rows={before} />
      </section>

      <section data-section>
        <Rule>{c.lblWriting}</Rule>
        <Ledger lang={lang} on={seen} note={NOTE[lang]} listRef={listRef} />
        <p style={{ margin: "1.6cqw 0 0", ...META }}>
          <Go href="/writing" className="j-link h2-hit" style={{ color: G.grey }}>
            {writingCopy[lang].backLabel} →
          </Go>
        </p>
      </section>

      <section data-section>
        <Rule>{c.lblContact}</Rule>
        <p style={{ margin: 0, fontWeight: 560 }}>{c.ctaHead}</p>
        <p style={{ margin: "0.6cqw 0 0", color: G.grey, textWrap: "pretty" }}>{c.ctaBody}</p>
      </section>
    </Site>
  )
}
