import * as React from "react"

import { posts, postOrder } from "@/lib/posts"
import { companies, type CompanySlug } from "@/lib/companies"

import { C, RING } from "../../kit"

/**
 * Group b ("the index"): the white sheet every piece sets its list on, the pen
 * ring, the fine-underline link, and the facts read off lib/posts and
 * lib/companies so no piece retypes (or invents) a date.
 */

/** A white page sitting low in the tile, running off the bottom edge. */
export function Sheet({
  top = "21cqw",
  left = "5.4cqw",
  width = "89.2cqw",
  children,
  className = "",
  style,
}: {
  top?: string
  left?: string
  width?: string
  children?: React.ReactNode
  className?: string
  style?: React.CSSProperties
}) {
  return (
    <div
      className={`absolute rounded-[2.4cqw] ${className}`}
      style={{
        top,
        left,
        width,
        bottom: "-6cqw",
        background: C.white,
        boxShadow: RING,
        ...style,
      }}
    >
      {children}
    </div>
  )
}

/** A section label with a hairline running right, as on benji.org. */
export function Rule({ label, className = "" }: { label: string; className?: string }) {
  return (
    <div className={`flex items-center gap-[1.6cqw] ${className}`}>
      <span style={{ color: C.grey }}>{label}</span>
      <span aria-hidden className="h-px flex-1" style={{ background: C.hair }} />
    </div>
  )
}

/** Links with no colour: ink text and a fine grey underline that darkens on hover. */
export const underline: React.CSSProperties = {
  textDecorationLine: "underline",
  textDecorationThickness: "1px",
  textUnderlineOffset: "0.45cqw",
}

/**
 * A pen loop drawn around a word, overshooting where it closes the way a hand
 * does. pathLength=1 so the stroke can be drawn in with stroke-dashoffset.
 */
export function PenRing({
  color,
  on,
  className = "",
  style,
  delay = 380,
}: {
  color: string
  on: boolean
  className?: string
  style?: React.CSSProperties
  delay?: number
}) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 100 44"
      preserveAspectRatio="none"
      className={`b-ring pointer-events-none absolute ${className}`}
      data-on={on || undefined}
      style={{ overflow: "visible", ...style, ["--d" as string]: `${delay}ms` }}
    >
      <path
        pathLength={1}
        d="M80 7 C 58 -1, 16 1, 5 16 C -3 28, 20 41, 52 40 C 84 39, 100 29, 95 15 C 91 5, 66 1, 40 5"
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}

export const ringCss = `
.b-ring path { stroke-dasharray: 1; stroke-dashoffset: 1; transition-property: stroke-dashoffset; transition-duration: 0ms; }
.b-ring[data-on] path { stroke-dashoffset: 0; transition-duration: 760ms; transition-delay: var(--d); transition-timing-function: cubic-bezier(.55,.05,.3,1); }
@media (prefers-reduced-motion: reduce) {
  .b-ring path, .b-ring[data-on] path { transition-duration: 0ms; transition-delay: 0ms; }
}
`

/* ------------------------------------------------------------------ facts */

const two = (s: string) => s.padStart(2, "0")

export type IndexPost = { slug: string; title: string; year: string; ddmm: string; iso: string }

/** Newest first, from lib/posts. */
export const POSTS: IndexPost[] = [...postOrder]
  .map((slug) => {
    const p = posts.en[slug]
    const [y, m, d] = p.dateISO.split("-")
    return { slug, title: p.title, year: y, ddmm: `${two(d)}/${two(m)}`, iso: p.dateISO }
  })
  .sort((a, b) => b.iso.localeCompare(a.iso))

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

/** "Updated" is the newest post's date: the last time the index changed. */
export const UPDATED = (() => {
  const [y, m, d] = POSTS[0].iso.split("-")
  return `${Number(d)} ${MONTHS[Number(m) - 1]} ${y}`
})()

export function company(slug: CompanySlug) {
  return companies.en[slug]
}
