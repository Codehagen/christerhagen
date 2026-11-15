"use client"

import * as React from "react"

import { Bar, C, Lead, Tile, fontHand, useSeen } from "../../kit"
import { PageCard, PostHead, useReplay } from "./parts"

/**
 * The Docdir post with one sentence under a yellow highlighter. The sweep
 * runs line by line, the way a hand drags it, and once it lands the rest of
 * the page steps back to grey. Tapping the page sweeps it again.
 */

const HL = "oklch(0.91 0.16 99)"

const css = `
.r1a5-hl {
  background-image: linear-gradient(${HL}, ${HL});
  background-repeat: no-repeat;
  background-position: 0 62%;
  background-size: 0% 78%;
  transition-property: background-size;
  transition-duration: 0ms;
  transition-timing-function: cubic-bezier(.4,.1,.3,1);
}
.r1a5-hl[data-on] { background-size: 100% 78%; transition-duration: 380ms; }
.r1a5-rest { transition-property: color; transition-duration: 0ms; }
.r1a5-rest[data-on] { color: rgba(18,18,18,0.32); transition-duration: 500ms; transition-delay: 1300ms; }
.r1a5-note { opacity: 0; rotate: -6deg; translate: -0.6cqw 0.4cqw;
  transition-property: opacity, rotate, translate; transition-duration: 0ms; }
.r1a5-note[data-on] { opacity: 1; rotate: -3deg; translate: 0 0; transition-duration: 380ms; transition-delay: 1450ms; transition-timing-function: cubic-bezier(.2,.8,.2,1); }
@media (prefers-reduced-motion: reduce) {
  .r1a5-hl, .r1a5-hl[data-on], .r1a5-rest, .r1a5-rest[data-on], .r1a5-note, .r1a5-note[data-on] { transition-duration: 0ms; transition-delay: 0ms; }
}
`

/**
 * The sentence, broken where a hand would lift the pen. Each piece is its own
 * stroke so the sweep can run one after another instead of all lines at once.
 * The breaks are inline, so the text still wraps naturally at any width.
 */
const STROKES = [
  "solve a boring, expensive problem",
  " for a specific group of people,",
  " in their own language,",
]

export default function Highlighter() {
  const [ref, seen] = useSeen<HTMLDivElement>()
  const [on, replay] = useReplay(seen)
  const d = on || undefined

  return (
    <Tile>
      <style>{css}</style>
      <Lead
        bold="One sentence takes the highlighter."
        grey="It sweeps the way a hand drags it, then the rest of the page steps back."
      />

      <div ref={ref} className="absolute top-[21cqw] right-0 left-[5.4cqw]">
        <PageCard />
        <button
          type="button"
          onClick={replay}
          aria-label="Sweep the highlighter again"
          className="relative grid w-full cursor-pointer grid-cols-[58cqw_1fr] text-left"
          style={{ touchAction: "manipulation" }}
        >
          <span className="r1a5-rest col-start-1 block px-[3.4cqw] pt-[3cqw] pb-[1.6cqw]" data-on={d}>
            <PostHead title="Selling Docdir to Visma" meta="Feb 2026 · 2 min" />
          </span>
          <span className="col-start-2" />

          <span className="r1a5-rest col-start-1 block px-[3.4cqw] py-[1cqw]" data-on={d}>
            In early 2026 it was acquired by Broker AS, part of the Visma group. It is the
            second Bodø company Visma has bought; PowerOffice was the first. For a product
            built in the north, that meant a great deal.
          </span>
          <span className="col-start-2" />

          <span className="col-start-1 block px-[3.4cqw] py-[1cqw]">
            <span className="r1a5-rest" data-on={d}>
              What I took from it:{" "}
            </span>
            {STROKES.map((s, i) => (
              <span
                key={s}
                className="r1a5-hl"
                data-on={d}
                style={{ transitionDelay: on ? `${i * 360}ms` : "0ms" }}
              >
                {s}
              </span>
            ))}
            <span className="r1a5-rest" data-on={d}>
              {" "}and the size of the city you build in stops mattering.
            </span>
          </span>
          <span className="relative col-start-2">
            <span
              className="r1a5-note absolute top-[0.4cqw] left-[2.6cqw] block w-[28cqw] leading-[0.95]"
              data-on={d}
              style={{ fontFamily: fontHand, fontSize: "3.8cqw", color: C.ink }}
            >
              boring, expensive, their language. that was docdir
            </span>
          </span>

          <span className="col-start-1 flex flex-col gap-[1.3cqw] px-[3.4cqw] pt-[2cqw] pb-[6cqw]">
            <Bar w="40%" />
          </span>
        </button>
      </div>
    </Tile>
  )
}
