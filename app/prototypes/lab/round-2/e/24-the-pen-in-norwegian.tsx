"use client"

import * as React from "react"

import { posts } from "@/lib/posts"
import { uiCopy, type Lang } from "@/lib/companies"

import { G, Head, MiniPost, Section, useSpy } from "./frame"
import { Highlight, MARGIN, Note, PEN_CSS, PenLayer, RingArrow, beside, cut, MarginNote, useRects } from "./pen"

/**
 * 24 — The pen in Norwegian.
 *
 * The Docdir post opens in Norwegian, and the pen writes Norwegian with it.
 * The EN / NO switch from 18 sits in the band; flip it and the page re-sets,
 * the pen lifts, and the same two marks land again on the same phrases in
 * the other language, re-measured from the new text. The notes are not
 * translations of each other: each is what he would write in that language,
 * and each is taken from the post's own words.
 */

const TEAL = "#0F766E"
const WASH = "color-mix(in oklch, #0F766E 16%, transparent)"

type Copy = {
  rail: string[]
  sale: string
  lesson: string
  saleNote: string
  lessonNote: string
}

const COPY: Record<Lang, Copy> = {
  no: {
    rail: ["Verktøyet", "Salget", "Lærdommen"],
    sale: "PowerOffice",
    lesson: "løs et kjedelig, dyrt problem for en bestemt gruppe mennesker, på deres eget språk,",
    saleNote: "det første. docdir ble det andre",
    lessonNote: "på norsk, for norske meglere",
  },
  en: {
    rail: ["The tool", "The sale", "The lesson"],
    sale: "PowerOffice",
    lesson: "solve a boring, expensive problem for a specific group of people, in their own language,",
    saleNote: "the first. docdir made it two",
    lessonNote: "in norwegian, for norwegian agents",
  },
}

const LANGS: { id: Lang; label: string; name: string; tag: string }[] = [
  { id: "en", label: "EN", name: "English", tag: "en" },
  { id: "no", label: "NO", name: "Norsk", tag: "nb" },
]

const css = `
.e24-b { position: relative; font: inherit; background: none; border: 0; cursor: pointer; padding: 0.4cqw 0.3cqw;
  color: ${G.faint}; font-weight: 560; letter-spacing: 0.02em; touch-action: manipulation;
  transition-property: color, scale; transition-duration: 160ms; transition-timing-function: cubic-bezier(.2,.8,.3,1); }
.e24-b[data-on] { color: ${G.ink}; cursor: default; }
.e24-b:active { scale: 0.97; }
.e24-b:focus-visible { outline: 2px solid ${G.ink}; outline-offset: 0.4cqw; border-radius: 0.5cqw; }
.e24-b::after { content: ""; position: absolute; left: 50%; top: 50%; width: max(100%, 44px); height: max(100%, 44px); translate: -50% -50%; }
.e24-u { position: absolute; left: 0.3cqw; right: 0.3cqw; bottom: 0; height: 1.5px; border-radius: 1px; background: ${TEAL};
  scale: 0 1; transition-property: scale; transition-duration: 220ms; transition-timing-function: cubic-bezier(.3,.8,.3,1); }
.e24-b[data-on] .e24-u { scale: 1 1; transition-delay: 90ms; }
.e24-in { animation: e24-in 300ms cubic-bezier(.2,.8,.3,1) both; }
/* Opacity only: the marks are measured from this text while it fades in. */
@keyframes e24-in { from { opacity: 0; } to { opacity: 1; } }
@media (hover: hover) and (pointer: fine) { .e24-b:not([data-on]):hover { color: ${G.ink}; } }
@media (prefers-reduced-motion: reduce) {
  .e24-b, .e24-u, .e24-b[data-on] .e24-u { transition-duration: 0ms; transition-delay: 0ms; }
  .e24-b:active { scale: 1; }
  .e24-in { animation: e24-fade 200ms ease both; }
  @keyframes e24-fade { from { opacity: 0; } to { opacity: 1; } }
}
`

export default function ThePenInNorwegian() {
  const [lang, setLang] = React.useState<Lang>("no")
  const [lifted, setLifted] = React.useState(false)
  const timer = React.useRef<number | undefined>(undefined)
  const refs = React.useRef<(HTMLButtonElement | null)[]>([])
  React.useEffect(() => () => window.clearTimeout(timer.current), [])

  const scrollerRef = React.useRef<HTMLDivElement>(null)
  const articleRef = React.useRef<HTMLElement>(null)
  const c = COPY[lang]
  const { active, seen, go, reduced } = useSpy(scrollerRef, c.rail.length, [1, 2])
  const { rects, u } = useRects(articleRef, lang)
  const on = seen && !lifted

  const post = posts[lang]["docdir-visma"]
  const [saleA, sale, saleB] = cut(post.body[1], c.sale)
  const [lessonA, lesson, lessonB] = cut(post.body[2], c.lesson)
  const tag = LANGS.find((l) => l.id === lang)!.tag

  const choose = (next: Lang) => {
    if (next === lang) return
    setLifted(true)
    setLang(next)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setLifted(false), 360)
  }

  const onKey = (e: React.KeyboardEvent) => {
    if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)) return
    e.preventDefault()
    const i = lang === "en" ? 1 : 0
    choose(LANGS[i].id)
    refs.current[i]?.focus()
  }

  const band = (
    <div
      role="radiogroup"
      aria-label="Language"
      onKeyDown={onKey}
      className="flex items-center gap-[0.5cqw]"
    >
      {LANGS.map((l, i) => {
        const sel = l.id === lang
        return (
          <React.Fragment key={l.id}>
            {i > 0 ? (
              <span aria-hidden style={{ color: "rgba(18,18,18,0.22)" }}>
                /
              </span>
            ) : null}
            <button
              ref={(el) => {
                refs.current[i] = el
              }}
              type="button"
              role="radio"
              aria-checked={sel}
              aria-label={l.name}
              tabIndex={sel ? 0 : -1}
              onClick={() => choose(l.id)}
              className="e24-b"
              data-on={sel || undefined}
            >
              {l.label}
              <span aria-hidden className="e24-u" style={{ transformOrigin: i === 0 ? "right" : "left" }} />
            </button>
          </React.Fragment>
        )
      })}
    </div>
  )

  return (
    <MiniPost
      label={post.title}
      back={`↩ ${uiCopy[lang].navWriting}`}
      rail={c.rail}
      active={active}
      onGo={go}
      reduced={reduced}
      scrollerRef={scrollerRef}
      articleRef={articleRef}
      band={band}
      lang={tag}
    >
      <style>{PEN_CSS + css}</style>
      <PenLayer color={TEAL} u={u}>
        <RingArrow p={rects.sale} n={beside(rects.sale, u)} u={u} on={on} delay={400} lift={2} />
      </PenLayer>
      <MarginNote at={beside(rects.sale, u)} color={TEAL} on={on} delay={1440}>
        {c.saleNote}
      </MarginNote>

      <div key={lang} className="e24-in">
        <Section first>
          <Head meta={`${post.date} · ${post.read}`} title={post.title} />
          <p style={{ margin: 0 }}>{post.body[0]}</p>
        </Section>

        <Section>
          <p style={{ margin: 0 }}>
            {saleA}
            <span data-mark="sale" className="inline-block whitespace-nowrap">
              {sale}
            </span>
            {saleB}
          </p>
        </Section>

        <Section>
          <p style={{ margin: 0 }}>
            {lessonA}
            <Highlight text={lesson} on={on} color={WASH} delay={1700} />
            {lessonB}
          </p>
          <Note color={TEAL} on={on} delay={2800} style={{ ...MARGIN, top: "0.2cqw" }}>
            {c.lessonNote}
          </Note>
        </Section>
      </div>
    </MiniPost>
  )
}
