"use client"

import Link from "next/link"

import { cn } from "@/lib/utils"
import { useLanguage } from "@/components/language-provider"
import { buttonVariants } from "@/components/ui/button"
import { aboutContent } from "@/lib/content"

const label =
  "font-mono text-[12px] leading-none font-medium tracking-[0.1em] text-(--ink-fainter) uppercase"

export function AboutContent() {
  const { lang } = useLanguage()
  const c = aboutContent[lang]

  return (
    <main className="mx-auto w-full max-w-[740px] flex-1 px-[28px]">
      <section className="pt-[84px] pb-[56px]">
        <div className={`${label} mb-6`}>{c.kicker}</div>
        <h1 className="m-0 max-w-[22ch] text-[34px] leading-[1.28] font-normal tracking-[0.004em] text-(--ink-strong)">
          {c.head}
        </h1>
      </section>

      <section className="mb-16 flex flex-wrap items-start gap-10">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/portrait-placeholder.svg"
          alt="Christer Hagen"
          className="h-[360px] w-[280px] flex-shrink-0 rounded-[3px] bg-[#E8E2D5] object-cover [object-position:center_18%]"
        />
        <div className="flex min-w-[280px] flex-1 flex-col gap-5">
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
        <div className={`${label} mb-1.5`}>{c.lblBackground}</div>
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
            href="/portfolio"
            className={cn(
              buttonVariants({ variant: "pill", size: "pill" }),
              "px-5 py-[13px] text-[12.5px]"
            )}
          >
            {c.ctaPortfolio}
          </Link>
          <Link
            href="/process"
            className={cn(
              buttonVariants({ variant: "pill-outline", size: "pill" }),
              "px-5 py-[13px] text-[12.5px]"
            )}
          >
            {c.ctaProcess}
          </Link>
        </div>
      </section>
    </main>
  )
}
