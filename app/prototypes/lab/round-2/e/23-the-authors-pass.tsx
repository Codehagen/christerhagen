"use client"

import * as React from "react"

import { posts } from "@/lib/posts"

import { G, Head, MiniPost, Section, useSpy } from "./frame"
import { BracketNote, Highlight, MARGIN, Note, PEN_CSS, PenLayer, RingArrow, beside, cut, MarginNote, useRects } from "./pen"

/**
 * 23 — The author's pass.
 *
 * The Bodø post after he has been through it once with a green pen: every
 * paragraph carries exactly one mark, and each is a different one of the
 * three kept marks (ring and arrow, highlighter, bracket). The band holds the
 * only control, and it does one thing: take the pen away, so the clean page
 * and the marked page can be read against each other.
 */

const GREEN = "oklch(0.55 0.14 152)"
const WASH = "color-mix(in oklch, oklch(0.62 0.15 152) 20%, transparent)"

const post = posts.en["building-in-bodo"]
const RAIL = ["Oslo", "Bodø", "Anywhere"]
const [p0a, km, p0b] = cut(post.body[0], "1,200 kilometres")
const [p1a, why, p1b] = cut(post.body[1], "Talent is loyal, rent is cheap, focus is easy.")

const css = `
.e23-btn { color: ${G.ink}; transition-property: color, scale; transition-duration: 160ms; transition-timing-function: cubic-bezier(.2,.8,.3,1); }
.e23-btn:active { scale: 0.97; }
.e23-btn:focus-visible { outline: 2px solid ${G.ink}; outline-offset: 0.6cqw; border-radius: 0.6cqw; }
.e23-dot { transition-property: background-color; transition-duration: 200ms; }
@media (hover: hover) and (pointer: fine) { .e23-btn:hover { color: ${GREEN}; } }
@media (prefers-reduced-motion: reduce) { .e23-btn, .e23-dot { transition-duration: 0ms; } .e23-btn:active { scale: 1; } }
`

export default function TheAuthorsPass() {
  const scrollerRef = React.useRef<HTMLDivElement>(null)
  const articleRef = React.useRef<HTMLElement>(null)
  const { active, seen, go, reduced } = useSpy(scrollerRef, RAIL.length, [1, 2])
  const { rects, u } = useRects(articleRef)
  const [pen, setPen] = React.useState(true)
  const on = seen && pen

  const band = (
    <span className="flex items-center gap-[1.4cqw]">
      <span style={{ color: G.grey }}>3 marks</span>
      <button
        type="button"
        aria-pressed={pen}
        onClick={() => setPen((p) => !p)}
        className="e23-btn relative flex cursor-pointer items-center gap-[0.9cqw]"
        style={{ font: "inherit", background: "none", border: 0, padding: "0.6cqw 0", touchAction: "manipulation" }}
      >
        <span
          aria-hidden
          className="e23-dot block rounded-full"
          style={{
            width: "1.1cqw",
            height: "1.1cqw",
            background: pen ? GREEN : "transparent",
            boxShadow: `inset 0 0 0 1px ${pen ? GREEN : G.faint}`,
          }}
        />
        {pen ? "Hide the pen" : "Show the pen"}
        {/* A 44px target around small text. */}
        <span aria-hidden className="absolute" style={{ inset: "50% auto auto 50%", width: "max(100%, 44px)", height: "max(100%, 44px)", translate: "-50% -50%" }} />
      </button>
    </span>
  )

  return (
    <MiniPost
      label="The Bodø post with one pen mark per paragraph"
      rail={RAIL}
      active={active}
      onGo={go}
      reduced={reduced}
      scrollerRef={scrollerRef}
      articleRef={articleRef}
      band={band}
    >
      <style>{PEN_CSS + css}</style>
      <div data-soft>
        <PenLayer color={GREEN} u={u}>
          <RingArrow p={rects.km} n={beside(rects.km, u)} u={u} on={on} delay={200} lift={2} />
        </PenLayer>
        <MarginNote at={beside(rects.km, u)} color={GREEN} on={on} delay={1240}>
          the number the whole post stands on
        </MarginNote>

        <Section first>
          <Head meta={`${post.date} · ${post.read}`} title={post.title} />
          <p style={{ margin: 0 }}>
            {p0a}
            <span data-mark="km" className="inline-block whitespace-nowrap">
              {km}
            </span>
            {p0b}
          </p>
        </Section>

        <Section>
          <p style={{ margin: 0 }}>
            {p1a}
            <Highlight text={why} on={on} color={WASH} delay={1500} />
            {p1b}
          </p>
          <Note color={GREEN} on={on} delay={2500} style={{ ...MARGIN, bottom: "0.4cqw" }}>
            the case, in one line
          </Note>
        </Section>

        <Section>
          <p style={{ margin: 0, position: "relative" }}>
            {post.body[2]}
            <BracketNote color={GREEN} on={on} delay={2700}>
              customers don&rsquo;t ask where you are
            </BracketNote>
          </p>
        </Section>
      </div>
    </MiniPost>
  )
}
