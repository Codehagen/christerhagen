"use client"

import * as React from "react"
import Image from "next/image"

import { AboutSite, Background, Bio, G, Head, Press, WORKING, type Lang } from "./_about"

/**
 * 65 — The photo moves down.
 *
 * Nothing above the words: the page opens on the kicker, the headline and
 * the bio, the way benji's does. The working photo comes in further down,
 * beside "Background", as a plain figure in the column with a grey caption,
 * the size of the timeline it stands next to. The blue pen only rings About
 * in the band and writes "copied" in the footer.
 */

const PEN = "oklch(0.5 0.15 252)"

const CAPTION: Record<Lang, { caption: string; alt: string }> = {
  en: { caption: "Christer Hagen, at work.", alt: "Christer Hagen at work, standing at a laptop" },
  no: { caption: "Christer Hagen, på jobb.", alt: "Christer Hagen på jobb, stående ved en laptop" },
}

function Figure({ lang }: { lang: Lang }) {
  const t = CAPTION[lang]
  return (
    <figure className="shrink-0" style={{ width: "12cqw", margin: "0.9cqw 0 0" }}>
      <div className="relative overflow-hidden" style={{ aspectRatio: "3 / 4", borderRadius: "0.4cqw", boxShadow: `0 0 0 1px ${G.hair}`, background: "#ECECEA" }}>
        <Image src={WORKING} alt={t.alt} fill sizes="(max-width: 900px) 30vw, 160px" className="object-cover" style={{ objectPosition: "center 24%" }} />
      </div>
      <figcaption style={{ marginTop: "1cqw", fontSize: "1.7cqw", lineHeight: 1.35, color: G.grey }}>{t.caption}</figcaption>
    </figure>
  )
}

export default function ThePhotoMovesDown() {
  const scrollerRef = React.useRef<HTMLDivElement>(null)
  const [lang, setLang] = React.useState<Lang>("en")

  return (
    <AboutSite label="christerhagen.com/about, the photo beside Background" pen={PEN} lang={lang} setLang={setLang} scrollerRef={scrollerRef}>
      <section data-section>
        <Head lang={lang} />
        <Bio lang={lang} />
      </section>
      <Background lang={lang} aside={<Figure lang={lang} />} />
      <Press lang={lang} />
    </AboutSite>
  )
}
