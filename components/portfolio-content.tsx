import { Link } from "next-view-transitions"

import { type Lang } from "@/lib/companies"
import { localizedPath } from "@/lib/seo"
import { portfolioContent } from "@/lib/content"

const label =
  "font-mono text-[12px] leading-none font-medium tracking-[0.08em] text-(--ink-fainter) uppercase"
const rowLink =
  "flex items-baseline justify-between gap-6 border-b border-border text-(--ink-strong) transition-colors hover:text-(--rust-strong)"
const stagePill =
  "flex-shrink-0 rounded-full border border-primary/35 px-[9px] py-[6px] font-mono text-[9.5px] leading-none font-medium tracking-[0.07em] whitespace-nowrap text-primary uppercase"

export function PortfolioContent({ lang }: { lang: Lang }) {
  const c = portfolioContent[lang]

  return (
    <main id="main" className="mx-auto w-full max-w-[740px] flex-1 px-5 sm:px-7">
      <section className="pt-[84px] pb-[56px]">
        <h1 className={`${label} mb-[22px]`}>{c.kicker}</h1>
        <p className="m-0 max-w-[24ch] text-[clamp(22px,6.5vw,27px)] leading-[1.35] font-normal text-(--ink-strong)">
          {c.intro}
        </p>
      </section>

      {/* Building */}
      <section className="mb-16">
        <h2 className={`${label} mb-1.5`}>{c.gBuilt}</h2>
        {c.built.map((b) => (
          <Link key={b.slug} href={localizedPath(`/portfolio/${b.slug}`, lang)} className={`${rowLink} py-[18px]`}>
            <span className="flex flex-col gap-[5px]">
              <span className="text-[21px] leading-[1.15] font-medium">
                {b.name}
              </span>
              <span className="max-w-[50ch] text-[14px] leading-[1.5] font-normal text-(--ink-soft)">
                {b.desc}
              </span>
            </span>
            <span className="flex-shrink-0 font-mono text-[11.5px] leading-none font-normal whitespace-nowrap text-(--ink-meta)">
              {b.meta}
            </span>
          </Link>
        ))}
      </section>

      {/* Angel investments */}
      <section className="mb-16">
        <h2 className={`${label} mb-1.5`}>{c.gInvest}</h2>
        {c.invest.map((i) => (
          <Link key={i.slug} href={localizedPath(`/portfolio/${i.slug}`, lang)} className={`${rowLink} py-4`}>
            <span className="flex flex-col gap-1">
              <span className="text-[18px] leading-[1.2] font-medium">
                {i.name}
              </span>
              <span className="max-w-[50ch] text-[13.5px] leading-[1.45] font-normal text-(--ink-soft)">
                {i.desc}
              </span>
            </span>
            <span className="flex-shrink-0 font-mono text-[11px] leading-none font-normal tracking-[0.03em] whitespace-nowrap text-(--ink-meta)">
              {i.meta}
            </span>
          </Link>
        ))}
      </section>

      {/* Exits */}
      <section className="mb-20">
        <h2 className={`${label} mb-1.5`}>{c.gExits}</h2>
        {c.exits.map((x) => (
          <Link key={x.slug} href={localizedPath(`/portfolio/${x.slug}`, lang)} className={`${rowLink} py-4`}>
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
