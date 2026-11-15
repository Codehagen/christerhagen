import { cn } from "@/lib/utils"

import { Rule } from "./rule"

export type WorkRow = {
  /** The company, at 520. */
  name: string
  /** What it is, in `--ink-faint`. */
  what?: string
  /** "since 2017", "2019–2026": right-aligned, muted, tabular. */
  period: string
}

/**
 * The home page's work (DESIGN.md §4 now-before, 10/33): the companies he
 * works on now, then a `Before` rule with the sunset ones. On a phone the
 * rows wrap and the years stay tabular.
 *
 *   <NowBefore now={now} before={before} beforeLabel={lang === "en" ? "Before" : "Før"} />
 */
export function NowBefore({
  now,
  before,
  beforeLabel,
  className,
}: {
  now: WorkRow[]
  before?: WorkRow[]
  beforeLabel: string
  className?: string
}) {
  return (
    <div className={className}>
      <WorkList rows={now} />
      {before && before.length ? (
        <>
          <Rule as="h3" top={22}>
            {beforeLabel}
          </Rule>
          <WorkList rows={before} />
        </>
      ) : null}
    </div>
  )
}

function WorkList({ rows }: { rows: WorkRow[] }) {
  return (
    <ul>
      {rows.map((r, i) => (
        <li
          key={r.name}
          className={cn(
            "flex flex-wrap items-baseline justify-between gap-x-3 py-[5px]",
            i > 0 && "border-t border-hairline"
          )}
        >
          <span className="min-w-0">
            <span className="font-[var(--weight-row)]">{r.name}</span>
            {r.what ? <span className="text-ink-faint"> {r.what}</span> : null}
          </span>
          <span className="shrink-0 text-ink-muted tabular-nums">
            {r.period}
          </span>
        </li>
      ))}
    </ul>
  )
}
