"use client"

import * as React from "react"

import { homeContent } from "@/lib/content"
import { posts, postOrder } from "@/lib/posts"
import { C, fontHand, fontInter } from "../../kit"

import { ddmm, useReducedMotion } from "./ground"

/** One accent: the ochre of the loupe, the only thing that admits the grain is there. */
const OCHRE = "#B07A12"

/** Page grain: felt, not seen. The loupe shows the same noise turned up. */
const GRAIN_OPACITY = 0.05
const LOUPE = 17 // cqw
const REST = { x: 86, y: 47 } // loupe centre at rest, in cqw

const home = homeContent.en

function Grain({ freq, opacity }: { freq: number; opacity: number }) {
  const id = React.useId().replace(/:/g, "")
  return (
    <svg aria-hidden width="100%" height="100%" style={{ position: "absolute", inset: 0, opacity, pointerEvents: "none" }}>
      <filter id={id} x="0" y="0" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency={freq} numOctaves={3} stitchTiles="stitch" />
        {/* Black, with the noise as its alpha: grain without shifting the ground's tone. */}
        <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  2.2 0 0 0 -0.9" />
      </filter>
      <rect width="100%" height="100%" filter={`url(#${id})`} />
    </svg>
  )
}

function Heading({ children }: { children: string }) {
  return (
    <h2 style={{ display: "flex", alignItems: "center", gap: "1.6cqw", margin: "4.4cqw 0 1cqw", fontSize: "1.95cqw", fontWeight: 460, color: C.grey }}>
      {children}
      <span aria-hidden style={{ flex: 1, height: 1, background: C.hair }} />
    </h2>
  )
}

export default function PaperGrain() {
  const reduced = useReducedMotion()
  const frameRef = React.useRef<HTMLDivElement>(null)
  const loupeRef = React.useRef<HTMLDivElement>(null)
  const [following, setFollowing] = React.useState(false)

  const place = React.useCallback((x: number, y: number) => {
    const el = loupeRef.current
    if (el) el.style.transform = `translate(${x - LOUPE / 2}cqw, ${y - LOUPE / 2}cqw)`
  }, [])

  React.useEffect(() => place(REST.x, REST.y), [place])

  const follow = (e: React.PointerEvent) => {
    const r = frameRef.current?.getBoundingClientRect()
    if (!r || r.width === 0) return
    const k = r.width / 100
    setFollowing(true)
    place((e.clientX - r.left) / k, (e.clientY - r.top) / k)
  }
  const leave = () => {
    setFollowing(false)
    place(REST.x, REST.y)
  }

  return (
    <div className="@container relative h-full w-full overflow-hidden">
      <div
        ref={frameRef}
        onPointerMove={follow}
        onPointerDown={follow}
        onPointerLeave={leave}
        className="relative h-full w-full overflow-hidden"
        style={{
          background: C.page,
          color: C.ink,
          fontFamily: fontInter,
          fontFeatureSettings: '"cv11", "ss01"',
          WebkitFontSmoothing: "antialiased",
          fontSize: "2.15cqw",
          lineHeight: 1.43,
          fontWeight: 460,
          touchAction: "pan-y",
        }}
      >
        <Grain freq={0.85} opacity={GRAIN_OPACITY} />

        {/* The band is the only clean paper on the page. */}
        <div aria-hidden style={{ position: "absolute", left: 0, right: 0, top: 0, height: "6.4cqw", background: C.white, boxShadow: "0 1px 0 rgba(18,18,18,0.035)" }} />

        <div style={{ position: "relative", width: "44cqw", margin: "0 auto", paddingTop: "13cqw" }}>
          <div style={{ fontWeight: 560 }}>Christer Hagen</div>
          <div style={{ color: C.grey }}>{home.aboutRole}</div>
          <p style={{ margin: "2.4cqw 0 0" }}>{home.heroSub}</p>

          <Heading>Now</Heading>
          {home.now.map((n) => (
            <p key={n} style={{ margin: 0, padding: "0.5cqw 0" }}>
              {n}
            </p>
          ))}

          <Heading>Writing</Heading>
          {postOrder.map((slug) => {
            const p = posts.en[slug]
            return (
              <div key={slug} style={{ display: "flex", justifyContent: "space-between", gap: "2cqw", padding: "0.5cqw 0" }}>
                <span>{p.title}</span>
                <span style={{ color: C.grey, fontVariantNumeric: "tabular-nums" }}>{ddmm(p.dateISO)}</span>
              </div>
            )
          })}
        </div>

        {/* The loupe: the same noise, closer and louder. */}
        <div
          ref={loupeRef}
          aria-hidden
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: `${LOUPE}cqw`,
            height: `${LOUPE}cqw`,
            borderRadius: "50%",
            overflow: "hidden",
            background: C.page,
            boxShadow: `0 0 0 1px ${OCHRE}, 0 10px 28px -10px rgba(18,18,18,0.18)`,
            pointerEvents: "none",
            transitionProperty: "transform",
            transitionDuration: following || reduced ? "0ms" : "520ms",
            transitionTimingFunction: "cubic-bezier(0.2, 0.8, 0.2, 1)",
          }}
        >
          <Grain freq={0.22} opacity={0.42} />
        </div>

        <span
          aria-hidden
          style={{
            position: "absolute",
            left: `${REST.x - 9}cqw`,
            top: `${REST.y + LOUPE / 2 + 1.2}cqw`,
            width: "18cqw",
            textAlign: "center",
            fontFamily: fontHand,
            fontSize: "2.3cqw",
            lineHeight: 1.1,
            color: OCHRE,
            transform: "rotate(-3deg)",
            opacity: following ? 0 : 1,
            transitionProperty: "opacity",
            transitionDuration: reduced ? "0ms" : "200ms",
          }}
        >
          the grain, turned up — it is under every word at 5%
        </span>
      </div>
    </div>
  )
}
