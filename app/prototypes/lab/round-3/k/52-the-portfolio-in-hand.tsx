"use client"

import * as React from "react"

import { companies, type CompanySlug, type Lang } from "@/lib/companies"
import { EMAIL, portfolioContent } from "@/lib/content"

import { C, RING, fontHand, useSeen } from "../../kit"
import { Ring } from "../../round-2/g/_ledger"
import { Frame, TravelRing, useBox } from "../../round-2/h/chrome"
import { COPY, CopyButton, G, K_CSS, LangSwitch, PEN, href, ledgerRows, navLabel, stay, useCopy } from "./_page"

/**
 * 52 — The portfolio in the hand.
 *
 * The same page at phone width. There is no margin for the pen on a phone,
 * so the ledger's rows open instead: tap one and it unfolds under itself,
 * the ring drawn round its outcome and the note written beneath, and a link
 * on to the company. Docdir starts open. The band holds the name and 40's
 * menu, where the teal ring marks Portfolio and EN / NO sits under the list.
 * The footer is the address and the copy, stacked.
 */

const TEAL = "#0F766E"
type Nav = "about" | "portfolio" | "writing" | "contact"
const NAV: Nav[] = ["about", "portfolio", "writing", "contact"]

const css = `
.k52-fold { display: grid; grid-template-rows: 0fr; transition-property: grid-template-rows; transition-duration: 260ms; transition-timing-function: cubic-bezier(.3,.8,.3,1); }
.k52-fold[data-open] { grid-template-rows: 1fr; }
.k52-fold > div { overflow: hidden; min-height: 0; }
.k52-burger { position: relative; width: 6cqw; height: 6cqw; display: grid; place-items: center; }
.k52-burger span { position: absolute; left: 1.4cqw; right: 1.4cqw; height: 1.5px; border-radius: 1px; background: ${G.ink};
  transition-property: transform; transition-duration: 220ms; transition-timing-function: cubic-bezier(.3,.8,.3,1); }
.k52-burger span:first-child { transform: translateY(-0.6cqw); }
.k52-burger span:last-child { transform: translateY(0.6cqw); }
.k52-burger[data-open] span:first-child { transform: rotate(45deg); }
.k52-burger[data-open] span:last-child { transform: rotate(-45deg); }
.k52-menu { opacity: 0; translate: 0 -1.2cqw; visibility: hidden;
  transition-property: opacity, translate, visibility; transition-duration: 150ms, 150ms, 0ms; transition-delay: 0ms, 0ms, 150ms; transition-timing-function: ease-out; }
.k52-menu[data-open] { opacity: 1; translate: 0 0; visibility: visible; transition-duration: 200ms, 200ms, 0ms; transition-delay: 0ms; }
.k52-item { color: ${G.idle}; text-decoration: none; }
.k52-item[data-on] { color: ${G.ink}; }
@media (hover: hover) and (pointer: fine) { .k52-item:not([data-on]):hover { color: ${G.ink}; } }
@media (prefers-reduced-motion: reduce) {
  .k52-fold, .k52-burger span { transition-duration: 0ms; }
  .k52-menu, .k52-menu[data-open] { translate: 0 0; transition-property: opacity, visibility; }
}
`

function Menu({ open, lang, setLang, close, on }: { open: boolean; lang: Lang; setLang: (l: Lang) => void; close: () => void; on: boolean }) {
  const listRef = React.useRef<HTMLUListElement>(null)
  const cur = React.useRef<HTMLSpanElement>(null)
  const box = useBox(listRef, () => cur.current, [lang, open])
  return (
    <nav
      id="k52-menu"
      aria-label="Main"
      className="k52-menu absolute inset-x-0 z-30"
      data-open={open || undefined}
      inert={!open || undefined}
      style={{ top: "10cqw", bottom: 0, background: G.ground, padding: "1.6cqw 3.6cqw" }}
    >
      <ul ref={listRef} className="relative">
        {NAV.map((p, i) => (
          <li key={p} style={{ borderTop: i ? `1px solid ${G.hair}` : undefined }}>
            <a
              href={href(`/${p}`, lang)}
              onClick={(e) => {
                stay(e)
                close()
              }}
              aria-current={p === "portfolio" ? "page" : undefined}
              className="h2-press k52-item flex w-full items-center"
              data-on={p === "portfolio" || undefined}
              style={{ minHeight: "max(44px, 8.6cqw)", fontSize: "3.2cqw" }}
            >
              <span ref={p === "portfolio" ? cur : undefined}>{navLabel(p, lang)}</span>
            </a>
          </li>
        ))}
        <TravelRing box={box} k="portfolio" on={on && open} color={TEAL} padX={0.45} padY={0.36} />
      </ul>
      <div style={{ marginTop: "1.6cqw", paddingTop: "1.2cqw", borderTop: `1px solid ${G.hair}` }}>
        <LangSwitch lang={lang} setLang={setLang} size="2.3cqw" />
      </div>
    </nav>
  )
}

export default function ThePortfolioInHand() {
  const [seenRef, seen] = useSeen<HTMLDivElement>()
  const [lang, setLang] = React.useState<Lang>("en")
  const [menu, setMenu] = React.useState(false)
  const [row, setRow] = React.useState<CompanySlug | null>("docdir")
  const trigger = React.useRef<HTMLButtonElement>(null)
  const { state, copy, ref } = useCopy(EMAIL)
  const p = portfolioContent[lang]
  const rows = ledgerRows(lang)

  const close = React.useCallback(() => {
    setMenu(false)
    trigger.current?.focus()
  }, [])

  React.useEffect(() => {
    if (!menu) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close()
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [menu, close])

  const done = state === "copied"

  return (
    <Frame label="christerhagen.com/portfolio at phone width" style={{ background: C.tile }}>
      <style>{K_CSS + css}</style>

      <div
        ref={seenRef}
        className="absolute overflow-hidden"
        style={{
          top: "3cqw",
          bottom: "3cqw",
          left: "50%",
          width: "34cqw",
          marginLeft: "-17cqw",
          borderRadius: "4.4cqw",
          background: G.ground,
          boxShadow: RING,
          fontSize: "2.3cqw",
          ["--pen" as string]: TEAL,
        }}
      >
        <div className="k-scroll absolute inset-0 overflow-x-hidden overflow-y-auto" tabIndex={0} aria-label="The portfolio page, phone width">
          <header
            className="sticky top-0 z-20 flex items-center justify-between"
            style={{ height: "10cqw", padding: "0 2.2cqw 0 3.6cqw", background: G.band, boxShadow: `0 1px 0 ${G.edge}`, fontSize: "2.4cqw" }}
          >
            <a href={href("/", lang)} onClick={stay} className="h2-press h2-hit" style={{ fontWeight: 560, textDecoration: "none" }}>
              Christer Hagen
            </a>
            <button
              ref={trigger}
              type="button"
              onClick={() => setMenu((o) => !o)}
              aria-label={menu ? "Close menu" : "Open menu"}
              aria-expanded={menu}
              aria-controls="k52-menu"
              className="h2-press h2-hit k52-burger"
              data-open={menu || undefined}
              style={{ ["--hw" as string]: "44px" }}
            >
              <span aria-hidden />
              <span aria-hidden />
            </button>
          </header>

          <div key={lang} lang={lang === "en" ? "en" : "nb"} className="h2-reset" inert={menu || undefined} style={{ padding: "0 3.6cqw" }}>
            <p style={{ marginTop: "6cqw", color: G.grey, fontSize: "2cqw" }}>{p.kicker}</p>
            <h1 style={{ marginTop: "1.2cqw", fontSize: "3.4cqw", lineHeight: 1.2, fontWeight: 560, letterSpacing: "-0.014em", textWrap: "balance" }}>
              {p.intro}
            </h1>

            <ul className="tabular-nums" style={{ marginTop: "6cqw" }}>
              {rows.map((r, i) => {
                const first = i === 0 || rows[i - 1].year !== r.year
                const open = row === r.slug
                const id = `k52-${r.slug}`
                return (
                  <li key={r.slug} style={{ borderTop: `1px solid ${first ? "rgba(18,18,18,0.14)" : G.hair}` }}>
                    <button
                      type="button"
                      onClick={() => setRow(open ? null : r.slug)}
                      aria-expanded={open}
                      aria-controls={id}
                      className="k-row block w-full"
                      data-on={open || undefined}
                      style={{ minHeight: "max(44px, 9cqw)", padding: "1.4cqw 0" }}
                    >
                      <span className="flex items-baseline justify-between" style={{ gap: "2cqw" }}>
                        <span style={{ fontWeight: 520 }}>{r.name}</span>
                        <span className="relative shrink-0" style={{ marginRight: "0.8cqw", color: open ? G.ink : r.live ? G.faint : G.grey }}>
                          {r.text}
                          <Ring on={seen && open} color={TEAL} inset="-0.7cqw -1.2cqw -0.6cqw -1.3cqw" />
                        </span>
                      </span>
                      <span className="block" style={{ marginTop: "0.3cqw", color: G.faint, fontSize: "2cqw" }}>
                        {r.year} · {r.role}
                      </span>
                    </button>
                    <div id={id} className="k52-fold" data-open={open || undefined} inert={!open || undefined}>
                      <div>
                        {open ? (
                          <p
                            key={`${r.slug}-${lang}`}
                            className="k-note"
                            style={{ padding: "0.4cqw 0 0", rotate: "-1.5deg", fontFamily: fontHand, fontSize: "3.4cqw", lineHeight: 0.95, color: TEAL }}
                          >
                            {PEN[r.slug][lang]}
                          </p>
                        ) : null}
                        <a
                          href={href(`/portfolio/${r.slug}`, lang)}
                          onClick={stay}
                          className="k-link inline-flex items-center"
                          style={{ minHeight: 44, color: G.ink }}
                        >
                          {companies[lang][r.slug].name} →
                        </a>
                      </div>
                    </div>
                  </li>
                )
              })}
            </ul>

            <footer style={{ marginTop: "10cqw", padding: "6cqw 0 8cqw", borderTop: `1px solid ${G.hair}` }}>
              <a ref={ref} href={`mailto:${EMAIL}`} className="k-mail inline-flex items-center" style={{ minHeight: 44, fontSize: "2.4cqw", fontWeight: 520, letterSpacing: "-0.012em", overflowWrap: "anywhere" }}>
                {EMAIL}
              </a>
              <span className="relative flex items-center" style={{ marginTop: "1cqw" }}>
                <CopyButton lang={lang} done={done} onCopy={copy} fontSize="2.2cqw" />
                <span
                  aria-hidden
                  className="k-pen-copied"
                  data-on={done || undefined}
                  style={{ marginLeft: "2cqw", fontFamily: fontHand, fontSize: "3.4cqw", color: TEAL }}
                >
                  {COPY[lang].pen}
                </span>
              </span>
              <p aria-live="polite" style={{ marginTop: "1.4cqw", minHeight: "1.4em", fontSize: "2cqw" }}>
                {state === "manual" ? COPY[lang].manual : ""}
              </p>
            </footer>
          </div>
        </div>

        <Menu open={menu} lang={lang} setLang={setLang} close={close} on={seen} />
      </div>
    </Frame>
  )
}
