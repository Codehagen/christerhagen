"use client"

import * as React from "react"
import Link from "next/link"

import { uiCopy, type Lang } from "@/lib/companies"
import { writingCopy } from "@/lib/posts"

import { useSeen } from "../../kit"
import { Frame, G, TravelRing, tagOf, useBox, useReducedMotion } from "../../round-2/h/chrome"
import { AddressFooter, LangSwitch, POST_CSS, useArmed } from "../../round-3/i/post"

/**
 * Group p (round 5): long posts in the settled frame (DESIGN.md), where the
 * structure comes from Christer's subject instead of benji's /stageshow.
 *
 * The frame is 41's page brought up to DESIGN.md: #FDFDFC under benji's
 * 128px eased top fade (no band, no edge line), the header row inside it with
 * Writing ringed by the blue pen, the rail at 4.2cqw, the 44cqw column from
 * 28cqw, the address footer. Clickable grey is 0.6. Each piece swaps one
 * benji device (the rail TOC, hairline headings, superscript footnotes,
 * margin commentary) for one of its own.
 */

export type { Lang }
export { G, tagOf, useReducedMotion }

export const PEN = "#2B5CD8"
export const WASH = "color-mix(in oklch, #2B5CD8 16%, transparent)"
/** Anything clickable that rests in grey (DESIGN §2). */
export const IDLE = "rgba(18,18,18,0.6)"
export const MUTED = "rgba(18,18,18,0.5)"
export const FAINT = "rgba(18,18,18,0.3)"
export const HAIR = "rgba(18,18,18,0.09)"
export const RULE = "rgba(18,18,18,0.14)"

/** Column: 44cqw wide from 28cqw. The pen's margin starts 3.4cqw past it. */
export const COL = 44
export const LEFT = 28

/** benji's top fade, verbatim (DESIGN §2), at 128px of a 1200px page. */
const FADE =
  "linear-gradient(rgb(255 255 255) 0px, rgb(255 255 255 / 0.737) 19%, rgb(255 255 255 / 0.54) 34%, rgb(255 255 255 / 0.38) 47%, rgb(255 255 255 / 0.28) 56.5%, rgb(255 255 255 / 0.192) 65%, rgb(255 255 255 / 0.125) 73%, rgb(255 255 255 / 0.075) 80.2%, rgb(255 255 255 / 0.043) 86.1%, rgb(255 255 255 / 0.02) 91%, rgb(255 255 255 / 0.008) 95.2%, rgb(255 255 255 / 0.004) 98.2%, rgb(255 255 255 / 0))"

/** The lab never leaves the lab: links are real links that stay put. */
export const stay = (e: React.MouseEvent) => {
  if (e.metaKey || e.ctrlKey || e.shiftKey) return
  e.preventDefault()
}

/* ───────────────────────── reading ───────────────────────── */

/**
 * The scroller, read once a frame: `active` is the `[data-section]` past a
 * line 34% down (the rail), `depth` is how far down the reader has seen in
 * scroller px (86% of the view, never going back), `first` is the depth at
 * load, `progress` is how far through `[data-body]` the reading line is, and
 * `end` turns true once `[data-end]` is on screen. All reset when `key` does.
 */
export function useReading(scrollerRef: React.RefObject<HTMLDivElement | null>, key: string) {
  const [s, set] = React.useState({ active: 0, depth: 0, first: 0, progress: 0, end: false, key })
  const reduced = useReducedMotion()

  React.useEffect(() => {
    const el = scrollerRef.current
    if (!el) return
    let depth = 0
    let first = -1
    let raf = 0
    const read = () => {
      raf = 0
      const base = el.getBoundingClientRect().top - el.scrollTop
      const top = (n: Element) => n.getBoundingClientRect().top - base
      const tops = Array.from(el.querySelectorAll("[data-section]")).map(top)
      const line = el.scrollTop + el.clientHeight * 0.34
      let active = 0
      tops.forEach((t, k) => {
        if (t <= line) active = k
      })
      const atEnd = el.scrollTop + el.clientHeight >= el.scrollHeight - 2
      depth = Math.max(depth, el.scrollTop + el.clientHeight * 0.86)
      if (first < 0) first = depth
      const body = el.querySelector("[data-body]")
      let progress = 0
      if (body) {
        const bt = top(body)
        const bh = (body as HTMLElement).offsetHeight
        progress = atEnd ? 1 : Math.min(1, Math.max(0, (el.scrollTop + el.clientHeight * 0.5 - bt) / bh))
      }
      const tail = el.querySelector("[data-end]")
      const end = !!tail && top(tail) <= el.scrollTop + el.clientHeight * 0.92
      set({ active: atEnd ? Math.max(0, tops.length - 1) : active, depth, first, progress, end, key })
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(read)
    }
    raf = requestAnimationFrame(read)
    el.addEventListener("scroll", onScroll, { passive: true })
    const ro = new ResizeObserver(onScroll)
    ro.observe(el)
    return () => {
      el.removeEventListener("scroll", onScroll)
      ro.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [scrollerRef, key])

  /** Brings an element (or section i) to 12% below the top. */
  const goTo = React.useCallback(
    (target: number | HTMLElement | null) => {
      const el = scrollerRef.current
      if (!el) return
      const node = typeof target === "number" ? el.querySelectorAll<HTMLElement>("[data-section]")[target] : target
      if (!node) return
      const y = node.getBoundingClientRect().top - el.getBoundingClientRect().top + el.scrollTop
      el.scrollTo({ top: target === 0 ? 0 : Math.max(0, y - el.clientHeight * 0.18), behavior: reduced ? "auto" : "smooth" })
    },
    [scrollerRef, reduced],
  )

  const fresh = s.key === key
  return {
    active: fresh ? s.active : 0,
    depth: fresh ? s.depth : 0,
    first: fresh ? s.first : 0,
    progress: fresh ? s.progress : 0,
    end: fresh && s.end,
    goTo,
  }
}

/** One cqw in px, read off the column, plus every `[data-mark]` in the column's coordinates. */
export type Rect = { x: number; y: number; w: number; h: number }
export function useMarks(boxRef: React.RefObject<HTMLElement | null>, key: string) {
  const [st, setSt] = React.useState<{ rects: Record<string, Rect>; u: number; top: number }>({ rects: {}, u: 0, top: 0 })
  React.useLayoutEffect(() => {
    const box = boxRef.current
    if (!box) return
    let alive = true
    const measure = () => {
      if (!alive) return
      const b = box.getBoundingClientRect()
      const rects: Record<string, Rect> = {}
      box.querySelectorAll<HTMLElement>("[data-mark]").forEach((n) => {
        const r = n.getBoundingClientRect()
        rects[n.dataset.mark!] = { x: r.left - b.left, y: r.top - b.top, w: r.width, h: r.height }
      })
      setSt({ rects, u: b.width / COL, top: box.offsetTop })
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(box)
    document.fonts?.ready.then(measure)
    return () => {
      alive = false
      ro.disconnect()
    }
  }, [boxRef, key])
  return st
}

/* ───────────────────────── the page ───────────────────────── */

const NAV = ["about", "portfolio", "writing", "contact"] as const

function navLabel(p: (typeof NAV)[number], lang: Lang) {
  const t = uiCopy[lang]
  return { about: t.navAbout, portfolio: t.navPortfolio, writing: t.navWriting, contact: t.navContact }[p]
}

/** The header row inside the top fade: the name, the four pages with Writing ringed, EN / NO. */
function Header({ lang, setLang, on }: { lang: Lang; setLang: (l: Lang) => void; on: boolean }) {
  const navRef = React.useRef<HTMLElement>(null)
  const here = React.useRef<HTMLSpanElement>(null)
  const box = useBox(navRef, () => here.current, [lang])
  return (
    <header
      className="absolute inset-x-0 top-0 z-[11] flex items-center justify-between"
      style={{ height: "7.4cqw", padding: "0 5cqw", fontSize: "1.95cqw" }}
    >
      <Link href="/" onClick={stay} className="h2-press h2-hit" style={{ fontWeight: 560, letterSpacing: "-0.006em", textDecoration: "none" }}>
        Christer Hagen
      </Link>
      <nav ref={navRef} aria-label="Main" className="relative flex items-center" style={{ gap: "3cqw" }}>
        {NAV.map((p) => (
          <Link
            key={p}
            href={`/${p}`}
            onClick={stay}
            aria-current={p === "writing" ? "page" : undefined}
            className="h2-press h2-hit p5-nav"
            data-on={p === "writing" || undefined}
          >
            <span ref={p === "writing" ? here : undefined}>{navLabel(p, lang)}</span>
          </Link>
        ))}
        <LangSwitch lang={lang} setLang={setLang} style={{ marginLeft: "1.2cqw" }} />
        <TravelRing box={box} k={lang} on={on} color={PEN} />
      </nav>
    </header>
  )
}

/** The rail: ↩ All writing, then whatever the piece puts there instead of a TOC. */
export function Rail({ lang, children, label }: { lang: Lang; children: React.ReactNode; label?: string }) {
  return (
    <nav
      aria-label={label ?? (lang === "en" ? "On this page" : "På denne siden")}
      lang={tagOf(lang)}
      className="absolute z-10 flex flex-col items-start"
      style={{ left: "4.2cqw", top: "14.4cqw", width: "20cqw", gap: "1.15cqw", fontSize: "1.95cqw", lineHeight: 1.35, letterSpacing: "-0.006em" }}
    >
      <Link href="/writing" onClick={stay} className="h2-press h2-hit p5-rail" style={{ marginBottom: "1.4cqw", textDecoration: "none" }}>
        ↩ {writingCopy[lang].backLabel}
      </Link>
      {children}
    </nav>
  )
}

/** Rail items that jump to their section; the one you are reading is ink. */
export function RailItems({ items, active, onGo, tabular }: { items: readonly string[]; active: number; onGo: (i: number) => void; tabular?: boolean }) {
  return (
    <>
      {items.map((r, i) => (
        <button
          key={r}
          type="button"
          onClick={() => onGo(i)}
          aria-current={active === i ? "location" : undefined}
          className={`h2-hit p5-rail${tabular ? " tabular-nums" : ""}`}
          data-on={active === i || undefined}
        >
          {r}
        </button>
      ))}
    </>
  )
}

const PEN_UI: Record<Lang, { hide: string; show: string }> = {
  en: { hide: "Hide the pen", show: "Show the pen" },
  no: { hide: "Skjul pennen", show: "Vis pennen" },
}

/** DESIGN §3: a plain button whose label says what it will do, with the pen's dot. */
export function PenToggle({ pen, setPen, lang }: { pen: boolean; setPen: (f: (p: boolean) => boolean) => void; lang: Lang }) {
  return (
    <button type="button" onClick={() => setPen((p) => !p)} className="h2-press h2-hit p5-toggle flex items-center" style={{ marginTop: "3.2cqw", gap: "0.9cqw" }}>
      <span
        aria-hidden
        className="p5-dot block rounded-full"
        style={{ width: "1.1cqw", height: "1.1cqw", background: pen ? PEN : "transparent", boxShadow: `inset 0 0 0 1px ${pen ? PEN : FAINT}` }}
      />
      {pen ? PEN_UI[lang].hide : PEN_UI[lang].show}
    </button>
  )
}

/** The date line and the title, the post's first words. */
export function PostHead({ meta, dateISO, title, read }: { meta: string; dateISO?: string; title: string; read: string }) {
  return (
    <>
      <div className="tabular-nums" style={{ fontSize: "0.72em", letterSpacing: "0.02em", color: MUTED, marginBottom: "0.75em" }}>
        {dateISO ? <time dateTime={dateISO}>{meta}</time> : meta} · {read}
      </div>
      <h1 style={{ margin: "0 0 1.4em", fontSize: "1.44em", lineHeight: 1.18, fontWeight: 560, letterSpacing: "-0.012em", textWrap: "balance" }}>{title}</h1>
    </>
  )
}

export const PARA: React.CSSProperties = { margin: 0, textWrap: "pretty" }
export const PARA_GAP = "1.3em"

/**
 * The whole long post: ground, top fade, header, rail, column, footer.
 * `margin` sits over the page at the right (for a ledger that does not
 * scroll); `children` is the column.
 */
export function LongPage({
  label,
  lang,
  setLang,
  scrollerRef,
  columnRef,
  rail,
  margin,
  css = "",
  children,
}: {
  label: string
  lang: Lang
  setLang: (l: Lang) => void
  scrollerRef: React.RefObject<HTMLDivElement | null>
  columnRef?: React.RefObject<HTMLDivElement | null>
  rail: React.ReactNode
  margin?: React.ReactNode
  css?: string
  children: React.ReactNode
}) {
  const [seenRef, seen] = useSeen<HTMLDivElement>()
  return (
    <Frame label={label}>
      <style>{POST_CSS + P5_CSS + css}</style>
      <div ref={seenRef} className="absolute inset-0">
        <div ref={scrollerRef} className="i3-scroll absolute inset-0 overflow-x-hidden overflow-y-auto" tabIndex={0} aria-label={label}>
          <main key={lang} lang={tagOf(lang)} className="h2-reset" style={{ marginLeft: `${LEFT}cqw`, width: `${COL}cqw`, paddingTop: "14.6cqw" }}>
            <div ref={columnRef} data-soft className="relative">
              {children}
            </div>
          </main>
          <AddressFooter lang={lang} color={PEN} style={{ marginTop: "8cqw", padding: "4.4cqw 0 3cqw 28cqw", fontSize: "2.3cqw" }} />
        </div>
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 z-[9]" style={{ height: "10.7cqw", background: FADE }} />
        <Header lang={lang} setLang={setLang} on={seen} />
        {rail}
        {margin}
      </div>
    </Frame>
  )
}

/** The page state every piece shares: language, the pen, seen + armed. */
export function usePage(lang0: Lang = "en") {
  const [lang, setLang] = React.useState<Lang>(lang0)
  const [pen, setPen] = React.useState(true)
  const armed = useArmed(lang)
  return { lang, setLang, pen, setPen, armed }
}

/** A short pen tick at the column's edge, level with a line, pointing into the margin. */
export function tickPath(y: number, u: number) {
  const x0 = (COL + 0.9) * u
  const x1 = (COL + 2.6) * u
  return `M ${x0} ${y + u * 0.15} Q ${(x0 + x1) / 2} ${y - u * 0.35}, ${x1} ${y - u * 0.1}`
}

const P5_CSS = `
.i3-lang { color: ${IDLE}; }
.i3-lang[data-on] { color: ${G.ink}; }
.i3-copy { color: ${IDLE}; }
.p5-nav { color: ${IDLE}; text-decoration: none; display: inline-block; }
.p5-nav[data-on] { color: ${G.ink}; }
.p5-rail { color: ${IDLE}; text-align: left; text-decoration: none; transition-property: color; transition-duration: 220ms; transition-timing-function: ease-out; }
.p5-rail[data-on] { color: ${G.ink}; }
.p5-toggle { color: ${G.ink}; transition-property: color, transform; transition-duration: 180ms, 140ms; }
.p5-dot { transition-property: background-color, box-shadow; transition-duration: 200ms; }
@media (hover: hover) and (pointer: fine) {
  .p5-nav:not([data-on]):hover, .p5-rail:not([data-on]):hover, .i3-lang:not([data-on]):hover { color: ${G.ink}; }
  .p5-toggle:hover { color: ${PEN}; }
}
@media (prefers-reduced-motion: reduce) {
  .p5-rail, .p5-dot, .p5-toggle { transition-duration: 0ms; }
}
`
