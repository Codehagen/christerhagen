"use client"

import * as React from "react"

import type { Lang } from "@/lib/companies"
import { cn } from "@/lib/utils"

/**
 * The pen (DESIGN.md §3): one hand that marks the page in Christer's voice.
 * Ported from the lab's round-2/e/pen.tsx, round-1/a/parts.tsx and
 * round-3/i/post.tsx, in real px.
 *
 *   <PenProvider color="blue">            one colour per page, on the page root
 *     <article data-pen-column>           the column the margin notes hang off
 *       <Bracket note="…">…</Bracket>
 *       <p>… <RingArrow note="…">€ 2.1m</RingArrow> …</p>
 *       <p>… <Highlight note="…">the one sentence</Highlight> …</p>
 *
 * Every mark draws once, when it scrolls into view. Marks already on screen at
 * load draw in reading order (300ms + rank × 1200ms). Hiding the pen
 * (PenToggle) takes them all away in one quick beat; the choice is kept in
 * localStorage. All motion is CSS in app/globals.css (`.pen-*`), so reduced
 * motion is handled there.
 *
 * Notes are aria-hidden. When a note adds a fact, pass `srNote` so a
 * screen-reader copy sits next to the marked words.
 */

/* ───────────────────────────── colour + state ───────────────────────────── */

export type PenColor = "blue" | "teal" | "green" | "rust" | "red" | "rose"

/** The pen colour each page uses (DESIGN.md §3). */
export const PAGE_PEN = {
  home: "rose",
  about: "rust",
  writing: "rust",
  post: "blue",
  portfolio: "red",
  company: "green",
  // Not in the lab's map (DESIGN.md §3). Contact sits with About, whose
  // sign-off carries the same address; the secondary pages and the dead ends
  // take the site's default warm pen, which About and Writing already use.
  // Blue stays the posts' colour. Server pages pass the literal: a value
  // imported from this client module is only a reference on the server.
  contact: "rust",
  page: "rust",
} as const satisfies Record<string, PenColor>

const STORAGE_KEY = "christerhagen:pen"
const CHANGE_EVENT = "christerhagen:pen"

function readVisible(): boolean {
  try {
    return window.localStorage.getItem(STORAGE_KEY) !== "off"
  } catch {
    return true
  }
}

function subscribeVisible(cb: () => void) {
  window.addEventListener("storage", cb)
  window.addEventListener(CHANGE_EVENT, cb)
  return () => {
    window.removeEventListener("storage", cb)
    window.removeEventListener(CHANGE_EVENT, cb)
  }
}

function writeVisible(v: boolean) {
  try {
    if (v) window.localStorage.removeItem(STORAGE_KEY)
    else window.localStorage.setItem(STORAGE_KEY, "off")
  } catch {
    /* storage blocked: the choice lasts for this page only */
  }
  window.dispatchEvent(new Event(CHANGE_EVENT))
}

/** Whether the pen is shown. On by default and on the server (DESIGN.md §3). */
export function usePenVisible(): [boolean, (v: boolean) => void] {
  const visible = React.useSyncExternalStore(
    subscribeVisible,
    readVisible,
    () => true
  )
  return [visible, writeVisible]
}

const REDUCED = "(prefers-reduced-motion: reduce)"

export function useReducedMotion() {
  return React.useSyncExternalStore(
    (cb) => {
      const m = window.matchMedia(REDUCED)
      m.addEventListener("change", cb)
      return () => m.removeEventListener("change", cb)
    },
    () => window.matchMedia(REDUCED).matches,
    () => false
  )
}

/* ─────────────────────────────── the scheduler ─────────────────────────────── */

type Draw = (delay: number) => void

type PenCtx = {
  register: (el: Element, draw: Draw) => () => void
}

const PenContext = React.createContext<PenCtx | null>(null)

/** The bottom of the reading area: a mark draws once its top is above 86%. */
const IN_VIEW_MARGIN = "0px 0px -14% 0px"

function inViewNow(el: Element) {
  const r = el.getBoundingClientRect()
  return r.bottom > 0 && r.top < window.innerHeight * 0.86
}

/**
 * Arms the page's marks 140ms after mount. Those already in view draw in
 * reading order; the rest draw 250ms after scrolling brings them in.
 */
function usePenScheduler(): PenCtx {
  const marks = React.useRef(new Map<Element, Draw>())
  const armed = React.useRef(false)
  const io = React.useRef<IntersectionObserver | null>(null)

  const observe = React.useCallback((el: Element) => {
    if (!io.current) {
      io.current = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (!e.isIntersecting) continue
            io.current?.unobserve(e.target)
            marks.current.get(e.target)?.(250)
            marks.current.delete(e.target)
          }
        },
        { rootMargin: IN_VIEW_MARGIN }
      )
    }
    io.current.observe(el)
  }, [])

  React.useEffect(() => {
    const t = window.setTimeout(() => {
      armed.current = true
      const step = window.matchMedia("(max-width: 67.99rem)").matches
        ? 1300
        : 1200
      const now = [...marks.current.keys()]
        .filter(inViewNow)
        .sort((a, b) =>
          a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING
            ? -1
            : 1
        )
      now.forEach((el, rank) => {
        marks.current.get(el)?.(300 + rank * step)
        marks.current.delete(el)
      })
      marks.current.forEach((_, el) => observe(el))
    }, 140)
    return () => {
      window.clearTimeout(t)
      io.current?.disconnect()
      io.current = null
    }
  }, [observe])

  return React.useMemo<PenCtx>(
    () => ({
      register(el, draw) {
        marks.current.set(el, draw)
        if (armed.current) {
          if (inViewNow(el)) {
            marks.current.delete(el)
            draw(300)
          } else observe(el)
        }
        return () => {
          marks.current.delete(el)
          io.current?.unobserve(el)
        }
      },
    }),
    [observe]
  )
}

/** Without a provider, each mark watches for itself. */
function standaloneRegister(el: Element, draw: Draw) {
  let done = false
  const o = new IntersectionObserver(
    ([e]) => {
      if (e?.isIntersecting && !done) {
        done = true
        o.disconnect()
        draw(250)
      }
    },
    { rootMargin: IN_VIEW_MARGIN }
  )
  o.observe(el)
  return () => o.disconnect()
}

/**
 * One mark's state: `on` once it has been drawn and while the pen is shown,
 * and the `delay` (ms) it was given. Attach `ref` to the marked element.
 */
export function usePenMark<T extends Element>() {
  const ctx = React.useContext(PenContext)
  const ref = React.useRef<T>(null)
  const [delay, setDelay] = React.useState<number | null>(null)
  const [visible] = usePenVisible()

  React.useEffect(() => {
    const el = ref.current
    if (!el) return
    const draw: Draw = (d) => setDelay(d)
    return ctx ? ctx.register(el, draw) : standaloneRegister(el, draw)
  }, [ctx])

  const drawn = delay !== null
  return { ref, on: drawn && visible, drawn, delay: delay ?? 0 }
}

/**
 * Sets the page's one pen colour and arms its marks. Renders a
 * `display: contents` wrapper, so wrap the whole page (header included: the
 * header's ring takes the same colour).
 */
export function PenProvider({
  color = "blue",
  children,
}: {
  color?: PenColor
  children: React.ReactNode
}) {
  const ctx = usePenScheduler()
  return (
    <PenContext.Provider value={ctx}>
      <div
        className="contents"
        style={
          {
            "--pen": `var(--pen-${color})`,
            // Custom properties resolve where they are declared: the mixes
            // in :root stay blue unless they are re-derived here.
            "--pen-wash": "color-mix(in oklch, var(--pen) 16%, transparent)",
            "--pen-tint": "color-mix(in oklch, var(--pen) 6%, transparent)",
            "--pen-ring-30": "color-mix(in oklch, var(--pen) 30%, transparent)",
          } as React.CSSProperties
        }
      >
        {children}
      </div>
    </PenContext.Provider>
  )
}

/* ──────────────────────────────── geometry ──────────────────────────────── */

type Rect = { x: number; y: number; w: number; h: number }

/** The element the margin hangs off: `[data-pen-column]`, else the block's parent. */
function columnOf(el: Element): Element | null {
  return (
    el.closest("[data-pen-column]") ??
    el.closest("p, li, dd, div")?.parentElement ??
    null
  )
}

/**
 * Measures an inline anchor against its column: `x` is the distance from the
 * anchor's left edge to the margin note (column right + 22px), `u` is the lab's
 * 1cqw expressed against the text (0.465em), `w`/`h` the anchor's own box.
 */
function useMargin(ref: React.RefObject<HTMLElement | null>) {
  const [m, setM] = React.useState<{
    x: number
    u: number
    w: number
    h: number
  } | null>(null)

  React.useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const col = columnOf(el)
    let alive = true
    const measure = () => {
      if (!alive) return
      const r = el.getBoundingClientRect()
      const c = col?.getBoundingClientRect() ?? r
      const fs = parseFloat(getComputedStyle(el).fontSize) || 14
      setM({ x: c.right - r.left + 22, u: fs * 0.465, w: r.width, h: r.height })
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    if (col) ro.observe(col)
    window.addEventListener("resize", measure)
    document.fonts?.ready.then(measure)
    return () => {
      alive = false
      ro.disconnect()
      window.removeEventListener("resize", measure)
    }
  }, [ref])

  return m
}

/**
 * The prose ring's radii. Horizontally it sits only 0.55u (≈3.6px at 14px)
 * off the word, so it stays inside the word space and never strikes the
 * punctuation next to it ("bought; PowerOffice"); vertically it keeps 0.8u.
 */
function ringRadii(p: Rect, u: number) {
  return { rx: p.w / 2 + u * 0.55, ry: p.h / 2 + u * 0.8 }
}

/**
 * A loop that starts top-left, goes round once and overshoots its start (03).
 * Its left and right sides run vertical at exactly ±rx (no control point
 * past them), so the overshoot never reaches further sideways than the ring.
 */
function ringPath(p: Rect, u: number) {
  const cx = p.x + p.w / 2
  const cy = p.y + p.h / 2
  const { rx, ry } = ringRadii(p, u)
  return [
    `M ${cx - rx * 0.86} ${cy - ry * 0.8}`,
    `C ${cx - rx * 0.3} ${cy - ry * 1.18}, ${cx + rx} ${cy - ry * 1.12}, ${cx + rx} ${cy + ry * 0.04}`,
    `C ${cx + rx} ${cy + ry * 1.0}, ${cx - rx * 0.62} ${cy + ry * 1.22}, ${cx - rx} ${cy + ry * 0.18}`,
    `C ${cx - rx} ${cy - ry * 0.52}, ${cx - rx * 0.46} ${cy - ry * 1.08}, ${cx + rx * 0.22} ${cy - ry * 1.04}`,
  ].join(" ")
}

/**
 * From the ring's right side out to the left edge of its note, with a head.
 * It leaves the ring a little above centre, rises into the gap between this
 * line and the one above (just under the line box's top, clear of the
 * descenders above and the capitals here) and runs along it to the margin,
 * so it crosses no text.
 */
function arrowPath(p: Rect, n: Rect, u: number) {
  const cx = p.x + p.w / 2
  const cy = p.y + p.h / 2
  const { rx, ry } = ringRadii(p, u)
  const sx = cx + rx
  const sy = cy - ry * 0.3
  const gap = p.y + p.h * 0.08
  const ex = n.x - u * 1.2
  const ey = n.y + n.h * 0.42
  const c1x = sx + u * 1.2
  // Controls sit 0.5u above the gap so the curve itself (which only
  // approaches its controls) actually runs along it.
  const c1y = gap - u * 0.5
  const c2x = ex - (ex - sx) * 0.35
  const c2y = gap - u * 0.5
  const line = `M ${sx} ${sy} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${ex} ${ey}`
  const a = Math.atan2(ey - c2y, ex - c2x)
  const L = u * 1.8
  const h1 = [ex - L * Math.cos(a - 0.5), ey - L * Math.sin(a - 0.5)]
  const h2 = [ex - L * Math.cos(a + 0.5), ey - L * Math.sin(a + 0.5)]
  const head = `M ${h1[0]} ${h1[1]} L ${ex} ${ey} L ${h2[0]} ${h2[1]}`
  return { line, head }
}

/** The pen loop from piece 20 in a 100×40 box, its end overshooting the start. */
export const LOOP_D =
  "M 54 4.5 C 80 3.5, 98 9, 97.5 20 C 97 32, 74 37.5, 48 37 C 22 36.5, 2.5 31, 3 19.5 C 3.5 8.5, 24 3, 50 4 C 62 4.4, 70 6, 73 8.5"

function Stroke({
  d,
  on,
  delay,
  dur,
}: {
  d: string
  on: boolean
  delay: number
  dur: number
}) {
  return (
    <path
      className="pen-stroke"
      data-on={on || undefined}
      pathLength={1}
      d={d}
      style={
        { "--d": `${delay}ms`, "--dur": `${dur}ms` } as React.CSSProperties
      }
    />
  )
}

/* ──────────────────────────────── the notes ──────────────────────────────── */

export type PenNoteVariant = "write" | "settle" | "slide"

/**
 * The words beside a mark, in the pen's hand. `write` writes in left to right
 * (prose), `settle` drops into place (ledger notes, 49/64), `slide` slides in
 * after a tick (ledger margin notes, 51/53). `size`: `prose` 16px beside
 * paragraphs, `ledger` 21px beside ledgers.
 *
 * Driven by its mark when `on`/`delay` are passed; on its own (e.g. a phone
 * note under a paragraph) it draws when it scrolls into view.
 */
export function PenNote({
  children,
  variant = "write",
  size = "prose",
  on,
  delay,
  className,
  style,
}: {
  children: React.ReactNode
  variant?: PenNoteVariant
  size?: "prose" | "ledger"
  on?: boolean
  delay?: number
  className?: string
  style?: React.CSSProperties
}) {
  const own = usePenMark<HTMLSpanElement>()
  const controlled = on !== undefined
  const isOn = controlled ? on : own.on
  const d = controlled ? (delay ?? 0) : own.delay
  return (
    <span
      ref={controlled ? undefined : own.ref}
      aria-hidden
      data-on={isOn || undefined}
      className={cn(
        "pointer-events-none block font-pen leading-[0.98] whitespace-normal text-pen select-none",
        size === "ledger" && "text-pen-lg leading-[0.95]",
        variant === "write" && "pen-write -rotate-2",
        variant === "settle" && "pen-settle",
        variant === "slide" && "pen-slide -rotate-2",
        className
      )}
      style={{
        color: "var(--pen)",
        ...({ "--d": `${d}ms` } as React.CSSProperties),
        ...style,
      }}
    >
      {children}
    </span>
  )
}

/**
 * A note written under its paragraph on a phone, where there is no margin:
 * right-aligned, at most 88% wide, rotated −1.5deg. Hidden once the margin
 * exists (`margin:` breakpoint), where the mark carries its own note.
 */
export function InlineNote({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <PenNote
      className={cn(
        "mt-1.5 ml-auto w-fit max-w-[88%] rotate-[-1.5deg] text-right text-[1.18em] leading-none margin:hidden",
        className
      )}
    >
      {children}
    </PenNote>
  )
}

/** A screen-reader copy of a note that adds a fact (DESIGN.md §3). */
function SrNote({ children }: { children?: React.ReactNode }) {
  if (!children) return null
  return <span className="sr-only"> ({children})</span>
}

/* ──────────────────────────────── the marks ──────────────────────────────── */

/**
 * 01's bracket down the side of one paragraph, its note beside it. Lives in
 * the margin, so it is not drawn on a phone; there the note is written under
 * the paragraph instead (`inlineNote`, on by default).
 */
export function Bracket({
  note,
  srNote,
  inlineNote = true,
  children,
  className,
}: {
  note: React.ReactNode
  srNote?: React.ReactNode
  inlineNote?: boolean
  children: React.ReactNode
  className?: string
}) {
  const { ref, on, delay } = usePenMark<HTMLDivElement>()
  return (
    <div ref={ref} className={cn("relative", className)}>
      {children}
      <SrNote>{srNote}</SrNote>
      <span
        aria-hidden
        className="pointer-events-none absolute top-[0.3em] bottom-[0.3em] left-[calc(100%+10px)] hidden w-[var(--margin-note-w)] items-center gap-2 margin:flex"
      >
        <span
          className="pen-draw relative block h-full w-[10px] shrink-0"
          data-on={on || undefined}
          style={{ "--d": `${delay}ms` } as React.CSSProperties}
        >
          <svg
            viewBox="0 0 10 100"
            preserveAspectRatio="none"
            className="absolute inset-0 h-full w-full overflow-visible"
          >
            <path
              d="M1 1.5 C 5 1.5, 6 3, 6 8 L 6.4 44 C 6.5 48, 7.5 50, 10 50 C 7.5 50, 6.5 52, 6.4 56 L 6 92 C 6 97, 5 98.5, 1 98.5"
              fill="none"
              stroke="var(--pen)"
              strokeWidth={1.3}
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        </span>
        <PenNote on={on} delay={delay + 520}>
          {note}
        </PenNote>
      </span>
      {inlineNote ? <InlineNote>{note}</InlineNote> : null}
    </div>
  )
}

/**
 * One fact ringed by the pen's loop (20/29/31): a number, an outcome, a stage.
 * Sized to its text, so it suits ledgers and facts. With `note`, the pen
 * writes in the right margin level with it, after a short tick (51/53).
 */
export function Ring({
  children,
  note,
  srNote,
  inset = "-0.26em -0.47em -0.23em -0.51em",
  delay: extraDelay = 60,
  strokeWidth = 1.4,
  className,
}: {
  children: React.ReactNode
  note?: React.ReactNode
  srNote?: React.ReactNode
  /** Where the loop sits around the text (CSS inset). */
  inset?: string
  /** Extra wait before the loop draws, after the mark's own delay. */
  delay?: number
  strokeWidth?: number
  className?: string
}) {
  const { ref, on, delay } = usePenMark<HTMLSpanElement>()
  const margin = useMargin(ref)

  const d = delay + extraDelay
  return (
    <span ref={ref} className={cn("relative", className)}>
      {children}
      <SrNote>{srNote}</SrNote>
      <span
        aria-hidden
        className="pen-loop pointer-events-none absolute"
        data-on={on || undefined}
        style={{ inset, "--d": `${d}ms` } as React.CSSProperties}
      >
        <svg
          viewBox="0 0 100 40"
          preserveAspectRatio="none"
          className="block h-full w-full overflow-visible"
        >
          <path
            d={LOOP_D}
            pathLength={1}
            fill="none"
            stroke="var(--pen)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </span>
      {note && margin ? (
        <span
          aria-hidden
          className="ledger-note pointer-events-none absolute top-0 bottom-0 hidden margin:block"
          style={{ left: margin.x - 22 }}
        >
          <svg
            className="pen-tick absolute top-1/2 left-[6px] -mt-1 h-2 w-[12px] overflow-visible"
            data-on={on || undefined}
            viewBox="0 0 10 4"
            preserveAspectRatio="none"
            style={{ "--d": `${delay}ms` } as React.CSSProperties}
          >
            <path
              pathLength={1}
              d="M 0 2.2 C 3 1.4, 6 2.6, 10 1.8"
              fill="none"
              stroke="var(--pen)"
              strokeWidth={1.3}
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
          <span className="absolute top-1/2 left-[22px] w-[var(--margin-note-w)] -translate-y-1/2 text-left">
            <PenNote variant="slide" size="ledger" on={on} delay={delay}>
              {note}
            </PenNote>
          </span>
        </span>
      ) : null}
    </span>
  )
}

/**
 * 03's ring round one fact in prose, with an arrow out to its note in the
 * right margin. Measured from the real text, so it scrolls with the words.
 * On a phone only the ring is drawn; put the note under the paragraph with
 * `<InlineNote>`.
 */
export function RingArrow({
  children,
  note,
  srNote,
}: {
  children: React.ReactNode
  note: React.ReactNode
  srNote?: React.ReactNode
}) {
  const { ref, on, delay } = usePenMark<HTMLSpanElement>()
  const m = useMargin(ref)
  const p: Rect | null = m ? { x: 0, y: 0, w: m.w, h: m.h } : null
  const n: Rect | null = m
    ? { x: m.x, y: -0.4 * m.u, w: 230, h: 3 * m.u }
    : null
  const arrow = p && n && m ? arrowPath(p, n, m.u) : null

  return (
    <span ref={ref} className="relative inline-block whitespace-nowrap">
      {children}
      <SrNote>{srNote}</SrNote>
      {p && m ? (
        <svg
          aria-hidden
          className="pointer-events-none absolute top-0 left-0 h-px w-px overflow-visible"
        >
          <g
            fill="none"
            stroke="var(--pen)"
            strokeWidth={Math.max(1.2, m.u * 0.26)}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <Stroke d={ringPath(p, m.u)} on={on} delay={delay} dur={640} />
            {arrow ? (
              <g className="hidden margin:inline">
                <Stroke d={arrow.line} on={on} delay={delay + 560} dur={420} />
                <Stroke d={arrow.head} on={on} delay={delay + 960} dur={160} />
              </g>
            ) : null}
          </g>
        </svg>
      ) : null}
      {n ? (
        <span
          aria-hidden
          className="pointer-events-none absolute hidden w-[var(--margin-note-w)] whitespace-normal margin:block"
          style={{ left: n.x, top: n.y }}
        >
          <PenNote on={on} delay={delay + 1040}>
            {note}
          </PenNote>
        </span>
      ) : null}
    </span>
  )
}

/**
 * 05's highlighter in the pen's wash. A sentence (`variant="sentence"`) is
 * broken after each comma and swept stroke by stroke (380ms, 360ms apart); a
 * title (`variant="title"`) is one 520ms stroke. With `note`, the pen writes
 * in the margin level with it (`noteVariant`: `write` beside prose, `settle`
 * beside a ledger). With `stepBack`, the rest of the nearest `.pen-scope`
 * (its `.pen-rest` elements) steps back to grey once the wash lands.
 *
 * At most one per page.
 */
export function Highlight({
  children,
  note,
  noteVariant = "write",
  variant = "sentence",
  stepBack = false,
  className,
}: {
  children: string
  note?: React.ReactNode
  noteVariant?: "write" | "settle"
  variant?: "sentence" | "title"
  stepBack?: boolean
  className?: string
}) {
  const { ref, on, delay } = usePenMark<HTMLSpanElement>()
  const m = useMargin(ref)

  React.useEffect(() => {
    if (!stepBack) return
    const scope = ref.current?.closest(".pen-scope")
    scope?.toggleAttribute("data-stepped", on)
  }, [on, stepBack, ref])

  const strokes = variant === "title" ? [children] : children.split(/(?<=,)/)
  const base = delay + (variant === "title" ? 120 : 0)

  return (
    <span className={className}>
      <span ref={ref} className="relative">
        {note && m ? (
          <span
            aria-hidden
            className="ledger-note pointer-events-none absolute hidden w-[var(--margin-note-w)] margin:block"
            style={{ left: m.x, top: -0.3 * m.u }}
          >
            {noteVariant === "settle" ? (
              <PenNote
                variant="settle"
                size="ledger"
                on={on}
                delay={delay + 900}
              >
                ← {note}
              </PenNote>
            ) : (
              <PenNote on={on} delay={delay + 900}>
                {note}
              </PenNote>
            )}
          </span>
        ) : null}
      </span>
      {strokes.map((s, i) => (
        <span
          key={i}
          className="pen-hl"
          data-variant={variant}
          data-on={on || undefined}
          style={{ "--d": `${base + i * 360}ms` } as React.CSSProperties}
        >
          {s}
        </span>
      ))}
    </span>
  )
}

/**
 * The block whose `.pen-rest` children step back to `--ink-stepped-back`
 * when a `<Highlight stepBack>` inside it lands (05, home ledger).
 */
export function PenScope({
  children,
  className,
  as: Tag = "div",
}: {
  children: React.ReactNode
  className?: string
  as?: "div" | "section" | "ul" | "ol"
}) {
  return <Tag className={cn("pen-scope", className)}>{children}</Tag>
}

/* ─────────────────────────────── the toggle ─────────────────────────────── */

const TOGGLE: Record<Lang, { hide: string; show: string }> = {
  en: { hide: "Hide the pen", show: "Show the pen" },
  no: { hide: "Skjul pennen", show: "Vis pennen" },
}

/**
 * 23's one control: take the pen away, or give it back. A plain button whose
 * label says what it will do ("Hide the pen" / "Show the pen"), with a 7px
 * dot filled with the pen when on. No `aria-pressed`: with a label that
 * flips, it would announce the state twice ("Hide the pen, pressed").
 */
export function PenToggle({
  lang,
  className,
}: {
  lang: Lang
  className?: string
}) {
  const [visible, setVisible] = usePenVisible()
  return (
    <button
      type="button"
      onClick={() => setVisible(!visible)}
      className={cn(
        "press hit pen-toggle flex items-center gap-[6px] text-ui text-ink",
        className
      )}
      style={{ "--hw": "44px" } as React.CSSProperties}
    >
      <span
        aria-hidden
        className="pen-dot block size-[7px] rounded-full"
        style={{
          background: visible ? "var(--pen)" : "transparent",
          boxShadow: `inset 0 0 0 1px ${visible ? "var(--pen)" : "var(--ink-faint)"}`,
        }}
      />
      {visible ? TOGGLE[lang].hide : TOGGLE[lang].show}
    </button>
  )
}
