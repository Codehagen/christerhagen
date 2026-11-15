"use client"

import * as React from "react"

import type { Lang } from "@/lib/companies"
import { contactContent } from "@/lib/content"

import { useSeen } from "../../kit"
import { Frame } from "../../round-2/h/chrome"
import { CopyAddress, G, Header, PageFor, Rule, SYSTEM_CSS, Socials, tagOf, useRoute } from "./system"

/**
 * 58 — Contact is the footer, grown.
 *
 * Every page ends in the same footer: the address, copy beside it (17/38),
 * and "usually replies within a day" under it. Contact is not a page of its
 * own. Pick it in the header and the page above the footer goes, and the
 * footer grows to fill the frame: the heading opens above the address, the
 * address gets bigger where it already was, and the socials and what he
 * looks for open under it. The header rings Contact (36). One green pen: the
 * ring, and "copied" written beside the button for a second and a half.
 */

const GREEN = "#15803D"

export default function ContactIsTheFooter() {
  const [seenRef, seen] = useSeen<HTMLDivElement>()
  const scroller = React.useRef<HTMLDivElement>(null)
  const [route, go] = useRoute("writing", scroller)
  const [lang, setLang] = React.useState<Lang>("en")
  const grown = route === "contact"
  const c = contactContent[lang]

  return (
    <Frame label="christerhagen.com, where the contact page is the footer grown into a page">
      <style>{SYSTEM_CSS + css}</style>
      <div ref={seenRef} className="absolute inset-0">
        <div
          ref={scroller}
          className="l3-scroll absolute inset-0 flex flex-col overflow-x-hidden overflow-y-auto"
          tabIndex={0}
          aria-label="The page, scrollable"
          style={{ outline: "none" }}
        >
          <Header route={route} lang={lang} setLang={setLang} go={go} color={GREEN} on={seen} />
          <div lang={tagOf(lang)} className="flex flex-1 flex-col" style={{ marginLeft: "25cqw", width: "50cqw" }}>
            {grown ? null : (
              <main key={`${route}-${lang}`} className="h2-reset" style={{ padding: "7.2cqw 0 9cqw" }}>
                <PageFor route={route} lang={lang} go={go} color={GREEN} />
              </main>
            )}

            <div role={grown ? "main" : "contentinfo"} className="l58-foot" data-grown={grown || undefined}>
              <div className="l58-fold" aria-hidden={!grown || undefined} inert={!grown || undefined}>
                <div>
                  <p className="l3-meta" style={{ color: G.grey, marginBottom: "0.7em" }}>
                    {c.kicker}
                  </p>
                  <h1 data-title={grown || undefined} tabIndex={-1} className="l3-title">
                    {c.head}
                  </h1>
                  <p style={{ margin: "0.8em 0 2em", color: G.grey, textWrap: "pretty" }}>{c.body}</p>
                </div>
              </div>

              <CopyAddress lang={lang} color={GREEN} size={grown ? "1.6em" : "1.15em"} pen />

              <div className="l58-fold" aria-hidden={!grown || undefined} inert={!grown || undefined}>
                <div>
                  <div style={{ marginTop: "1.8em" }}>
                    <Socials lang={lang} />
                  </div>
                  <Rule>{c.lookHead}</Rule>
                  <p style={{ textWrap: "pretty" }}>{c.lookBody}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Frame>
  )
}

const css = `
.l58-foot { border-top: 1px solid ${G.hair}; padding: 3.4cqw 0 4.4cqw;
  transition-property: padding-top, border-top-color; transition-duration: 420ms, 200ms; transition-timing-function: cubic-bezier(.3,.8,.3,1); }
.l58-foot[data-grown] { border-top-color: transparent; padding-top: 7.2cqw; padding-bottom: 9cqw; }
.l58-foot .l3-mail { transition-property: font-size, text-decoration-color; transition-duration: 420ms, 180ms; transition-timing-function: cubic-bezier(.3,.8,.3,1), ease; }
.l58-fold { display: grid; grid-template-rows: 0fr; opacity: 0;
  transition-property: grid-template-rows, opacity; transition-duration: 420ms, 200ms; transition-timing-function: cubic-bezier(.3,.8,.3,1), ease; }
.l58-fold > div { overflow: hidden; min-height: 0; padding: 0 6px; margin: 0 -6px; }
.l58-foot[data-grown] .l58-fold { grid-template-rows: 1fr; opacity: 1; transition-delay: 0ms, 160ms; }
@media (prefers-reduced-motion: reduce) {
  .l58-foot, .l58-foot .l3-mail { transition-duration: 0ms; }
  .l58-fold { transition-property: opacity; transition-duration: 200ms; }
}
`
