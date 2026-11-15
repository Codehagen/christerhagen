"use client"

import * as React from "react"

import type { Lang } from "@/lib/companies"

import { Bracket, PenNote, usePenMark } from "@/components/site/pen"
import { ReadNext } from "@/components/site/read-next"
import { Stage, StageSheet } from "@/components/site/stage"

/**
 * The post page's client parts (41/42/44/45): the bracket that only exists
 * where there is a margin, 45's last mark beside read next, and 44's one
 * product shot on the wall (Docdir only).
 */

/* ───────────────────────────── the margin ───────────────────────────── */

/** DESIGN.md's `margin:` breakpoint: room to the right of the column for the pen. */
const MARGIN = "(min-width: 68rem)"

function subscribe(query: string) {
  return (cb: () => void) => {
    const m = window.matchMedia(query)
    m.addEventListener("change", cb)
    return () => m.removeEventListener("change", cb)
  }
}

/** True when the page is wide enough for `query`. `server` is the guess before hydration. */
function useMedia(query: string, server: boolean) {
  return React.useSyncExternalStore(
    React.useMemo(() => subscribe(query), [query]),
    () => window.matchMedia(query).matches,
    () => server
  )
}

/** Whether the right margin exists (desktop). The server guesses yes. */
export function useMarginWide() {
  return useMedia(MARGIN, true)
}

/**
 * 01's bracket, only where there is a margin. On a phone (42) the paragraph
 * is plain: no bracket, and its note is not written under it either, so the
 * pen's first visible mark is not kept waiting behind one that draws nothing.
 */
export function MarginBracket({
  note,
  children,
}: {
  note: string
  children: React.ReactNode
}) {
  const wide = useMarginWide()
  if (!wide) return <>{children}</>
  return (
    <Bracket note={note} inlineNote={false}>
      {children}
    </Bracket>
  )
}

/* ─────────────────────────── 45: the last mark ─────────────────────────── */

type Box = { x: number; y: number; w: number; h: number }

/** From the note's left edge back to read next's arrow, bowing up, with a head (45). */
function handOn(g: Box, n: { x: number; y: number }, u: number) {
  const sx = n.x - u
  const sy = n.y + u * 1.3
  const ex = g.x + g.w + u * 1.4
  const ey = g.y + g.h * 0.55
  const span = sx - ex
  const c1 = [sx - span * 0.28, Math.min(sy, ey) - u * 3.2]
  const c2 = [ex + span * 0.22, ey - u * 2.4]
  const line = `M ${sx} ${sy} C ${c1[0]} ${c1[1]}, ${c2[0]} ${c2[1]}, ${ex} ${ey}`
  const a = Math.atan2(ey - c2[1], ex - c2[0])
  const L = u * 1.8
  const h1 = [ex - L * Math.cos(a - 0.5), ey - L * Math.sin(a - 0.5)]
  const h2 = [ex - L * Math.cos(a + 0.5), ey - L * Math.sin(a + 0.5)]
  return { line, head: `M ${h1[0]} ${h1[1]} L ${ex} ${ey} L ${h2[0]} ${h2[1]}` }
}

/** The note's write-in, then the line (520ms at +650) and its head (160ms at +1150). */
const LINE_AT = 650
const HEAD_AT = 1150
const LANDED = HEAD_AT + 160

/**
 * 45: once read next comes into view, the pen writes one line in the margin
 * about the post it points to and draws an arrow from it back to read next's
 * arrow, which then takes the ink (600ms later, in CSS). Desktop only: on a
 * phone there is no margin, and read next stays as it is.
 *
 * Takes ReadNext's props and renders it.
 */
export function LastMark({
  note,
  ...next
}: {
  note: string
} & Omit<React.ComponentProps<typeof ReadNext>, "inked">) {
  const wide = useMarginWide()
  const { ref, on, delay } = usePenMark<HTMLDivElement>()
  const [m, setM] = React.useState<{ g: Box; width: number } | null>(null)
  const [landed, setLanded] = React.useState(false)

  React.useLayoutEffect(() => {
    const box = ref.current
    if (!box || !wide) return
    const measure = () => {
      const a = box.querySelector(".read-next-arrow")
      if (!a) return
      const b = box.getBoundingClientRect()
      const r = a.getBoundingClientRect()
      setM({
        g: {
          x: r.left - b.left,
          y: r.top - b.top,
          w: r.width,
          h: r.height,
        },
        width: b.width,
      })
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(box)
    document.fonts?.ready.then(measure)
    return () => ro.disconnect()
  }, [ref, wide])

  React.useEffect(() => {
    if (!on) return
    const t = window.setTimeout(() => setLanded(true), delay + LANDED)
    return () => window.clearTimeout(t)
  }, [on, delay])

  // The lab's 1cqw against 14px text (DESIGN.md §2: em = cqw / 2.15).
  const u = 14 * 0.465
  const n = m ? { x: m.width + 22, y: m.g.y - u * 0.6 } : null
  const h = m && n ? handOn(m.g, n, u) : null
  const inked = wide && on && landed

  return (
    <div ref={ref} className="relative">
      <ReadNext {...next} inked={inked} />
      {wide && h && n ? (
        <>
          <svg
            aria-hidden
            className="pointer-events-none absolute top-0 left-0 h-px w-px overflow-visible"
          >
            <g
              fill="none"
              stroke="var(--pen)"
              strokeWidth={Math.max(1.2, u * 0.26)}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path
                className="pen-stroke"
                data-on={on || undefined}
                pathLength={1}
                d={h.line}
                style={
                  {
                    "--d": `${delay + LINE_AT}ms`,
                    "--dur": "520ms",
                  } as React.CSSProperties
                }
              />
              <path
                className="pen-stroke"
                data-on={on || undefined}
                pathLength={1}
                d={h.head}
                style={
                  {
                    "--d": `${delay + HEAD_AT}ms`,
                    "--dur": "160ms",
                  } as React.CSSProperties
                }
              />
            </g>
          </svg>
          <span
            aria-hidden
            className="pointer-events-none absolute w-[var(--margin-note-w)]"
            style={{ left: n.x, top: n.y }}
          >
            <PenNote on={on} delay={delay}>
              {note}
            </PenNote>
          </span>
        </>
      ) : null}
    </div>
  )
}

/* ─────────────────────── 44: one shot on the wall ─────────────────────── */

const SHOT: Record<
  Lang,
  { title: string; foot: string; caption: string; label: string }
> = {
  en: {
    title: "Sales prospectus",
    foot: "Quality-checked",
    caption:
      "The sales prospectus: the part of the deal Docdir hands to software.",
    label: "A sales prospectus, assembled and quality-checked",
  },
  no: {
    title: "Salgsoppgave",
    foot: "Kvalitetssikret",
    caption: "Salgsoppgaven: delen av handelen Docdir gir til programvaren.",
    label: "En salgsoppgave, satt sammen og kvalitetssikret",
  },
}

const CELL = 48
/** 44's sheet: 20 × 20 cqw, landing on the lines 3 cells in and 1 down. */
const SHEET = 240

/**
 * 44: the grid wall as a stage inside the column, holding the post's one
 * product shot, the sales prospectus. It arrives a little off the grid and
 * settles onto its lines. Its checks are the page's pen.
 */
export function DocdirStage({ lang }: { lang: Lang }) {
  const t = SHOT[lang]
  // Centred on a line in the 528px column (3 cells in); one cell in when the
  // column is a phone's.
  const wide = useMedia("(min-width: 40rem)", true)
  const at = { x: wide ? CELL * 3 : CELL, y: CELL }
  return (
    <Stage variant="inline" label={t.label} caption={t.caption}>
      <StageSheet at={at} width={SHEET} height={SHEET} className="gap-[10px]">
        <span className="text-small font-[560]">{t.title}</span>
        {["78%", "64%", "84%", "52%"].map((w) => (
          <span key={w} className="flex items-center gap-[7px]">
            <svg
              viewBox="0 0 12 12"
              className="size-[11px] shrink-0"
              aria-hidden
            >
              <path
                d="M2 6.4 4.8 9 10 3"
                fill="none"
                stroke="var(--pen)"
                strokeWidth={1.6}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span
              className="block h-2 rounded-full"
              style={{ width: w, background: "rgb(var(--ink-rgb) / 0.075)" }}
            />
          </span>
        ))}
        <span className="mt-auto text-micro text-ink-muted">{t.foot}</span>
      </StageSheet>
    </Stage>
  )
}
