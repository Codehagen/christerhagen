"use client"

import * as React from "react"

import { uiCopy, type Lang } from "@/lib/companies"
import {
  aboutContent,
  contactContent,
  EMAIL,
  homeContent,
  portfolioContent,
} from "@/lib/content"
import { postOrder, posts, writingCopy } from "@/lib/posts"

import { useSeen } from "../../kit"
import { Frame, G, LANGS, TravelRing, langKeys, tagOf, useBox } from "./chrome"

/**
 * 36 — The pen marks where you are.
 *
 * The site's header in the benji band: name left, the four pages, EN / NO.
 * There is no bold item and no underline for the current page; a red pen
 * rings it (piece 20's loop). Pick another page and the ring lifts, slides
 * and is drawn again around the new word while the page under it re-sets.
 * The name goes home, and home has no ring at all.
 */

const RED = "oklch(0.56 0.2 27)"

type Page = "home" | "about" | "portfolio" | "writing" | "contact"
const NAV: Exclude<Page, "home">[] = ["about", "portfolio", "writing", "contact"]

function label(p: Exclude<Page, "home">, lang: Lang) {
  const t = uiCopy[lang]
  return { about: t.navAbout, portfolio: t.navPortfolio, writing: t.navWriting, contact: t.navContact }[p]
}

function Body({ page, lang }: { page: Page; lang: Lang }) {
  const kick = (s: string) => (
    <p style={{ color: G.grey, fontSize: "1.75cqw", marginBottom: "1.4cqw" }}>{s}</p>
  )
  const head = (s: string) => (
    <h2
      style={{
        fontSize: "3.1cqw",
        lineHeight: 1.18,
        fontWeight: 560,
        letterSpacing: "-0.012em",
        textWrap: "balance",
        marginBottom: "2cqw",
      }}
    >
      {s}
    </h2>
  )
  const row = (a: string, b: string) => (
    <div
      key={a}
      className="flex items-baseline justify-between gap-[2cqw] py-[0.9cqw]"
      style={{ borderTop: `1px solid ${G.hair}` }}
    >
      <span>{a}</span>
      <span className="tabular-nums" style={{ color: G.faint, whiteSpace: "nowrap" }}>
        {b}
      </span>
    </div>
  )

  if (page === "home") {
    const h = homeContent[lang]
    return (
      <>
        {head(h.heroHead)}
        <p style={{ color: G.grey }}>{h.heroSub}</p>
      </>
    )
  }
  if (page === "about") {
    const a = aboutContent[lang]
    return (
      <>
        {kick(a.kicker)}
        {head(a.head)}
        <p style={{ color: G.grey }}>{a.bio[0]}</p>
      </>
    )
  }
  if (page === "portfolio") {
    const p = portfolioContent[lang]
    return (
      <>
        {kick(p.kicker)}
        {head(p.intro)}
        <div style={{ marginTop: "0.6cqw" }}>{p.built.slice(0, 3).map((b) => row(b.name, b.meta))}</div>
      </>
    )
  }
  if (page === "writing") {
    const w = writingCopy[lang]
    return (
      <>
        {kick(w.kicker)}
        {head(w.intro)}
        <div style={{ marginTop: "0.6cqw" }}>
          {postOrder.map((s) => row(posts[lang][s].title, posts[lang][s].date))}
        </div>
      </>
    )
  }
  const c = contactContent[lang]
  return (
    <>
      {kick(c.kicker)}
      {head(c.head)}
      <p style={{ color: G.grey, marginBottom: "2cqw" }}>{c.body}</p>
      <a href={`mailto:${EMAIL}`} className="h36-mail">
        {EMAIL}
      </a>
    </>
  )
}

export default function RingTravels() {
  const [seenRef, seen] = useSeen<HTMLDivElement>()
  const [page, setPage] = React.useState<Page>("writing")
  const [lang, setLang] = React.useState<Lang>("en")
  const navRef = React.useRef<HTMLElement>(null)
  const items = React.useRef<Partial<Record<Page, HTMLSpanElement | null>>>({})
  const langRefs = React.useRef<(HTMLElement | null)[]>([])

  const box = useBox(navRef, () => (page === "home" ? null : items.current[page]), [page, lang])

  return (
    <Frame label="The site header, the current page ringed by a pen">
      <style>{css}</style>
      <div ref={seenRef} className="absolute inset-0">
        {/* The band: the header lives in it, and holds nothing else. */}
        <header
          className="absolute inset-x-0 top-0 flex items-center justify-between"
          style={{
            height: "7.4cqw",
            padding: "0 5cqw",
            background: G.band,
            boxShadow: `0 1px 0 ${G.edge}`,
            fontSize: "1.95cqw",
          }}
        >
          <button
            type="button"
            onClick={() => setPage("home")}
            aria-current={page === "home" ? "page" : undefined}
            className="h2-press h2-hit"
            style={{ fontWeight: 560, letterSpacing: "-0.006em" }}
          >
            Christer Hagen
          </button>

          <nav ref={navRef} aria-label="Main" className="relative flex items-center gap-[3cqw]">
            {NAV.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPage(p)}
                aria-current={page === p ? "page" : undefined}
                className="h2-press h2-hit h36-item"
                data-on={page === p || undefined}
              >
                <span
                  ref={(el) => {
                    items.current[p] = el
                  }}
                >
                  {label(p, lang)}
                </span>
              </button>
            ))}

            <span
              role="radiogroup"
              aria-label="Language"
              onKeyDown={(e) => langKeys(e, lang, setLang, langRefs)}
              className="flex items-center gap-[0.6cqw]"
              style={{ marginLeft: "1.2cqw", fontSize: "1.7cqw", letterSpacing: "0.02em" }}
            >
              {LANGS.map((l, i) => (
                <React.Fragment key={l.id}>
                  {i > 0 ? (
                    <span aria-hidden style={{ color: G.faint }}>
                      /
                    </span>
                  ) : null}
                  <button
                    ref={(el) => {
                      langRefs.current[i] = el
                    }}
                    type="button"
                    role="radio"
                    aria-checked={lang === l.id}
                    aria-label={l.name}
                    tabIndex={lang === l.id ? 0 : -1}
                    onClick={() => setLang(l.id)}
                    className="h2-press h2-hit h36-lang"
                    data-on={lang === l.id || undefined}
                    style={{ ["--hw" as string]: "22px" }}
                  >
                    {l.label}
                  </button>
                </React.Fragment>
              ))}
            </span>

            <TravelRing box={box} k={page} on={seen && page !== "home"} color={RED} />
          </nav>
        </header>

        <main
          key={`${page}-${lang}`}
          lang={tagOf(lang)}
          aria-live="polite"
          className="h2-reset absolute"
          style={{ top: "16cqw", left: "50%", width: "50cqw", marginLeft: "-25cqw" }}
        >
          <Body page={page} lang={lang} />
        </main>
      </div>
    </Frame>
  )
}

const css = `
.h36-item { color: ${G.idle}; }
.h36-item[data-on] { color: ${G.ink}; }
.h36-lang { color: ${G.faint}; font-weight: 560; }
.h36-lang[data-on] { color: ${G.ink}; cursor: default; }
.h36-mail { text-decoration-line: underline; text-decoration-thickness: 1px; text-underline-offset: 0.25em; text-decoration-color: ${G.faint}; transition-property: text-decoration-color; transition-duration: 180ms; }
@media (hover: hover) and (pointer: fine) {
  .h36-item:not([data-on]):hover, .h36-lang:not([data-on]):hover { color: ${G.ink}; }
  .h36-mail:hover { text-decoration-color: ${G.ink}; }
}
`
