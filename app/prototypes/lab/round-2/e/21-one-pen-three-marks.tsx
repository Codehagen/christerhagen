"use client"

import * as React from "react"

import { posts } from "@/lib/posts"

import { Head, MiniPost, Section, useSpy } from "./frame"
import { BracketNote, Highlight, MARGIN, Note, PEN_CSS, PenLayer, RingArrow, beside, cut, MarginNote, useRects } from "./pen"

/**
 * 21 — One pen, three marks, in reading order.
 *
 * The whole Docdir post on 11's ground, read once with a single blue pen.
 * Each mark waits for its own paragraph: the bracket draws down the first,
 * the ring and arrow find PowerOffice in the second, the highlighter sweeps
 * the lesson in the third. Scroll back up and they are still there.
 */

const PEN = "#2B5CD8"
const WASH = "color-mix(in oklch, #2B5CD8 17%, transparent)"

const post = posts.en["docdir-visma"]
const RAIL = ["The tool", "The sale", "The lesson"]
const [saleA, sale, saleB] = cut(post.body[1], "PowerOffice")
const [lessonA, lesson, lessonB] = cut(
  post.body[2],
  "solve a boring, expensive problem for a specific group of people, in their own language,",
)

export default function OnePenThreeMarks() {
  const scrollerRef = React.useRef<HTMLDivElement>(null)
  const articleRef = React.useRef<HTMLElement>(null)
  const { active, reached, seen, go, reduced } = useSpy(scrollerRef, RAIL.length, [1, 2])
  const { rects, u } = useRects(articleRef)
  const at = (k: number) => seen && reached >= k

  return (
    <MiniPost
      label="The Docdir post, marked in one pen as you read"
      rail={RAIL}
      active={active}
      onGo={go}
      reduced={reduced}
      scrollerRef={scrollerRef}
      articleRef={articleRef}
    >
      <style>{PEN_CSS}</style>
      <PenLayer color={PEN} u={u}>
        <RingArrow p={rects.po} n={beside(rects.po, u)} u={u} on={at(1)} delay={200} lift={2} />
      </PenLayer>
      <MarginNote at={beside(rects.po, u)} color={PEN} on={at(1)} delay={1240}>
        the first one. docdir, the second
      </MarginNote>

      <Section first>
        <Head meta={`${post.date} · ${post.read}`} title={post.title} />
        <p style={{ margin: 0, position: "relative" }}>
          {post.body[0]}
          <BracketNote color={PEN} on={at(0)} delay={500}>
            the prospectus, the worst part of a deal
          </BracketNote>
        </p>
      </Section>

      <Section>
        <p style={{ margin: 0 }}>
          {saleA}
          <span data-mark="po" className="inline-block whitespace-nowrap">
            {sale}
          </span>
          {saleB}
        </p>
      </Section>

      <Section>
        <p style={{ margin: 0 }}>
          {lessonA}
          <Highlight text={lesson} on={at(2)} color={WASH} delay={300} />
          {lessonB}
        </p>
        <Note color={PEN} on={at(2)} delay={1500} style={{ ...MARGIN, top: "0.2cqw" }}>
          boring, expensive, and in norwegian
        </Note>
      </Section>

    </MiniPost>
  )
}
