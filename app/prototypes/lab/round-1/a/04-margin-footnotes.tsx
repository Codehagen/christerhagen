"use client"

import * as React from "react"

import { C, Lead, Tile, fontHand, useSeen } from "../../kit"
import { PageCard, PostHead } from "./parts"

/**
 * Footnotes that live beside their line instead of at the bottom. Each note
 * is measured to the height of its number in the text and pushed down only
 * if it would touch the one above. Pointing at a number or a note pairs them
 * and quiets the rest; at rest all three read.
 */

const GREEN = "oklch(0.5 0.12 158)"

const css = `
.r1a4-fn { opacity: 0; translate: -0.8cqw 0;
  transition-property: opacity, translate; transition-duration: 380ms; transition-timing-function: cubic-bezier(.2,.7,.2,1); }
.r1a4-fn[data-on] { opacity: var(--o, 1); translate: 0 0; }
.r1a4-mk { transition-property: opacity; transition-duration: 200ms; }
@media (prefers-reduced-motion: reduce) {
  .r1a4-fn, .r1a4-mk { transition-duration: 0ms !important; transition-delay: 0ms !important; }
}
`

const NOTES = [
  "salgsoppgaven. every property sale in norway depends on one",
  "part of the visma group. not visma itself, strictly",
  "also bodø. the first one visma bought up here",
]

function Mark({
  i,
  active,
  onActive,
}: {
  i: number
  active: number | null
  onActive: (i: number) => void
}) {
  const dim = active !== null && active !== i
  return (
    <sup
      data-fn-mark={i}
      onPointerEnter={() => onActive(i)}
      className="r1a4-mk relative top-[-0.1em] ml-[0.15em] tabular-nums"
      style={{ color: GREEN, fontWeight: 620, fontSize: "1.65cqw", opacity: dim ? 0.3 : 1 }}
    >
      {i + 1}
    </sup>
  )
}

export default function MarginFootnotes() {
  const [seenRef, seen] = useSeen<HTMLDivElement>()
  const boxRef = React.useRef<HTMLDivElement>(null)
  const [tops, setTops] = React.useState<number[] | null>(null)
  const [active, setActive] = React.useState<number | null>(null)
  const [settled, setSettled] = React.useState(false)

  React.useEffect(() => {
    if (!seen) return
    const t = window.setTimeout(() => setSettled(true), 900)
    return () => window.clearTimeout(t)
  }, [seen])

  React.useLayoutEffect(() => {
    const box = boxRef.current
    if (!box) return
    let alive = true
    const measure = () => {
      if (!alive) return
      const b = box.getBoundingClientRect()
      const gap = b.width * 0.012
      let floor = -Infinity
      const marks = Array.from(box.querySelectorAll<HTMLElement>("[data-fn-mark]"))
      const notes = box.querySelectorAll<HTMLElement>("[data-fn-note]")
      const next = marks.map((m, k) => {
        const n = notes[k]
        if (!n) return 0
        const r = m.getBoundingClientRect()
        // Sit the note's first line on the number's line, then avoid the one above.
        const want = r.top - b.top - b.width * 0.008
        const top = Math.max(want, floor)
        floor = top + n.offsetHeight + gap
        return top
      })
      setTops(next)
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(box)
    document.fonts?.ready.then(measure)
    return () => {
      alive = false
      ro.disconnect()
    }
  }, [])

  return (
    <Tile>
      <style>{css}</style>
      <Lead
        bold="Footnotes, beside the line they belong to."
        grey="Not at the bottom of the page. Point at a number and its note answers."
      />

      <div ref={seenRef} className="absolute top-[19cqw] right-0 left-[5.4cqw]">
        <PageCard />
        <div
          ref={boxRef}
          className="relative grid grid-cols-[58cqw_1fr]"
          onPointerLeave={() => setActive(null)}
        >
          <div className="col-start-1 px-[3.4cqw] pt-[3cqw]">
            <PostHead title="Selling Docdir to Visma" meta="Feb 2026 · 2 min" />
            <p className="mt-[2cqw]">
              Docdir started as a small tool to take the worst part of a real-estate
              transaction — assembling and quality-checking the sales prospectus
              <Mark i={0} active={active} onActive={setActive} /> — and let software do it. We trained it on Norwegian
              documents, in Norwegian, for Norwegian agents.
            </p>
            <p className="mt-[1.8cqw] pb-[6cqw]">
              In early 2026 it was acquired by Broker AS
              <Mark i={1} active={active} onActive={setActive} />, part of the Visma group. It is the second Bodø company
              Visma has bought; PowerOffice
              <Mark i={2} active={active} onActive={setActive} /> was the first. For a product built in the north, that
              meant a great deal.
            </p>
          </div>

          <div className="relative col-start-2" aria-label="Notes">
            {NOTES.map((t, i) => {
              const dim = active !== null && active !== i
              return (
                <p
                  key={t}
                  data-fn-note={i}
                  onPointerEnter={() => setActive(i)}
                  className="r1a4-fn absolute left-[2.4cqw] grid w-[30cqw] grid-cols-[2.4cqw_1fr] items-baseline"
                  data-on={(seen && tops) || undefined}
                  style={
                    {
                      top: tops?.[i] ?? 0,
                      "--o": dim ? 0.28 : 1,
                      transitionDelay: settled ? "0ms" : `${i * 140}ms`,
                    } as React.CSSProperties
                  }
                >
                  <span
                    className="tabular-nums"
                    style={{ color: GREEN, fontWeight: 620, fontSize: "1.65cqw" }}
                  >
                    {i + 1}
                  </span>
                  <span
                    className="leading-[0.98]"
                    style={{ fontFamily: fontHand, fontSize: "3.3cqw", color: C.ink }}
                  >
                    {t}
                  </span>
                </p>
              )
            })}
          </div>
        </div>
      </div>
    </Tile>
  )
}
