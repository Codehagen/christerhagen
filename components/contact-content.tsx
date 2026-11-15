import { type Lang } from "@/lib/companies"
import { contactContent } from "@/lib/content"

import { CopyAddress } from "@/components/site/copy-address"
import { Rule } from "@/components/site/rule"

/**
 * The contact page: a plain column (no rail, so the wide column from 16%,
 * DESIGN.md §7.7) that leads with the address and its copy button (17), the
 * availability line under it, then what he looks for. The footer under it
 * keeps only its quiet line, so the address is not said twice.
 */
export function ContactContent({ lang }: { lang: Lang }) {
  const c = contactContent[lang]

  return (
    <main
      id="main"
      className="px-[var(--page-pad-x)] pt-4 lg:ml-[var(--column-wide-left)] lg:w-[var(--column-wide)] lg:px-0 lg:pt-[46px]"
    >
      <p className="text-ink-muted">{c.kicker}</p>
      <h1 className="mt-[6px] text-title leading-[var(--leading-title)] font-[var(--weight-strong)] tracking-[var(--tracking-title)]">
        {c.head}
      </h1>
      <p className="mt-[10px] max-w-[var(--column)] text-ink-muted">{c.body}</p>

      <CopyAddress lang={lang} note={c.availability} className="mt-[26px]" />

      <section aria-labelledby="contact-look">
        <Rule id="contact-look">{c.lookHead}</Rule>
        <p className="max-w-[var(--column)]">{c.lookBody}</p>
      </section>
    </main>
  )
}
