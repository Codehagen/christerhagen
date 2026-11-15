"use client"

import * as React from "react"

import type { Lang } from "@/lib/companies"
import { EMAIL } from "@/lib/content"
import { posts } from "@/lib/posts"

import { fontHand } from "../../kit"
import { Frame, G, LANGS, langKeys, tagOf, useCopy } from "./chrome"

/**
 * 38 — The footer is the address.
 *
 * The bottom of the Bodø post, and a footer with two things in it: the email,
 * with 17's copy beside it, and 18's EN / NO. No links list, no copyright.
 * Copy turns its glyph into a check that draws itself, and the pen writes
 * "copied" beside it for the same second and a half, then lets go.
 */

const GREEN = "#15803D"

const COPY: Record<Lang, { copy: string; copied: string; pen: string; manual: string; label: string }> = {
  en: { copy: "Copy", copied: "Copied", pen: "copied", manual: "Selected. Press ⌘C to copy.", label: "Copy email address" },
  no: { copy: "Kopier", copied: "Kopiert", pen: "kopiert", manual: "Markert. Trykk ⌘C for å kopiere.", label: "Kopier e-postadressen" },
}

export default function FooterIsTheAddress() {
  const [lang, setLang] = React.useState<Lang>("en")
  const { state, copy, ref } = useCopy(EMAIL)
  const langRefs = React.useRef<(HTMLElement | null)[]>([])
  const t = COPY[lang]
  const post = posts[lang]["building-in-bodo"]
  const done = state === "copied"

  return (
    <Frame label="A footer that is only the email and the language">
      <style>{css}</style>

      {/* The end of the page above it. */}
      <div
        key={lang}
        lang={tagOf(lang)}
        className="h2-reset absolute"
        style={{ top: "7cqw", left: "50%", width: "44cqw", marginLeft: "-22cqw", color: G.grey }}
      >
        <p>{post.body[1]}</p>
        <p style={{ marginTop: "2.8cqw", color: G.ink }}>{post.body[2]}</p>
      </div>

      <footer
        className="absolute inset-x-0 bottom-0"
        style={{ height: "25cqw", borderTop: `1px solid ${G.hair}` }}
      >
        <div
          className="absolute flex items-center justify-between gap-[3cqw]"
          style={{ top: "8.6cqw", left: "50%", width: "80cqw", marginLeft: "-40cqw" }}
        >
          <div className="flex min-w-0 items-center gap-[2cqw]">
            <a
              ref={ref}
              href={`mailto:${EMAIL}`}
              className="h38-a h2-hit"
              style={{ fontSize: "2.6cqw", fontWeight: 520, letterSpacing: "-0.012em", whiteSpace: "nowrap" }}
            >
              {EMAIL}
            </a>

            <span className="relative flex items-center">
              <button
                type="button"
                onClick={copy}
                aria-label={done ? t.copied : t.label}
                className="h2-press h2-hit h38-b"
                data-done={done || undefined}
                style={{ ["--hw" as string]: "44px" }}
              >
                <span aria-hidden className="relative block" style={{ width: "1.05em", height: "1.05em" }}>
                  <svg viewBox="0 0 16 16" className="h38-i h38-copy" fill="none">
                    <rect x="5" y="5" width="8.5" height="8.5" rx="2" />
                    <path d="M10.5 2.8 H4.8 A2 2 0 0 0 2.8 4.8 V10.5" />
                  </svg>
                  <svg viewBox="0 0 16 16" className="h38-i h38-check" fill="none">
                    <path pathLength={1} d="M3.2 8.6 L6.6 11.8 L12.8 4.6" />
                  </svg>
                </span>
                <span aria-hidden className="grid">
                  <span className="h38-w" data-on={!done || undefined}>
                    {t.copy}
                  </span>
                  <span className="h38-w" data-on={done || undefined}>
                    {t.copied}
                  </span>
                </span>
              </button>

              <span
                aria-hidden
                className="h38-pen absolute"
                data-on={done || undefined}
                style={{ left: "calc(100% + 1.2cqw)", top: "-0.4cqw", fontFamily: fontHand, fontSize: "3.2cqw", color: GREEN }}
              >
                {t.pen}
              </span>
            </span>
          </div>

          <div
            role="radiogroup"
            aria-label="Language"
            onKeyDown={(e) => langKeys(e, lang, setLang, langRefs)}
            className="flex shrink-0 items-center gap-[0.5cqw]"
            style={{ fontSize: "1.75cqw", letterSpacing: "0.02em" }}
          >
            {LANGS.map((l, i) => (
              <React.Fragment key={l.id}>
                {i > 0 ? (
                  <span aria-hidden style={{ color: "rgba(18,18,18,0.22)" }}>
                    /
                  </span>
                ) : null}
                <button
                  ref={(el) => {
                    langRefs.current[i] = el
                  }}
                  type="button"
                  role="radio"
                  aria-checked={lang === l.id}
                  aria-label={l.name}
                  tabIndex={lang === l.id ? 0 : -1}
                  onClick={() => setLang(l.id)}
                  className="h2-press h2-hit h38-l"
                  data-on={lang === l.id || undefined}
                  style={{ padding: "0.2em 0.25em", ["--hw" as string]: "40px" }}
                >
                  {l.label}
                </button>
              </React.Fragment>
            ))}
          </div>
        </div>

        <p
          aria-live="polite"
          className="absolute"
          style={{
            top: "14.6cqw",
            left: "50%",
            width: "80cqw",
            marginLeft: "-40cqw",
            fontSize: "1.75cqw",
            color: state === "manual" ? G.ink : "transparent",
            transitionProperty: "color",
            transitionDuration: "160ms",
          }}
        >
          {state === "manual" ? t.manual : done ? t.copied : ""}
        </p>
      </footer>
    </Frame>
  )
}

const css = `
.h38-a { text-decoration-line: underline; text-decoration-thickness: 1px; text-underline-offset: 0.22em; text-decoration-color: ${G.faint};
  transition-property: text-decoration-color; transition-duration: 180ms; }
.h38-b { display: inline-flex; align-items: center; gap: 0.4em; height: 2.2em; padding: 0 0.7em 0 0.6em; border-radius: 0.6em;
  font-size: 1.9cqw; color: ${G.grey}; box-shadow: inset 0 0 0 1px ${G.hair};
  transition-property: transform, color, background-color, box-shadow; transition-duration: 140ms, 160ms, 160ms, 160ms; transition-timing-function: cubic-bezier(.2,.8,.3,1); }
.h38-b[data-done] { color: ${GREEN}; box-shadow: inset 0 0 0 1px ${GREEN}40; background-color: ${GREEN}0D; }
.h38-i { position: absolute; inset: 0; width: 100%; height: 100%; stroke: currentColor; stroke-width: 1.5; stroke-linecap: round; stroke-linejoin: round;
  transition-property: opacity, transform; transition-duration: 160ms, 220ms; transition-timing-function: ease, cubic-bezier(.2,.8,.3,1); }
.h38-check { opacity: 0; transform: scale(0.6); }
.h38-check path { stroke-width: 1.8; stroke-dasharray: 1; stroke-dashoffset: 1; transition-property: stroke-dashoffset; transition-duration: 260ms; transition-delay: 60ms; transition-timing-function: cubic-bezier(.3,.8,.3,1); }
.h38-b[data-done] .h38-copy { opacity: 0; transform: scale(0.6); }
.h38-b[data-done] .h38-check { opacity: 1; transform: none; }
.h38-b[data-done] .h38-check path { stroke-dashoffset: 0; }
.h38-w { grid-area: 1 / 1; opacity: 0; transition-property: opacity; transition-duration: 140ms; }
.h38-w[data-on] { opacity: 1; }
.h38-pen { white-space: nowrap; rotate: -4deg; line-height: 1; pointer-events: none;
  clip-path: inset(-30% 100% -30% -4%); opacity: 0;
  transition-property: clip-path, opacity; transition-duration: 0ms, 260ms; }
.h38-pen[data-on] { clip-path: inset(-30% -4% -30% -4%); opacity: 1; transition-duration: 520ms, 0ms; transition-delay: 120ms, 0ms; transition-timing-function: cubic-bezier(.4,0,.3,1); }
.h38-l { position: relative; color: ${G.faint}; font-weight: 560; }
.h38-l[data-on] { color: ${G.ink}; cursor: default; }
@media (hover: hover) and (pointer: fine) {
  .h38-a:hover { text-decoration-color: ${G.ink}; }
  .h38-b:not([data-done]):hover { color: ${G.ink}; background-color: rgba(18,18,18,0.035); }
  .h38-l:not([data-on]):hover { color: ${G.ink}; }
}
@container (max-width: 460px) { .h38-pen { display: none; } }
@media (prefers-reduced-motion: reduce) {
  .h38-b { transition-property: color, background-color, box-shadow; }
  .h38-i, .h38-check, .h38-b[data-done] .h38-copy { transform: none; }
  .h38-check path { transition: none; stroke-dashoffset: 0; }
  .h38-pen, .h38-pen[data-on] { clip-path: none; transition-property: opacity; transition-duration: 200ms; transition-delay: 0ms; }
}
`
