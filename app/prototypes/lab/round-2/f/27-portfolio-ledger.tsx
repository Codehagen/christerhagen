"use client"

import * as React from "react"

import { companies, companyOrder } from "@/lib/companies"
import { portfolioContent } from "@/lib/content"

import { fontHand } from "../../kit"
import { G, PenLoop, RING_CSS, Rail, SitePage, TYPE, useSeenIn } from "./frame"

/**
 * 27 — The portfolio page as one ledger. Twelve companies, year printed once
 * per group, role, outcome, in tabular figures. The rail is the filter (All,
 * Built, Backed): its active item darkens like piece 11's. One green pen
 * circles the only sale and writes who bought it in the margin.
 */

const PEN = "oklch(0.55 0.14 152)"
const p = portfolioContent.en

/** End years the site states (lib/content work periods). */
const ENDED: Partial<Record<string, string>> = { refenze: "2018", sailsdock: "2026" }

const ROWS = companyOrder
  .map((slug) => {
    const c = companies.en[slug]
    const outcome =
      slug === "docdir"
        ? "Acquired"
        : c.status === "Sunset"
          ? `Sunset ${ENDED[slug] ?? ""}`.trim()
          : c.status
    return { slug, year: c.year, name: c.name, role: c.role, outcome, backed: /investor/i.test(c.role) }
  })
  .sort((a, b) => b.year.localeCompare(a.year) || a.name.localeCompare(b.name))

const FILTERS = [
  { label: "All", keep: () => true },
  { label: "Built", keep: (r: (typeof ROWS)[number]) => !r.backed },
  { label: "Backed", keep: (r: (typeof ROWS)[number]) => r.backed },
]

const css = `
${RING_CSS}
.f27-r { transition-property: background-color; transition-duration: 140ms; }
@media (hover: hover) and (pointer: fine) { .f27-r:hover { background-color: rgba(18,18,18,0.025); } }
.f27-note { clip-path: inset(-30% 100% -30% -4%); transition-property: clip-path; transition-duration: 0ms; }
.f27-note[data-on] { clip-path: inset(-30% -4% -30% -4%); transition-duration: 900ms; transition-delay: 640ms; transition-timing-function: cubic-bezier(.4,0,.3,1); }
@media (prefers-reduced-motion: reduce) {
  .f27-r, .f27-note, .f27-note[data-on] { transition-duration: 0ms; transition-delay: 0ms; }
}
`

export default function PortfolioLedger() {
  const scrollerRef = React.useRef<HTMLDivElement>(null)
  const tableRef = React.useRef<HTMLTableElement>(null)
  const seen = useSeenIn(scrollerRef, tableRef, 0.4)
  const [f, setF] = React.useState(0)
  const rows = ROWS.filter(FILTERS[f].keep)
  const on = seen && rows.some((r) => r.slug === "docdir")

  return (
    <SitePage
      label="christerhagen.com, the portfolio page"
      scrollerRef={scrollerRef}
      colLeft={22}
      colWidth={50}
      rail={
        <Rail
          label="Filter the portfolio"
          mode="filter"
          head="↩ Index"
          active={f}
          onPick={setF}
          items={FILTERS.map((x) => (
            <span key={x.label}>
              {x.label}{" "}
              <span className="tabular-nums" style={{ color: G.faint }}>
                {ROWS.filter(x.keep).length}
              </span>
            </span>
          ))}
        />
      }
    >
      <style>{css}</style>

      <p style={{ margin: 0, color: G.grey }}>{p.kicker}</p>
      <h1 style={{ ...TYPE.title, margin: "1cqw 0 4.4cqw", maxWidth: "40cqw", textWrap: "balance" }}>{p.intro}</h1>

      <table ref={tableRef} className="w-full border-collapse tabular-nums" style={{ fontSize: "1.9cqw", lineHeight: 1.3 }}>
        <thead>
          <tr className="text-left" style={{ color: G.faint }}>
            <th className="font-[460]" style={{ width: "7cqw", padding: "0.6cqw 0" }}>
              Year
            </th>
            <th className="font-[460]" style={{ padding: "0.6cqw 0" }}>
              Company
            </th>
            <th className="font-[460]" style={{ padding: "0.6cqw 0" }}>
              Role
            </th>
            <th className="text-right font-[460]" style={{ padding: "0.6cqw 0" }}>
              Outcome
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => {
            const first = i === 0 || rows[i - 1].year !== r.year
            const sold = r.slug === "docdir"
            return (
              <tr
                key={r.slug}
                className="f27-r"
                style={{ borderTop: `1px solid ${first ? "rgba(18,18,18,0.12)" : G.hair}` }}
              >
                <td style={{ padding: "0.75cqw 0", color: G.grey }}>{first ? r.year : ""}</td>
                <td style={{ padding: "0.75cqw 0", fontWeight: 520 }}>{r.name}</td>
                <td style={{ padding: "0.75cqw 0", color: G.grey }}>{r.role}</td>
                <td className="text-right" style={{ padding: "0.75cqw 0", color: sold ? G.ink : G.grey, fontWeight: sold ? 560 : 460 }}>
                  {sold ? (
                    <span className="relative inline-block">
                      {r.outcome}
                      <PenLoop on={on} color={PEN} inset="-0.9cqw -1.4cqw -0.8cqw -1.5cqw" delay={200} />
                      <span
                        aria-hidden
                        className="f27-note absolute block text-left"
                        data-on={on || undefined}
                        style={{
                          left: "calc(100% + 3.2cqw)",
                          top: "-1.6cqw",
                          width: "21cqw",
                          rotate: "-3deg",
                          fontFamily: fontHand,
                          fontSize: "3.3cqw",
                          lineHeight: 0.95,
                          fontWeight: 400,
                          color: PEN,
                        }}
                      >
                        ← to Broker AS, part of Visma. the second Bodø company they bought
                      </span>
                    </span>
                  ) : (
                    r.outcome
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
      <p className="sr-only" aria-live="polite">
        Showing {rows.length} of {ROWS.length} companies.
      </p>
    </SitePage>
  )
}
