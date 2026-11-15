"use client"

import * as React from "react"

import { Note, Stroke } from "../../round-2/e/pen"
import { property, words, WPM, type TermPara } from "./_text"
import { COL, LongPage, PARA, PARA_GAP, PEN, PenToggle, PostHead, Rail, RailItems, tickPath, useMarks, usePage, useReading } from "./_long"

/**
 * 78 — The bilingual aside.
 *
 * An English long post about software for property, where the pen writes,
 * level with the line, the Norwegian word the site's own Norwegian copy uses
 * for a term in it, with its translation: "salgsoppgave = sales prospectus",
 * "megler = agents". A short tick at the column's edge points at the line;
 * the term itself only gets a dotted grey underline, so the prose stays
 * clean. Switch to NO and the pen writes the English back. benji's margin is
 * commentary; this one is the site being from two languages at once.
 */

export default function TheBilingualAside() {
  const scrollerRef = React.useRef<HTMLDivElement>(null)
  const columnRef = React.useRef<HTMLDivElement>(null)
  const { lang, setLang, pen, setPen, armed } = usePage()
  const post = property(lang)
  const { active, depth, first, goTo } = useReading(scrollerRef, lang)
  const { rects, u, top } = useMarks(columnRef, lang)
  const paras = post.sections.flatMap((s) => s.paras)
  const read = `${Math.max(1, Math.round(words(paras.map((p) => p.text)) / WPM))} min`

  // Every term in reading order, placed level with its line and pushed down
  // when the one above would overlap it.
  const terms = paras.flatMap((p, pi) => p.terms.map((t, ti) => ({ ...t, id: `t${pi}-${ti}` })))
  let floor = -Infinity
  let rank = 0
  const placed = u
    ? terms.flatMap((t) => {
        const r = rects[t.id]
        if (!r) return []
        const y = Math.max(r.y - 0.3 * u, floor)
        floor = y + 5.6 * u
        const seen = depth >= top + r.y + r.h
        const atLoad = top + r.y + r.h <= first
        const delay = atLoad ? 400 + rank++ * 900 : 250
        return [{ ...t, r, y, on: armed && pen && seen, delay }]
      })
    : []

  return (
    <LongPage
      label="An English long post with Norwegian terms and their translations in the pen's margin"
      lang={lang}
      setLang={setLang}
      scrollerRef={scrollerRef}
      columnRef={columnRef}
      rail={
        <Rail lang={lang}>
          <RailItems items={post.sections.map((s) => s.name)} active={active} onGo={goTo} />
          <PenToggle pen={pen} setPen={setPen} lang={lang} />
        </Rail>
      }
      css={CSS}
    >
      {u ? (
        <svg aria-hidden className="pointer-events-none absolute inset-0 h-full w-full" style={{ overflow: "visible" }}>
          <g fill="none" stroke={PEN} strokeWidth={Math.max(1.2, u * 0.22)} strokeLinecap="round">
            {placed.map((p) => (
              <Stroke key={p.id} d={tickPath(p.r.y + p.r.h * 0.55, u)} on={p.on} delay={p.delay} dur={320} />
            ))}
          </g>
        </svg>
      ) : null}
      {placed.map((p) => (
        <Note key={p.id} color={PEN} on={p.on} delay={p.delay + 260} style={{ left: (COL + 3.4) * u, top: p.y, width: "21cqw" }}>
          {p.pen}
        </Note>
      ))}

      <PostHead meta={post.span} title={post.title} read={read} />
      <div data-body>
        {post.sections.map((s, i) => {
          const base = post.sections.slice(0, i).reduce((n, x) => n + x.paras.length, 0)
          return (
            <section key={s.name} data-section style={{ marginTop: i ? "3em" : 0 }}>
              <h2 style={{ margin: "0 0 0.8em", fontSize: "inherit", fontWeight: 560 }}>{s.name}</h2>
              {s.paras.map((p, k) => (
                <p key={k} style={{ ...PARA, marginTop: k ? PARA_GAP : 0 }}>
                  <Termed para={p} pi={base + k} other={lang === "en" ? "nb" : "en"} />
                </p>
              ))}
            </section>
          )
        })}
      </div>
    </LongPage>
  )
}

/** The paragraph with each term wrapped, measured, and given its translation for screen readers. */
function Termed({ para, pi, other }: { para: TermPara; pi: number; other: string }) {
  const out: React.ReactNode[] = []
  let rest = para.text
  para.terms.forEach((t, ti) => {
    const i = rest.indexOf(t.phrase)
    if (i < 0) return
    out.push(rest.slice(0, i))
    const word = t.pen.split(" = ")[0]
    out.push(
      <React.Fragment key={ti}>
        <span data-mark={`t${pi}-${ti}`} className="p78-term">
          {t.phrase}
        </span>
        <span className="sr-only">
          {" "}
          (<span lang={other}>{word}</span>)
        </span>
      </React.Fragment>,
    )
    rest = rest.slice(i + t.phrase.length)
  })
  out.push(rest)
  return <>{out}</>
}

const CSS = `
.p78-term { text-decoration-line: underline; text-decoration-style: dotted; text-decoration-thickness: 1px; text-underline-offset: 0.26em;
  text-decoration-color: rgba(18,18,18,0.35); }
`
