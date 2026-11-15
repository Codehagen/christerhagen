import { type Lang } from "@/lib/companies"
import { WRITING_PEN } from "@/lib/pen/posts"
import { posts, postOrder, writingCopy } from "@/lib/posts"
import { localizedPath } from "@/lib/seo"

import { Ledger, LedgerTitle } from "@/components/site/ledger"
import { Highlight } from "@/components/site/pen"
import { Rail } from "@/components/site/rail"
import { Rule } from "@/components/site/rule"

const COPY: Record<
  Lang,
  { rail: string; index: string; total: (n: number, m: number) => string }
> = {
  en: {
    rail: "On this page",
    index: "Index",
    total: (n, m) => `${n} posts · ${m} min`,
  },
  no: {
    rail: "På denne siden",
    index: "Forside",
    total: (n, m) => `${n} tekster · ${m} min`,
  },
}

const ddmm = (iso: string) => `${iso.slice(8, 10)}/${iso.slice(5, 7)}`

/**
 * The writing index (49; DESIGN.md §5 Writing index).
 *
 * The rail runs down the years under `↩ Index`. The kicker, then the intro
 * as the h1. Each year is a Rule and the `writing` ledger: a title and its
 * arrow (the only thing that moves), a 12px excerpt, read time and dd/mm.
 * The newest title sits under the pen's wash with one note beside it. A
 * totals line closes the list.
 *
 * Put it inside `<PenProvider color="rust">`, header and footer included.
 */
export function WritingContent({ lang }: { lang: Lang }) {
  const t = writingCopy[lang]
  const c = COPY[lang]

  const rows = [...postOrder]
    .map((slug) => ({ slug, ...posts[lang][slug] }))
    .sort((a, b) => b.dateISO.localeCompare(a.dateISO))
  const years = [...new Set(rows.map((r) => r.dateISO.slice(0, 4)))]
  const minutes = rows.reduce((n, r) => n + parseInt(r.read, 10), 0)
  const newest = rows[0]?.slug

  return (
    <main
      id="main"
      className="flex-1 px-[var(--page-pad-x)] lg:px-0 [&>nav[data-site-rail]]:-mx-[var(--page-pad-x)] [&>nav[data-site-rail]]:px-[var(--page-pad-x)]"
    >
      <Rail
        label={c.rail}
        back={{ href: localizedPath("/", lang), label: c.index }}
        items={years.map((y) => ({ id: `y${y}`, label: y }))}
      />

      <div
        data-pen-column
        className="pt-[46px] lg:ml-[var(--column-left)] lg:w-[var(--column)]"
      >
        <p className="text-ink-muted">{t.kicker}</p>
        <h1 className="mt-1.5 text-title leading-[var(--leading-title)] font-[560] tracking-[var(--tracking-title)] text-balance">
          {t.intro}
        </h1>

        {years.map((y, yi) => (
          <section key={y} id={`y${y}`}>
            <Rule top={yi === 0 ? 35 : 26}>{y}</Rule>
            {/* 49: the rows hang under the Rule's own hairline, without
                lines of their own, and only the arrow answers the pointer. */}
            <Ledger
              columns="1fr auto"
              className="[&_.ledger-item]:border-t-0 [&_.ledger-row]:gap-x-4 [&_.ledger-row]:pt-1 [&_.ledger-row]:pb-[6px] [&_.ledger-row:hover]:bg-transparent"
              rows={rows
                .filter((r) => r.dateISO.startsWith(y))
                .map((r) => ({
                  id: r.slug,
                  href: localizedPath(`/writing/${r.slug}`, lang),
                  align: { 1: "right" },
                  cells: [
                    <LedgerTitle key="t" excerpt={r.excerpt}>
                      {r.slug === newest ? (
                        <Highlight
                          variant="title"
                          note={WRITING_PEN[lang].note}
                          noteVariant="settle"
                        >
                          {r.title}
                        </Highlight>
                      ) : (
                        r.title
                      )}
                    </LedgerTitle>,
                    <span key="m" className="whitespace-nowrap text-ink-faint">
                      {r.read} · {ddmm(r.dateISO)}
                    </span>,
                  ],
                }))}
            />
          </section>
        ))}

        <p className="mt-5 border-t border-rule pt-2 text-small leading-[var(--leading-meta)] text-ink-faint tabular-nums">
          {c.total(rows.length, minutes)}
        </p>
      </div>
    </main>
  )
}
