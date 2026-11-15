import { uiCopy, type Lang } from "@/lib/companies"

export type NavKey = "about" | "portfolio" | "writing" | "contact"

export const NAV_KEYS: NavKey[] = ["about", "portfolio", "writing", "contact"]

export const NAV_HREF: Record<NavKey, string> = {
  about: "/about",
  portfolio: "/portfolio",
  writing: "/writing",
  contact: "/contact",
}

export function navLabel(key: NavKey, lang: Lang): string {
  const t = uiCopy[lang]
  return {
    about: t.navAbout,
    portfolio: t.navPortfolio,
    writing: t.navWriting,
    contact: t.navContact,
  }[key]
}

/** The section an EN path belongs to (a company page is under Portfolio). */
export function navKeyOf(enPath: string): NavKey | undefined {
  return NAV_KEYS.find(
    (k) => enPath === NAV_HREF[k] || enPath.startsWith(NAV_HREF[k] + "/")
  )
}

/** `page` on the section's own page, `true` on a page inside it. */
export function currentOf(enPath: string, key: NavKey): "page" | "true" {
  return enPath === NAV_HREF[key] ? "page" : "true"
}
