"use client"

import * as React from "react"

import { C, Lead, Tile } from "../../kit"
import { Sheet, company } from "./_shared"

/**
 * Ten years on a ruler. What Christer built runs as a hairline span from its
 * founding year (to its end, or off the edge if it is still going); what he
 * backed is a dot in the year he invested. Drag, hover or use the arrow keys
 * and the cursor reads out that year.
 */

const ACCENT = "#FF5B1F"
const Y0 = 2016
const Y1 = 2026
const YEARS = Array.from({ length: Y1 - Y0 + 1 }, (_, i) => Y0 + i)
const N = YEARS.length

/** Spans from lib/companies years and lib/content work periods. `to: null` is still running. */
const BUILT: { name: string; from: number; to: number | null; how: string }[] = [
  { name: "Refenze", from: 2016, to: 2018, how: "sunset" },
  { name: "Codebase", from: 2017, to: null, how: "founder" },
  { name: "Sailsdock", from: 2021, to: 2026, how: "sunset" },
  { name: "Not Another VC", from: 2023, to: null, how: "founder" },
  { name: "Advanti Estate", from: 2024, to: null, how: "partner" },
  { name: "Docdir", from: 2024, to: 2026, how: "sold to Visma" },
  { name: "Bedrifty", from: 2026, to: null, how: "founder" },
]

const BACKED = (["utleieoversikten", "propdock", "codenord", "vendo", "fotovibe", "somevibe"] as const).map(
  (s) => ({ name: company(s).name, year: Number(company(s).year) }),
)

const pct = (y: number) => ((y - Y0) / N) * 100
const cellMid = (y: number) => ((y - Y0 + 0.5) / N) * 100

const css = `
.b09-c { transition-property: left; transition-duration: 160ms; transition-timing-function: cubic-bezier(.2,.7,.2,1); }
.b09-s { transition-property: background-color, color; transition-duration: 160ms; transition-timing-function: ease-out; }
@media (prefers-reduced-motion: reduce) { .b09-c, .b09-s { transition-duration: 0ms; } }
`

export default function Ruler() {
  const [year, setYear] = React.useState(2024)
  const track = React.useRef<HTMLDivElement>(null)
  const dragging = React.useRef(false)

  const fromX = (clientX: number) => {
    const el = track.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const i = Math.floor(((clientX - r.left) / r.width) * N)
    setYear(Math.min(Y1, Math.max(Y0, Y0 + i)))
  }

  const running = BUILT.filter((b) => b.from <= year && (b.to === null || b.to >= year))
  const backedThatYear = BACKED.filter((b) => b.year === year)
  const backedSoFar = BACKED.filter((b) => b.year <= year).length

  return (
    <Tile>
      <style>{css}</style>
      <Lead
        bold="Ten years on a ruler."
        grey="What was built runs as a line, what was backed is a dot. Move along it and the year reads itself out."
      />

      <Sheet top="21cqw">
        <div className="px-[4.4cqw] pt-[3.2cqw]" style={{ fontSize: "2.1cqw", lineHeight: 1.3 }}>
          <div aria-live="polite" className="flex items-baseline gap-[2cqw]">
            <span
              className="tabular-nums"
              style={{ color: ACCENT, fontWeight: 600, fontSize: "3.2cqw", letterSpacing: "-0.02em" }}
            >
              {year}
            </span>
            <span style={{ color: C.grey }}>
              <span style={{ color: C.ink }}>{running.length} running</span>
              {" · "}
              {backedSoFar} backed so far
              {backedThatYear.length ? ` · ${backedThatYear.map((b) => b.name).join(", ")} this year` : ""}
            </span>
          </div>

          <div className="mt-[2.2cqw] grid grid-cols-[17cqw_1fr]">
            <div />
            <div className="relative h-[3.2cqw]">
              {YEARS.map((y) => (
                <span
                  key={y}
                  className="b09-s absolute top-0 -translate-x-1/2 tabular-nums"
                  style={{ left: `${cellMid(y)}%`, color: y === year ? C.ink : C.faint, fontSize: "1.8cqw" }}
                >
                  {String(y).slice(2)}
                </span>
              ))}
            </div>

            {[...BUILT.map((b) => ({ kind: "span" as const, ...b })), { kind: "dots" as const, name: "Backed" }].map(
              (row) => {
                const lit =
                  row.kind === "span"
                    ? row.from <= year && (row.to === null || row.to >= year)
                    : backedThatYear.length > 0
                return (
                  <React.Fragment key={row.name}>
                    <span
                      className="b09-s truncate py-[0.85cqw]"
                      style={{
                        color: lit ? C.ink : C.grey,
                        borderTop: row.kind === "dots" ? `1px solid ${C.hair}` : undefined,
                        marginTop: row.kind === "dots" ? "0.8cqw" : undefined,
                      }}
                    >
                      {row.name}
                    </span>
                    <span
                      className="relative"
                      style={{
                        borderTop: row.kind === "dots" ? `1px solid ${C.hair}` : undefined,
                        marginTop: row.kind === "dots" ? "0.8cqw" : undefined,
                      }}
                    >
                      {row.kind === "span" ? (
                        <span
                          className="b09-s absolute top-1/2 h-[0.45cqw] -translate-y-1/2 rounded-full"
                          style={{
                            left: `${pct(row.from)}%`,
                            // Still running: the line leaves the sheet's edge.
                            right: row.to === null ? "-4.4cqw" : `${100 - pct(row.to + 1)}%`,
                            borderTopRightRadius: row.to === null ? 0 : undefined,
                            borderBottomRightRadius: row.to === null ? 0 : undefined,
                            background: lit ? C.ink : "rgba(18,18,18,0.14)",
                          }}
                        />
                      ) : (
                        YEARS.map((y) => {
                          const k = BACKED.filter((b) => b.year === y).length
                          return Array.from({ length: k }, (_, j) => (
                            <span
                              key={`${y}-${j}`}
                              className="b09-s absolute top-1/2 size-[1.1cqw] rounded-full"
                              style={{
                                left: `calc(${cellMid(y)}% + ${(j - (k - 1) / 2) * 1.6}cqw)`,
                                translate: "-50% -50%",
                                background: y === year ? C.ink : "rgba(18,18,18,0.22)",
                              }}
                            />
                          ))
                        })
                      )}
                    </span>
                  </React.Fragment>
                )
              },
            )}
          </div>
        </div>

        {/* The ruler's hit area and cursor, over the track column only. */}
        <div
          ref={track}
          role="slider"
          tabIndex={0}
          aria-label="Year"
          aria-valuemin={Y0}
          aria-valuemax={Y1}
          aria-valuenow={year}
          onPointerDown={(e) => {
            dragging.current = true
            e.currentTarget.setPointerCapture(e.pointerId)
            fromX(e.clientX)
          }}
          onPointerMove={(e) => {
            if (dragging.current || e.pointerType === "mouse") fromX(e.clientX)
          }}
          onPointerUp={() => {
            dragging.current = false
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowLeft" || e.key === "ArrowDown") setYear((y) => Math.max(Y0, y - 1))
            if (e.key === "ArrowRight" || e.key === "ArrowUp") setYear((y) => Math.min(Y1, y + 1))
            if (e.key === "Home") setYear(Y0)
            if (e.key === "End") setYear(Y1)
          }}
          className="absolute top-[12.4cqw] right-[4.4cqw] bottom-[6cqw] left-[21.4cqw] cursor-ew-resize outline-none"
          style={{ touchAction: "none" }}
        >
          <span
            aria-hidden
            className="b09-c absolute top-0 bottom-0 w-[0.3cqw] -translate-x-1/2"
            style={{ left: `${cellMid(year)}%`, background: ACCENT }}
          />

        </div>
      </Sheet>
    </Tile>
  )
}
