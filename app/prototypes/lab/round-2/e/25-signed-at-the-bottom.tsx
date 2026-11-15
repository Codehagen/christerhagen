"use client"

import * as React from "react"

import { posts } from "@/lib/posts"
import { EMAIL } from "@/lib/content"

import { fontHand } from "../../kit"
import { G, Head, MiniPost, Section, useSpy } from "./frame"
import { PEN_CSS } from "./pen"

/**
 * 25 — Signed at the bottom.
 *
 * The Bodø post with no marks in it at all. The pen waits for the end: when
 * you reach the last line it signs the post, dates it where it was written,
 * and leaves the address in the same hand. The address is 17's copy control
 * dressed as ink: tap it and a pen tick draws beside it, holds a second and a
 * half, and lets go.
 */

const PEN = "oklch(0.52 0.16 42)"
const HOLD = 1500

const post = posts.en["building-in-bodo"]
const RAIL = ["Oslo", "Bodø", "Anywhere", "Signed"]

const css = `
.e25-addr { position: relative; font: inherit; color: inherit; background: none; border: 0; padding: 0; cursor: pointer; touch-action: manipulation;
  transition-property: scale; transition-duration: 140ms; transition-timing-function: cubic-bezier(.2,.8,.3,1); }
.e25-addr:active { scale: 0.98; }
.e25-addr:focus-visible { outline: 2px solid ${G.ink}; outline-offset: 0.6cqw; border-radius: 0.6cqw; }
.e25-addr::after { content: ""; position: absolute; left: 0; right: 0; top: 50%; height: max(100%, 44px); translate: 0 -50%; }
.e25-tick path { stroke-dasharray: 1; stroke-dashoffset: 1; transition-property: stroke-dashoffset; transition-duration: 160ms; }
.e25-tick[data-on] path { stroke-dashoffset: 0; transition-duration: 320ms; transition-timing-function: cubic-bezier(.3,.8,.3,1); }
@media (prefers-reduced-motion: reduce) {
  .e25-addr, .e25-tick path, .e25-tick[data-on] path { transition-duration: 0ms; }
  .e25-addr:active { scale: 1; }
}
`

type State = "idle" | "copied" | "manual"

function Line({
  on,
  delay,
  children,
  size = "2.6cqw",
  style,
}: {
  on: boolean
  delay: number
  children: React.ReactNode
  size?: string
  style?: React.CSSProperties
}) {
  return (
    <span
      className="r1a-write block"
      data-on={on || undefined}
      style={{ fontSize: size, lineHeight: 1.05, transitionDelay: on ? `${delay}ms` : "0ms", ...style }}
    >
      {children}
    </span>
  )
}

export default function SignedAtTheBottom() {
  const scrollerRef = React.useRef<HTMLDivElement>(null)
  const { active, reached, seen, go, reduced } = useSpy(scrollerRef, RAIL.length, [1, 2, 3], 1700)
  const signed = seen && reached >= 3

  const [state, setState] = React.useState<State>("idle")
  const addr = React.useRef<HTMLSpanElement>(null)
  const timer = React.useRef<number | undefined>(undefined)
  React.useEffect(() => () => window.clearTimeout(timer.current), [])

  const settle = (s: State) => {
    setState(s)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setState("idle"), s === "manual" ? 2600 : HOLD)
  }

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL)
      settle("copied")
    } catch {
      // No clipboard: select the address for ⌘C instead.
      const el = addr.current
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

  const done = state === "copied"

  return (
    <MiniPost
      label="The Bodø post, signed by hand at the end"
      rail={RAIL}
      active={active}
      onGo={go}
      reduced={reduced}
      scrollerRef={scrollerRef}
    >
      <style>{PEN_CSS + css}</style>

      <Section first>
        <Head meta={`${post.date} · ${post.read}`} title={post.title} />
        <p style={{ margin: 0 }}>{post.body[0]}</p>
      </Section>
      <Section>
        <p style={{ margin: 0 }}>{post.body[1]}</p>
      </Section>
      <Section>
        <p style={{ margin: 0 }}>{post.body[2]}</p>
      </Section>

      <Section style={{ marginTop: "5.6cqw" }}>
        <div
          style={{ fontFamily: fontHand, color: PEN, rotate: "-2deg", transformOrigin: "left top", width: "44cqw" }}
        >
          <Line on={signed} delay={300} size="5.4cqw" style={{ lineHeight: 0.95 }}>
            — christer
          </Line>
          <Line on={signed} delay={1250} style={{ marginTop: "0.6cqw" }}>
            bodø, {post.date.toLowerCase()}
          </Line>
          <Line on={signed} delay={1750} style={{ marginTop: "2.4cqw", whiteSpace: "nowrap" }}>
            write back:{" "}
            <button
              type="button"
              onClick={copy}
              tabIndex={signed ? 0 : -1}
              className="e25-addr"
              aria-label={done ? "Copied" : `Copy ${EMAIL}`}
            >
              <span
                ref={addr}
                style={{
                  textDecorationLine: "underline",
                  textDecorationThickness: "1px",
                  textUnderlineOffset: "0.5cqw",
                  textDecorationColor: `color-mix(in oklch, ${PEN} 45%, transparent)`,
                }}
              >
                {EMAIL}
              </span>
            </button>
            <svg
              aria-hidden
              viewBox="0 0 16 16"
              className="e25-tick inline-block align-middle"
              data-on={done || undefined}
              style={{ width: "2.4cqw", height: "2.4cqw", marginLeft: "0.8cqw", overflow: "visible" }}
            >
              <path
                pathLength={1}
                d="M2.6 8.8 C 4 9.8, 5.4 11.4, 6.4 12.6 C 8.2 9, 10.6 5.6, 13.8 3"
                fill="none"
                stroke={PEN}
                strokeWidth={1.7}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Line>
          <Line on={signed} delay={2250} style={{ marginTop: "0.8cqw" }}>
            <span aria-live="polite">
              {state === "manual" ? "selected. ⌘c to copy" : done ? "copied." : "i usually answer within a day"}
            </span>
          </Line>
        </div>
      </Section>
    </MiniPost>
  )
}
