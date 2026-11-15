"use client"

import * as React from "react"

import { posts } from "@/lib/posts"

import { G, Head, MiniPost, Section, useSpy } from "./frame"
import { Note, PEN_CSS, cut, PenLayer, RingArrow, type Rect, useRects } from "./pen"

/**
 * 22 — Only the numbers.
 *
 * The apparel post read for its figures. Once the page is seen, every word
 * steps back to grey except the numbers, and a red pen rings each one in
 * reading order with one dry line of context in the margin. Everything the
 * pen says is on the site already: Refenze's years,
 * the Avisa Nordland headline that put his age at 25.
 */

const RED = "oklch(0.56 0.2 27)"

const post = posts.en["apparel-to-software"]
const RAIL = ["Refenze", "Physical", "Software"]
const DATE = cut(post.date, "2024")

type Num = { id: string; phrase: string; note: string }

const META: Num[] = [
  { id: "date", phrase: "2024", note: "refenze ran 2016–18" },
]
const BODY: Num[] = [
  { id: "pct", phrase: "25% a month", note: "at the peak, not always" },
  { id: "age", phrase: "mid-twenties", note: "25, per avisa nordland" },
]
const ORDER = [...META, ...BODY]

/** Splits copy around each number it holds, in the order they appear. */
function withNumbers(text: string, nums: Num[], dim: boolean) {
  const out: React.ReactNode[] = []
  let rest = text
  let k = 0
  for (const n of nums) {
    const i = rest.indexOf(n.phrase)
    if (i < 0) continue
    out.push(
      <span key={k++} className="e-ink" style={{ color: dim ? G.faint : undefined }}>
        {rest.slice(0, i)}
      </span>,
    )
    out.push(
      <span key={k++} data-mark={n.id} className="inline-block whitespace-nowrap" style={{ color: G.ink }}>
        {n.phrase}
      </span>,
    )
    rest = rest.slice(i + n.phrase.length)
  }
  out.push(
    <span key={k++} className="e-ink" style={{ color: dim ? G.faint : undefined }}>
      {rest}
    </span>,
  )
  return out
}

/** Each note sits level with its number, nudged down so none overlap. */
function place(rects: Record<string, Rect>, u: number) {
  const out: Record<string, Rect> = {}
  let floor = -Infinity
  for (const n of ORDER) {
    const r = rects[n.id]
    if (!r) continue
    const y = Math.max(r.y - u * 0.4, floor)
    out[n.id] = { x: (44 + 4) * u, y, w: 20 * u, h: 3 * u }
    floor = y + u * 3.6
  }
  return out
}

export default function OnlyTheNumbers() {
  const scrollerRef = React.useRef<HTMLDivElement>(null)
  const articleRef = React.useRef<HTMLElement>(null)
  const { active, seen, go, reduced } = useSpy(scrollerRef, RAIL.length)
  const { rects, u } = useRects(articleRef)
  const notes = place(rects, u)
  const step = 900

  return (
    <MiniPost
      label="The apparel post, with only its numbers marked"
      rail={RAIL}
      active={active}
      onGo={go}
      reduced={reduced}
      scrollerRef={scrollerRef}
      articleRef={articleRef}
    >
      <style>{PEN_CSS}</style>
      <PenLayer color={RED} u={u}>
        {ORDER.map((n, i) => (
          <RingArrow
            key={n.id}
            p={rects[n.id]}
            n={notes[n.id]}
            u={u}
            on={seen}
            delay={700 + i * step}
            lift={1.6}
          />
        ))}
      </PenLayer>

      {ORDER.map((n, i) =>
        notes[n.id] && u ? (
          <Note
            key={n.id}
            color={RED}
            on={seen}
            delay={700 + i * step + 1040}
            className="whitespace-nowrap"
            style={{
              left: notes[n.id].x,
              top: notes[n.id].y,
              fontSize: "2.35cqw",
            }}
          >
            {n.note}
          </Note>
        ) : null,
      )}

      <Section first>
        <div style={{ fontSize: "1.55cqw", letterSpacing: "0.02em", color: G.grey, marginBottom: "1.6cqw" }}>
          <span className="e-ink" style={{ color: seen ? G.faint : undefined }}>
            {DATE[0]}
          </span>
          <span data-mark="date" className="inline-block" style={{ color: G.ink }}>
            {DATE[1]}
          </span>
          <span className="e-ink" style={{ color: seen ? G.faint : undefined }}>
            {" · "}
          </span>
          <span className="e-ink" style={{ color: seen ? G.faint : undefined }}>
            {post.read}
          </span>
        </div>
        <div className="e-ink" style={{ color: seen ? G.faint : G.ink }}>
          <Head meta={null} title={post.title} />
        </div>
        <p style={{ margin: 0 }}>{withNumbers(post.body[0], BODY, seen)}</p>
      </Section>

      <Section>
        <p className="e-ink" style={{ margin: 0, color: seen ? G.faint : undefined }}>
          {post.body[1]}
        </p>
      </Section>

      <Section>
        <p className="e-ink" style={{ margin: 0, color: seen ? G.faint : undefined }}>
          {post.body[2]}
        </p>
      </Section>
    </MiniPost>
  )
}
