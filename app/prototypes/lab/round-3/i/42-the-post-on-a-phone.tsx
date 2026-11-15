"use client"

import * as React from "react"
import Link from "next/link"

import { uiCopy, type Lang } from "@/lib/companies"

import { C, RING, useSeen } from "../../kit"
import { Frame, G, TravelRing, tagOf, useBox, useReducedMotion } from "../../round-2/h/chrome"
import { MARKS } from "./marks"
import {
  AddressFooter,
  Article,
  LangSwitch,
  type MarkKind,
  PenToggle,
  POST_CSS,
  ReadNext,
  usePost,
  useArmed,
  useSpy,
} from "./post"

/**
 * 42 — The post on a phone.
 *
 * The Bodø post in Norwegian at phone width. Nothing is left out, everything
 * moves: the rail becomes one line under the band (the section you are in,
 * in ink); the pen has no margin, so it writes under the paragraph it marks,
 * and the bracket stays home; the header is the name and 40's menu, where
 * the pen rings Tekster and EN / NO and the pen switch wait. Esc closes the
 * menu and hands focus back.
 */

const TEAL = "#0F766E"
const WASH = "color-mix(in oklch, #0F766E 15%, transparent)"
const PHONE = 40
const PAD = 3.6
const COL = PHONE - PAD * 2

const NAV = ["about", "portfolio", "writing", "contact"] as const
const HREF = { about: "/about", portfolio: "/portfolio", writing: "/writing", contact: "/contact" }
const navLabel = (p: (typeof NAV)[number], lang: Lang) => {
  const t = uiCopy[lang]
  return { about: t.navAbout, portfolio: t.navPortfolio, writing: t.navWriting, contact: t.navContact }[p]
}

const css = `
.i42-burger { position: relative; width: 6cqw; height: 6cqw; display: grid; place-items: center; }
.i42-burger span { position: absolute; left: 1.4cqw; right: 1.4cqw; height: 1.5px; border-radius: 1px; background: ${G.ink};
  transition-property: transform; transition-duration: 220ms; transition-timing-function: cubic-bezier(.3,.8,.3,1); }
.i42-burger span:first-child { transform: translateY(-0.6cqw); }
.i42-burger span:last-child { transform: translateY(0.6cqw); }
.i42-burger[data-open] span:first-child { transform: rotate(45deg); }
.i42-burger[data-open] span:last-child { transform: rotate(-45deg); }
.i42-menu { opacity: 0; translate: 0 -1.2cqw; visibility: hidden;
  transition-property: opacity, translate, visibility; transition-duration: 150ms, 150ms, 0ms; transition-delay: 0ms, 0ms, 150ms; transition-timing-function: ease-out; }
.i42-menu[data-open] { opacity: 1; translate: 0 0; visibility: visible; transition-duration: 200ms, 200ms, 0ms; transition-delay: 0ms; }
.i42-item { color: ${G.idle}; }
.i42-item[data-on] { color: ${G.ink}; }
@media (hover: hover) and (pointer: fine) { .i42-item:not([data-on]):hover { color: ${G.ink}; } }
@media (prefers-reduced-motion: reduce) {
  .i42-burger span { transition-duration: 0ms; }
  .i42-menu, .i42-menu[data-open] { translate: 0 0; transition-property: opacity, visibility; }
}
`

const LEAD: Record<Lang, [string, string]> = {
  en: ["The same post, on a phone.", "The rail becomes one line under the band, the pen writes under the paragraph instead of beside it, and the menu holds the rest."],
  no: ["Det samme innlegget, på mobil.", "Skinnen blir én linje under båndet, pennen skriver under avsnittet i stedet for ved siden av, og menyen holder resten."],
}

export default function ThePostOnAPhone() {
  const [seenRef, seen] = useSeen<HTMLDivElement>()
  const reduced = useReducedMotion()
  const scrollerRef = React.useRef<HTMLDivElement>(null)
  const { slug, lang, setLang, follow, key } = usePost("building-in-bodo", "no", scrollerRef)
  const armed = useArmed(key)
  const { active, reached, first, go } = useSpy(scrollerRef, key)
  const [pen, setPen] = React.useState(true)
  const [open, setOpen] = React.useState(false)
  const trigger = React.useRef<HTMLButtonElement>(null)
  const listRef = React.useRef<HTMLUListElement>(null)
  const here = React.useRef<HTMLSpanElement>(null)
  const box = useBox(listRef, () => here.current, [lang, open])
  const m = MARKS[lang][slug]

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

  const live = seen && armed && pen
  const kinds: MarkKind[] = ["ring", "hl"]
  const order = [...kinds].sort((a, b) => m[a].p - m[b].p)
  const on = { ring: false, hl: false, bracket: false } as Record<MarkKind, boolean>
  const delay = { ring: 0, hl: 0, bracket: 0 } as Record<MarkKind, number>
  order.forEach((k, rank) => {
    on[k] = live && reached >= m[k].p
    delay[k] = m[k].p <= first ? 300 + rank * 1300 : 250
  })

  const [bold, grey] = LEAD[lang]

  return (
    <Frame label="The Bodø post at phone width, in Norwegian" style={{ background: C.tile, fontSize: "2.5cqw" }}>
      <style>{POST_CSS + css}</style>

      <p lang={tagOf(lang)} className="absolute" style={{ left: "5.4cqw", top: "5.4cqw", width: "40cqw" }}>
        <span style={{ fontWeight: 560 }}>{bold}</span> <span style={{ color: G.grey }}>{grey}</span>
      </p>

      <div
        ref={seenRef}
        className="absolute overflow-hidden"
        style={{ left: "52cqw", top: "4cqw", width: `${PHONE}cqw`, height: "67cqw", borderRadius: "4.4cqw", background: G.ground, boxShadow: RING }}
      >
        <header
          className="absolute inset-x-0 top-0 z-20 flex items-center justify-between"
          style={{ height: "9cqw", padding: `0 2.2cqw 0 ${PAD}cqw`, background: G.band, boxShadow: `0 1px 0 ${G.edge}`, fontSize: "2.4cqw" }}
        >
          <Link href="/" onClick={(e) => e.preventDefault()} className="h2-press h2-hit" style={{ fontWeight: 560, textDecoration: "none" }}>
            Christer Hagen
          </Link>
          <button
            ref={trigger}
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? (lang === "en" ? "Close menu" : "Lukk menyen") : lang === "en" ? "Open menu" : "Åpne menyen"}
            aria-expanded={open}
            aria-controls="i42-menu"
            className="h2-press h2-hit i42-burger"
            data-open={open || undefined}
            style={{ ["--hw" as string]: "44px" }}
          >
            <span aria-hidden />
            <span aria-hidden />
          </button>
        </header>

        {/* 02's rail, laid on its side: the three sections, the current one in ink. */}
        <nav
          aria-label={lang === "en" ? "On this page" : "På denne siden"}
          lang={tagOf(lang)}
          inert={open || undefined}
          className="absolute inset-x-0 z-10 flex items-center"
          style={{ top: "9cqw", height: "6cqw", padding: `0 ${PAD}cqw`, gap: "2.8cqw", background: G.ground, boxShadow: `0 1px 0 ${G.hair}`, fontSize: "1.85cqw" }}
        >
          {m.rail.map((r, i) => (
            <button
              key={r}
              type="button"
              onClick={() => go(i)}
              aria-current={active === i ? "location" : undefined}
              className="h2-hit i3-rail whitespace-nowrap"
              data-on={active === i || undefined}
            >
              {r}
            </button>
          ))}
        </nav>

        <div
          ref={scrollerRef}
          inert={open || undefined}
          className="i3-scroll absolute inset-x-0 bottom-0 overflow-x-hidden overflow-y-auto"
          style={{ top: "15cqw", fontSize: "2.3cqw" }}
          tabIndex={0}
          aria-label={lang === "en" ? "The post" : "Innlegget"}
        >
          <main key={key} lang={tagOf(lang)} className="h2-reset" style={{ padding: `4.4cqw ${PAD}cqw 0` }}>
            <div data-soft>
              <Article
                slug={slug}
                lang={lang}
                col={COL}
                color={TEAL}
                wash={WASH}
                on={on}
                delay={delay}
                layout="inline"
                rectKey={key}
                after={<ReadNext slug={slug} lang={lang} onFollow={follow} color={TEAL} />}
              />
            </div>
          </main>
          <AddressFooter
            lang={lang}
            color={TEAL}
            pen={false}
            stack
            style={{ margin: `7cqw ${PAD}cqw 0`, padding: "3.6cqw 0 2cqw", fontSize: "2.1cqw" }}
          />
        </div>

        <nav
          id="i42-menu"
          aria-label="Main"
          className="i42-menu absolute inset-x-0 z-20"
          data-open={open || undefined}
          inert={!open || undefined}
          style={{ top: "9cqw", bottom: 0, background: G.ground, padding: `1.6cqw ${PAD}cqw` }}
        >
          <ul ref={listRef} className="relative">
            {NAV.map((p, i) => (
              <li key={p} style={{ borderTop: i > 0 ? `1px solid ${G.hair}` : undefined }}>
                <Link
                  href={HREF[p]}
                  onClick={(e) => {
                    e.preventDefault()
                    window.setTimeout(close, reduced ? 0 : 120)
                  }}
                  aria-current={p === "writing" ? "page" : undefined}
                  className="h2-press i42-item flex w-full items-center"
                  data-on={p === "writing" || undefined}
                  style={{ minHeight: "max(44px, 8.6cqw)", fontSize: "3.2cqw", textDecoration: "none" }}
                >
                  <span ref={p === "writing" ? here : undefined}>{navLabel(p, lang)}</span>
                </Link>
              </li>
            ))}
            <TravelRing box={box} k={`${lang}-${open}`} on={seen && open} color={TEAL} padX={0.45} padY={0.36} />
          </ul>

          <div
            className="flex items-center justify-between"
            style={{ marginTop: "1.6cqw", paddingTop: "1.6cqw", borderTop: `1px solid ${G.hair}`, fontSize: "2.3cqw" }}
          >
            <LangSwitch lang={lang} setLang={setLang} style={{ fontSize: "2.3cqw", gap: "1cqw" }} />
            <PenToggle pen={pen} setPen={setPen} lang={lang} color={TEAL} style={{ marginTop: 0 }} />
          </div>
        </nav>
      </div>
    </Frame>
  )
}
