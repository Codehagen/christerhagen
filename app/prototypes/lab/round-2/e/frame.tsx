"use client"

import * as React from "react"

import { fontInter } from "../../kit"
import { NoScrollbar, useReducedMotion } from "../../round-1/c/ground"

/**
 * Group e — the pen on whole posts. Every piece is piece 11's page, kept
 * exactly: benji's ground (#FDFDFC), the white band a shade lighter, the 40%
 * grey rail that darkens as you scroll, and the 44cqw column. One change: the
 * band stays put while the page scrolls under it, so a control can live in it.
 */

export const G = {
  ground: "#FDFDFC",
  band: "#FFFFFF",
  bandEdge: "rgba(18,18,18,0.035)",
  ink: "#111111",
  grey: "rgba(18,18,18,0.46)",
  faint: "rgba(18,18,18,0.3)",
  railIdle: "rgba(18,18,18,0.4)",
} as const

/** 1cqw in px, read off the 44cqw column. */
export const COLUMN = 44

/**
 * Scroll-spy for the mini page. `active` is the section whose top has passed a
 * line a third of the way down; `reached` is the furthest it has been, so a
 * mark that has drawn stays drawn. Once the page is on screen it walks itself
 * through `demo` (one step every `step` ms) until a person touches it. Under
 * reduced motion it never moves on its own.
 */
export function useSpy(
  scrollerRef: React.RefObject<HTMLDivElement | null>,
  count: number,
  demo: number[] = [],
  step = 1900,
) {
  const reduced = useReducedMotion()
  const [active, setActive] = React.useState(0)
  const [reached, setReached] = React.useState(0)
  const [seen, setSeen] = React.useState(false)
  const touched = React.useRef(false)

  const tops = React.useCallback(() => {
    const el = scrollerRef.current
    if (!el) return []
    const box = el.getBoundingClientRect().top - el.scrollTop
    return Array.from(el.querySelectorAll<HTMLElement>("[data-section]")).map(
      (s) => s.getBoundingClientRect().top - box,
    )
  }, [scrollerRef])

  React.useEffect(() => {
    const el = scrollerRef.current
    if (!el) return
    const onScroll = () => {
      const line = el.scrollTop + el.clientHeight * 0.34
      const atEnd = el.scrollTop + el.clientHeight >= el.scrollHeight - 2
      let i = 0
      tops().forEach((t, k) => {
        if (t <= line) i = k
      })
      const next = atEnd ? Math.max(i, count - 1) : i
      setActive(next)
      setReached((r) => Math.max(r, next))
    }
    const mark = () => (touched.current = true)
    el.addEventListener("scroll", onScroll, { passive: true })
    el.addEventListener("wheel", mark, { passive: true })
    el.addEventListener("touchstart", mark, { passive: true })
    el.addEventListener("keydown", mark)
    return () => {
      el.removeEventListener("scroll", onScroll)
      el.removeEventListener("wheel", mark)
      el.removeEventListener("touchstart", mark)
      el.removeEventListener("keydown", mark)
    }
  }, [scrollerRef, tops, count])

  const go = React.useCallback(
    (i: number, fromDemo = false) => {
      const el = scrollerRef.current
      const t = tops()[i]
      if (!el || t === undefined) return
      if (!fromDemo) touched.current = true
      el.scrollTo({
        top: i === 0 ? 0 : t - el.clientHeight * 0.12,
        behavior: reduced ? "auto" : "smooth",
      })
    },
    [scrollerRef, tops, reduced],
  )

  const demoKey = demo.join(",")
  React.useEffect(() => {
    const el = scrollerRef.current
    if (!el) return
    const timers: number[] = []
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e?.isIntersecting) return
        io.disconnect()
        setSeen(true)
        if (reduced) return
        demoKey
          .split(",")
          .filter(Boolean)
          .forEach((d, k) => {
            timers.push(
              window.setTimeout(() => {
                if (!touched.current) go(Number(d), true)
              }, 1400 + k * step),
            )
          })
      },
      { threshold: 0.5 },
    )
    io.observe(el)
    return () => {
      io.disconnect()
      timers.forEach((t) => window.clearTimeout(t))
    }
  }, [scrollerRef, reduced, go, demoKey, step])

  return { active, reached, seen, go, reduced }
}

export function MiniPost({
  label,
  back = "↩ Index",
  rail,
  active,
  onGo,
  reduced,
  scrollerRef,
  articleRef,
  band,
  lang,
  children,
}: {
  label: string
  back?: string
  rail: string[]
  active: number
  onGo: (i: number) => void
  reduced: boolean
  scrollerRef: React.RefObject<HTMLDivElement | null>
  articleRef?: React.RefObject<HTMLElement | null>
  band?: React.ReactNode
  lang?: string
  children: React.ReactNode
}) {
  return (
    <div className="@container relative h-full w-full overflow-hidden" aria-label={label}>
      <NoScrollbar />
      <div
        className="relative h-full w-full overflow-hidden"
        style={{
          background: G.ground,
          color: G.ink,
          fontFamily: fontInter,
          WebkitFontSmoothing: "antialiased",
          fontFeatureSettings: '"cv11", "ss01"',
        }}
      >
        <div
          ref={scrollerRef}
          className="c-scroll absolute inset-x-0 bottom-0 overflow-y-auto"
          tabIndex={0}
          aria-label={label}
          style={{ top: "6.4cqw", outline: "none" }}
        >
          <article
            ref={articleRef}
            lang={lang}
            style={{
              position: "relative",
              width: `${COLUMN}cqw`,
              margin: "0 auto",
              padding: "6.4cqw 0 34cqw",
              fontSize: "2.15cqw",
              lineHeight: 1.43,
              fontWeight: 460,
              letterSpacing: "-0.0065em",
            }}
          >
            {children}
          </article>
        </div>

        {/* The band: a shade lighter than the page, fixed to the frame. */}
        <div
          className="absolute inset-x-0 top-0 flex items-center justify-end"
          style={{
            height: "6.4cqw",
            padding: "0 4.2cqw",
            background: G.band,
            boxShadow: `0 1px 0 ${G.bandEdge}`,
            fontSize: "1.95cqw",
            letterSpacing: "-0.006em",
          }}
        >
          {band}
        </div>

        <nav
          aria-label="On this page"
          lang={lang}
          style={{
            position: "absolute",
            left: "4.2cqw",
            top: "13.6cqw",
            display: "flex",
            flexDirection: "column",
            gap: "0.9cqw",
            fontSize: "1.95cqw",
            letterSpacing: "-0.006em",
            lineHeight: 1.35,
          }}
        >
          <span style={{ color: G.railIdle, marginBottom: "1.4cqw" }}>{back}</span>
          {rail.map((r, i) => (
            <button
              key={r}
              type="button"
              onClick={() => onGo(i)}
              aria-current={active === i ? "location" : undefined}
              style={{
                all: "unset",
                cursor: "pointer",
                color: active === i ? G.ink : G.railIdle,
                transitionProperty: "color",
                transitionDuration: reduced ? "0ms" : "220ms",
              }}
            >
              {r}
            </button>
          ))}
        </nav>
      </div>
    </div>
  )
}

/** Date line and title, exactly as piece 11 sets them. */
export function Head({ meta, title }: { meta: React.ReactNode; title: string }) {
  return (
    <>
      {meta != null ? (
        <div
          style={{
            fontSize: "1.55cqw",
            letterSpacing: "0.02em",
            color: G.grey,
            marginBottom: "1.6cqw",
          }}
        >
          {meta}
        </div>
      ) : null}
      <h1
        style={{
          margin: "0 0 3.6cqw",
          fontSize: "3.1cqw",
          lineHeight: 1.18,
          fontWeight: 560,
          letterSpacing: "-0.012em",
          textWrap: "balance",
        }}
      >
        {title}
      </h1>
    </>
  )
}

export function Section({
  first = false,
  children,
  style,
}: {
  first?: boolean
  children: React.ReactNode
  style?: React.CSSProperties
}) {
  return (
    <section data-section style={{ position: "relative", marginTop: first ? 0 : "2.8cqw", ...style }}>
      {children}
    </section>
  )
}
