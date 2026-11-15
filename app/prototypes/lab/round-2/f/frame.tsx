"use client"

import * as React from "react"

import { fontInter } from "../../kit"
import { useReducedMotion } from "../../round-1/c/ground"

/**
 * Group f — the site's pages assembled on benji's ground. Every piece is a
 * whole miniature page of christerhagen.com in the 4:3 frame (100cqw × 75cqw),
 * built on piece 11's frame: #FDFDFC ground, a white band a shade lighter that
 * holds nothing, a fixed 40%-grey rail on the left whose active item darkens,
 * and a centred column that scrolls inside the tile.
 */

export const G = {
  ground: "#FDFDFC",
  band: "#FFFFFF",
  bandEdge: "rgba(18,18,18,0.035)",
  ink: "#111111",
  grey: "rgba(18,18,18,0.46)",
  faint: "rgba(18,18,18,0.3)",
  railIdle: "rgba(18,18,18,0.4)",
  hair: "rgba(18,18,18,0.08)",
} as const

/** Inter 14/20 at 460, scaled to the frame. */
export const TYPE = {
  body: { fontSize: "2.15cqw", lineHeight: 1.43, fontWeight: 460, letterSpacing: "-0.0065em" },
  title: { fontSize: "3.1cqw", lineHeight: 1.18, fontWeight: 560, letterSpacing: "-0.012em" },
  meta: { fontSize: "1.75cqw", lineHeight: 1.3, fontWeight: 460 },
} satisfies Record<string, React.CSSProperties>

const FRAME_CSS = `
.f-scroll { scrollbar-width: none; overscroll-behavior: contain; }
.f-scroll::-webkit-scrollbar { display: none; }
.f-rail-btn { all: unset; cursor: pointer; transition-property: color; transition-duration: 220ms; transition-timing-function: ease-out; touch-action: manipulation; }
.f-rail-btn:focus-visible { outline: 1.5px solid ${G.ink}; outline-offset: 0.4cqw; border-radius: 0.3cqw; }
.f-link { color: inherit; text-decoration-line: underline; text-decoration-thickness: 1px; text-underline-offset: 0.45cqw; text-decoration-color: rgba(18,18,18,0.25); transition-property: text-decoration-color; transition-duration: 180ms; }
@media (hover: hover) and (pointer: fine) { .f-link:hover { text-decoration-color: ${G.ink}; } }
@media (prefers-reduced-motion: reduce) { .f-rail-btn, .f-link { transition-duration: 0ms; } }
`

export function SitePage({
  label,
  scrollerRef,
  rail,
  corner,
  colLeft = 28,
  colWidth = 44,
  lang,
  children,
}: {
  label: string
  scrollerRef: React.RefObject<HTMLDivElement | null>
  rail: React.ReactNode
  corner?: React.ReactNode
  colLeft?: number
  colWidth?: number
  lang?: string
  children: React.ReactNode
}) {
  return (
    <div role="region" aria-label={label} className="@container relative h-full w-full overflow-hidden">
      <style>{FRAME_CSS}</style>
      <div
        className="relative h-full w-full overflow-hidden"
        style={{
          background: G.ground,
          color: G.ink,
          fontFamily: fontInter,
          fontFeatureSettings: '"cv11", "ss01"',
          WebkitFontSmoothing: "antialiased",
          ...TYPE.body,
        }}
      >
        <div
          ref={scrollerRef}
          className="f-scroll absolute inset-0 overflow-x-hidden overflow-y-auto"
          tabIndex={0}
          aria-label={label}
          style={{ outline: "none" }}
        >
          {/* The band: a shade lighter than the page. It frames; it holds nothing. */}
          <div aria-hidden style={{ height: "6.4cqw", background: G.band, boxShadow: `0 1px 0 ${G.bandEdge}` }} />
          <div lang={lang} style={{ marginLeft: `${colLeft}cqw`, width: `${colWidth}cqw`, padding: "7.2cqw 0 26cqw" }}>
            {children}
          </div>
        </div>
        {rail}
        {corner}
      </div>
    </div>
  )
}

/** The fixed left rail: a head line, then items at 40% grey; the active one is ink. */
export function Rail({
  head,
  items,
  active,
  onPick,
  label = "On this page",
  mode = "spy",
}: {
  head: React.ReactNode
  items: React.ReactNode[]
  active: number
  onPick?: (i: number) => void
  label?: string
  /** spy: the rail follows the scroll. filter: the rail picks what the page shows. static: site nav, shown not used. */
  mode?: "spy" | "filter" | "static"
}) {
  return (
    <nav
      aria-label={label}
      className="absolute flex flex-col"
      style={{ left: "4.2cqw", top: "13.6cqw", gap: "0.9cqw", fontSize: "1.95cqw", lineHeight: 1.35, letterSpacing: "-0.006em" }}
    >
      <span style={{ color: G.railIdle, marginBottom: "1.4cqw" }}>{head}</span>
      {items.map((it, i) =>
        mode === "static" ? (
          <span
            key={i}
            aria-current={active === i ? "page" : undefined}
            style={{ color: active === i ? G.ink : G.railIdle }}
          >
            {it}
          </span>
        ) : (
          <button
            key={i}
            type="button"
            className="f-rail-btn"
            onClick={() => onPick?.(i)}
            aria-current={mode === "spy" && active === i ? "location" : undefined}
            aria-pressed={mode === "filter" ? active === i : undefined}
            style={{ color: active === i ? G.ink : G.railIdle }}
          >
            {it}
          </button>
        ),
      )}
    </nav>
  )
}

/** benji's section heading: a grey label with a hairline running right. */
export function Rule({ children, top = "6cqw" }: { children: React.ReactNode; top?: string }) {
  return (
    <h2
      className="flex items-center"
      style={{ margin: `${top} 0 1.4cqw`, gap: "1.6cqw", color: G.grey, fontSize: "inherit", fontWeight: 460 }}
    >
      <span className="shrink-0">{children}</span>
      <span aria-hidden className="h-px flex-1" style={{ background: G.hair }} />
    </h2>
  )
}

function topIn(scroller: HTMLElement, el: HTMLElement) {
  return el.getBoundingClientRect().top - scroller.getBoundingClientRect().top + scroller.scrollTop
}

/**
 * Scroll-spy over `[data-section]` inside the scroller (piece 11's), with
 * `go(i)` for the rail. Once seen it glides once to `demo()` — an element to
 * bring into view — unless the reader has already touched the page. Under
 * reduced motion it never moves by itself.
 */
export function useSpy(
  scrollerRef: React.RefObject<HTMLDivElement | null>,
  count: number,
  demo?: () => HTMLElement | null,
) {
  const reduced = useReducedMotion()
  const [active, setActive] = React.useState(0)
  const touched = React.useRef(false)

  const sections = React.useCallback(() => {
    const el = scrollerRef.current
    return el ? Array.from(el.querySelectorAll<HTMLElement>("[data-section]")) : []
  }, [scrollerRef])

  React.useEffect(() => {
    const el = scrollerRef.current
    if (!el || count === 0) return
    const onScroll = () => {
      const line = el.scrollTop + el.clientHeight * 0.34
      const atEnd = el.scrollTop + el.clientHeight >= el.scrollHeight - 2
      let i = 0
      sections().forEach((s, k) => {
        if (topIn(el, s) <= line) i = k
      })
      setActive(atEnd ? Math.max(i, count - 1) : i)
    }
    const mark = () => (touched.current = true)
    el.addEventListener("scroll", onScroll, { passive: true })
    el.addEventListener("wheel", mark, { passive: true })
    el.addEventListener("touchstart", mark, { passive: true })
    el.addEventListener("keydown", mark)
    onScroll()
    return () => {
      el.removeEventListener("scroll", onScroll)
      el.removeEventListener("wheel", mark)
      el.removeEventListener("touchstart", mark)
      el.removeEventListener("keydown", mark)
    }
  }, [scrollerRef, sections, count])

  const scrollTo = React.useCallback(
    (target: HTMLElement | null, at: number) => {
      const el = scrollerRef.current
      if (!el || !target) return
      el.scrollTo({ top: Math.max(0, topIn(el, target) - el.clientHeight * at), behavior: reduced ? "auto" : "smooth" })
    },
    [scrollerRef, reduced],
  )

  const go = React.useCallback(
    (i: number) => {
      touched.current = true
      const el = scrollerRef.current
      if (i === 0 && el) return el.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" })
      scrollTo(sections()[i] ?? null, 0.12)
    },
    [scrollerRef, sections, scrollTo, reduced],
  )

  React.useEffect(() => {
    const el = scrollerRef.current
    if (!el || reduced || !demo) return
    let timer = 0
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e?.isIntersecting) return
        io.disconnect()
        timer = window.setTimeout(() => {
          if (!touched.current) scrollTo(demo(), 0.3)
        }, 1100)
      },
      { threshold: 0.6 },
    )
    io.observe(el)
    return () => {
      io.disconnect()
      window.clearTimeout(timer)
    }
  }, [scrollerRef, reduced, demo, scrollTo])

  return { active, go, reduced }
}

/** True once `target` has been fully visible inside the scroller. */
export function useSeenIn(
  rootRef: React.RefObject<HTMLElement | null>,
  targetRef: React.RefObject<HTMLElement | null>,
  threshold = 0.9,
) {
  const [seen, setSeen] = React.useState(false)
  React.useEffect(() => {
    const root = rootRef.current
    const el = targetRef.current
    if (!root || !el) return
    // The tile itself must be on screen too, so watch the scroller from the viewport first.
    let outer: IntersectionObserver | null = null
    const inner = new IntersectionObserver(
      ([e]) => {
        if (!e?.isIntersecting) return
        outer = new IntersectionObserver(
          ([o]) => {
            if (!o?.isIntersecting) return
            setSeen(true)
            outer?.disconnect()
            inner.disconnect()
          },
          { threshold: 0.5 },
        )
        outer.observe(root)
      },
      { root, threshold },
    )
    inner.observe(el)
    return () => {
      inner.disconnect()
      outer?.disconnect()
    }
  }, [rootRef, targetRef, threshold])
  return seen
}

/* ------------------------------------------------------------- the pen ring */

/**
 * Piece 20's loop: a little long, the end overshooting the start like a real
 * pen. Points in a 100×40 box, scaled to the measured box so the stroke stays
 * one even width whatever it circles.
 */
const LOOP: number[][] = [
  [54, 4.5],
  [80, 3.5, 98, 9, 97.5, 20],
  [97, 32, 74, 37.5, 48, 37],
  [22, 36.5, 2.5, 31, 3, 19.5],
  [3.5, 8.5, 24, 3, 50, 4],
  [62, 4.4, 70, 6, 73, 8.5],
]

function loop(w: number, h: number) {
  const sx = w / 100
  const sy = h / 40
  const pt = (seg: number[]) =>
    seg
      .reduce<string[]>((acc, v, i) => {
        if (i % 2) acc[acc.length - 1] += ` ${(v * sy).toFixed(1)}`
        else acc.push((v * sx).toFixed(1))
        return acc
      }, [])
      .join(", ")
  const [m, ...cs] = LOOP
  return `M ${pt(m)} ` + cs.map((c) => `C ${pt(c)}`).join(" ")
}

export const RING_CSS = `
.f-ring path { stroke-dasharray: 1; stroke-dashoffset: 1; opacity: 0;
  transition: stroke-dashoffset 180ms cubic-bezier(.4,0,1,1), opacity 0ms linear 180ms; }
.f-ring[data-on] path { stroke-dashoffset: 0; opacity: 1;
  transition: stroke-dashoffset 520ms cubic-bezier(.45,.05,.25,1) var(--d, 60ms), opacity 0ms linear var(--d, 60ms); }
@media (prefers-reduced-motion: reduce) {
  .f-ring path { stroke-dashoffset: 0; transition: opacity 160ms ease; }
  .f-ring[data-on] path { transition: opacity 160ms ease; }
}
`

export function PenLoop({
  on,
  color,
  inset,
  delay = 60,
}: {
  on: boolean
  color: string
  inset: string
  delay?: number
}) {
  const ref = React.useRef<HTMLSpanElement>(null)
  const [box, setBox] = React.useState<[number, number] | null>(null)

  React.useEffect(() => {
    const el = ref.current
    if (!el) return
    const ro = new ResizeObserver(([e]) => {
      if (!e) return
      setBox([Math.round(e.contentRect.width), Math.round(e.contentRect.height)])
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  return (
    <span
      ref={ref}
      aria-hidden
      className="f-ring"
      data-on={on || undefined}
      style={{ position: "absolute", inset, pointerEvents: "none", ["--d" as string]: `${delay}ms` }}
    >
      {box ? (
        <svg viewBox={`0 0 ${box[0]} ${box[1]}`} style={{ display: "block", width: "100%", height: "100%", overflow: "visible" }}>
          <path d={loop(box[0], box[1])} pathLength={1} fill="none" stroke={color} strokeWidth={1.4} strokeLinecap="round" />
        </svg>
      ) : null}
    </span>
  )
}

/** dd/mm from an ISO date, right-aligned the way benji.org does it. */
export const ddmm = (iso: string) => `${iso.slice(8, 10)}/${iso.slice(5, 7)}`
