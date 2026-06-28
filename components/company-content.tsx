"use client"

import Link from "next/link"

import {
  companies,
  nextSlug,
  uiCopy,
  type CompanySlug,
} from "@/lib/companies"
import { useLanguage } from "@/components/language-provider"
import { Badge } from "@/components/ui/badge"

export function CompanyContent({ slug }: { slug: CompanySlug }) {
  const { lang } = useLanguage()
  const t = uiCopy[lang]
  const company = companies[lang][slug]

  const nSlug = nextSlug(slug)
  const next = companies[lang][nSlug]

  return (
    <>
      <article className="pt-[72px] pb-6">
        <Link
          href="/portfolio"
          className="mb-10 inline-block font-mono text-[12px] leading-none font-medium tracking-[0.02em] text-(--ink-faint) transition-colors hover:text-(--rust-strong)"
        >
          ← {t.backLabel}
        </Link>

        <h1 className="m-0 text-[40px] leading-[1.12] font-semibold tracking-[0.004em] text-(--ink-strong)">
          {company.name}
        </h1>
        <p className="mt-[14px] text-[19px] leading-[1.5] font-normal text-(--ink-soft) italic">
          {company.tagline}
        </p>

        <dl className="mt-[38px] mb-[6px] grid grid-cols-2 gap-x-8 gap-y-5 border-y border-border py-[26px]">
          <div>
            <dt className="font-mono text-[10px] leading-none font-medium tracking-[0.08em] text-(--ink-fainter) uppercase">
              {t.mRole}
            </dt>
            <dd className="mt-[9px] text-[16px] leading-[1.3] font-normal text-(--ink-body)">
              {company.role}
            </dd>
          </div>
          <div>
            <dt className="font-mono text-[10px] leading-none font-medium tracking-[0.08em] text-(--ink-fainter) uppercase">
              {t.mStage}
            </dt>
            <dd className="mt-[9px] text-[16px] leading-[1.3] font-normal text-(--ink-body)">
              {company.stage}
            </dd>
          </div>
          <div>
            <dt className="font-mono text-[10px] leading-none font-medium tracking-[0.08em] text-(--ink-fainter) uppercase">
              {t.mYear}
            </dt>
            <dd className="mt-[9px] text-[16px] leading-[1.3] font-normal text-(--ink-body)">
              {company.year}
            </dd>
          </div>
          <div>
            <dt className="font-mono text-[10px] leading-none font-medium tracking-[0.08em] text-(--ink-fainter) uppercase">
              {t.mSector}
            </dt>
            <dd className="mt-[9px] text-[16px] leading-[1.3] font-normal text-(--ink-body)">
              {company.sector}
            </dd>
          </div>
        </dl>

        <div className="mt-[34px] flex flex-col gap-5">
          {company.body.map((para, i) => (
            <p
              key={i}
              className="m-0 text-[18px] leading-[1.66] font-normal text-(--ink-body)"
            >
              {para}
            </p>
          ))}
        </div>

        <div className="mt-[34px] flex flex-wrap items-center gap-[14px]">
          <Badge variant="status">{company.status}</Badge>
          <a
            href={company.site}
            target="_blank"
            rel="noopener noreferrer"
            className="border-b border-primary/40 pb-[2px] font-mono text-[12.5px] leading-none font-medium tracking-[0.02em] text-foreground transition-colors hover:text-(--rust-strong)"
          >
            {t.visitLabel} ↗
          </a>
        </div>
      </article>

      <div className="mt-[48px] mb-[72px] border-t border-border pt-[26px]">
        <div className="mb-3 font-mono text-[11px] leading-none font-medium tracking-[0.1em] text-(--ink-fainter) uppercase">
          {t.nextLabel}
        </div>
        <Link
          href={`/portfolio/${nSlug}`}
          className="text-[24px] leading-[1.25] font-medium text-(--ink-strong) transition-colors hover:text-(--rust-strong)"
        >
          {next.name} →
        </Link>
      </div>
    </>
  )
}
