"use client"

import * as React from "react"

import { C, RING, Lead, Tile } from "../../kit"
import { Sheet, company, underline } from "./_shared"

/**
 * The about paragraph from the homepage, word for word. Its links have no
 * colour; hovering or focusing one opens a small card under it with what the
 * company is, the role and the year. The underline of the open link is the
 * piece's one accent.
 */

const ACCENT = "oklch(0.55 0.16 252)"

type Key = "codebase" | "nav" | "advanti" | "docdir" | "github"

const CARDS: Record<Key, { name: string; line: string; meta: string; status: string }> = {
  codebase: {
    name: company("codebase").name,
    line: company("codebase").tagline,
    meta: `${company("codebase").role} · since ${company("codebase").year}`,
    status: company("codebase").status,
  },
  nav: {
    name: "Not Another VC",
    line: "Pre-seed angel investing.",
    meta: "Founder · since 2023",
    status: "Active",
  },
  advanti: {
    name: company("advanti-estate").name,
    line: company("advanti-estate").tagline,
    meta: `${company("advanti-estate").role} · since ${company("advanti-estate").year}`,
    status: company("advanti-estate").status,
  },
  docdir: {
    name: company("docdir").name,
    line: company("docdir").tagline,
    meta: `${company("docdir").role} · ${company("docdir").year}–2026`,
    status: company("docdir").status,
  },
  github: {
    name: "github.com/Codehagen",
    line: "Badget, an open-source finance platform (2.7k ★), and Prismui (789 ★).",
    meta: "Open source",
    status: "Public",
  },
}

const css = `
.b07-l { text-decoration-color: rgba(18,18,18,0.22); transition-property: text-decoration-color; transition-duration: 160ms; transition-timing-function: ease-out; }
.b07-l[data-on] { text-decoration-color: ${ACCENT}; }
.b07-card { transition-property: left, top, opacity, translate; transition-duration: 220ms, 220ms, 160ms, 160ms; transition-timing-function: cubic-bezier(.2,.7,.2,1); }
@media (prefers-reduced-motion: reduce) { .b07-l, .b07-card { transition-duration: 0ms; } }
`

export default function AboutPreviews() {
  const box = React.useRef<HTMLDivElement>(null)
  const cardRef = React.useRef<HTMLDivElement>(null)
  const para = React.useRef<HTMLParagraphElement>(null)
  const refs = React.useRef<Partial<Record<Key, HTMLButtonElement | null>>>({})
  const [open, setOpen] = React.useState<Key>("docdir")
  const [pos, setPos] = React.useState<{ x: number; y: number } | null>(null)

  const place = React.useCallback((k: Key) => {
    const el = refs.current[k]
    const b = box.current
    if (!el || !b) return
    const r = el.getBoundingClientRect()
    const o = b.getBoundingClientRect()
    // The card sits under the paragraph, lined up with the link (clamped to
    // the sheet), so it never covers the words you are reading.
    const w = cardRef.current?.offsetWidth ?? 0
    const x = Math.min(Math.max(r.left - o.left, 0), o.width - w)
    const pb = para.current?.getBoundingClientRect().bottom ?? r.bottom
    setPos({ x, y: pb - o.top + o.width * 0.035 })
  }, [])

  React.useLayoutEffect(() => {
    place(open)
    const b = box.current
    if (!b) return
    const ro = new ResizeObserver(() => place(open))
    ro.observe(b)
    return () => ro.disconnect()
  }, [open, place])

  const L = (k: Key, children: React.ReactNode) => (
    <button
      key={k}
      type="button"
      ref={(el) => {
        refs.current[k] = el
      }}
      onPointerEnter={() => setOpen(k)}
      onFocus={() => setOpen(k)}
      onClick={() => setOpen(k)}
      aria-expanded={open === k}
      className="b07-l inline cursor-pointer outline-none"
      data-on={open === k || undefined}
      style={{ ...underline, font: "inherit", touchAction: "manipulation" }}
    >
      {children}
    </button>
  )

  const card = CARDS[open]

  return (
    <Tile>
      <style>{css}</style>
      <Lead
        bold="Links without colour."
        grey="Hover a name and a small card says what it is, without leaving the page."
      />

      <Sheet top="19cqw" left="5.4cqw" width="89.2cqw">
        <div ref={box} className="relative mx-[5cqw] pt-[4.6cqw]">
          <p style={{ color: C.grey }}>About</p>
          <p
            ref={para}
            className="mt-[1.8cqw]"
            style={{ fontSize: "2.7cqw", lineHeight: 1.5, textWrap: "pretty" }}
          >
            Christer Hagen is a Norwegian serial entrepreneur and software developer based
            in Bodø. He founded {L("codebase", "Codebase")} and{" "}
            {L("nav", "Not Another VC")}, is a partner at{" "}
            {L("advanti", "Advanti Estate")}, and {L("github", "writes software in the open")}.
            In 2026 he sold {L("docdir", "Docdir")} to Visma and placed in the top 4% of the
            Norwegian AI Championship.
          </p>

          <div
            ref={cardRef}
            role="status"
            aria-live="polite"
            className="b07-card absolute z-10 w-[40cqw] rounded-[1.6cqw] px-[2.2cqw] pt-[1.6cqw] pb-[1.8cqw]"
            style={{
              left: pos?.x ?? 0,
              top: pos?.y ?? 0,
              opacity: pos ? 1 : 0,
              translate: pos ? "0 0" : "0 0.6cqw",
              background: C.white,
              boxShadow: RING,
              fontSize: "2.2cqw",
            }}
          >
            <div className="flex items-baseline justify-between gap-[2cqw]">
              <span style={{ fontWeight: 560 }}>{card.name}</span>
              <span className="flex items-center gap-[0.8cqw]" style={{ color: C.grey }}>
                <span
                  aria-hidden
                  className="size-[1cqw] rounded-full"
                  style={{ background: ACCENT }}
                />
                {card.status}
              </span>
            </div>
            <p className="mt-[0.6cqw]" style={{ color: C.grey, textWrap: "pretty" }}>
              {card.line}
            </p>
            <p className="mt-[0.4cqw] tabular-nums" style={{ color: C.faint }}>
              {card.meta}
            </p>
          </div>
        </div>
      </Sheet>
    </Tile>
  )
}
