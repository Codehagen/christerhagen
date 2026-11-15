"use client"

import * as React from "react"

import { C, Lead, Tile, useSeen } from "../../kit"
import { POSTS, PenRing, Rule, Sheet, UPDATED, ringCss, underline } from "./_shared"

/**
 * The homepage as benji keeps his: name and "Updated" in grey, one about
 * paragraph whose links carry no colour, and the writing grouped by year. The
 * pen rings "New" once the tile is seen; tapping the newest post rings it
 * again. Hovering a row quiets the others.
 */

const PEN = "oklch(0.57 0.2 27)"

const css = `
${ringCss}
.b06-t { transition-property: color; transition-duration: 160ms; transition-timing-function: ease-out; }
.b06-a { text-decoration-color: rgba(18,18,18,0.22); transition-property: text-decoration-color; transition-duration: 160ms; }
.b06-a:hover { text-decoration-color: ${C.ink}; }
@media (prefers-reduced-motion: reduce) { .b06-t, .b06-a { transition-duration: 0ms; } }
`

export default function WritingIndex() {
  const [ref, seen] = useSeen<HTMLDivElement>()
  const [hover, setHover] = React.useState<number | null>(null)
  const [replay, setReplay] = React.useState(false)
  const on = seen && !replay

  const ringAgain = () => {
    setReplay(true)
    window.setTimeout(() => setReplay(false), 60)
  }

  return (
    <Tile>
      <style>{css}</style>
      <Lead
        bold="One quiet page."
        grey="A name, a paragraph, the writing by year. The only mark on it is a pen ring around what is new."
      />

      <Sheet top="22cqw" left="11cqw" width="78cqw">
        <div ref={ref} className="px-[5cqw] pt-[4.4cqw]">
          <p className="flex items-baseline gap-[1.6cqw]">
            <span style={{ fontWeight: 560 }}>Christer Hagen</span>
            <span style={{ color: C.grey }}>Updated {UPDATED}</span>
          </p>

          <p className="mt-[2.6cqw] max-w-[60cqw]" style={{ textWrap: "pretty" }}>
            Serial entrepreneur and software developer in Bodø. I founded{" "}
            <span className="b06-a" style={underline}>Codebase</span> and{" "}
            <span className="b06-a" style={underline}>Not Another VC</span>, I’m a partner
            at <span className="b06-a" style={underline}>Advanti Estate</span>, and in 2026
            I sold <span className="b06-a" style={underline}>Docdir</span> to Visma.
          </p>

          <Rule label="Writing" className="mt-[4.6cqw] mb-[0.6cqw]" />

          <ul onPointerLeave={() => setHover(null)}>
            {POSTS.map((p, i) => {
              const firstOfYear = i === 0 || POSTS[i - 1].year !== p.year
              const lit = hover === null || hover === i
              return (
                <li key={p.slug} style={{ borderTop: i ? `1px solid ${C.hair}` : undefined }}>
                  <button
                    type="button"
                    onPointerEnter={() => setHover(i)}
                    onFocus={() => setHover(i)}
                    onBlur={() => setHover(null)}
                    onClick={i === 0 ? ringAgain : undefined}
                    className="grid w-full cursor-pointer grid-cols-[9cqw_1fr_auto] items-baseline py-[1.35cqw] text-left outline-none"
                    style={{ touchAction: "manipulation" }}
                  >
                    <span className="tabular-nums" style={{ color: C.grey }}>
                      {firstOfYear ? p.year : ""}
                    </span>
                    <span className="b06-t" style={{ color: lit ? C.ink : C.grey }}>
                      {p.title}
                      {i === 0 ? (
                        <span
                          className="relative ml-[1.8cqw] inline-block"
                          style={{ color: C.grey }}
                        >
                          New
                          <PenRing
                            color={PEN}
                            on={on}
                            style={{
                              left: "-1.5cqw",
                              right: "-1.6cqw",
                              top: "-0.7cqw",
                              bottom: "-0.6cqw",
                              width: "calc(100% + 3.1cqw)",
                              height: "calc(100% + 1.3cqw)",
                            }}
                          />
                        </span>
                      ) : null}
                    </span>
                    <span className="b06-t tabular-nums" style={{ color: C.grey }}>
                      {p.ddmm}
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      </Sheet>
    </Tile>
  )
}
