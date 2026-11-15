"use client"

import * as React from "react"

import { aboutContent } from "@/lib/content"

import { G } from "../../round-2/h/chrome"
import { sourced, words, WPM, type Seg } from "./_text"
import { FAINT, HAIR, IDLE, LongPage, MUTED, PARA, PARA_GAP, PEN, PenToggle, PostHead, Rail, RailItems, RULE, WASH, usePage, useReading } from "./_long"

/**
 * 75 — Sources, not footnotes.
 *
 * benji numbers his asides with superscripts and lists them at the foot.
 * Here a claim the press has reported carries a quiet tag after it, the
 * outlet's name in small grey; the tag takes you to a Sources ledger at the
 * end (outlet, headline, link), where that row lights with the pen's wash and
 * offers the way back. Below the sources, the rest of the press list as it
 * is on about. No numbers anywhere.
 *
 * Only three claims carry a tag, the ones a headline plainly reports: the
 * AI sale, the AI championship, and the apparel brand at 25. lib/content has
 * no dates for the press items, so the ledger has no year column.
 */

const UI = {
  en: { sources: "Sources", back: "Back to the text", source: "Source", opens: "opens in a new tab" },
  no: { sources: "Kilder", back: "Tilbake til teksten", source: "Kilde", opens: "åpnes i en ny fane" },
}

export default function SourcesNotFootnotes() {
  const scrollerRef = React.useRef<HTMLDivElement>(null)
  const { lang, setLang, pen, setPen } = usePage()
  const post = sourced(lang)
  const press = aboutContent[lang].press
  const t = UI[lang]
  const { active, goTo } = useReading(scrollerRef, lang)
  const [lit, setLit] = React.useState<number | null>(null)
  const timer = React.useRef<number | undefined>(undefined)
  React.useEffect(() => () => window.clearTimeout(timer.current), [])

  const cited: number[] = []
  post.sections.forEach((s) => s.paras.forEach((p) => p.forEach((g) => typeof g !== "string" && !cited.includes(g.src) && cited.push(g.src))))
  const rest = press.map((_, i) => i).filter((i) => !cited.includes(i))
  const text = post.sections.flatMap((s) => s.paras.flatMap((p) => p.filter((g): g is string => typeof g === "string")))
  const read = `${Math.max(1, Math.round(words(text) / WPM))} min`

  const toSource = (i: number) => {
    const el = scrollerRef.current?.querySelector<HTMLElement>(`#p75-src-${i}`)
    goTo(el ?? null)
    setLit(i)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setLit(null), 2400)
    el?.querySelector<HTMLElement>("a")?.focus({ preventScroll: true })
  }
  const back = (i: number) => {
    const el = scrollerRef.current?.querySelector<HTMLElement>(`#p75-tag-${i}`)
    goTo(el ?? null)
    el?.focus({ preventScroll: true })
    setLit(null)
  }

  const seg = (g: Seg, k: number) =>
    typeof g === "string" ? (
      <React.Fragment key={k}>{g}</React.Fragment>
    ) : (
      <React.Fragment key={k}>
        {" "}
        <button
          id={`p75-tag-${g.src}`}
          type="button"
          onClick={() => toSource(g.src)}
          className="p75-tag"
          aria-label={`${t.source}: ${press[g.src].outlet}, «${press[g.src].title}»`}
        >
          {press[g.src].outlet}
        </button>
      </React.Fragment>
    )

  const row = (i: number, first: boolean, withBack: boolean) => (
    <li
      key={i}
      id={withBack ? `p75-src-${i}` : undefined}
      className="p75-row grid items-baseline"
      data-lit={(pen && lit === i) || undefined}
      style={{ gridTemplateColumns: "11cqw 1fr auto", gap: "1.6cqw", padding: "1.1cqw 0.8cqw", margin: "0 -0.8cqw", minHeight: 44, borderTop: `1px solid ${first ? RULE : HAIR}` }}
    >
      <span style={{ color: FAINT, fontSize: "0.86em" }}>{press[i].outlet}</span>
      <a className="p75-link" href={press[i].url} target="_blank" rel="noopener noreferrer" lang="nb" style={{ textWrap: "pretty" }}>
        {press[i].title}
        <span aria-hidden> ↗</span>
        <span className="sr-only"> ({t.opens})</span>
      </a>
      {withBack ? (
        <button type="button" onClick={() => back(i)} className="h2-hit p75-back" aria-label={t.back} style={{ ["--hw" as string]: "44px" }}>
          ↑
        </button>
      ) : (
        <span />
      )}
    </li>
  )

  return (
    <LongPage
      label="A long post whose claims carry source tags that resolve to a Sources ledger"
      lang={lang}
      setLang={setLang}
      scrollerRef={scrollerRef}
      rail={
        <Rail lang={lang}>
          <RailItems items={[...post.sections.map((s) => s.name), t.sources]} active={active} onGo={goTo} />
          <PenToggle pen={pen} setPen={setPen} lang={lang} />
        </Rail>
      }
      css={CSS}
    >
      <PostHead meta={post.date} dateISO={post.dateISO} title={post.title} read={read} />
      <div data-body>
        {post.sections.map((s, i) => (
          <section key={s.name} data-section style={{ marginTop: i ? "3em" : 0 }}>
            <h2 style={{ margin: "0 0 0.8em", fontSize: "inherit", fontWeight: 560 }}>{s.name}</h2>
            {s.paras.map((p, k) => (
              <p key={k} style={{ ...PARA, marginTop: k ? PARA_GAP : 0 }}>
                {p.map(seg)}
              </p>
            ))}
          </section>
        ))}
      </div>

      <section data-section style={{ marginTop: "3.6em" }}>
        <h2 style={{ margin: "0 0 0.8em", fontSize: "inherit", fontWeight: 560 }}>{t.sources}</h2>
        <ul>{cited.map((i, k) => row(i, k === 0, true))}</ul>
        <h3 style={{ margin: "2.4em 0 0.6em", fontSize: "inherit", fontWeight: 460, color: MUTED }}>{aboutContent[lang].lblPress}</h3>
        <ul>{rest.map((i, k) => row(i, k === 0, false))}</ul>
      </section>
    </LongPage>
  )
}

const CSS = `
.p75-tag { font-size: 0.74em; letter-spacing: 0.01em; color: ${IDLE}; vertical-align: 0.06em; white-space: nowrap;
  text-decoration-line: underline; text-decoration-thickness: 1px; text-underline-offset: 0.24em; text-decoration-color: rgba(18,18,18,0.22);
  transition-property: color, text-decoration-color; transition-duration: 180ms; }
.p75-row { border-radius: 0.5cqw; background-color: transparent; transition-property: background-color; transition-duration: 700ms; transition-timing-function: ease-out; }
.p75-row[data-lit] { background-color: ${WASH}; transition-duration: 260ms; }
.p75-link { color: ${G.ink}; text-decoration-line: underline; text-decoration-thickness: 1px; text-underline-offset: 0.24em;
  text-decoration-color: rgba(18,18,18,0.22); transition-property: text-decoration-color; transition-duration: 180ms; }
.p75-back { color: ${IDLE}; transition-property: color; transition-duration: 180ms; }
.p75-row[data-lit] .p75-back { color: ${PEN}; }
@media (hover: hover) and (pointer: fine) {
  .p75-tag:hover { color: ${G.ink}; text-decoration-color: ${G.ink}; }
  .p75-link:hover { text-decoration-color: ${G.ink}; }
  .p75-back:hover { color: ${G.ink}; }
}
@media (prefers-reduced-motion: reduce) {
  .p75-tag, .p75-link, .p75-back { transition-duration: 0ms; }
  .p75-row, .p75-row[data-lit] { transition-property: background-color; transition-duration: 160ms; }
}
`
