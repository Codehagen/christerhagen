import { type Lang } from "@/lib/companies"
import { localizedPath } from "@/lib/seo"

import { TextLink } from "@/components/site/link"
import { Rule } from "@/components/site/rule"

const copy = {
  en: {
    head: "Where to look next",
    home: "Home",
    about: "About",
    portfolio: "Portfolio",
    writing: "Writing",
    contact: "Contact",
    sitemap: "Sitemap",
    guide: "Site guide for agents",
  },
  no: {
    head: "Hvor du bør se videre",
    home: "Forsiden",
    about: "Om",
    portfolio: "Portefølje",
    writing: "Tekster",
    contact: "Kontakt",
    sitemap: "Sitemap",
    guide: "Sideguide for agenter",
  },
}

/**
 * The recovery block on the 404 screens. A dead end should still tell you,
 * and any agent that followed a broken link, where the live pages are: the
 * difference between a 404 that merely returns the right status and one
 * something can actually recover from. A Rule, then colourless links.
 */
export function RecoveryLinks({ lang }: { lang: Lang }) {
  const t = copy[lang]
  const links: [string, string][] = [
    [localizedPath("/", lang), t.home],
    [localizedPath("/about", lang), t.about],
    [localizedPath("/portfolio", lang), t.portfolio],
    [localizedPath("/writing", lang), t.writing],
    [localizedPath("/contact", lang), t.contact],
  ]

  return (
    <nav aria-labelledby="recovery-head">
      <Rule id="recovery-head">{t.head}</Rule>
      <ul className="flex flex-wrap gap-x-5 gap-y-1">
        {links.map(([href, label]) => (
          <li key={href} className="flex min-h-11 items-center">
            <TextLink href={href}>{label}</TextLink>
          </li>
        ))}
        <li className="flex min-h-11 items-center">
          <a href="/sitemap.xml" className="ink-link">
            {t.sitemap}
          </a>
        </li>
        <li className="flex min-h-11 items-center">
          <a href="/llms.txt" className="ink-link">
            {t.guide}
          </a>
        </li>
      </ul>
    </nav>
  )
}
