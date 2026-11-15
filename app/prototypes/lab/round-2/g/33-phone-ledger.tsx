"use client"

import * as React from "react"

import { homeContent } from "@/lib/content"

import { C, fontHand, fontMono, useSeen } from "../../kit"
import { DrawnBracket, PART_CSS } from "../../round-1/a/parts"
import { HAIR, RULE, Ground, useReplay } from "./_ledger"

/**
 * 33 — The ledger at phone width.
 *
 * The now / before index from 10, set the way it has to sit in a 375px
 * column: each row stacks — name and years on one line, the years still in
 * tabular figures flush right, the role under it in grey — so nothing has to
 * truncate. The pen from 01 brackets the two that came before and says, in
 * the margin a phone does not have, what they have in common.
 */

const PEN = "oklch(0.5 0.19 259)"

type Row = { name: string; role: string; years: string }

/** "Sunset · 2021–2026" → before, "2021–2026"; "Since 2017" → now, "since 2017". */
const WORK = homeContent.en.work.map((w) => {
  const [a, b] = w.period.split(" · ")
  return { name: w.name, role: w.role, years: b ?? a.replace(/^Since /, "since "), before: Boolean(b) }
})
const NOW: Row[] = WORK.filter((w) => !w.before)
const BEFORE: Row[] = WORK.filter((w) => w.before)

const css = `
${PART_CSS}
.g33-note { transition-delay: 0ms; }
.g33-note[data-on] { transition-delay: 560ms; }
`

function Rows({ rows }: { rows: Row[] }) {
  return (
    <>
      {rows.map((r, i) => (
        <span
          key={r.name}
          className="block py-[0.62cqw]"
          style={{ borderTop: i > 0 ? `1px solid ${HAIR}` : undefined }}
        >
          <span className="flex items-baseline justify-between gap-[2cqw]">
            <span style={{ fontWeight: 520 }}>{r.name}</span>
            <span className="tabular-nums" style={{ color: C.grey }}>
              {r.years}
            </span>
          </span>
          <span className="block" style={{ color: C.grey, fontSize: "1.75cqw" }}>
            {r.role}
          </span>
        </span>
      ))}
    </>
  )
}

export default function PhoneLedger() {
  const [ref, seen] = useSeen<HTMLDivElement>()
  const [on, replay] = useReplay(seen)

  return (
    <Ground
      bold="The same ledger, at phone width."
      grey="Rows stack instead of truncating; the years stay in a column of tabular figures."
    >
      <style>{css}</style>

      {/* The viewport: two faint edges and its width, so the column reads as a phone. */}
      <div aria-hidden className="absolute top-[17.4cqw] bottom-0 left-[5.4cqw] w-[40cqw]">
        <span className="absolute inset-y-0 left-0 w-px" style={{ background: HAIR }} />
        <span className="absolute inset-y-0 right-0 w-px" style={{ background: HAIR }} />
        <span
          className="absolute top-0 right-[1.2cqw] tabular-nums"
          style={{ fontFamily: fontMono, fontSize: "1.5cqw", color: C.faint }}
        >
          375
        </span>
      </div>

      <div ref={ref} className="absolute top-[19.6cqw] left-[5.4cqw]" style={{ fontSize: "2.05cqw", lineHeight: 1.25 }}>
        <button
          type="button"
          onClick={replay}
          aria-label="Draw the note again"
          className="grid w-[89cqw] cursor-pointer text-left"
          style={{ gridTemplateColumns: "40cqw 1fr", touchAction: "manipulation" }}
        >
          <span className="col-start-1 block px-[2.6cqw]">
            <span className="flex items-center gap-[1.6cqw]" style={{ color: C.grey }}>
              Now
              <span aria-hidden className="h-px flex-1" style={{ background: RULE }} />
            </span>
            <Rows rows={NOW} />
          </span>
          <span className="col-start-2" />

          <span className="col-start-1 block px-[2.6cqw] pt-[1.6cqw]">
            <span className="flex items-center gap-[1.6cqw]" style={{ color: C.grey }}>
              Before
              <span aria-hidden className="h-px flex-1" style={{ background: RULE }} />
            </span>
          </span>
          <span className="col-start-2" />

          <span className="col-start-1 block px-[2.6cqw]">
            <Rows rows={BEFORE} />
          </span>
          <span className="col-start-2 flex items-stretch gap-[1.6cqw] py-[0.6cqw] pl-[1.6cqw]">
            <DrawnBracket color={PEN} on={on} className="w-[1.6cqw] shrink-0" />
            <span
              className="r1a-write g33-note block w-[34cqw] -rotate-2 self-center leading-[0.95]"
              data-on={on || undefined}
              style={{ fontFamily: fontHand, fontSize: "3.5cqw", color: PEN }}
            >
              both founder,
              <br />
              both wound down.
              <br />
              sailsdock lives on in bedrifty
            </span>
          </span>
        </button>
      </div>
    </Ground>
  )
}
