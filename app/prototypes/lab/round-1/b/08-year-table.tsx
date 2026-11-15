"use client"

import * as React from "react"

import { companyOrder } from "@/lib/companies"

import { C, Lead, Tile, fontHand } from "../../kit"
import { Sheet, company } from "./_shared"

/**
 * The portfolio as a ledger: year, company, role, outcome, in tabular
 * figures. The year prints once per group, the way the writing list does.
 * Built / Backed filters the rows; the one sale is the only thing in colour.
 */

const ACCENT = "oklch(0.55 0.14 152)"

/** End years the site states (lib/content work periods, lib/companies body). */
const ENDED: Partial<Record<string, string>> = {
  refenze: "2018",
  sailsdock: "2026",
  docdir: "2026",
}

const ROWS = [...companyOrder]
  .map((slug) => {
    const c = company(slug)
    const backed = /investor/i.test(c.role)
    const end = ENDED[slug]
    const outcome =
      c.status === "Active" ? "Active" : end ? `${c.status}, ${end}` : c.status
    return { slug, year: c.year, name: c.name, role: c.role, outcome, backed, sold: slug === "docdir" }
  })
  .sort((a, b) => b.year.localeCompare(a.year) || a.name.localeCompare(b.name))

const FILTERS = [
  { id: "all", label: "All" },
  { id: "built", label: "Built" },
  { id: "backed", label: "Backed" },
] as const
type F = (typeof FILTERS)[number]["id"]

const css = `
.b08-r { transition-property: background-color; transition-duration: 140ms; transition-timing-function: ease-out; }
.b08-r:hover { background-color: ${C.tile}; }
.b08-u { transition-property: left, width; transition-duration: 240ms; transition-timing-function: cubic-bezier(.2,.7,.2,1); }
@media (prefers-reduced-motion: reduce) { .b08-r, .b08-u { transition-duration: 0ms; } }
`

export default function YearTable() {
  const [f, setF] = React.useState<F>("all")
  const rows = ROWS.filter((r) => f === "all" || (f === "backed" ? r.backed : !r.backed))
  const tabs = React.useRef<(HTMLButtonElement | null)[]>([])
  const [u, setU] = React.useState({ l: 0, w: 0 })

  React.useLayoutEffect(() => {
    const el = tabs.current[FILTERS.findIndex((x) => x.id === f)]
    if (el) setU({ l: el.offsetLeft, w: el.offsetWidth })
  }, [f])

  return (
    <Tile>
      <style>{css}</style>
      <Lead
        bold="Twelve companies, one ledger."
        grey="Founded, role, how it ended. Ten years read down a column of tabular figures."
      />

      <p
        aria-hidden
        className="absolute top-[5cqw] right-[5.4cqw] rotate-[-4deg] leading-[0.95]"
        style={{ fontFamily: fontHand, fontSize: "3.6cqw", color: ACCENT }}
      >
        the one
        <br />
        I sold, 2026 ↓
      </p>

      <Sheet top="17cqw">
        <div className="px-[4.4cqw] pt-[2.4cqw]" style={{ fontSize: "2.1cqw", lineHeight: 1.25 }}>
          <div role="tablist" aria-label="Filter" className="relative mb-[1cqw] flex gap-[3cqw]">
            {FILTERS.map((x, i) => (
              <button
                key={x.id}
                ref={(el) => {
                  tabs.current[i] = el
                }}
                type="button"
                role="tab"
                aria-selected={f === x.id}
                onClick={() => setF(x.id)}
                className="cursor-pointer pb-[1cqw] outline-none"
                style={{
                  color: f === x.id ? C.ink : C.grey,
                  fontWeight: f === x.id ? 560 : 460,
                  transitionProperty: "color",
                  transitionDuration: "140ms",
                  touchAction: "manipulation",
                }}
              >
                {x.label}{" "}
                <span className="tabular-nums" style={{ color: C.faint, fontWeight: 460 }}>
                  {x.id === "all" ? ROWS.length : ROWS.filter((r) => (x.id === "backed") === r.backed).length}
                </span>
              </button>
            ))}
            <span
              aria-hidden
              className="b08-u absolute bottom-0 h-px"
              style={{ left: u.l, width: u.w, background: C.ink }}
            />
          </div>

          <table className="w-full border-collapse tabular-nums">
            <thead>
              <tr style={{ color: C.faint }} className="text-left">
                <th className="w-[10cqw] py-[0.6cqw] font-[460]">Year</th>
                <th className="py-[0.6cqw] font-[460]">Company</th>
                <th className="py-[0.6cqw] font-[460]">Role</th>
                <th className="py-[0.6cqw] text-right font-[460]">Outcome</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => {
                const first = i === 0 || rows[i - 1].year !== r.year
                return (
                  <tr
                    key={r.slug}
                    className="b08-r"
                    style={{ borderTop: `1px solid ${first ? "rgba(18,18,18,0.12)" : C.hair}` }}
                  >
                    <td className="py-[0.7cqw] pl-[0.6cqw]" style={{ color: C.grey }}>
                      {first ? r.year : ""}
                    </td>
                    <td className="py-[0.7cqw]" style={{ fontWeight: 520 }}>
                      {r.name}
                    </td>
                    <td className="py-[0.7cqw]" style={{ color: C.grey }}>
                      {r.role}
                    </td>
                    <td
                      className="py-[0.7cqw] pr-[0.6cqw] text-right"
                      style={{ color: r.sold ? ACCENT : C.grey, fontWeight: r.sold ? 560 : 460 }}
                    >
                      {r.outcome}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Sheet>
    </Tile>
  )
}
