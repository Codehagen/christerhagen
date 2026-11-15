"use client"

import * as React from "react"

import { fontHand, fontMono } from "../../kit"
import { FAINT, GREY, HAIR, INK, Sheet, Stage } from "./stage"

/**
 * 16 — The link itself.
 *
 * benji's links carry no colour: ink text, a fine underline drawn from the
 * font's own metrics, and a hover that only warms the line. Here the line is
 * the whole design, the destination shows in a status line the way a browser
 * would, and a toggle lays the real hit areas bare.
 */

const BLUE = "#2F5BEA"

const LINKS = {
  codebase: "/portfolio/codebase",
  bedrifty: "/portfolio/bedrifty",
  advanti: "/portfolio/advanti-estate",
} as const

type Key = keyof typeof LINKS

export default function LinkPiece() {
  const [hover, setHover] = React.useState<Key | null>(null)
  const [opened, setOpened] = React.useState<Key | null>(null)
  const [hits, setHits] = React.useState(false)
  const timer = React.useRef<number | undefined>(undefined)

  React.useEffect(() => () => window.clearTimeout(timer.current), [])

  const props = (k: Key) => ({
    href: LINKS[k],
    className: "l16",
    onPointerEnter: () => setHover(k),
    onPointerLeave: () => setHover((h) => (h === k ? null : h)),
    onFocus: () => setHover(k),
    onBlur: () => setHover((h) => (h === k ? null : h)),
    onClick: (e: React.MouseEvent<HTMLAnchorElement>) => {
      // Cmd/Ctrl/middle-click open for real; a plain click stays in the lab.
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return
      e.preventDefault()
      setOpened(k)
      window.clearTimeout(timer.current)
      timer.current = window.setTimeout(() => setOpened(null), 1600)
    },
  })

  const shown = opened ?? hover

  return (
    <Stage
      lead="A link needs no colour."
      rest="Ink text, a hairline from the font, and a hover that only warms the line."
    >
      <style>{css}</style>

      <Sheet style={{ width: "27em" }}>
        <div className="d16" data-hits={hits || undefined}>
          <p style={{ textWrap: "pretty" }}>
            Through <a {...props("codebase")}>Codebase</a> I build and back
            software companies. Today I’m building{" "}
            <a {...props("bedrifty")}>Bedrifty</a>, an AI-native CRM with
            built-in Norwegian company data, while partnering at{" "}
            <a {...props("advanti")}>Advanti Estate</a>.
          </p>
        </div>

        <div
          style={{
            marginTop: "1.3em",
            paddingTop: "0.9em",
            borderTop: `1px solid ${HAIR}`,
            display: "flex",
            alignItems: "center",
            gap: "1em",
          }}
        >
          <p
            aria-live="polite"
            style={{
              flex: 1,
              minWidth: 0,
              fontFamily: fontMono,
              fontSize: "0.82em",
              color: shown ? INK : FAINT,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              transition: "color 160ms ease",
            }}
          >
            {shown ? (
              <>
                <span style={{ color: GREY }}>
                  {opened ? "opening " : "→ "}
                </span>
                {LINKS[shown]}
              </>
            ) : (
              "point at a link"
            )}
          </p>

          <button
            type="button"
            aria-pressed={hits}
            onClick={() => setHits((v) => !v)}
            className="d-press d-hit t16"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.45em",
              color: hits ? INK : GREY,
              whiteSpace: "nowrap",
            }}
          >
            <span
              aria-hidden
              className="t16-box"
              style={{
                width: "0.8em",
                height: "0.8em",
                borderRadius: "0.2em",
                boxShadow: `inset 0 0 0 1px ${hits ? BLUE : FAINT}`,
                background: hits ? `${BLUE}1F` : "transparent",
              }}
            />
            Hit areas
          </button>
        </div>
      </Sheet>

      <div aria-hidden className="d-note" style={{ right: "4.6em", top: "8.4em" }}>
        <span style={{ fontFamily: fontHand, transform: "rotate(-4deg)" }}>
          the line is the colour
        </span>
      </div>
    </Stage>
  )
}

const css = `
.d16 a.l16 {
  position: relative;
  color: inherit;
  text-decoration-line: underline;
  text-decoration-thickness: from-font;
  text-underline-offset: 0.22em;
  text-decoration-color: ${FAINT};
  transition: text-decoration-color 180ms ease;
  -webkit-tap-highlight-color: transparent;
}
/* Inline links get the whole line pitch and a little air either side:
   tall enough to hit, never reaching into the line above or below. */
.d16 a.l16::after {
  content: "";
  position: absolute;
  left: -0.3em;
  right: -0.3em;
  top: 50%;
  height: 1.43em;
  transform: translateY(-50%);
  border-radius: 0.25em;
  transition: background-color 180ms ease, box-shadow 180ms ease;
}
.d16[data-hits] a.l16::after {
  background: ${BLUE}14;
  box-shadow: inset 0 0 0 1px ${BLUE}66;
}
.d16 a.l16:focus-visible { text-decoration-color: ${BLUE}; }
@media (hover: hover) and (pointer: fine) {
  .d16 a.l16:hover { text-decoration-color: ${BLUE}; }
  .t16:hover { color: ${INK} !important; }
}
.t16 { transition: transform 140ms cubic-bezier(.2,.8,.3,1), color 160ms ease; }
.t16-box { transition: box-shadow 160ms ease, background-color 160ms ease; }
@media (prefers-reduced-motion: reduce) {
  .d16 a.l16, .d16 a.l16::after, .t16, .t16-box { transition: none; }
}
`
