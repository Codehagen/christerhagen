"use client"

import Link from "next/link"

import { useLanguage } from "@/components/language-provider"
import { buttonVariants } from "@/components/ui/button"
import { processContent } from "@/lib/content"

const label =
  "font-mono text-[12px] leading-none font-medium tracking-[0.1em] text-(--ink-fainter) uppercase"

export function ProcessContent() {
  const { lang } = useLanguage()
  const c = processContent[lang]

  return (
    <main className="mx-auto w-full max-w-[740px] flex-1 px-[28px]">
      <section className="pt-[84px] pb-[56px]">
        <div className={`${label} mb-6`}>{c.kicker}</div>
        <h1 className="m-0 max-w-[20ch] text-[34px] leading-[1.28] font-normal tracking-[0.004em] text-(--ink-strong)">
          {c.head}
        </h1>
        <p className="mt-5 max-w-[46ch] text-[18px] leading-[1.6] font-normal text-(--ink-muted)">
          {c.intro}
        </p>
      </section>

      <section className="mb-16">
        {c.steps.map((s) => (
          <div
            key={s.no}
            className="flex items-start gap-7 border-t border-border py-7"
          >
            <span className="w-[54px] flex-shrink-0 font-mono text-[13px] leading-[1.4] font-medium text-primary">
              {s.no}
            </span>
            <div className="flex-1">
              <div className="text-[23px] leading-[1.2] font-medium text-(--ink-strong)">
                {s.title}
              </div>
              <p className="mt-2.5 max-w-[52ch] text-[16.5px] leading-[1.6] font-normal text-[#4A4539]">
                {s.body}
              </p>
            </div>
          </div>
        ))}
      </section>

      <section className="mb-16 border-y border-border py-[30px]">
        <div className={`${label} mb-4`}>{c.lblLook}</div>
        <p className="m-0 max-w-[42ch] text-[20px] leading-[1.55] font-normal text-(--ink-body)">
          {c.lookBody}
        </p>
      </section>

      <section className="mb-20">
        <p className="mb-[22px] max-w-[28ch] text-[22px] leading-[1.4] font-normal text-(--ink-strong)">
          {c.ctaLine}
        </p>
        <Link
          href="/contact"
          className={buttonVariants({ variant: "pill", size: "pill" })}
        >
          {c.ctaBtn}
        </Link>
      </section>
    </main>
  )
}
