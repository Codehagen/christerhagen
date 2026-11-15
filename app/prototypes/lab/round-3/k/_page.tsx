"use client"

import * as React from "react"

import { companies, companyOrder, nextSlug, uiCopy, type CompanySlug, type Lang } from "@/lib/companies"
import { EMAIL } from "@/lib/content"

import { fontHand } from "../../kit"
import { G, LANGS, TravelRing, langKeys, useBox, useCopy } from "../../round-2/h/chrome"
import { ringCss } from "../../round-2/g/_ledger"

/**
 * Group k (round 3): the portfolio and company pages, finished. Every piece is
 * a whole scrollable page on benji's ground, built only from what was kept:
 * 36's header (the current section ringed, EN / NO as two quiet letters),
 * 08/31's ledger whose rows say how they ended, 29's facts with one ring,
 * 13's wall as a stage, 07's colourless links that preview, 19's read next,
 * and 38's footer that is only the address. One pen colour per page, passed
 * in as `--pen` so every part below draws with it.
 */

export { G }

/** The column every page shares, in cqw. The 30cqw to its right is the margin, where the pen writes. */
export const COL = { left: 16, width: 54 }

/** Links go nowhere in the lab; on the site they are real routes. */
export const stay = (e: React.MouseEvent) => {
  if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return
  e.preventDefault()
}

export const href = (path: string, lang: Lang) => (lang === "en" ? path : `/no${path}`)

/* ------------------------------------------------------------------ facts */

/** End years the site states (lib/content work periods, lib/companies body). */
const ENDED: Partial<Record<CompanySlug, string>> = { refenze: "2018", sailsdock: "2026", docdir: "2026" }

export function outcome(slug: CompanySlug, lang: Lang) {
  const c = companies[lang][slug]
  const active = c.status === companies[lang].codebase.status
  if (active) return { text: c.status, live: true }
  const end = ENDED[slug]
  return { text: end ? `${c.stage}, ${end}` : c.stage, live: false }
}

/** Newest first, the year printed once per group (08). */
export function ledgerRows(lang: Lang) {
  return [...companyOrder]
    .map((slug) => {
      const c = companies[lang][slug]
      return { slug, year: c.year, name: c.name, role: c.role, ...outcome(slug, lang) }
    })
    .sort((a, b) => b.year.localeCompare(a.year) || a.name.localeCompare(b.name))
}

export type FactKey = "role" | "stage" | "year" | "sector"

/**
 * For each company: the one fact the ring belongs on, and what the pen says
 * beside it. Short, dry paraphrases of the site's own copy, nothing more.
 */
export const PEN: Record<CompanySlug, { fact: FactKey; en: string; no: string }> = {
  codebase: { fact: "stage", en: "the studio everything runs through", no: "studioet alt går gjennom" },
  bedrifty: { fact: "stage", en: "sailsdock's problem, rebuilt around ai", no: "sailsdocks problem, bygget på nytt rundt ai" },
  sailsdock: { fact: "stage", en: "wound down. the ideas went to bedrifty", no: "avviklet. ideene gikk til bedrifty" },
  "advanti-estate": { fact: "role", en: "software for an analogue trade", no: "programvare til en analog bransje" },
  miniskatten: { fact: "role", en: "with maria, who runs it", no: "med maria, som driver den" },
  refenze: { fact: "year", en: "the first one. cash, inventory, shipping", no: "det første. kapital, lager, frakt" },
  codenord: { fact: "stage", en: "pre-seed, through not another vc", no: "pre-seed, gjennom not another vc" },
  propdock: { fact: "year", en: "an early not another vc bet", no: "en tidlig not another vc-investering" },
  vendo: { fact: "stage", en: "pre-seed. days of back-and-forth, gone", no: "pre-seed. dager med frem og tilbake, borte" },
  fotovibe: { fact: "stage", en: "pre-seed. content at listing speed", no: "pre-seed. innhold i annonsens tempo" },
  somevibe: { fact: "stage", en: "pre-seed. reach as a system, not luck", no: "pre-seed. rekkevidde som system, ikke flaks" },
  docdir: { fact: "stage", en: "by visma, 2026. bodø's second, after poweroffice", no: "kjøpt av visma, 2026. bodøs andre, etter poweroffice" },
  utleieoversikten: { fact: "stage", en: "an exit. the early investment came back", no: "en exit. den tidlige investeringen kom tilbake" },
}

export const LEDGER_HEAD: Record<Lang, [string, string, string, string]> = {
  en: ["Year", "Company", "Role", "Outcome"],
  no: ["År", "Selskap", "Rolle", "Utfall"],
}

/* -------------------------------------------------------------------- css */

export const K_CSS = `
${ringCss}
.k-scroll { scrollbar-width: none; overscroll-behavior: contain; }
.k-scroll::-webkit-scrollbar { display: none; }
.k-scroll:focus { outline: none; }

.k-nav { position: relative; color: ${G.idle}; text-decoration: none; }
.k-nav[data-on] { color: ${G.ink}; }
.k-lang { color: ${G.faint}; font-weight: 560; }
.k-lang[data-on] { color: ${G.ink}; cursor: default; }

/* Links with no colour: ink and a fine grey underline that darkens. */
.k-link { text-decoration-line: underline; text-decoration-thickness: 1px; text-underline-offset: 0.24em;
  text-decoration-color: rgba(18,18,18,0.22); transition-property: text-decoration-color; transition-duration: 180ms; transition-timing-function: ease-out; }
.k-link[data-on] { text-decoration-color: var(--pen); }

.k-row { transition-property: background-color; transition-duration: 140ms; transition-timing-function: ease-out; }
.k-row[data-on] { background-color: rgba(18,18,18,0.022); }

/* The pen in the margin: a short tick out from the ring, then the words. */
.k-tick { stroke-dasharray: 1; animation: k-draw 320ms cubic-bezier(.55,.05,.3,1) 380ms both; }
.k-note { animation: k-in 300ms cubic-bezier(.2,.7,.2,1) 520ms both; }
@keyframes k-draw { from { stroke-dashoffset: 1; } to { stroke-dashoffset: 0; } }
@keyframes k-in { from { opacity: 0; translate: -0.8cqw 0; } to { opacity: 1; translate: 0 0; } }

/* Read next: only the arrow moves, and only the arrow takes the pen (19). */
.k-next { text-decoration: none; -webkit-tap-highlight-color: transparent; }
.k-next-t { text-decoration-line: underline; text-decoration-thickness: 1px; text-underline-offset: 0.2em; text-decoration-color: transparent;
  transition-property: text-decoration-color; transition-duration: 180ms; }
.k-next-ar { display: inline-block; color: ${G.grey}; transition-property: transform, color; transition-duration: 220ms, 180ms; transition-timing-function: cubic-bezier(.3,.8,.3,1), ease; }
.k-next:focus-visible .k-next-ar { color: var(--pen); transform: translateX(0.22em); }

/* The footer's copy (17 / 38), in the page's one colour. */
.k-mail { text-decoration-line: underline; text-decoration-thickness: 1px; text-underline-offset: 0.22em; text-decoration-color: ${G.faint};
  transition-property: text-decoration-color; transition-duration: 180ms; }
.k-copy { display: inline-flex; align-items: center; gap: 0.4em; height: 2.2em; padding: 0 0.7em 0 0.6em; border-radius: 0.6em;
  color: ${G.grey}; box-shadow: inset 0 0 0 1px ${G.hair};
  transition-property: transform, color, background-color, box-shadow; transition-duration: 140ms, 160ms, 160ms, 160ms; transition-timing-function: cubic-bezier(.2,.8,.3,1); }
.k-copy[data-done] { color: var(--pen); box-shadow: inset 0 0 0 1px color-mix(in oklab, var(--pen) 28%, transparent); background-color: color-mix(in oklab, var(--pen) 6%, transparent); }
.k-i { position: absolute; inset: 0; width: 100%; height: 100%; stroke: currentColor; stroke-width: 1.5; stroke-linecap: round; stroke-linejoin: round;
  transition-property: opacity, transform; transition-duration: 160ms, 220ms; transition-timing-function: ease, cubic-bezier(.2,.8,.3,1); }
.k-check { opacity: 0; transform: scale(0.6); }
.k-check path { stroke-width: 1.8; stroke-dasharray: 1; stroke-dashoffset: 1; transition-property: stroke-dashoffset; transition-duration: 260ms; transition-delay: 60ms; transition-timing-function: cubic-bezier(.3,.8,.3,1); }
.k-copy[data-done] .k-glyph { opacity: 0; transform: scale(0.6); }
.k-copy[data-done] .k-check { opacity: 1; transform: none; }
.k-copy[data-done] .k-check path { stroke-dashoffset: 0; }
.k-w { grid-area: 1 / 1; opacity: 0; transition-property: opacity; transition-duration: 140ms; }
.k-w[data-on] { opacity: 1; }
.k-pen-copied { white-space: nowrap; rotate: -4deg; line-height: 1; pointer-events: none; clip-path: inset(-30% 100% -30% -4%); opacity: 0;
  transition-property: clip-path, opacity; transition-duration: 0ms, 260ms; }
.k-pen-copied[data-on] { clip-path: inset(-30% -4% -30% -4%); opacity: 1; transition-duration: 520ms, 0ms; transition-delay: 120ms, 0ms; transition-timing-function: cubic-bezier(.4,0,.3,1); }

@media (hover: hover) and (pointer: fine) {
  .k-nav:not([data-on]):hover, .k-lang:not([data-on]):hover { color: ${G.ink}; }
  .k-link:hover { text-decoration-color: ${G.ink}; }
  .k-link[data-on]:hover { text-decoration-color: var(--pen); }
  .k-next:hover .k-next-ar { color: var(--pen); transform: translateX(0.22em); }
  .k-next:hover .k-next-t { text-decoration-color: ${G.faint}; }
  .k-mail:hover { text-decoration-color: ${G.ink}; }
  .k-copy:not([data-done]):hover { color: ${G.ink}; background-color: rgba(18,18,18,0.035); }
}
@media (prefers-reduced-motion: reduce) {
  .k-link, .k-row { transition-duration: 0ms; }
  .k-tick { animation: none; }
  .k-note { animation: k-fade 160ms ease both; }
  @keyframes k-fade { from { opacity: 0; } to { opacity: 1; } }
  .k-next-ar { transition-property: color; }
  .k-next:hover .k-next-ar, .k-next:focus-visible .k-next-ar { transform: none; }
  .k-copy { transition-property: color, background-color, box-shadow; }
  .k-i, .k-check, .k-copy[data-done] .k-glyph { transform: none; }
  .k-check path { transition: none; stroke-dashoffset: 0; }
  .k-pen-copied, .k-pen-copied[data-on] { clip-path: none; transition-property: opacity; transition-duration: 200ms; transition-delay: 0ms; }
}
`

/* ----------------------------------------------------------------- header */

type Nav = "about" | "portfolio" | "writing" | "contact"
const NAV: Nav[] = ["about", "portfolio", "writing", "contact"]

export function navLabel(p: Nav, lang: Lang) {
  const t = uiCopy[lang]
  return { about: t.navAbout, portfolio: t.navPortfolio, writing: t.navWriting, contact: t.navContact }[p]
}

/** EN / NO as two quiet letters; arrow keys move between them (18, kept as in 36). */
export function LangSwitch({
  lang,
  setLang,
  size = "1.7cqw",
}: {
  lang: Lang
  setLang: (l: Lang) => void
  size?: string
}) {
  const refs = React.useRef<(HTMLElement | null)[]>([])
  return (
    <span
      role="radiogroup"
      aria-label="Language"
      onKeyDown={(e) => langKeys(e, lang, setLang, refs)}
      className="flex items-center gap-[0.6cqw]"
      style={{ fontSize: size, letterSpacing: "0.02em" }}
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
              refs.current[i] = el
            }}
            type="button"
            role="radio"
            aria-checked={lang === l.id}
            aria-label={l.name}
            tabIndex={lang === l.id ? 0 : -1}
            onClick={() => setLang(l.id)}
            className="h2-press h2-hit k-lang"
            data-on={lang === l.id || undefined}
            style={{ ["--hw" as string]: "30px" }}
          >
            {l.label}
          </button>
        </React.Fragment>
      ))}
    </span>
  )
}

/**
 * 36's band: the name, the four pages, EN / NO. Portfolio is ringed by the
 * pen; there is no bold item and no underline. On a company page the ring
 * still sits on Portfolio: that is the section you are in.
 */
export function Header({
  lang,
  setLang,
  on,
  pen,
  exact = true,
}: {
  lang: Lang
  setLang: (l: Lang) => void
  on: boolean
  pen: string
  /** True on /portfolio itself; false on a company page under it. */
  exact?: boolean
}) {
  const navRef = React.useRef<HTMLElement>(null)
  const cur = React.useRef<HTMLSpanElement>(null)
  const box = useBox(navRef, () => cur.current, [lang])

  return (
    <header
      className="sticky top-0 z-20 flex items-center justify-between"
      style={{ height: "7.4cqw", padding: "0 5cqw", background: G.band, boxShadow: `0 1px 0 ${G.edge}`, fontSize: "1.95cqw" }}
    >
      <a href={href("/", lang)} onClick={stay} className="h2-press h2-hit" style={{ fontWeight: 560, letterSpacing: "-0.006em", textDecoration: "none" }}>
        Christer Hagen
      </a>
      <nav ref={navRef} aria-label="Main" className="relative flex items-center gap-[3cqw]">
        {NAV.map((p) => (
          <a
            key={p}
            href={href(`/${p}`, lang)}
            onClick={stay}
            aria-current={p === "portfolio" ? (exact ? "page" : "true") : undefined}
            className="h2-press h2-hit k-nav"
            data-on={p === "portfolio" || undefined}
          >
            <span ref={p === "portfolio" ? cur : undefined}>{navLabel(p, lang)}</span>
          </a>
        ))}
        <span style={{ marginLeft: "1.2cqw" }}>
          <LangSwitch lang={lang} setLang={setLang} />
        </span>
        <TravelRing box={box} k="portfolio" on={on} color={pen} />
      </nav>
    </header>
  )
}

/* -------------------------------------------------------------------- page */

/**
 * The whole frame for a desktop page: the ground, one scroller, the sticky
 * band. `--pen` is the page's one colour. Children are the column.
 */
export function Page({
  label,
  lang,
  pen,
  scrollerRef,
  header,
  children,
}: {
  label: string
  lang: Lang
  pen: string
  scrollerRef?: React.RefObject<HTMLDivElement | null>
  header: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div
      ref={scrollerRef}
      className="k-scroll absolute inset-0 overflow-x-hidden overflow-y-auto"
      tabIndex={0}
      aria-label={label}
      style={{ ["--pen" as string]: pen }}
    >
      {header}
      <div key={lang} lang={lang === "en" ? "en" : "nb"} className="h2-reset">
        {children}
      </div>
    </div>
  )
}

export function Column({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return <div style={{ marginLeft: `${COL.left}cqw`, width: `${COL.width}cqw`, ...style }}>{children}</div>
}

/** benji's section heading: a grey label with a hairline running right. */
export function Rule({ children, right, top = "7cqw" }: { children: React.ReactNode; right?: React.ReactNode; top?: string }) {
  return (
    <h2 className="flex items-center" style={{ margin: `${top} 0 1.2cqw`, gap: "1.6cqw", color: G.grey, fontSize: "inherit", fontWeight: 460 }}>
      <span className="shrink-0">{children}</span>
      <span aria-hidden className="h-px flex-1" style={{ background: G.hair }} />
      {right ? (
        <span className="shrink-0 tabular-nums" style={{ color: G.faint }}>
          {right}
        </span>
      ) : null}
    </h2>
  )
}

/* ---------------------------------------------------------------- the pen */

/** A margin note level with its row: a tick out from the ring, then the words (31). */
export function MarginNote({
  text,
  pen,
  width = "21cqw",
  gap = "3.4cqw",
}: {
  text: string
  pen: string
  width?: string
  gap?: string
}) {
  return (
    <span aria-hidden className="pointer-events-none absolute" style={{ left: "100%", top: 0, bottom: 0 }}>
      <svg
        className="absolute"
        viewBox="0 0 10 4"
        preserveAspectRatio="none"
        style={{ left: "1cqw", top: "50%", width: `calc(${gap} - 1.6cqw)`, height: "1.2cqw", marginTop: "-0.6cqw", overflow: "visible" }}
      >
        <path className="k-tick" pathLength={1} d="M 0 2.2 C 3 1.4, 6 2.6, 10 1.8" fill="none" stroke={pen} strokeWidth={1.3} strokeLinecap="round" vectorEffect="non-scaling-stroke" />
      </svg>
      <span
        className="k-note absolute block"
        style={{
          left: gap,
          top: "50%",
          translate: "0 -50%",
          width,
          rotate: "-2deg",
          fontFamily: fontHand,
          fontSize: "3.2cqw",
          lineHeight: 0.95,
          color: pen,
        }}
      >
        {text}
      </span>
    </span>
  )
}

/* ------------------------------------------------------------- read next */

/** 19: a hairline, the grey label, one name and its arrow. Only the arrow moves. */
export function ReadNext({
  slug,
  lang,
  onFollow,
}: {
  slug: CompanySlug
  lang: Lang
  onFollow?: (next: CompanySlug) => void
}) {
  const n = nextSlug(slug)
  const c = companies[lang][n]
  return (
    <div style={{ marginTop: "8cqw", paddingTop: "2.2cqw", borderTop: `1px solid ${G.hair}` }}>
      <p style={{ color: G.faint, fontSize: "1.85cqw" }}>{uiCopy[lang].nextLabel}</p>
      <a
        href={href(`/portfolio/${n}`, lang)}
        onClick={(e) => {
          stay(e)
          if (e.defaultPrevented) onFollow?.(n)
        }}
        className="k-next flex items-center"
        style={{ minHeight: 44, color: G.ink }}
      >
        <span style={{ fontSize: "2.8cqw", fontWeight: 560, letterSpacing: "-0.012em" }}>
          <span className="k-next-t">{c.name}</span>{" "}
          <span aria-hidden className="k-next-ar">
            →
          </span>
        </span>
      </a>
      <p style={{ color: G.faint }}>{c.tagline}</p>
    </div>
  )
}

/* ---------------------------------------------------------------- footer */

const COPY: Record<Lang, { copy: string; copied: string; pen: string; manual: string; label: string }> = {
  en: { copy: "Copy", copied: "Copied", pen: "copied", manual: "Selected. Press ⌘C to copy.", label: "Copy email address" },
  no: { copy: "Kopier", copied: "Kopiert", pen: "kopiert", manual: "Markert. Trykk ⌘C for å kopiere.", label: "Kopier e-postadressen" },
}

/** The copy button: the glyph turns to a check that draws itself, holds 1.5s, lets go (17). */
export function CopyButton({ lang, done, onCopy, fontSize = "1.9cqw" }: { lang: Lang; done: boolean; onCopy: () => void; fontSize?: string }) {
  const t = COPY[lang]
  return (
    <button
      type="button"
      onClick={onCopy}
      aria-label={done ? t.copied : t.label}
      className="h2-press h2-hit k-copy"
      data-done={done || undefined}
      style={{ fontSize, ["--hw" as string]: "44px" }}
    >
      <span aria-hidden className="relative block" style={{ width: "1.05em", height: "1.05em" }}>
        <svg viewBox="0 0 16 16" className="k-i k-glyph" fill="none">
          <rect x="5" y="5" width="8.5" height="8.5" rx="2" />
          <path d="M10.5 2.8 H4.8 A2 2 0 0 0 2.8 4.8 V10.5" />
        </svg>
        <svg viewBox="0 0 16 16" className="k-i k-check" fill="none">
          <path pathLength={1} d="M3.2 8.6 L6.6 11.8 L12.8 4.6" />
        </svg>
      </span>
      <span aria-hidden className="grid">
        <span className="k-w" data-on={!done || undefined}>
          {t.copy}
        </span>
        <span className="k-w" data-on={done || undefined}>
          {t.copied}
        </span>
      </span>
    </button>
  )
}

/** 38: the footer is the address, and copying it. No link list, no copyright. */
export function Footer({ lang, pen }: { lang: Lang; pen: string }) {
  const { state, copy, ref } = useCopy(EMAIL)
  const done = state === "copied"
  return (
    <footer style={{ marginTop: "12cqw", borderTop: `1px solid ${G.hair}`, padding: "7.4cqw 0 8cqw" }}>
      <div className="flex items-center" style={{ marginLeft: `${COL.left}cqw`, gap: "2cqw" }}>
        <a
          ref={ref}
          href={`mailto:${EMAIL}`}
          className="k-mail h2-hit"
          style={{ fontSize: "2.6cqw", fontWeight: 520, letterSpacing: "-0.012em", whiteSpace: "nowrap" }}
        >
          {EMAIL}
        </a>
        <span className="relative flex items-center">
          <CopyButton lang={lang} done={done} onCopy={copy} />
          <span
            aria-hidden
            className="k-pen-copied absolute"
            data-on={done || undefined}
            style={{ left: "calc(100% + 1.2cqw)", top: "-0.4cqw", fontFamily: fontHand, fontSize: "3.2cqw", color: pen }}
          >
            {COPY[lang].pen}
          </span>
        </span>
      </div>
      <p aria-live="polite" style={{ marginLeft: `${COL.left}cqw`, marginTop: "1.6cqw", minHeight: "1.4em", fontSize: "1.75cqw", color: G.ink }}>
        {state === "manual" ? COPY[lang].manual : ""}
      </p>
    </footer>
  )
}

/** For the phone: the copy state without the footer around it. */
export { useCopy, COPY }
