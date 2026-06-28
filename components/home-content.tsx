"use client"

import Link from "next/link"

import { useLanguage } from "@/components/language-provider"
import { buttonVariants } from "@/components/ui/button"
import { homeContent, socialLinks, EMAIL } from "@/lib/content"

const label =
  "font-mono text-[12px] leading-none font-medium tracking-[0.1em] text-(--ink-fainter) uppercase"
const rowLink =
  "flex items-baseline justify-between gap-6 border-b border-border text-(--ink-strong) transition-colors hover:text-(--rust-strong)"

export function HomeContent() {
  const { lang } = useLanguage()
  const c = homeContent[lang]
  const social = socialLinks(lang)

  return (
    <main id="top" className="mx-auto w-full max-w-[740px] px-[28px] pb-10">
      {/* Hero */}
      <section className="pt-[88px] pb-[70px]">
        <h1 className="m-0 max-w-[20ch] text-[33px] leading-[1.3] font-normal tracking-[0.004em] text-(--ink-strong)">
          {c.heroHead}
        </h1>
        <p className="mt-5 max-w-[46ch] text-[18px] leading-[1.62] font-normal text-(--ink-muted)">
          {c.heroSub}
        </p>
      </section>

      {/* About */}
      <section className="mb-[72px]">
        <div className={`${label} mb-6`}>{c.lblAbout}</div>
        <div className="flex items-start gap-[34px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/christer-hagen-portrait.jpg"
            alt="Christer Hagen"
            className="h-[300px] w-[236px] flex-shrink-0 rounded-[3px] bg-[#E8E2D5] object-cover [object-position:center_22%]"
          />
          <div className="flex-1">
            <div className="text-[20px] leading-[1.2] font-medium text-(--ink-strong)">
              Christer Hagen
            </div>
            <div className="mt-[7px] font-mono text-[12.5px] leading-[1.4] font-normal text-(--ink-faint)">
              {c.aboutRole}
            </div>
            <p className="mt-[18px] text-[16.5px] leading-[1.62] font-normal text-[#403B31]">
              {c.aboutBody}
            </p>
          </div>
        </div>
      </section>

      {/* Now */}
      <section className="mb-[72px]">
        <div className={`${label} mb-[22px]`}>{c.lblNow}</div>
        <ul className="m-0 flex list-none flex-col gap-[13px] p-0">
          {c.now.map((item, i) => (
            <li
              key={i}
              className="flex gap-[14px] text-[17px] leading-[1.5] font-normal text-[#403B31]"
            >
              <span className="flex-shrink-0 font-mono text-[14px] leading-[1.6] text-(--rust-bright)">
                →
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Work */}
      <section className="mb-[72px]">
        <div className={`${label} mb-1.5`}>{c.lblWork}</div>
        {c.work.map((w) => (
          <a
            key={w.name}
            href={w.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`${rowLink} py-4`}
          >
            <span className="flex flex-col gap-1">
              <span className="text-[20px] leading-[1.15] font-medium">
                {w.name}
              </span>
              <span className="font-mono text-[12px] leading-[1.4] font-normal text-(--ink-faint)">
                {w.role}
              </span>
            </span>
            <span className="flex-shrink-0 font-mono text-[11.5px] leading-none font-normal whitespace-nowrap text-[#B0A893]">
              {w.period}
            </span>
          </a>
        ))}
      </section>

      {/* Investments */}
      <section className="mb-[72px]">
        <div className={`${label} mb-1.5`}>{c.lblInvest}</div>
        {c.investments.map((i) => (
          <a
            key={i.name}
            href={i.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`${rowLink} gap-[22px] py-[15px]`}
          >
            <span className="flex flex-col gap-1">
              <span className="text-[18px] leading-[1.2] font-medium">
                {i.name}
              </span>
              <span className="max-w-[48ch] text-[13.5px] leading-[1.45] font-normal text-(--ink-soft)">
                {i.desc}
              </span>
            </span>
            <span className="flex-shrink-0 font-mono text-[13px] leading-none font-normal text-[#C2BBA8]">
              ↗
            </span>
          </a>
        ))}
      </section>

      {/* Exits */}
      <section className="mb-[72px]">
        <div className={`${label} mb-1.5`}>{c.lblExits}</div>
        {c.exits.map((x) => (
          <a
            key={x.name}
            href={x.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`${rowLink} gap-[22px] py-[15px]`}
          >
            <span className="flex flex-col gap-1">
              <span className="text-[18px] leading-[1.2] font-medium">
                {x.name}
              </span>
              <span className="max-w-[48ch] text-[13.5px] leading-[1.45] font-normal text-(--ink-soft)">
                {x.desc}
              </span>
            </span>
            <span className="flex-shrink-0 rounded-full border border-primary/35 px-[9px] py-[6px] font-mono text-[9.5px] leading-none font-medium tracking-[0.07em] whitespace-nowrap text-primary uppercase">
              {x.stage}
            </span>
          </a>
        ))}
      </section>

      {/* Open source */}
      <section className="mb-[72px]">
        <div className={`${label} mb-1.5`}>{c.lblOss}</div>
        {c.oss.map((o) => (
          <a
            key={o.name}
            href={o.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`${rowLink} py-[15px]`}
          >
            <span className="flex flex-col gap-1">
              <span className="text-[18px] leading-[1.2] font-medium">
                {o.name}
              </span>
              <span className="font-mono text-[13px] leading-[1.4] font-normal text-(--ink-faint)">
                {o.desc}
              </span>
            </span>
            <span className="flex-shrink-0 font-mono text-[11.5px] leading-none font-normal whitespace-nowrap text-[#B0A893]">
              ★ {o.stars}
            </span>
          </a>
        ))}
      </section>

      {/* Writing */}
      <section className="mb-[72px]">
        <div className={`${label} mb-1.5`}>{c.lblWriting}</div>
        {c.writing.map((w) => (
          <Link
            key={w.slug}
            href={`/writing/${w.slug}`}
            className="flex items-baseline justify-between gap-6 border-b border-border py-[14px] text-[#403B31] transition-colors hover:text-(--rust-strong)"
          >
            <span className="text-[17px] leading-[1.35] font-normal">
              {w.title}
            </span>
            <span className="flex-shrink-0 font-mono text-[11.5px] leading-none font-normal whitespace-nowrap text-[#B0A893]">
              {w.date}
            </span>
          </Link>
        ))}
      </section>

      {/* Contact */}
      <section id="contact" className="mb-10 pt-2">
        <div className={`${label} mb-[22px]`}>{c.lblContact}</div>
        <h2 className="m-0 max-w-[16ch] text-[30px] leading-[1.25] font-normal text-(--ink-strong)">
          {c.ctaHead}
        </h2>
        <p className="mt-4 mb-[26px] max-w-[42ch] text-[17px] leading-[1.6] font-normal text-[#403B31]">
          {c.ctaBody}
        </p>
        <a
          href={`mailto:${EMAIL}`}
          className={buttonVariants({ variant: "pill", size: "pill" })}
        >
          {c.ctaBtn}
        </a>
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
    </main>
  )
}
