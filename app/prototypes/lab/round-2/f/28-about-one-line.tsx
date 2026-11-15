"use client"

import * as React from "react"
import Image from "next/image"

import { aboutContent } from "@/lib/content"

import { fontHand } from "../../kit"
import { useReplay } from "../../round-1/a/parts"
import { G, Rail, Rule, SitePage, TYPE, useSeenIn, useSpy } from "./frame"

/**
 * 28 — The about page with one sentence under the highlighter (piece 05).
 * The page glides down to the last paragraph on its own; once the line is in
 * full view the yellow sweeps it stroke by stroke, the rest of the page steps
 * back to grey, and an ink note lands in the margin. Tap the line to sweep
 * it again. Background is a year ledger; Featured in is the press list.
 */

const HL = "oklch(0.91 0.16 99)"
const a = aboutContent.en
const RAIL = [a.kicker, a.lblBackground, a.lblPress]

/** The last bio paragraph, split where the highlighted sentence starts. */
const LAST = a.bio[3]
const CUT = LAST.indexOf("I still believe")
const LEAD = LAST.slice(0, CUT)
const STROKES = ["I still believe the best companies", " can be built far from the capital."]

const css = `
.f28-hl { background-image: linear-gradient(${HL}, ${HL}); background-repeat: no-repeat; background-position: 0 62%;
  background-size: 0% 78%; transition-property: background-size; transition-duration: 0ms; transition-timing-function: cubic-bezier(.4,.1,.3,1); }
.f28-hl[data-on] { background-size: 100% 78%; transition-duration: 420ms; }
.f28-rest { transition-property: color, opacity; transition-duration: 0ms; }
.f28-page[data-on] .f28-rest { color: rgba(18,18,18,0.32); transition-duration: 500ms; transition-delay: 1000ms; }
.f28-page[data-on] .f28-img { opacity: 0.45; transition-duration: 500ms; transition-delay: 1000ms; }
.f28-note { opacity: 0; rotate: -6deg; translate: -0.6cqw 0.4cqw; transition-property: opacity, rotate, translate; transition-duration: 0ms; }
.f28-note[data-on] { opacity: 1; rotate: -3deg; translate: 0 0; transition-duration: 380ms; transition-delay: 1150ms; transition-timing-function: cubic-bezier(.2,.8,.2,1); }
.f28-line { cursor: pointer; touch-action: manipulation; outline: none; }
.f28-line:focus-visible { outline: 1.5px solid ${G.ink}; outline-offset: 0.5cqw; border-radius: 0.3cqw; }
@media (prefers-reduced-motion: reduce) {
  .f28-hl, .f28-hl[data-on], .f28-rest, .f28-page[data-on] .f28-rest, .f28-page[data-on] .f28-img, .f28-note, .f28-note[data-on] { transition-duration: 0ms; transition-delay: 0ms; }
}
`

export default function AboutOneLine() {
  const scrollerRef = React.useRef<HTMLDivElement>(null)
  const lineRef = React.useRef<HTMLParagraphElement>(null)
  const demo = React.useCallback(() => lineRef.current, [])
  const { active, go } = useSpy(scrollerRef, RAIL.length, demo)
  const seen = useSeenIn(scrollerRef, lineRef, 1)
  const [on, replay] = useReplay(seen)
  const d = on || undefined

  return (
    <SitePage
      label="christerhagen.com, the about page"
      scrollerRef={scrollerRef}
      rail={<Rail head="↩ Index" items={RAIL} active={active} onPick={go} />}
    >
      <style>{css}</style>
      <div className="f28-page" data-on={d}>
        <section data-section>
          <div className="flex items-start" style={{ gap: "3.4cqw" }}>
            <div className="f28-rest min-w-0 flex-1">
              <p style={{ margin: 0, color: G.grey }}>{a.kicker}</p>
              <h1 style={{ ...TYPE.title, margin: "1cqw 0 0", textWrap: "balance" }}>{a.head}</h1>
            </div>
            <div
              className="f28-img relative shrink-0 overflow-hidden"
              style={{
                width: "11cqw",
                aspectRatio: "280 / 360",
                borderRadius: "0.6cqw",
                boxShadow: `0 0 0 1px ${G.hair}`,
                transitionProperty: "opacity",
              }}
            >
              <Image
                src="/images/christer-hagen-working.jpg"
                alt="Christer Hagen at work"
                fill
                sizes="120px"
                className="object-cover"
                style={{ objectPosition: "center 18%" }}
              />
            </div>
          </div>

          <div style={{ marginTop: "4cqw", display: "flex", flexDirection: "column", gap: "1.6cqw" }}>
            {a.bio.slice(0, 3).map((para) => (
              <p key={para.slice(0, 24)} className="f28-rest" style={{ margin: 0, textWrap: "pretty" }}>
                {para}
              </p>
            ))}
            <p ref={lineRef} className="relative" style={{ margin: 0 }}>
              <span className="f28-rest">{LEAD}</span>
              <span
                role="button"
                tabIndex={0}
                className="f28-line"
                onClick={replay}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault()
                    replay()
                  }
                }}
                aria-label={`${STROKES.join("")} Sweep it again.`}
              >
                {STROKES.map((s, i) => (
                  <span key={s} className="f28-hl" data-on={d} style={{ transitionDelay: on ? `${i * 400}ms` : "0ms" }}>
                    {s}
                  </span>
                ))}
              </span>
              <span
                aria-hidden
                className="f28-note absolute block"
                data-on={d}
                style={{
                  left: "calc(100% + 3cqw)",
                  bottom: "0.4cqw",
                  width: "20cqw",
                  fontFamily: fontHand,
                  fontSize: "3.6cqw",
                  lineHeight: 0.95,
                  color: G.ink,
                }}
              >
                1,200 km north of oslo, and still here
              </span>
            </p>
          </div>
        </section>

        <section data-section className="f28-rest">
          <Rule>{a.lblBackground}</Rule>
          <ul>
            {a.timeline.map((t, i) => (
              <li
                key={t.year}
                className="flex items-baseline"
                style={{ gap: "3cqw", padding: "0.8cqw 0", borderTop: i ? `1px solid ${G.hair}` : undefined }}
              >
                <span className="shrink-0 tabular-nums" style={{ width: "6cqw", color: G.grey }}>
                  {t.year}
                </span>
                <span>{t.event}</span>
              </li>
            ))}
          </ul>
        </section>

        <section data-section className="f28-rest">
          <Rule>{a.lblPress}</Rule>
          <ul>
            {a.press.map((p, i) => (
              <li
                key={p.url}
                className="flex items-baseline justify-between"
                style={{ gap: "2.4cqw", padding: "0.8cqw 0", borderTop: i ? `1px solid ${G.hair}` : undefined }}
              >
                <a className="f-link min-w-0" href={p.url} target="_blank" rel="noopener noreferrer">
                  {p.title}
                </a>
                <span className="shrink-0" style={{ ...TYPE.meta, color: G.faint }}>
                  {p.outlet}
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </SitePage>
  )
}
