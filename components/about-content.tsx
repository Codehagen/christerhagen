import Link from "next/link"
import Image from "next/image"

import { cn } from "@/lib/utils"
import { type Lang } from "@/lib/companies"
import { localizedPath } from "@/lib/seo"
import { buttonVariants } from "@/components/ui/button"
import { aboutContent } from "@/lib/content"
import { faqItems } from "@/lib/faq"

const label =
  "font-mono text-[12px] leading-none font-medium tracking-[0.1em] text-(--ink-fainter) uppercase"

export function AboutContent({ lang }: { lang: Lang }) {
  const c = aboutContent[lang]

  return (
    <main id="main" className="mx-auto w-full max-w-[740px] flex-1 px-5 sm:px-7">
      <section className="pt-[84px] pb-[56px]">
        <div className={`${label} mb-6`}>{c.kicker}</div>
        <h1 className="m-0 max-w-[22ch] text-[clamp(27px,8vw,34px)] leading-[1.28] font-normal tracking-[0.004em] text-(--ink-strong)">
          {c.head}
        </h1>
      </section>

      <section className="mb-16 flex flex-col gap-8 sm:flex-row sm:items-start sm:gap-10">
        <div className="relative aspect-[280/360] w-full max-w-[280px] flex-shrink-0 overflow-hidden rounded-[3px] bg-(--paper-placeholder) sm:w-[280px]">
          <Image
            src="/images/christer-hagen-working.jpg"
            alt="Christer Hagen"
            fill
            sizes="280px"
            priority
            className="object-cover [object-position:center_18%]"
          />
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-5">
          {c.bio.map((para, i) => (
            <p
              key={i}
              className="m-0 text-[17px] leading-[1.66] font-normal text-(--ink-body)"
            >
              {para}
            </p>
          ))}
        </div>
      </section>

      <section className="mb-16">
        <h2 className={`${label} mb-1.5`}>{c.lblBackground}</h2>
        {c.timeline.map((t) => (
          <div
            key={t.year}
            className="flex items-baseline gap-7 border-b border-border py-[14px]"
          >
            <span className="w-[54px] flex-shrink-0 font-mono text-[13px] leading-none font-medium text-primary">
              {t.year}
            </span>
            <span className="text-[17px] leading-[1.4] font-normal text-(--ink-body)">
              {t.event}
            </span>
          </div>
        ))}
      </section>

      <section className="mb-20 border-t border-border pt-[30px]">
        <p className="mb-[22px] max-w-[34ch] text-[20px] leading-[1.5] font-normal text-(--ink-strong)">
          {c.ctaLine}
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href={localizedPath("/portfolio", lang)}
            className={cn(
              buttonVariants({ variant: "pill", size: "pill" }),
              "px-5 py-[13px] text-[12.5px]"
            )}
          >
            {c.ctaPortfolio}
          </Link>
          <Link
            href={localizedPath("/process", lang)}
            className={cn(
              buttonVariants({ variant: "pill-outline", size: "pill" }),
              "px-5 py-[13px] text-[12.5px]"
            )}
          >
            {c.ctaProcess}
          </Link>
        </div>
      </section>

      <section className="mb-24 border-t border-border pt-[30px]">
        <h2 className={`${label} mb-6`}>
          {lang === "no" ? "Vanlige spørsmål" : "Common questions"}
        </h2>
        <div className="flex flex-col">
          {faqItems[lang].map((item) => (
            <div
              key={item.q}
              className="flex flex-col gap-2 border-b border-border py-[18px] first:pt-0"
            >
              <h3 className="m-0 text-[18px] leading-[1.4] font-normal text-(--ink-strong)">
                {item.q}
              </h3>
              <p className="m-0 max-w-[58ch] text-[17px] leading-[1.66] font-normal text-(--ink-body)">
                {item.a}
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
