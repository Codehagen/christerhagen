"use client"

import * as React from "react"
import { Link } from "next-view-transitions"

import type { Lang } from "@/lib/companies"
import { localizedPath } from "@/lib/seo"
import { cn } from "@/lib/utils"

import { LangSwitch } from "./lang-switch"
import { NAV_HREF, NAV_KEYS, currentOf, navLabel, type NavKey } from "./nav"
import { PenToggle, useReducedMotion } from "./pen"
import { TravelRing, useBox } from "./travel-ring"

const MENU_ID = "phone-menu"

/**
 * The phone menu (40/42, DESIGN.md §4): a 44px burger whose two lines turn
 * to an ×, and a panel on the ground from under the header row to the
 * bottom. The four pages (≈19px, 44px tall, hairlines between) at idle grey,
 * the current one in ink with the pen's loop; then EN / NO, and the
 * PenToggle when the page has a pen to hide. Tapping a page closes the menu
 * 120ms later; Esc closes it and returns focus to the button. The page
 * behind (`main`, `footer`, the rail) is inert while it is open.
 *
 * Rendered by SiteHeader below `md`; usable on its own.
 */
export function PhoneMenu({
  lang,
  enPath,
  active,
  penToggle = false,
  className,
}: {
  lang: Lang
  /** The current page's EN path (for EN / NO and aria-current). */
  enPath: string
  active?: NavKey
  penToggle?: boolean
  className?: string
}) {
  const reduced = useReducedMotion()
  const [open, setOpen] = React.useState(false)
  const button = React.useRef<HTMLButtonElement>(null)
  const list = React.useRef<HTMLUListElement>(null)
  const here = React.useRef<HTMLSpanElement>(null)
  const timer = React.useRef<number | undefined>(undefined)
  const box = useBox(list, here, `${active}-${lang}-${open}`)

  // A new page closes the menu.
  const [path, setPath] = React.useState(enPath)
  if (path !== enPath) {
    setPath(enPath)
    setOpen(false)
  }

  const close = React.useCallback((focus: boolean) => {
    setOpen(false)
    if (focus) button.current?.focus()
  }, [])

  React.useEffect(() => () => window.clearTimeout(timer.current), [])

  React.useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close(true)
    }
    // Growing past the phone layout closes it, so nothing stays inert.
    const mq = window.matchMedia("(min-width: 48rem)")
    const onMq = () => mq.matches && close(false)
    document.addEventListener("keydown", onKey)
    mq.addEventListener("change", onMq)

    const behind = Array.from(
      document.querySelectorAll<HTMLElement>("main, footer, [data-site-rail]")
    )
    behind.forEach((el) => el.setAttribute("inert", ""))
    const root = document.documentElement
    const overflow = root.style.overflow
    root.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", onKey)
      mq.removeEventListener("change", onMq)
      behind.forEach((el) => el.removeAttribute("inert"))
      root.style.overflow = overflow
    }
  }, [open, close])

  const t =
    lang === "en"
      ? { open: "Open menu", close: "Close menu", nav: "Main" }
      : { open: "Åpne meny", close: "Lukk meny", nav: "Hovedmeny" }

  return (
    <div className={cn("md:hidden", className)}>
      <button
        ref={button}
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? t.close : t.open}
        aria-expanded={open}
        aria-controls={MENU_ID}
        data-open={open || undefined}
        className="burger press -mr-3"
      >
        <span aria-hidden />
        <span aria-hidden />
      </button>

      <nav
        id={MENU_ID}
        aria-label={t.nav}
        data-open={open || undefined}
        inert={!open || undefined}
        className="phone-menu fixed inset-x-0 top-[var(--header-row)] bottom-0 overflow-y-auto bg-ground px-[var(--page-pad-x)] pt-2 pb-8"
      >
        <ul ref={list} className="relative">
          {NAV_KEYS.map((k, i) => {
            const on = active === k
            return (
              <li key={k} className={cn(i > 0 && "border-t border-hairline")}>
                <Link
                  href={localizedPath(NAV_HREF[k], lang)}
                  aria-current={on ? currentOf(enPath, k) : undefined}
                  data-on={on || undefined}
                  onClick={() => {
                    window.clearTimeout(timer.current)
                    timer.current = window.setTimeout(
                      () => setOpen(false),
                      reduced ? 0 : 120
                    )
                  }}
                  className="nav-item press flex min-h-11 w-full items-center text-[19px] tracking-[-0.01em]"
                >
                  <span ref={on ? here : undefined}>{navLabel(k, lang)}</span>
                </Link>
              </li>
            )
          })}
          {open && active ? (
            <TravelRing box={box} k={active} padX={0.45} padY={0.36} />
          ) : null}
        </ul>
        <div className="mt-2 flex min-h-11 items-center justify-between border-t border-hairline pt-1">
          <LangSwitch
            lang={lang}
            enPath={enPath}
            onNavigate={() => setOpen(false)}
          />
          {penToggle ? <PenToggle lang={lang} /> : null}
        </div>
      </nav>
    </div>
  )
}
