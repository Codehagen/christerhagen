"use client"

import * as React from "react"

import { companies, companyOrder } from "@/lib/companies"
import { homeContent } from "@/lib/content"
import { posts, postOrder } from "@/lib/posts"
import { C, fontHand, fontInter, useSeen } from "../../kit"

import { NoScrollbar, ddmm, useScrollSpy } from "./ground"

/** One accent: the red of the pen that circles "New". */
const RED = "#D93A2B"

/** The rail's ground: one step down from the reading ground, never a panel. */
const RAIL_GROUND = "#F5F5F3"
const READ_GROUND = "#FDFDFC"
const SEAM = "rgba(18,18,18,0.06)"

const SECTIONS = ["Writing", "Portfolio", "Now"]
const home = homeContent.en

function Heading({ children }: { children: string }) {
  return (
    <h2
      style={{
        display: "flex",
        alignItems: "center",
        gap: "1.6cqw",
        margin: "0 0 1.4cqw",
        fontSize: "1.95cqw",
        fontWeight: 460,
        color: C.grey,
      }}
    >
      {children}
      <span aria-hidden style={{ flex: 1, height: 1, background: C.hair }} />
    </h2>
  )
}

function CircledNew({ drawn, reduced }: { drawn: boolean; reduced: boolean }) {
  return (
    <span
      style={{
        position: "relative",
        display: "inline-block",
        marginLeft: "1.4cqw",
        fontFamily: fontHand,
        fontSize: "2.3cqw",
        lineHeight: 1,
        color: RED,
      }}
    >
      New
      <svg
        aria-hidden
        viewBox="0 0 60 30"
        preserveAspectRatio="none"
        style={{ position: "absolute", left: "-35%", top: "-38%", width: "170%", height: "176%", overflow: "visible" }}
      >
        <path
          d="M40 4 C 22 1, 4 6, 4 15 C 4 25, 30 28, 47 24 C 58 21, 58 8, 44 5 C 38 4, 33 4, 29 5"
          pathLength={1}
          fill="none"
          stroke={RED}
          strokeWidth={1.2}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          style={{
            strokeDasharray: 1,
            strokeDashoffset: drawn ? 0 : 1,
            transitionProperty: "stroke-dashoffset",
            transitionDuration: reduced ? "0ms" : "900ms",
            transitionTimingFunction: "cubic-bezier(0.5, 0, 0.3, 1)",
            transitionDelay: reduced ? "0ms" : "300ms",
          }}
        />
      </svg>
    </span>
  )
}

export default function TwoGrounds() {
  const scrollerRef = React.useRef<HTMLDivElement>(null)
  const { active, go, reduced } = useScrollSpy(scrollerRef, SECTIONS.length, 1)
  const [seenRef, seen] = useSeen<HTMLDivElement>()

  return (
    <div ref={seenRef} className="@container relative h-full w-full overflow-hidden">
      <NoScrollbar />
      <div
        className="relative h-full w-full overflow-hidden"
        style={{
          background: READ_GROUND,
          color: C.ink,
          fontFamily: fontInter,
          fontFeatureSettings: '"cv11", "ss01"',
          WebkitFontSmoothing: "antialiased",
          fontSize: "2.15cqw",
          lineHeight: 1.43,
          fontWeight: 460,
        }}
      >
        {/* Zone one: the rail, on its own ground. */}
        <aside
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: "25cqw",
            background: RAIL_GROUND,
            boxShadow: `1px 0 0 ${SEAM}`,
            padding: "6cqw 0 0 4.4cqw",
            fontSize: "1.95cqw",
          }}
        >
          <div style={{ fontWeight: 560, lineHeight: "2.8cqw" }}>Christer Hagen</div>
          <div style={{ color: C.grey, lineHeight: "2.8cqw", marginBottom: "5cqw" }}>Bodø, Norway</div>

          <nav aria-label="Sections" style={{ position: "relative", display: "flex", flexDirection: "column", gap: "0.9cqw" }}>
            {SECTIONS.map((s, i) => (
              <button
                key={s}
                type="button"
                onClick={() => go(i)}
                aria-current={active === i ? "location" : undefined}
                style={{
                  all: "unset",
                  cursor: "pointer",
                  lineHeight: "3cqw",
                  color: active === i ? C.ink : "rgba(18,18,18,0.4)",
                  transitionProperty: "color",
                  transitionDuration: reduced ? "0ms" : "220ms",
                }}
              >
                {s}
              </button>
            ))}
          </nav>
        </aside>

        {/* The active marker sits on the seam: the one place the two grounds touch. */}
        <span
          aria-hidden
          style={{
            position: "absolute",
            left: "calc(25cqw - 1px)",
            top: "16.6cqw",
            width: 2,
            height: "3cqw",
            background: C.ink,
            transform: `translateY(${active * 3.9}cqw)`,
            transitionProperty: "transform",
            transitionDuration: reduced ? "0ms" : "380ms",
            transitionTimingFunction: "cubic-bezier(0.2, 0.8, 0.2, 1)",
          }}
        />

        {/* Zone two: the reading ground. */}
        <div
          ref={scrollerRef}
          className="c-scroll"
          tabIndex={0}
          aria-label="Index"
          style={{ position: "absolute", left: "25cqw", right: 0, top: 0, bottom: 0, overflowY: "auto", outline: "none" }}
        >
          <div style={{ width: "48cqw", margin: "0 auto", padding: "6cqw 0 40cqw" }}>
            <section data-section>
              <Heading>Writing</Heading>
              {postOrder.map((slug, i) => {
                const p = posts.en[slug]
                return (
                  <div key={slug} style={{ display: "flex", alignItems: "baseline", padding: "0.75cqw 0" }}>
                    <span style={{ width: "6.4cqw", color: C.faint, fontVariantNumeric: "tabular-nums" }}>
                      {p.dateISO.slice(0, 4)}
                    </span>
                    <span style={{ flex: 1, minWidth: 0 }}>
                      {p.title}
                      {i === 0 ? <CircledNew drawn={seen} reduced={reduced} /> : null}
                    </span>
                    <span style={{ color: C.grey, fontVariantNumeric: "tabular-nums" }}>{ddmm(p.dateISO)}</span>
                  </div>
                )
              })}
            </section>

            <section data-section style={{ marginTop: "6cqw" }}>
              <Heading>Portfolio</Heading>
              {companyOrder.map((slug) => {
                const c = companies.en[slug]
                return (
                  <div key={slug} style={{ display: "flex", alignItems: "baseline", gap: "1.4cqw", padding: "0.75cqw 0" }}>
                    <span style={{ width: "14cqw", flexShrink: 0, whiteSpace: "nowrap" }}>{c.name}</span>
                    <span style={{ flex: 1, minWidth: 0, color: C.grey, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {c.tagline}
                    </span>
                    <span style={{ color: C.grey, fontVariantNumeric: "tabular-nums" }}>{c.year}</span>
                  </div>
                )
              })}
            </section>

            <section data-section style={{ marginTop: "6cqw" }}>
              <Heading>Now</Heading>
              {home.now.map((n) => (
                <p key={n} style={{ margin: 0, padding: "0.75cqw 0" }}>
                  {n}
                </p>
              ))}
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
