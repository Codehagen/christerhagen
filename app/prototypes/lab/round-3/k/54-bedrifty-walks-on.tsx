"use client"

import * as React from "react"

import { companies, companyOrder, uiCopy, type CompanySlug, type Lang } from "@/lib/companies"

import { RING, useSeen } from "../../kit"
import { Frame, useReducedMotion } from "../../round-2/h/chrome"
import { CompanyHead, Facts } from "./_company"
import { COL, Column, Footer, G, Header, K_CSS, Page, ReadNext, href } from "./_page"

/**
 * 54 — Bedrifty, and the walk through the portfolio.
 *
 * An active company, so the ring cannot mark an ending: on Bedrifty it rings
 * Building, and the pen says what it is building on. The story's company
 * names are 07's colourless links; point at Codebase or Sailsdock and a small
 * card in the margin says what it is without leaving the page. Follow a name,
 * or 19's read next, and the page turns to that company: the ring lands on
 * whichever fact matters there. Rust is the pen, the open link and the arrow.
 */

const RUST = "#C2410C"

const NAMES = companyOrder.map((s) => [s, companies.en[s].name] as const)

/** The story with every other company's name pulled out as a link. */
function linkify(text: string, self: CompanySlug): (string | CompanySlug)[] {
  const others = NAMES.filter(([s]) => s !== self)
  const re = new RegExp(`(${others.map(([, n]) => n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`, "g")
  return text.split(re).map((part) => others.find(([, n]) => n === part)?.[0] ?? part)
}

const isSlug = (x: string): x is CompanySlug => (companyOrder as readonly string[]).includes(x)

const css = `
.k54-card { transition-property: top, opacity, translate; transition-duration: 220ms, 160ms, 160ms; transition-timing-function: cubic-bezier(.2,.7,.2,1); }
@media (prefers-reduced-motion: reduce) { .k54-card { transition-duration: 0ms; } }
`

export default function BedriftyWalksOn() {
  const [seenRef, seen] = useSeen<HTMLDivElement>()
  const reduced = useReducedMotion()
  const scrollerRef = React.useRef<HTMLDivElement>(null)
  const storyRef = React.useRef<HTMLDivElement>(null)
  const links = React.useRef<Partial<Record<CompanySlug, HTMLAnchorElement | null>>>({})
  const [lang, setLang] = React.useState<Lang>("en")
  const [slug, setSlug] = React.useState<CompanySlug>("bedrifty")
  const [open, setOpen] = React.useState<CompanySlug | null>(null)
  const [top, setTop] = React.useState(0)
  const c = companies[lang][slug]

  const show = (s: CompanySlug) => {
    const el = links.current[s]
    const box = storyRef.current
    if (el && box) setTop(el.getBoundingClientRect().top - box.getBoundingClientRect().top)
    setOpen(s)
  }

  const walk = (s: CompanySlug) => {
    setOpen(null)
    setSlug(s)
    scrollerRef.current?.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" })
  }

  const card = open ? companies[lang][open] : null

  return (
    <Frame label="christerhagen.com/portfolio/bedrifty, with names that preview and a read next that walks on">
      <style>{K_CSS + css}</style>
      <div ref={seenRef} className="absolute inset-0">
        <Page
          label={`The ${c.name} page`}
          lang={lang}
          pen={RUST}
          scrollerRef={scrollerRef}
          header={<Header lang={lang} setLang={setLang} on={seen} pen={RUST} exact={false} />}
        >
          <div key={slug} className="h2-reset">
            <Column style={{ paddingTop: "5.6cqw" }}>
              <CompanyHead slug={slug} lang={lang} />
              <Facts slug={slug} lang={lang} pen={RUST} on={seen} />

              <div ref={storyRef} className="relative" style={{ marginTop: "6cqw" }} onPointerLeave={() => setOpen(null)}>
                {c.body.map((para, i) => (
                  <p key={i} style={{ marginTop: i ? "1.6cqw" : 0, textWrap: "pretty" }}>
                    {linkify(para, slug).map((part, k) =>
                      isSlug(part) ? (
                        <a
                          key={k}
                          ref={(el) => {
                            links.current[part] = el
                          }}
                          href={href(`/portfolio/${part}`, lang)}
                          onClick={(e) => {
                            if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return
                            e.preventDefault()
                            walk(part)
                          }}
                          onPointerEnter={() => show(part)}
                          onFocus={() => show(part)}
                          onBlur={() => setOpen(null)}
                          aria-describedby={open === part ? "k54-card" : undefined}
                          className="k-link"
                          data-on={open === part || undefined}
                          style={{ color: G.ink, padding: "0.6em 0", margin: "-0.6em 0" }}
                        >
                          {companies[lang][part].name}
                        </a>
                      ) : (
                        <React.Fragment key={k}>{part}</React.Fragment>
                      ),
                    )}
                  </p>
                ))}

                {/* 07's card, in the margin level with the name you point at. */}
                <div
                  id="k54-card"
                  role="tooltip"
                  className="k54-card pointer-events-none absolute"
                  style={{
                    left: `calc(100% + 3cqw)`,
                    width: `${100 - COL.left - COL.width - 6}cqw`,
                    top,
                    marginTop: "-1.2cqw",
                    opacity: card ? 1 : 0,
                    translate: card ? "0 0" : "0 0.6cqw",
                    padding: "1.5cqw 2cqw 1.7cqw",
                    borderRadius: "1.4cqw",
                    background: "#FFFFFF",
                    boxShadow: RING,
                    fontSize: "1.85cqw",
                  }}
                >
                  {card && open ? (
                    <>
                      <span className="flex items-baseline justify-between" style={{ gap: "1.4cqw" }}>
                        <span style={{ fontWeight: 560 }}>{card.name}</span>
                        <span className="flex items-center" style={{ gap: "0.7cqw", color: G.grey }}>
                          <span aria-hidden className="rounded-full" style={{ width: "0.9cqw", height: "0.9cqw", background: RUST }} />
                          {card.status}
                        </span>
                      </span>
                      <span className="block" style={{ marginTop: "0.5cqw", color: G.grey, textWrap: "pretty" }}>
                        {card.tagline}
                      </span>
                      <span className="block tabular-nums" style={{ marginTop: "0.4cqw", color: G.faint }}>
                        {card.role} · {card.year}
                      </span>
                    </>
                  ) : null}
                </div>
              </div>

              {c.site !== "#" ? (
                <p style={{ marginTop: "1.6cqw" }}>
                  <a className="k-link inline-flex items-center" href={c.site} target="_blank" rel="noopener noreferrer" style={{ minHeight: 44 }}>
                    {uiCopy[lang].visitLabel} ↗
                  </a>
                </p>
              ) : null}

              <ReadNext slug={slug} lang={lang} onFollow={walk} />
            </Column>
          </div>

          <Footer lang={lang} pen={RUST} />
        </Page>
      </div>
    </Frame>
  )
}
