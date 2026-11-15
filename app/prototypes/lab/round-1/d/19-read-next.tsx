"use client"

import * as React from "react"

import { nextPostSlug, posts, writingCopy, type PostSlug } from "@/lib/posts"

import { Bar, fontHand } from "../../kit"
import { FAINT, GREY, HAIR, INK, Sheet, Stage } from "./stage"

/**
 * 19 — Read next.
 *
 * The last thing on a post: a hairline, a grey label, and one title with its
 * arrow. The arrow is the only thing allowed to move on hover, and the only
 * thing with colour. Following it turns the page: what you were reading
 * shifts up into context and the next title slides in under the line.
 */

const RUST = "#C2410C"

export default function ReadNext() {
  const [slug, setSlug] = React.useState<PostSlug>("docdir-visma")
  const [turns, setTurns] = React.useState(0)
  const here = posts.en[slug]
  const nSlug = nextPostSlug(slug)
  const next = posts.en[nSlug]

  const follow = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return
    e.preventDefault()
    setSlug(nSlug)
    setTurns((n) => n + 1)
  }

  return (
    <Stage
      lead="One title, one arrow."
      rest="The end of a post offers a single next thing, and only the arrow moves."
    >
      <style>{css}</style>

      <Sheet style={{ width: "27em", top: "58%" }}>
        <div key={`h-${slug}`} className={turns ? "r19-up" : undefined}>
          <p
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: "1em",
              color: GREY,
            }}
          >
            <span style={{ color: INK, fontWeight: 560 }}>{here.title}</span>
            <span style={{ whiteSpace: "nowrap", fontVariantNumeric: "tabular-nums" }}>
              {here.date}
            </span>
          </p>
          <div style={{ marginTop: "1em", display: "grid", gap: "0.7em" }}>
            <Bar w="96%" />
            <Bar w="88%" />
            <Bar w="62%" />
          </div>
        </div>

        <div
          style={{
            marginTop: "1.5em",
            paddingTop: "1em",
            borderTop: `1px solid ${HAIR}`,
          }}
        >
          <p style={{ fontSize: "0.9em", color: FAINT }}>
            {writingCopy.en.readNextLabel}
          </p>
          <a
            href={`/writing/${nSlug}`}
            onClick={follow}
            className="d-press a19"
            style={{
              marginTop: "0.15em",
              display: "flex",
              alignItems: "center",
              gap: "0.4em",
              minHeight: 44,
              color: INK,
              textDecoration: "none",
            }}
          >
            <span
              key={nSlug}
              className={turns ? "r19-in" : undefined}
              style={{
                fontSize: "1.18em",
                fontWeight: 560,
                letterSpacing: "-0.012em",
                minWidth: 0,
              }}
            >
              <span className="t19">{next.title}</span>{" "}
              <span aria-hidden className="ar19">
                →
              </span>
            </span>
          </a>
          <p
            aria-live="polite"
            style={{ fontSize: "0.9em", color: FAINT, fontVariantNumeric: "tabular-nums" }}
          >
            {next.date} · {next.read}
          </p>
        </div>
      </Sheet>

      <div aria-hidden className="d-note n19">
        <span style={{ fontFamily: fontHand }}>only this moves</span>
      </div>
    </Stage>
  )
}

const css = `
.a19 { -webkit-tap-highlight-color: transparent; }
.t19 {
  text-decoration-line: underline;
  text-decoration-thickness: from-font;
  text-underline-offset: 0.2em;
  text-decoration-color: transparent;
  transition: text-decoration-color 180ms ease;
}
.ar19 {
  display: inline-block;
  color: ${GREY};
  transition: transform 220ms cubic-bezier(.3,.8,.3,1), color 180ms ease;
}
.a19:focus-visible .ar19 { color: ${RUST}; transform: translateX(0.22em); }
@media (hover: hover) and (pointer: fine) {
  .a19:hover .ar19 { color: ${RUST}; transform: translateX(0.22em); }
  .a19:hover .t19 { text-decoration-color: ${FAINT}; }
}
.r19-in { animation: r19-in 320ms cubic-bezier(.2,.8,.3,1) both; }
.r19-up { animation: r19-up 320ms cubic-bezier(.2,.8,.3,1) both; }
@keyframes r19-in {
  from { opacity: 0; transform: translateX(0.9em); }
  to { opacity: 1; transform: none; }
}
@keyframes r19-up {
  from { opacity: 0; transform: translateY(0.8em); }
  to { opacity: 1; transform: none; }
}
.n19 { right: 3.2em; bottom: 1.4em; transform: rotate(-4deg); }
@media (prefers-reduced-motion: reduce) {
  .ar19, .t19 { transition: color 180ms ease, text-decoration-color 180ms ease; }
  .a19:hover .ar19, .a19:focus-visible .ar19 { transform: none; }
  .r19-in, .r19-up { animation: r19-fade 200ms ease both; }
  @keyframes r19-fade { from { opacity: 0; } to { opacity: 1; } }
}
`
