"use client"

import * as React from "react"

import { Bar, C, Lead, Tile, fontHand, useSeen } from "../../kit"
import { DrawnBracket, PART_CSS, PageCard, PostHead, useReplay } from "./parts"

/**
 * The apparel post, read with a blue pen. When the page is seen, a bracket
 * draws down the side of the paragraph that holds the lesson, and the note
 * writes itself in after it. Tapping the page reads it again.
 */

const PEN = "oklch(0.5 0.19 259)"

const css = `
${PART_CSS}
.r1a1-note { transition-delay: 0ms; }
.r1a1-note[data-on] { transition-delay: 520ms; }
`

export default function BracketNote() {
  const [ref, seen] = useSeen<HTMLDivElement>()
  const [on, replay] = useReplay(seen)

  return (
    <Tile>
      <style>{css}</style>
      <Lead
        bold="A note in the margin, in his own hand."
        grey="The bracket draws down the paragraph that matters, then the note writes itself in."
      />

      <div ref={ref} className="absolute top-[21cqw] right-0 left-[5.4cqw]">
        <PageCard />
        <button
          type="button"
          onClick={replay}
          aria-label="Read the note again"
          className="relative grid w-full cursor-pointer grid-cols-[58cqw_1fr] text-left"
          style={{ touchAction: "manipulation" }}
        >
          <span className="col-start-1 block px-[3.4cqw] pt-[3cqw] pb-[1.6cqw]">
            <PostHead title="What apparel taught me about software" meta="Jun 2024 · 2 min" />
          </span>
          <span className="col-start-2" />

          <span className="col-start-1 block px-[3.4cqw] py-[1cqw]" style={{ color: C.grey }}>
            My first company, Refenze, made fitness apparel. Manufactured in China, sold to
            customers across Europe and the US, growing 25% a month at its peak.
          </span>
          <span className="col-start-2" />

          <span className="col-start-1 block px-[3.4cqw] py-[1cqw]">
            Physical products teach you things software founders skip: cash is real,
            inventory is a bet, and a refund is a conversation rather than a button. You
            feel every single unit.
          </span>
          <span className="relative col-start-2 flex items-stretch gap-[1.4cqw] py-[1cqw] pl-[1.6cqw]">
            <DrawnBracket color={PEN} on={on} className="w-[1.6cqw] shrink-0" />
            <span
              className="r1a-write r1a1-note block w-[30cqw] -rotate-2 self-center leading-[0.95]"
              data-on={on || undefined}
              style={{ fontFamily: fontHand, fontSize: "3.8cqw", color: PEN }}
            >
              cash, inventory, refunds.
              <br />
              refenze taught me
              <br />
              all three
            </span>
          </span>

          <span className="col-start-1 block px-[3.4cqw] py-[1cqw]" style={{ color: C.grey }}>
            When I moved to software, those instincts stayed. Ship something people pay for.
          </span>
          <span className="col-start-2" />

          <span className="col-start-1 flex flex-col gap-[1.3cqw] px-[3.4cqw] pt-[1.2cqw] pb-[6cqw]">
            <Bar w="84%" />
            <Bar w="62%" />
          </span>
        </button>
      </div>
    </Tile>
  )
}
