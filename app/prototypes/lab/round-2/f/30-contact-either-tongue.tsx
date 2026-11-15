"use client"

import * as React from "react"

import { uiCopy, type Lang } from "@/lib/companies"
import { EMAIL, contactContent, socialLinks } from "@/lib/content"

import { fontHand } from "../../kit"
import { G, Rail, Rule, SitePage, TYPE } from "./frame"

/**
 * 30 — The contact page, in either language. The rail is the site nav with
 * Contact in ink; across from it, EN / NO (piece 18) sits as small as it is in
 * the header and re-sets the whole page, rail included. The address carries
 * piece 17's copy button; the socials are a two-column ledger. One teal for
 * the switch's underline, the check, and one pen line in the margin.
 */

const TEAL = "#0F766E"
const HOLD = 1500

const LANGS: { id: Lang; label: string; name: string; tag: string }[] = [
  { id: "en", label: "EN", name: "English", tag: "en" },
  { id: "no", label: "NO", name: "Norsk", tag: "nb" },
]

const COPY = {
  en: { copy: "Copy", copied: "Copied", aria: "Copy email address", manual: "Selected. Press ⌘C to copy.", note: "a few lines is enough" },
  no: { copy: "Kopier", copied: "Kopiert", aria: "Kopier e-postadressen", manual: "Markert. Trykk ⌘C for å kopiere.", note: "noen linjer holder" },
} as const

type State = "idle" | "copied" | "manual"

const css = `
.f30-lang { all: unset; position: relative; cursor: pointer; padding: 0.3cqw 0.4cqw; font-weight: 560; letter-spacing: 0.02em;
  color: ${G.faint}; transition-property: color, transform; transition-duration: 180ms, 140ms; touch-action: manipulation; }
.f30-lang[data-on] { color: ${G.ink}; cursor: default; }
.f30-lang:active { transform: scale(0.97); }
.f30-lang:focus-visible { outline: 1.5px solid ${G.ink}; outline-offset: 0.3cqw; border-radius: 0.3cqw; }
.f30-u { position: absolute; left: 0.4cqw; right: 0.4cqw; bottom: 0; height: 1.5px; border-radius: 1px; background: ${TEAL};
  transform: scaleX(0); transition: transform 220ms cubic-bezier(.3,.8,.3,1); }
.f30-lang[data-on] .f30-u { transform: scaleX(1); transition-delay: 90ms; }
@media (hover: hover) and (pointer: fine) { .f30-lang:not([data-on]):hover { color: ${G.ink}; } }

.f30-page { animation: f30-in 300ms cubic-bezier(.2,.8,.3,1) both; }
@keyframes f30-in { from { opacity: 0; transform: translateY(0.6cqw); } to { opacity: 1; transform: none; } }

.f30-btn { all: unset; display: inline-flex; align-items: center; gap: 0.8cqw; height: 4.2cqw; padding: 0 1.3cqw 0 1.1cqw; border-radius: 1.2cqw;
  color: ${G.grey}; box-shadow: inset 0 0 0 1px ${G.hair}; cursor: pointer; touch-action: manipulation; font-size: 1.8cqw;
  transition: transform 140ms cubic-bezier(.2,.8,.3,1), color 160ms ease, background-color 160ms ease, box-shadow 160ms ease; }
.f30-btn:active { transform: scale(0.97); }
.f30-btn:focus-visible { outline: 1.5px solid ${G.ink}; outline-offset: 0.4cqw; }
.f30-btn[data-done] { color: ${TEAL}; box-shadow: inset 0 0 0 1px ${TEAL}40; background: ${TEAL}0D; }
@media (hover: hover) and (pointer: fine) { .f30-btn:not([data-done]):hover { color: ${G.ink}; background: rgba(18,18,18,0.035); } }
.f30-i { position: absolute; inset: 0; width: 100%; height: 100%; stroke: currentColor; stroke-width: 1.5; stroke-linecap: round; stroke-linejoin: round;
  transition: opacity 160ms ease, transform 220ms cubic-bezier(.2,.8,.3,1); }
.f30-check { opacity: 0; transform: scale(0.6); }
.f30-check path { stroke-width: 1.8; stroke-dasharray: 1; stroke-dashoffset: 1; transition: stroke-dashoffset 260ms cubic-bezier(.3,.8,.3,1) 60ms; }
.f30-btn[data-done] .f30-copy { opacity: 0; transform: scale(0.6); }
.f30-btn[data-done] .f30-check { opacity: 1; transform: none; }
.f30-btn[data-done] .f30-check path { stroke-dashoffset: 0; }
.f30-w { grid-area: 1 / 1; opacity: 0; transition: opacity 140ms ease; }
.f30-w[data-on] { opacity: 1; }

@media (prefers-reduced-motion: reduce) {
  .f30-lang, .f30-btn { transition: color 160ms ease, background-color 160ms ease; }
  .f30-lang:active, .f30-btn:active { transform: none; }
  .f30-u, .f30-lang[data-on] .f30-u { transition: none; }
  .f30-page { animation: f30-fade 200ms ease both; }
  @keyframes f30-fade { from { opacity: 0; } to { opacity: 1; } }
  .f30-i, .f30-check, .f30-btn[data-done] .f30-copy { transform: none; }
  .f30-check path { transition: none; stroke-dashoffset: 0; }
}
`

function LangSwitch({ lang, setLang }: { lang: Lang; setLang: (l: Lang) => void }) {
  const refs = React.useRef<(HTMLButtonElement | null)[]>([])
  const onKey = (e: React.KeyboardEvent) => {
    if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)) return
    e.preventDefault()
    const next = lang === "en" ? 1 : 0
    setLang(LANGS[next].id)
    refs.current[next]?.focus()
  }
  return (
    <div
      role="radiogroup"
      aria-label="Language"
      onKeyDown={onKey}
      className="absolute inline-flex items-center"
      style={{ right: "4.2cqw", top: "13.3cqw", gap: "0.5cqw", fontSize: "1.85cqw" }}
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
              className="f30-lang"
              data-on={on || undefined}
            >
              {l.label}
              <span aria-hidden className="f30-u" style={{ transformOrigin: i === 0 ? "right" : "left" }} />
            </button>
          </React.Fragment>
        )
      })}
    </div>
  )
}

export default function ContactEitherTongue() {
  const scrollerRef = React.useRef<HTMLDivElement>(null)
  const addr = React.useRef<HTMLAnchorElement>(null)
  const timer = React.useRef<number | undefined>(undefined)
  const [lang, setLang] = React.useState<Lang>("en")
  const [state, setState] = React.useState<State>("idle")
  const c = contactContent[lang]
  const u = uiCopy[lang]
  const k = COPY[lang]
  const tag = LANGS.find((l) => l.id === lang)!.tag
  const social = socialLinks(lang).filter((s) => !s.url.startsWith("mailto:"))

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
    <SitePage
      label="christerhagen.com, the contact page"
      scrollerRef={scrollerRef}
      lang={tag}
      rail={
        <Rail
          mode="static"
          label="Site"
          head={<span style={{ color: G.ink, fontWeight: 560 }}>Christer Hagen</span>}
          items={[u.navAbout, u.navPortfolio, u.navWriting, u.navContact]}
          active={3}
        />
      }
      corner={<LangSwitch lang={lang} setLang={setLang} />}
    >
      <style>{css}</style>
      <div key={lang} className="f30-page">
        <p style={{ margin: 0, color: G.grey }}>{c.kicker}</p>
        <h1 style={{ ...TYPE.title, fontSize: "3.6cqw", margin: "1cqw 0 0" }}>{c.head}</h1>
        <p style={{ margin: "1.4cqw 0 0", color: G.grey, textWrap: "pretty" }}>{c.body}</p>

        <div className="relative flex items-center" style={{ marginTop: "4cqw", gap: "1.6cqw" }}>
          <a
            ref={addr}
            href={`mailto:${EMAIL}`}
            className="f-link min-w-0 truncate"
            style={{ fontSize: "2.3cqw", fontWeight: 520, letterSpacing: "-0.012em" }}
          >
            {EMAIL}
          </a>
          <button type="button" onClick={copy} aria-label={done ? k.copied : k.aria} className="f30-btn" data-done={done || undefined} style={{ marginLeft: "auto", flexShrink: 0 }}>
            <span aria-hidden className="relative" style={{ width: "2cqw", height: "2cqw" }}>
              <svg viewBox="0 0 16 16" className="f30-i f30-copy" fill="none">
                <rect x="5" y="5" width="8.5" height="8.5" rx="2" />
                <path d="M10.5 2.8 H4.8 A2 2 0 0 0 2.8 4.8 V10.5" />
              </svg>
              <svg viewBox="0 0 16 16" className="f30-i f30-check" fill="none">
                <path pathLength={1} d="M3.2 8.6 L6.6 11.8 L12.8 4.6" />
              </svg>
            </span>
            <span style={{ display: "grid" }}>
              <span className="f30-w" data-on={!done || undefined}>
                {k.copy}
              </span>
              <span className="f30-w" data-on={done || undefined}>
                {k.copied}
              </span>
            </span>
          </button>
          <span
            aria-hidden
            className="absolute block"
            style={{
              left: "calc(100% + 3cqw)",
              top: "-1.2cqw",
              width: "18cqw",
              rotate: "-4deg",
              fontFamily: fontHand,
              fontSize: "3.6cqw",
              lineHeight: 0.95,
              color: TEAL,
            }}
          >
            ← {k.note}
          </span>
        </div>
        <p aria-live="polite" style={{ ...TYPE.meta, margin: "1.4cqw 0 0", color: state === "manual" ? G.ink : G.faint }}>
          {state === "manual" ? k.manual : c.availability}
        </p>

        <ul style={{ marginTop: "3.6cqw" }}>
          {social.map((s, i) => (
            <li
              key={s.label}
              className="flex items-baseline justify-between"
              style={{ padding: "0.8cqw 0", borderTop: `1px solid ${i ? G.hair : "rgba(18,18,18,0.12)"}` }}
            >
              <span style={{ color: G.grey }}>{s.label}</span>
              <a className="f-link" href={s.url} target="_blank" rel="noopener noreferrer">
                {s.handle}
              </a>
            </li>
          ))}
        </ul>

        <Rule>{c.lookHead}</Rule>
        <p style={{ margin: 0, textWrap: "pretty" }}>{c.lookBody}</p>
      </div>
    </SitePage>
  )
}
