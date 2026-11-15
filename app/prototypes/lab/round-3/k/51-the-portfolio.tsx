"use client"

import * as React from "react"

import type { CompanySlug, Lang } from "@/lib/companies"
import { portfolioContent } from "@/lib/content"

import { useSeen } from "../../kit"
import { Ring } from "../../round-2/g/_ledger"
import { Frame } from "../../round-2/h/chrome"
import { COL, Column, Footer, G, Header, K_CSS, LEDGER_HEAD, MarginNote, PEN, Page, href, ledgerRows, stay } from "./_page"

/**
 * 51 — The portfolio.
 *
 * The page as it would ship: 36's band with Portfolio ringed, the site's own
 * intro, then all twelve companies as 08's year ledger. The red pen lives in
 * the outcome column (31): Docdir's sale is ringed and explained in the
 * margin; point at any other row and the ring and the note go there, leave
 * and they come back. A row is a link to its company. The footer is 38's
 * address. EN / NO re-sets the page in the other language.
 */

const RED = "oklch(0.56 0.2 27)"
const PINNED: CompanySlug = "docdir"
const GRID = "6cqw 15.5cqw 15.5cqw 1fr"

export default function ThePortfolio() {
  const [seenRef, seen] = useSeen<HTMLDivElement>()
  const [lang, setLang] = React.useState<Lang>("en")
  const [hover, setHover] = React.useState<CompanySlug | null>(null)
  const active = hover ?? PINNED
  const p = portfolioContent[lang]
  const rows = ledgerRows(lang)
  const head = LEDGER_HEAD[lang]

  return (
    <Frame label="christerhagen.com/portfolio, the ledger that says how each one ended">
      <style>{K_CSS}</style>
      <div ref={seenRef} className="absolute inset-0">
        <Page
          label="The portfolio page"
          lang={lang}
          pen={RED}
          header={<Header lang={lang} setLang={setLang} on={seen} pen={RED} />}
        >
          <Column style={{ paddingTop: "9cqw" }}>
            <p style={{ color: G.grey, fontSize: "1.85cqw", marginBottom: "1.4cqw" }}>{p.kicker}</p>
            <h1 style={{ fontSize: "3.3cqw", lineHeight: 1.2, fontWeight: 560, letterSpacing: "-0.014em", textWrap: "balance", maxWidth: "44cqw" }}>
              {p.intro}
            </h1>
          </Column>

          <div
            className="tabular-nums"
            style={{ marginLeft: `${COL.left}cqw`, width: `${COL.width}cqw`, marginTop: "7cqw", fontSize: "1.95cqw", lineHeight: 1.2 }}
            onPointerLeave={() => setHover(null)}
          >
            <div className="grid items-end" style={{ gridTemplateColumns: GRID, color: G.faint, paddingBottom: "1cqw" }}>
              <span>{head[0]}</span>
              <span>{head[1]}</span>
              <span>{head[2]}</span>
              <span className="text-right">{head[3]}</span>
            </div>
            <ul>
              {rows.map((r, i) => {
                const first = i === 0 || rows[i - 1].year !== r.year
                const on = r.slug === active
                return (
                  <li key={r.slug} className="relative" style={{ borderTop: `1px solid ${first ? "rgba(18,18,18,0.14)" : G.hair}` }}>
                    <a
                      href={href(`/portfolio/${r.slug}`, lang)}
                      onClick={stay}
                      onPointerEnter={() => setHover(r.slug)}
                      onFocus={() => setHover(r.slug)}
                      onBlur={() => setHover(null)}
                      aria-describedby={on ? "k51-note" : undefined}
                      className="k-row grid items-center"
                      data-on={on || undefined}
                      style={{ gridTemplateColumns: GRID, minHeight: "max(44px, 5.4cqw)", color: G.ink, textDecoration: "none" }}
                    >
                      <span style={{ color: G.grey }}>{first ? r.year : ""}</span>
                      <span style={{ fontWeight: 520, color: on ? G.ink : "rgba(18,18,18,0.78)", transitionProperty: "color", transitionDuration: "160ms" }}>
                        {r.name}
                      </span>
                      <span style={{ color: G.grey }}>{r.role}</span>
                      <span className="flex justify-end" style={{ paddingRight: "0.6cqw" }}>
                        <span className="relative" style={{ color: on ? G.ink : r.live ? G.faint : G.grey }}>
                          {r.text}
                          <Ring on={seen && on} color={RED} inset="-0.55cqw -1cqw -0.5cqw -1.1cqw" />
                        </span>
                      </span>
                    </a>
                    {seen && on ? (
                      <React.Fragment key={`${r.slug}-${lang}`}>
                        <span id="k51-note" className="sr-only">
                          {PEN[r.slug][lang]}
                        </span>
                        <MarginNote text={PEN[r.slug][lang]} pen={RED} />
                      </React.Fragment>
                    ) : null}
                  </li>
                )
              })}
            </ul>
          </div>

          <Footer lang={lang} pen={RED} />
        </Page>
      </div>
    </Frame>
  )
}
