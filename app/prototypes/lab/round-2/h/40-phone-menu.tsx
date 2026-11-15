"use client"

import * as React from "react"

import { uiCopy, type Lang } from "@/lib/companies"
import { aboutContent, contactContent, homeContent, portfolioContent } from "@/lib/content"
import { writingCopy } from "@/lib/posts"

import { C, Lead, RING, fontHand, useSeen } from "../../kit"
import { Frame, G, LANGS, TravelRing, langKeys, tagOf, useBox, useReducedMotion } from "./chrome"

/**
 * 40 — On the phone, the ring is the menu's "you are here".
 *
 * The header at phone width: the name and a menu button in the band. Open
 * it and the four pages stand in a column with the current one ringed by
 * the pen (20's loop). Tap another and the ring travels down to it, holds a
 * beat so you see where you went, then the menu closes on the new page.
 * Esc closes it and hands focus back to the button.
 */

const TEAL = "#0F766E"

type Page = "about" | "portfolio" | "writing" | "contact"
const NAV: Page[] = ["about", "portfolio", "writing", "contact"]
const HOLD = 520

function label(p: Page, lang: Lang) {
  const t = uiCopy[lang]
  return { about: t.navAbout, portfolio: t.navPortfolio, writing: t.navWriting, contact: t.navContact }[p]
}

function head(p: Page, lang: Lang) {
  if (p === "about") return { k: aboutContent[lang].kicker, h: aboutContent[lang].head }
  if (p === "portfolio") return { k: portfolioContent[lang].kicker, h: portfolioContent[lang].intro }
  if (p === "writing") return { k: writingCopy[lang].kicker, h: writingCopy[lang].intro }
  return { k: contactContent[lang].kicker, h: contactContent[lang].head }
}

export default function PhoneMenu() {
  const [seenRef, seen] = useSeen<HTMLDivElement>()
  const reduced = useReducedMotion()
  const [page, setPage] = React.useState<Page>("writing")
  const [lang, setLang] = React.useState<Lang>("en")
  const [open, setOpen] = React.useState(false)
  const listRef = React.useRef<HTMLUListElement>(null)
  const items = React.useRef<Partial<Record<Page, HTMLSpanElement | null>>>({})
  const trigger = React.useRef<HTMLButtonElement>(null)
  const langRefs = React.useRef<(HTMLElement | null)[]>([])
  const timer = React.useRef<number | undefined>(undefined)
  React.useEffect(() => () => window.clearTimeout(timer.current), [])

  const box = useBox(listRef, () => items.current[page], [page, lang, open])

  const close = React.useCallback(() => {
    setOpen(false)
    trigger.current?.focus()
  }, [])

  React.useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close()
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [open, close])

  const go = (p: Page) => {
    window.clearTimeout(timer.current)
    if (p === page) return close()
    setPage(p)
    timer.current = window.setTimeout(close, reduced ? 160 : HOLD)
  }

  const h = head(page, lang)

  return (
    <Frame label="The site header at phone width, the open menu item ringed by a pen" style={{ background: C.tile, fontSize: "2.5cqw" }}>
      <style>{css}</style>
      <Lead
        bold="On a phone, the ring is the menu."
        grey="Open it and the pen marks where you are; tap another page and the ring goes there first."
      />

      <p aria-hidden className="h40-note absolute" style={{ left: "6cqw", top: "40cqw", fontFamily: fontHand, color: G.grey }}>
        it goes there,
        <br />
        then the menu closes
      </p>

      <div
        ref={seenRef}
        className="absolute overflow-hidden"
        style={{
          top: "21cqw",
          bottom: "-6cqw",
          left: "50%",
          width: "36cqw",
          marginLeft: "-18cqw",
          borderRadius: "4.4cqw",
          background: G.ground,
          boxShadow: RING,
        }}
      >
        <header
          className="absolute inset-x-0 top-0 z-10 flex items-center justify-between"
          style={{ height: "10cqw", padding: "0 2.2cqw 0 3.6cqw", background: G.band, boxShadow: `0 1px 0 ${G.edge}`, fontSize: "2.5cqw" }}
        >
          <span style={{ fontWeight: 560 }}>Christer Hagen</span>
          <button
            ref={trigger}
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="h40-menu"
            className="h2-press h2-hit h40-burger"
            data-open={open || undefined}
            style={{ ["--hw" as string]: "44px" }}
          >
            <span aria-hidden />
            <span aria-hidden />
          </button>
        </header>

        <main
          key={`${page}-${lang}`}
          lang={tagOf(lang)}
          className="h2-reset absolute"
          style={{ top: "15cqw", left: "3.6cqw", right: "3.6cqw", fontSize: "2.5cqw" }}
          inert={open || undefined}
        >
          <p style={{ color: G.grey, fontSize: "2.1cqw", marginBottom: "1.4cqw" }}>{h.k}</p>
          <h2 style={{ fontSize: "3.6cqw", lineHeight: 1.18, fontWeight: 560, letterSpacing: "-0.012em", marginBottom: "2cqw" }}>
            {h.h}
          </h2>
          <p style={{ color: G.grey }}>{homeContent[lang].aboutRole}</p>
        </main>

        <nav
          id="h40-menu"
          aria-label="Main"
          className="h40-menu absolute inset-x-0"
          data-open={open || undefined}
          inert={!open || undefined}
          style={{ top: "10cqw", bottom: 0, background: G.ground, padding: "1.6cqw 3.6cqw" }}
        >
          <ul ref={listRef} className="relative">
            {NAV.map((p, i) => (
              <li key={p} style={{ borderTop: i > 0 ? `1px solid ${G.hair}` : undefined }}>
                <button
                  type="button"
                  onClick={() => go(p)}
                  aria-current={page === p ? "page" : undefined}
                  className="h2-press h40-item flex w-full items-center"
                  data-on={page === p || undefined}
                  style={{ minHeight: "max(44px, 8.6cqw)", fontSize: "3.2cqw" }}
                >
                  <span
                    ref={(el) => {
                      items.current[p] = el
                    }}
                  >
                    {label(p, lang)}
                  </span>
                </button>
              </li>
            ))}
            <TravelRing box={box} k={page} on={seen && open} color={TEAL} padX={0.45} padY={0.36} />
          </ul>

          <div
            role="radiogroup"
            aria-label="Language"
            onKeyDown={(e) => langKeys(e, lang, setLang, langRefs)}
            className="flex items-center gap-[1cqw]"
            style={{ marginTop: "1.6cqw", paddingTop: "1.2cqw", borderTop: `1px solid ${G.hair}`, fontSize: "2.3cqw", letterSpacing: "0.02em" }}
          >
            {LANGS.map((l, i) => (
              <React.Fragment key={l.id}>
                {i > 0 ? (
                  <span aria-hidden style={{ color: "rgba(18,18,18,0.22)" }}>
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
                  className="h2-press h2-hit h40-l"
                  data-on={lang === l.id || undefined}
                  style={{ padding: "0.3em 0.3em", ["--hw" as string]: "44px" }}
                >
                  {l.label}
                </button>
              </React.Fragment>
            ))}
          </div>
        </nav>
      </div>
    </Frame>
  )
}

const css = `
.h40-note { font-size: 3cqw; line-height: 1.02; rotate: -3deg; pointer-events: none; }
@container (max-width: 460px) { .h40-note { display: none; } }

.h40-burger { position: relative; width: 6cqw; height: 6cqw; display: grid; place-items: center; }
.h40-burger span { position: absolute; left: 1.4cqw; right: 1.4cqw; height: 1.5px; border-radius: 1px; background: ${G.ink};
  transition-property: transform; transition-duration: 220ms; transition-timing-function: cubic-bezier(.3,.8,.3,1); }
.h40-burger span:first-child { transform: translateY(-0.6cqw); }
.h40-burger span:last-child { transform: translateY(0.6cqw); }
.h40-burger[data-open] span:first-child { transform: rotate(45deg); }
.h40-burger[data-open] span:last-child { transform: rotate(-45deg); }

.h40-menu { opacity: 0; translate: 0 -1.2cqw; visibility: hidden;
  transition-property: opacity, translate, visibility; transition-duration: 150ms, 150ms, 0ms; transition-delay: 0ms, 0ms, 150ms; transition-timing-function: ease-out; }
.h40-menu[data-open] { opacity: 1; translate: 0 0; visibility: visible; transition-duration: 200ms, 200ms, 0ms; transition-delay: 0ms; }

.h40-item { color: ${G.idle}; }
.h40-item[data-on] { color: ${G.ink}; }
.h40-l { position: relative; color: ${G.faint}; font-weight: 560; }
.h40-l[data-on] { color: ${G.ink}; cursor: default; }
@media (hover: hover) and (pointer: fine) {
  .h40-item:not([data-on]):hover, .h40-l:not([data-on]):hover { color: ${G.ink}; }
}
@media (prefers-reduced-motion: reduce) {
  .h40-burger span { transition-duration: 0ms; }
  .h40-menu, .h40-menu[data-open] { translate: 0 0; transition-property: opacity, visibility; }
}
`
