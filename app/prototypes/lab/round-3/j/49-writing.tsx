"use client"

import * as React from "react"

import { writingCopy } from "@/lib/posts"

import { useSeenIn } from "../../round-2/f/frame"
import { G, META, Rail, Rule, Site, TITLE, ddmm, rowsOf, Go, useSections, type Lang } from "./site"

/**
 * 49 — The writing index.
 *
 * 36's header with "Writing" ringed, and 32's ledger as the whole page,
 * grouped by year the way benji does it, with 02's rail running down the
 * years. Each row is 19's read-next line: a title and an arrow, and the
 * arrow is the only thing that moves. The newest title sits under a rust
 * wash, with one line from the pen beside it.
 */

const PEN = "#C2410C"

const NOTE: Record<Lang, string> = {
  en: "the one about the sale",
  no: "den om salget",
}

const COUNT: Record<Lang, (n: number, m: number) => string> = {
  en: (n, m) => `${n} posts · ${m} min`,
  no: (n, m) => `${n} tekster · ${m} min`,
}

const css = `
.j49-arrow { display: inline-block; color: ${G.faint}; transition-property: transform, color; transition-duration: 220ms, 180ms; transition-timing-function: cubic-bezier(.3,.8,.3,1), ease; }
.j49-t { text-decoration-line: underline; text-decoration-thickness: 1px; text-underline-offset: 0.42cqw; text-decoration-color: transparent;
  transition-property: text-decoration-color; transition-duration: 180ms; }
.j-row:focus-visible .j49-arrow { color: ${PEN}; transform: translateX(0.5cqw); }
@media (hover: hover) and (pointer: fine) {
  .j-row:hover .j49-arrow { color: ${PEN}; transform: translateX(0.5cqw); }
  .j-row:hover .j49-t { text-decoration-color: ${G.faint}; }
  .j-row:hover { background-color: transparent; }
}
@media (prefers-reduced-motion: reduce) {
  .j49-arrow, .j49-t { transition-property: color, text-decoration-color; }
  .j-row:hover .j49-arrow, .j-row:focus-visible .j49-arrow { transform: none; }
}
`

export default function Writing() {
  const scrollerRef = React.useRef<HTMLDivElement>(null)
  const firstRef = React.useRef<HTMLLIElement>(null)
  const [lang, setLang] = React.useState<Lang>("en")
  const { active, go } = useSections(scrollerRef)
  const seen = useSeenIn(scrollerRef, firstRef, 0.9)
  const w = writingCopy[lang]
  const rows = rowsOf(lang)
  const years = [...new Set(rows.map((r) => r.year))]
  const minutes = rows.reduce((n, r) => n + parseInt(r.read, 10), 0)

  return (
    <Site
      label="christerhagen.com, the writing index"
      pen={PEN}
      current="writing"
      lang={lang}
      setLang={setLang}
      scrollerRef={scrollerRef}
      rail={() => (
        <Rail
          head={
            <Go href="/" className="j-nav h2-hit">
              ↩ Index
            </Go>
          }
          items={years}
          active={active}
          onPick={go}
        />
      )}
    >
      <style>{css}</style>
      <p style={{ margin: 0, color: G.grey }}>{w.kicker}</p>
      <h1 style={{ ...TITLE, margin: "1cqw 0 0" }}>{w.intro}</h1>

      {years.map((y, yi) => (
        <section key={y} data-section className="tabular-nums">
          <Rule top={yi === 0 ? "5.4cqw" : "4cqw"}>{y}</Rule>
          <ul>
            {rows
              .filter((r) => r.year === y)
              .map((r) => {
                const newest = r.slug === rows[0].slug
                return (
                  <li key={r.slug} ref={newest ? firstRef : undefined} className="relative">
                    <Go
                      href={`/writing/${r.slug}`}
                      className="j-row grid items-baseline"
                      style={{ gridTemplateColumns: "1fr auto", columnGap: "2.4cqw", padding: "0.6cqw 0 1cqw", minHeight: 44 }}
                    >
                      <span className="block min-w-0">
                        <span style={{ fontWeight: 520 }}>
                          <span className={newest ? "j-hl j49-t" : "j49-t"} data-on={newest && seen ? true : undefined}>
                            {r.title}
                          </span>{" "}
                          <span aria-hidden className="j49-arrow">
                            →
                          </span>
                        </span>
                        <span className="block" style={{ marginTop: "0.4cqw", color: G.grey, ...META, textWrap: "pretty" }}>
                          {r.excerpt}
                        </span>
                      </span>
                      <span style={{ color: G.faint, whiteSpace: "nowrap" }}>
                        {r.read} · {ddmm(r.iso)}
                      </span>
                    </Go>
                    {newest ? (
                      <span
                        aria-hidden
                        className="j-note"
                        data-on={seen || undefined}
                        style={{ left: "calc(100% + 3.4cqw)", top: "0.2cqw", width: "20cqw", fontSize: "3.3cqw" }}
                      >
                        ← {NOTE[lang]}
                      </span>
                    ) : null}
                  </li>
                )
              })}
          </ul>
        </section>
      ))}

      <p className="tabular-nums" style={{ margin: "3cqw 0 0", paddingTop: "1.2cqw", borderTop: `1px solid rgba(18,18,18,0.14)`, color: G.faint, ...META }}>
        {COUNT[lang](rows.length, minutes)}
      </p>
    </Site>
  )
}
