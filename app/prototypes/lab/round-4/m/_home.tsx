"use client"

import * as React from "react"
import Image from "next/image"

import { homeContent } from "@/lib/content"
import { writingCopy } from "@/lib/posts"

import { useSeenIn } from "../../round-2/f/frame"
import { LINKS, WorkLedger, split } from "../../round-3/j/46-home"
import { G, Go, Ledger, Linked, META, Rail, Rule, Site, useSections, type Lang } from "../../round-3/j/site"

/**
 * Group m (round 4): the home page, four times, in the frame of the kept
 * pages (41, 49, 51, 55): 36's header in the white band with EN / NO as two
 * quiet letters, 02's 40% rail, the column at 14px on benji's ground, 07's
 * colourless links in the paragraph, 32's ledger with the newest under the
 * pen's wash, and 38's footer that is only the address.
 *
 * The page is benji's home and nothing more: the name, one paragraph, the
 * writing, the work. Everything here is the same in 61–64, so the only thing
 * that differs between them is where the photo goes, and how it looks.
 */

export type { Lang }
export { G }

/** The pen's line beside the newest post (49's, kept). */
const NOTE: Record<Lang, string> = {
  en: "the one about the sale",
  no: "den om salget",
}

const BEFORE: Record<Lang, string> = { en: "Before", no: "Før" }

/* ------------------------------------------------------------------ photos */

export const PORTRAIT = "/images/christer-hagen-portrait.jpg"
/** 600 × 900: height over width. */
const TALL = 1.5

/**
 * A crop of the portrait without a new file: the image is drawn larger than
 * its box and moved so (cx, cy) — the point to centre, as fractions of the
 * photo — sits in the middle. `span` is how much of the photo's width the
 * box shows; `aspect` is the box's width over its height.
 */
export function Crop({
  cx,
  cy,
  span,
  aspect,
  sizes,
  alt,
  className,
  style,
  eager = false,
}: {
  cx: number
  cy: number
  span: number
  aspect: number
  sizes: string
  alt: string
  className?: string
  style?: React.CSSProperties
  eager?: boolean
}) {
  const w = 100 / span
  const h = w * TALL * aspect
  return (
    <span
      aria-hidden={alt === "" || undefined}
      className="absolute block"
      style={{ width: `${w}%`, height: `${h}%`, left: `${50 - cx * w}%`, top: `${50 - cy * h}%` }}
    >
      <Image src={PORTRAIT} alt={alt} fill sizes={sizes} loading={eager ? "eager" : undefined} className={className} style={style} />
    </span>
  )
}

/* -------------------------------------------------------------------- name */

/**
 * The top of the page, benji's way: the name at body size in weight, and
 * the role and town under it in grey. Two lines, nothing larger.
 */
export function Name({ lang, name }: { lang: Lang; name?: React.ReactNode }) {
  return (
    <div className="min-w-0">
      <h1 style={{ margin: 0, fontSize: "inherit", lineHeight: "inherit", fontWeight: 560, letterSpacing: "-0.008em" }}>
        {name ?? "Christer Hagen"}
      </h1>
      <p style={{ margin: 0, color: G.grey }}>{homeContent[lang].aboutRole}</p>
    </div>
  )
}

/* -------------------------------------------------------------------- page */

export function HomePage({
  label,
  pen,
  top,
  css,
}: {
  label: string
  pen: string
  /** The first block of the page: the name, and wherever the photo goes. */
  top: (lang: Lang) => React.ReactNode
  css?: string
}) {
  const scrollerRef = React.useRef<HTMLDivElement>(null)
  const listRef = React.useRef<HTMLUListElement>(null)
  const [lang, setLang] = React.useState<Lang>("en")
  const { active, go } = useSections(scrollerRef)
  const seen = useSeenIn(scrollerRef, listRef, 0.9)
  const c = homeContent[lang]
  const { now, before } = split(c)

  return (
    <Site
      label={label}
      pen={pen}
      current="home"
      lang={lang}
      setLang={setLang}
      scrollerRef={scrollerRef}
      rail={() => <Rail items={[c.lblAbout, c.lblWriting, c.lblWork]} active={active} onPick={go} />}
    >
      {css ? <style>{css}</style> : null}

      <section data-section className="relative" style={{ paddingTop: "1.4cqw" }}>
        {top(lang)}
        <Linked text={c.aboutBody} links={LINKS[lang]} lang={lang} style={{ marginTop: "3.2cqw" }} />
      </section>

      <section data-section>
        <Rule>{c.lblWriting}</Rule>
        <Ledger lang={lang} on={seen} note={NOTE[lang]} listRef={listRef} />
        <p style={{ margin: "1.6cqw 0 0", ...META }}>
          <Go href="/writing" className="j-link h2-hit" style={{ color: G.grey }}>
            {writingCopy[lang].backLabel} →
          </Go>
        </p>
      </section>

      <section data-section>
        <Rule>{c.lblWork}</Rule>
        <WorkLedger rows={now} />
        <Rule top="3.4cqw">{BEFORE[lang]}</Rule>
        <WorkLedger rows={before} />
      </section>
    </Site>
  )
}
