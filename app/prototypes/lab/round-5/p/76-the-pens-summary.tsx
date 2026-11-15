"use client"

import * as React from "react"

import { fontHand } from "../../kit"
import { Stroke } from "../../round-2/e/pen"
import { bodo, words, WPM } from "./_text"
import { COL, FAINT, LongPage, PARA, PARA_GAP, PEN, PenToggle, PostHead, Rail, useMarks, usePage, useReading } from "./_long"

/**
 * 76 — The pen's summary.
 *
 * The Bodø post, long. Before the text, the pen has already been through it:
 * three lowercase lines in the margin beside the title, each one a sentence
 * of the post cut down, with a short bracket tying them to the opening. The
 * rail carries no section titles; it says how long is left, in minutes,
 * counting down as you read, and "of N min" under it.
 */

const UI = {
  en: { left: (n: number) => (n < 1 ? "Under a minute left" : `${n} min left`), of: (n: number) => `of ${n} min`, done: "Read to the end", label: "Reading time" },
  no: { left: (n: number) => (n < 1 ? "Under ett minutt igjen" : `${n} min igjen`), of: (n: number) => `av ${n} min`, done: "Lest til slutt", label: "Lesetid" },
}

export default function ThePensSummary() {
  const scrollerRef = React.useRef<HTMLDivElement>(null)
  const columnRef = React.useRef<HTMLDivElement>(null)
  const { lang, setLang, pen, setPen, armed } = usePage()
  const post = bodo(lang)
  const t = UI[lang]
  const { progress, end } = useReading(scrollerRef, lang)
  const { rects, u } = useMarks(columnRef, lang)
  const total = words(post.paras)
  const mins = Math.max(1, Math.ceil(total / WPM))
  // Minutes left at 200 words a minute, rounded up, never more than the total.
  const left = (total * (1 - progress)) / WPM
  const shown = left < 1 ? 0 : Math.min(mins, Math.ceil(left))
  const head = rects.head
  const on = armed && pen

  return (
    <LongPage
      label="The Bodø post, long, with the pen's summary in the margin and minutes left in the rail"
      lang={lang}
      setLang={setLang}
      scrollerRef={scrollerRef}
      columnRef={columnRef}
      rail={
        <Rail lang={lang} label={t.label}>
          <div className="tabular-nums" style={{ minHeight: "5.4cqw" }}>
            <p className="p76-left" style={{ margin: 0, fontWeight: 520 }}>
              {end && progress >= 1 ? t.done : t.left(shown)}
            </p>
            <p style={{ margin: "0.3cqw 0 0", color: FAINT }}>{t.of(mins)}</p>
          </div>
          <PenToggle pen={pen} setPen={setPen} lang={lang} />
        </Rail>
      }
      css={CSS}
    >
      {u && head ? (
        <>
          <svg aria-hidden className="pointer-events-none absolute inset-0 h-full w-full" style={{ overflow: "visible" }}>
            <g fill="none" stroke={PEN} strokeWidth={Math.max(1.2, u * 0.22)} strokeLinecap="round" strokeLinejoin="round">
              <Stroke d={bracket(head.y, rects.p0, u)} on={on} delay={200} dur={560} />
            </g>
          </svg>
          <span
            aria-hidden
            className="absolute flex flex-col"
            style={{ left: (COL + 4) * u, top: head.y - 0.6 * u, width: "22cqw", gap: "1.1cqw", fontFamily: fontHand, fontSize: "2.5cqw", lineHeight: 0.98, color: PEN }}
          >
            {post.summary.map((line, i) => (
              <span key={line} className="r1a-write block" data-on={on || undefined} style={{ rotate: "-2deg", transitionDelay: on ? `${500 + i * 900}ms` : "0ms" }}>
                {line}
              </span>
            ))}
          </span>
        </>
      ) : null}

      <div data-mark="head">
        <PostHead meta={post.date} dateISO={post.dateISO} title={post.title} read={`${mins} min`} />
      </div>
      {/* The summary in words, for anyone who does not see the margin. */}
      <p className="sr-only">{post.summary.join(". ")}.</p>

      <div data-body>
        {post.paras.map((p, k) => (
          <p key={k} data-mark={k === 0 ? "p0" : undefined} style={{ ...PARA, marginTop: k ? (k % 3 === 0 ? "2.6em" : PARA_GAP) : 0 }}>
            {p}
          </p>
        ))}
        <div data-end style={{ height: 1 }} />
      </div>
    </LongPage>
  )
}

/** The kit's bracket shape, from the date line down to the end of the first paragraph. */
function bracket(top: number, p0: { y: number; h: number } | undefined, u: number) {
  const bottom = p0 ? p0.y + p0.h : top + 20 * u
  const x = (COL + 1.2) * u
  const w = 1.4 * u
  const mid = (top + bottom) / 2
  return [
    `M ${x} ${top + 0.3 * u}`,
    `C ${x + w * 0.5} ${top + 0.3 * u}, ${x + w * 0.6} ${top + 1.2 * u}, ${x + w * 0.6} ${top + 2.4 * u}`,
    `L ${x + w * 0.64} ${mid - 1.4 * u}`,
    `C ${x + w * 0.65} ${mid - 0.5 * u}, ${x + w * 0.75} ${mid}, ${x + w} ${mid}`,
    `C ${x + w * 0.75} ${mid}, ${x + w * 0.65} ${mid + 0.5 * u}, ${x + w * 0.64} ${mid + 1.4 * u}`,
    `L ${x + w * 0.6} ${bottom - 2.4 * u}`,
    `C ${x + w * 0.6} ${bottom - 1.2 * u}, ${x + w * 0.5} ${bottom - 0.3 * u}, ${x} ${bottom - 0.3 * u}`,
  ].join(" ")
}

const CSS = ""
