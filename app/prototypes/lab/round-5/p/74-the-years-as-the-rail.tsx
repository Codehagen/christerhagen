"use client"

import * as React from "react"

import { Note, Stroke } from "../../round-2/e/pen"
import { tenYears, words, WPM } from "./_text"
import { COL, LongPage, MUTED, PARA, PARA_GAP, PEN, PenToggle, PostHead, Rail, RailItems, tickPath, useMarks, usePage, useReading } from "./_long"

/**
 * 74 — The years as the rail.
 *
 * A long post told in time, made from the about timeline and the company
 * stories. benji's rail lists section titles and his headings carry a
 * hairline; here the rail lists the years, each section opens with its year
 * in ink and the timeline's own line in grey beside it, and there is no
 * hairline anywhere. The pen makes one mark: a tick and a note beside the
 * last year, once you reach it.
 */

const NOTE = { en: "ten years after refenze", no: "ti år etter refenze" }

export default function TheYearsAsTheRail() {
  const scrollerRef = React.useRef<HTMLDivElement>(null)
  const columnRef = React.useRef<HTMLDivElement>(null)
  const { lang, setLang, pen, setPen, armed } = usePage()
  const post = tenYears(lang)
  const { active, depth, goTo } = useReading(scrollerRef, lang)
  const { rects, u, top } = useMarks(columnRef, lang)
  const all = post.sections.flatMap((s) => [s.event, ...s.paras])
  const read = `${Math.max(1, Math.round(words(all) / WPM))} min`
  const last = post.sections.length - 1
  const at = rects[`y${last}`]
  const on = armed && pen && !!at && depth >= top + at.y + at.h

  return (
    <LongPage
      label="A long post told in years, the rail listing the years"
      lang={lang}
      setLang={setLang}
      scrollerRef={scrollerRef}
      columnRef={columnRef}
      rail={
        <Rail lang={lang} label={lang === "en" ? "Years in this post" : "År i denne teksten"}>
          <RailItems items={post.sections.map((s) => s.year)} active={active} onGo={goTo} tabular />
          <PenToggle pen={pen} setPen={setPen} lang={lang} />
        </Rail>
      }
      css={CSS}
    >
      {u && at ? (
        <svg aria-hidden className="pointer-events-none absolute inset-0 h-full w-full" style={{ overflow: "visible" }}>
          <g fill="none" stroke={PEN} strokeWidth={Math.max(1.2, u * 0.24)} strokeLinecap="round">
            <Stroke d={tickPath(at.y + at.h * 0.55, u)} on={on} delay={250} dur={320} />
          </g>
        </svg>
      ) : null}
      {u && at ? (
        <Note color={PEN} on={on} delay={520} style={{ left: (COL + 3.4) * u, top: at.y - 0.2 * u, width: "19cqw" }}>
          {NOTE[lang]}
        </Note>
      ) : null}

      <PostHead meta={post.span} title={post.title} read={read} />

      <div data-body>
        {post.sections.map((s, i) => (
          <section key={s.year} data-section aria-labelledby={`p74-${s.year}`} style={{ marginTop: i ? "3.6em" : 0 }}>
            <h2 id={`p74-${s.year}`} data-mark={`y${i}`} className="p74-year flex items-baseline" style={{ margin: "0 0 0.9em", gap: "0.9em", fontSize: "inherit" }}>
              <span className="tabular-nums" style={{ fontWeight: 560, letterSpacing: "-0.01em" }}>
                {s.year}
              </span>
              <span style={{ fontWeight: 460, color: MUTED }}>{s.event}</span>
            </h2>
            {s.paras.map((t, k) => (
              <p key={k} style={{ ...PARA, marginTop: k ? PARA_GAP : 0 }}>
                {t}
              </p>
            ))}
          </section>
        ))}
        <div data-end style={{ height: 1 }} />
      </div>
    </LongPage>
  )
}

const CSS = `
.p74-year { scroll-margin-top: 14cqw; }
`
