"use client"

import * as React from "react"
import Image from "next/image"

import { EMAIL, homeContent } from "@/lib/content"
import { postOrder, posts, type PostSlug } from "@/lib/posts"

import { G, PenLoop, RING_CSS, Rail, Rule, SitePage, TYPE, ddmm, useSeenIn, useSpy } from "./frame"

/**
 * 26 — The home page on benji's ground. Hero, about, the work as a now/before
 * ledger, the writing list, the way in. One blue pen on the whole page: it
 * circles "New" once the list is in view and moves to whatever title you
 * point at. On first sight the page glides down to the list by itself.
 */

const PEN = "#2B5CD8"
const c = homeContent.en
const RAIL = ["About", "Now", "Writing", "Contact"]

const NOW = c.work.filter((w) => w.period.startsWith("Since"))
const BEFORE = c.work
  .filter((w) => !w.period.startsWith("Since"))
  .map((w) => ({ ...w, period: w.period.replace(/^Sunset · /, "") }))

const css = `
${RING_CSS}
.f26-row { transition-property: background-color; transition-duration: 140ms; }
@media (hover: hover) and (pointer: fine) { .f26-row:hover { background-color: rgba(18,18,18,0.025); } }
@media (prefers-reduced-motion: reduce) { .f26-row { transition-duration: 0ms; } }
`

function Ledger({ rows }: { rows: { name: string; role: string; period: string }[] }) {
  return (
    <ul>
      {rows.map((r, i) => (
        <li
          key={r.name}
          className="flex items-baseline justify-between"
          style={{ gap: "2cqw", padding: "0.8cqw 0", borderTop: i ? `1px solid ${G.hair}` : undefined }}
        >
          <span className="min-w-0">
            <span style={{ fontWeight: 520 }}>{r.name}</span>{" "}
            <span style={{ color: G.faint }}>{r.role.split(" · ")[0]}</span>
          </span>
          <span className="shrink-0 tabular-nums" style={{ color: G.grey }}>
            {r.period.replace(/^Since /, "since ")}
          </span>
        </li>
      ))}
    </ul>
  )
}

export default function Home() {
  const scrollerRef = React.useRef<HTMLDivElement>(null)
  const listRef = React.useRef<HTMLUListElement>(null)
  const demo = React.useCallback(() => listRef.current, [])
  const { active, go } = useSpy(scrollerRef, RAIL.length, demo)
  const seen = useSeenIn(scrollerRef, listRef, 0.9)
  const [hover, setHover] = React.useState<PostSlug | null>(null)
  const target = seen ? (hover ?? "new") : null

  return (
    <SitePage
      label="christerhagen.com, the home page"
      scrollerRef={scrollerRef}
      rail={<Rail head={<span style={{ color: G.ink, fontWeight: 560 }}>Christer Hagen</span>} items={RAIL} active={active} onPick={go} />}
    >
      <style>{css}</style>

      <section data-section>
        <div className="flex items-start" style={{ gap: "3.4cqw" }}>
          <div className="min-w-0 flex-1">
            <h1 style={{ ...TYPE.title, margin: 0, textWrap: "balance" }}>{c.heroHead}</h1>
            <p style={{ margin: "1.6cqw 0 0", color: G.grey, textWrap: "pretty" }}>{c.heroSub}</p>
            <p className="tabular-nums" style={{ ...TYPE.meta, margin: "1.8cqw 0 0", color: G.faint }}>
              Bodø, Norway
            </p>
          </div>
          <div
            className="relative shrink-0 overflow-hidden"
            style={{ width: "11.8cqw", aspectRatio: "236 / 300", borderRadius: "0.6cqw", boxShadow: `0 0 0 1px ${G.hair}` }}
          >
            <Image
              src="/images/christer-hagen-portrait.jpg"
              alt="Christer Hagen"
              fill
              sizes="120px"
              className="object-cover"
              style={{ objectPosition: "center 22%" }}
            />
          </div>
        </div>

        <Rule>{c.lblAbout}</Rule>
        <p style={{ margin: 0, textWrap: "pretty" }}>{c.aboutBody}</p>
      </section>

      <section data-section>
        <Rule>{c.lblNow}</Rule>
        <Ledger rows={NOW} />
        <Rule top="3.4cqw">Before</Rule>
        <Ledger rows={BEFORE} />
      </section>

      <section data-section>
        <Rule>{c.lblWriting}</Rule>
        <ul ref={listRef}>
          {postOrder.map((slug, i) => {
            const p = posts.en[slug]
            const year = p.dateISO.slice(0, 4)
            const prev = i > 0 ? posts.en[postOrder[i - 1]].dateISO.slice(0, 4) : null
            return (
              <li key={slug} style={{ borderTop: i ? `1px solid ${G.hair}` : undefined }}>
                <a
                  href={`/writing/${slug}`}
                  onClick={(e) => e.preventDefault()}
                  onPointerEnter={() => setHover(slug)}
                  onPointerLeave={() => setHover((h) => (h === slug ? null : h))}
                  onFocus={() => setHover(slug)}
                  onBlur={() => setHover((h) => (h === slug ? null : h))}
                  className="f26-row grid items-center outline-none"
                  style={{ gridTemplateColumns: "6.4cqw 1fr auto", minHeight: "5cqw", color: G.ink, textDecoration: "none" }}
                >
                  <span className="tabular-nums" style={{ color: year === prev ? "transparent" : G.faint }}>
                    {year}
                  </span>
                  <span className="flex min-w-0 items-center" style={{ gap: "1.6cqw" }}>
                    <span className="relative block min-w-0">
                      <span className="block truncate">{p.title}</span>
                      <PenLoop on={target === slug} color={PEN} inset="-0.9cqw -1.2cqw -0.8cqw -1.3cqw" />
                    </span>
                    {i === 0 ? (
                      <span className="relative shrink-0" style={{ color: G.grey, fontSize: "0.88em" }}>
                        New
                        <PenLoop on={target === "new"} color={PEN} inset="-1cqw -1.3cqw -0.9cqw -1.3cqw" delay={420} />
                      </span>
                    ) : null}
                  </span>
                  <span className="tabular-nums" style={{ color: G.faint, paddingLeft: "2cqw" }}>
                    {ddmm(p.dateISO)}
                  </span>
                </a>
              </li>
            )
          })}
        </ul>
      </section>

      <section data-section>
        <Rule>{c.lblContact}</Rule>
        <p style={{ margin: 0, fontWeight: 560 }}>{c.ctaHead}</p>
        <p style={{ margin: "0.6cqw 0 0", color: G.grey }}>{c.ctaBody}</p>
        <p style={{ margin: "1.8cqw 0 0" }}>
          <a className="f-link" href={`mailto:${EMAIL}`}>
            {EMAIL}
          </a>
        </p>
      </section>
    </SitePage>
  )
}
