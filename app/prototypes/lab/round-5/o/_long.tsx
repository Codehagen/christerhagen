"use client"

import * as React from "react"
import Link from "next/link"

import { uiCopy, type Lang } from "@/lib/companies"
import { posts, type PostSlug } from "@/lib/posts"

import { useSeen } from "../../kit"
import { Frame, G, TravelRing, tagOf, useBox } from "../../round-2/h/chrome"
import { Note, Stroke, type Rect } from "../../round-2/e/pen"
import {
  AddressFooter,
  LangSwitch,
  PenToggle,
  POST_CSS,
  Rail,
  ReadNext,
  useArmed,
  useMarkRects,
  usePost,
  useSpy,
} from "../../round-3/i/post"
import { longPost } from "./_text"

/**
 * Group o (round 5): figures that are ours. Every piece is the same long post
 * page in the kept frame (41's rail, column, read next and footer; DESIGN.md's
 * header sitting in the 128px top fade instead of a band), and differs only in
 * the one figure set in the column. benji's figure is a grey stage holding a
 * live UI demo with a centred 12px caption; ours are drawn from Christer's
 * subject (a document, a number, a clipping, a distance, a deal), sit on the
 * ground itself, and carry their caption left-aligned in the column.
 *
 * The pen makes one mark per page, on the figure, once it is in view: the
 * figure is the point of the piece, so the prose keeps none of its own.
 */

export const COL = 44
export const PEN = "#2B5CD8"
export const WASH = "color-mix(in oklch, #2B5CD8 16%, transparent)"

/** benji's eased white-to-transparent fade, copied from DESIGN.md. */
const FADE =
  "linear-gradient(rgb(255 255 255) 0px, rgb(255 255 255 / 0.737) 19%, rgb(255 255 255 / 0.54) 34%, rgb(255 255 255 / 0.38) 47%, rgb(255 255 255 / 0.28) 56.5%, rgb(255 255 255 / 0.192) 65%, rgb(255 255 255 / 0.125) 73%, rgb(255 255 255 / 0.075) 80.2%, rgb(255 255 255 / 0.043) 86.1%, rgb(255 255 255 / 0.02) 91%, rgb(255 255 255 / 0.008) 95.2%, rgb(255 255 255 / 0.004) 98.2%, rgb(255 255 255 / 0))"

/** Clickable grey is never lighter than 0.6 (DESIGN.md). */
export const INTERACTIVE = "rgba(18,18,18,0.6)"

export type FigureProps = {
  lang: Lang
  /** The figure is in view, the page has settled and the pen is on. */
  on: boolean
  color: string
}

export type FigureAt = {
  slug: PostSlug
  section: number
  /** Index of the paragraph in that section the figure follows. */
  after: number
  Figure: React.ComponentType<FigureProps>
}

/* ───────────────────────── chrome ───────────────────────── */

const NAV = ["about", "portfolio", "writing", "contact"] as const
const stay = (e: React.MouseEvent) => e.preventDefault()

/** 36's header with no band of its own: it sits in the top fade (DESIGN.md §4). */
function Header({ lang, setLang, on }: { lang: Lang; setLang: (l: Lang) => void; on: boolean }) {
  const navRef = React.useRef<HTMLElement>(null)
  const here = React.useRef<HTMLSpanElement>(null)
  const box = useBox(navRef, () => here.current, [lang])
  const t = uiCopy[lang]
  const label = { about: t.navAbout, portfolio: t.navPortfolio, writing: t.navWriting, contact: t.navContact }
  return (
    <header
      className="absolute inset-x-0 top-0 z-10 flex items-center justify-between"
      style={{ height: "7.4cqw", padding: "0 5cqw", fontSize: "1.95cqw" }}
    >
      <Link href="/" onClick={stay} className="h2-press h2-hit" style={{ fontWeight: 560, letterSpacing: "-0.006em", textDecoration: "none" }}>
        Christer Hagen
      </Link>
      <nav ref={navRef} aria-label="Main" className="relative flex items-center gap-[3cqw]">
        {NAV.map((p) => (
          <Link
            key={p}
            href={`/${p}`}
            onClick={stay}
            aria-current={p === "writing" ? "page" : undefined}
            className="h2-press h2-hit o5-nav"
            data-on={p === "writing" || undefined}
            style={{ textDecoration: "none", display: "inline-block" }}
          >
            <span ref={p === "writing" ? here : undefined}>{label[p]}</span>
          </Link>
        ))}
        <LangSwitch lang={lang} setLang={setLang} style={{ marginLeft: "1.2cqw" }} />
        <TravelRing box={box} k={lang} on={on} color={PEN} />
      </nav>
    </header>
  )
}

/** DESIGN.md's Rule: a grey label with a hairline running right. */
function RuleHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="flex items-center" style={{ margin: "6cqw 0 1.4cqw", gap: "1.6cqw", fontSize: "1em", fontWeight: 460, color: G.grey }}>
      {children}
      <span aria-hidden className="block flex-1" style={{ height: 1, background: G.hair }} />
    </h2>
  )
}

/** Watches the figure inside the page's own scroller; once seen, it stays seen. */
function FigureSlot({
  scrollerRef,
  children,
}: {
  scrollerRef: React.RefObject<HTMLDivElement | null>
  children: (inView: boolean) => React.ReactNode
}) {
  const ref = React.useRef<HTMLDivElement>(null)
  const [inView, setInView] = React.useState(false)
  React.useEffect(() => {
    const el = ref.current
    const root = scrollerRef.current
    if (!el || !root) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) {
          setInView(true)
          io.disconnect()
        }
      },
      { root, threshold: 0.7 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [scrollerRef])
  return (
    <div ref={ref} style={{ margin: "3cqw 0 3.2cqw" }}>
      {children(inView)}
    </div>
  )
}

/* ───────────────────────── the page ───────────────────────── */

export function LongPost({ label, lang: lang0, figure, css = "" }: { label: string; lang: Lang; figure: FigureAt; css?: string }) {
  const [seenRef, seen] = useSeen<HTMLDivElement>()
  const scrollerRef = React.useRef<HTMLDivElement>(null)
  const { slug, lang, setLang, follow, key } = usePost(figure.slug, lang0, scrollerRef)
  const armed = useArmed(key)
  const { active, go } = useSpy(scrollerRef, key)
  const [pen, setPen] = React.useState(true)
  const post = posts[lang][slug]
  const { sections } = longPost(lang, slug)
  const live = seen && armed && pen
  const F = figure.Figure

  return (
    <Frame label={label}>
      <style>{POST_CSS + O_CSS + css}</style>
      <div ref={seenRef} className="absolute inset-0">
        <Header lang={lang} setLang={setLang} on={seen} />
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 z-[4]" style={{ height: "19.7cqw", background: FADE }} />

        <div ref={scrollerRef} className="i3-scroll absolute inset-0 overflow-x-hidden overflow-y-auto" tabIndex={0} aria-label={label}>
          <main key={key} lang={tagOf(lang)} className="h2-reset" style={{ marginLeft: "28cqw", width: `${COL}cqw`, paddingTop: "13.8cqw" }}>
            <div data-soft>
              <article>
                <div className="tabular-nums" style={{ fontSize: "0.72em", letterSpacing: "0.02em", color: G.grey, marginBottom: "0.75em" }}>
                  <time dateTime={post.dateISO}>{post.date}</time>
                </div>
                <h1 style={{ margin: "0 0 1.2em", fontSize: "1.44em", lineHeight: 1.18, fontWeight: 560, letterSpacing: "-0.012em", textWrap: "balance" }}>
                  {post.title}
                </h1>
                {sections.map((s, i) => (
                  <section key={s.name} data-section style={{ position: "relative" }}>
                    {i > 0 ? <RuleHeading>{s.name}</RuleHeading> : null}
                    {s.paras.map((text, j) => (
                      <React.Fragment key={j}>
                        <p style={{ margin: j ? "1.3em 0 0" : 0, textWrap: "pretty" }}>{text}</p>
                        {slug === figure.slug && figure.section === i && figure.after === j ? (
                          <FigureSlot scrollerRef={scrollerRef}>{(inView) => <F lang={lang} on={live && inView} color={PEN} />}</FigureSlot>
                        ) : null}
                      </React.Fragment>
                    ))}
                  </section>
                ))}
                <ReadNext slug={slug} lang={lang} onFollow={follow} color={PEN} />
              </article>
            </div>
          </main>
          <AddressFooter lang={lang} color={PEN} style={{ marginTop: "8cqw", padding: "4.4cqw 0 3cqw 28cqw", fontSize: "2.3cqw" }} />
        </div>

        <Rail lang={lang} items={sections.map((s) => s.name)} active={active} onGo={go}>
          <PenToggle pen={pen} setPen={setPen} lang={lang} color={PEN} />
        </Rail>
      </div>
    </Frame>
  )
}

/* ───────────────────────── figure parts ───────────────────────── */

/** Every `[data-mark]` in a figure's box, plus u (1cqw in px, off the column). */
export function useFigureRects(boxRef: React.RefObject<HTMLElement | null>, key: string) {
  return useMarkRects(boxRef, COL, key)
}

/** The figure's own caption: 12px, muted, left-aligned under the figure in the column. */
export function Caption({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <figcaption style={{ marginTop: "1.6cqw", maxWidth: "38cqw", fontSize: "1.85cqw", lineHeight: 1.3, color: G.grey, textWrap: "pretty", ...style }}>
      {children}
    </figcaption>
  )
}

/** The svg a figure's strokes are drawn on, in the figure's own px. */
export function PenSvg({ u, color, children }: { u: number; color: string; children: React.ReactNode }) {
  if (!u) return null
  return (
    <svg aria-hidden className="pointer-events-none absolute inset-0 h-full w-full" style={{ overflow: "visible" }}>
      <g fill="none" stroke={color} strokeWidth={Math.max(1.2, u * 0.26)} strokeLinecap="round" strokeLinejoin="round">
        {children}
      </g>
    </svg>
  )
}

/**
 * A tight prose ring (DESIGN.md §3: rx = w/2 + 0.55u, ry = h/2 + 0.8u) that
 * starts top-left, goes round once and overshoots the start.
 */
export function tightRing(p: Rect, u: number) {
  const cx = p.x + p.w / 2
  const cy = p.y + p.h / 2
  const rx = p.w / 2 + u * 0.75
  const ry = p.h / 2 + u * 0.8
  return [
    `M ${cx - rx * 0.86} ${cy - ry * 0.74}`,
    `C ${cx - rx * 0.3} ${cy - ry * 1.16}, ${cx + rx} ${cy - ry * 1.1}, ${cx + rx} ${cy + ry * 0.04}`,
    `C ${cx + rx} ${cy + ry * 1.14}, ${cx - rx * 0.62} ${cy + ry * 1.2}, ${cx - rx} ${cy + ry * 0.16}`,
    `C ${cx - rx} ${cy - ry * 0.5}, ${cx - rx * 0.46} ${cy - ry * 1.06}, ${cx + rx * 0.24} ${cy - ry * 1.02}`,
  ].join(" ")
}

/** A hand arrow from one point to another, bowed upward, with a two-stroke head. */
export function handArrow(sx: number, sy: number, ex: number, ey: number, u: number, bow = 2.4) {
  const c1x = sx + (ex - sx) * 0.25
  const c1y = Math.min(sy, ey) - u * bow
  const c2x = sx + (ex - sx) * 0.7
  const c2y = ey - u * bow * 0.5
  const line = `M ${sx} ${sy} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${ex} ${ey}`
  const a = Math.atan2(ey - c2y, ex - c2x)
  const L = u * 1.8
  const h1 = [ex - L * Math.cos(a - 0.5), ey - L * Math.sin(a - 0.5)]
  const h2 = [ex - L * Math.cos(a + 0.5), ey - L * Math.sin(a + 0.5)]
  return { line, head: `M ${h1[0]} ${h1[1]} L ${ex} ${ey} L ${h2[0]} ${h2[1]}` }
}

/** A pen note written in, positioned in the figure's own px. */
export function FigNote({
  children,
  on,
  delay,
  style,
  color = PEN,
}: {
  children: React.ReactNode
  on: boolean
  delay: number
  style: React.CSSProperties
  color?: string
}) {
  return (
    <Note color={color} on={on} delay={delay} style={{ fontSize: "2.5cqw", ...style }}>
      {children}
    </Note>
  )
}

export { Stroke }

const O_CSS = `
.o5-nav { color: ${INTERACTIVE}; }
.o5-nav[data-on] { color: ${G.ink}; }
.i3-rail:not([data-on]) { color: ${INTERACTIVE}; }
.i3-lang:not([data-on]) { color: ${INTERACTIVE}; }
.o5-link { color: ${G.ink}; text-decoration-line: underline; text-decoration-thickness: 1px; text-underline-offset: 0.24em;
  text-decoration-color: rgba(18,18,18,0.22); transition-property: text-decoration-color; transition-duration: 180ms; }
@media (hover: hover) and (pointer: fine) {
  .o5-nav:not([data-on]):hover { color: ${G.ink}; }
  .o5-link:hover { text-decoration-color: ${G.ink}; }
}
`
