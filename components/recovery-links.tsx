import { Link } from "next-view-transitions"

import { type Lang } from "@/lib/companies"
import { localizedPath } from "@/lib/seo"
import { eyebrow } from "@/lib/typography"

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

const item =
  "relative inline-flex items-center transition-colors before:absolute before:-inset-x-1.5 before:-inset-y-2.5 before:content-[''] hover:text-(--rust-strong)"

/**
 * The recovery block on the 404 screens. A dead end should still tell you —
 * and any agent that followed a broken link — where the live pages are, which
 * is the difference between a 404 that merely returns the right status and one
 * something can actually recover from.
 */
export function RecoveryLinks({ lang }: { lang: Lang }) {
  const t = copy[lang]

  return (
    <nav
      aria-label={t.head}
      className="enter enter-delay mt-12 w-full border-t border-border pt-5"
    >
      <h2 className={`${eyebrow} mb-3`}>{t.head}</h2>
      <div className="flex flex-wrap gap-x-5 gap-y-2 font-mono text-[0.71875rem] leading-[1.5] font-normal text-(--ink-fainter)">
        <Link href={localizedPath("/", lang)} className={item}>
          {t.home}
        </Link>
        <Link href={localizedPath("/about", lang)} className={item}>
          {t.about}
        </Link>
        <Link href={localizedPath("/portfolio", lang)} className={item}>
          {t.portfolio}
        </Link>
        <Link href={localizedPath("/writing", lang)} className={item}>
          {t.writing}
        </Link>
        <Link href={localizedPath("/contact", lang)} className={item}>
          {t.contact}
        </Link>
        <a href="/sitemap.xml" className={item}>
          {t.sitemap}
        </a>
        <a href="/llms.txt" className={item}>
          {t.guide}
        </a>
      </div>
    </nav>
  )
}
