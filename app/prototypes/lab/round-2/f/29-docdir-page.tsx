"use client"

import * as React from "react"
import Link from "next/link"

import { companies, nextSlug, uiCopy } from "@/lib/companies"
import { posts } from "@/lib/posts"

import { fontHand } from "../../kit"
import { useReplay } from "../../round-1/a/parts"
import { G, Rail, Rule, SitePage, TYPE, useSeenIn, useSpy } from "./frame"

/**
 * 29 — A single company page, Docdir, with the red pen of piece 03. The facts
 * are a four-line ledger with the values right-aligned; the pen rings
 * "Acquired", and a curved arrow measured from the real text carries it out
 * to one line in the margin. Tap the facts to draw it again. Below: the
 * story, the post about the sale, and the next company.
 */

const RED = "oklch(0.56 0.2 27)"
const c = companies.en.docdir
const t = uiCopy.en
const post = posts.en["docdir-visma"]
const next = companies.en[nextSlug("docdir")]
const RAIL = [c.name, "Story", "Writing", t.nextLabel]

const FACTS: [string, string][] = [
  [t.mRole, c.role],
  [t.mStage, c.stage],
  [t.mYear, c.year],
  [t.mSector, c.sector],
]

const css = `
.f29-stroke { stroke-dasharray: 1 1; stroke-dashoffset: 1; transition-property: stroke-dashoffset;
  transition-timing-function: cubic-bezier(.45,0,.25,1); transition-duration: 0ms; }
.f29-stroke[data-on] { stroke-dashoffset: 0; }
.f29-ring[data-on] { transition-duration: 640ms; }
.f29-arrow[data-on] { transition-duration: 420ms; transition-delay: 560ms; }
.f29-head[data-on] { transition-duration: 160ms; transition-delay: 960ms; }
.f29-note { opacity: 0; transition-property: opacity; transition-duration: 0ms; }
.f29-note[data-on] { opacity: 1; transition-duration: 320ms; transition-delay: 1040ms; }
.f29-facts { all: unset; display: block; width: 100%; cursor: pointer; touch-action: manipulation; }
.f29-facts:focus-visible { outline: 1.5px solid ${G.ink}; outline-offset: 0.6cqw; border-radius: 0.3cqw; }
@media (prefers-reduced-motion: reduce) {
  .f29-stroke, .f29-stroke[data-on], .f29-note, .f29-note[data-on] { transition-duration: 0ms; transition-delay: 0ms; }
}
`

type Geo = { ring: string; arrow: string; head: string; sw: number }

/** Piece 03's geometry: a loop that overshoots its start, and an arrow to the note. */
function draw(box: DOMRect, p: DOMRect, n: DOMRect, W: number): Geo {
  const x = p.left - box.left
  const y = p.top - box.top
  const cx = x + p.width / 2
  const cy = y + p.height / 2
  const rx = p.width / 2 + W * 0.016
  const ry = p.height / 2 + W * 0.009

  const ring = [
    `M ${cx - rx * 0.88} ${cy - ry * 0.78}`,
    `C ${cx - rx * 0.3} ${cy - ry * 1.18}, ${cx + rx * 1.04} ${cy - ry * 1.12}, ${cx + rx} ${cy + ry * 0.04}`,
    `C ${cx + rx * 0.97} ${cy + ry * 1.14}, ${cx - rx * 0.62} ${cy + ry * 1.22}, ${cx - rx * 1.02} ${cy + ry * 0.18}`,
    `C ${cx - rx * 1.1} ${cy - ry * 0.52}, ${cx - rx * 0.46} ${cy - ry * 1.08}, ${cx + rx * 0.22} ${cy - ry * 1.04}`,
  ].join(" ")

  const sx = cx + rx * 0.72
  const sy = cy - ry * 1.02
  const ex = n.left - box.left - W * 0.012
  const ey = n.top - box.top + n.height * 0.42
  const c1x = sx + (ex - sx) * 0.2
  const c1y = Math.min(sy, ey) - W * 0.05
  const c2x = ex - (ex - sx) * 0.34
  const c2y = ey - W * 0.012
  const arrow = `M ${sx} ${sy} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${ex} ${ey}`

  const a = Math.atan2(ey - c2y, ex - c2x)
  const L = W * 0.02
  const h1 = [ex - L * Math.cos(a - 0.5), ey - L * Math.sin(a - 0.5)]
  const h2 = [ex - L * Math.cos(a + 0.5), ey - L * Math.sin(a + 0.5)]
  const head = `M ${h1[0]} ${h1[1]} L ${ex} ${ey} L ${h2[0]} ${h2[1]}`

  return { ring, arrow, head, sw: Math.max(1.2, W * 0.0028) }
}

export default function DocdirPage() {
  const scrollerRef = React.useRef<HTMLDivElement>(null)
  const boxRef = React.useRef<HTMLDivElement>(null)
  const phraseRef = React.useRef<HTMLSpanElement>(null)
  const noteRef = React.useRef<HTMLSpanElement>(null)
  const { active, go } = useSpy(scrollerRef, RAIL.length)
  const seen = useSeenIn(scrollerRef, boxRef, 0.9)
  const [on, replay] = useReplay(seen)
  const [geo, setGeo] = React.useState<Geo | null>(null)

  React.useLayoutEffect(() => {
    const box = boxRef.current
    const ph = phraseRef.current
    const nt = noteRef.current
    const frame = scrollerRef.current
    if (!box || !ph || !nt || !frame) return
    let alive = true
    const measure = () => {
      if (!alive) return
      setGeo(draw(box.getBoundingClientRect(), ph.getBoundingClientRect(), nt.getBoundingClientRect(), frame.clientWidth))
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(box)
    ro.observe(ph)
    ro.observe(nt)
    document.fonts?.ready.then(measure)
    return () => {
      alive = false
      ro.disconnect()
    }
  }, [])

  const d = on && geo ? true : undefined

  return (
    <SitePage
      label="christerhagen.com, the Docdir page"
      scrollerRef={scrollerRef}
      rail={<Rail head={`↩ ${t.backLabel}`} items={RAIL} active={active} onPick={go} />}
    >
      <style>{css}</style>

      <section data-section>
        <h1 style={{ ...TYPE.title, fontSize: "3.6cqw", margin: 0 }}>{c.name}</h1>
        <p style={{ margin: "0.8cqw 0 0", color: G.grey }}>{c.tagline}</p>

        <div ref={boxRef} className="relative" style={{ marginTop: "4cqw" }}>
          <button type="button" className="f29-facts" onClick={replay} aria-label="Facts about Docdir. Draw the note again.">
            {FACTS.map(([k, v], i) => (
              <span
                key={k}
                className="flex items-baseline justify-between"
                style={{ padding: "0.85cqw 0", borderTop: `1px solid ${i ? G.hair : "rgba(18,18,18,0.12)"}` }}
              >
                <span style={{ color: G.grey }}>{k}</span>
                {k === t.mStage ? (
                  <span ref={phraseRef} style={{ fontWeight: 560 }}>
                    {v}
                  </span>
                ) : (
                  <span className="tabular-nums">{v}</span>
                )}
              </span>
            ))}
          </button>

          <span
            ref={noteRef}
            className="f29-note absolute block"
            data-on={d}
            style={{
              left: "calc(100% + 7cqw)",
              top: "0.6cqw",
              width: "18cqw",
              rotate: "-3deg",
              fontFamily: fontHand,
              fontSize: "3.6cqw",
              lineHeight: 0.95,
              color: RED,
            }}
          >
            by Visma, 2026. the second from Bodø, after PowerOffice
          </span>

          {geo ? (
            <svg aria-hidden className="pointer-events-none absolute inset-0 h-full w-full" style={{ overflow: "visible" }}>
              <g fill="none" stroke={RED} strokeWidth={geo.sw} strokeLinecap="round" strokeLinejoin="round">
                <path className="f29-stroke f29-ring" data-on={d} pathLength={1} d={geo.ring} />
                <path className="f29-stroke f29-arrow" data-on={d} pathLength={1} d={geo.arrow} />
                <path className="f29-stroke f29-head" data-on={d} pathLength={1} d={geo.head} />
              </g>
            </svg>
          ) : null}
        </div>
      </section>

      <section data-section>
        <Rule>Story</Rule>
        {c.body.map((para, i) => (
          <p key={i} style={{ margin: i ? "1.6cqw 0 0" : 0, textWrap: "pretty" }}>
            {para}
          </p>
        ))}
        <p style={{ margin: "2cqw 0 0" }}>
          <a className="f-link" href={c.site} target="_blank" rel="noopener noreferrer">
            {t.visitLabel} ↗
          </a>
        </p>
      </section>

      <section data-section>
        <Rule>Writing</Rule>
        <Link href="/writing/docdir-visma" onClick={(e) => e.preventDefault()} className="flex items-baseline justify-between" style={{ color: G.ink, textDecoration: "none", gap: "2cqw" }}>
          <span className="f-link">{post.title}</span>
          <span className="shrink-0" style={{ color: G.faint }}>
            {post.date}
          </span>
        </Link>
      </section>

      <section data-section>
        <Rule>{t.nextLabel}</Rule>
        <p style={{ margin: 0 }}>
          <span style={{ fontWeight: 560 }}>{next.name}</span> <span style={{ color: G.grey }}>{next.tagline}</span>
        </p>
      </section>
    </SitePage>
  )
}
