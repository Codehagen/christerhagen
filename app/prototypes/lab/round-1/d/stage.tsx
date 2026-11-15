"use client"

import * as React from "react"

import { C, Lead, RING, Tile } from "../../kit"

/**
 * The quiet stage every d-piece stands on: the kit's grey tile with its lead
 * sentence, and one #FDFDFC sheet in the benji register (Inter 14, ink #111)
 * holding a single control. The tile sets one em to 2.5cqw, so everything
 * laid out in em scales with the frame.
 *
 * The CSS below is the shared touch contract: press gives (scale 0.97),
 * hover only where hover exists, a focus-visible ring, a 44px hit area that
 * is invisible but real, and a reduced-motion path.
 */

export const PAGE = C.page
export const INK = C.ink
export const GREY = "rgba(18,18,18,0.5)"
export const FAINT = "rgba(18,18,18,0.32)"
export const HAIR = "rgba(18,18,18,0.09)"

export function Stage({
  lead,
  rest,
  children,
}: {
  lead: string
  rest: string
  children: React.ReactNode
}) {
  return (
    <Tile className="d-stage">
      <style>{stageCss}</style>
      <Lead bold={lead} grey={rest} />
      {children}
    </Tile>
  )
}

/** The page the control sits on: centred, low, cropped by nothing. */
export function Sheet({
  children,
  style,
}: {
  children: React.ReactNode
  style?: React.CSSProperties
}) {
  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "56%",
        transform: "translate(-50%, -50%)",
        width: "26em",
        maxWidth: "calc(100% - 3.4em)",
        background: PAGE,
        borderRadius: "0.9em",
        boxShadow: RING,
        padding: "1.6em 1.7em",
        ...style,
      }}
    >
      {children}
    </div>
  )
}

/** A handwritten margin note; wide frames only. */
export const noteCss = `
.d-note { position: absolute; color: ${GREY}; pointer-events: none; }
.d-note span { display: block; font-size: 1.5em; line-height: 1.02; white-space: nowrap; }
@container (max-width: 460px) { .d-note { display: none; } }
`

const stageCss = `
:where(.d-stage) button { font: inherit; color: inherit; background: none; border: 0; padding: 0; cursor: pointer; touch-action: manipulation; -webkit-tap-highlight-color: transparent; }
.d-stage a { -webkit-tap-highlight-color: transparent; touch-action: manipulation; }

/* Press: the control gives under the finger. */
.d-press { transition: transform 140ms cubic-bezier(.2,.8,.3,1); }
.d-press:active { transform: scale(0.97); }

/* An invisible 44px target around a small visible thing. */
.d-hit { position: relative; }
.d-hit::after {
  content: "";
  position: absolute;
  left: 50%;
  top: 50%;
  width: max(100%, 44px);
  height: max(100%, 44px);
  transform: translate(-50%, -50%);
}

.d-stage :is(a, button, [tabindex]):focus { outline: none; }
.d-stage :is(a, button, [tabindex]):focus-visible {
  outline: 2px solid ${INK};
  outline-offset: 3px;
  border-radius: 0.3em;
}

${noteCss}

@media (prefers-reduced-motion: reduce) {
  .d-press, .d-press:active { transition: none; transform: none; }
}
`
