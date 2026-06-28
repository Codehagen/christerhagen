"use client"

import { useLanguage } from "@/components/language-provider"
import { contactContent, socialLinks, EMAIL } from "@/lib/content"

const label =
  "font-mono text-[12px] leading-none font-medium tracking-[0.1em] text-(--ink-fainter) uppercase"

export function ContactContent() {
  const { lang } = useLanguage()
  const c = contactContent[lang]
  const social = socialLinks(lang)

  return (
    <main className="mx-auto w-full max-w-[740px] flex-1 px-[28px]">
      <section className="pt-[88px] pb-[60px]">
        <div className={`${label} mb-6`}>{c.kicker}</div>
        <h1 className="m-0 max-w-[16ch] text-[40px] leading-[1.2] font-normal tracking-[0.004em] text-(--ink-strong)">
          {c.head}
        </h1>
        <p className="mt-5 max-w-[44ch] text-[18px] leading-[1.6] font-normal text-[#403B31]">
          {c.body}
        </p>

        <a
          href={`mailto:${EMAIL}`}
          className="mt-10 mb-2 inline-block border-b-2 border-primary/40 text-[30px] leading-[1.2] font-normal text-(--ink-strong) transition-colors hover:border-(--rust-strong) hover:text-(--rust-strong)"
        >
          {EMAIL}
        </a>
        <div className="mt-[14px] font-mono text-[12px] leading-none font-normal text-(--ink-fainter)">
          {c.availability}
        </div>

        <div className="mt-[30px] flex flex-wrap gap-[9px]">
          {social.map((s) => (
            <a
              key={s.label + s.handle}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-baseline gap-[7px] rounded-full border border-[#E0DACC] px-[14px] py-[9px] font-mono text-[12.5px] leading-none font-normal text-(--ink-muted) transition-colors hover:border-foreground hover:text-(--rust-strong)"
            >
              <span className="text-[9.5px] tracking-[0.06em] text-(--ink-fainter) uppercase">
                {s.label}
              </span>
              <span>{s.handle}</span>
            </a>
          ))}
        </div>
      </section>

      <section className="border-t border-border pt-11 pb-20">
        <div className={`${label} mb-[18px]`}>{c.lookHead}</div>
        <p className="m-0 max-w-[40ch] text-[20px] leading-[1.55] font-normal text-(--ink-body)">
          {c.lookBody}
        </p>
      </section>
    </main>
  )
}
