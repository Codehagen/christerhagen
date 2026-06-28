"use client"

import Link from "next/link"

import { useLanguage } from "@/components/language-provider"
import { portfolioContent } from "@/lib/content"

const label =
  "font-mono text-[12px] leading-none font-medium tracking-[0.1em] text-(--ink-fainter) uppercase"
const rowLink =
  "flex items-baseline justify-between gap-6 border-b border-border text-(--ink-strong) transition-colors hover:text-(--rust-strong)"
const stagePill =
  "flex-shrink-0 rounded-full border border-primary/35 px-[9px] py-[6px] font-mono text-[9.5px] leading-none font-medium tracking-[0.07em] whitespace-nowrap text-primary uppercase"

export function PortfolioContent() {
  const { lang } = useLanguage()
  const c = portfolioContent[lang]

  return (
    <main className="mx-auto w-full max-w-[740px] flex-1 px-[28px]">
      <section className="pt-[84px] pb-[56px]">
        <div className={`${label} mb-[22px]`}>{c.kicker}</div>
        <p className="m-0 max-w-[24ch] text-[27px] leading-[1.35] font-normal text-(--ink-strong)">
          {c.intro}
        </p>
      </section>

      {/* Building */}
      <section className="mb-16">
        <div className={`${label} mb-1.5`}>{c.gBuilt}</div>
        {c.built.map((b) => (
          <Link key={b.slug} href={`/portfolio/${b.slug}`} className={`${rowLink} py-[18px]`}>
            <span className="flex flex-col gap-[5px]">
              <span className="text-[21px] leading-[1.15] font-medium">
                {b.name}
              </span>
              <span className="max-w-[50ch] text-[14px] leading-[1.5] font-normal text-(--ink-soft)">
                {b.desc}
              </span>
            </span>
            <span className="flex-shrink-0 font-mono text-[11.5px] leading-none font-normal whitespace-nowrap text-[#B0A893]">
              {b.meta}
            </span>
          </Link>
        ))}
      </section>

      {/* Angel investments */}
      <section className="mb-16">
        <div className={`${label} mb-1.5`}>{c.gInvest}</div>
        {c.invest.map((i) => (
          <Link key={i.slug} href={`/portfolio/${i.slug}`} className={`${rowLink} py-4`}>
            <span className="flex flex-col gap-1">
              <span className="text-[18px] leading-[1.2] font-medium">
                {i.name}
              </span>
              <span className="max-w-[50ch] text-[13.5px] leading-[1.45] font-normal text-(--ink-soft)">
                {i.desc}
              </span>
            </span>
            <span className="flex-shrink-0 font-mono text-[11px] leading-none font-normal tracking-[0.03em] whitespace-nowrap text-[#B0A893]">
              {i.meta}
            </span>
          </Link>
        ))}
      </section>

      {/* Exits */}
      <section className="mb-20">
        <div className={`${label} mb-1.5`}>{c.gExits}</div>
        {c.exits.map((x) => (
          <Link key={x.slug} href={`/portfolio/${x.slug}`} className={`${rowLink} py-4`}>
            <span className="flex flex-col gap-1">
              <span className="text-[18px] leading-[1.2] font-medium">
                {x.name}
              </span>
              <span className="max-w-[50ch] text-[13.5px] leading-[1.45] font-normal text-(--ink-soft)">
                {x.desc}
              </span>
            </span>
            <span className={stagePill}>{x.stage}</span>
          </Link>
        ))}
      </section>
    </main>
  )
}
