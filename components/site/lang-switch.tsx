"use client"

import { Link } from "next-view-transitions"
import { usePathname } from "next/navigation"

import type { Lang } from "@/lib/companies"
import { localizedPath } from "@/lib/seo"
import { cn } from "@/lib/utils"

/** The NO mirror of an EN path ("/" ↔ "/no", "/about" ↔ "/no/about"). */
export function enPathOf(pathname: string): string {
  if (pathname === "/no") return "/"
  if (pathname.startsWith("/no/")) return pathname.slice(3)
  return pathname
}

const LANGS: { id: Lang; label: string; name: string; hrefLang: string }[] = [
  { id: "en", label: "EN", name: "English", hrefLang: "en" },
  { id: "no", label: "NO", name: "Norsk", hrefLang: "nb-NO" },
]

/**
 * EN / NO as two quiet letters (DESIGN.md §4): 11px, 560, +0.02em, a `/` in
 * `--slash` between. The other language is `--ink-faint` and hovers to ink;
 * the current one is ink. Each is a real link to the same page in the other
 * language (`enPath` is the page's EN path; NO lives under /no). Without
 * `enPath` it is read from the URL.
 */
export function LangSwitch({
  lang,
  enPath,
  onNavigate,
  className,
}: {
  lang: Lang
  enPath?: string
  onNavigate?: () => void
  className?: string
}) {
  const pathname = usePathname()
  const path = enPath ?? enPathOf(pathname ?? "/")
  return (
    <span
      className={cn(
        "flex items-center gap-1 text-micro tracking-[var(--tracking-caps)]",
        className
      )}
    >
      {LANGS.map((l, i) => {
        const href = localizedPath(path, l.id)
        const on = lang === l.id
        return (
          <span key={l.id} className="flex items-center gap-1">
            {i > 0 ? (
              <span aria-hidden className="text-[var(--slash)]">
                /
              </span>
            ) : null}
            <Link
              href={href}
              hrefLang={l.hrefLang}
              lang={l.hrefLang}
              aria-label={l.name}
              aria-current={on ? "true" : undefined}
              onClick={onNavigate}
              data-on={on || undefined}
              className="lang-item hit press"
              style={{ "--hw": "30px" } as React.CSSProperties}
            >
              {l.label}
            </Link>
          </span>
        )
      })}
    </span>
  )
}
