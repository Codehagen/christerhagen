"use client"

import * as React from "react"

import { C, Lead, Tile, fontHand } from "../../kit"
import { Sheet } from "./_shared"

/**
 * A two-part index: what is running now, and what came before. Every "before"
 * row has a pen note in the margin saying how it ended, and Sailsdock's draws
 * a line up to Bedrifty, which the site calls its successor. Hover or focus a
 * row to read its note.
 */

const PEN = "oklch(0.6 0.19 42)"

// Fixed coordinates in cqw so the margin line can meet the rows exactly.
const SHEET_L = 5.4
const SHEET_W = 58
const PAD = 3.6
const RH = 4.5
const NOW_TOP = 28.4
const BEFORE_TOP = NOW_TOP + 4 * RH + 6.6
const RIGHT = SHEET_L + SHEET_W - PAD

const NOW = [
  { name: "Bedrifty", role: "Founder", meta: "since 2026" },
  { name: "Advanti Estate", role: "Partner", meta: "since 2024" },
  { name: "Not Another VC", role: "Founder", meta: "since 2023" },
  { name: "Codebase", role: "Founder", meta: "since 2017" },
]

type Before = { id: string; name: string; role: string; meta: string; note: string }
const BEFORE: Before[] = [
  { id: "docdir", name: "Docdir", role: "Founder", meta: "2024–2026", note: "sold to Visma, 2026" },
  { id: "sailsdock", name: "Sailsdock", role: "Founder", meta: "2021–2026", note: "its ideas live on in Bedrifty" },
  { id: "utleie", name: "Utleieoversikten", role: "Investor", meta: "2021", note: "an exit, the early money back" },
  { id: "refenze", name: "Refenze", role: "Founder", meta: "2016–2018", note: "where I learned cash and inventory" },
]

const mid = (top: number, i: number) => top + i * RH + RH / 2

const css = `
@keyframes b10-draw { from { stroke-dashoffset: 1; } to { stroke-dashoffset: 0; } }
@keyframes b10-in { from { opacity: 0; translate: -0.8cqw 0; } to { opacity: 1; translate: 0 0; } }
.b10-path { stroke-dasharray: 1; animation: b10-draw 620ms cubic-bezier(.55,.05,.3,1) both; }
.b10-note { animation: b10-in 320ms cubic-bezier(.2,.7,.2,1) both; animation-delay: 380ms; }
.b10-row { transition-property: color; transition-duration: 160ms; transition-timing-function: ease-out; }
@media (prefers-reduced-motion: reduce) { .b10-path, .b10-note { animation: none; } .b10-row { transition-duration: 0ms; } }
`

function Row({
  top,
  name,
  role,
  meta,
  lit,
  onEnter,
  label,
  rule,
}: {
  top: number
  name: string
  role: string
  meta: string
  lit: boolean
  onEnter?: () => void
  label: string
  rule: boolean
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onPointerEnter={onEnter}
      onFocus={onEnter}
      onClick={onEnter}
      className="absolute flex cursor-pointer items-center justify-between text-left outline-none"
      style={{
        top: `${top}cqw`,
        height: `${RH}cqw`,
        left: `${SHEET_L + PAD}cqw`,
        width: `${SHEET_W - 2 * PAD}cqw`,
        borderTop: rule ? `1px solid ${C.hair}` : undefined,
        touchAction: "manipulation",
      }}
    >
      <span className="flex items-baseline gap-[1.6cqw]">
        <span className="b10-row" style={{ color: lit ? C.ink : C.grey, fontWeight: 520 }}>
          {name}
        </span>
        <span style={{ color: C.faint }}>{role}</span>
      </span>
      <span className="b10-row tabular-nums" style={{ color: lit ? C.ink : C.grey }}>
        {meta}
      </span>
    </button>
  )
}

export default function NowBefore() {
  const [active, setActive] = React.useState("sailsdock")
  const ai = BEFORE.findIndex((b) => b.id === active)
  const y = mid(BEFORE_TOP, ai)
  const bedrifty = mid(NOW_TOP, 0)
  const link = active === "sailsdock"

  return (
    <Tile>
      <style>{css}</style>
      <Lead
        bold="Now, and before."
        grey="The index splits in two. What came before keeps a note in the margin on how it ended."
      />

      <Sheet top="21cqw" left={`${SHEET_L}cqw`} width={`${SHEET_W}cqw`} />

      <p
        className="absolute flex items-center gap-[1.6cqw]"
        style={{ top: `${NOW_TOP - 4.4}cqw`, left: `${SHEET_L + PAD}cqw`, width: `${SHEET_W - 2 * PAD}cqw`, color: C.grey }}
      >
        Now
        <span aria-hidden className="h-px flex-1" style={{ background: C.hair }} />
      </p>
      {NOW.map((r, i) => (
        <Row
          key={r.name}
          top={NOW_TOP + i * RH}
          {...r}
          rule={i > 0}
          lit
          label={`${r.name}, ${r.role}, ${r.meta}`}
          onEnter={i === 0 ? () => setActive("sailsdock") : undefined}
        />
      ))}

      <p
        className="absolute flex items-center gap-[1.6cqw]"
        style={{ top: `${BEFORE_TOP - 4.4}cqw`, left: `${SHEET_L + PAD}cqw`, width: `${SHEET_W - 2 * PAD}cqw`, color: C.grey }}
      >
        Before
        <span aria-hidden className="h-px flex-1" style={{ background: C.hair }} />
      </p>
      {BEFORE.map((r, i) => (
        <Row
          key={r.id}
          top={BEFORE_TOP + i * RH}
          {...r}
          rule={i > 0}
          lit={r.id === active}
          label={`${r.name}, ${r.role}, ${r.meta}: ${r.note}`}
          onEnter={() => setActive(r.id)}
        />
      ))}

      {/* The margin: one tick at the active row, and for Sailsdock a line up to its successor. */}
      <svg
        aria-hidden
        key={active}
        viewBox="0 0 100 75"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-0 h-full w-full"
        style={{ overflow: "visible" }}
      >
        {link ? (
          <>
            <path
              className="b10-path"
              pathLength={1}
              d={`M ${RIGHT + 1.6} ${y} C ${RIGHT + 13} ${y - 1}, ${RIGHT + 15} ${bedrifty + 3}, ${RIGHT + 2} ${bedrifty}`}
              fill="none"
              stroke={PEN}
              strokeWidth={0.26}
              strokeLinecap="round"
            />
            <path
              className="b10-path"
              pathLength={1}
              style={{ animationDelay: "520ms" }}
              d={`M ${RIGHT + 4.6} ${bedrifty - 1.6} L ${RIGHT + 2} ${bedrifty} L ${RIGHT + 4.4} ${bedrifty + 1.9}`}
              fill="none"
              stroke={PEN}
              strokeWidth={0.26}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </>
        ) : (
          <path
            className="b10-path"
            pathLength={1}
            d={`M ${RIGHT + 1.8} ${y + 0.2} C ${RIGHT + 3} ${y - 0.3}, ${RIGHT + 4.2} ${y + 0.2}, ${RIGHT + 5.6} ${y - 0.1}`}
            fill="none"
            stroke={PEN}
            strokeWidth={0.26}
            strokeLinecap="round"
          />
        )}
      </svg>

      <p
        key={`n-${active}`}
        aria-live="polite"
        className="b10-note absolute w-[26cqw] -rotate-3 leading-[0.95]"
        style={
          link
            ? {
                left: `${RIGHT + 16}cqw`,
                width: "21cqw",
                top: `${(y + bedrifty) / 2 - 3}cqw`,
                fontFamily: fontHand,
                fontSize: "3.7cqw",
                color: PEN,
              }
            : {
                left: `${RIGHT + 7}cqw`,
                top: `${y - 2.2}cqw`,
                fontFamily: fontHand,
                fontSize: "3.7cqw",
                color: PEN,
              }
        }
      >
        {BEFORE[ai].note}
      </p>
    </Tile>
  )
}
