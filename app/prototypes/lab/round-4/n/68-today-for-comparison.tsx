"use client"

import * as React from "react"
import Image from "next/image"

import { AboutSite, Background, Bio, G, Head, Press, WORKING, type Lang } from "./_about"

/**
 * 68 — For comparison: today's photo, in the kept frame.
 *
 * The about page as christerhagen.com sets it today, the headline, then the
 * working photo in the site's own 280 × 360 crop at the top of the bio, moved into
 * the kept frame unchanged in every other way, so 65–67 can be read against
 * it. The bio wraps round the photo and runs on under it. The teal pen only
 * rings About and writes "copied".
 */

const TEAL = "#0F766E"

const ALT: Record<Lang, string> = {
  en: "Christer Hagen at work, standing at a laptop",
  no: "Christer Hagen på jobb, stående ved en laptop",
}

export default function TodayForComparison() {
  const scrollerRef = React.useRef<HTMLDivElement>(null)
  const [lang, setLang] = React.useState<Lang>("en")

  return (
    <AboutSite label="christerhagen.com/about as it is today, in the kept frame" pen={TEAL} lang={lang} setLang={setLang} scrollerRef={scrollerRef}>
      <section data-section className="flow-root">
        <Head lang={lang} />
        <div
          className="relative overflow-hidden"
          style={{
            float: "left",
            width: "17cqw",
            aspectRatio: "280 / 360",
            margin: "4cqw 3cqw 1.6cqw 0",
            borderRadius: "0.3cqw",
            background: "#ECECEA",
            boxShadow: `0 0 0 1px ${G.hair}`,
          }}
        >
          <Image src={WORKING} alt={ALT[lang]} fill sizes="(max-width: 900px) 35vw, 200px" className="object-cover" style={{ objectPosition: "center 18%" }} />
        </div>
        <Bio lang={lang} top="4cqw" flow />
      </section>
      <Background lang={lang} />
      <Press lang={lang} />
    </AboutSite>
  )
}
