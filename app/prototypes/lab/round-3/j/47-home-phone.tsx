"use client"

import * as React from "react"
import Image from "next/image"

import { homeContent } from "@/lib/content"

import { C, RING, useSeen } from "../../kit"
import { Frame } from "../../round-2/h/chrome"
import { LINKS, split } from "./46-home"
import { Footer, G, LangSwitch, Linked, TravelRing, Go, rowsOf, siteCss, tagOf, useBox, useReducedMotion, useSections, type Lang } from "./site"

/**
 * 47 — The home page on a phone.
 *
 * The same home as 46 at phone width. There is no room for 02's rail, so it
 * folds into 40's menu: open it and the four sections stand in a column with
 * the one you are reading ringed in teal. Tap another and the ring goes
 * there first, holds a beat, then the menu closes and the page scrolls to
 * it. Esc closes it and hands focus back. The footer is still the address.
 */

const PEN = "#0F766E"
const HOLD = 520

const BODY = { fontSize: "2.35cqw", lineHeight: 1.45 } as const
const PAD = "3.6cqw"

const css = `
.j47-burger { position: relative; width: 6cqw; height: 6cqw; display: grid; place-items: center; }
.j47-burger span { position: absolute; left: 1.4cqw; right: 1.4cqw; height: 1.5px; border-radius: 1px; background: ${G.ink};
  transition-property: transform; transition-duration: 220ms; transition-timing-function: cubic-bezier(.3,.8,.3,1); }
.j47-burger span:first-child { transform: translateY(-0.6cqw); }
.j47-burger span:last-child { transform: translateY(0.6cqw); }
.j47-burger[data-open] span:first-child { transform: rotate(45deg); }
.j47-burger[data-open] span:last-child { transform: rotate(-45deg); }
.j47-menu { opacity: 0; translate: 0 -1.2cqw; visibility: hidden;
  transition-property: opacity, translate, visibility; transition-duration: 150ms, 150ms, 0ms; transition-delay: 0ms, 0ms, 150ms; transition-timing-function: ease-out; }
.j47-menu[data-open] { opacity: 1; translate: 0 0; visibility: visible; transition-duration: 200ms, 200ms, 0ms; transition-delay: 0ms; }
@media (prefers-reduced-motion: reduce) {
  .j47-burger span { transition-duration: 0ms; }
  .j47-menu, .j47-menu[data-open] { translate: 0 0; transition-property: opacity, visibility; }
}
`

function Label({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="flex items-center" style={{ margin: "7cqw 0 1.6cqw", gap: "1.6cqw", color: G.grey, fontSize: "inherit", fontWeight: 460 }}>
      <span className="shrink-0">{children}</span>
      <span aria-hidden className="h-px flex-1" style={{ background: G.hair }} />
    </h2>
  )
}

export default function HomePhone() {
  const [seenRef, seen] = useSeen<HTMLDivElement>()
  const reduced = useReducedMotion()
  const scrollerRef = React.useRef<HTMLDivElement>(null)
  const listRef = React.useRef<HTMLUListElement>(null)
  const trigger = React.useRef<HTMLButtonElement>(null)
  const items = React.useRef<(HTMLSpanElement | null)[]>([])
  const timer = React.useRef<number | undefined>(undefined)
  const [lang, setLang] = React.useState<Lang>("en")
  const [open, setOpen] = React.useState(false)
  const [picked, setPicked] = React.useState<number | null>(null)
  const { active, go } = useSections(scrollerRef)
  React.useEffect(() => () => window.clearTimeout(timer.current), [])

  const c = homeContent[lang]
  const { now } = split(c)
  const rows = rowsOf(lang)
  const sections = [c.lblAbout, c.lblWork, c.lblWriting, c.lblContact]
  const here = picked ?? active
  const box = useBox(listRef, () => items.current[here], [here, lang, open])

  const close = React.useCallback(() => {
    setOpen(false)
    setPicked(null)
    trigger.current?.focus({ preventScroll: true })
  }, [])

  React.useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close()
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [open, close])

  const pick = (i: number) => {
    window.clearTimeout(timer.current)
    if (i === active) return close()
    setPicked(i)
    timer.current = window.setTimeout(
      () => {
        close()
        go(i)
      },
      reduced ? 160 : HOLD,
    )
  }

  return (
    <Frame label="christerhagen.com, the home page at phone width" style={{ background: C.tile, ["--j-pen" as string]: PEN }}>
      <style>{siteCss()}</style>
      <style>{css}</style>

      <div
        ref={seenRef}
        className="absolute overflow-hidden"
        style={{ top: "4.6cqw", bottom: "-6cqw", left: "50%", width: "38cqw", marginLeft: "-19cqw", borderRadius: "4.4cqw", background: G.ground, boxShadow: RING }}
      >
        <div ref={scrollerRef} tabIndex={0} aria-label="The home page, scrollable" className="j-scroll absolute inset-0 overflow-x-hidden overflow-y-auto" style={{ outline: "none", ...BODY }}>
          <header
            data-band
            className="sticky top-0 z-20 flex items-center justify-between"
            style={{ height: "10cqw", padding: `0 2.2cqw 0 ${PAD}`, background: G.band, boxShadow: `0 1px 0 ${G.edge}`, fontSize: "2.5cqw" }}
          >
            <Go href="/" aria-current="page" className="h2-press h2-hit" style={{ fontWeight: 560, textDecoration: "none" }}>
              Christer Hagen
            </Go>
            <button
              ref={trigger}
              type="button"
              onClick={() => (open ? close() : setOpen(true))}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="j47-menu"
              className="h2-press h2-hit j47-burger"
              data-open={open || undefined}
              style={{ ["--hw" as string]: "44px" }}
            >
              <span aria-hidden />
              <span aria-hidden />
            </button>
          </header>

          <main key={lang} lang={tagOf(lang)} className="h2-reset" inert={open || undefined} style={{ padding: `6cqw ${PAD} 0` }}>
            <section data-section>
              <div
                className="relative overflow-hidden"
                style={{ width: "9cqw", aspectRatio: "236 / 300", borderRadius: "0.6cqw", boxShadow: `0 0 0 1px ${G.hair}`, marginBottom: "3cqw" }}
              >
                <Image src="/images/christer-hagen-portrait.jpg" alt="Christer Hagen" fill sizes="80px" className="object-cover" style={{ objectPosition: "center 22%" }} />
              </div>
              <h1 style={{ margin: 0, fontSize: "3.5cqw", lineHeight: 1.2, fontWeight: 560, letterSpacing: "-0.012em", textWrap: "balance" }}>{c.heroHead}</h1>
              <p style={{ margin: "1.6cqw 0 0", color: G.grey, textWrap: "pretty" }}>{c.heroSub}</p>
              <Label>{c.lblAbout}</Label>
              <Linked text={c.aboutBody} links={LINKS[lang]} lang={lang} />
            </section>

            <section data-section>
              <Label>{c.lblWork}</Label>
              <ul>
                {now.map((r, i) => (
                  <li key={r.name} className="flex items-baseline justify-between" style={{ gap: "2cqw", padding: "1cqw 0", borderTop: i ? `1px solid ${G.hair}` : undefined }}>
                    <span style={{ fontWeight: 520 }}>{r.name}</span>
                    <span className="tabular-nums" style={{ color: G.grey, fontSize: "2cqw" }}>
                      {r.period.replace(/^(Since|Siden) /, (m) => m.toLowerCase())}
                    </span>
                  </li>
                ))}
              </ul>
            </section>

            <section data-section>
              <Label>{c.lblWriting}</Label>
              <ul className="tabular-nums" data-grey={seen || undefined}>
                {rows.map((r, i) => (
                  <li key={r.slug} style={{ borderTop: `1px solid ${i === 0 ? "rgba(18,18,18,0.14)" : G.hair}` }}>
                    <Go href={`/writing/${r.slug}`} className="j-row block" style={{ padding: "1.3cqw 0", minHeight: 44 }}>
                      <span className={i === 0 ? "j-hl" : "j-rest"} data-on={i === 0 && seen ? true : undefined} style={{ fontWeight: 520 }}>
                        {r.title}
                      </span>
                      <span className="j-rest block" style={{ marginTop: "0.3cqw", color: G.grey, fontSize: "2cqw" }}>
                        {r.date} · {r.read}
                      </span>
                    </Go>
                  </li>
                ))}
              </ul>
            </section>

            <section data-section>
              <Label>{c.lblContact}</Label>
              <p style={{ margin: 0, fontWeight: 560 }}>{c.ctaHead}</p>
              <p style={{ margin: "0.8cqw 0 0", color: G.grey, textWrap: "pretty" }}>{c.ctaBody}</p>
            </section>
          </main>
          <div inert={open || undefined}>
            <Footer lang={lang} left={PAD} width="30.8cqw" scale={0.95} pen={false} />
          </div>
        </div>

        <nav
          id="j47-menu"
          aria-label="On this page"
          className="j47-menu absolute inset-x-0 z-30"
          data-open={open || undefined}
          inert={!open || undefined}
          style={{ top: "10cqw", bottom: 0, background: G.ground, padding: `1.6cqw ${PAD}` }}
        >
          <ul ref={listRef} className="relative">
            {sections.map((s, i) => (
              <li key={s} style={{ borderTop: i > 0 ? `1px solid ${G.hair}` : undefined }}>
                <button
                  type="button"
                  onClick={() => pick(i)}
                  aria-current={active === i ? "location" : undefined}
                  className="h2-press j-nav flex w-full items-center"
                  data-on={here === i || undefined}
                  style={{ minHeight: "max(44px, 8.6cqw)", fontSize: "3.2cqw" }}
                >
                  <span
                    ref={(el) => {
                      items.current[i] = el
                    }}
                  >
                    {s}
                  </span>
                </button>
              </li>
            ))}
            <TravelRing box={box} k={String(here)} on={seen && open} color={PEN} padX={0.45} padY={0.36} />
          </ul>
          <div style={{ marginTop: "1.6cqw", paddingTop: "1.6cqw", borderTop: `1px solid ${G.hair}` }}>
            <LangSwitch lang={lang} setLang={setLang} size="2.3cqw" />
          </div>
        </nav>
      </div>
    </Frame>
  )
}
