"use client"

import * as React from "react"
import Link from "next/link"

import { uiCopy, type Lang } from "@/lib/companies"
import { EMAIL } from "@/lib/content"
import { nextPostSlug, posts, writingCopy, type PostSlug } from "@/lib/posts"

import { fontHand } from "../../kit"
import { G, LANGS, TravelRing, langKeys, useBox, useCopy } from "../../round-2/h/chrome"
import { BracketNote, Highlight, Note, PEN_CSS, Stroke, arrowPath, cut, ringPath, type Rect } from "../../round-2/e/pen"
import { MARKS, UI } from "./marks"

/**
 * Group i (round 3): the finished post page. Every piece is the same page
 * assembled from the kept parts, so the five can differ only where they
 * choose to:
 *
 * - 36's header in the white band, the current page (Writing) ringed by the
 *   pen, EN / NO as two quiet letters at the end of it;
 * - 02's rail at 40% grey, the section you are reading in ink;
 * - 21/22/23's restrained pen: one bracket, one highlighter, one ring, and
 *   the ring only ever on a fact; 23's switch to take the pen away;
 * - 19's read next, one title and one arrow, which turns the page here;
 * - 38's footer, which is only the address and its copy button.
 */

export type MarkKind = "ring" | "hl" | "bracket"

/* ───────────────────────── state ───────────────────────── */

/** The post being read, its language, and read next that turns the page. */
export function usePost(slug0: PostSlug, lang0: Lang, scrollerRef: React.RefObject<HTMLDivElement | null>) {
  const [slug, setSlug] = React.useState<PostSlug>(slug0)
  const [lang, setLang] = React.useState<Lang>(lang0)
  const [turns, setTurns] = React.useState(0)
  const follow = React.useCallback(() => {
    setSlug((s) => nextPostSlug(s))
    setTurns((n) => n + 1)
    scrollerRef.current?.scrollTo({ top: 0, behavior: "auto" })
  }, [scrollerRef])
  return { slug, lang, setLang, turns, follow, key: `${slug}-${lang}-${turns}` }
}

/** False for a beat after `key` changes, so marks mount off and then draw. */
export function useArmed(key: string, ms = 140) {
  const [armed, setArmed] = React.useState<string | null>(null)
  React.useEffect(() => {
    const t = window.setTimeout(() => setArmed(key), ms)
    return () => window.clearTimeout(t)
  }, [key, ms])
  return armed === key
}

/**
 * Scroll-spy over `[data-section]`: `active` is the section past a line a
 * third of the way down (the rail's ink); `reached` is the furthest section
 * that has come well into view (the pen's cue); `end` turns true once
 * `[data-end]` is on screen. All reset when `key` changes.
 */
export function useSpy(scrollerRef: React.RefObject<HTMLDivElement | null>, key: string) {
  const [state, setState] = React.useState({ active: 0, reached: -1, first: -1, end: false, key })

  React.useEffect(() => {
    const el = scrollerRef.current
    if (!el) return
    let max = -1
    let first = -1
    let end = false
    let raf = 0
    const read = () => {
      raf = 0
      const base = el.getBoundingClientRect().top - el.scrollTop
      const top = (s: Element) => s.getBoundingClientRect().top - base
      const tops = Array.from(el.querySelectorAll("[data-section]")).map(top)
      const below = (f: number) => {
        let i = 0
        tops.forEach((t, k) => {
          if (t <= el.scrollTop + el.clientHeight * f) i = k
        })
        return i
      }
      const atEnd = el.scrollTop + el.clientHeight >= el.scrollHeight - 2
      max = Math.max(max, below(0.86))
      if (first < 0) first = max
      const tail = el.querySelector("[data-end]")
      if (tail && top(tail) <= el.scrollTop + el.clientHeight * 0.88) end = true
      setState({ active: atEnd ? tops.length - 1 : below(0.34), reached: max, first, end, key })
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(read)
    }
    raf = requestAnimationFrame(read)
    el.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      el.removeEventListener("scroll", onScroll)
      cancelAnimationFrame(raf)
    }
  }, [scrollerRef, key])

  const go = React.useCallback(
    (i: number) => {
      const el = scrollerRef.current
      const s = el?.querySelectorAll<HTMLElement>("[data-section]")[i]
      if (!el || !s) return
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      const y = s.getBoundingClientRect().top - el.getBoundingClientRect().top + el.scrollTop
      el.scrollTo({ top: i === 0 ? 0 : y - el.clientHeight * 0.12, behavior: reduce ? "auto" : "smooth" })
    },
    [scrollerRef],
  )

  const fresh = state.key === key
  return {
    active: fresh ? state.active : 0,
    reached: fresh ? state.reached : -1,
    /** How far the page was already in view when it loaded. */
    first: fresh ? state.first : -1,
    end: fresh && state.end,
    go,
  }
}

/**
 * Every `[data-mark]` inside the box in the box's own coordinates, plus `u`:
 * one cqw in px, read off the column (`col` cqw wide).
 */
export function useMarkRects(boxRef: React.RefObject<HTMLElement | null>, col: number, key: string) {
  const [state, setState] = React.useState<{ rects: Record<string, Rect>; u: number }>({ rects: {}, u: 0 })
  React.useLayoutEffect(() => {
    const box = boxRef.current
    if (!box) return
    let alive = true
    const measure = () => {
      if (!alive) return
      const b = box.getBoundingClientRect()
      const rects: Record<string, Rect> = {}
      box.querySelectorAll<HTMLElement>("[data-mark]").forEach((el) => {
        const r = el.getBoundingClientRect()
        rects[el.dataset.mark!] = { x: r.left - b.left, y: r.top - b.top, w: r.width, h: r.height }
      })
      setState({ rects, u: b.width / col })
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(box)
    document.fonts?.ready.then(measure)
    return () => {
      alive = false
      ro.disconnect()
    }
  }, [boxRef, col, key])
  return state
}

/* ───────────────────────── chrome ───────────────────────── */

const NAV = ["about", "portfolio", "writing", "contact"] as const
const HREF = { about: "/about", portfolio: "/portfolio", writing: "/writing", contact: "/contact" }

function navLabel(p: (typeof NAV)[number], lang: Lang) {
  const t = uiCopy[lang]
  return { about: t.navAbout, portfolio: t.navPortfolio, writing: t.navWriting, contact: t.navContact }[p]
}

/** The lab never leaves the lab: links are real links that stay put here. */
const stay = (e: React.MouseEvent) => e.preventDefault()

/** EN / NO as two quiet letters. Arrow keys move between them. */
export function LangSwitch({
  lang,
  setLang,
  style,
}: {
  lang: Lang
  setLang: (l: Lang) => void
  style?: React.CSSProperties
}) {
  const refs = React.useRef<(HTMLElement | null)[]>([])
  return (
    <span
      role="radiogroup"
      aria-label="Language"
      onKeyDown={(e) => langKeys(e, lang, setLang, refs)}
      className="flex items-center gap-[0.6cqw]"
      style={{ fontSize: "1.7cqw", letterSpacing: "0.02em", ...style }}
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
              refs.current[i] = el
            }}
            type="button"
            role="radio"
            aria-checked={lang === l.id}
            aria-label={l.name}
            tabIndex={lang === l.id ? 0 : -1}
            onClick={() => setLang(l.id)}
            className="h2-press h2-hit i3-lang"
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

/** 36's header: the name, the four pages with Writing ringed, EN / NO. */
export function SiteHeader({ lang, setLang, color, on }: { lang: Lang; setLang: (l: Lang) => void; color: string; on: boolean }) {
  const navRef = React.useRef<HTMLElement>(null)
  const here = React.useRef<HTMLSpanElement>(null)
  const box = useBox(navRef, () => here.current, [lang])
  return (
    <header
      className="absolute inset-x-0 top-0 z-10 flex items-center justify-between"
      style={{ height: "7.4cqw", padding: "0 5cqw", background: G.band, boxShadow: `0 1px 0 ${G.edge}`, fontSize: "1.95cqw" }}
    >
      <Link href="/" onClick={stay} className="h2-press h2-hit" style={{ fontWeight: 560, letterSpacing: "-0.006em", textDecoration: "none" }}>
        Christer Hagen
      </Link>
      <nav ref={navRef} aria-label="Main" className="relative flex items-center gap-[3cqw]">
        {NAV.map((p) => (
          <Link
            key={p}
            href={HREF[p]}
            onClick={stay}
            aria-current={p === "writing" ? "page" : undefined}
            className="h2-press h2-hit i3-nav"
            data-on={p === "writing" || undefined}
            style={{ textDecoration: "none" }}
          >
            <span ref={p === "writing" ? here : undefined}>{navLabel(p, lang)}</span>
          </Link>
        ))}
        <LangSwitch lang={lang} setLang={setLang} style={{ marginLeft: "1.2cqw" }} />
        <TravelRing box={box} k={lang} on={on} color={color} />
      </nav>
    </header>
  )
}

/** 02's rail: back to the index, the three sections, the active one in ink. */
export function Rail({
  lang,
  items,
  active,
  onGo,
  children,
}: {
  lang: Lang
  items: readonly string[]
  active: number
  onGo: (i: number) => void
  children?: React.ReactNode
}) {
  return (
    <nav
      aria-label={lang === "en" ? "On this page" : "På denne siden"}
      lang={lang === "en" ? "en" : "nb"}
      className="absolute z-[5] flex flex-col items-start"
      style={{ left: "4.2cqw", top: "14.4cqw", width: "20cqw", gap: "1.15cqw", fontSize: "1.95cqw", lineHeight: 1.35, letterSpacing: "-0.006em" }}
    >
      <Link href="/writing" onClick={stay} className="h2-press h2-hit i3-rail" style={{ marginBottom: "1.4cqw", textDecoration: "none" }}>
        ↩ {writingCopy[lang].backLabel}
      </Link>
      {items.map((r, i) => (
        <button
          key={r}
          type="button"
          onClick={() => onGo(i)}
          aria-current={active === i ? "location" : undefined}
          className="h2-hit i3-rail"
          data-on={active === i || undefined}
        >
          {r}
        </button>
      ))}
      {children}
    </nav>
  )
}

/** 23's one control: take the pen away, or give it back. */
export function PenToggle({
  pen,
  setPen,
  lang,
  color,
  style,
}: {
  pen: boolean
  setPen: (f: (p: boolean) => boolean) => void
  lang: Lang
  color: string
  style?: React.CSSProperties
}) {
  return (
    <button
      type="button"
      aria-pressed={pen}
      onClick={() => setPen((p) => !p)}
      className="h2-press h2-hit i3-toggle flex items-center gap-[0.9cqw]"
      style={{ marginTop: "3.2cqw", ["--pen" as string]: color, ...style }}
    >
      <span
        aria-hidden
        className="i3-dot block rounded-full"
        style={{ width: "1.1cqw", height: "1.1cqw", background: pen ? color : "transparent", boxShadow: `inset 0 0 0 1px ${pen ? color : G.faint}` }}
      />
      {pen ? UI[lang].hide : UI[lang].show}
    </button>
  )
}

/** 19's read next: one title, one arrow; only the arrow moves, and only it takes the pen's colour. */
export function ReadNext({
  slug,
  lang,
  onFollow,
  color,
  inked = false,
}: {
  slug: PostSlug
  lang: Lang
  onFollow: () => void
  color: string
  /** The arrow already wears the pen (45). */
  inked?: boolean
}) {
  const nSlug = nextPostSlug(slug)
  const next = posts[lang][nSlug]
  return (
    <div data-end data-inked={inked || undefined} className="i3-readnext" style={{ marginTop: "6cqw", paddingTop: "2.2cqw", borderTop: `1px solid ${G.hair}`, ["--pen" as string]: color }}>
      <p style={{ fontSize: "0.82em", color: G.faint }}>{writingCopy[lang].readNextLabel}</p>
      <a
        href={`/writing/${nSlug}`}
        onClick={(e) => {
          if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return
          e.preventDefault()
          onFollow()
        }}
        className="h2-press i3-next flex items-center"
        style={{ minHeight: 44, textDecoration: "none" }}
      >
        <span style={{ fontSize: "1.18em", fontWeight: 560, letterSpacing: "-0.012em", lineHeight: 1.25, textWrap: "balance" }}>
          <span className="i3-next-t">{next.title}</span>
          {" "}
          <span aria-hidden data-mark="nextArrow" className="i3-next-a">
            →
          </span>
        </span>
      </a>
      <p className="tabular-nums" style={{ fontSize: "0.82em", color: G.faint }}>
        {next.date} · {next.read}
      </p>
    </div>
  )
}

const COPY: Record<Lang, { copy: string; copied: string; pen: string; manual: string; label: string }> = {
  en: { copy: "Copy", copied: "Copied", pen: "copied", manual: "Selected. Press ⌘C to copy.", label: "Copy email address" },
  no: { copy: "Kopier", copied: "Kopiert", pen: "kopiert", manual: "Markert. Trykk ⌘C for å kopiere.", label: "Kopier e-postadressen" },
}

/** 38's footer: the address and its copy, and nothing else. */
export function AddressFooter({
  lang,
  color,
  pen = true,
  stack = false,
  style,
}: {
  lang: Lang
  color: string
  pen?: boolean
  stack?: boolean
  style?: React.CSSProperties
}) {
  const { state, copy, ref } = useCopy(EMAIL)
  const t = COPY[lang]
  const done = state === "copied"
  return (
    <footer lang={lang === "en" ? "en" : "nb"} style={{ borderTop: `1px solid ${G.hair}`, ["--pen" as string]: color, ...style }}>
      <div className={stack ? "flex flex-col items-start gap-[1.4cqw]" : "flex items-center gap-[2cqw]"}>
        <a ref={ref} href={`mailto:${EMAIL}`} className="i3-mail h2-hit" style={{ fontWeight: 520, letterSpacing: "-0.012em", whiteSpace: "nowrap" }}>
          {EMAIL}
        </a>
        <span className="relative flex items-center">
          <button
            type="button"
            onClick={copy}
            aria-label={done ? t.copied : t.label}
            className="h2-press h2-hit i3-copy"
            data-done={done || undefined}
            style={{ ["--hw" as string]: "44px" }}
          >
            <span aria-hidden className="relative block" style={{ width: "1.05em", height: "1.05em" }}>
              <svg viewBox="0 0 16 16" className="i3-ic i3-ic-copy" fill="none">
                <rect x="5" y="5" width="8.5" height="8.5" rx="2" />
                <path d="M10.5 2.8 H4.8 A2 2 0 0 0 2.8 4.8 V10.5" />
              </svg>
              <svg viewBox="0 0 16 16" className="i3-ic i3-ic-check" fill="none">
                <path pathLength={1} d="M3.2 8.6 L6.6 11.8 L12.8 4.6" />
              </svg>
            </span>
            <span aria-hidden className="grid">
              <span className="i3-w" data-on={!done || undefined}>
                {t.copy}
              </span>
              <span className="i3-w" data-on={done || undefined}>
                {t.copied}
              </span>
            </span>
          </button>
          {pen ? (
            <span
              aria-hidden
              className="i3-penword absolute"
              data-on={done || undefined}
              style={{ left: "calc(100% + 1.2cqw)", top: "-0.3em", fontFamily: fontHand, fontSize: "1.45em", color }}
            >
              {t.pen}
            </span>
          ) : null}
        </span>
      </div>
      <p aria-live="polite" style={{ marginTop: "1cqw", minHeight: "1.4em", fontSize: "0.8em", color: state === "manual" ? G.ink : "transparent" }}>
        {state === "manual" ? t.manual : done ? t.copied : ""}
      </p>
    </footer>
  )
}

/* ───────────────────────── the post ───────────────────────── */

export type ArticleCtx = { rects: Record<string, Rect>; u: number; slug: PostSlug; lang: Lang }

/**
 * The post itself: date line, title, three paragraphs (each a rail section),
 * the pen's marks on them, and whatever comes after (read next). Marks live
 * in the column's own coordinates so they scroll with the words.
 *
 * `layout="margin"` writes the notes in the right margin (desktop);
 * `layout="inline"` writes them under the paragraph (phone), with no arrow
 * and no bracket, since a phone has no margin to carry them.
 */
export function Article({
  slug,
  lang,
  col,
  color,
  wash,
  on,
  delay,
  layout = "margin",
  aside,
  afterParagraph,
  after,
  pen,
  notes,
  rectKey,
}: {
  slug: PostSlug
  lang: Lang
  col: number
  color: string
  wash: string
  on: Record<MarkKind, boolean>
  delay: Record<MarkKind, number>
  layout?: "margin" | "inline"
  aside?: React.ReactNode
  afterParagraph?: (p: number) => React.ReactNode
  after?: React.ReactNode
  pen?: (c: ArticleCtx) => React.ReactNode
  notes?: (c: ArticleCtx) => React.ReactNode
  rectKey: string
}) {
  const boxRef = React.useRef<HTMLDivElement>(null)
  const { rects, u } = useMarkRects(boxRef, col, rectKey)
  const post = posts[lang][slug]
  const m = MARKS[lang][slug]
  const inline = layout === "inline"
  const ctx: ArticleCtx = { rects, u, slug, lang }

  const ringR = rects.ring
  const noteAt = (r: Rect | undefined): Rect | undefined =>
    r && u ? { x: (col + 3.4) * u, y: r.y - 0.4 * u, w: 20 * u, h: 3 * u } : undefined
  const ringNote = noteAt(ringR)
  const arrow = ringR && ringNote ? arrowPath(ringR, ringNote, u, 0.8) : null

  const inlineNote = (kind: MarkKind, text: string) => (
    <span
      aria-hidden
      className="r1a-write block"
      data-on={on[kind] || undefined}
      style={{
        fontFamily: fontHand,
        fontSize: "1.18em",
        lineHeight: 1,
        color,
        rotate: "-1.5deg",
        margin: "1cqw 0 0 auto",
        width: "fit-content",
        maxWidth: "88%",
        textAlign: "right",
        transitionDelay: on[kind] ? `${delay[kind] + 700}ms` : "0ms",
      }}
    >
      {text}
    </span>
  )

  return (
    <div ref={boxRef} className="relative" lang={lang === "en" ? "en" : "nb"}>
      {u ? (
        <svg aria-hidden className="pointer-events-none absolute inset-0 h-full w-full" style={{ overflow: "visible" }}>
          <g fill="none" stroke={color} strokeWidth={Math.max(1.2, u * 0.26)} strokeLinecap="round" strokeLinejoin="round">
            {ringR ? <Stroke d={ringPath(ringR, u)} on={on.ring} delay={delay.ring} dur={640} /> : null}
            {arrow && !inline ? <Stroke d={arrow.line} on={on.ring} delay={delay.ring + 560} dur={420} /> : null}
            {arrow && !inline ? <Stroke d={arrow.head} on={on.ring} delay={delay.ring + 960} dur={160} /> : null}
            {pen?.(ctx)}
          </g>
        </svg>
      ) : null}

      {!inline && ringNote ? (
        <Note color={color} on={on.ring} delay={delay.ring + 1040} style={{ left: ringNote.x, top: ringNote.y, width: "19cqw" }}>
          {m.ring.note}
        </Note>
      ) : null}
      {!inline && rects.hl && u ? (
        <Note color={color} on={on.hl} delay={delay.hl + 900} style={{ left: (col + 3) * u, top: rects.hl.y - 0.3 * u, width: "19cqw" }}>
          {m.hl.note}
        </Note>
      ) : null}
      {notes?.(ctx)}

      <div className="relative">
        <div className="tabular-nums" style={{ fontSize: "0.72em", letterSpacing: "0.02em", color: G.grey, marginBottom: "0.75em" }}>
          <time dateTime={post.dateISO}>{post.date}</time> · {post.read}
        </div>
        <h1 style={{ margin: "0 0 1.2em", fontSize: "1.44em", lineHeight: 1.18, fontWeight: 560, letterSpacing: "-0.012em", textWrap: "balance" }}>
          {post.title}
        </h1>
        {aside}
      </div>

      {post.body.map((text, p) => {
        let content: React.ReactNode = text
        if (m.ring.p === p) {
          const [a, b, c] = cut(text, m.ring.phrase)
          content = (
            <>
              {a}
              <span data-mark="ring" className="inline-block whitespace-nowrap">
                {b}
              </span>
              {c}
            </>
          )
        } else if (m.hl.p === p) {
          const [a, b, c] = cut(text, m.hl.phrase)
          content = (
            <>
              {a}
              <span data-mark="hl">
                <Highlight text={b} on={on.hl} color={wash} delay={delay.hl} />
              </span>
              {c}
            </>
          )
        }
        const bracket = m.bracket.p === p && !inline
        return (
          <section key={p} data-section style={{ position: "relative", marginTop: p ? "1.3em" : 0 }}>
            <p style={{ margin: 0, position: "relative", textWrap: "pretty" }}>
              {content}
              {bracket ? (
                <BracketNote color={color} on={on.bracket} delay={delay.bracket}>
                  {m.bracket.note}
                </BracketNote>
              ) : null}
            </p>
            {inline && m.ring.p === p ? inlineNote("ring", m.ring.note) : null}
            {inline && m.hl.p === p ? inlineNote("hl", m.hl.note) : null}
            {afterParagraph?.(p)}
          </section>
        )
      })}

      {after}
    </div>
  )
}

/** Everything the shared parts need besides the touch contract in h/chrome. */
export const POST_CSS = `
${PEN_CSS}
/* A gap longer than the path, so an undrawn stroke leaves no round-cap dot behind. */
.e-stroke { stroke-dasharray: 1 1.1; stroke-dashoffset: 1.002; }
.i3-scroll { scrollbar-width: none; overscroll-behavior: contain; }
.i3-scroll::-webkit-scrollbar { display: none; }
.i3-nav { color: ${G.idle}; }
.i3-nav[data-on] { color: ${G.ink}; }
.i3-lang { color: ${G.faint}; font-weight: 560; }
.i3-lang[data-on] { color: ${G.ink}; cursor: default; }
.i3-rail { color: ${G.idle}; text-align: left; transition-property: color; transition-duration: 220ms; transition-timing-function: ease-out; }
.i3-rail[data-on] { color: ${G.ink}; }
.i3-toggle { color: ${G.ink}; }
.i3-dot { transition-property: background-color, box-shadow; transition-duration: 200ms; }

.i3-next { color: ${G.ink}; }
.i3-next-t { text-decoration-line: underline; text-decoration-thickness: 1px; text-underline-offset: 0.2em; text-decoration-color: transparent;
  transition-property: text-decoration-color; transition-duration: 180ms; }
.i3-next-a { display: inline-block; color: ${G.grey}; transition-property: translate, color; transition-duration: 220ms, 180ms; transition-timing-function: cubic-bezier(.3,.8,.3,1), ease; }
.i3-readnext[data-inked] .i3-next-a { color: var(--pen); transition-delay: 0ms, 600ms; }
.i3-next:focus-visible .i3-next-a { color: var(--pen); translate: 0.22em 0; }

.i3-mail { text-decoration-line: underline; text-decoration-thickness: 1px; text-underline-offset: 0.22em; text-decoration-color: ${G.faint};
  transition-property: text-decoration-color; transition-duration: 180ms; }
.i3-copy { display: inline-flex; align-items: center; gap: 0.4em; height: 2.2em; padding: 0 0.7em 0 0.6em; border-radius: 0.6em; font-size: 0.9em;
  color: ${G.grey}; box-shadow: inset 0 0 0 1px ${G.hair};
  transition-property: transform, color, background-color, box-shadow; transition-duration: 140ms, 160ms, 160ms, 160ms; transition-timing-function: cubic-bezier(.2,.8,.3,1); }
.i3-copy[data-done] { color: var(--pen); box-shadow: inset 0 0 0 1px color-mix(in oklch, var(--pen) 30%, transparent); background-color: color-mix(in oklch, var(--pen) 6%, transparent); }
.i3-ic { position: absolute; inset: 0; width: 100%; height: 100%; stroke: currentColor; stroke-width: 1.5; stroke-linecap: round; stroke-linejoin: round;
  transition-property: opacity, transform; transition-duration: 160ms, 220ms; transition-timing-function: ease, cubic-bezier(.2,.8,.3,1); }
.i3-ic-check { opacity: 0; transform: scale(0.6); }
.i3-ic-check path { stroke-width: 1.8; stroke-dasharray: 1; stroke-dashoffset: 1; transition-property: stroke-dashoffset; transition-duration: 260ms; transition-delay: 60ms; }
.i3-copy[data-done] .i3-ic-copy { opacity: 0; transform: scale(0.6); }
.i3-copy[data-done] .i3-ic-check { opacity: 1; transform: none; }
.i3-copy[data-done] .i3-ic-check path { stroke-dashoffset: 0; }
.i3-w { grid-area: 1 / 1; opacity: 0; transition-property: opacity; transition-duration: 140ms; }
.i3-w[data-on] { opacity: 1; }
.i3-penword { white-space: nowrap; rotate: -4deg; line-height: 1; pointer-events: none; clip-path: inset(-30% 100% -30% -4%); opacity: 0;
  transition-property: clip-path, opacity; transition-duration: 0ms, 260ms; }
.i3-penword[data-on] { clip-path: inset(-30% -4% -30% -4%); opacity: 1; transition-duration: 520ms, 0ms; transition-delay: 120ms, 0ms; transition-timing-function: cubic-bezier(.4,0,.3,1); }

@media (hover: hover) and (pointer: fine) {
  .i3-nav:not([data-on]):hover, .i3-lang:not([data-on]):hover, .i3-rail:not([data-on]):hover { color: ${G.ink}; }
  .i3-toggle:hover { color: var(--pen); }
  .i3-next:hover .i3-next-a { color: var(--pen); translate: 0.22em 0; }
  .i3-next:hover .i3-next-t { text-decoration-color: ${G.faint}; }
  .i3-mail:hover { text-decoration-color: ${G.ink}; }
  .i3-copy:not([data-done]):hover { color: ${G.ink}; background-color: rgba(18,18,18,0.035); }
}
@media (prefers-reduced-motion: reduce) {
  .i3-rail, .i3-dot { transition-duration: 0ms; }
  .i3-next-a { transition-property: color; }
  .i3-next:hover .i3-next-a, .i3-readnext[data-inked] .i3-next-a { color: var(--pen); transition-delay: 0ms, 600ms; }
.i3-next:focus-visible .i3-next-a { translate: none; }
  .i3-copy { transition-property: color, background-color, box-shadow; }
  .i3-ic, .i3-ic-check, .i3-copy[data-done] .i3-ic-copy { transform: none; }
  .i3-ic-check path { transition: none; stroke-dashoffset: 0; }
  .i3-penword, .i3-penword[data-on] { clip-path: none; transition-property: opacity; transition-duration: 200ms; transition-delay: 0ms; }
}
`
