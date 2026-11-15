"use client"

import * as React from "react"

import type { Lang } from "@/lib/companies"

import { C, RING, fontHand, useSeen } from "../../kit"
import { Frame } from "../../round-2/h/chrome"
import {
  Footer,
  G,
  LangLetters,
  NAV,
  PageFor,
  SYSTEM_CSS,
  TravelRing,
  WORDS,
  plainClick,
  hrefOf,
  navLabel,
  navOf,
  tagOf,
  useBox,
  useReducedMotion,
  useRoute,
  type NavKey,
} from "./system"

/**
 * 57 — The same system at phone width.
 *
 * No rail on a phone: the band holds the name and a menu button, and the
 * menu (40) is the four pages with the current one ringed and EN / NO under
 * them. Tap another page and the ring travels there first, holds a beat, then
 * the menu closes on the new page. The page scrolls under the band and ends
 * in the same footer as desktop: the address and copy. Esc closes the menu
 * and hands focus back to its button. One teal pen: the ring.
 */

const TEAL = "#0F766E"
const HOLD = 520

export default function AtPhoneWidth() {
  const [seenRef, seen] = useSeen<HTMLDivElement>()
  const reduced = useReducedMotion()
  const scroller = React.useRef<HTMLDivElement>(null)
  const [route, go] = useRoute("about", scroller)
  const [lang, setLang] = React.useState<Lang>("en")
  const [open, setOpen] = React.useState(false)
  const listRef = React.useRef<HTMLUListElement>(null)
  const items = React.useRef<Partial<Record<NavKey, HTMLSpanElement | null>>>({})
  const trigger = React.useRef<HTMLButtonElement>(null)
  const timer = React.useRef<number | undefined>(undefined)
  React.useEffect(() => () => window.clearTimeout(timer.current), [])
  const w = WORDS[lang]
  const cur = navOf(route)

  const box = useBox(listRef, () => (cur ? items.current[cur] : null), [cur, lang, open])

  const close = React.useCallback(() => {
    window.clearTimeout(timer.current)
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

  const pick = (k: NavKey) => {
    window.clearTimeout(timer.current)
    if (route === k) return close()
    go(k, false)
    timer.current = window.setTimeout(close, reduced ? 160 : HOLD)
  }

  return (
    <Frame label="christerhagen.com at phone width, with its menu and footer" style={{ background: C.tile, fontSize: "2.5cqw" }}>
      <style>{SYSTEM_CSS + css}</style>

      <div className="absolute" style={{ left: "5.4cqw", top: "5.4cqw", width: "38cqw" }}>
        <p>
          <span style={{ fontWeight: 560 }}>The same chrome on a phone.</span>{" "}
          <span style={{ color: G.grey }}>
            The rail folds into the menu, the ring marks the page you are on, and every page still ends on the address.
          </span>
        </p>
      </div>
      <p aria-hidden className="l57-note absolute" style={{ left: "6cqw", top: "40cqw", fontFamily: fontHand, color: G.grey }}>
        the ring gets there first,
        <br />
        then the menu lets go
      </p>

      <div
        ref={seenRef}
        className="absolute overflow-hidden"
        style={{
          top: "5.4cqw",
          bottom: "-6cqw",
          right: "9cqw",
          width: "40cqw",
          borderRadius: "4.4cqw",
          background: G.ground,
          boxShadow: RING,
          fontSize: "2.3cqw",
        }}
      >
        <header
          className="absolute inset-x-0 top-0 z-10 flex items-center justify-between"
          style={{ height: "10cqw", padding: "0 2cqw 0 3.6cqw", background: G.band, boxShadow: `0 1px 0 ${G.edge}`, fontSize: "2.5cqw" }}
        >
          <a
            href={hrefOf("home", lang)}
            onClick={(e) => {
              if (!plainClick(e)) return
              if (open) close()
              go("home", false)
            }}
            aria-current={route === "home" ? "page" : undefined}
            className="h2-press h2-hit l3-name"
          >
            Christer Hagen
          </a>
          <button
            ref={trigger}
            type="button"
            onClick={() => (open ? close() : setOpen(true))}
            aria-label={open ? w.close : w.open}
            aria-expanded={open}
            aria-controls="l57-menu"
            className="h2-press h2-hit l57-burger"
            data-open={open || undefined}
            style={{ ["--hw" as string]: "44px" }}
          >
            <span aria-hidden />
            <span aria-hidden />
          </button>
        </header>

        <div
          ref={scroller}
          className="l3-scroll absolute inset-x-0 bottom-0 overflow-x-hidden overflow-y-auto"
          style={{ top: "10cqw", padding: "0 3.6cqw 8cqw", outline: "none" }}
          tabIndex={open ? -1 : 0}
          aria-label="The page, scrollable"
          inert={open || undefined}
        >
          <main key={`${route}-${lang}`} lang={tagOf(lang)} className="h2-reset" style={{ padding: "5cqw 0 7cqw" }}>
            <PageFor route={route} lang={lang} go={go} color={TEAL} />
          </main>
          <div style={{ fontSize: "0.95em" }}>
            <Footer lang={lang} color={TEAL} />
          </div>
        </div>

        <nav
          id="l57-menu"
          aria-label="Main"
          className="l57-menu absolute inset-x-0 z-[6]"
          data-open={open || undefined}
          inert={!open || undefined}
          style={{ top: "10cqw", bottom: 0, background: G.ground, padding: "1.6cqw 3.6cqw" }}
        >
          <ul ref={listRef} className="relative">
            {NAV.map((k, i) => (
              <li key={k} style={{ borderTop: i > 0 ? `1px solid ${G.hair}` : undefined }}>
                <a
                  href={hrefOf(k, lang)}
                  onClick={(e) => plainClick(e) && pick(k)}
                  aria-current={route === k ? "page" : cur === k ? "true" : undefined}
                  className="h2-press l57-item flex w-full items-center"
                  data-on={cur === k || undefined}
                  style={{ minHeight: "max(44px, 8.6cqw)", fontSize: "3.2cqw" }}
                >
                  <span
                    ref={(el) => {
                      items.current[k] = el
                    }}
                  >
                    {navLabel(k, lang)}
                  </span>
                </a>
              </li>
            ))}
            <TravelRing box={box} k={cur ?? "none"} on={seen && open && cur !== null} color={TEAL} padX={0.45} padY={0.36} />
          </ul>
          <div style={{ marginTop: "1.6cqw", paddingTop: "1.2cqw", borderTop: `1px solid ${G.hair}` }}>
            <LangLetters lang={lang} setLang={setLang} style={{ fontSize: "2.3cqw" }} />
          </div>
        </nav>
      </div>
    </Frame>
  )
}

const css = `
.l57-note { font-size: 3cqw; line-height: 1.02; rotate: -3deg; pointer-events: none; }
@container (max-width: 460px) { .l57-note { display: none; } }

.l57-burger { position: relative; width: 6cqw; height: 6cqw; display: grid; place-items: center; }
.l57-burger span { position: absolute; left: 1.4cqw; right: 1.4cqw; height: 1.5px; border-radius: 1px; background: ${G.ink};
  transition-property: transform; transition-duration: 220ms; transition-timing-function: cubic-bezier(.3,.8,.3,1); }
.l57-burger span:first-child { transform: translateY(-0.6cqw); }
.l57-burger span:last-child { transform: translateY(0.6cqw); }
.l57-burger[data-open] span:first-child { transform: rotate(45deg); }
.l57-burger[data-open] span:last-child { transform: rotate(-45deg); }

.l57-menu { opacity: 0; translate: 0 -1.2cqw; visibility: hidden;
  transition-property: opacity, translate, visibility; transition-duration: 150ms, 150ms, 0ms; transition-delay: 0ms, 0ms, 150ms; transition-timing-function: ease-out; }
.l57-menu[data-open] { opacity: 1; translate: 0 0; visibility: visible; transition-duration: 200ms, 200ms, 0ms; transition-delay: 0ms; }

.h2c .l57-item { color: ${G.idle}; text-decoration: none; }
.h2c .l57-item[data-on] { color: ${G.ink}; }
@media (hover: hover) and (pointer: fine) {
  .h2c .l57-item:not([data-on]):hover { color: ${G.ink}; }
}
@media (prefers-reduced-motion: reduce) {
  .l57-burger span { transition-duration: 0ms; }
  .l57-menu, .l57-menu[data-open] { translate: 0 0; transition-property: opacity, visibility; }
}
`
