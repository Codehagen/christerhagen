"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { uiCopy, type Lang } from "@/lib/companies"
import { localizedPath } from "@/lib/seo"

type NavKey = "about" | "portfolio" | "writing" | "contact"

const navItem =
  "relative inline-flex items-center font-mono text-[12.5px] leading-none font-medium tracking-[0.02em] transition-colors before:absolute before:-inset-x-1 before:-inset-y-4 before:content-[''] hover:text-(--rust-strong)"

function navLinks(t: (typeof uiCopy)["en"]) {
  return [
    { key: "about" as const, href: "/about", label: t.navAbout },
    { key: "portfolio" as const, href: "/portfolio", label: t.navPortfolio },
    { key: "writing" as const, href: "/writing", label: t.navWriting },
    { key: "contact" as const, href: "/contact", label: t.navContact },
  ]
}

/** Strip a leading "/no" locale segment to get the EN-equivalent path. */
function enPathOf(pathname: string): string {
  if (pathname === "/no") return "/"
  if (pathname.startsWith("/no/")) return pathname.slice(3)
  return pathname
}

/** Derive the active nav key from the EN-equivalent pathname. */
function activeFromPath(enPath: string): NavKey | undefined {
  if (enPath === "/about") return "about"
  if (enPath.startsWith("/portfolio")) return "portfolio"
  if (enPath.startsWith("/writing")) return "writing"
  if (enPath === "/contact") return "contact"
  return undefined
}

const localeLink =
  "relative px-1 py-3 font-mono text-[12px] leading-none tracking-[0.04em] transition-colors before:absolute before:inset-0 before:-my-1 before:content-['']"

/**
 * EN / NO switch — two reciprocal <Link>s pointing at the mirrored-locale URL
 * of the current page (computed from the pathname), replacing the old client
 * language store. The active locale is rendered in ink, the other muted.
 */
function LocaleLinks({
  lang,
  enPath,
  onNavigate,
}: {
  lang: Lang
  enPath: string
  onNavigate?: () => void
}) {
  const enHref = enPath
  const noHref = enPath === "/" ? "/no" : "/no" + enPath
  return (
    <div className="inline-flex items-center gap-[7px]" aria-label="Language">
      <Link
        href={enHref}
        hrefLang="en"
        aria-label="English"
        aria-current={lang === "en" ? "page" : undefined}
        onClick={onNavigate}
        className={cn(
          localeLink,
          lang === "en"
            ? "text-foreground"
            : "text-(--ink-fainter) hover:text-foreground"
        )}
      >
        EN
      </Link>
      <span
        aria-hidden
        className="font-mono text-[12px] leading-none text-(--line-soft)"
      >
        /
      </span>
      <Link
        href={noHref}
        hrefLang="nb-NO"
        aria-label="Norsk"
        aria-current={lang === "no" ? "page" : undefined}
        onClick={onNavigate}
        className={cn(
          localeLink,
          lang === "no"
            ? "text-foreground"
            : "text-(--ink-fainter) hover:text-foreground"
        )}
      >
        NO
      </Link>
    </div>
  )
}

const ctaDesktop =
  "rounded-full border border-(--line-strong) px-[15px] py-2.5 font-mono text-[12px] leading-none font-medium tracking-[0.02em] text-foreground transition-[color,border-color,transform] duration-150 ease-out hover:border-foreground active:scale-[0.97]"

const ctaMobile =
  "mt-2 inline-flex min-h-12 w-fit items-center rounded-full border border-(--line-strong) px-[18px] font-mono text-[13px] tracking-[0.02em] text-foreground transition-[color,border-color,transform] duration-150 ease-out hover:border-foreground active:scale-[0.98]"

/**
 * "Get in touch" pill — present on every page so the header layout never shifts
 * between routes. On the home page it scrolls to the in-page #contact section;
 * elsewhere it links to the dedicated /contact page.
 */
function GetInTouch({
  isHome,
  lang,
  label,
  className,
  onNavigate,
}: {
  isHome: boolean
  lang: Lang
  label: string
  className: string
  onNavigate?: () => void
}) {
  if (isHome) {
    return (
      <a href="#contact" onClick={onNavigate} className={className}>
        {label}
      </a>
    )
  }
  return (
    <Link
      href={localizedPath("/contact", lang)}
      onClick={onNavigate}
      className={className}
    >
      {label}
    </Link>
  )
}

export function SiteHeader({
  active,
  lang,
}: {
  active?: NavKey
  lang: Lang
}) {
  const t = uiCopy[lang]
  const pathname = usePathname()
  const enPath = enPathOf(pathname ?? "/")
  const isHome = enPath === "/"
  const activeKey = active ?? activeFromPath(enPath)
  const [open, setOpen] = React.useState(false)
  const triggerRef = React.useRef<HTMLButtonElement>(null)
  const links = navLinks(t)

  // Esc closes the mobile menu and returns focus to its trigger.
  React.useEffect(() => {
    if (!open) return
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false)
        triggerRef.current?.focus()
      }
    }
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [open])

  return (
    <header className="sticky top-0 z-20 border-b border-border bg-background/85 backdrop-blur-[10px]">
      <div className="mx-auto flex max-w-[740px] items-center justify-between px-5 py-4 sm:px-7">
        <Link
          href={localizedPath("/", lang)}
          className="text-[16px] leading-none font-medium tracking-[0.005em] text-foreground"
        >
          Christer Hagen
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-[18px] md:flex">
          {links.map((l) => (
            <Link
              key={l.key}
              href={localizedPath(l.href, lang)}
              aria-current={activeKey === l.key ? "page" : undefined}
              className={cn(
                navItem,
                activeKey === l.key ? "text-foreground" : "text-(--ink-muted)"
              )}
            >
              {l.label}
            </Link>
          ))}
          <LocaleLinks lang={lang} enPath={enPath} />
          <GetInTouch
            isHome={isHome}
            lang={lang}
            label={t.getInTouch}
            className={ctaDesktop}
          />
        </nav>

        {/* Mobile controls */}
        <div className="flex items-center gap-1 md:hidden">
          <button
            ref={triggerRef}
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            className="-mr-2 inline-flex size-11 items-center justify-center rounded-md text-foreground transition-transform duration-150 ease-out active:scale-90 focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open ? (
        <nav
          id="mobile-menu"
          className="border-t border-border duration-200 ease-out animate-in fade-in-0 slide-in-from-top-1 md:hidden"
        >
          <div className="mx-auto flex max-w-[740px] flex-col px-5 pt-1 pb-3 sm:px-7">
            {links.map((l) => (
              <Link
                key={l.key}
                href={localizedPath(l.href, lang)}
                onClick={() => setOpen(false)}
                aria-current={activeKey === l.key ? "page" : undefined}
                className={cn(
                  "flex min-h-12 items-center font-mono text-[14px] tracking-[0.02em] transition-colors hover:text-(--rust-strong)",
                  activeKey === l.key ? "text-foreground" : "text-(--ink-muted)"
                )}
              >
                {l.label}
              </Link>
            ))}
            <GetInTouch
              isHome={isHome}
              lang={lang}
              label={t.getInTouch}
              className={ctaMobile}
              onNavigate={() => setOpen(false)}
            />
            <div className="mt-1 flex min-h-12 items-center border-t border-border pt-2">
              <LocaleLinks
                lang={lang}
                enPath={enPath}
                onNavigate={() => setOpen(false)}
              />
            </div>
          </div>
        </nav>
      ) : null}
    </header>
  )
}
