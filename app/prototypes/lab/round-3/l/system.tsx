"use client"

import * as React from "react"

import { uiCopy, type Lang } from "@/lib/companies"
import {
  aboutContent,
  contactContent,
  EMAIL,
  homeContent,
  portfolioContent,
  socialLinks,
} from "@/lib/content"
import { isPostSlug, nextPostSlug, postOrder, posts, writingCopy, type PostSlug } from "@/lib/posts"

import { fontHand } from "../../kit"
import { G, LANGS, TravelRing, langKeys, tagOf, useBox, useCopy, useReducedMotion } from "../../round-2/h/chrome"

/**
 * Group l (round 3): the chrome around every page, finished. One system
 * assembled only from what was kept: 36's header with the ringed current page
 * and the quiet EN / NO, 02's 40% rail, 40's phone menu, 38/17's footer that
 * is the address with copy beside it, 23's pen toggle, 19's read next. The
 * pages under it are the site's real pages, written from lib/.
 *
 * Page bodies size in em, so the same page sets at desktop and phone scale;
 * the chrome itself sizes in cqw. Press, hit areas, focus rings and the
 * moving ring come from round 2 / h's Frame.
 */

export { G, tagOf, useReducedMotion, TravelRing, useBox }

export type NavKey = "about" | "portfolio" | "writing" | "contact"
export const NAV: NavKey[] = ["about", "portfolio", "writing", "contact"]
export type Route = "home" | NavKey | PostSlug | "missing"

export const navOf = (r: Route): NavKey | null =>
  isPostSlug(r) ? "writing" : r === "home" || r === "missing" ? null : r

export function navLabel(k: NavKey, lang: Lang) {
  const t = uiCopy[lang]
  return { about: t.navAbout, portfolio: t.navPortfolio, writing: t.navWriting, contact: t.navContact }[k]
}

/** The real address of a route on christerhagen.com, so ⌘-click still works. */
export function hrefOf(r: Route, lang: Lang) {
  const p = r === "home" ? "/" : isPostSlug(r) ? `/writing/${r}` : r === "missing" ? "/writing/oslo" : `/${r}`
  if (lang === "en") return p
  return p === "/" ? "/no" : `/no${p}`
}

/** True (and the browser's navigation cancelled) for a plain click; a modified click stays a real link. */
export function plainClick(e: React.MouseEvent<HTMLAnchorElement>) {
  if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return false
  e.preventDefault()
  return true
}

/** A plain click stays in the tile; a modified click is a real link. */
export function follow(go: () => void) {
  return (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return
    e.preventDefault()
    go()
  }
}

export const WORDS: Record<
  Lang,
  { copy: string; copied: string; pen: string; manual: string; copyLabel: string; open: string; close: string; menu: string }
> = {
  en: {
    copy: "Copy",
    copied: "Copied",
    pen: "copied",
    manual: "Selected. Press ⌘C to copy.",
    copyLabel: "Copy email address",
    open: "Open menu",
    close: "Close menu",
    menu: "Menu",
  },
  no: {
    copy: "Kopier",
    copied: "Kopiert",
    pen: "kopiert",
    manual: "Markert. Trykk ⌘C for å kopiere.",
    copyLabel: "Kopier e-postadressen",
    open: "Åpne meny",
    close: "Lukk meny",
    menu: "Meny",
  },
}

/* ------------------------------------------------------------- navigation */

/**
 * The route, with what a router does after it: back to the top of the page,
 * and when the click came from inside the page (a row, read next), focus
 * moves to the new page's title so the keyboard isn't left on a removed link.
 */
export function useRoute(initial: Route, scrollerRef: React.RefObject<HTMLElement | null>) {
  const [route, setRoute] = React.useState<Route>(initial)
  const focusNext = React.useRef(false)
  const go = React.useCallback((r: Route, focus = true) => {
    focusNext.current = focus
    setRoute(r)
  }, [])
  React.useLayoutEffect(() => {
    const el = scrollerRef.current
    if (el) el.scrollTop = 0
    if (focusNext.current) {
      el?.querySelector<HTMLElement>("[data-title]")?.focus({ preventScroll: true })
      focusNext.current = false
    }
  }, [route, scrollerRef])
  return [route, go] as const
}

function topIn(scroller: HTMLElement, el: HTMLElement) {
  return el.getBoundingClientRect().top - scroller.getBoundingClientRect().top + scroller.scrollTop
}

/** Scroll-spy over `[data-section]` in the scroller, re-read whenever `key` changes. */
export function useSpy(scrollerRef: React.RefObject<HTMLElement | null>, key: string, offset = 0.34) {
  const reduced = useReducedMotion()
  const [active, setActive] = React.useState(0)
  React.useEffect(() => {
    const el = scrollerRef.current
    if (!el) return
    let raf = 0
    const read = () => {
      raf = 0
      const secs = Array.from(el.querySelectorAll<HTMLElement>("[data-section]"))
      const line = el.scrollTop + el.clientHeight * offset
      const atEnd = el.scrollTop + el.clientHeight >= el.scrollHeight - 2
      let i = 0
      secs.forEach((s, k) => {
        if (topIn(el, s) <= line) i = k
      })
      setActive(atEnd && el.scrollTop > 0 ? Math.max(0, secs.length - 1) : i)
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(read)
    }
    raf = requestAnimationFrame(read)
    el.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      el.removeEventListener("scroll", onScroll)
      cancelAnimationFrame(raf)
    }
  }, [scrollerRef, key, offset])

  const go = React.useCallback(
    (i: number, headerPx = 0) => {
      const el = scrollerRef.current
      if (!el) return
      const s = el.querySelectorAll<HTMLElement>("[data-section]")[i]
      if (!s) return
      const top = i === 0 ? 0 : Math.max(0, topIn(el, s) - headerPx - el.clientHeight * 0.06)
      el.scrollTo({ top, behavior: reduced ? "auto" : "smooth" })
    },
    [scrollerRef, reduced],
  )
  return { active, go }
}

/* --------------------------------------------------------------- the band */

export function LangLetters({
  lang,
  setLang,
  style,
}: {
  lang: Lang
  setLang: (l: Lang) => void
  style?: React.CSSProperties
}) {
  const refs = React.useRef<(HTMLElement | null)[]>([])
  return (
    <span
      role="radiogroup"
      aria-label="Language"
      onKeyDown={(e) => langKeys(e, lang, setLang, refs)}
      className="flex items-center"
      style={{ gap: "0.35em", letterSpacing: "0.02em", ...style }}
    >
      {LANGS.map((l, i) => (
        <React.Fragment key={l.id}>
          {i > 0 ? (
            <span aria-hidden style={{ color: "rgba(18,18,18,0.22)" }}>
              /
            </span>
          ) : null}
          <button
            ref={(el) => {
              refs.current[i] = el
            }}
            type="button"
            role="radio"
            aria-checked={lang === l.id}
            aria-label={l.name}
            tabIndex={lang === l.id ? 0 : -1}
            onClick={() => setLang(l.id)}
            className="h2-press h2-hit l3-lang"
            data-on={lang === l.id || undefined}
            style={{ padding: "0.2em 0.15em", ["--hw" as string]: "36px" }}
          >
            {l.label}
          </button>
        </React.Fragment>
      ))}
    </span>
  )
}

/**
 * 36's header: the name goes home, four pages, EN / NO. The current page has
 * no weight and no underline; the pen rings it, and the ring travels. On a
 * post the ring stays on Writing — you are still in it.
 */
export function Header({
  route,
  lang,
  setLang,
  go,
  color,
  on,
  extra,
}: {
  route: Route
  lang: Lang
  setLang: (l: Lang) => void
  go: (r: Route, focus?: boolean) => void
  color: string
  on: boolean
  /** Lives between the pages and EN / NO. */
  extra?: React.ReactNode
}) {
  const navRef = React.useRef<HTMLElement>(null)
  const items = React.useRef<Partial<Record<NavKey, HTMLSpanElement | null>>>({})
  const cur = navOf(route)
  const box = useBox(navRef, () => (cur ? items.current[cur] : null), [cur, lang])

  return (
    <header className="l3-band">
      <a
        href={hrefOf("home", lang)}
        onClick={follow(() => go("home", false))}
        aria-current={route === "home" ? "page" : undefined}
        className="h2-press h2-hit l3-name"
      >
        Christer Hagen
      </a>
      <div className="flex items-center" style={{ gap: "2.4cqw" }}>
        <nav ref={navRef} aria-label="Main" className="relative flex items-center" style={{ gap: "2.7cqw" }}>
          {NAV.map((k) => (
            <a
              key={k}
              href={hrefOf(k, lang)}
              onClick={follow(() => go(k, false))}
              aria-current={route === k ? "page" : cur === k ? "true" : undefined}
              className="h2-press h2-hit l3-nav"
              data-on={cur === k || undefined}
            >
              <span
                ref={(el) => {
                  items.current[k] = el
                }}
              >
                {navLabel(k, lang)}
              </span>
            </a>
          ))}
          <TravelRing box={box} k={cur ?? "none"} on={on && cur !== null} color={color} />
        </nav>
        {extra}
        <LangLetters lang={lang} setLang={setLang} style={{ fontSize: "1.7cqw" }} />
      </div>
    </header>
  )
}

/** 02's rail: 40% grey, the item you are on is ink. */
export function Rail({
  label,
  head,
  items,
  active,
  onPick,
  top = "15cqw",
}: {
  label: string
  head?: React.ReactNode
  items: { key: string; label: string; href?: string }[]
  active: number
  onPick: (i: number) => void
  top?: string
}) {
  return (
    <nav aria-label={label} className="l3-rail absolute" style={{ left: "4.4cqw", top, width: "19cqw" }}>
      {head ? <div style={{ marginBottom: "1.6cqw" }}>{head}</div> : null}
      <ul className="flex flex-col" style={{ gap: "0.5cqw" }}>
        {items.map((it, i) => (
          <li key={it.key}>
            {it.href ? (
              <a
                href={it.href}
                onClick={follow(() => onPick(i))}
                aria-current={i === active ? "page" : undefined}
                className="h2-press h2-hit l3-rail-i"
                data-on={i === active || undefined}
              >
                {it.label}
              </a>
            ) : (
              <button
                type="button"
                onClick={() => onPick(i)}
                aria-current={i === active ? "location" : undefined}
                className="h2-press h2-hit l3-rail-i"
                data-on={i === active || undefined}
              >
                {it.label}
              </button>
            )}
          </li>
        ))}
      </ul>
    </nav>
  )
}

/* ------------------------------------------------------- the address, copy */

/**
 * 17 / 38: the address is a plain mailto link, and beside it a copy button
 * whose glyph becomes a check for a second and a half. If the clipboard is
 * refused, the address is selected for ⌘C instead and the line under it says so.
 * `pen` lets the pen write "copied" beside it for the same second and a half.
 */
export function CopyAddress({
  lang,
  color,
  size = "1.2em",
  pen = false,
  note,
}: {
  lang: Lang
  color: string
  size?: string
  pen?: boolean
  /** The quiet line under the address; the manual-copy hint replaces it. */
  note?: React.ReactNode
}) {
  const { state, copy, ref } = useCopy(EMAIL)
  const w = WORDS[lang]
  const done = state === "copied"
  return (
    <div style={{ ["--acc" as string]: color }}>
      <div className="flex min-w-0 flex-wrap items-center" style={{ gap: "0.6em 0.9em" }}>
        <a
          ref={ref}
          href={`mailto:${EMAIL}`}
          className="l3-mail"
          style={{ fontSize: size, fontWeight: 520, letterSpacing: "-0.012em", whiteSpace: "nowrap" }}
        >
          {EMAIL}
        </a>
        <span className="relative flex items-center">
          <button
            type="button"
            onClick={copy}
            aria-label={done ? w.copied : w.copyLabel}
            className="h2-press h2-hit l3-copy"
            data-done={done || undefined}
            style={{ ["--hw" as string]: "44px" }}
          >
            <span aria-hidden className="relative block" style={{ width: "1.05em", height: "1.05em" }}>
              <svg viewBox="0 0 16 16" className="l3-ic l3-ic-copy" fill="none">
                <rect x="5" y="5" width="8.5" height="8.5" rx="2" />
                <path d="M10.5 2.8 H4.8 A2 2 0 0 0 2.8 4.8 V10.5" />
              </svg>
              <svg viewBox="0 0 16 16" className="l3-ic l3-ic-check" fill="none">
                <path pathLength={1} d="M3.2 8.6 L6.6 11.8 L12.8 4.6" />
              </svg>
            </span>
            <span aria-hidden className="grid">
              <span className="l3-w" data-on={!done || undefined}>
                {w.copy}
              </span>
              <span className="l3-w" data-on={done || undefined}>
                {w.copied}
              </span>
            </span>
          </button>
          {pen ? (
            <span
              aria-hidden
              className="l3-penword absolute"
              data-on={done || undefined}
              style={{ left: "calc(100% + 0.7em)", top: "-0.25em", fontFamily: fontHand, fontSize: "1.55em", color }}
            >
              {w.pen}
            </span>
          ) : null}
        </span>
      </div>
      <p className="l3-meta" style={{ marginTop: "0.7em", color: state === "manual" ? G.ink : G.faint }}>
        {state === "manual" ? w.manual : note ?? contactContent[lang].availability}
      </p>
      <span role="status" className="sr-only">
        {done ? w.copied : state === "manual" ? w.manual : ""}
      </span>
    </div>
  )
}

/** The footer is the address: nothing else in it. */
export function Footer({ lang, color, pen = false }: { lang: Lang; color: string; pen?: boolean }) {
  return (
    <footer lang={tagOf(lang)} className="l3-foot">
      <CopyAddress lang={lang} color={color} pen={pen} />
    </footer>
  )
}

/** 19: one title and its arrow, the last link on a post. Only the arrow moves. */
export function ReadNext({
  slug,
  lang,
  go,
  color,
}: {
  slug: PostSlug
  lang: Lang
  go: (r: Route) => void
  color: string
}) {
  const n = nextPostSlug(slug)
  const p = posts[lang][n]
  return (
    <div className="l3-next" style={{ ["--acc" as string]: color }}>
      <p className="l3-meta" style={{ color: G.faint }}>
        {writingCopy[lang].readNextLabel}
      </p>
      <a href={hrefOf(n, lang)} onClick={follow(() => go(n))} className="h2-press l3-next-a">
        <span className="l3-next-t">{p.title}</span>{" "}
        <span aria-hidden className="l3-next-ar">
          →
        </span>
      </a>
      <p className="l3-meta tabular-nums" style={{ color: G.faint }}>
        {p.date} · {p.read}
      </p>
    </div>
  )
}

/* ------------------------------------------------------------- the pages */

export function Rule({ children, top = "2.6em" }: { children: React.ReactNode; top?: string }) {
  return (
    <h2 className="flex items-center" style={{ margin: `${top} 0 0.6em`, gap: "0.75em", color: G.grey, fontSize: "inherit", fontWeight: 460 }}>
      <span className="shrink-0">{children}</span>
      <span aria-hidden className="h-px flex-1" style={{ background: G.hair }} />
    </h2>
  )
}

export function Title({ children, kicker }: { children: React.ReactNode; kicker?: string }) {
  return (
    <>
      {kicker ? (
        <p className="l3-meta" style={{ color: G.grey, marginBottom: "0.7em" }}>
          {kicker}
        </p>
      ) : null}
      <h1 data-title tabIndex={-1} className="l3-title">
        {children}
      </h1>
    </>
  )
}

const ddmm = (iso: string) => `${iso.slice(8, 10)}/${iso.slice(5, 7)}`

export function rowStyle(i: number): React.CSSProperties {
  return { borderTop: i ? `1px solid ${G.hair}` : undefined }
}

export function HomeView({ lang }: { lang: Lang }) {
  const h = homeContent[lang]
  const now = h.work.filter((w) => !w.period.includes("·"))
  return (
    <>
      <section data-section>
        <Title>{h.heroHead}</Title>
        <p style={{ marginTop: "0.8em", color: G.grey, textWrap: "pretty" }}>{h.heroSub}</p>
        <Rule>{h.lblAbout}</Rule>
        <p style={{ textWrap: "pretty" }}>{h.aboutBody}</p>
      </section>
      <section data-section>
        <Rule>{h.lblNow}</Rule>
        <ul>
          {now.map((w, i) => (
            <li key={w.name} className="flex items-baseline justify-between" style={{ ...rowStyle(i), gap: "1em", padding: "0.45em 0" }}>
              <span className="min-w-0">
                <span style={{ fontWeight: 520 }}>{w.name}</span>{" "}
                <span style={{ color: G.faint }}>{w.role.split(" · ")[1]}</span>
              </span>
              <span className="shrink-0 tabular-nums" style={{ color: G.grey }}>
                {w.period.replace(/^\D+/, "")}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </>
  )
}

export function AboutView({ lang, slot }: { lang: Lang; slot?: React.ReactNode }) {
  const a = aboutContent[lang]
  return (
    <>
      <section data-section>
        <Title kicker={a.kicker}>{a.head}</Title>
        <div className="flex flex-col" style={{ gap: "0.9em", marginTop: "1.2em" }}>
          {slot ?? a.bio.slice(0, 2).map((p) => <p key={p.slice(0, 20)}>{p}</p>)}
        </div>
      </section>
      <section data-section>
        <Rule>{a.lblBackground}</Rule>
        <ul>
          {a.timeline.map((t, i) => (
            <li key={t.year} className="flex items-baseline" style={{ ...rowStyle(i), gap: "1.4em", padding: "0.45em 0" }}>
              <span className="shrink-0 tabular-nums" style={{ color: G.faint, width: "2.6em" }}>
                {t.year}
              </span>
              <span>{t.event}</span>
            </li>
          ))}
        </ul>
      </section>
      <section data-section>
        <Rule>{a.lblPress}</Rule>
        <ul>
          {a.press.slice(0, 3).map((p, i) => (
            <li key={p.url} style={{ ...rowStyle(i), padding: "0.45em 0" }}>
              <a href={p.url} target="_blank" rel="noopener noreferrer" className="l3-link-row">
                <span style={{ color: G.faint }}>{p.outlet}</span> <span>{p.title}</span>
              </a>
            </li>
          ))}
        </ul>
      </section>
    </>
  )
}

export function PortfolioView({ lang }: { lang: Lang }) {
  const p = portfolioContent[lang]
  const group = (label: string, rows: { name: string; desc: string; tail: string }[], top?: string) => (
    <section data-section>
      <Rule top={top}>{label}</Rule>
      <ul>
        {rows.map((r, i) => (
          <li key={r.name} className="flex items-baseline justify-between" style={{ ...rowStyle(i), gap: "1.2em", padding: "0.45em 0" }}>
            <span className="min-w-0">
              <span style={{ fontWeight: 520 }}>{r.name}</span> <span style={{ color: G.faint }}>{r.desc}</span>
            </span>
            <span className="shrink-0 tabular-nums" style={{ color: G.grey }}>
              {r.tail}
            </span>
          </li>
        ))}
      </ul>
    </section>
  )
  return (
    <>
      <div data-section>
        <Title kicker={p.kicker}>{p.intro}</Title>
      </div>
      {group(p.gBuilt, p.built.map((b) => ({ name: b.name, desc: b.desc, tail: b.meta.replace(/^.* · /, "") })))}
      {group(p.gExits, p.exits.map((b) => ({ name: b.name, desc: b.desc, tail: b.stage })))}
      {group(p.gInvest, p.invest.map((b) => ({ name: b.name, desc: b.desc, tail: b.meta })))}
    </>
  )
}

/** The writing list, grouped by year, dd/mm right-aligned. `newMark` sits on the "New". */
export function WritingView({
  lang,
  go,
  newMark,
}: {
  lang: Lang
  go: (r: Route) => void
  newMark?: React.ReactNode
}) {
  const w = writingCopy[lang]
  const years = Array.from(new Set(postOrder.map((s) => posts[lang][s].dateISO.slice(0, 4))))
  return (
    <>
      <div>
        <Title kicker={w.kicker}>{w.intro}</Title>
      </div>
      {years.map((y, yi) => (
        <section key={y} data-section style={{ marginTop: yi ? 0 : "2em" }}>
          <ul>
            {postOrder
              .filter((s) => posts[lang][s].dateISO.startsWith(y))
              .map((s) => {
                const p = posts[lang][s]
                return (
                  <li key={s} style={{ borderTop: `1px solid ${G.hair}` }}>
                    <a href={hrefOf(s, lang)} onClick={follow(() => go(s))} className="h2-press l3-row">
                      <span className="tabular-nums" style={{ color: G.faint }}>
                        {y}
                      </span>
                      <span className="flex min-w-0 items-center" style={{ gap: "0.8em" }}>
                        <span className="l3-row-t truncate">{p.title}</span>
                        {s === postOrder[0] ? (
                          <span className="relative shrink-0" style={{ color: G.grey, fontSize: "0.88em" }}>
                            {lang === "en" ? "New" : "Ny"}
                            {newMark}
                          </span>
                        ) : null}
                      </span>
                      <span className="tabular-nums" style={{ color: G.faint, paddingLeft: "1em" }}>
                        {ddmm(p.dateISO)}
                      </span>
                    </a>
                  </li>
                )
              })}
          </ul>
        </section>
      ))}
    </>
  )
}

/** A post: title, date and length, the body, and read next as its last link. */
export function PostView({
  slug,
  lang,
  go,
  color,
  body,
}: {
  slug: PostSlug
  lang: Lang
  go: (r: Route) => void
  color: string
  /** Replaces the plain paragraphs, for a page the pen has been through. */
  body?: React.ReactNode
}) {
  const p = posts[lang][slug]
  return (
    <article>
      <p className="l3-meta tabular-nums" style={{ color: G.grey, marginBottom: "0.7em" }}>
        {p.date} · {p.read}
      </p>
      <h1 data-title tabIndex={-1} className="l3-title">
        {p.title}
      </h1>
      <div className="flex flex-col" style={{ gap: "1em", marginTop: "1.4em" }}>
        {body ?? p.body.map((b) => <p key={b.slice(0, 20)}>{b}</p>)}
      </div>
      <ReadNext slug={slug} lang={lang} go={go} color={color} />
    </article>
  )
}

export function Socials({ lang }: { lang: Lang }) {
  return (
    <ul>
      {socialLinks(lang)
        .filter((s) => !s.url.startsWith("mailto:"))
        .map((s, i) => (
          <li key={s.label} style={rowStyle(i)}>
            <a href={s.url} target="_blank" rel="noopener noreferrer" className="h2-press l3-social">
              <span style={{ color: G.faint }}>{s.label}</span>
              <span className="l3-social-h">{s.handle}</span>
            </a>
          </li>
        ))}
    </ul>
  )
}

export function ContactView({ lang, color }: { lang: Lang; color: string }) {
  const c = contactContent[lang]
  return (
    <>
      <section data-section>
        <Title kicker={c.kicker}>{c.head}</Title>
        <p style={{ marginTop: "0.8em", color: G.grey, textWrap: "pretty" }}>{c.body}</p>
        <div style={{ marginTop: "1.8em" }}>
          <CopyAddress lang={lang} color={color} size="1.35em" />
        </div>
        <div style={{ marginTop: "1.4em" }}>
          <Socials lang={lang} />
        </div>
      </section>
      <section data-section>
        <Rule>{c.lookHead}</Rule>
        <p style={{ textWrap: "pretty" }}>{c.lookBody}</p>
      </section>
    </>
  )
}

/** Rail items for a route: the page's own sections, or on a post, its siblings. */
export function railFor(route: Route, lang: Lang): { label: string; items: { key: string; label: string; href?: string }[] } {
  if (isPostSlug(route)) {
    return {
      label: navLabel("writing", lang),
      items: postOrder.map((s) => ({ key: s, label: posts[lang][s].title, href: hrefOf(s, lang) })),
    }
  }
  if (route === "home") {
    const h = homeContent[lang]
    return { label: "On this page", items: [h.lblAbout, h.lblNow].map((l) => ({ key: l, label: l })) }
  }
  if (route === "about") {
    const a = aboutContent[lang]
    return { label: "On this page", items: [a.kicker, a.lblBackground, a.lblPress].map((l) => ({ key: l, label: l })) }
  }
  if (route === "portfolio") {
    const p = portfolioContent[lang]
    return {
      label: "On this page",
      items: [p.kicker, p.gBuilt, p.gExits, p.gInvest].map((l) => ({ key: l, label: l })),
    }
  }
  if (route === "writing") {
    const years = Array.from(new Set(postOrder.map((s) => posts[lang][s].dateISO.slice(0, 4))))
    return { label: "On this page", items: years.map((y) => ({ key: y, label: y })) }
  }
  if (route === "contact") {
    const c = contactContent[lang]
    return { label: "On this page", items: [c.kicker, c.lookHead].map((l) => ({ key: l, label: l })) }
  }
  return { label: "On this page", items: [] }
}

/** Renders the plain page for a route. */
export function PageFor({ route, lang, go, color }: { route: Route; lang: Lang; go: (r: Route) => void; color: string }) {
  if (isPostSlug(route)) return <PostView slug={route} lang={lang} go={go} color={color} />
  if (route === "home") return <HomeView lang={lang} />
  if (route === "about") return <AboutView lang={lang} />
  if (route === "portfolio") return <PortfolioView lang={lang} />
  if (route === "writing") return <WritingView lang={lang} go={go} />
  if (route === "contact") return <ContactView lang={lang} color={color} />
  return null
}

/* ---------------------------------------------------------------- the css */

export const SYSTEM_CSS = `
.l3-scroll { scrollbar-width: none; overscroll-behavior: contain; }
.l3-scroll::-webkit-scrollbar { display: none; }
.l3-band { position: sticky; top: 0; z-index: 5; display: flex; align-items: center; justify-content: space-between;
  height: 7.4cqw; padding: 0 5cqw; background: ${G.band}; box-shadow: 0 1px 0 ${G.edge}; font-size: 1.95cqw; }
.h2c .l3-name { font-weight: 560; letter-spacing: -0.006em; text-decoration: none; }
.h2c .l3-nav { color: ${G.idle}; text-decoration: none; }
.h2c .l3-nav[data-on] { color: ${G.ink}; }
.h2c .l3-lang { color: ${G.faint}; font-weight: 560; }
.h2c .l3-lang[data-on] { color: ${G.ink}; cursor: default; }

.l3-rail { font-size: 1.95cqw; line-height: 1.35; letter-spacing: -0.006em; }
.h2c .l3-rail-i { display: block; width: 100%; text-align: left; color: ${G.idle}; text-decoration: none; padding: 0.35cqw 0; }
.h2c .l3-rail-i[data-on] { color: ${G.ink}; }
.h2c .l3-back { color: ${G.faint}; text-decoration: none; }

.l3-title { font-size: 1.44em; line-height: 1.18; font-weight: 560; letter-spacing: -0.012em; text-wrap: balance; }
.l3-title:focus { outline: none; }
.l3-meta { font-size: 0.82em; line-height: 1.35; }

.l3-row { display: grid; grid-template-columns: 3.2em 1fr auto; align-items: center; min-height: 44px; text-decoration: none; }
.l3-row-t { display: block; text-decoration-line: underline; text-decoration-thickness: 1px; text-underline-offset: 0.22em; text-decoration-color: transparent;
  transition-property: text-decoration-color; transition-duration: 180ms; }
.l3-link-row { display: flex; gap: 0.6em; min-height: 32px; align-items: baseline; text-decoration: none; }
.l3-social { display: flex; justify-content: space-between; align-items: center; min-height: 44px; text-decoration: none; }
.l3-social-h { text-decoration-line: underline; text-decoration-thickness: 1px; text-underline-offset: 0.22em; text-decoration-color: rgba(18,18,18,0.22);
  transition-property: text-decoration-color; transition-duration: 180ms; }

.l3-mail { text-decoration-line: underline; text-decoration-thickness: 1px; text-underline-offset: 0.22em; text-decoration-color: ${G.faint};
  transition-property: text-decoration-color; transition-duration: 180ms; min-width: 0; overflow: hidden; text-overflow: ellipsis; }
.h2c .l3-copy { display: inline-flex; align-items: center; gap: 0.4em; height: 2.2em; padding: 0 0.7em 0 0.6em; border-radius: 0.6em;
  font-size: 0.9em; color: ${G.grey}; box-shadow: inset 0 0 0 1px ${G.hair};
  transition-property: transform, color, background-color, box-shadow; transition-duration: 140ms, 160ms, 160ms, 160ms; transition-timing-function: cubic-bezier(.2,.8,.3,1); }
.h2c .l3-copy[data-done] { color: var(--acc); box-shadow: inset 0 0 0 1px color-mix(in oklab, var(--acc) 30%, transparent); background-color: color-mix(in oklab, var(--acc) 6%, transparent); }
.l3-ic { position: absolute; inset: 0; width: 100%; height: 100%; stroke: currentColor; stroke-width: 1.5; stroke-linecap: round; stroke-linejoin: round;
  transition-property: opacity, transform; transition-duration: 160ms, 220ms; transition-timing-function: ease, cubic-bezier(.2,.8,.3,1); }
.l3-ic-check { opacity: 0; transform: scale(0.6); }
.l3-ic-check path { stroke-width: 1.8; stroke-dasharray: 1; stroke-dashoffset: 1; transition-property: stroke-dashoffset; transition-duration: 260ms; transition-delay: 60ms; transition-timing-function: cubic-bezier(.3,.8,.3,1); }
.h2c .l3-copy[data-done] .l3-ic-copy { opacity: 0; transform: scale(0.6); }
.h2c .l3-copy[data-done] .l3-ic-check { opacity: 1; transform: none; }
.h2c .l3-copy[data-done] .l3-ic-check path { stroke-dashoffset: 0; }
.l3-w { grid-area: 1 / 1; opacity: 0; transition-property: opacity; transition-duration: 140ms; }
.l3-w[data-on] { opacity: 1; }
.l3-penword { white-space: nowrap; rotate: -4deg; line-height: 1; pointer-events: none; clip-path: inset(-30% 100% -30% -4%); opacity: 0;
  transition-property: clip-path, opacity; transition-duration: 0ms, 260ms; }
.l3-penword[data-on] { clip-path: inset(-30% -4% -30% -4%); opacity: 1; transition-duration: 520ms, 0ms; transition-delay: 120ms, 0ms; transition-timing-function: cubic-bezier(.4,0,.3,1); }

.l3-foot { border-top: 1px solid ${G.hair}; padding: 3.4cqw 0 4.4cqw; }

.l3-next { margin-top: 2.4em; padding-top: 1em; border-top: 1px solid ${G.hair}; }
.l3-next-a { display: flex; align-items: center; min-height: 44px; font-size: 1.12em; font-weight: 560; letter-spacing: -0.012em; text-decoration: none; }
.l3-next-t { text-decoration-line: underline; text-decoration-thickness: 1px; text-underline-offset: 0.2em; text-decoration-color: transparent; transition-property: text-decoration-color; transition-duration: 180ms; }
.l3-next-ar { display: inline-block; margin-left: 0.3em; color: ${G.grey}; transition-property: transform, color; transition-duration: 220ms, 180ms; transition-timing-function: cubic-bezier(.3,.8,.3,1), ease; }
.l3-next-a:focus-visible .l3-next-ar { color: var(--acc); transform: translateX(0.22em); }

@media (hover: hover) and (pointer: fine) {
  .h2c .l3-nav:not([data-on]):hover, .h2c .l3-lang:not([data-on]):hover, .h2c .l3-rail-i:not([data-on]):hover, .h2c .l3-back:hover { color: ${G.ink}; }
  .l3-row:hover .l3-row-t { text-decoration-color: ${G.faint}; }
  .l3-social:hover .l3-social-h, .l3-mail:hover { text-decoration-color: ${G.ink}; }
  .h2c .l3-copy:not([data-done]):hover { color: ${G.ink}; background-color: rgba(18,18,18,0.035); }
  .l3-next-a:hover .l3-next-ar { color: var(--acc); transform: translateX(0.22em); }
  .l3-next-a:hover .l3-next-t { text-decoration-color: ${G.faint}; }
}
@media (prefers-reduced-motion: reduce) {
  .h2c .l3-copy { transition-property: color, background-color, box-shadow; }
  .l3-ic, .l3-ic-check, .h2c .l3-copy[data-done] .l3-ic-copy { transform: none; }
  .l3-ic-check path { transition: none; stroke-dashoffset: 0; }
  .l3-penword, .l3-penword[data-on] { clip-path: none; transition-property: opacity; transition-duration: 200ms; transition-delay: 0ms; }
  .l3-next-ar { transition-property: color; }
  .l3-next-a:hover .l3-next-ar, .l3-next-a:focus-visible .l3-next-ar { transform: none; }
}
`
