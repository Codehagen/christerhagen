"use client"

import * as React from "react"

import { posts, postOrder } from "@/lib/posts"
import { Bracket } from "../../kit"

import { NoScrollbar, useScrollSpy } from "./ground"

/**
 * The Docdir post as a whole miniature page: a top band, a fixed left rail
 * that tracks the scroll, a centred column, and one margin note. Pieces 11 and
 * 12 render this same page on two grounds so the owner can choose between
 * them with nothing else changing.
 */

export type Ground = {
  label: string
  ground: string
  band: string
  /** Where the band meets the page. Kept nearly invisible on purpose. */
  bandEdge: string
  ink: string
  body: string
  grey: string
  railIdle: string
  railActive: string
  accent: string
  font: string
  railFont: string
  railSize: string
  railTracking: string
  metaFont: string
  noteFont: string
  noteSize: string
  /** A typeset italic note instead of a pen: no tilt. */
  noteItalic?: boolean
  bodySize: string
  bodyLeading: number
  bodyWeight: number
  titleSize: string
  titleWeight: number
  titleTracking: string
}

const post = posts.en["docdir-visma"]
const others = postOrder.filter((s) => s !== "docdir-visma").map((s) => posts.en[s])

const RAIL = ["The tool", "The sale", "The lesson", "Read next"]

export function PostPage({ g, label }: { g: Ground; label: string }) {
  const scrollerRef = React.useRef<HTMLDivElement>(null)
  const { active, go, reduced } = useScrollSpy(scrollerRef, RAIL.length, 1)
  const noteOn = active >= 1

  return (
    <div
      className="@container relative h-full w-full overflow-hidden"
      aria-label={label}
    >
      <NoScrollbar />
      <div
        className="relative h-full w-full overflow-hidden"
        style={{
          background: g.ground,
          color: g.ink,
          fontFamily: g.font,
          WebkitFontSmoothing: "antialiased",
          fontFeatureSettings: '"cv11", "ss01"',
        }}
      >
        <div
          ref={scrollerRef}
          className="c-scroll absolute inset-0 overflow-y-auto"
          tabIndex={0}
          aria-label="Selling Docdir to Visma"
          style={{ outline: "none" }}
        >
          {/* The band: a shade lighter than the page. It frames; it holds nothing. */}
          <div
            aria-hidden
            style={{
              height: "6.4cqw",
              background: g.band,
              boxShadow: `0 1px 0 ${g.bandEdge}`,
            }}
          />

          <article
            style={{
              width: "44cqw",
              margin: "0 auto",
              padding: "7.2cqw 0 34cqw",
              fontSize: g.bodySize,
              lineHeight: g.bodyLeading,
              fontWeight: g.bodyWeight,
              color: g.body,
            }}
          >
            <section data-section>
              <div
                style={{
                  fontFamily: g.metaFont,
                  fontSize: "1.55cqw",
                  letterSpacing: "0.02em",
                  color: g.grey,
                  marginBottom: "1.6cqw",
                }}
              >
                {post.date} · {post.read}
              </div>
              <h1
                style={{
                  margin: "0 0 3.6cqw",
                  fontSize: g.titleSize,
                  lineHeight: 1.18,
                  fontWeight: g.titleWeight,
                  letterSpacing: g.titleTracking,
                  color: g.ink,
                  textWrap: "balance",
                }}
              >
                {post.title}
              </h1>
              <p style={{ margin: 0 }}>{post.body[0]}</p>
            </section>

            <section data-section style={{ position: "relative", marginTop: "2.8cqw" }}>
              <p style={{ margin: 0 }}>{post.body[1]}</p>
              {/* The margin note: the only accent on the page. */}
              <div
                aria-hidden
                style={{
                  position: "absolute",
                  left: "calc(100% + 2.4cqw)",
                  top: "0.4cqw",
                  bottom: "0.4cqw",
                  display: "flex",
                  alignItems: "center",
                  gap: "1.2cqw",
                  width: "22cqw",
                  clipPath: noteOn ? "inset(0 0 0 0)" : "inset(0 100% 0 0)",
                  transitionProperty: "clip-path",
                  transitionDuration: reduced ? "0ms" : "700ms",
                  transitionTimingFunction: "cubic-bezier(0.2, 0.7, 0.2, 1)",
                  transitionDelay: noteOn && !reduced ? "250ms" : "0ms",
                }}
              >
                <Bracket color={g.accent} className="h-full w-[1.6cqw] shrink-0" />
                <span
                  style={{
                    fontFamily: g.noteFont,
                    fontSize: g.noteSize,
                    lineHeight: 1.1,
                    color: g.accent,
                    fontStyle: g.noteItalic ? "italic" : undefined,
                    transform: g.noteItalic ? undefined : "rotate(-2deg)",
                  }}
                >
                  the second from Bodø, after PowerOffice
                </span>
              </div>
            </section>

            <section data-section style={{ marginTop: "2.8cqw" }}>
              <p style={{ margin: 0 }}>{post.body[2]}</p>
            </section>

            <section data-section style={{ marginTop: "7cqw" }}>
              <div
                style={{
                  borderTop: `1px solid ${g.bandEdge}`,
                  paddingTop: "2.6cqw",
                  fontFamily: g.railFont,
                  fontSize: g.railSize,
                  letterSpacing: g.railTracking,
                  color: g.grey,
                  marginBottom: "1.2cqw",
                }}
              >
                Read next
              </div>
              {others.map((o) => (
                <div
                  key={o.title}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "2cqw",
                    padding: "0.9cqw 0",
                    color: g.ink,
                  }}
                >
                  <span>{o.title}</span>
                  <span style={{ color: g.grey, fontFamily: g.metaFont, fontSize: "1.55cqw", whiteSpace: "nowrap" }}>
                    {o.date}
                  </span>
                </div>
              ))}
            </section>
          </article>
        </div>

        {/* The rail: fixed to the frame, not to the page. */}
        <nav
          aria-label="On this page"
          style={{
            position: "absolute",
            left: "4.2cqw",
            top: "13.6cqw",
            display: "flex",
            flexDirection: "column",
            gap: "0.9cqw",
            fontFamily: g.railFont,
            fontSize: g.railSize,
            letterSpacing: g.railTracking,
            lineHeight: 1.35,
          }}
        >
          <span style={{ color: g.railIdle, marginBottom: "1.4cqw" }}>↩ Index</span>
          {RAIL.map((r, i) => (
            <button
              key={r}
              type="button"
              onClick={() => go(i)}
              aria-current={active === i ? "location" : undefined}
              style={{
                all: "unset",
                cursor: "pointer",
                color: active === i ? g.railActive : g.railIdle,
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
