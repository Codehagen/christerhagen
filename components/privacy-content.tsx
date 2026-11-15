import { type Lang } from "@/lib/companies"
import { privacyContent } from "@/lib/content"

import { Rule } from "@/components/site/rule"

/**
 * Privacy: the wide column (no rail), prose held to the reading measure. The
 * kicker and h1, the intro, the date line in faint, then each section under
 * a Rule.
 */
export function PrivacyContent({ lang }: { lang: Lang }) {
  const c = privacyContent[lang]

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
      <p className="mt-[10px] text-small text-ink-faint tabular-nums">
        {c.updated}
      </p>

      {c.sections.map((s, n) => (
        <section key={s.head} aria-labelledby={`privacy-${n}`}>
          <Rule id={`privacy-${n}`}>{s.head}</Rule>
          <div className="flex max-w-[var(--column)] flex-col gap-[var(--para-gap)]">
            {s.body.map((para) => (
              <p key={para.slice(0, 24)}>{para}</p>
            ))}
          </div>
        </section>
      ))}
    </main>
  )
}
