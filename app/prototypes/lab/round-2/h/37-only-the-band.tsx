"use client"

import * as React from "react"

import type { Lang } from "@/lib/companies"
import { postOrder, posts, writingCopy } from "@/lib/posts"

import { Bracket, fontHand, useSeen } from "../../kit"
import { NoScrollbar } from "../../round-1/c/ground"
import { Frame, G, LANGS, langKeys, tagOf, useReducedMotion } from "./chrome"

/**
 * 37 — Only the band.
 *
 * Piece 11's top band, made the whole header: the name on the left, EN / NO
 * on the right, nothing between. It stays put while the Docdir post scrolls
 * under it, and only once the page has moved does its edge show. The switch
 * is 18's: the blue underline leaves one letter for the other, and the post
 * re-sets in the other language at the same place in the reading.
 */

const BLUE = "#2B5CD8"

const NOTE: Record<Lang, string> = {
  en: "the second from Bodø, after PowerOffice",
  no: "den andre fra Bodø, etter PowerOffice",
}

export default function OnlyTheBand() {
  const [seenRef, seen] = useSeen<HTMLDivElement>()
  const reduced = useReducedMotion()
  const [lang, setLang] = React.useState<Lang>("en")
  const [scrolled, setScrolled] = React.useState(false)
  const scroller = React.useRef<HTMLDivElement>(null)
  const langRefs = React.useRef<(HTMLElement | null)[]>([])
  const ratio = React.useRef(0)

  const post = posts[lang]["docdir-visma"]
  const others = postOrder.filter((s) => s !== "docdir-visma").map((s) => posts[lang][s])

  const pick = (l: Lang) => {
    const el = scroller.current
    if (el) ratio.current = el.scrollTop / Math.max(1, el.scrollHeight - el.clientHeight)
    setLang(l)
  }

  // Keep the place in the reading when the language changes the length.
  React.useLayoutEffect(() => {
    const el = scroller.current
    if (!el) return
    el.scrollTop = ratio.current * (el.scrollHeight - el.clientHeight)
  }, [lang])

  // Once seen, glide a little way into the post so the band is seen staying.
  React.useEffect(() => {
    const el = scroller.current
    if (!seen || !el || reduced) return
    const t = window.setTimeout(() => {
      if (el.scrollTop === 0) el.scrollTo({ top: el.clientHeight * 0.32, behavior: "smooth" })
    }, 1100)
    return () => window.clearTimeout(t)
  }, [seen, reduced])

  return (
    <Frame label="A post under a header that is only the name and the language">
      <style>{css}</style>
      <NoScrollbar />
      <div
        ref={(el) => {
          scroller.current = el
          seenRef.current = el
        }}
        className="c-scroll absolute inset-0 overflow-y-auto"
        tabIndex={0}
        aria-label={post.title}
        onScroll={(e) => setScrolled(e.currentTarget.scrollTop > 2)}
      >
        <header
          className="h37-band sticky top-0 z-10 flex items-center justify-between"
          data-scrolled={scrolled || undefined}
          style={{ height: "7cqw", padding: "0 5cqw", background: G.band, fontSize: "1.95cqw" }}
        >
          <button
            type="button"
            onClick={() => scroller.current?.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" })}
            aria-label="Christer Hagen, back to the top"
            className="h2-press h2-hit"
            style={{ fontWeight: 560 }}
          >
            Christer Hagen
          </button>

          <div
            role="radiogroup"
            aria-label="Language"
            onKeyDown={(e) => langKeys(e, lang, pick, langRefs)}
            className="flex items-center gap-[0.5cqw]"
            style={{ fontSize: "1.75cqw", letterSpacing: "0.02em" }}
          >
            {LANGS.map((l, i) => (
              <React.Fragment key={l.id}>
                {i > 0 ? (
                  <span aria-hidden style={{ color: "rgba(18,18,18,0.22)" }}>
                    /
                  </span>
                ) : null}
                <button
                  ref={(el) => {
                    langRefs.current[i] = el
                  }}
                  type="button"
                  role="radio"
                  aria-checked={lang === l.id}
                  aria-label={l.name}
                  tabIndex={lang === l.id ? 0 : -1}
                  onClick={() => pick(l.id)}
                  className="h2-press h2-hit h37-l"
                  data-on={lang === l.id || undefined}
                  style={{ padding: "0.2em 0.25em", ["--hw" as string]: "40px" }}
                >
                  {l.label}
                  <span aria-hidden className="h37-u" style={{ transformOrigin: i === 0 ? "right" : "left" }} />
                </button>
              </React.Fragment>
            ))}
          </div>
        </header>

        <article
          key={lang}
          lang={tagOf(lang)}
          className="h2-reset"
          style={{ width: "44cqw", margin: "0 auto", padding: "7.2cqw 0 30cqw" }}
        >
          <p style={{ fontSize: "1.55cqw", letterSpacing: "0.02em", color: G.grey, marginBottom: "1.6cqw" }}>
            {post.date} · {post.read}
          </p>
          <h2
            style={{
              fontSize: "3.1cqw",
              lineHeight: 1.18,
              fontWeight: 560,
              letterSpacing: "-0.012em",
              marginBottom: "3.6cqw",
              textWrap: "balance",
            }}
          >
            {post.title}
          </h2>
          <p>{post.body[0]}</p>
          <div className="relative" style={{ marginTop: "2.8cqw" }}>
            <p>{post.body[1]}</p>
            <div
              aria-hidden
              className="h37-note absolute flex items-center gap-[1.2cqw]"
              data-on={seen || undefined}
              style={{ left: "calc(100% + 2.4cqw)", top: "0.4cqw", bottom: "0.4cqw", width: "21cqw" }}
            >
              <Bracket color={BLUE} className="h-full w-[1.6cqw] shrink-0" />
              <span
                style={{ fontFamily: fontHand, fontSize: "2.5cqw", lineHeight: 1.1, color: BLUE, rotate: "-2deg" }}
              >
                {NOTE[lang]}
              </span>
            </div>
          </div>
          <p style={{ marginTop: "2.8cqw" }}>{post.body[2]}</p>

          <div style={{ marginTop: "7cqw", borderTop: `1px solid ${G.hair}`, paddingTop: "2.6cqw" }}>
            <p style={{ color: G.grey, fontSize: "1.95cqw", marginBottom: "1.2cqw" }}>
              {writingCopy[lang].readNextLabel}
            </p>
            {others.map((o) => (
              <div key={o.title} className="flex justify-between gap-[2cqw] py-[0.9cqw]">
                <span>{o.title}</span>
                <span style={{ color: G.grey, fontSize: "1.55cqw", whiteSpace: "nowrap" }}>{o.date}</span>
              </div>
            ))}
          </div>
        </article>
      </div>
    </Frame>
  )
}

const css = `
.h37-band { box-shadow: 0 1px 0 transparent; transition-property: box-shadow; transition-duration: 220ms; transition-timing-function: ease-out; }
.h37-band[data-scrolled] { box-shadow: 0 1px 0 ${G.edge}; }
.h37-l { position: relative; color: ${G.faint}; font-weight: 560; }
.h37-l[data-on] { color: ${G.ink}; cursor: default; }
.h37-u { position: absolute; left: 0.25em; right: 0.25em; bottom: -0.05em; height: 1.5px; border-radius: 1px;
  background: ${BLUE}; transform: scaleX(0); transition-property: transform; transition-duration: 220ms; transition-timing-function: cubic-bezier(.3,.8,.3,1); }
.h37-l[data-on] .h37-u { transform: scaleX(1); transition-delay: 90ms; }
.h37-note { clip-path: inset(0 100% 0 0); transition-property: clip-path; transition-duration: 700ms; transition-timing-function: cubic-bezier(.2,.7,.2,1); }
.h37-note[data-on] { clip-path: inset(-10% -10% -10% 0); transition-delay: 600ms; }
@media (hover: hover) and (pointer: fine) {
  .h37-l:not([data-on]):hover { color: ${G.ink}; }
}
@media (prefers-reduced-motion: reduce) {
  .h37-band, .h37-u, .h37-l[data-on] .h37-u, .h37-note, .h37-note[data-on] { transition-duration: 0ms; transition-delay: 0ms; }
}
`
