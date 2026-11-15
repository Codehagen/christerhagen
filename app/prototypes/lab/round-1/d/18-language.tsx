"use client"

import * as React from "react"

import { uiCopy, type Lang } from "@/lib/companies"
import { contactContent } from "@/lib/content"

import { fontHand } from "../../kit"
import { FAINT, GREY, HAIR, INK, Sheet, Stage } from "./stage"

/**
 * 18 — EN / NO.
 *
 * The site's language switch, kept as small as it is in the header: two
 * letters and a slash, the current one in ink. The push is the hand-off: the
 * underline leaves one letter and arrives at the other, and the page under it
 * re-sets in the new language instead of jumping.
 */

const TEAL = "#0F766E"

const LANGS: { id: Lang; label: string; name: string; tag: string }[] = [
  { id: "en", label: "EN", name: "English", tag: "en" },
  { id: "no", label: "NO", name: "Norsk", tag: "nb" },
]

export default function Language() {
  const [lang, setLang] = React.useState<Lang>("en")
  const refs = React.useRef<(HTMLButtonElement | null)[]>([])
  const t = uiCopy[lang]
  const c = contactContent[lang]
  const tag = LANGS.find((l) => l.id === lang)!.tag

  const onKey = (e: React.KeyboardEvent) => {
    if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)) return
    e.preventDefault()
    const next = lang === "en" ? 1 : 0
    setLang(LANGS[next].id)
    refs.current[next]?.focus()
  }

  return (
    <Stage
      lead="Two letters and a slash."
      rest="The switch stays as small as it is in the header; the page under it does the moving."
    >
      <style>{css}</style>

      <Sheet style={{ width: "27em", padding: "1.1em 1.5em 1.5em" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingBottom: "0.9em",
            borderBottom: `1px solid ${HAIR}`,
          }}
        >
          <span style={{ fontWeight: 560 }}>Christer Hagen</span>

          <div
            role="radiogroup"
            aria-label="Language"
            onKeyDown={onKey}
            style={{ display: "inline-flex", alignItems: "center", gap: "0.35em" }}
          >
            {LANGS.map((l, i) => {
              const on = l.id === lang
              return (
                <React.Fragment key={l.id}>
                  {i > 0 ? (
                    <span aria-hidden style={{ color: "rgba(18,18,18,0.22)" }}>
                      /
                    </span>
                  ) : null}
                  <button
                    ref={(el) => {
                      refs.current[i] = el
                    }}
                    type="button"
                    role="radio"
                    aria-checked={on}
                    aria-label={l.name}
                    tabIndex={on ? 0 : -1}
                    onClick={() => setLang(l.id)}
                    className="d-press d-hit b18"
                    data-on={on || undefined}
                    style={{
                      padding: "0.15em 0.2em",
                      fontSize: "0.92em",
                      fontWeight: 560,
                      letterSpacing: "0.02em",
                    }}
                  >
                    {l.label}
                    <span
                      aria-hidden
                      className="u18"
                      style={{ transformOrigin: i === 0 ? "right" : "left" }}
                    />
                  </button>
                </React.Fragment>
              )
            })}
          </div>
        </div>

        <div key={lang} lang={tag} className="r18" style={{ marginTop: "1.2em" }}>
          <p style={{ color: GREY }}>{c.kicker}</p>
          <p
            style={{
              marginTop: "0.3em",
              fontSize: "1.3em",
              lineHeight: 1.25,
              fontWeight: 560,
              letterSpacing: "-0.014em",
            }}
          >
            {c.head}
          </p>
          <p style={{ marginTop: "0.5em", color: GREY, textWrap: "pretty" }}>
            {c.body}
          </p>
          <p
            aria-hidden
            style={{
              marginTop: "1.1em",
              display: "flex",
              gap: "1em",
              fontSize: "0.9em",
              color: FAINT,
            }}
          >
            <span>{t.navAbout}</span>
            <span>{t.navPortfolio}</span>
            <span>{t.navWriting}</span>
            <span style={{ color: INK }}>{t.navContact}</span>
          </p>
        </div>
      </Sheet>

      <div aria-hidden className="d-note n18">
        <span style={{ fontFamily: fontHand }}>same page,</span>
        <span style={{ fontFamily: fontHand }}>other tongue</span>
      </div>
    </Stage>
  )
}

const css = `
.b18 {
  color: ${FAINT};
  transition: transform 140ms cubic-bezier(.2,.8,.3,1), color 180ms ease;
}
.b18[data-on] { color: ${INK}; cursor: default; }
.u18 {
  position: absolute;
  left: 0.2em;
  right: 0.2em;
  bottom: -0.05em;
  height: 1.5px;
  border-radius: 1px;
  background: ${TEAL};
  transform: scaleX(0);
  transition: transform 220ms cubic-bezier(.3,.8,.3,1);
}
.b18[data-on] .u18 { transform: scaleX(1); transition-delay: 90ms; }
.r18 { animation: r18 300ms cubic-bezier(.2,.8,.3,1) both; }
@keyframes r18 {
  from { opacity: 0; transform: translateY(0.3em); }
  to { opacity: 1; transform: none; }
}
.n18 { right: 3em; bottom: 2em; transform: rotate(-3deg); text-align: right; }
@media (hover: hover) and (pointer: fine) {
  .b18:not([data-on]):hover { color: ${INK}; }
}
@media (prefers-reduced-motion: reduce) {
  .b18 { transition: color 180ms ease; }
  .u18, .b18[data-on] .u18 { transition: none; }
  .r18 { animation: r18-fade 200ms ease both; }
  @keyframes r18-fade { from { opacity: 0; } to { opacity: 1; } }
}
`
