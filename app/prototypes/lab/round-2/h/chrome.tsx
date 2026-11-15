"use client"

import * as React from "react"

import type { Lang } from "@/lib/companies"

import { fontInter } from "../../kit"
import { useReducedMotion } from "../../round-1/c/ground"

/**
 * Group h (round 2): the header and footer as the controls. Every piece is a
 * miniature page of christerhagen.com on benji's ground (piece 11): #FDFDFC,
 * the white top band with an edge you barely see, Inter at 14/20. The parts
 * here are what the kept controls share: the pen loop from 20, the copy logic
 * from 17, the EN/NO radiogroup from 18, and one touch contract.
 */

export { useReducedMotion }

export const G = {
  ground: "#FDFDFC",
  band: "#FFFFFF",
  edge: "rgba(18,18,18,0.06)",
  ink: "#111111",
  grey: "rgba(18,18,18,0.5)",
  idle: "rgba(18,18,18,0.4)",
  faint: "rgba(18,18,18,0.3)",
  hair: "rgba(18,18,18,0.09)",
} as const

export const LANGS: { id: Lang; label: string; name: string; tag: string }[] = [
  { id: "en", label: "EN", name: "English", tag: "en" },
  { id: "no", label: "NO", name: "Norsk", tag: "nb" },
]

export const tagOf = (l: Lang) => (l === "en" ? "en" : "nb")

/** Arrow keys move between EN and NO, the way a radiogroup does. */
export function langKeys(
  e: React.KeyboardEvent,
  lang: Lang,
  set: (l: Lang) => void,
  refs: React.RefObject<(HTMLElement | null)[]>,
) {
  if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)) return
  e.preventDefault()
  const next = lang === "en" ? 1 : 0
  set(LANGS[next].id)
  refs.current?.[next]?.focus()
}

/** The whole frame: benji's ground, the Inter register, the touch contract. */
export function Frame({
  children,
  label,
  style,
}: {
  children: React.ReactNode
  label: string
  style?: React.CSSProperties
}) {
  return (
    <div className="@container relative h-full w-full overflow-hidden" aria-label={label} role="group">
      <div
        className="h2c relative h-full w-full overflow-hidden"
        style={{
          background: G.ground,
          color: G.ink,
          fontFamily: fontInter,
          fontFeatureSettings: '"cv11", "ss01"',
          WebkitFontSmoothing: "antialiased",
          fontSize: "2.15cqw",
          lineHeight: 1.43,
          fontWeight: 460,
          letterSpacing: "-0.0065em",
          ...style,
        }}
      >
        <style>{CHROME_CSS}</style>
        {children}
      </div>
    </div>
  )
}

/**
 * The pen loop from piece 20, in a 100×40 box, its end overshooting the
 * start. Stretched to any box with a stroke that keeps one pen width.
 */
export const LOOP_D =
  "M 54 4.5 C 80 3.5, 98 9, 97.5 20 C 97 32, 74 37.5, 48 37 C 22 36.5, 2.5 31, 3 19.5 C 3.5 8.5, 24 3, 50 4 C 62 4.4, 70 6, 73 8.5"

export type Box = { x: number; y: number; w: number; h: number }

/**
 * Measures `target` against `container` (both may move; the difference
 * holds), and keeps measuring when either resizes or the fonts arrive.
 */
export function useBox(
  container: React.RefObject<HTMLElement | null>,
  target: () => HTMLElement | null | undefined,
  deps: React.DependencyList,
): Box | null {
  const [box, setBox] = React.useState<Box | null>(null)
  const get = React.useRef(target)
  React.useLayoutEffect(() => {
    get.current = target
  })

  React.useLayoutEffect(() => {
    const c = container.current
    const t = get.current()
    if (!c || !t) {
      setBox(null)
      return
    }
    let alive = true
    const measure = () => {
      if (!alive) return
      const a = c.getBoundingClientRect()
      const b = t.getBoundingClientRect()
      setBox({ x: b.left - a.left, y: b.top - a.top, w: b.width, h: b.height })
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(c)
    ro.observe(t)
    document.fonts?.ready.then(measure)
    return () => {
      alive = false
      ro.disconnect()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return box
}

/**
 * The moving pen ring. The box slides to the new word while the stroke lifts
 * and is drawn again around it, so it reads as a hand moving, not a frame.
 * `k` is the target's name: a new k redraws the loop.
 */
export function TravelRing({
  box,
  k,
  on,
  color,
  padX = 0.5,
  padY = 0.42,
  width = 1.5,
}: {
  box: Box | null
  k: string
  on: boolean
  color: string
  /** Padding as a share of the box height. */
  padX?: number
  padY?: number
  width?: number
}) {
  if (!box) return null
  const px = box.h * padX
  const py = box.h * padY
  return (
    <span
      aria-hidden
      className="h2-ring"
      data-on={on || undefined}
      style={{
        left: box.x - px,
        top: box.y - py,
        width: box.w + px * 2,
        height: box.h + py * 2,
      }}
    >
      <svg viewBox="0 0 100 40" preserveAspectRatio="none">
        <path
          key={k}
          d={LOOP_D}
          pathLength={1}
          fill="none"
          stroke={color}
          strokeWidth={width}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </span>
  )
}

type CopyState = "idle" | "copied" | "manual"

/**
 * Piece 17's copy: write the address to the clipboard, hold the confirmation
 * for 1.5s, and if the clipboard is refused, select the address for ⌘C.
 */
export function useCopy(text: string, hold = 1500) {
  const [state, setState] = React.useState<CopyState>("idle")
  const ref = React.useRef<HTMLAnchorElement>(null)
  const timer = React.useRef<number | undefined>(undefined)
  React.useEffect(() => () => window.clearTimeout(timer.current), [])

  const settle = (s: CopyState) => {
    setState(s)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setState("idle"), s === "manual" ? 2600 : hold)
  }

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      settle("copied")
    } catch {
      const el = ref.current
      const sel = window.getSelection()
      if (el && sel) {
        const r = document.createRange()
        r.selectNodeContents(el)
        sel.removeAllRanges()
        sel.addRange(r)
      }
      settle("manual")
    }
  }

  return { state, copy, ref }
}

const CHROME_CSS = `
@layer base {
.h2c button { font: inherit; color: inherit; background: none; border: 0; padding: 0; margin: 0; cursor: pointer; touch-action: manipulation; -webkit-tap-highlight-color: transparent; text-align: inherit; }
.h2c a { color: inherit; -webkit-tap-highlight-color: transparent; touch-action: manipulation; }
}

/* Press: the control gives under the finger. */
.h2-press { transition-property: transform, color; transition-duration: 140ms, 180ms; transition-timing-function: cubic-bezier(.2,.8,.3,1), ease; }
.h2-press:active { transform: scale(0.97); }

/* An invisible 44px-tall target around a small visible word. */
.h2-hit { position: relative; }
.h2-hit::after {
  content: ""; position: absolute; left: 50%; top: 50%;
  width: max(100%, var(--hw, 0px)); height: max(100%, 44px);
  transform: translate(-50%, -50%);
}

.h2c :is(a, button, [tabindex]):focus { outline: none; }
.h2c :is(a, button, [tabindex]):focus-visible { outline: 2px solid ${G.ink}; outline-offset: 3px; border-radius: 0.3em; }

.h2-ring { position: absolute; pointer-events: none; display: block;
  transition-property: left, top, width, height, opacity;
  transition-duration: 420ms, 420ms, 420ms, 420ms, 160ms;
  transition-timing-function: cubic-bezier(.45,.05,.25,1); opacity: 0; }
.h2-ring[data-on] { opacity: 1; }
.h2-ring svg { display: block; width: 100%; height: 100%; overflow: visible; }
.h2-ring path { stroke-dasharray: 1; stroke-dashoffset: 1; }
.h2-ring[data-on] path { animation: h2-draw 560ms cubic-bezier(.45,.05,.25,1) 90ms both; }
@keyframes h2-draw { from { stroke-dashoffset: 1; } to { stroke-dashoffset: 0; } }

/* A page that re-sets in place instead of jumping. */
.h2-reset { animation: h2-reset 300ms cubic-bezier(.2,.8,.3,1) both; }
@keyframes h2-reset { from { opacity: 0; transform: translateY(0.3em); } to { opacity: 1; transform: none; } }

@media (prefers-reduced-motion: reduce) {
  .h2-press, .h2-press:active { transition-property: color; transform: none; }
  .h2-ring { transition-property: opacity; transition-duration: 160ms; }
  .h2-ring path { stroke-dashoffset: 0; }
  .h2-ring[data-on] path { animation: none; }
  .h2-reset { animation: h2-fade 200ms ease both; }
  @keyframes h2-fade { from { opacity: 0; } to { opacity: 1; } }
}
`
