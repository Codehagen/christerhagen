"use client"

import * as React from "react"

import { contactContent, EMAIL } from "@/lib/content"

import { fontHand } from "../../kit"
import { FAINT, GREY, HAIR, INK, Sheet, Stage } from "./stage"

/**
 * 17 — Copy the address.
 *
 * The one thing people come to a contact page for, as a single control: the
 * address is a plain mailto link, and beside it a copy button whose glyph
 * becomes a check that draws itself, holds for 1.5s, and gives the button
 * back. If the clipboard is refused, the address is selected instead.
 */

const GREEN = "#15803D"
const HOLD = 1500

type State = "idle" | "copied" | "manual"

export default function CopyEmail() {
  const [state, setState] = React.useState<State>("idle")
  const addr = React.useRef<HTMLAnchorElement>(null)
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
      // No clipboard (permissions, insecure context): select it for ⌘C.
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
    <Stage
      lead="Copy, and say so."
      rest="The glyph turns to a check for a second and a half, then hands the button back."
    >
      <style>{css}</style>

      <Sheet style={{ width: "27em" }}>
        <p style={{ color: GREY }}>Email</p>

        <div
          style={{
            marginTop: "0.35em",
            display: "flex",
            alignItems: "center",
            gap: "0.75em",
          }}
        >
          <a
            ref={addr}
            href={`mailto:${EMAIL}`}
            className="a17"
            style={{
              fontSize: "1.22em",
              fontWeight: 520,
              letterSpacing: "-0.012em",
              minWidth: 0,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {EMAIL}
          </a>

          <button
            type="button"
            onClick={copy}
            aria-label={done ? "Copied" : "Copy email address"}
            className="d-press d-hit b17"
            data-done={done || undefined}
            style={{
              marginLeft: "auto",
              flexShrink: 0,
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4em",
              height: "2.2em",
              padding: "0 0.7em 0 0.6em",
              borderRadius: "0.6em",
            }}
          >
            <span
              aria-hidden
              style={{ position: "relative", width: "1.05em", height: "1.05em" }}
            >
              <svg viewBox="0 0 16 16" className="i17 i17-copy" fill="none">
                <rect x="5" y="5" width="8.5" height="8.5" rx="2" />
                <path d="M10.5 2.8 H4.8 A2 2 0 0 0 2.8 4.8 V10.5" />
              </svg>
              <svg viewBox="0 0 16 16" className="i17 i17-check" fill="none">
                <path pathLength={1} d="M3.2 8.6 L6.6 11.8 L12.8 4.6" />
              </svg>
            </span>
            <span style={{ display: "grid" }}>
              <span className="w17" data-on={!done || undefined}>
                Copy
              </span>
              <span className="w17" data-on={done || undefined}>
                Copied
              </span>
            </span>
          </button>
        </div>

        <p
          aria-live="polite"
          style={{
            marginTop: "1.1em",
            paddingTop: "0.85em",
            borderTop: `1px solid ${HAIR}`,
            color: state === "manual" ? INK : FAINT,
            fontSize: "0.9em",
            transition: "color 160ms ease",
          }}
        >
          {state === "manual"
            ? "Selected. Press ⌘C to copy."
            : contactContent.en.availability}
        </p>
      </Sheet>

      <div aria-hidden className="d-note n17">
        <span style={{ fontFamily: fontHand }}>1.5 seconds,</span>
        <span style={{ fontFamily: fontHand }}>then it lets go</span>
      </div>
    </Stage>
  )
}

const css = `
.a17 {
  color: inherit;
  text-decoration-line: underline;
  text-decoration-thickness: from-font;
  text-underline-offset: 0.2em;
  text-decoration-color: ${FAINT};
  transition: text-decoration-color 180ms ease;
}
.b17 {
  color: ${GREY};
  background: transparent;
  box-shadow: inset 0 0 0 1px ${HAIR};
  transition: transform 140ms cubic-bezier(.2,.8,.3,1), color 160ms ease, background-color 160ms ease, box-shadow 160ms ease;
}
.b17[data-done] { color: ${GREEN}; box-shadow: inset 0 0 0 1px ${GREEN}40; background: ${GREEN}0D; }
.i17 {
  position: absolute; inset: 0; width: 100%; height: 100%;
  stroke: currentColor; stroke-width: 1.5; stroke-linecap: round; stroke-linejoin: round;
  transition: opacity 160ms ease, transform 220ms cubic-bezier(.2,.8,.3,1);
}
.i17-check { opacity: 0; transform: scale(0.6); }
.i17-check path { stroke-width: 1.8; stroke-dasharray: 1; stroke-dashoffset: 1; transition: stroke-dashoffset 260ms cubic-bezier(.3,.8,.3,1) 60ms; }
.b17[data-done] .i17-copy { opacity: 0; transform: scale(0.6); }
.b17[data-done] .i17-check { opacity: 1; transform: none; }
.b17[data-done] .i17-check path { stroke-dashoffset: 0; }
.w17 { grid-area: 1 / 1; opacity: 0; transition: opacity 140ms ease; }
.w17[data-on] { opacity: 1; }
.n17 { right: 3.4em; bottom: 2.4em; transform: rotate(-3deg); text-align: right; }
@media (hover: hover) and (pointer: fine) {
  .a17:hover { text-decoration-color: ${INK}; }
  .b17:not([data-done]):hover { color: ${INK}; background: rgba(18,18,18,0.035); }
}
@media (prefers-reduced-motion: reduce) {
  .b17, .a17 { transition: color 160ms ease, background-color 160ms ease; }
  .i17, .i17-check, .b17[data-done] .i17-copy { transform: none; }
  .i17-check path { transition: none; stroke-dashoffset: 0; }
}
`
