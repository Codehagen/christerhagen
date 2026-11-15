"use client"

import * as React from "react"

import { companies, uiCopy, type CompanySlug, type Lang } from "@/lib/companies"

import { Ring } from "../../round-2/g/_ledger"
import { G, MarginNote, PEN, href, stay, type FactKey } from "./_page"

/**
 * The top of a company page (29): the way back, the name, the tagline, and
 * the facts as a four-line ledger with the values right-aligned. One ring,
 * on the fact that matters for this company, and the pen beside it.
 */

export function CompanyHead({ slug, lang }: { slug: CompanySlug; lang: Lang }) {
  const c = companies[lang][slug]
  return (
    <>
      <a
        href={href("/portfolio", lang)}
        onClick={stay}
        className="k-link inline-flex items-center"
        style={{ minHeight: 44, color: G.grey, fontSize: "1.85cqw", textDecorationColor: "transparent" }}
      >
        ↩ {uiCopy[lang].backLabel}
      </a>
      <h1 style={{ marginTop: "2.4cqw", fontSize: "3.8cqw", lineHeight: 1.15, fontWeight: 560, letterSpacing: "-0.016em" }}>{c.name}</h1>
      <p style={{ marginTop: "0.8cqw", color: G.grey, textWrap: "pretty" }}>{c.tagline}</p>
    </>
  )
}

export function Facts({ slug, lang, pen, on }: { slug: CompanySlug; lang: Lang; pen: string; on: boolean }) {
  const c = companies[lang][slug]
  const t = uiCopy[lang]
  const key = PEN[slug].fact
  const rows: [FactKey, string, string][] = [
    ["role", t.mRole, c.role],
    ["stage", t.mStage, c.stage],
    ["year", t.mYear, c.year],
    ["sector", t.mSector, c.sector],
  ]
  return (
    <dl style={{ marginTop: "4.4cqw" }}>
      {rows.map(([k, label, value], i) => {
        const ringed = k === key
        return (
          <div
            key={k}
            className="relative flex items-baseline justify-between"
            style={{ padding: "1cqw 0", borderTop: `1px solid ${i ? G.hair : "rgba(18,18,18,0.14)"}` }}
          >
            <dt style={{ color: G.grey }}>{label}</dt>
            <dd className="tabular-nums" style={{ paddingRight: "0.6cqw" }}>
              <span className="relative" style={{ fontWeight: ringed ? 560 : 460 }}>
                {value}
                {ringed ? <Ring on={on} color={pen} inset="-0.55cqw -1cqw -0.5cqw -1.1cqw" delay={260} /> : null}
              </span>
              {ringed ? <span className="sr-only">. {PEN[slug][lang]}</span> : null}
            </dd>
            {ringed && on ? <MarginNote key={`${slug}-${lang}`} text={PEN[slug][lang]} pen={pen} /> : null}
          </div>
        )
      })}
    </dl>
  )
}
