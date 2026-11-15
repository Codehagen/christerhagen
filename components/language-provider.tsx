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

/**
 * The skip link, in the page's language. The root layout can't know the
 * locale, so, like `HtmlLang`, it reads it from the URL (NO routes live under
 * `/no`); `usePathname` is available while server rendering, so the right
 * words are in the HTML from the first byte. It targets each page's `#main`.
 */
export function SkipLink({ className }: { className?: string }) {
  const pathname = usePathname()
  const isNo = pathname === "/no" || pathname.startsWith("/no/")
  return (
    <a
      href="#main"
      lang={isNo ? "nb-NO" : "en"}
      className={className}
    >
      {isNo ? "Hopp til innhold" : "Skip to content"}
    </a>
  )
}
