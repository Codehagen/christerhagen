"use client"

import * as React from "react"
import { Link } from "next-view-transitions"
import { usePathname } from "next/navigation"

import type { Lang } from "@/lib/companies"
import { localizedPath } from "@/lib/seo"
import { cn } from "@/lib/utils"

import { LangSwitch, enPathOf } from "@/components/site/lang-switch"
import {
  NAV_HREF,
  NAV_KEYS,
  currentOf,
  navKeyOf,
  navLabel,
  type NavKey,
} from "@/components/site/nav"
import { PhoneMenu } from "@/components/site/phone-menu"
import { TravelRing, useBox } from "@/components/site/travel-ring"

export type { NavKey }

/**
 * The header row (DESIGN.md §4 Header): 48px, sitting inside the top fade
 * with no background and no edge line. The name on the left links home; the
 * four pages and EN / NO on the right, 13px, 20px apart, at `--ink-idle`.
 * The current section is ink and the pen's loop rings it (it stays when the
 * pen is hidden). Home rings nothing; on a company page Portfolio stays
 * ringed with `aria-current="true"`, on a post Writing does.
 *
 * Below `md` the pages move into the PhoneMenu behind a 44px button.
 *
 * Props: `active` (defaults to the section of the current URL), `lang`, and
 * `penToggle` to put the PenToggle in the phone menu (posts).
 */
export function SiteHeader({
  active,
  lang,
  penToggle = false,
  className,
}: {
  active?: NavKey
  lang: Lang
  penToggle?: boolean
  className?: string
}) {
  const pathname = usePathname()
  const enPath = enPathOf(pathname ?? "/")
  const current = active ?? navKeyOf(enPath)

  const navRef = React.useRef<HTMLDivElement>(null)
  const here = React.useRef<HTMLSpanElement>(null)
  const box = useBox(navRef, here, `${current}-${lang}`)

  return (
    <header
      className={cn(
        "sticky top-0 z-10 flex h-[var(--header-row)] items-center justify-between px-[var(--page-pad-x)] text-ui tracking-[var(--tracking-ui)]",
        className
      )}
    >
      <Link
        href={localizedPath("/", lang)}
        aria-current={enPath === "/" ? "page" : undefined}
        className="hit press font-[560]"
      >
        Christer Hagen
      </Link>

      <div ref={navRef} className="relative hidden items-center gap-5 md:flex">
        <nav aria-label={lang === "en" ? "Main" : "Hovedmeny"}>
          <ul className="flex items-center gap-5">
            {NAV_KEYS.map((k) => {
              const on = current === k
              return (
                <li key={k}>
                  <Link
                    href={localizedPath(NAV_HREF[k], lang)}
                    aria-current={on ? currentOf(enPath, k) : undefined}
                    data-on={on || undefined}
                    className="nav-item hit press"
                  >
                    <span ref={on ? here : undefined}>{navLabel(k, lang)}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
        <LangSwitch lang={lang} enPath={enPath} className="ml-2" />
        {current ? <TravelRing box={box} k={current} /> : null}
      </div>

      <PhoneMenu
        lang={lang}
        enPath={enPath}
        active={current}
        penToggle={penToggle}
      />
    </header>
  )
}
