"use client"

import * as React from "react"

import type { Lang } from "@/lib/companies"
import { isPostSlug, posts, type PostSlug } from "@/lib/posts"

import { fontHand, useSeen } from "../../kit"
import { DrawnBracket, PART_CSS } from "../../round-1/a/parts"
import { Frame } from "../../round-2/h/chrome"
import { PenLoop, RING_CSS } from "../../round-2/f/frame"
import { Footer, G, Header, PageFor, PostView, SYSTEM_CSS, WritingView, tagOf, useRoute, type Route } from "./system"

/**
 * 59 — The pen is a site-wide setting.
 *
 * 23's "hide the pen" moves out of the post and into the header, as a third
 * quiet thing beside EN / NO. Each post carries one mark from the kept set:
 * a highlighter that greys the rest of its paragraph (05), or a bracket
 * that draws down a paragraph with a note beside it (01). The writing list
 * has one ring, on "New" (26). Turn the pen off and every note on every page
 * goes, and stays gone as you move around. The header's ring stays: it says
 * where you are, not what he thinks. One blue pen.
 */

const BLUE = "oklch(0.5 0.19 259)"
const WASH = "color-mix(in oklch, oklch(0.62 0.17 259) 20%, transparent)"

type Mark =
  | { kind: "hl"; p: number; phrase: string; note: string }
  | { kind: "bracket"; p: number; note: string }

const MARKS: Record<Lang, Record<PostSlug, Mark>> = {
  en: {
    "docdir-visma": {
      kind: "hl",
      p: 2,
      phrase: "solve a boring, expensive problem for a specific group of people, in their own language,",
      note: "boring, expensive, their language. that was docdir",
    },
    "building-in-bodo": { kind: "bracket", p: 2, note: "customers don’t ask where you are" },
    "apparel-to-software": { kind: "bracket", p: 1, note: "cash, inventory, refunds. refenze taught me all three" },
  },
  no: {
    "docdir-visma": {
      kind: "hl",
      p: 2,
      phrase: "løs et kjedelig, dyrt problem for en bestemt gruppe mennesker, på deres eget språk,",
      note: "kjedelig, dyrt, deres språk. det var docdir",
    },
    "building-in-bodo": { kind: "bracket", p: 2, note: "kundene spør ikke hvor du er" },
    "apparel-to-software": { kind: "bracket", p: 1, note: "penger, lager, refusjoner. refenze lærte meg alle tre" },
  },
}

const TOGGLE: Record<Lang, { word: string; label: string }> = {
  en: { word: "Pen", label: "Pen notes" },
  no: { word: "Penn", label: "Penn-notater" },
}

function MarkedBody({ slug, lang, on }: { slug: PostSlug; lang: Lang; on: boolean }) {
  const m = MARKS[lang][slug]
  const d = on || undefined
  return (
    <>
      {posts[lang][slug].body.map((text, i) => {
        if (i !== m.p) return <p key={i}>{text}</p>
        if (m.kind === "hl") {
          const at = text.indexOf(m.phrase)
          const before = text.slice(0, at)
          const after = text.slice(at + m.phrase.length)
          return (
            <p key={i} className="relative">
              <span className="l59-rest" data-on={d}>
                {before}
              </span>
              <mark className="l59-hl" data-on={d}>
                {m.phrase}
              </mark>
              <span className="l59-rest" data-on={d}>
                {after}
              </span>
              <span aria-hidden className="l59-note l59-note-hl absolute" data-on={d} style={{ fontFamily: fontHand, color: BLUE }}>
                {m.note}
              </span>
            </p>
          )
        }
        return (
          <p key={i} className="relative">
            {text}
            <DrawnBracket color={BLUE} on={on} delay={200} className="l59-bracket absolute" />
            <span aria-hidden className="l59-note l59-note-br absolute" data-on={d} style={{ fontFamily: fontHand, color: BLUE }}>
              {m.note}
            </span>
          </p>
        )
      })}
    </>
  )
}

function Page({ route, lang, go, on }: { route: Route; lang: Lang; go: (r: Route) => void; on: boolean }) {
  if (isPostSlug(route)) {
    return <PostView slug={route} lang={lang} go={go} color={BLUE} body={<MarkedBody slug={route} lang={lang} on={on} />} />
  }
  if (route === "writing") {
    return (
      <WritingView
        lang={lang}
        go={go}
        newMark={<PenLoop on={on} color={BLUE} inset="-1cqw -1.3cqw -0.9cqw -1.3cqw" delay={300} />}
      />
    )
  }
  return <PageFor route={route} lang={lang} go={go} color={BLUE} />
}

export default function ThePenInTheHeader() {
  const [seenRef, seen] = useSeen<HTMLDivElement>()
  const scroller = React.useRef<HTMLDivElement>(null)
  const [route, go] = useRoute("building-in-bodo", scroller)
  const [lang, setLang] = React.useState<Lang>("en")
  const [pen, setPen] = React.useState(true)
  const t = TOGGLE[lang]

  const toggle = (
    <button
      type="button"
      aria-pressed={pen}
      aria-label={t.label}
      onClick={() => setPen((p) => !p)}
      className="h2-press h2-hit l59-toggle"
      data-on={pen || undefined}
      style={{ ["--hw" as string]: "44px" }}
    >
      <span aria-hidden className="l59-dot" />
      {t.word}
    </button>
  )

  return (
    <Frame label="christerhagen.com with the pen as a setting in the header">
      <style>{SYSTEM_CSS + PART_CSS + RING_CSS + css}</style>
      <div ref={seenRef} className="absolute inset-0">
        <div ref={scroller} className="l3-scroll absolute inset-0 overflow-x-hidden overflow-y-auto" tabIndex={0} aria-label="The page, scrollable" style={{ outline: "none" }}>
          <Header route={route} lang={lang} setLang={setLang} go={go} color={BLUE} on={seen} extra={toggle} />
          <div lang={tagOf(lang)} style={{ marginLeft: "14cqw", width: "48cqw" }}>
            <main key={`${route}-${lang}`} className="h2-reset" style={{ padding: "7.2cqw 0 9cqw" }}>
              <Page route={route} lang={lang} go={go} on={seen && pen} />
            </main>
            <Footer lang={lang} color={BLUE} />
          </div>
        </div>
      </div>
    </Frame>
  )
}

const css = `
.h2c .l59-toggle { display: inline-flex; align-items: center; gap: 0.5em; font-size: 1.7cqw; color: ${G.faint}; font-weight: 560; letter-spacing: 0.02em; }
.h2c .l59-toggle[data-on] { color: ${G.ink}; }
.l59-dot { width: 0.62em; height: 0.62em; border-radius: 999px; box-shadow: inset 0 0 0 1px ${G.faint}; background-color: transparent;
  transition-property: background-color, box-shadow; transition-duration: 200ms; }
.h2c .l59-toggle[data-on] .l59-dot { background-color: ${BLUE}; box-shadow: inset 0 0 0 1px ${BLUE}; }

.l59-hl { color: inherit; background-color: transparent; background-image: linear-gradient(${WASH}, ${WASH}); background-repeat: no-repeat;
  background-position: 0 62%; background-size: 0% 78%; box-decoration-break: clone; -webkit-box-decoration-break: clone;
  transition-property: background-size; transition-duration: 160ms; transition-timing-function: cubic-bezier(.4,.1,.3,1); }
.l59-hl[data-on] { background-size: 100% 78%; transition-duration: 700ms; transition-delay: 300ms; }
.l59-rest { transition-property: color; transition-duration: 200ms; }
.l59-rest[data-on] { color: ${G.faint}; transition-duration: 500ms; transition-delay: 1000ms; }

.l59-bracket { left: calc(100% + 1.8cqw); top: 0.2em; bottom: 0.2em; width: 1.5cqw; }
.l59-note { width: 25cqw; font-size: 3.1cqw; line-height: 0.98; rotate: -3deg; pointer-events: none;
  clip-path: inset(-30% 100% -30% -4%); transition-property: clip-path; transition-duration: 160ms; transition-timing-function: cubic-bezier(.4,0,.3,1); }
.l59-note[data-on] { clip-path: inset(-30% -4% -30% -4%); transition-duration: 900ms; }
.l59-note-hl { left: calc(100% + 3cqw); top: 0.6em; }
.l59-note-hl[data-on] { transition-delay: 1100ms; }
.l59-note-br { left: calc(100% + 4.8cqw); top: 50%; translate: 0 -50%; }
.l59-note-br[data-on] { transition-delay: 700ms; }

@media (hover: hover) and (pointer: fine) {
  .h2c .l59-toggle:hover { color: ${G.ink}; }
}
@media (prefers-reduced-motion: reduce) {
  .l59-hl, .l59-hl[data-on], .l59-rest, .l59-rest[data-on] { transition-duration: 0ms; transition-delay: 0ms; }
  .l59-note, .l59-note[data-on] { clip-path: none; opacity: 0; transition-property: opacity; transition-duration: 200ms; transition-delay: 0ms; }
  .l59-note[data-on] { opacity: 1; }
  .l59-dot { transition-duration: 0ms; }
}
`
