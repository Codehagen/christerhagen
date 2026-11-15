"use client"

import * as React from "react"

import { LOOP_D } from "./pen"

export type Box = { x: number; y: number; w: number; h: number }

/**
 * Measures `target` against `container` and keeps measuring when either
 * resizes or the fonts arrive. Null until both exist.
 */
export function useBox(
  container: React.RefObject<HTMLElement | null>,
  target: React.RefObject<HTMLElement | null>,
  key: unknown
): Box | null {
  const [box, setBox] = React.useState<Box | null>(null)

  React.useLayoutEffect(() => {
    const c = container.current
    const t = target.current
    if (!c || !t) return
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
  }, [container, target, key])

  return box
}

/**
 * The pen's loop round "where you are" (36/40): a hand-drawn ring sized to
 * the measured `box`, drawn in 560ms after a 90ms beat. When the box moves
 * (a new `k`), it slides there (420ms `--ease-loop`, on `transform` only) and
 * draws again. It says where you are, so it stays when the pen is hidden.
 * Place it inside the `relative` container the box was measured against.
 */
export function TravelRing({
  box,
  k,
  padX = 0.5,
  padY = 0.42,
  width = 1.5,
}: {
  box: Box | null
  /** The target's name: a new `k` redraws the loop. */
  k: string
  /** Padding as a share of the box height (0.45/0.36 in the phone menu). */
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
      className="travel-ring"
      data-on
      style={{
        transform: `translate(${box.x - px}px, ${box.y - py}px)`,
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
          stroke="var(--pen)"
          strokeWidth={width}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </span>
  )
}
