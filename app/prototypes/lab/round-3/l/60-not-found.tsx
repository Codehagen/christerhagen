"use client"

import * as React from "react"

import type { Lang } from "@/lib/companies"

import { fontHand } from "../../kit"
import { Frame } from "../../round-2/h/chrome"
import { Footer, G, Header, NAV, PageFor, SYSTEM_CSS, follow, hrefOf, navLabel, tagOf, useRoute, type Route } from "./system"

/**
 * 60 — The page that isn't there.
 *
 * The site's 404, word for word, inside the same chrome: the header with no
 * ring (there is no current page to mark), the recovery links as one quiet
 * line, and the footer's address. The pen does the one thing a lost reader
 * needs: an arrow up to the name in the header, which always goes home.
 * Follow anything and the chrome works as on every other page; scroll the
 * tile away and back and the broken link is there again. One rust pen.
 */

const RUST = "oklch(0.56 0.15 42)"

const COPY: Record<Lang, { head: string; body: string; back: string; look: string; home: string; note: [string, string] }> = {
  en: {
    head: "This page doesn’t exist.",
    body: "The link may be broken, or the page may have moved. Let’s get you back to something that does exist.",
    back: "Back home",
    look: "Where to look next",
    home: "Home",
    note: ["the name always", "takes you home"],
  },
  no: {
    head: "Denne siden finnes ikke.",
    body: "Lenken kan være ødelagt, eller så har siden flyttet. La oss få deg tilbake til noe som finnes.",
    back: "Tilbake til forsiden",
    look: "Hvor du bør se videre",
    home: "Forsiden",
    note: ["navnet tar deg", "alltid hjem"],
  },
}

function Missing({ lang, go }: { lang: Lang; go: (r: Route) => void }) {
  const t = COPY[lang]
  const links: { r: Route; label: string }[] = [{ r: "home", label: t.home }, ...NAV.map((k) => ({ r: k as Route, label: navLabel(k, lang) }))]
  return (
    <>
      <p className="l3-meta tabular-nums" style={{ color: G.grey, marginBottom: "0.7em" }}>
        404
      </p>
      <h1 data-title tabIndex={-1} className="l3-title">
        {t.head}
      </h1>
      <p style={{ marginTop: "0.8em", color: G.grey, textWrap: "pretty", maxWidth: "34em" }}>{t.body}</p>
      <p style={{ marginTop: "1.4em" }}>
        <a href={hrefOf("home", lang)} onClick={follow(() => go("home"))} className="h2-press l60-back">
          {t.back} <span aria-hidden className="l60-ar">→</span>
        </a>
      </p>
      <nav aria-label={t.look} style={{ marginTop: "2.6em", paddingTop: "1em", borderTop: `1px solid ${G.hair}` }}>
        <h2 className="l3-meta" style={{ color: G.faint, fontWeight: 460 }}>
          {t.look}
        </h2>
        <ul className="flex flex-wrap" style={{ gap: "0 1.4em", marginTop: "0.2em" }}>
          {links.map((l) => (
            <li key={l.r}>
              <a href={hrefOf(l.r, lang)} onClick={follow(() => go(l.r))} className="h2-press l60-rec">
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </>
  )
}

export default function NotFound() {
  const frameRef = React.useRef<HTMLDivElement>(null)
  const scroller = React.useRef<HTMLDivElement>(null)
  const [route, go] = useRoute("missing", scroller)
  const [lang, setLang] = React.useState<Lang>("en")
  const [seen, setSeen] = React.useState(false)
  const missing = route === "missing"
  const t = COPY[lang]

  // Seen draws the arrow; leaving the screen puts the broken link back.
  React.useEffect(() => {
    const el = frameRef.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e) return
        if (e.isIntersecting) setSeen(true)
        else go("missing", false)
      },
      { threshold: 0.4 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [go])

  return (
    <Frame label="christerhagen.com's not-found page inside the site chrome">
      <style>{SYSTEM_CSS + css}</style>
      <div ref={frameRef} className="absolute inset-0">
        <div
          ref={scroller}
          className="l3-scroll absolute inset-0 flex flex-col overflow-x-hidden overflow-y-auto"
          tabIndex={0}
          aria-label="The page, scrollable"
          style={{ outline: "none" }}
        >
          <Header route={route} lang={lang} setLang={setLang} go={go} color={RUST} on={seen} />
          <div lang={tagOf(lang)} className="relative flex flex-1 flex-col" style={{ marginLeft: "28cqw", width: "46cqw" }}>
            <main
              key={`${route}-${lang}`}
              className={missing ? "h2-reset flex flex-1 flex-col justify-center" : "h2-reset"}
              style={{ padding: missing ? "5cqw 0 6cqw" : "7.2cqw 0 9cqw" }}
            >
              {missing ? <Missing lang={lang} go={go} /> : <PageFor route={route} lang={lang} go={go} color={RUST} />}
            </main>
            <Footer lang={lang} color={RUST} />
          </div>

          {missing ? (
            <div key={lang} aria-hidden className="pointer-events-none absolute top-0 left-0" style={{ width: "100cqw", height: "75cqw" }} data-on={seen || undefined}>
              <svg viewBox="0 0 100 75" className="l60-arrow absolute inset-0 h-full w-full" data-on={seen || undefined}>
                <path pathLength={1} d="M 9.8 16.4 C 8.3 14, 8.7 10.6, 10.9 7.4" />
                <path pathLength={1} className="l60-head" d="M 8.7 9.1 C 9.6 8.4, 10.3 7.7, 10.9 7.2 C 11.4 8, 11.8 8.9, 12.3 9.8" />
              </svg>
              <p className="l60-note absolute" data-on={seen || undefined} style={{ left: "5.4cqw", top: "17.4cqw", fontFamily: fontHand, color: RUST }}>
                {t.note[0]}
                <br />
                {t.note[1]}
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </Frame>
  )
}

const css = `
.l60-back { display: inline-flex; align-items: center; gap: 0.3em; min-height: 44px; font-weight: 560; text-decoration-line: underline; text-decoration-thickness: 1px;
  text-underline-offset: 0.22em; text-decoration-color: ${G.faint}; transition-property: transform, text-decoration-color; transition-duration: 140ms, 180ms; }
.l60-ar { display: inline-block; color: ${G.grey}; transition-property: transform, color; transition-duration: 220ms, 180ms; transition-timing-function: cubic-bezier(.3,.8,.3,1), ease; }
.l60-back:focus-visible .l60-ar { color: ${RUST}; transform: translateX(0.22em); }
.h2c .l60-rec { display: inline-flex; align-items: center; min-height: 44px; color: ${G.grey}; text-decoration: none; }

.l60-arrow { overflow: visible; }
.l60-arrow path { fill: none; stroke: ${RUST}; stroke-width: 0.27; stroke-linecap: round; stroke-linejoin: round;
  stroke-dasharray: 1; stroke-dashoffset: 1; }
.l60-arrow[data-on] path { animation: l60-draw 620ms cubic-bezier(.45,.05,.25,1) 900ms both; }
.l60-arrow[data-on] .l60-head { animation-duration: 260ms; animation-delay: 1500ms; }
@keyframes l60-draw { from { stroke-dashoffset: 1; } to { stroke-dashoffset: 0; } }
.l60-note { font-size: 3.1cqw; line-height: 0.98; rotate: -4deg; white-space: nowrap; clip-path: inset(-30% 100% -30% -4%); }
.l60-note[data-on] { animation: l60-write 900ms cubic-bezier(.4,0,.3,1) 300ms both; }
@keyframes l60-write { from { clip-path: inset(-30% 100% -30% -4%); } to { clip-path: inset(-30% -4% -30% -4%); } }

@media (hover: hover) and (pointer: fine) {
  .l60-back:hover { text-decoration-color: ${G.ink}; }
  .l60-back:hover .l60-ar { color: ${RUST}; transform: translateX(0.22em); }
  .h2c .l60-rec:hover { color: ${G.ink}; }
}
@media (prefers-reduced-motion: reduce) {
  .l60-back { transition-property: text-decoration-color; }
  .l60-ar { transition-property: color; }
  .l60-back:hover .l60-ar, .l60-back:focus-visible .l60-ar { transform: none; }
  .l60-arrow path { stroke-dashoffset: 0; opacity: 0; }
  .l60-arrow[data-on] path, .l60-arrow[data-on] .l60-head { animation: l60-fade 240ms ease 200ms both; }
  .l60-note { clip-path: none; opacity: 0; }
  .l60-note[data-on] { animation: l60-fade 240ms ease 200ms both; }
  @keyframes l60-fade { from { opacity: 0; } to { opacity: 1; } }
}
`
