"use client"

import * as React from "react"

import { companies } from "@/lib/companies"
import { Bar, C, RING, fontInter, useSeen } from "../../kit"

import { useReducedMotion, wall } from "./ground"

/** One accent: the green of a passed check, and of the cell a drop will take. */
const GREEN = "#178A5A"

/** The wall's cell, in cqw. Every edge on the page lands on one of its lines. */
const CELL = 4
const STAGE = { left: 24, top: 28, w: 52, h: 32 }
const CARD = { w: 20, h: 24 }
const MAX = { x: STAGE.w - CARD.w, y: STAGE.h - CARD.h }
const REST = { x: 16, y: 4 }
const OFF = { x: 17.6, y: 5.3 }

const doc = companies.en.docdir

const snap = (v: number) => Math.round(v / CELL) * CELL
const clamp = (v: number, hi: number) => Math.max(0, Math.min(hi, v))

export default function TheWallAsGround() {
  const reduced = useReducedMotion()
  const frameRef = React.useRef<HTMLDivElement>(null)
  const [seenRef, seen] = useSeen<HTMLDivElement>()
  const [pos, setPos] = React.useState(OFF)
  const [dragging, setDragging] = React.useState(false)
  const touched = React.useRef(false)
  const start = React.useRef({ px: 0, py: 0, x: 0, y: 0 })

  // One-shot: the card arrives a little off the grid, then settles onto it.
  React.useEffect(() => {
    if (!seen || touched.current) return
    const t = window.setTimeout(() => setPos(REST), reduced ? 0 : 650)
    return () => window.clearTimeout(t)
  }, [seen, reduced])

  const perCqw = () => (frameRef.current?.getBoundingClientRect().width ?? 100) / 100

  const onDown = (e: React.PointerEvent<HTMLDivElement>) => {
    touched.current = true
    e.currentTarget.setPointerCapture(e.pointerId)
    start.current = { px: e.clientX, py: e.clientY, x: pos.x, y: pos.y }
    setDragging(true)
  }
  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging) return
    const k = perCqw()
    setPos({
      x: clamp(start.current.x + (e.clientX - start.current.px) / k, MAX.x),
      y: clamp(start.current.y + (e.clientY - start.current.py) / k, MAX.y),
    })
  }
  const onUp = () => {
    if (!dragging) return
    setDragging(false)
    setPos((p) => ({ x: snap(p.x), y: snap(p.y) }))
  }
  const onKey = (e: React.KeyboardEvent) => {
    const d = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] }[e.key]
    if (!d) return
    e.preventDefault()
    touched.current = true
    setPos((p) => ({ x: clamp(snap(p.x) + d[0] * CELL, MAX.x), y: clamp(snap(p.y) + d[1] * CELL, MAX.y) }))
  }

  const ghost = { x: snap(pos.x), y: snap(pos.y) }
  const offGrid = ghost.x !== pos.x || ghost.y !== pos.y
  const dur = reduced ? "0ms" : "300ms"

  return (
    <div ref={seenRef} className="@container relative h-full w-full overflow-hidden">
      <div
        ref={frameRef}
        className="relative h-full w-full overflow-hidden"
        style={{
          background: C.page,
          ...wall(`${CELL}cqw`),
          color: C.ink,
          fontFamily: fontInter,
          fontFeatureSettings: '"cv11", "ss01"',
          WebkitFontSmoothing: "antialiased",
          fontSize: "2.15cqw",
          lineHeight: 1.43,
          fontWeight: 460,
        }}
      >
        <div style={{ position: "absolute", left: "24cqw", top: "6.6cqw", color: C.grey, fontSize: "1.95cqw" }}>
          ↩ Portfolio
        </div>

        <div style={{ position: "absolute", left: "24cqw", top: "10.8cqw", width: "52cqw" }}>
          <h1 style={{ margin: 0, fontSize: "3.1cqw", lineHeight: 1.2, fontWeight: 560, letterSpacing: "-0.012em" }}>
            {doc.name}
          </h1>
          <p style={{ margin: "0.4cqw 0 0", color: C.grey }}>{doc.tagline}</p>
        </div>

        <dl
          style={{
            position: "absolute",
            left: "24cqw",
            top: "20cqw",
            width: "52cqw",
            margin: 0,
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            fontSize: "1.8cqw",
          }}
        >
          {[
            ["Role", doc.role],
            ["Year", doc.year],
            ["Sector", doc.sector],
            ["Status", doc.status],
          ].map(([k, v]) => (
            <div key={k}>
              <dt style={{ color: C.faint }}>{k}</dt>
              <dd style={{ margin: 0, whiteSpace: "nowrap" }}>{v}</dd>
            </div>
          ))}
        </dl>

        {/* The stage: the bare wall, with the one object on it. */}
        <div
          style={{
            position: "absolute",
            left: `${STAGE.left}cqw`,
            top: `${STAGE.top}cqw`,
            width: `${STAGE.w}cqw`,
            height: `${STAGE.h}cqw`,
          }}
        >
          {/* Where the card will land: drawn on the wall's own lines. */}
          <span
            aria-hidden
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: `${CARD.w}cqw`,
              height: `${CARD.h}cqw`,
              transform: `translate(${ghost.x}cqw, ${ghost.y}cqw)`,
              boxShadow: `inset 0 0 0 1px ${GREEN}`,
              opacity: dragging && offGrid ? 0.55 : 0,
              transitionProperty: "opacity, transform",
              transitionDuration: reduced ? "0ms" : "160ms, 120ms",
            }}
          />

          <div
            role="button"
            tabIndex={0}
            aria-roledescription="draggable card"
            aria-label={`The sales prospectus, at column ${ghost.x / CELL + 1}, row ${ghost.y / CELL + 1}. Drag it, or use the arrow keys; it lands on the grid.`}
            onPointerDown={onDown}
            onPointerMove={onMove}
            onPointerUp={onUp}
            onPointerCancel={onUp}
            onKeyDown={onKey}
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: `${CARD.w}cqw`,
              height: `${CARD.h}cqw`,
              padding: "2cqw",
              background: C.white,
              borderRadius: "0.8cqw",
              boxShadow: dragging
                ? "0 0 0 1px rgba(18,18,18,0.08), 0 2px 4px rgba(18,18,18,0.05), 0 18px 36px -12px rgba(18,18,18,0.2)"
                : RING,
              transform: `translate(${pos.x}cqw, ${pos.y}cqw) scale(${dragging ? 1.015 : 1})`,
              transitionProperty: "transform, box-shadow",
              transitionDuration: dragging ? `0ms, ${dur}` : `${dur}, ${dur}`,
              transitionTimingFunction: "cubic-bezier(0.2, 0.8, 0.2, 1)",
              cursor: dragging ? "grabbing" : "grab",
              touchAction: "none",
              userSelect: "none",
              outline: "none",
              display: "flex",
              flexDirection: "column",
              gap: "1.3cqw",
            }}
          >
            <span style={{ fontWeight: 560, fontSize: "1.9cqw" }}>Sales prospectus</span>
            {["78%", "64%", "84%", "52%"].map((w, i) => (
              <span key={i} style={{ display: "flex", alignItems: "center", gap: "1cqw" }}>
                <svg viewBox="0 0 12 12" aria-hidden style={{ width: "1.5cqw", height: "1.5cqw", flexShrink: 0 }}>
                  <path d="M2 6.4 4.8 9 10 3" fill="none" stroke={GREEN} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <Bar w={w} />
              </span>
            ))}
            <span style={{ marginTop: "auto", color: C.grey, fontSize: "1.7cqw" }}>Quality-checked</span>
          </div>
        </div>

        <p style={{ position: "absolute", left: "24cqw", top: "64cqw", width: "52cqw", margin: 0 }}>
          {doc.body[0]}
        </p>
      </div>
    </div>
  )
}
