"use client"

import * as React from "react"
import Link from "next/link"

import { companies, uiCopy, type CompanySlug, type Lang } from "@/lib/companies"
import { EMAIL, contactContent, homeContent } from "@/lib/content"
import { postOrder, posts, type PostSlug } from "@/lib/posts"

import { fontHand, useSeen } from "../../kit"
import { Frame, G, LANGS, TravelRing, langKeys, tagOf, useBox, useCopy, useReducedMotion } from "../../round-2/h/chrome"

/**
 * Group j (round 3): home, about and writing as finished pages. The parts
 * every page here is assembled from, each one a kept piece:
 *
 * - the header in the white band, the current page ringed by the pen, EN / NO
 *   as two quiet letters (36);
 * - the fixed 40% rail where a page has sections, the active item ink (02);
 * - links without colour that open a small card saying what the thing is (07);
 * - the writing as a ledger, the newest under the highlighter (32, 05);
 * - the footer that is only the address, with copy (38, 17).
 *
 * One pen per piece: the ring, the highlighter (a wash of the same ink), the
 * open link's underline, the copy check and the margin note all share it.
 */

export { G, TravelRing, fontHand, tagOf, useBox, useReducedMotion }
export type { Lang }

export const wash = (pen: string) => `color-mix(in oklch, ${pen} 22%, transparent)`

/** Links stay inside the lab: the hrefs are the real ones, the click is kept. */
export const stay = (e: React.MouseEvent) => {
  if (e.metaKey || e.ctrlKey || e.shiftKey) return
  e.preventDefault()
}

/** An internal link: next/link with the real href, kept inside the lab on a plain click. */
export function Go({ onClick, ...props }: React.ComponentProps<typeof Link>) {
  return (
    <Link
      {...props}
      onClick={(e) => {
        onClick?.(e)
        stay(e)
      }}
    />
  )
}

export const ddmm = (iso: string) => `${iso.slice(8, 10)}/${iso.slice(5, 7)}`

/**
 * The shared CSS. Every group-j piece puts the same rules on the page, so
 * the pen is never baked in: each frame sets --j-pen and the rules read it.
 */
export function siteCss() {
  const pen = "var(--j-pen)"
  const hl = wash(pen)
  return `
.j-scroll { scrollbar-width: none; overscroll-behavior: contain; }
.j-scroll::-webkit-scrollbar { display: none; }
.j-nav { color: ${G.idle}; text-decoration: none; transition-property: color, transform; transition-duration: 180ms, 140ms; }
.j-nav[data-on] { color: ${G.ink}; }
.j-lang { color: ${G.faint}; font-weight: 560; }
.j-lang[data-on] { color: ${G.ink}; cursor: default; }
.j-link { color: inherit; text-decoration-line: underline; text-decoration-thickness: 1px; text-underline-offset: 0.42cqw;
  text-decoration-color: rgba(18,18,18,0.24); transition-property: text-decoration-color; transition-duration: 180ms; }
.j-link[data-on] { text-decoration-color: ${pen}; }
.j-card { transition-property: left, top, opacity, translate; transition-duration: 220ms, 220ms, 160ms, 160ms; transition-timing-function: cubic-bezier(.2,.7,.2,1); }
.j-hl { background-image: linear-gradient(${hl}, ${hl}); background-repeat: no-repeat; background-position: 0 62%; background-size: 0% 80%;
  -webkit-box-decoration-break: clone; box-decoration-break: clone;
  transition-property: background-size; transition-duration: 0ms; transition-timing-function: cubic-bezier(.4,.1,.3,1); }
.j-hl[data-on] { background-size: 100% 80%; transition-duration: 520ms; transition-delay: var(--d, 120ms); }
.j-rest { transition-property: color, opacity; transition-duration: 240ms; }
[data-grey] .j-rest { color: rgba(18,18,18,0.32); transition-duration: 480ms; transition-delay: 760ms; }
.j-note { position: absolute; font-family: ${fontHand}; color: ${pen}; line-height: 0.95; pointer-events: none;
  opacity: 0; rotate: -6deg; translate: -0.6cqw 0.4cqw; transition-property: opacity, rotate, translate; transition-duration: 0ms; }
.j-note[data-on] { opacity: 1; rotate: -3deg; translate: 0 0; transition-duration: 360ms; transition-delay: 900ms; transition-timing-function: cubic-bezier(.2,.8,.2,1); }
.j-row { color: ${G.ink}; text-decoration: none; transition-property: background-color; transition-duration: 140ms; }
.j-mail { text-decoration-line: underline; text-decoration-thickness: 1px; text-underline-offset: 0.22em; text-decoration-color: ${G.faint};
  transition-property: text-decoration-color; transition-duration: 180ms; }
.j-copy { display: inline-flex; align-items: center; gap: 0.4em; height: 2.2em; padding: 0 0.7em 0 0.6em; border-radius: 0.6em;
  color: ${G.grey}; box-shadow: inset 0 0 0 1px ${G.hair};
  transition-property: transform, color, background-color, box-shadow; transition-duration: 140ms, 160ms, 160ms, 160ms; transition-timing-function: cubic-bezier(.2,.8,.3,1); }
.j-copy[data-done] { color: ${pen}; box-shadow: inset 0 0 0 1px color-mix(in oklch, ${pen} 30%, transparent); background-color: color-mix(in oklch, ${pen} 6%, transparent); }
.j-i { position: absolute; inset: 0; width: 100%; height: 100%; stroke: currentColor; stroke-width: 1.5; stroke-linecap: round; stroke-linejoin: round;
  transition-property: opacity, transform; transition-duration: 160ms, 220ms; transition-timing-function: ease, cubic-bezier(.2,.8,.3,1); }
.j-check { opacity: 0; transform: scale(0.6); }
.j-check path { stroke-width: 1.8; stroke-dasharray: 1; stroke-dashoffset: 1; transition-property: stroke-dashoffset; transition-duration: 260ms; transition-delay: 60ms; }
.j-copy[data-done] .j-glyph { opacity: 0; transform: scale(0.6); }
.j-copy[data-done] .j-check { opacity: 1; transform: none; }
.j-copy[data-done] .j-check path { stroke-dashoffset: 0; }
.j-w { grid-area: 1 / 1; opacity: 0; transition-property: opacity; transition-duration: 140ms; }
.j-w[data-on] { opacity: 1; }
.j-copied { white-space: nowrap; rotate: -4deg; line-height: 1; pointer-events: none; font-family: ${fontHand}; color: ${pen};
  clip-path: inset(-30% 100% -30% -4%); opacity: 0; transition-property: clip-path, opacity; transition-duration: 0ms, 260ms; }
.j-copied[data-on] { clip-path: inset(-30% -4% -30% -4%); opacity: 1; transition-duration: 520ms, 0ms; transition-delay: 120ms, 0ms; transition-timing-function: cubic-bezier(.4,0,.3,1); }
@media (hover: hover) and (pointer: fine) {
  .j-nav:not([data-on]):hover, .j-lang:not([data-on]):hover { color: ${G.ink}; }
  .j-link:not([data-on]):hover, .j-mail:hover { text-decoration-color: ${G.ink}; }
  .j-row:hover { background-color: rgba(18,18,18,0.022); }
  .j-copy:not([data-done]):hover { color: ${G.ink}; background-color: rgba(18,18,18,0.035); }
}
@media (prefers-reduced-motion: reduce) {
  .j-nav, .j-link, .j-card, .j-hl, .j-hl[data-on], .j-rest, [data-grey] .j-rest, .j-row, .j-mail, .j-w { transition-duration: 0ms !important; transition-delay: 0ms !important; }
  .j-note, .j-note[data-on] { rotate: -3deg; translate: 0 0; transition-property: opacity; transition-duration: 160ms; transition-delay: 0ms; }
  .j-copy { transition-property: color, background-color, box-shadow; }
  .j-i, .j-check, .j-copy[data-done] .j-glyph { transform: none; }
  .j-check path { transition: none; stroke-dashoffset: 0; }
  .j-copied, .j-copied[data-on] { clip-path: none; transition-property: opacity; transition-duration: 200ms; transition-delay: 0ms; }
}
`
}

/* ------------------------------------------------------------------ header */

export type NavPage = "about" | "portfolio" | "writing" | "contact"
export type Current = "home" | NavPage
export const NAV: NavPage[] = ["about", "portfolio", "writing", "contact"]

export function navLabel(p: NavPage, lang: Lang) {
  const t = uiCopy[lang]
  return { about: t.navAbout, portfolio: t.navPortfolio, writing: t.navWriting, contact: t.navContact }[p]
}

/** EN / NO, two quiet letters; arrow keys move between them. */
export function LangSwitch({ lang, setLang, size = "1.7cqw" }: { lang: Lang; setLang: (l: Lang) => void; size?: string }) {
  const refs = React.useRef<(HTMLElement | null)[]>([])
  return (
    <span
      role="radiogroup"
      aria-label="Language"
      onKeyDown={(e) => langKeys(e, lang, setLang, refs)}
      className="flex items-center"
      style={{ gap: "0.6cqw", fontSize: size, letterSpacing: "0.02em" }}
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
              refs.current[i] = el
            }}
            type="button"
            role="radio"
            aria-checked={lang === l.id}
            aria-label={l.name}
            tabIndex={lang === l.id ? 0 : -1}
            onClick={() => setLang(l.id)}
            className="h2-press h2-hit j-lang"
            data-on={lang === l.id || undefined}
            style={{ ["--hw" as string]: "30px" }}
          >
            {l.label}
          </button>
        </React.Fragment>
      ))}
    </span>
  )
}

/** 36's header: the name, the four pages with the current one ringed, EN / NO. */
export function Header({
  current,
  lang,
  setLang,
  pen,
  seen,
  nav = true,
}: {
  current: Current
  lang: Lang
  setLang: (l: Lang) => void
  pen: string
  seen: boolean
  /** false: a one-page site, so the band holds only the name and the language. */
  nav?: boolean
}) {
  const navRef = React.useRef<HTMLDivElement>(null)
  const items = React.useRef<Partial<Record<NavPage, HTMLSpanElement | null>>>({})
  const box = useBox(navRef, () => (nav && current !== "home" ? items.current[current] : null), [current, lang, nav])

  return (
    <header
      data-band
      className="sticky top-0 z-20 flex items-center justify-between"
      style={{ height: "7.4cqw", padding: "0 5cqw", background: G.band, boxShadow: `0 1px 0 ${G.edge}`, fontSize: "1.95cqw" }}
    >
      <Go
        href="/"
        aria-current={current === "home" ? "page" : undefined}
        className="h2-press h2-hit"
        style={{ fontWeight: 560, letterSpacing: "-0.006em", textDecoration: "none" }}
      >
        Christer Hagen
      </Go>

      <div ref={navRef} className="relative flex items-center" style={{ gap: "3cqw" }}>
        {nav ? (
          <nav aria-label="Main" className="flex items-center" style={{ gap: "3cqw" }}>
            {NAV.map((p) => (
              <Go
                key={p}
                href={`/${p}`}
                aria-current={current === p ? "page" : undefined}
                className="h2-press h2-hit j-nav"
                data-on={current === p || undefined}
              >
                <span
                  ref={(el) => {
                    items.current[p] = el
                  }}
                >
                  {navLabel(p, lang)}
                </span>
              </Go>
            ))}
          </nav>
        ) : null}
        <span style={{ marginLeft: nav ? "1.2cqw" : 0 }}>
          <LangSwitch lang={lang} setLang={setLang} />
        </span>
        {nav ? <TravelRing box={box} k={current} on={seen && current !== "home"} color={pen} /> : null}
      </div>
    </header>
  )
}

/* -------------------------------------------------------------------- rail */

function topIn(scroller: HTMLElement, el: HTMLElement) {
  return el.getBoundingClientRect().top - scroller.getBoundingClientRect().top + scroller.scrollTop
}

/**
 * Which `[data-section]` owns the reading line a third of the way down the
 * scroller, and `go(i)` to bring one under the sticky band.
 */
export function useSections(scrollerRef: React.RefObject<HTMLDivElement | null>) {
  const reduced = useReducedMotion()
  const [active, setActive] = React.useState(0)

  React.useEffect(() => {
    const el = scrollerRef.current
    if (!el) return
    let raf = 0
    const read = () => {
      raf = 0
      const secs = Array.from(el.querySelectorAll<HTMLElement>("[data-section]"))
      const line = el.scrollTop + el.clientHeight * 0.34
      let i = 0
      secs.forEach((s, k) => {
        if (topIn(el, s) <= line) i = k
      })
      const atEnd = el.scrollTop + el.clientHeight >= el.scrollHeight - 2
      setActive(atEnd ? Math.max(0, secs.length - 1) : i)
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(read)
    }
    read()
    el.addEventListener("scroll", onScroll, { passive: true })
    const ro = new ResizeObserver(onScroll)
    ro.observe(el)
    return () => {
      el.removeEventListener("scroll", onScroll)
      ro.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [scrollerRef])

  const go = React.useCallback(
    (i: number) => {
      const el = scrollerRef.current
      if (!el) return
      const s = el.querySelectorAll<HTMLElement>("[data-section]")[i]
      if (!s) return
      const band = el.querySelector<HTMLElement>("[data-band]")?.offsetHeight ?? 0
      const top = i === 0 ? 0 : Math.max(0, topIn(el, s) - band - el.clientWidth * 0.03)
      el.scrollTo({ top, behavior: reduced ? "auto" : "smooth" })
    },
    [scrollerRef, reduced],
  )

  return { active, go }
}

/** 02's fixed rail: items at 40% grey, the one you are reading in ink. */
export function Rail({
  head,
  items,
  active,
  onPick,
  ring,
}: {
  head?: React.ReactNode
  items: string[]
  active: number
  onPick: (i: number) => void
  /** When set, the pen ring sits on the active item and travels with it. */
  ring?: { pen: string; on: boolean }
}) {
  const listRef = React.useRef<HTMLDivElement>(null)
  const refs = React.useRef<(HTMLSpanElement | null)[]>([])
  const box = useBox(listRef, () => (ring ? refs.current[active] : null), [active, !!ring, items.join("|")])

  return (
    <nav
      aria-label="On this page"
      className="absolute"
      style={{ left: "4.6cqw", top: "14.8cqw", width: "18cqw", fontSize: "1.95cqw", lineHeight: 1.35, letterSpacing: "-0.006em" }}
    >
      {head ? <div style={{ color: G.idle, marginBottom: "1.6cqw" }}>{head}</div> : null}
      <div ref={listRef} className="relative flex flex-col items-start">
        {items.map((it, i) => (
          <button
            key={it}
            type="button"
            onClick={() => onPick(i)}
            aria-current={active === i ? "location" : undefined}
            className="h2-press h2-hit j-nav"
            data-on={active === i || undefined}
            style={{ padding: "0.6cqw 0", ["--hw" as string]: "44px" }}
          >
            <span
              ref={(el) => {
                refs.current[i] = el
              }}
            >
              {it}
            </span>
          </button>
        ))}
        {ring ? <TravelRing box={box} k={String(active)} on={ring.on} color={ring.pen} padX={0.4} padY={0.34} /> : null}
      </div>
    </nav>
  )
}

/** benji's section heading: a grey label with a hairline running right. */
export function Rule({ children, top = "6cqw" }: { children: React.ReactNode; top?: string }) {
  return (
    <h2 className="flex items-center" style={{ margin: `${top} 0 1.4cqw`, gap: "1.6cqw", color: G.grey, fontSize: "inherit", fontWeight: 460 }}>
      <span className="shrink-0">{children}</span>
      <span aria-hidden className="h-px flex-1" style={{ background: G.hair }} />
    </h2>
  )
}

export const TITLE: React.CSSProperties = { fontSize: "3.1cqw", lineHeight: 1.18, fontWeight: 560, letterSpacing: "-0.012em", textWrap: "balance" }
export const META: React.CSSProperties = { fontSize: "1.75cqw", lineHeight: 1.3 }

/* ------------------------------------------------------------------ footer */

const COPY: Record<Lang, { copy: string; copied: string; pen: string; manual: string; label: string }> = {
  en: { copy: "Copy", copied: "Copied", pen: "copied", manual: "Selected. Press ⌘C to copy.", label: "Copy email address" },
  no: { copy: "Kopier", copied: "Kopiert", pen: "kopiert", manual: "Markert. Trykk ⌘C for å kopiere.", label: "Kopier e-postadressen" },
}

/** 38's footer: the address with 17's copy beside it, and where he is. Nothing else. */
export function Footer({
  lang,
  left = "28cqw",
  width = "44cqw",
  scale = 1,
  pen = true,
}: {
  lang: Lang
  left?: string
  width?: string
  /** Multiplies every size, for the phone. */
  scale?: number
  /** Whether the pen writes "copied" beside the button. */
  pen?: boolean
}) {
  const { state, copy, ref } = useCopy(EMAIL)
  const t = COPY[lang]
  const done = state === "copied"
  const s = (n: number) => `${(n * scale).toFixed(2)}cqw`

  return (
    <footer style={{ marginTop: s(9), borderTop: `1px solid ${G.hair}`, padding: `${s(5.4)} 0 ${s(7)}` }}>
      <div style={{ marginLeft: left, width }}>
        <div className="flex flex-wrap items-center" style={{ gap: `${s(1.2)} ${s(2)}` }}>
          <a
            ref={ref}
            href={`mailto:${EMAIL}`}
            className="j-mail h2-hit"
            style={{ fontSize: s(2.4), fontWeight: 520, letterSpacing: "-0.012em", whiteSpace: "nowrap" }}
          >
            {EMAIL}
          </a>
          <span className="relative flex items-center">
            <button
              type="button"
              onClick={copy}
              aria-label={done ? t.copied : t.label}
              className="h2-press h2-hit j-copy"
              data-done={done || undefined}
              style={{ fontSize: s(1.85), ["--hw" as string]: "44px" }}
            >
              <span aria-hidden className="relative block" style={{ width: "1.05em", height: "1.05em" }}>
                <svg viewBox="0 0 16 16" className="j-i j-glyph" fill="none">
                  <rect x="5" y="5" width="8.5" height="8.5" rx="2" />
                  <path d="M10.5 2.8 H4.8 A2 2 0 0 0 2.8 4.8 V10.5" />
                </svg>
                <svg viewBox="0 0 16 16" className="j-i j-check" fill="none">
                  <path pathLength={1} d="M3.2 8.6 L6.6 11.8 L12.8 4.6" />
                </svg>
              </span>
              <span aria-hidden className="grid">
                <span className="j-w" data-on={!done || undefined}>
                  {t.copy}
                </span>
                <span className="j-w" data-on={done || undefined}>
                  {t.copied}
                </span>
              </span>
            </button>
            {pen ? (
              <span
                aria-hidden
                className="j-copied absolute"
                data-on={done || undefined}
                style={{ left: `calc(100% + ${s(1.2)})`, top: s(-0.4), fontSize: s(3.1) }}
              >
                {t.pen}
              </span>
            ) : null}
          </span>
        </div>
        <p aria-live="polite" style={{ marginTop: s(1.6), fontSize: s(1.75), color: state === "manual" ? G.ink : G.faint }}>
          {state === "manual" ? t.manual : contactContent[lang].availability}
        </p>
      </div>
    </footer>
  )
}

/* ---------------------------------------------------------------- previews */

export type PKey = CompanySlug | "nav" | "github"

/** End years the site states (lib/content work periods, lib/companies body). */
const ENDED: Partial<Record<CompanySlug, string>> = { refenze: "2018", sailsdock: "2026", docdir: "2026" }

type Card = { name: string; line: string; meta: string; status?: string }

export function cardOf(k: PKey, lang: Lang): Card {
  const since = lang === "en" ? "since" : "siden"
  if (k === "nav") {
    const w = homeContent[lang].work.find((x) => x.name === "Not Another VC")!
    const [role, what] = w.role.split(" · ")
    return { name: w.name, line: `${what}.`, meta: `${role} · ${w.period.toLowerCase()}`, status: companies[lang].codebase.status }
  }
  if (k === "github") {
    const h = homeContent[lang]
    return {
      name: "github.com/Codehagen",
      line: h.oss.map((o) => `${o.name}, ${o.desc.charAt(0).toLowerCase()}${o.desc.slice(1)} (${o.stars} ★)`).join(". ") + ".",
      meta: h.lblOss,
    }
  }
  const c = companies[lang][k]
  const end = ENDED[k]
  return { name: c.name, line: c.tagline, meta: `${c.role} · ${end ? `${c.year}–${end}` : `${since} ${c.year}`}`, status: c.status }
}

type Part = string | { k: PKey; t: string } | { hl: string }

/** Cuts `text` at the first appearance of each needle; the words stay the site's own. */
export function cut(text: string, links: [string, PKey][], hl?: string): Part[] {
  let parts: Part[] = [text]
  const needles: [string, PKey | null][] = [...links, ...(hl ? [[hl, null] as [string, null]] : [])]
  for (const [needle, k] of needles) {
    parts = parts.flatMap((p) => {
      if (typeof p !== "string") return [p]
      const i = p.indexOf(needle)
      if (i < 0) return [p]
      const mid: Part = k ? { k, t: needle } : { hl: needle }
      const out: Part[] = [p.slice(0, i), mid, p.slice(i + needle.length)]
      return out.filter((x) => x !== "")
    })
  }
  return parts
}

/**
 * A paragraph whose named things are 07's colourless links. Point at one (or
 * focus it, or tap it) and a card opens under the paragraph, lined up with
 * the word, saying what it is. Esc or leaving closes it.
 */
export function Linked({
  text,
  links,
  lang,
  hl,
  hlOn = false,
  hlRef,
  onOpen,
  className = "",
  style,
  children,
}: {
  text: string
  links: [string, PKey][]
  lang: Lang
  /** A phrase in the text to put under the highlighter. */
  hl?: string
  hlOn?: boolean
  hlRef?: React.RefObject<HTMLSpanElement | null>
  onOpen?: (open: boolean) => void
  className?: string
  style?: React.CSSProperties
  children?: React.ReactNode
}) {
  const box = React.useRef<HTMLDivElement>(null)
  const para = React.useRef<HTMLParagraphElement>(null)
  const cardRef = React.useRef<HTMLDivElement>(null)
  const refs = React.useRef<Partial<Record<PKey, HTMLButtonElement | null>>>({})
  const [open, setOpenState] = React.useState<PKey | null>(null)
  const [pos, setPos] = React.useState<{ x: number; y: number } | null>(null)
  const id = React.useId()

  const openRef = React.useRef<PKey | null>(null)
  const setOpen = React.useCallback(
    (k: PKey | null) => {
      const was = openRef.current !== null
      openRef.current = k
      setOpenState(k)
      // Only the edges: closed → open and open → closed.
      if (was !== (k !== null)) onOpen?.(k !== null)
    },
    [onOpen],
  )
  const onOpenRef = React.useRef(onOpen)
  React.useEffect(() => {
    onOpenRef.current = onOpen
  })
  // Unmounted while open (the language re-set the page): let go of it.
  React.useEffect(
    () => () => {
      if (openRef.current !== null) onOpenRef.current?.(false)
    },
    [],
  )

  React.useLayoutEffect(() => {
    if (!open) return
    const place = () => {
      const el = refs.current[open]
      const b = box.current
      const p = para.current
      if (!el || !b || !p) return
      const r = el.getClientRects()[0] ?? el.getBoundingClientRect()
      const o = b.getBoundingClientRect()
      const w = cardRef.current?.offsetWidth ?? 0
      setPos({
        x: Math.min(Math.max(r.left - o.left, 0), Math.max(0, o.width - w)),
        y: p.getBoundingClientRect().bottom - o.top + o.width * 0.025,
      })
    }
    place()
    const ro = new ResizeObserver(place)
    if (box.current) ro.observe(box.current)
    return () => ro.disconnect()
  }, [open])

  React.useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null)
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [open, setOpen])

  const card = open ? cardOf(open, lang) : null

  return (
    <div ref={box} className="relative">
      <p ref={para} className={`relative ${className}`} style={{ margin: 0, textWrap: "pretty", ...style }}>
        {cut(text, links, hl).map((p, i) => {
          if (typeof p === "string") return <span key={i}>{p}</span>
          if ("hl" in p)
            return (
              <span key={i} ref={hlRef} className="j-hl" data-on={hlOn || undefined} style={{ color: G.ink }}>
                {p.hl}
              </span>
            )
          const k = p.k
          return (
            <button
              key={i}
              type="button"
              ref={(el) => {
                refs.current[k] = el
              }}
              onPointerEnter={(e) => e.pointerType === "mouse" && setOpen(k)}
              onPointerLeave={(e) => e.pointerType === "mouse" && setOpen(null)}
              onFocus={() => setOpen(k)}
              onBlur={() => setOpen(null)}
              onClick={() => setOpen(k)}
              aria-expanded={open === k}
              aria-controls={id}
              className="j-link inline"
              data-on={open === k || undefined}
              style={{ font: "inherit", color: "inherit", display: "inline", textAlign: "inherit" }}
            >
              {p.t}
            </button>
          )
        })}
        {children}
      </p>

      <div
        ref={cardRef}
        id={id}
        role="status"
        aria-live="polite"
        className="j-card absolute z-10"
        style={{
          left: pos?.x ?? 0,
          top: pos?.y ?? 0,
          width: "30cqw",
          padding: "1.4cqw 1.9cqw 1.6cqw",
          borderRadius: "1.2cqw",
          background: G.band,
          boxShadow: "0 0 0 1px rgba(18,18,18,0.07), 0 1px 2px rgba(18,18,18,0.04), 0 10px 28px -10px rgba(18,18,18,0.14)",
          fontSize: "1.8cqw",
          lineHeight: 1.38,
          color: G.ink,
          opacity: card && pos ? 1 : 0,
          translate: card && pos ? "0 0" : "0 0.6cqw",
          pointerEvents: "none",
          visibility: card ? "visible" : "hidden",
        }}
      >
        {card ? (
          <>
            <span className="flex items-baseline justify-between" style={{ gap: "1.6cqw" }}>
              <span style={{ fontWeight: 560 }}>{card.name}</span>
              {card.status ? <span style={{ color: G.grey, whiteSpace: "nowrap" }}>{card.status}</span> : null}
            </span>
            <span className="block" style={{ marginTop: "0.5cqw", color: G.grey, textWrap: "pretty" }}>
              {card.line}
            </span>
            <span className="block tabular-nums" style={{ marginTop: "0.4cqw", color: G.faint }}>
              {card.meta}
            </span>
          </>
        ) : null}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------ the writing */

export type Row = { slug: PostSlug; title: string; excerpt: string; read: string; iso: string; date: string; year: string }

/** Newest first, in the language asked for. */
export function rowsOf(lang: Lang): Row[] {
  return [...postOrder]
    .map((slug) => {
      const p = posts[lang][slug]
      return { slug, title: p.title, excerpt: p.excerpt, read: p.read, iso: p.dateISO, date: p.date, year: p.dateISO.slice(0, 4) }
    })
    .sort((a, b) => b.iso.localeCompare(a.iso))
}

/**
 * 32's ledger on a page: year once per group, title, read time, dd/mm in
 * tabular figures. The newest title takes the highlighter; the rest of the
 * ledger steps back.
 */
export function Ledger({
  lang,
  on,
  note,
  listRef,
  excerpts = false,
}: {
  lang: Lang
  on: boolean
  /** The pen's line beside the newest, in the right margin. */
  note?: string
  listRef?: React.RefObject<HTMLUListElement | null>
  excerpts?: boolean
}) {
  const rows = rowsOf(lang)
  return (
    <ul ref={listRef} className="tabular-nums" data-grey={on || undefined}>
      {rows.map((r, i) => {
        const first = i === 0 || rows[i - 1].year !== r.year
        const newest = i === 0
        return (
          <li key={r.slug} className="relative" style={{ borderTop: `1px solid ${i === 0 ? "rgba(18,18,18,0.14)" : G.hair}` }}>
            <Go
              href={`/writing/${r.slug}`}
              className="j-row grid items-baseline"
              style={{ gridTemplateColumns: "6cqw 1fr auto auto", whiteSpace: "normal", columnGap: "1.2cqw", padding: "1.1cqw 0", minHeight: 44 }}
            >
              <span className={newest ? "" : "j-rest"} style={{ color: G.grey }}>
                {first ? r.year : ""}
              </span>
              <span className="block min-w-0">
                <span className={newest ? "j-hl" : "j-rest"} data-on={newest && on ? true : undefined} style={{ fontWeight: 520 }}>
                  {r.title}
                </span>
                {excerpts ? (
                  <span className="j-rest block" style={{ marginTop: "0.3cqw", color: G.grey, ...META, textWrap: "pretty" }}>
                    {r.excerpt}
                  </span>
                ) : null}
              </span>
              <span className={newest ? "" : "j-rest"} style={{ color: G.grey, whiteSpace: "nowrap" }}>
                {r.read}
              </span>
              <span className={`text-right ${newest ? "" : "j-rest"}`} style={{ color: G.grey }}>
                {ddmm(r.iso)}
              </span>
            </Go>
            {newest && note ? (
              <span aria-hidden className="j-note" data-on={on || undefined} style={{ left: "calc(100% + 3.4cqw)", top: "0.6cqw", width: "21cqw", fontSize: "3.2cqw" }}>
                ← {note}
              </span>
            ) : null}
          </li>
        )
      })}
    </ul>
  )
}

/* -------------------------------------------------------------- the frame */

/**
 * A whole page in the frame: the scroller with the sticky band, the column,
 * the footer, and the rail fixed outside the scroll. `rail` gets `seen`.
 */
export function Site({
  label,
  pen,
  current,
  lang,
  setLang,
  scrollerRef,
  rail,
  nav = true,
  children,
}: {
  label: string
  pen: string
  current: Current
  lang: Lang
  setLang: (l: Lang) => void
  scrollerRef: React.RefObject<HTMLDivElement | null>
  rail?: (seen: boolean) => React.ReactNode
  nav?: boolean
  children: React.ReactNode
}) {
  const [seenRef, seen] = useSeen<HTMLDivElement>()
  return (
    <Frame label={label} style={{ ["--j-pen" as string]: pen }}>
      <style>{siteCss()}</style>
      <div ref={seenRef} className="absolute inset-0">
        <div
          ref={scrollerRef}
          tabIndex={0}
          aria-label={label}
          className="j-scroll absolute inset-0 overflow-x-hidden overflow-y-auto"
          style={{ outline: "none" }}
        >
          <Header current={current} lang={lang} setLang={setLang} pen={pen} seen={seen} nav={nav} />
          <main key={lang} lang={tagOf(lang)} className="h2-reset" style={{ marginLeft: "28cqw", width: "44cqw", paddingTop: "7.4cqw" }}>
            {children}
          </main>
          <Footer lang={lang} />
        </div>
        {rail ? rail(seen) : null}
      </div>
    </Frame>
  )
}
