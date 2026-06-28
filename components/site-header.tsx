"use client"

import Link from "next/link"

import { cn } from "@/lib/utils"
import { uiCopy, type Lang } from "@/lib/companies"
import { useLanguage } from "@/components/language-provider"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

type NavKey = "about" | "portfolio" | "writing" | "contact"

const navItem =
  "font-mono text-[12.5px] leading-none font-medium tracking-[0.02em] transition-colors hover:text-(--rust-strong)"

function NavLink({
  href,
  label,
  active,
}: {
  href: string
  label: string
  active: boolean
}) {
  return (
    <Link
      href={href}
      className={cn(navItem, active ? "text-foreground" : "text-(--ink-muted)")}
    >
      {label}
    </Link>
  )
}

export function SiteHeader({ active }: { active?: NavKey }) {
  const { lang, setLang } = useLanguage()
  const t = uiCopy[lang]

  return (
    <header className="sticky top-0 z-20 border-b border-border bg-background/85 backdrop-blur-[10px]">
      <div className="mx-auto flex max-w-[740px] items-center justify-between px-[28px] py-4">
        <Link
          href="/"
          className="text-[16px] leading-none font-medium tracking-[0.005em] text-foreground"
        >
          Christer Hagen
        </Link>

        <nav className="flex items-center gap-[18px]">
          <NavLink href="/about" label={t.navAbout} active={active === "about"} />
          <NavLink
            href="/portfolio"
            label={t.navPortfolio}
            active={active === "portfolio"}
          />
          <NavLink
            href="/writing"
            label={t.navWriting}
            active={active === "writing"}
          />
          <NavLink
            href="/contact"
            label={t.navContact}
            active={active === "contact"}
          />

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
            <ToggleGroupItem value="en" aria-label="English">
              EN
            </ToggleGroupItem>
            <span
              aria-hidden
              className="font-mono text-[12px] leading-none text-(--line-soft)"
            >
              /
            </span>
            <ToggleGroupItem value="no" aria-label="Norsk">
              NO
            </ToggleGroupItem>
          </ToggleGroup>
        </nav>
      </div>
    </header>
  )
}
