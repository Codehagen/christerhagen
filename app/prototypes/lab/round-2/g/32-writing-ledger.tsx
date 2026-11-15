"use client"

import * as React from "react"

import { uiCopy, type Lang } from "@/lib/companies"
import { postOrder, posts } from "@/lib/posts"

import { C, fontHand, useSeen } from "../../kit"
import { Ground, HAIR, RULE, useReplay } from "./_ledger"

/**
 * 32 — The writing, as a ledger.
 *
 * The posts set like 08's companies: year once per group, title, read time,
 * dd/mm, in tabular figures. The newest title takes 05's highlighter, swept
 * the way a hand drags it, and the rest of the ledger steps back. The EN / NO
 * switch from 18 does one real thing: the ledger re-sets in the other
 * language, and the pen sweeps the newest again. Tapping the ledger replays.
 */

const HL = "oklch(0.91 0.16 99)"

const LANGS: { id: Lang; label: string; name: string; tag: string }[] = [
  { id: "en", label: "EN", name: "English", tag: "en" },
  { id: "no", label: "NO", name: "Norsk", tag: "nb" },
]

const NOTE: Record<Lang, [string, string]> = {
  en: ["the newest.", "how docdir went to visma"],
  no: ["den nyeste.", "da docdir gikk til visma"],
}

const COUNT: Record<Lang, (n: number) => string> = {
  en: (n) => `${n} posts`,
  no: (n) => `${n} tekster`,
}

const css = `
.g32-hl {
  background-image: linear-gradient(${HL}, ${HL});
  background-repeat: no-repeat;
  background-position: 0 62%;
  background-size: 0% 80%;
  transition-property: background-size;
  transition-duration: 0ms;
  transition-timing-function: cubic-bezier(.4,.1,.3,1);
}
.g32-hl[data-on] { background-size: 100% 80%; transition-duration: 520ms; transition-delay: 120ms; }
.g32-rest { transition-property: color; transition-duration: 0ms; }
.g32-rest[data-on] { color: rgba(18,18,18,0.3); transition-duration: 480ms; transition-delay: 760ms; }
.g32-note { opacity: 0; rotate: -6deg; translate: -0.6cqw 0.4cqw;
  transition-property: opacity, rotate, translate; transition-duration: 0ms; }
.g32-note[data-on] { opacity: 1; rotate: -3deg; translate: 0 0; transition-duration: 360ms; transition-delay: 900ms; transition-timing-function: cubic-bezier(.2,.8,.2,1); }
.g32-set { animation: g32-set 300ms cubic-bezier(.2,.8,.3,1) both; }
@keyframes g32-set { from { opacity: 0; transform: translateY(0.5cqw); } to { opacity: 1; transform: none; } }
.g32-lang { color: ${C.faint}; transition-property: color; transition-duration: 160ms; }
.g32-lang[data-on] { color: ${C.ink}; cursor: default; }
.g32-u { position: absolute; left: 0; right: 0; bottom: -0.3cqw; height: 1.5px; background: ${C.ink};
  transform: scaleX(0); transition-property: transform; transition-duration: 220ms; transition-timing-function: cubic-bezier(.3,.8,.3,1); }
.g32-lang[data-on] .g32-u { transform: scaleX(1); transition-delay: 90ms; }
.g32 :is(button):focus { outline: none; }
.g32 :is(button):focus-visible { outline: 2px solid ${C.ink}; outline-offset: 0.5cqw; border-radius: 0.4cqw; }
@media (hover: hover) and (pointer: fine) { .g32-lang:not([data-on]):hover { color: ${C.ink}; } }
@media (prefers-reduced-motion: reduce) {
  .g32-hl, .g32-hl[data-on], .g32-rest, .g32-rest[data-on], .g32-note, .g32-note[data-on], .g32-lang, .g32-u, .g32-lang[data-on] .g32-u {
    transition-duration: 0ms; transition-delay: 0ms;
  }
  .g32-note, .g32-note[data-on] { rotate: -3deg; translate: 0 0; }
  .g32-set { animation: g32-fade 200ms ease both; }
  @keyframes g32-fade { from { opacity: 0; } to { opacity: 1; } }
}
`

export default function WritingLedger() {
  const [ref, seen] = useSeen<HTMLDivElement>()
  const [on, replay] = useReplay(seen)
  const [lang, setLang] = React.useState<Lang>("en")
  const refs = React.useRef<(HTMLButtonElement | null)[]>([])
  const tag = LANGS.find((l) => l.id === lang)!.tag
  const d = on || undefined

  const rows = [...postOrder]
    .map((slug) => ({ slug, ...posts[lang][slug] }))
    .sort((a, b) => b.dateISO.localeCompare(a.dateISO))
  const minutes = rows.reduce((n, r) => n + parseInt(r.read, 10), 0)

  const pick = (next: Lang) => {
    if (next === lang) return
    setLang(next)
    replay()
  }

  const onKey = (e: React.KeyboardEvent) => {
    if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)) return
    e.preventDefault()
    const i = lang === "en" ? 1 : 0
    pick(LANGS[i].id)
    refs.current[i]?.focus()
  }

  return (
    <Ground
      className="g32"
      bold="The writing, as a ledger."
      grey="Year, title, read time, date. The newest takes the highlighter; the rest steps back."
    >
      <style>{css}</style>

      <div
        ref={ref}
        className="absolute tabular-nums"
        style={{ top: "21cqw", left: "5.4cqw", width: "62cqw", fontSize: "2.2cqw", lineHeight: 1.3 }}
      >
        <div className="flex items-center gap-[1.6cqw]">
          <span style={{ color: C.grey }}>{uiCopy[lang].navWriting}</span>
          <span aria-hidden className="h-px flex-1" style={{ background: HAIR }} />
          <div
            role="radiogroup"
            aria-label="Language"
            onKeyDown={onKey}
            className="flex items-center gap-[0.8cqw]"
            style={{ fontSize: "1.9cqw", fontWeight: 560, letterSpacing: "0.02em" }}
          >
            {LANGS.map((l, i) => (
              <React.Fragment key={l.id}>
                {i > 0 ? (
                  <span aria-hidden style={{ color: "rgba(18,18,18,0.22)", fontWeight: 460 }}>
                    /
                  </span>
                ) : null}
                <button
                  ref={(el) => {
                    refs.current[i] = el
                  }}
                  type="button"
                  role="radio"
                  aria-checked={l.id === lang}
                  aria-label={l.name}
                  tabIndex={l.id === lang ? 0 : -1}
                  onClick={() => pick(l.id)}
                  className="g32-lang relative cursor-pointer"
                  data-on={l.id === lang || undefined}
                  style={{ touchAction: "manipulation", padding: "0.4cqw 0.2cqw" }}
                >
                  {l.label}
                  <span aria-hidden className="g32-u" style={{ transformOrigin: i === 0 ? "right" : "left" }} />
                </button>
              </React.Fragment>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={replay}
          aria-label="Sweep the highlighter again"
          className="mt-[1.4cqw] block w-full cursor-pointer text-left"
          style={{ touchAction: "manipulation" }}
        >
          <span key={lang} lang={tag} className="g32-set block">
            {rows.map((r, i) => {
              const year = r.dateISO.slice(0, 4)
              const first = i === 0 || rows[i - 1].dateISO.slice(0, 4) !== year
              const newest = i === 0
              return (
                <span
                  key={r.slug}
                  className="grid items-baseline py-[1.3cqw]"
                  style={{
                    gridTemplateColumns: "7.4cqw 1fr 6.6cqw 6.4cqw",
                    columnGap: "1.4cqw",
                    borderTop: `1px solid ${i === 0 ? RULE : HAIR}`,
                  }}
                >
                  <span className={newest ? "" : "g32-rest"} data-on={newest ? undefined : d} style={{ color: C.grey }}>
                    {first ? year : ""}
                  </span>
                  <span className="block min-w-0">
                    <span
                      className={newest ? "g32-hl" : "g32-rest"}
                      data-on={d}
                      style={{ fontWeight: 520, WebkitBoxDecorationBreak: "clone", boxDecorationBreak: "clone" }}
                    >
                      {r.title}
                    </span>
                    <span
                      className="g32-rest mt-[0.4cqw] block"
                      data-on={d}
                      style={{ color: C.grey, fontSize: "1.85cqw", lineHeight: 1.35, textWrap: "pretty" }}
                    >
                      {r.excerpt}
                    </span>
                  </span>
                  <span className={newest ? "" : "g32-rest"} data-on={newest ? undefined : d} style={{ color: C.grey }}>
                    {r.read}
                  </span>
                  <span
                    className={`text-right ${newest ? "" : "g32-rest"}`}
                    data-on={newest ? undefined : d}
                    style={{ color: C.grey }}
                  >
                    {r.dateISO.slice(8, 10)}/{r.dateISO.slice(5, 7)}
                  </span>
                </span>
              )
            })}
            <span
              className="g32-rest grid pt-[1.1cqw]"
              data-on={d}
              style={{ gridTemplateColumns: "7.4cqw 1fr 6.6cqw 6.4cqw", columnGap: "1.4cqw", borderTop: `1px solid ${RULE}`, color: C.faint }}
            >
              <span />
              <span>{COUNT[lang](rows.length)}</span>
              <span>{minutes} min</span>
              <span />
            </span>
          </span>
        </button>
      </div>

      <p
        aria-hidden
        key={`n-${lang}`}
        className="g32-note absolute leading-[0.95]"
        data-on={d}
        style={{
          top: "27.4cqw",
          left: "71cqw",
          width: "24cqw",
          fontFamily: fontHand,
          fontSize: "3.6cqw",
          color: C.ink,
        }}
      >
        ← {NOTE[lang][0]}
        <br />
        {NOTE[lang][1]}
      </p>
    </Ground>
  )
}
