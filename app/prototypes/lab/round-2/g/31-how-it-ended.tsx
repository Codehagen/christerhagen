"use client"

import * as React from "react"

import { companies, companyOrder, type CompanySlug } from "@/lib/companies"

import { C, fontHand, useSeen } from "../../kit"
import { Ground, HAIR, RULE, Ring, ringCss } from "./_ledger"

/**
 * 31 — How it ended.
 *
 * The year ledger from 08, with the pen ring from 20 living in its outcome
 * column. Point at a row and the ring leaves the one it was on and draws
 * itself round that row's outcome; the margin, as in 10, says in the pen how
 * it ended. Leave and it goes back to the one that was set down; click to set
 * it down on another.
 */

const PEN = "#D9402B"

/** End years the site states (lib/content work periods, lib/companies body). */
const ENDED: Partial<Record<CompanySlug, string>> = {
  refenze: "2018",
  sailsdock: "2026",
  docdir: "2026",
}

/** Short, dry paraphrases of what the site says about each one. */
const NOTE: Record<CompanySlug, string> = {
  codebase: "still the studio everything runs through",
  bedrifty: "sailsdock's problem, rebuilt around ai",
  sailsdock: "wound down. the ideas went to bedrifty",
  "advanti-estate": "partner. software for an analogue trade",
  miniskatten: "with maria, who runs it",
  refenze: "the first one. cash, inventory, wound down",
  codenord: "pre-seed, through not another vc",
  propdock: "an early not another vc bet",
  vendo: "pre-seed, through not another vc",
  fotovibe: "pre-seed, through not another vc",
  somevibe: "pre-seed, through not another vc",
  docdir: "sold to visma. bodø's second, after poweroffice",
  utleieoversikten: "an exit. a calculator for property investors",
}

const ROWS = [...companyOrder]
  .map((slug) => {
    const c = companies.en[slug]
    const end = ENDED[slug]
    const outcome = c.status === "Active" ? "Active" : end ? `${c.stage}, ${end}` : c.stage
    return { slug, year: c.year, name: c.name, role: c.role, outcome, live: c.status === "Active" }
  })
  .sort((a, b) => b.year.localeCompare(a.year) || a.name.localeCompare(b.name))

// Fixed coordinates in cqw so the margin note can meet its row exactly.
const L = 5.4
const W = 61
const TOP = 18.4
const HEAD = 3.4
const RH = 3.92

const css = `
${ringCss}
.g31-row { transition-property: color; transition-duration: 160ms; transition-timing-function: ease-out; }
.g31-tick { stroke-dasharray: 1; animation: g31-draw 320ms cubic-bezier(.55,.05,.3,1) 380ms both; }
.g31-note { animation: g31-in 300ms cubic-bezier(.2,.7,.2,1) 520ms both; }
@keyframes g31-draw { from { stroke-dashoffset: 1; } to { stroke-dashoffset: 0; } }
@keyframes g31-in { from { opacity: 0; translate: -0.8cqw 0; } to { opacity: 1; translate: 0 0; } }
.g31-btn:focus { outline: none; }
.g31-btn:focus-visible { outline: 2px solid ${C.ink}; outline-offset: -2px; border-radius: 0.4cqw; }
@media (prefers-reduced-motion: reduce) {
  .g31-row { transition-duration: 0ms; }
  .g31-tick { animation: none; }
  .g31-note { animation: g31-fade 160ms ease both; }
  @keyframes g31-fade { from { opacity: 0; } to { opacity: 1; } }
}
`

export default function HowItEnded() {
  const [ref, seen] = useSeen<HTMLDivElement>()
  const [pinned, setPinned] = React.useState<CompanySlug>("docdir")
  const [hover, setHover] = React.useState<CompanySlug | null>(null)
  const active = hover ?? pinned
  const ai = ROWS.findIndex((r) => r.slug === active)
  const y = TOP + HEAD + ai * RH + RH / 2

  return (
    <Ground
      bold="Point at a row; the pen says how it ended."
      grey="The ring moves to the outcome you point at. Click to set it down."
    >
      <style>{css}</style>

      <div
        ref={ref}
        className="absolute tabular-nums"
        style={{ top: `${TOP}cqw`, left: `${L}cqw`, width: `${W}cqw`, fontSize: "2cqw", lineHeight: 1.2 }}
        onPointerLeave={() => setHover(null)}
      >
        <div
          className="grid items-center"
          style={{
            height: `${HEAD}cqw`,
            gridTemplateColumns: "7cqw 18.4cqw 14cqw 1fr",
            color: C.faint,
          }}
        >
          <span>Year</span>
          <span>Company</span>
          <span>Role</span>
          <span className="text-right">Outcome</span>
        </div>

        {ROWS.map((r, i) => {
          const first = i === 0 || ROWS[i - 1].year !== r.year
          const on = r.slug === active
          return (
            <button
              key={r.slug}
              type="button"
              className="g31-btn grid w-full cursor-pointer items-center text-left"
              aria-pressed={pinned === r.slug}
              aria-label={`${r.name}, ${r.year}, ${r.role}, ${r.outcome}: ${NOTE[r.slug]}`}
              onPointerEnter={() => setHover(r.slug)}
              onFocus={() => setHover(r.slug)}
              onBlur={() => setHover(null)}
              onClick={() => setPinned(r.slug)}
              style={{
                height: `${RH}cqw`,
                gridTemplateColumns: "7cqw 18.4cqw 14cqw 1fr",
                borderTop: `1px solid ${first ? RULE : HAIR}`,
                touchAction: "manipulation",
              }}
            >
              <span style={{ color: C.grey }}>{first ? r.year : ""}</span>
              <span className="g31-row" style={{ fontWeight: 520, color: on ? C.ink : "rgba(18,18,18,0.78)" }}>
                {r.name}
              </span>
              <span style={{ color: C.grey }}>{r.role}</span>
              <span className="flex justify-end">
                <span
                  className="g31-row relative"
                  style={{ color: on ? C.ink : r.live ? C.faint : C.grey }}
                >
                  {r.outcome}
                  <Ring on={seen && on} color={PEN} inset="-0.55cqw -1cqw -0.5cqw -1.1cqw" />
                </span>
              </span>
            </button>
          )
        })}
      </div>

      {/* The margin: a short stroke out from the ring, then the note. */}
      {seen ? (
        <>
          <svg
            aria-hidden
            key={`t-${active}`}
            viewBox="0 0 100 75"
            preserveAspectRatio="none"
            className="pointer-events-none absolute inset-0 h-full w-full"
            style={{ overflow: "visible" }}
          >
            <path
              className="g31-tick"
              pathLength={1}
              d={`M ${L + W + 1.6} ${y} C ${L + W + 2.6} ${y - 0.5}, ${L + W + 3.6} ${y + 0.3}, ${L + W + 4.8} ${y - 0.2}`}
              fill="none"
              stroke={PEN}
              strokeWidth={0.24}
              strokeLinecap="round"
            />
          </svg>
          <p
            key={`n-${active}`}
            aria-live="polite"
            className="g31-note absolute -rotate-2 leading-[0.95]"
            style={{
              left: `${L + W + 6}cqw`,
              width: `${100 - L - W - 9}cqw`,
              top: `${Math.min(y - 2.1, 63)}cqw`,
              fontFamily: fontHand,
              fontSize: "3.3cqw",
              color: PEN,
            }}
          >
            {NOTE[active]}
          </p>
        </>
      ) : null}
    </Ground>
  )
}
