"use client"

import * as React from "react"

import { homeContent } from "@/lib/content"

import { C, fontHand, useSeen } from "../../kit"
import { Ground, HAIR, RULE, useReplay } from "./_ledger"

/**
 * 34 — Sunset, struck through.
 *
 * The Work section of the home page as a plain ledger: company, role, years,
 * outcome. The pen does what an editor does to a proof: it strikes "Sunset"
 * on Sailsdock and writes the next company beside it, because the site says
 * Bedrifty is its successor. Refenze's sunset is left standing — the site
 * names no successor for it. Tapping the ledger draws it again.
 */

const PEN = "oklch(0.6 0.19 42)"

const ROWS = homeContent.en.work.map((w) => {
  const [a, b] = w.period.split(" · ")
  const [role] = w.role.split(" · ")
  const years = b ?? `${a.replace(/^Since /, "")}–`
  return { name: w.name, role, years, outcome: b ? a : "Active" }
})

const COLS = "17cqw 10cqw 14cqw 1fr"

const css = `
.g34-strike { stroke-dasharray: 1; stroke-dashoffset: 1; transition-property: stroke-dashoffset; transition-duration: 0ms; }
.g34-strike[data-on] { stroke-dashoffset: 0; transition-duration: 360ms; transition-timing-function: cubic-bezier(.5,0,.3,1); }
.g34-strike.b[data-on] { transition-delay: 300ms; transition-duration: 260ms; }
.g34-caret { stroke-dasharray: 1; stroke-dashoffset: 1; transition-property: stroke-dashoffset; transition-duration: 0ms; }
.g34-caret[data-on] { stroke-dashoffset: 0; transition-duration: 200ms; transition-delay: 620ms; }
.g34-write { clip-path: inset(-30% 100% -30% -4%); transition-property: clip-path; transition-duration: 0ms; }
.g34-write[data-on] { clip-path: inset(-30% -4% -30% -4%); transition-duration: 760ms; transition-delay: 760ms; transition-timing-function: cubic-bezier(.4,0,.3,1); }
.g34-old { transition-property: color; transition-duration: 0ms; }
.g34-old[data-on] { color: ${C.faint}; transition-duration: 300ms; transition-delay: 200ms; }
@media (prefers-reduced-motion: reduce) {
  .g34-strike, .g34-strike[data-on], .g34-caret, .g34-caret[data-on], .g34-write, .g34-write[data-on], .g34-old, .g34-old[data-on] {
    transition-duration: 0ms; transition-delay: 0ms;
  }
}
`

function Strike({ on }: { on: boolean }) {
  const d = on || undefined
  return (
    <svg
      aria-hidden
      viewBox="0 0 100 20"
      preserveAspectRatio="none"
      className="pointer-events-none absolute"
      style={{ left: "-12%", top: "18%", height: "70%", width: "122%", overflow: "visible" }}
    >
      <g fill="none" stroke={PEN} strokeWidth={1.5} strokeLinecap="round" vectorEffect="non-scaling-stroke">
        <path className="g34-strike" data-on={d} pathLength={1} vectorEffect="non-scaling-stroke" d="M2 12 C 26 10.5, 60 9.6, 98 7.4" />
        <path className="g34-strike b" data-on={d} pathLength={1} vectorEffect="non-scaling-stroke" d="M6 14.4 C 34 12.6, 66 11.6, 95 10" />
      </g>
    </svg>
  )
}

export default function StruckSunset() {
  const [ref, seen] = useSeen<HTMLDivElement>()
  const [on, replay] = useReplay(seen)
  const d = on || undefined

  return (
    <Ground
      bold="The pen strikes Sunset, and writes what came next."
      grey="An editor's mark on the Work ledger: Sailsdock's ideas went on to Bedrifty."
    >
      <style>{css}</style>

      <div
        ref={ref}
        className="absolute top-[22cqw] left-[5.4cqw] w-[60cqw] tabular-nums"
        style={{ fontSize: "2.1cqw", lineHeight: 1.25 }}
      >
        <div className="flex items-center gap-[1.6cqw]">
          <span style={{ color: C.grey }}>Work</span>
          <span aria-hidden className="h-px flex-1" style={{ background: HAIR }} />
        </div>

        <button
          type="button"
          onClick={replay}
          aria-label="Draw the correction again"
          className="mt-[1.6cqw] block w-full cursor-pointer text-left"
          style={{ touchAction: "manipulation" }}
        >
          <span className="grid pb-[0.8cqw]" style={{ gridTemplateColumns: COLS, color: C.faint, fontSize: "1.9cqw" }}>
            <span>Company</span>
            <span>Role</span>
            <span>Years</span>
            <span>Outcome</span>
          </span>
          {ROWS.map((r, i) => {
            const struck = r.name === "Sailsdock"
            return (
              <span
                key={r.name}
                className="grid items-center"
                style={{
                  gridTemplateColumns: COLS,
                  height: "5cqw",
                  borderTop: `1px solid ${i === 0 ? RULE : HAIR}`,
                }}
              >
                <span style={{ fontWeight: 520 }}>{r.name}</span>
                <span style={{ color: C.grey }}>{r.role}</span>
                <span className="whitespace-nowrap" style={{ color: C.grey }}>{r.years}</span>
                <span className="relative flex items-center">
                  {struck ? (
                    <>
                      <span className="g34-old relative" data-on={d} style={{ color: C.grey }}>
                        {r.outcome}
                        <Strike on={on} />
                      </span>
                      <svg
                        aria-hidden
                        viewBox="0 0 10 10"
                        className="pointer-events-none absolute"
                        style={{ left: "7.8cqw", top: "1.4cqw", width: "2.2cqw", height: "2.2cqw", overflow: "visible" }}
                      >
                        <path
                          className="g34-caret"
                          data-on={d}
                          pathLength={1}
                          d="M1 9 L5 1.6 L9 9"
                          fill="none"
                          stroke={PEN}
                          strokeWidth={1.4}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          vectorEffect="non-scaling-stroke"
                        />
                      </svg>
                      <span
                        className="g34-write absolute block -rotate-3 whitespace-nowrap"
                        data-on={d}
                        style={{
                          left: "10.6cqw",
                          top: "-1.2cqw",
                          fontFamily: fontHand,
                          fontSize: "3.9cqw",
                          lineHeight: 1,
                          color: PEN,
                        }}
                      >
                        bedrifty, 2026
                      </span>
                      <span className="sr-only">, struck through: continued as Bedrifty in 2026</span>
                    </>
                  ) : (
                    <span style={{ color: r.outcome === "Active" ? C.faint : C.grey }}>{r.outcome}</span>
                  )}
                </span>
              </span>
            )
          })}
        </button>
      </div>
    </Ground>
  )
}
