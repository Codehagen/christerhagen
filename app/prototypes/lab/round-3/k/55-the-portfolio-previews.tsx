"use client"

import * as React from "react"

import { companies, type CompanySlug, type Lang } from "@/lib/companies"
import { portfolioContent } from "@/lib/content"

import { RING, useSeen } from "../../kit"
import { Ring } from "../../round-2/g/_ledger"
import { Frame } from "../../round-2/h/chrome"
import { COL, Column, Footer, G, Header, K_CSS, Page, Rule, href, stay } from "./_page"

/**
 * 55 — The portfolio, previewed.
 *
 * The same page as 51 but grouped the way the site groups it (Building, Angel
 * investments, Exits, Sunset), and pointing at a row opens 07's card in the
 * margin instead of a pen note: role, year, sector and the company's own
 * second paragraph, so you can read the whole portfolio without opening a
 * page. The names are colourless links; the open one's underline takes the
 * blue. The pen rings one thing on the page: Docdir's Acquired.
 */

const BLUE = "oklch(0.55 0.16 252)"

type Row = { slug: CompanySlug; name: string; desc: string; right: string }

function groups(lang: Lang): { label: string; rows: Row[] }[] {
  const p = portfolioContent[lang]
  const r = (xs: { slug: string; name: string; desc: string; meta?: string; stage?: string }[]) =>
    xs.map((x) => ({ slug: x.slug as CompanySlug, name: x.name, desc: x.desc, right: x.meta ?? x.stage ?? "" }))
  return [
    { label: p.gBuilt, rows: r(p.built) },
    { label: p.gInvest, rows: r(p.invest) },
    { label: p.gExits, rows: r(p.exits) },
    { label: p.gSunset, rows: r(p.sunset) },
  ]
}

const css = `
.k55-card { transition-property: top, opacity; transition-duration: 220ms, 160ms; transition-timing-function: cubic-bezier(.2,.7,.2,1); }
@media (prefers-reduced-motion: reduce) { .k55-card { transition-duration: 0ms; } }
`

export default function ThePortfolioPreviews() {
  const [seenRef, seen] = useSeen<HTMLDivElement>()
  const [lang, setLang] = React.useState<Lang>("en")
  const [open, setOpen] = React.useState<CompanySlug>("docdir")
  const [top, setTop] = React.useState<number | null>(null)
  const listRef = React.useRef<HTMLDivElement>(null)
  const rowRefs = React.useRef<Partial<Record<CompanySlug, HTMLElement | null>>>({})
  const p = portfolioContent[lang]
  const c = companies[lang][open]

  const place = React.useCallback(() => {
    const el = rowRefs.current[open]
    const box = listRef.current
    if (el && box) setTop(el.getBoundingClientRect().top - box.getBoundingClientRect().top)
  }, [open])

  React.useLayoutEffect(() => {
    place()
    const box = listRef.current
    if (!box) return
    const ro = new ResizeObserver(place)
    ro.observe(box)
    return () => ro.disconnect()
  }, [place, lang])

  return (
    <Frame label="christerhagen.com/portfolio, where pointing at a company opens a card">
      <style>{K_CSS + css}</style>
      <div ref={seenRef} className="absolute inset-0">
        <Page
          label="The portfolio page"
          lang={lang}
          pen={BLUE}
          header={<Header lang={lang} setLang={setLang} on={seen} pen={BLUE} />}
        >
          <Column style={{ paddingTop: "9cqw" }}>
            <p style={{ color: G.grey, fontSize: "1.85cqw", marginBottom: "1.4cqw" }}>{p.kicker}</p>
            <h1 style={{ fontSize: "3.3cqw", lineHeight: 1.2, fontWeight: 560, letterSpacing: "-0.014em", textWrap: "balance", maxWidth: "44cqw" }}>
              {p.intro}
            </h1>
          </Column>

          <div ref={listRef} className="relative" style={{ marginLeft: `${COL.left}cqw`, width: `${COL.width}cqw` }}>
            {groups(lang).map((g) => (
              <section key={g.label}>
                <Rule right={g.rows.length}>{g.label}</Rule>
                <ul>
                  {g.rows.map((r, i) => {
                    const on = r.slug === open
                    const sold = r.slug === "docdir"
                    return (
                      <li key={r.slug} style={{ borderTop: i ? `1px solid ${G.hair}` : undefined }}>
                        <a
                          ref={(el) => {
                            rowRefs.current[r.slug] = el
                          }}
                          href={href(`/portfolio/${r.slug}`, lang)}
                          onClick={stay}
                          onPointerEnter={() => setOpen(r.slug)}
                          onFocus={() => setOpen(r.slug)}
                          aria-describedby={on ? "k55-card" : undefined}
                          className="k-row flex items-baseline justify-between"
                          data-on={on || undefined}
                          style={{ gap: "3cqw", padding: "1.2cqw 0", minHeight: 44, color: G.ink, textDecoration: "none" }}
                        >
                          <span className="min-w-0">
                            <span className="k-link" data-on={on || undefined} style={{ fontWeight: 520 }}>
                              {r.name}
                            </span>
                            <span className="block" style={{ marginTop: "0.3cqw", color: G.grey, fontSize: "1.9cqw", textWrap: "pretty" }}>
                              {r.desc}
                            </span>
                          </span>
                          <span className="relative shrink-0 tabular-nums" style={{ color: sold ? G.ink : G.faint, fontWeight: sold ? 560 : 460, marginRight: "0.6cqw" }}>
                            {r.right}
                            {sold ? <Ring on={seen} color={BLUE} inset="-0.55cqw -1cqw -0.5cqw -1.1cqw" delay={500} /> : null}
                          </span>
                        </a>
                      </li>
                    )
                  })}
                </ul>
              </section>
            ))}

            {/* 07's card: what it is, without leaving the page. */}
            <div
              id="k55-card"
              role="tooltip"
              aria-live="polite"
              className="k55-card pointer-events-none absolute"
              style={{
                left: "calc(100% + 3.4cqw)",
                width: `${100 - COL.left - COL.width - 7}cqw`,
                top: top ?? 0,
                opacity: top === null ? 0 : 1,
                padding: "1.5cqw 2cqw 1.7cqw",
                borderRadius: "1.4cqw",
                background: "#FFFFFF",
                boxShadow: RING,
                fontSize: "1.75cqw",
                lineHeight: 1.38,
              }}
            >
              <span className="flex items-baseline justify-between" style={{ gap: "1.4cqw" }}>
                <span style={{ fontWeight: 560 }}>{c.name}</span>
                <span className="flex items-center" style={{ gap: "0.7cqw", color: G.grey }}>
                  <span aria-hidden className="shrink-0 rounded-full" style={{ width: "0.9cqw", height: "0.9cqw", background: BLUE }} />
                  {c.status}
                </span>
              </span>
              <span className="block tabular-nums" style={{ marginTop: "0.4cqw", color: G.faint }}>
                {c.role} · {c.year} · {c.sector}
              </span>
              <span className="block" style={{ marginTop: "0.9cqw", color: G.grey, textWrap: "pretty" }}>
                {c.body[1]}
              </span>
            </div>
          </div>

          <Footer lang={lang} pen={BLUE} />
        </Page>
      </div>
    </Frame>
  )
}
