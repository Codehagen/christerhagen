"use client"

import * as React from "react"
import Image from "next/image"

import { aboutContent } from "@/lib/content"

import { useSeenIn } from "../../round-2/f/frame"
import { G, Linked, META, Rail, Rule, Site, TITLE, Go, useSections, type Lang, type PKey } from "./site"

/**
 * 48 — About, every company a preview.
 *
 * The about page in 36's header with "About" ringed, 02's rail over its
 * three sections. Every company the bio names is one of 07's colourless
 * links: point at it and a card says what it is and how long it lasted.
 * 28's one sentence takes the red wash once it is fully in view and the rest
 * steps back; point at any name and the page comes back to read it.
 */

const PEN = "oklch(0.56 0.2 27)"

/** Each company once, at the first place the bio names it. */
const LINKS: Record<Lang, [string, PKey][][]> = {
  en: [
    [],
    [["Refenze", "refenze"]],
    [
      ["Codebase", "codebase"],
      ["Docdir", "docdir"],
      ["Sailsdock", "sailsdock"],
      ["Bedrifty", "bedrifty"],
      ["Advanti Estate", "advanti-estate"],
      ["Not Another VC", "nav"],
    ],
    [["GitHub", "github"]],
  ],
  no: [
    [],
    [["Refenze", "refenze"]],
    [
      ["Codebase", "codebase"],
      ["Docdir", "docdir"],
      ["Sailsdock", "sailsdock"],
      ["Bedrifty", "bedrifty"],
      ["Advanti Estate", "advanti-estate"],
      ["Not Another VC", "nav"],
    ],
    [["GitHub", "github"]],
  ],
}

const LINE: Record<Lang, string> = {
  en: "I still believe the best companies can be built far from the capital.",
  no: "tror fortsatt de beste selskapene kan bygges langt fra hovedstaden.",
}

const NOTE: Record<Lang, string> = {
  en: "built 1,200 km north of oslo",
  no: "bygget 1 200 km nord for oslo",
}

export default function About() {
  const scrollerRef = React.useRef<HTMLDivElement>(null)
  const lineRef = React.useRef<HTMLSpanElement>(null)
  const [lang, setLang] = React.useState<Lang>("en")
  const [reading, setReading] = React.useState(0)
  const { active, go } = useSections(scrollerRef)
  const seen = useSeenIn(scrollerRef, lineRef, 1)
  const a = aboutContent[lang]
  const onOpen = React.useCallback((o: boolean) => setReading((n) => Math.max(0, n + (o ? 1 : -1))), [])
  const grey = seen && reading === 0

  return (
    <Site
      label="christerhagen.com, the about page"
      pen={PEN}
      current="about"
      lang={lang}
      setLang={setLang}
      scrollerRef={scrollerRef}
      rail={() => (
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
      )}
    >
      <div data-grey={grey || undefined}>
        <section data-section>
          <div className="flex items-start" style={{ gap: "3.4cqw" }}>
            <div className="j-rest min-w-0 flex-1">
              <p style={{ margin: 0, color: G.grey }}>{a.kicker}</p>
              <h1 style={{ ...TITLE, margin: "1cqw 0 0" }}>{a.head}</h1>
            </div>
            <div
              className="j-rest relative shrink-0 overflow-hidden"
              style={{ width: "11cqw", aspectRatio: "280 / 360", borderRadius: "0.6cqw", boxShadow: `0 0 0 1px ${G.hair}`, opacity: grey ? 0.5 : 1 }}
            >
              <Image
                src="/images/christer-hagen-working.jpg"
                alt="Christer Hagen at work"
                fill
                sizes="120px"
                className="object-cover"
                style={{ objectPosition: "center 18%" }}
              />
            </div>
          </div>

          <div className="flex flex-col" style={{ marginTop: "4cqw", gap: "1.6cqw" }}>
            {a.bio.map((para, i) => (
              <Linked
                key={para.slice(0, 20)}
                text={para}
                links={LINKS[lang][i]}
                lang={lang}
                className="j-rest"
                onOpen={onOpen}
                {...(i === 3 ? { hl: LINE[lang], hlOn: seen, hlRef: lineRef } : {})}
              >
                {i === 3 ? (
                  <span
                    aria-hidden
                    className="j-note"
                    data-on={seen || undefined}
                    style={{ left: "calc(100% + 3.4cqw)", bottom: "0.2cqw", width: "20cqw", fontSize: "3.3cqw" }}
                  >
                    {NOTE[lang]}
                  </span>
                ) : null}
              </Linked>
            ))}
          </div>
        </section>

        <section data-section className="j-rest">
          <Rule>{a.lblBackground}</Rule>
          <ul>
            {a.timeline.map((t, i) => (
              <li
                key={t.year}
                className="flex items-baseline"
                style={{ gap: "3cqw", padding: "0.8cqw 0", borderTop: i ? `1px solid ${G.hair}` : undefined }}
              >
                <span className="shrink-0 tabular-nums" style={{ width: "6cqw", color: G.grey }}>
                  {t.year}
                </span>
                <span>{t.event}</span>
              </li>
            ))}
          </ul>
        </section>

        <section data-section className="j-rest">
          <Rule>{a.lblPress}</Rule>
          <ul>
            {a.press.map((p, i) => (
              <li
                key={p.url}
                className="flex items-baseline justify-between"
                style={{ gap: "2.4cqw", padding: "0.8cqw 0", borderTop: i ? `1px solid ${G.hair}` : undefined }}
              >
                <a className="j-link min-w-0" href={p.url} target="_blank" rel="noopener noreferrer" lang="nb">
                  {p.title}
                </a>
                <span className="shrink-0" style={{ ...META, color: G.faint }}>
                  {p.outlet}
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </Site>
  )
}
