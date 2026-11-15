import { type Lang } from "@/lib/companies"
import { processContent } from "@/lib/content"
import { localizedPath } from "@/lib/seo"

import { Ledger } from "@/components/site/ledger"
import { TextLink } from "@/components/site/link"
import { Rule } from "@/components/site/rule"

/**
 * How I work: the wide column (no rail). The kicker and h1, the intro in
 * muted, the three steps as a quiet ledger (the step number where a ledger
 * keeps its year), what he looks for under a Rule, and one plain link on to
 * the contact page.
 */
export function ProcessContent({ lang }: { lang: Lang }) {
  const c = processContent[lang]

  return (
    <main
      id="main"
      className="px-[var(--page-pad-x)] pt-4 lg:ml-[var(--column-wide-left)] lg:w-[var(--column-wide)] lg:px-0 lg:pt-[46px]"
    >
      <p className="text-ink-muted">{c.kicker}</p>
      <h1 className="mt-[6px] text-title leading-[var(--leading-title)] font-[var(--weight-strong)] tracking-[var(--tracking-title)]">
        {c.head}
      </h1>
      <p className="mt-[10px] max-w-[var(--column)] text-ink-muted">
        {c.intro}
      </p>

      <Ledger
        className="mt-[26px]"
        label={c.kicker}
        columns="1fr"
        rows={c.steps.map((s) => ({
          id: s.no,
          year: s.no,
          cells: [
            <span key="s" className="block max-w-[var(--column)]">
              <span className="block font-[var(--weight-row)]">{s.title}</span>
              <span className="mt-0.5 block text-ink-muted">{s.body}</span>
            </span>,
          ],
        }))}
      />

      <section aria-labelledby="process-look">
        <Rule id="process-look">{c.lblLook}</Rule>
        <p className="max-w-[var(--column)]">{c.lookBody}</p>
      </section>

      <p className="mt-[var(--rule-top)] max-w-[var(--column)]">
        {c.ctaLine}{" "}
        <TextLink href={localizedPath("/contact", lang)}>{c.ctaBtn} →</TextLink>
      </p>
    </main>
  )
}
