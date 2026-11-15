"use client"

import * as React from "react"

import { uiCopy } from "@/lib/companies"

import { G, TravelRing, useBox } from "../../round-2/h/chrome"
import { companiesPost, words, WPM, type Fact } from "./_text"
import { FAINT, HAIR, LongPage, MUTED, PARA, PARA_GAP, PEN, PenToggle, PostHead, Rail, RailItems, RULE, usePage, useReading } from "./_long"

/**
 * 77 — The facts margin.
 *
 * benji's margin holds commentary. Here the right margin holds a running
 * ledger instead: each section's companies with the year and the stage the
 * site gives them (lib/companies), added as you reach the section. The rows
 * of the part you are reading are ink; the ones you have passed step back to
 * grey; the pen rings one fact only, Docdir's "Acquired", once it is on the
 * list. The ledger stays put while the text scrolls, and steps aside when
 * the footer comes up.
 */

const UI = {
  en: { label: "Facts so far", company: "Company" },
  no: { label: "Fakta så langt", company: "Selskap" },
}

export default function TheFactsMargin() {
  const scrollerRef = React.useRef<HTMLDivElement>(null)
  const { lang, setLang, pen, setPen, armed } = usePage()
  const post = companiesPost(lang)
  const t = UI[lang]
  const u = uiCopy[lang]
  const { active, depth, end, goTo } = useReading(scrollerRef, lang)
  const read = `${Math.max(1, Math.round(words(post.sections.flatMap((s) => s.paras)) / WPM))} min`

  // A section's facts join once its first lines are in view; the rail's
  // active section is the one in ink.
  const [reached, setReached] = React.useState({ n: 0, key: lang })
  React.useEffect(() => {
    const el = scrollerRef.current
    if (!el) return
    const base = el.getBoundingClientRect().top - el.scrollTop
    let n = 0
    el.querySelectorAll("[data-section]").forEach((s, i) => {
      if (s.getBoundingClientRect().top - base + el.clientHeight * 0.12 <= depth) n = i + 1
    })
    setReached((r) => (r.key === lang && r.n >= n ? r : { n: Math.max(n, r.key === lang ? r.n : 0), key: lang }))
  }, [depth, lang])
  const n = Math.max(reached.key === lang ? reached.n : 0, active + 1)

  const rows: (Fact & { s: number })[] = post.sections.slice(0, n).flatMap((s, i) => s.facts.map((f) => ({ ...f, s: i })))

  return (
    <LongPage
      label="A long post about the companies, with a running ledger of their facts in the margin"
      lang={lang}
      setLang={setLang}
      scrollerRef={scrollerRef}
      rail={
        <Rail lang={lang}>
          <RailItems items={post.sections.map((s) => s.name)} active={active} onGo={goTo} />
          <PenToggle pen={pen} setPen={setPen} lang={lang} />
        </Rail>
      }
      margin={<Ledger label={t.label} heads={[u.mYear, t.company, u.mStage]} rows={rows} active={active} hidden={end} ring={armed && pen} />}
      css={CSS}
    >
      <PostHead meta={post.span} title={post.title} read={read} />
      <div data-body>
        {post.sections.map((s, i) => (
          <section key={s.name} data-section style={{ marginTop: i ? "3em" : 0 }}>
            <h2 style={{ margin: "0 0 0.8em", fontSize: "inherit", fontWeight: 560 }}>{s.name}</h2>
            {s.paras.map((p, k) => (
              <p key={k} style={{ ...PARA, marginTop: k ? PARA_GAP : 0 }}>
                {p}
              </p>
            ))}
          </section>
        ))}
      </div>
      <div data-end style={{ height: 1, marginTop: "2em" }} />
    </LongPage>
  )
}

function Ledger({
  label,
  heads,
  rows,
  active,
  hidden,
  ring,
}: {
  label: string
  heads: [string, string, string]
  rows: (Fact & { s: number })[]
  active: number
  hidden: boolean
  ring: boolean
}) {
  const listRef = React.useRef<HTMLDivElement>(null)
  const docRef = React.useRef<HTMLSpanElement | null>(null)
  const hasDoc = rows.some((r) => r.key === "docdir")
  const box = useBox(listRef, () => (hasDoc ? docRef.current : null), [hasDoc, rows.length])
  const cols = "4.4cqw 1fr auto"
  return (
    <aside
      aria-label={label}
      className="p77-ledger absolute z-[8]"
      data-hidden={hidden || undefined}
      style={{ left: "74.6cqw", top: "21.2cqw", width: "22.6cqw", fontSize: "1.75cqw", lineHeight: 1.3 }}
    >
      <div className="grid tabular-nums" style={{ gridTemplateColumns: cols, gap: "1cqw", color: FAINT, paddingBottom: "0.8cqw" }}>
        <span>{heads[0]}</span>
        <span>{heads[1]}</span>
        <span>{heads[2]}</span>
      </div>
      <div ref={listRef} className="relative">
        {rows.map((r, i) => (
          <div
            key={r.key}
            className="p77-row grid items-baseline tabular-nums"
            data-now={r.s === active || undefined}
            style={{ gridTemplateColumns: cols, gap: "1cqw", padding: "0.9cqw 0", borderTop: `1px solid ${i ? HAIR : RULE}` }}
          >
            <span style={{ color: MUTED }}>{r.year}</span>
            <span className="p77-name" style={{ fontWeight: 520 }}>
              {r.name}
            </span>
            <span className="p77-out" style={{ textAlign: "right", whiteSpace: "nowrap" }}>
              <span ref={r.key === "docdir" ? docRef : undefined}>{r.outcome}</span>
            </span>
          </div>
        ))}
        <TravelRing box={box} k="docdir" on={ring && hasDoc} color={PEN} width={1.4} />
      </div>
    </aside>
  )
}

const CSS = `
.p77-ledger { transition-property: opacity; transition-duration: 220ms; }
.p77-ledger[data-hidden] { opacity: 0; pointer-events: none; }
.p77-row { animation: p77-in 360ms cubic-bezier(.2,.8,.2,1) both; }
.p77-name, .p77-out { color: rgba(18,18,18,0.5); transition-property: color; transition-duration: 320ms; }
.p77-row[data-now] .p77-name { color: ${G.ink}; }
.p77-row[data-now] .p77-out { color: rgba(18,18,18,0.6); }
@keyframes p77-in { from { opacity: 0; transform: translateY(0.6cqw); } to { opacity: 1; transform: none; } }
@media (prefers-reduced-motion: reduce) {
  .p77-row { animation: p77-fade 160ms ease both; }
  .p77-name, .p77-out { transition-duration: 0ms; }
  @keyframes p77-fade { from { opacity: 0; } to { opacity: 1; } }
}
`
