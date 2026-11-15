import { Link } from "next-view-transitions"

import { cn } from "@/lib/utils"

/**
 * Facts as a quiet tabular ledger on the ground (DESIGN.md §4 Ledger): never
 * a card or table chrome. Rows are at least 44px, 7px vertical padding; the
 * first row of a year group has a `--rule` top border, the rest `--hairline`;
 * the year is printed once per group in `--ink-muted`. A row with `href` is
 * one link and gets the row hover.
 *
 * A row's `preview` is 55's margin card: hidden until the row is pointed at
 * or focused, then shown in the right margin level with it. While it shows,
 * any `.ledger-note` in the ledger (the resting pen note of a `Ring` or
 * `Highlight`) steps aside. Pure CSS, so this stays a server component.
 *
 * The ledger is a `.pen-scope`: rows with `rest` step back to grey when a
 * `<Highlight stepBack>` inside it lands (home, 05).
 *
 *   // writing index (49)
 *   <Ledger columns="1fr auto" rows={posts.map(p => ({
 *     id: p.slug, year: p.year, href: `/writing/${p.slug}`,
 *     cells: [<LedgerTitle excerpt={p.excerpt}>{p.title}</LedgerTitle>, `${p.read} · ${ddmm(p.iso)}`],
 *   }))} />
 *
 *   // portfolio (51), header row, no year width override
 *   <Ledger yearWidth="72px" columns="186px 186px 1fr" head={["Year", "Company", "Role", "Outcome"]} rows={…} />
 */

export type LedgerRow = {
  id: string
  /** Printed once per run of equal years. Omit on every row for no year column. */
  year?: string
  /** The whole row is one link. External hrefs open in a new tab. */
  href?: string
  /** The cells after the year, in column order. */
  cells: React.ReactNode[]
  /** 55's margin card, shown on point/focus. Use `<LedgerCard>`. */
  preview?: React.ReactNode
  /** Steps back with the rest when the ledger's highlighter lands. */
  rest?: boolean
  /** Cell indexes to right-align (e.g. the outcome, the date). */
  align?: Partial<Record<number, "right">>
}

export function Ledger({
  rows,
  columns,
  yearWidth = "2.8em",
  head,
  label,
  className,
}: {
  rows: LedgerRow[]
  /** CSS grid columns for `cells` (the year column is added in front). */
  columns: string
  yearWidth?: string
  /** A header row in `--ink-faint` (portfolio: Year · Company · Role · Outcome). */
  head?: React.ReactNode[]
  /** Accessible name for the list. */
  label?: string
  className?: string
}) {
  const years = rows.some((r) => r.year !== undefined)
  const template = years ? `${yearWidth} ${columns}` : columns
  const grid = "grid items-baseline gap-x-2 py-[var(--row-pad-y)] min-h-11"

  return (
    <div className={cn("ledger pen-scope tabular-nums", className)}>
      {head ? (
        <div
          aria-hidden
          className={cn(grid, "min-h-0 text-ink-faint")}
          style={{ gridTemplateColumns: template }}
        >
          {head.map((h, i) => (
            <span
              key={i}
              className={cn(
                i > 0 &&
                  rows[0]?.align?.[i - (years ? 1 : 0)] === "right" &&
                  "text-right"
              )}
            >
              {h}
            </span>
          ))}
        </div>
      ) : null}
      <ul aria-label={label}>
        {rows.map((r, i) => {
          const firstOfGroup = i === 0 || (years && rows[i - 1].year !== r.year)
          const inner = (
            <>
              {years ? (
                <span className={cn("text-ink-muted", r.rest && "pen-rest")}>
                  {firstOfGroup ? r.year : ""}
                </span>
              ) : null}
              {r.cells.map((c, k) => (
                <span
                  key={k}
                  className={cn(
                    "min-w-0",
                    r.align?.[k] === "right" && "text-right",
                    r.rest && "pen-rest"
                  )}
                >
                  {c}
                </span>
              ))}
            </>
          )
          const rowCls = cn(grid, "ledger-row")
          const style = { gridTemplateColumns: template }
          const external = r.href && /^https?:\/\//.test(r.href)
          return (
            <li
              key={r.id}
              className="ledger-item relative border-t"
              style={{
                borderTopColor: firstOfGroup
                  ? "var(--rule)"
                  : "var(--hairline)",
              }}
            >
              {r.href ? (
                external ? (
                  <a
                    href={r.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={rowCls}
                    style={style}
                  >
                    {inner}
                  </a>
                ) : (
                  <Link href={r.href} className={rowCls} style={style}>
                    {inner}
                  </Link>
                )
              ) : (
                <div className={rowCls} style={style}>
                  {inner}
                </div>
              )}
              {r.preview ? (
                <div
                  aria-hidden
                  className="ledger-preview pointer-events-none absolute top-0 left-[calc(100%+var(--margin-gap))] hidden w-[var(--margin-note-w)] margin:block"
                >
                  {r.preview}
                </div>
              ) : null}
            </li>
          )
        })}
      </ul>
    </div>
  )
}

/**
 * A ledger title: weight 520, an optional `→` that turns `--pen` and moves on
 * hover, and an optional 12px excerpt under it (writing index).
 */
export function LedgerTitle({
  children,
  excerpt,
  arrow = true,
  className,
}: {
  children: React.ReactNode
  excerpt?: React.ReactNode
  arrow?: boolean
  className?: string
}) {
  return (
    <span className={cn("block min-w-0", className)}>
      <span className="font-[var(--weight-row)]">
        <span className="ledger-title">{children}</span>
        {arrow ? (
          <>
            {" "}
            <span aria-hidden className="ledger-arrow">
              →
            </span>
          </>
        ) : null}
      </span>
      {excerpt ? (
        <span className="mt-0.5 block text-small leading-[var(--leading-meta)] text-pretty text-ink-muted">
          {excerpt}
        </span>
      ) : null}
    </span>
  )
}

/** 55's margin card for a ledger row's `preview`: the preview card, radius 9px. */
export function LedgerCard({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="rounded-[9px] bg-surface px-3 pt-[9px] pb-[10px] text-small leading-[1.38] text-ink"
      style={{ boxShadow: "var(--card-shadow)" }}
    >
      {children}
    </div>
  )
}

/**
 * The `facts` ledger (53): a `dl` of label (muted, left) and value (right,
 * tabular). Put one `<Ring note>` inside the value that matters.
 */
export function Facts({
  rows,
  className,
}: {
  rows: { key: string; label: React.ReactNode; value: React.ReactNode }[]
  className?: string
}) {
  return (
    <dl className={cn("ledger tabular-nums", className)}>
      {rows.map((r, i) => (
        <div
          key={r.key}
          className="relative flex items-baseline justify-between gap-4 border-t py-[var(--row-pad-y)]"
          style={{ borderTopColor: i ? "var(--hairline)" : "var(--rule)" }}
        >
          <dt className="text-ink-muted">{r.label}</dt>
          <dd className="pr-1 text-right">{r.value}</dd>
        </div>
      ))}
    </dl>
  )
}
