"use client"

import * as React from "react"

import type { Lang } from "@/lib/companies"
import { contactContent, EMAIL } from "@/lib/content"

import { fontHand, useSeen } from "../../kit"
import { Frame, G, LANGS, langKeys, tagOf } from "./chrome"

/**
 * 39 — Strike one, write the other.
 *
 * The EN / NO switch from 18, with the pen doing the telling instead of an
 * underline: the language you are not reading is struck through by hand,
 * and under the one you are, the pen writes its name. Switching strikes the
 * old one, lifts the line off the new one, and writes "norsk" or "english"
 * again while the contact page re-sets underneath.
 */

const PEN = "oklch(0.6 0.19 42)"

const HAND: Record<Lang, string> = { en: "english", no: "norsk" }

export default function StrikeAndWrite() {
  const [seenRef, seen] = useSeen<HTMLDivElement>()
  const [lang, setLang] = React.useState<Lang>("en")
  const langRefs = React.useRef<(HTMLElement | null)[]>([])
  const c = contactContent[lang]

  return (
    <Frame label="A language switch where the pen strikes one language and writes the other">
      <style>{css}</style>
      <div ref={seenRef} className="absolute inset-0">
        <header
          className="absolute inset-x-0 top-0 flex items-center justify-between"
          style={{ height: "7.4cqw", padding: "0 5cqw", background: G.band, boxShadow: `0 1px 0 ${G.edge}`, fontSize: "1.95cqw" }}
        >
          <span style={{ fontWeight: 560 }}>Christer Hagen</span>

          <div
            role="radiogroup"
            aria-label="Language"
            onKeyDown={(e) => langKeys(e, lang, setLang, langRefs)}
            className="flex items-center gap-[1.4cqw]"
            style={{ fontSize: "1.95cqw", letterSpacing: "0.02em" }}
          >
            {LANGS.map((l, i) => {
              const on = lang === l.id
              return (
                <button
                  key={l.id}
                  ref={(el) => {
                    langRefs.current[i] = el
                  }}
                  type="button"
                  role="radio"
                  aria-checked={on}
                  aria-label={l.name}
                  tabIndex={on ? 0 : -1}
                  onClick={() => setLang(l.id)}
                  className="h2-press h2-hit h39-l"
                  data-on={on || undefined}
                  style={{ padding: "0.2em 0.3em", ["--hw" as string]: "40px" }}
                >
                  {l.label}
                  <svg aria-hidden viewBox="0 0 100 40" preserveAspectRatio="none" className="h39-strike" data-on={(seen && !on) || undefined}>
                    <path
                      d="M 2 26 C 26 21, 58 24, 98 15"
                      pathLength={1}
                      fill="none"
                      stroke={PEN}
                      strokeWidth={1.6}
                      strokeLinecap="round"
                      vectorEffect="non-scaling-stroke"
                    />
                  </svg>
                  <span
                    aria-hidden
                    className="h39-hand"
                    data-on={(seen && on) || undefined}
                    style={{ fontFamily: fontHand, color: PEN, fontSize: "2.9cqw" }}
                  >
                    {HAND[l.id]}
                  </span>
                </button>
              )
            })}
          </div>
        </header>

        <main
          key={lang}
          lang={tagOf(lang)}
          aria-live="polite"
          className="h2-reset absolute"
          style={{ top: "19cqw", left: "50%", width: "50cqw", marginLeft: "-25cqw" }}
        >
          <p style={{ color: G.grey, fontSize: "1.75cqw", marginBottom: "1.4cqw" }}>{c.kicker}</p>
          <h2 style={{ fontSize: "3.6cqw", lineHeight: 1.15, fontWeight: 560, letterSpacing: "-0.014em", marginBottom: "2cqw" }}>
            {c.head}
          </h2>
          <p style={{ color: G.grey, marginBottom: "3.2cqw", textWrap: "pretty" }}>{c.body}</p>
          <a href={`mailto:${EMAIL}`} className="h39-mail" style={{ fontWeight: 520 }}>
            {EMAIL}
          </a>
          <p style={{ marginTop: "1.6cqw", color: G.faint, fontSize: "1.75cqw" }}>{c.availability}</p>
        </main>
      </div>
    </Frame>
  )
}

const css = `
.h39-l { position: relative; color: ${G.faint}; font-weight: 560; }
.h39-l[data-on] { color: ${G.ink}; cursor: default; }
.h39-strike { position: absolute; left: -0.1em; right: -0.1em; top: 0; height: 100%; width: calc(100% + 0.2em); overflow: visible; pointer-events: none; }
.h39-strike path { stroke-dasharray: 1; stroke-dashoffset: 1; opacity: 0;
  transition-property: stroke-dashoffset, opacity; transition-duration: 0ms, 160ms; transition-delay: 160ms, 0ms; }
.h39-strike[data-on] path { stroke-dashoffset: 0; opacity: 1;
  transition-duration: 300ms, 0ms; transition-delay: 40ms, 0ms; transition-timing-function: cubic-bezier(.5,0,.3,1); }
.h39-hand { position: absolute; top: calc(100% + 1.4cqw); left: 50%; translate: -50% 0; white-space: nowrap; line-height: 1; rotate: -4deg; pointer-events: none; font-weight: 400; letter-spacing: 0;
  clip-path: inset(-30% 100% -30% -4%); opacity: 0;
  transition-property: clip-path, opacity; transition-duration: 0ms, 160ms; }
.h39-hand[data-on] { clip-path: inset(-30% -4% -30% -4%); opacity: 1;
  transition-duration: 620ms, 0ms; transition-delay: 300ms, 0ms; transition-timing-function: cubic-bezier(.4,0,.3,1); }
.h39-mail { font-size: 2.4cqw; text-decoration-line: underline; text-decoration-thickness: 1px; text-underline-offset: 0.22em; text-decoration-color: ${G.faint};
  transition-property: text-decoration-color; transition-duration: 180ms; }
@media (hover: hover) and (pointer: fine) {
  .h39-l:not([data-on]):hover { color: ${G.ink}; }
  .h39-mail:hover { text-decoration-color: ${G.ink}; }
}
@media (prefers-reduced-motion: reduce) {
  .h39-strike path, .h39-strike[data-on] path { transition-property: opacity; transition-duration: 160ms; transition-delay: 0ms; stroke-dashoffset: 0; }
  .h39-hand, .h39-hand[data-on] { clip-path: none; transition-property: opacity; transition-duration: 200ms; transition-delay: 0ms; }
}
`
