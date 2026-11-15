import {
  companies,
  companyOrder,
  type CompanySlug,
  type Lang,
} from "@/lib/companies"
import { portfolioContent } from "@/lib/content"
import { companyPen } from "@/lib/pen/companies"
import { localizedPath } from "@/lib/seo"
import { cn } from "@/lib/utils"

import { CardBody } from "@/components/site/link"
import { Ledger, LedgerCard, type LedgerRow } from "@/components/site/ledger"
import { Ring } from "@/components/site/pen"

/**
 * The portfolio (DESIGN.md §5; lab round-3/k/51 + 55, as §7.6 resolves
 * them): the kicker, the intro as the h1, then all twelve companies as 51's
 * year ledger, newest first, the year printed once per group. The red pen
 * rings Docdir's outcome and writes its note in the margin; pointing at or
 * focusing any row opens 55's margin card in place of the note, and the ring
 * stays on Docdir. Each row is a link to its company.
 */

/** The wide column (no rail): 16% / 648px from `lg`, page padding below. */
export const WIDE_COLUMN =
  "px-[var(--page-pad-x)] lg:ml-[var(--column-wide-left)] lg:w-[var(--column-wide)] lg:px-0"

/** The one fact the ring rests on. */
const PINNED: CompanySlug = "docdir"

/** End years the site states (lib/content work periods, lib/companies body). */
const ENDED: Partial<Record<CompanySlug, string>> = {
  refenze: "2018",
  sailsdock: "2026",
  docdir: "2026",
}

const HEAD: Record<Lang, [string, string, string, string]> = {
  en: ["Year", "Company", "Role", "Outcome"],
  no: ["År", "Selskap", "Rolle", "Utfall"],
}

/** Live companies say their status; ended ones say how, and when. */
function outcome(slug: CompanySlug, lang: Lang) {
  const c = companies[lang][slug]
  if (c.status === companies[lang].codebase.status) {
    return { text: c.status, live: true }
  }
  const end = ENDED[slug]
  return { text: end ? `${c.stage}, ${end}` : c.stage, live: false }
}

/*
 * Columns 6cqw · 15.5cqw · 15.5cqw · 1fr (72 / 186 / 186px at 648). On a
 * phone the Role column folds under the name and the outcome stays right.
 */
const GRID =
  "[--pf-year:2.6em] [--pf-cols:minmax(0,1fr)_auto] md:[--pf-year:72px] md:[--pf-cols:186px_186px_1fr]"

export function PortfolioContent({ lang }: { lang: Lang }) {
  const p = portfolioContent[lang]
  const head = HEAD[lang]
  const note = companyPen[PINNED][lang]

  const sorted = [...companyOrder].sort((a, b) => {
    const x = companies[lang][a]
    const y = companies[lang][b]
    return y.year.localeCompare(x.year) || x.name.localeCompare(y.name)
  })

  const rows: LedgerRow[] = sorted.map((slug) => {
    const c = companies[lang][slug]
    const o = outcome(slug, lang)
    const ringed = slug === PINNED
    return {
      id: slug,
      year: c.year,
      href: localizedPath(`/portfolio/${slug}`, lang),
      align: { 2: "right" },
      cells: [
        <span key="name" className="block">
          <span
            className={cn(
              "font-[var(--weight-row)] transition-[color] duration-[160ms]",
              ringed
                ? "text-ink"
                : "text-ink-ledger-dim [.ledger-row:focus-visible_&]:text-ink [.ledger-row:hover_&]:text-ink"
            )}
          >
            {c.name}
          </span>
          <span className="block text-small leading-[var(--leading-meta)] text-ink-muted md:hidden">
            {c.role}
          </span>
        </span>,
        <span key="role" className="text-ink-muted">
          {c.role}
        </span>,
        <span key="outcome" className="inline-block pr-1">
          {ringed ? (
            <Ring note={note} srNote={note} className="text-ink">
              {o.text}
            </Ring>
          ) : (
            <span className={o.live ? "text-ink-faint" : "text-ink-muted"}>
              {o.text}
            </span>
          )}
        </span>,
      ],
      preview: (
        <LedgerCard>
          <CardBody
            dot
            card={{
              name: c.name,
              status: c.status,
              line: c.tagline,
              meta: `${c.role} · ${c.year} · ${c.sector}`,
            }}
          />
        </LedgerCard>
      ),
    }
  })

  return (
    <main id="main" className="flex-1">
      <div className={cn(WIDE_COLUMN, "pt-[58px]")} data-pen-column>
        <p className="mb-[9px] text-small text-ink-muted">{p.kicker}</p>
        <h1 className="max-w-[33rem] text-[21.5px] leading-[1.2] font-[var(--weight-strong)] tracking-[-0.014em] text-balance">
          {p.intro}
        </h1>

        <div className={cn(GRID, "mt-[45px] text-ui leading-[1.2]")}>
          <div
            aria-hidden
            className="grid items-end gap-x-2 pb-[7px] text-ink-faint tabular-nums"
            style={{ gridTemplateColumns: "var(--pf-year) var(--pf-cols)" }}
          >
            <span>{head[0]}</span>
            <span>{head[1]}</span>
            <span className="hidden md:block">{head[2]}</span>
            <span className="text-right">{head[3]}</span>
          </div>
          <Ledger
            label={p.kicker}
            yearWidth="var(--pf-year)"
            columns="var(--pf-cols)"
            rows={rows}
            className="[&_.ledger-row]:items-center max-md:[&_.ledger-row>span:nth-child(3)]:hidden"
          />
        </div>
      </div>
    </main>
  )
}
