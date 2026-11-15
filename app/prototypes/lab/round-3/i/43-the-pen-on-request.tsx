"use client"

import { fontHand } from "../../kit"
import { G } from "../../round-2/h/chrome"
import { DesktopPost } from "./desktop"

/**
 * 43 — The pen on request.
 *
 * The apparel post with the pen off: a clean page, the margin empty except
 * for one line in the pen, level with the title, offering the notes. Ask and
 * the three marks draw in reading order; the offer turns into a grey line to
 * put them away. No switch in the rail: the margin is where the pen lives,
 * so the margin is where you ask for it.
 */

const RED = "oklch(0.56 0.2 27)"
const WASH = "color-mix(in oklch, oklch(0.62 0.2 27) 15%, transparent)"

const ASK = {
  en: { show: "read it with my notes", hide: "put the notes away" },
  no: { show: "les med notatene mine", hide: "legg bort notatene" },
}

const css = `
.i43-ask { position: absolute; left: calc(100% + 3cqw); top: 0; width: 20cqw; text-align: left; line-height: 1;
  font-size: 2.5cqw; rotate: -2deg; transition-property: color, translate; transition-duration: 200ms; transition-timing-function: cubic-bezier(.2,.8,.3,1); }
.i43-ask .i43-u { display: block; height: 0.5cqw; margin-top: 0.3cqw; width: 0; background: currentColor; border-radius: 1px; opacity: 0.6;
  transition-property: width; transition-duration: 320ms; transition-timing-function: cubic-bezier(.4,0,.3,1); }
@media (hover: hover) and (pointer: fine) {
  .i43-ask[data-ask]:hover { translate: 0.4cqw 0; }
  .i43-ask[data-ask]:hover .i43-u { width: 70%; }
  .i43-ask:not([data-ask]):hover { color: ${G.ink}; }
}
.i43-ask:focus-visible .i43-u { width: 70%; }
@media (prefers-reduced-motion: reduce) {
  .i43-ask, .i43-ask .i43-u { transition-duration: 0ms; }
  .i43-ask[data-ask]:hover { translate: none; }
}
`

export default function ThePenOnRequest() {
  return (
    <DesktopPost
      label="The apparel post, the pen off until asked for"
      slug="apparel-to-software"
      lang="en"
      color={RED}
      wash={WASH}
      penDefault={false}
      toggle={false}
      css={css}
      aside={({ pen, setPen, lang }) => (
        <button
          type="button"
          aria-pressed={pen}
          onClick={() => setPen((p) => !p)}
          className="h2-press h2-hit i43-ask"
          data-ask={!pen || undefined}
          style={{ position: "absolute", fontFamily: fontHand, color: pen ? G.faint : RED, ["--hw" as string]: "100%" }}
        >
          {pen ? ASK[lang].hide : ASK[lang].show}
          <span aria-hidden className="i43-u" />
        </button>
      )}
    />
  )
}
