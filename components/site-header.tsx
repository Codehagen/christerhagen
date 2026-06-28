"use client"

import * as React from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { uiCopy, type Lang } from "@/lib/companies"
import { useLanguage } from "@/components/language-provider"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

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

function LangToggle() {
  const { lang, setLang } = useLanguage()
  return (
    <ToggleGroup
      variant="plain"
      size="none"
      value={[lang]}
      onValueChange={(value: string[]) => {
        const next = value[0]
        if (next === "en" || next === "no") {
          setLang(next as Lang)
        }
      }}
      className="gap-[7px]"
      aria-label="Language"
    >
      <ToggleGroupItem
        value="en"
        aria-label="English"
        className="relative px-1 py-3 before:absolute before:inset-0 before:-my-1 before:content-['']"
      >
        EN
      </ToggleGroupItem>
      <span
        aria-hidden
        className="font-mono text-[12px] leading-none text-(--line-soft)"
      >
        /
      </span>
      <ToggleGroupItem
        value="no"
        aria-label="Norsk"
        className="relative px-1 py-3 before:absolute before:inset-0 before:-my-1 before:content-['']"
      >
        NO
      </ToggleGroupItem>
    </ToggleGroup>
  )
}

export function SiteHeader({
  active,
  showCta,
}: {
  active?: NavKey
  /** Show the "Get in touch" pill (home page only — links to #contact). */
  showCta?: boolean
}) {
  const { lang } = useLanguage()
  const t = uiCopy[lang]
  const [open, setOpen] = React.useState(false)
  const links = navLinks(t)

  return (
    <header className="sticky top-0 z-20 border-b border-border bg-background/85 backdrop-blur-[10px]">
      <div className="mx-auto flex max-w-[740px] items-center justify-between px-5 py-4 sm:px-7">
        <Link
          href="/"
          className="text-[16px] leading-none font-medium tracking-[0.005em] text-foreground"
        >
          Christer Hagen
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-[18px] md:flex">
          {links.map((l) => (
            <Link
              key={l.key}
              href={l.href}
              className={cn(
                navItem,
                active === l.key ? "text-foreground" : "text-(--ink-muted)"
              )}
            >
              {l.label}
            </Link>
          ))}
          <LangToggle />
          {showCta ? (
            <a
              href="#contact"
              className="rounded-full border border-(--line-strong) px-[15px] py-2.5 font-mono text-[12px] leading-none font-medium tracking-[0.02em] text-foreground transition-colors hover:border-foreground"
            >
              {t.getInTouch}
            </a>
          ) : null}
        </nav>

        {/* Mobile controls */}
        <div className="flex items-center gap-1 md:hidden">
          <LangToggle />
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            className="-mr-2 inline-flex size-11 items-center justify-center rounded-md text-foreground focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open ? (
        <nav id="mobile-menu" className="border-t border-border md:hidden">
          <div className="mx-auto flex max-w-[740px] flex-col px-5 pt-1 pb-3 sm:px-7">
            {links.map((l) => (
              <Link
                key={l.key}
                href={l.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex min-h-12 items-center font-mono text-[14px] tracking-[0.02em] transition-colors hover:text-(--rust-strong)",
                  active === l.key ? "text-foreground" : "text-(--ink-muted)"
                )}
              >
                {l.label}
              </Link>
            ))}
            {showCta ? (
              <a
                href="#contact"
                onClick={() => setOpen(false)}
                className="mt-2 inline-flex min-h-12 w-fit items-center rounded-full border border-(--line-strong) px-[18px] font-mono text-[13px] tracking-[0.02em] text-foreground transition-colors hover:border-foreground"
              >
                {t.getInTouch}
              </a>
            ) : null}
          </div>
        </nav>
      ) : null}
    </header>
  )
}
