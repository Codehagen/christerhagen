"use client"

import * as React from "react"

import { postOrder, posts, type PostSlug } from "@/lib/posts"

import { useSeen } from "../../kit"
import { FAINT, GREY, HAIR, INK, Sheet, Stage } from "./stage"

/**
 * 20 — The pen ring.
 *
 * benji circles one "New" by hand on his writing list. Here the circle is a
 * pen you can move: it draws itself around "New" once the list is on screen,
 * leaves to circle whatever title you point at or focus, and goes back when
 * you leave. A click sets the ring down on that title for good.
 */

const PEN = "#D9402B"

type Target = PostSlug | "new"

/**
 * One loop, a little long, the end overshooting the start like a real pen.
 * Points are in a 100x40 box and scaled to the measured box, so the stroke
 * stays one even pen width whatever the title's length.
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

function Ring({ on, inset }: { on: boolean; inset: string }) {
  const ref = React.useRef<HTMLSpanElement>(null)
  const [box, setBox] = React.useState<[number, number] | null>(null)

  React.useEffect(() => {
    const el = ref.current
    if (!el) return
    const ro = new ResizeObserver(([e]) => {
      if (!e) return
      const { width, height } = e.contentRect
      setBox([Math.round(width), Math.round(height)])
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  return (
    <span
      ref={ref}
      aria-hidden
      className="ring20"
      data-on={on || undefined}
      style={{ position: "absolute", inset, pointerEvents: "none" }}
    >
      {box ? (
        <svg
          viewBox={`0 0 ${box[0]} ${box[1]}`}
          style={{ display: "block", width: "100%", height: "100%", overflow: "visible" }}
        >
          <path
            d={loop(box[0], box[1])}
            pathLength={1}
            fill="none"
            stroke={PEN}
            strokeWidth={1.4}
            strokeLinecap="round"
          />
        </svg>
      ) : null}
    </span>
  )
}

const dm = (iso: string) => `${iso.slice(8, 10)}/${iso.slice(5, 7)}`

export default function PenRing() {
  const [ref, seen] = useSeen<HTMLDivElement>()
  const [hover, setHover] = React.useState<PostSlug | null>(null)
  const [pinned, setPinned] = React.useState<Target>("new")
  const target: Target | null = seen ? (hover ?? pinned) : null

  return (
    <Stage
      lead="One thing, circled by hand."
      rest="The ring is a pen: it finds what you point at, and comes back to New when you leave."
    >
      <style>{css}</style>

      <Sheet style={{ width: "29em", padding: "1.3em 1.5em 1em" }}>
        <div ref={ref}>
          <p style={{ display: "flex", alignItems: "center", gap: "0.8em", color: GREY }}>
            Writing
            <span aria-hidden style={{ flex: 1, height: 1, background: HAIR }} />
          </p>

          <ul style={{ marginTop: "0.4em" }}>
            {postOrder.map((slug, i) => {
              const p = posts.en[slug]
              const year = p.dateISO.slice(0, 4)
              const prevYear = i > 0 ? posts.en[postOrder[i - 1]].dateISO.slice(0, 4) : null
              return (
                <li key={slug}>
                  <a
                    href={`/writing/${slug}`}
                    className="d-press a20"
                    aria-current={pinned === slug ? "true" : undefined}
                    onPointerEnter={() => setHover(slug)}
                    onPointerLeave={() => setHover((h) => (h === slug ? null : h))}
                    onFocus={() => setHover(slug)}
                    onBlur={() => setHover((h) => (h === slug ? null : h))}
                    onClick={(e) => {
                      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return
                      e.preventDefault()
                      setPinned((t) => (t === slug ? "new" : slug))
                    }}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "3em 1fr auto",
                      alignItems: "center",
                      minHeight: "max(44px, 2.6em)",
                      color: INK,
                      textDecoration: "none",
                    }}
                  >
                    <span style={{ color: year === prevYear ? "transparent" : FAINT }}>
                      {year}
                    </span>
                    <span style={{ minWidth: 0, display: "flex", alignItems: "center", gap: "0.7em" }}>
                      <span style={{ position: "relative", display: "block", minWidth: 0 }}>
                        <span
                          style={{
                            display: "block",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {p.title}
                        </span>
                        <Ring on={target === slug} inset="-0.42em -0.55em -0.38em -0.6em" />
                      </span>
                      {i === 0 ? (
                        <span style={{ position: "relative", color: GREY, fontSize: "0.88em", flexShrink: 0 }}>
                          New
                          <Ring on={target === "new"} inset="-0.5em -0.6em -0.42em -0.62em" />
                        </span>
                      ) : null}
                    </span>
                    <span style={{ color: FAINT, fontVariantNumeric: "tabular-nums", paddingLeft: "1em" }}>
                      {dm(p.dateISO)}
                    </span>
                  </a>
                </li>
              )
            })}
          </ul>
        </div>
      </Sheet>
    </Stage>
  )
}

const css = `
.a20 { -webkit-tap-highlight-color: transparent; }
li + li .a20 { box-shadow: inset 0 1px 0 ${HAIR}; }
.ring20 path {
  stroke-dasharray: 1;
  stroke-dashoffset: 1;
  opacity: 0;
  transition: stroke-dashoffset 180ms cubic-bezier(.4,0,1,1), opacity 0ms linear 180ms;
}
.ring20[data-on] path {
  stroke-dashoffset: 0;
  opacity: 1;
  transition: stroke-dashoffset 520ms cubic-bezier(.45,.05,.25,1) 60ms, opacity 0ms linear 60ms;
}
@media (prefers-reduced-motion: reduce) {
  .ring20 path { stroke-dashoffset: 0; transition: opacity 160ms ease; }
  .ring20[data-on] path { transition: opacity 160ms ease; }
}
`
