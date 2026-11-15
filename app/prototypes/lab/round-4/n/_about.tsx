"use client"

import * as React from "react"

import { aboutContent } from "@/lib/content"

import { useSeen } from "../../kit"
import { Frame } from "../../round-2/h/chrome"
import { G, Go, Header, Linked, META, Rail, Rule, TITLE, Footer, siteCss, tagOf, useSections, type Lang, type PKey } from "../../round-3/j/site"

/**
 * Group n (round 4): the about page, four times, each one decision about the
 * photo. The frame is the kept one, read off 41, 44, 49, 51 and 53: 36's
 * header in the white band with About ringed, EN / NO as two quiet letters,
 * 02's 40% rail over the page's three sections with the active one in ink,
 * the near-white ground, Inter at 14px, and 38's footer as the address with
 * copy. The bio's company names are 07's colourless links, as in 48.
 *
 * Only the photo changes between the four pieces, so everything else lives
 * here and the pieces are short.
 */

export { G, META, Rule, TITLE, type Lang }

/** Each company once, at the first place the bio names it (from 48). */
const NAMES: [string, PKey][] = [
  ["Codebase", "codebase"],
  ["Docdir", "docdir"],
  ["Sailsdock", "sailsdock"],
  ["Bedrifty", "bedrifty"],
  ["Advanti Estate", "advanti-estate"],
  ["Not Another VC", "nav"],
]
const LINKS: [string, PKey][][] = [[], [["Refenze", "refenze"]], NAMES, [["GitHub", "github"]]]

export const PORTRAIT = "/images/christer-hagen-portrait.jpg"
export const WORKING = "/images/christer-hagen-working.jpg"

/**
 * The whole about page: band, rail, column, footer. `footer` replaces 38's
 * footer when a piece ends the page another way.
 */
export function AboutSite({
  label,
  pen,
  lang,
  setLang,
  scrollerRef,
  footer,
  css,
  children,
}: {
  label: string
  pen: string
  lang: Lang
  setLang: (l: Lang) => void
  scrollerRef: React.RefObject<HTMLDivElement | null>
  footer?: React.ReactNode
  css?: string
  children: React.ReactNode
}) {
  const [seenRef, seen] = useSeen<HTMLDivElement>()
  const { active, go } = useSections(scrollerRef)
  const a = aboutContent[lang]
  return (
    <Frame label={label} style={{ ["--j-pen" as string]: pen }}>
      <style>{siteCss() + (css ?? "")}</style>
      <div ref={seenRef} className="absolute inset-0">
        <div
          ref={scrollerRef}
          tabIndex={0}
          aria-label={label}
          className="j-scroll absolute inset-0 overflow-x-hidden overflow-y-auto"
          style={{ outline: "none" }}
        >
          <Header current="about" lang={lang} setLang={setLang} pen={pen} seen={seen} />
          <main key={lang} lang={tagOf(lang)} className="h2-reset" style={{ marginLeft: "28cqw", width: "44cqw", paddingTop: "7.4cqw" }}>
            {children}
          </main>
          {footer ?? <Footer lang={lang} />}
        </div>
        <Rail
          head={
            <Go href="/" className="j-nav h2-hit">
              ↩ Index
            </Go>
          }
          items={[a.kicker, a.lblBackground, a.lblPress]}
          active={active}
          onPick={go}
        />
      </div>
    </Frame>
  )
}

/** The kicker and the headline, the page's first words. */
export function Head({ lang }: { lang: Lang }) {
  const a = aboutContent[lang]
  return (
    <>
      <p style={{ margin: 0, color: G.grey }}>{a.kicker}</p>
      <h1 style={{ ...TITLE, margin: "1cqw 0 0" }}>{a.head}</h1>
    </>
  )
}

/**
 * The four bio paragraphs with the names as previews. `after(i)` puts
 * something under paragraph i (a figure, a stage).
 */
export function Bio({
  lang,
  top = "4cqw",
  from = 0,
  after,
  flow = false,
}: {
  lang: Lang
  top?: string
  /** The first paragraph to set, when a piece has set the earlier ones itself. */
  from?: number
  after?: (i: number) => React.ReactNode
  /** Plain block flow, so the paragraphs can wrap round a float. */
  flow?: boolean
}) {
  const a = aboutContent[lang]
  return (
    <div className={flow ? "" : "flex flex-col"} style={{ marginTop: top, gap: "1.6cqw" }}>
      {a.bio.map((para, i) =>
        i < from ? null : (
          <React.Fragment key={para.slice(0, 20)}>
            {flow ? (
              <div style={{ marginTop: i > from ? "1.6cqw" : 0 }}>
                <Linked text={para} links={LINKS[i]} lang={lang} />
              </div>
            ) : (
              <Linked text={para} links={LINKS[i]} lang={lang} />
            )}
            {after?.(i)}
          </React.Fragment>
        ),
      )}
    </div>
  )
}

/** The timeline as a ledger: year in grey, the event in ink. */
export function Timeline({ lang }: { lang: Lang }) {
  const a = aboutContent[lang]
  return (
    <ul className="min-w-0 flex-1">
      {a.timeline.map((t, i) => (
        <li key={t.year} className="flex items-baseline" style={{ gap: "2cqw", padding: "0.8cqw 0", borderTop: i ? `1px solid ${G.hair}` : undefined }}>
          <span className="shrink-0 tabular-nums" style={{ width: "5cqw", color: G.grey }}>
            {t.year}
          </span>
          <span style={{ textWrap: "pretty" }}>{t.event}</span>
        </li>
      ))}
    </ul>
  )
}

/** "Featured in": the headline, the outlet in faint grey. */
export function Press({ lang }: { lang: Lang }) {
  const a = aboutContent[lang]
  return (
    <section data-section>
      <Rule>{a.lblPress}</Rule>
      <ul>
        {a.press.map((p, i) => (
          <li
            key={p.url}
            className="flex items-baseline justify-between"
            style={{ gap: "2.4cqw", padding: "0.8cqw 0", minHeight: 44, borderTop: i ? `1px solid ${G.hair}` : undefined }}
          >
            <a className="j-link min-w-0" href={p.url} target="_blank" rel="noopener noreferrer" lang="nb" style={{ textWrap: "pretty" }}>
              {p.title}
            </a>
            <span className="shrink-0" style={{ ...META, color: G.faint }}>
              {p.outlet}
            </span>
          </li>
        ))}
      </ul>
    </section>
  )
}

/** "Background" with the timeline, and whatever a piece sets beside it. */
export function Background({ lang, aside }: { lang: Lang; aside?: React.ReactNode }) {
  const a = aboutContent[lang]
  return (
    <section data-section>
      <Rule>{a.lblBackground}</Rule>
      <div className="flex items-start" style={{ gap: "2.6cqw" }}>
        <Timeline lang={lang} />
        {aside}
      </div>
    </section>
  )
}
