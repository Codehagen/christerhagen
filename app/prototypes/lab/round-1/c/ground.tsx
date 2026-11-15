"use client"

import * as React from "react"

/**
 * Shared parts for group c — ground and frame. Every piece is a miniature
 * whole page of christerhagen.com drawn inside the 4:3 frame (100cqw × 75cqw),
 * so the thing under test is the ground, the band and the rail, not a widget.
 */

const REDUCED = "(prefers-reduced-motion: reduce)"

function subscribeReduced(cb: () => void) {
  const mq = window.matchMedia(REDUCED)
  mq.addEventListener("change", cb)
  return () => mq.removeEventListener("change", cb)
}

export function useReducedMotion() {
  return React.useSyncExternalStore(
    subscribeReduced,
    () => window.matchMedia(REDUCED).matches,
    () => false
  )
}

/** benji.org's demo wall: 1px lines at 4.3% black. */
export const WALL_LINE = "rgba(0,0,0,0.043)"

export function wall(cell: string): React.CSSProperties {
  return {
    backgroundImage: `linear-gradient(${WALL_LINE} 1px, transparent 1px), linear-gradient(90deg, ${WALL_LINE} 1px, transparent 1px)`,
    backgroundSize: `${cell} ${cell}`,
    backgroundPosition: "-1px -1px",
  }
}

/** Hides the native scrollbar of a miniature page; the rail is the scrollbar. */
export function NoScrollbar() {
  return (
    <style>{`
.c-scroll { scrollbar-width: none; }
.c-scroll::-webkit-scrollbar { display: none; }
`}</style>
  )
}

/**
 * Scroll-spy for a miniature page. Returns the index of the section whose top
 * has passed a line a third of the way down the scroller, plus a `go(i)` that
 * scrolls there. Once the piece has been on screen it nudges itself to
 * `demoTo` a single time, so the rail is seen tracking without a touch;
 * under reduced motion it stays still.
 */
export function useScrollSpy(
  scrollerRef: React.RefObject<HTMLDivElement | null>,
  count: number,
  demoTo = 1
) {
  const reduced = useReducedMotion()
  const [active, setActive] = React.useState(0)
  const touched = React.useRef(false)

  const sections = React.useCallback(() => {
    const el = scrollerRef.current
    if (!el) return []
    return Array.from(el.querySelectorAll<HTMLElement>("[data-section]"))
  }, [scrollerRef])

  React.useEffect(() => {
    const el = scrollerRef.current
    if (!el) return
    const onScroll = () => {
      const line = el.scrollTop + el.clientHeight * 0.34
      const atEnd = el.scrollTop + el.clientHeight >= el.scrollHeight - 2
      const tops = sections().map((s) => s.offsetTop)
      let i = 0
      tops.forEach((t, k) => {
        if (t <= line) i = k
      })
      setActive(atEnd ? Math.max(i, count - 1) : i)
    }
    const mark = () => (touched.current = true)
    el.addEventListener("scroll", onScroll, { passive: true })
    el.addEventListener("wheel", mark, { passive: true })
    el.addEventListener("touchstart", mark, { passive: true })
    onScroll()
    return () => {
      el.removeEventListener("scroll", onScroll)
      el.removeEventListener("wheel", mark)
      el.removeEventListener("touchstart", mark)
    }
  }, [scrollerRef, sections, count])

  const go = React.useCallback(
    (i: number, fromDemo = false) => {
      const el = scrollerRef.current
      const target = sections()[i]
      if (!el || !target) return
      if (!fromDemo) touched.current = true
      el.scrollTo({
        top: i === 0 ? 0 : target.offsetTop - el.clientHeight * 0.12,
        behavior: reduced ? "auto" : "smooth",
      })
    },
    [scrollerRef, sections, reduced]
  )

  // One-shot demo: on first sight, glide to `demoTo`.
  React.useEffect(() => {
    const el = scrollerRef.current
    if (!el || reduced) return
    let timer = 0
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e?.isIntersecting) return
        io.disconnect()
        timer = window.setTimeout(() => {
          if (!touched.current) go(demoTo, true)
        }, 1100)
      },
      { threshold: 0.6 }
    )
    io.observe(el)
    return () => {
      io.disconnect()
      window.clearTimeout(timer)
    }
  }, [scrollerRef, reduced, go, demoTo])

  return { active, go, reduced }
}

/** Day/month from an ISO date, the way benji.org right-aligns it. */
export function ddmm(iso: string) {
  const [, m, d] = iso.split("-")
  return `${d}/${m}`
}
