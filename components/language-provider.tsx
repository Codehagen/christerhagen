"use client"

import * as React from "react"
import { usePathname } from "next/navigation"

/** Kept as a passthrough so the app root can own future language wiring. */
export function LanguageProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

/**
 * Keeps the document-level `lang` attribute in sync with the active locale,
 * derived from the URL (NO routes live under `/no`). The root layout renders a
 * single `<html lang="en">`; this corrects it to `nb-NO` on Norwegian routes
 * for assistive tech and language-aware crawlers. Renders nothing.
 */
export function HtmlLang() {
  const pathname = usePathname()
  React.useEffect(() => {
    const isNo = pathname === "/no" || pathname.startsWith("/no/")
    document.documentElement.lang = isNo ? "nb-NO" : "en"
  }, [pathname])
  return null
}
