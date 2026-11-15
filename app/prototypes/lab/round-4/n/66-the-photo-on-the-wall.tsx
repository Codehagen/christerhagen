"use client"

import * as React from "react"
import Image from "next/image"

import { RING, C } from "../../kit"
import { useReducedMotion, wall } from "../../round-1/c/ground"
import { useSeenIn } from "../../round-2/f/frame"
import { AboutSite, Background, Bio, G, Head, PORTRAIT, Press, type Lang } from "./_about"

/**
 * 66 — The photo on the wall.
 *
 * 13's grid wall, used the way 44 and 53 use it for a product shot: a stage
 * in the column, and the only place on the site the photo may live. The
 * portrait is a print, a white border around it, and it arrives a little off
 * the grid and settles onto the wall's lines the first time it is scrolled
 * to. One green note from the pen beside it, in the margin, nothing else.
 */

const GREEN = "#178A5A"
const CELL = 4
const STAGE = { w: 44, h: 32 }
const PRINT = { w: 16, h: 24 }
const REST = { x: 16, y: 4 }
const OFF = { x: 17.4, y: 5.3 }

const COPY: Record<Lang, { alt: string; caption: string; note: string }> = {
  en: {
    alt: "Christer Hagen, smiling, in a dark blazer, leaning on a counter",
    caption: "Christer Hagen.",
    note: "← building from the north",
  },
  no: {
    alt: "Christer Hagen, smilende, i mørk blazer, lent mot en benk",
    caption: "Christer Hagen.",
    note: "← bygger fra nord",
  },
}

function Wall({ lang, scrollerRef }: { lang: Lang; scrollerRef: React.RefObject<HTMLDivElement | null> }) {
  const reduced = useReducedMotion()
  const stageRef = React.useRef<HTMLDivElement>(null)
  const seen = useSeenIn(scrollerRef, stageRef, 0.8)
  const [pos, setPos] = React.useState(OFF)
  const t = COPY[lang]

  // One shot (13): it lands a little off the grid, then settles onto it.
  React.useEffect(() => {
    if (!seen) return
    const id = window.setTimeout(() => setPos(REST), reduced ? 0 : 650)
    return () => window.clearTimeout(id)
  }, [seen, reduced])

  return (
    <figure className="relative" style={{ margin: "1.6cqw 0 1.4cqw" }}>
      <div
        ref={stageRef}
        className="relative overflow-hidden"
        style={{ width: `${STAGE.w}cqw`, height: `${STAGE.h}cqw`, background: C.page, ...wall(`${CELL}cqw`), boxShadow: `inset 0 0 0 1px ${G.hair}` }}
      >
        <div
          className="absolute top-0 left-0"
          style={{
            width: `${PRINT.w}cqw`,
            height: `${PRINT.h}cqw`,
            padding: "0.9cqw 0.9cqw 2.6cqw",
            background: C.white,
            borderRadius: "0.3cqw",
            boxShadow: RING,
            transform: `translate(${pos.x}cqw, ${pos.y}cqw)`,
            opacity: seen ? 1 : 0,
            transitionProperty: "transform, opacity",
            transitionDuration: reduced ? "0ms, 200ms" : "300ms, 260ms",
            transitionTimingFunction: "cubic-bezier(0.2, 0.8, 0.2, 1)",
          }}
        >
          <div className="relative h-full w-full overflow-hidden" style={{ background: "#2A2522" }}>
            <Image src={PORTRAIT} alt={t.alt} fill sizes="(max-width: 900px) 30vw, 180px" className="object-cover" style={{ objectPosition: "58% 30%" }} />
          </div>
        </div>
      </div>
      <figcaption style={{ marginTop: "1.2cqw", fontSize: "1.75cqw", color: G.grey }}>{t.caption}</figcaption>
      <span
        aria-hidden
        className="j-note"
        data-on={seen || undefined}
        style={{ left: "calc(100% + 3.4cqw)", top: "12cqw", width: "20cqw", fontSize: "3.3cqw" }}
      >
        {t.note}
      </span>
    </figure>
  )
}

export default function ThePhotoOnTheWall() {
  const scrollerRef = React.useRef<HTMLDivElement>(null)
  const [lang, setLang] = React.useState<Lang>("en")

  return (
    <AboutSite label="christerhagen.com/about, the portrait on the grid wall" pen={GREEN} lang={lang} setLang={setLang} scrollerRef={scrollerRef}>
      <section data-section>
        <Head lang={lang} />
        <Bio lang={lang} after={(i) => (i === 0 ? <Wall lang={lang} scrollerRef={scrollerRef} /> : null)} />
      </section>
      <Background lang={lang} />
      <Press lang={lang} />
    </AboutSite>
  )
}
