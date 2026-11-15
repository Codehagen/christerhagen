"use client"

import * as React from "react"

import { C, Lead, RING, Tile } from "../../kit"
import { PostHead } from "./parts"

/**
 * benji's fixed left rail, at tile scale. The page on the right scrolls; the
 * rail stays put, the section you are reading darkens, and a rust pen arrow
 * slides to it. Clicking a rail item scrolls the page there.
 */

const RUST = "oklch(0.56 0.15 42)"

const css = `
.r1a2-scroll { scrollbar-width: none; overscroll-behavior: contain; }
.r1a2-scroll::-webkit-scrollbar { display: none; }
.r1a2-item { transition-property: color; transition-duration: 220ms; transition-timing-function: ease-out; }
.r1a2-mark { transition-property: translate, opacity; transition-duration: 340ms; transition-timing-function: cubic-bezier(.2,.8,.2,1); }
@media (prefers-reduced-motion: reduce) {
  .r1a2-item, .r1a2-mark { transition-duration: 0ms; }
}
`

const SECTIONS = [
  {
    id: "docdir",
    title: "Selling Docdir to Visma",
    meta: "Feb 2026 · 2 min",
    body: [
      "Docdir started as a small tool to take the worst part of a real-estate transaction — assembling and quality-checking the sales prospectus — and let software do it. We trained it on Norwegian documents, in Norwegian, for Norwegian agents.",
      "In early 2026 it was acquired by Broker AS, part of the Visma group. It is the second Bodø company Visma has bought; PowerOffice was the first.",
    ],
  },
  {
    id: "bodo",
    title: "Why I build companies in Bodø",
    meta: "Nov 2025 · 2 min",
    body: [
      "People assume you have to move to Oslo, or further, to build technology companies. I have built mine 1,200 kilometres north of the capital, and I would not change it.",
      "The internet does not care where you are. Customers care that you solve their problem. Everything else is a story we tell ourselves.",
    ],
  },
  {
    id: "apparel",
    title: "What apparel taught me about software",
    meta: "Jun 2024 · 2 min",
    body: [
      "My first company, Refenze, made fitness apparel. Manufactured in China, sold to customers across Europe and the US, growing 25% a month at its peak.",
      "Physical products teach you things software founders skip: cash is real, inventory is a bet, and a refund is a conversation rather than a button.",
    ],
  },
] as const

export default function RailContents() {
  const scrollRef = React.useRef<HTMLDivElement>(null)
  const secRefs = React.useRef<(HTMLElement | null)[]>([])
  const itemRefs = React.useRef<(HTMLButtonElement | null)[]>([])
  const [active, setActive] = React.useState(0)
  const [markY, setMarkY] = React.useState<number | null>(null)

  // Which section owns the reading line, a third of the way down the page.
  React.useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    let raf = 0
    const read = () => {
      raf = 0
      const line = el.scrollTop + el.clientHeight * 0.34
      let i = 0
      secRefs.current.forEach((s, k) => {
        if (s && s.offsetTop <= line) i = k
      })
      setActive(i)
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(read)
    }
    read()
    el.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      el.removeEventListener("scroll", onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  // The pen mark follows the active rail item; rail items can wrap, so measure.
  React.useLayoutEffect(() => {
    const place = () => {
      const it = itemRefs.current[active]
      if (it) setMarkY(it.offsetTop + it.offsetHeight / 2)
    }
    place()
    const ro = new ResizeObserver(place)
    itemRefs.current.forEach((it) => it && ro.observe(it))
    return () => ro.disconnect()
  }, [active])

  const go = (i: number) => {
    const el = scrollRef.current
    const s = secRefs.current[i]
    if (!el || !s) return
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    el.scrollTo({ top: s.offsetTop - el.clientHeight * 0.06, behavior: reduce ? "auto" : "smooth" })
  }

  return (
    <Tile>
      <style>{css}</style>
      <Lead
        bold="The rail knows where you are."
        grey="Scroll the page. The section you are reading darkens on the left; the rest wait at forty percent."
      />

      <nav
        aria-label="Sections"
        className="absolute top-[24cqw] left-[5.4cqw] w-[19cqw]"
        style={{ fontSize: "2.2cqw", lineHeight: 1.35 }}
      >
        <span className="block pb-[2.4cqw]" style={{ color: C.faint }}>
          ↩ Index
        </span>
        <span className="relative block">
          <svg
            aria-hidden
            viewBox="0 0 24 12"
            className="r1a2-mark absolute left-[-4.4cqw] h-[1.9cqw] w-[3.6cqw]"
            style={{
              top: 0,
              translate: `0 calc(${markY ?? 0}px - 0.95cqw)`,
              opacity: markY === null ? 0 : 1,
              overflow: "visible",
            }}
          >
            <path
              d="M1 6.6 C 7 5.4, 13 6.4, 21 5.8 M16.5 2 C 18.5 3.6, 20 4.8, 22 5.9 C 20 7, 18.4 8.4, 16.8 10.2"
              fill="none"
              stroke={RUST}
              strokeWidth={1.6}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {SECTIONS.map((s, i) => (
            <button
              key={s.id}
              ref={(el) => {
                itemRefs.current[i] = el
              }}
              type="button"
              onClick={() => go(i)}
              aria-current={i === active ? "true" : undefined}
              className="r1a2-item block w-full cursor-pointer py-[0.8cqw] text-left"
              style={{
                color: i === active ? C.ink : "rgba(18,18,18,0.4)",
                touchAction: "manipulation",
              }}
            >
              {s.title}
            </button>
          ))}
        </span>
      </nav>

      <div
        className="absolute top-[21cqw] right-[5.4cqw] bottom-[-3cqw] left-[29cqw] overflow-hidden rounded-[2.4cqw]"
        style={{ background: C.white, boxShadow: RING }}
      >
        <div
          ref={scrollRef}
          tabIndex={0}
          aria-label="Writing, scrollable"
          className="r1a2-scroll relative h-full overflow-y-auto px-[3.4cqw] pt-[3cqw] pb-[40cqw] outline-none"
        >
          {SECTIONS.map((s, i) => (
            <section
              key={s.id}
              ref={(el) => {
                secRefs.current[i] = el
              }}
              className="pb-[4cqw]"
            >
              <PostHead title={s.title} meta={s.meta} />
              {s.body.map((p) => (
                <p key={p.slice(0, 24)} className="mt-[1.8cqw]">
                  {p}
                </p>
              ))}
            </section>
          ))}
        </div>
      </div>
    </Tile>
  )
}
