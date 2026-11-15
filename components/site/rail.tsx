"use client"

import * as React from "react"
import { Link } from "next-view-transitions"

import { cn } from "@/lib/utils"

import { useReducedMotion } from "./pen"

export type RailItem = {
  /** The id of the section element on the page. */
  id: string
  label: React.ReactNode
}

/** The reading line: the section past 34% of the viewport is the one you are reading. */
const LINE = 0.34

/**
 * benji's fixed left rail (DESIGN.md §4 Rail): a back link (`↩ Index`,
 * `↩ All writing`) above the page's sections, 13px, idle at `--ink-idle`.
 * The section you are reading turns ink with `aria-current="location"`
 * (IntersectionObserver on the sections, read at a line 34% down; the last
 * item takes over at the bottom of the page). Clicking scrolls smoothly to
 * the section, 12% below the top. `children` sit at its foot (PenToggle on
 * posts, 21px above).
 *
 * From `lg` up it is fixed at `--rail-left`/`--rail-top`; below that it is a
 * one-line strip under the header row (42), in the same colours.
 *
 *   <Rail label="On this page" back={{ href: "/writing", label: "All writing" }}
 *     items={[{ id: "s1", label: "The sale" }, …]}>
 *     <PenToggle lang={lang} />
 *   </Rail>
 */
export function Rail({
  label,
  back,
  items,
  children,
  className,
}: {
  /** Accessible name: "On this page" / "På denne siden". */
  label: string
  back?: { href: string; label: React.ReactNode }
  items: RailItem[]
  children?: React.ReactNode
  className?: string
}) {
  const reduced = useReducedMotion()
  const [active, setActive] = React.useState(0)
  const ids = items.map((i) => i.id).join("|")

  React.useEffect(() => {
    const els = ids
      .split("|")
      .map((id) => document.getElementById(id))
      .filter((e): e is HTMLElement => !!e)
    if (!els.length) return

    const read = () => {
      // Only once scrolled: a page that fits the screen is at its end
      // without being read to it, and should start on its first section.
      const atEnd =
        window.scrollY > 0 &&
        window.innerHeight + window.scrollY >=
          document.documentElement.scrollHeight - 2
      if (atEnd) return setActive(els.length - 1)
      const line = window.innerHeight * LINE
      let i = 0
      els.forEach((el, k) => {
        if (el.getBoundingClientRect().top <= line) i = k
      })
      setActive(i)
    }

    const io = new IntersectionObserver(read, {
      rootMargin: `-${LINE * 100}% 0px -${100 - LINE * 100 - 1}% 0px`,
    })
    els.forEach((el) => io.observe(el))

    // The bottom of the page has no section crossing the line: watch for it.
    let raf = 0
    const onScroll = () => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        raf = 0
        const atEnd =
          window.scrollY > 0 &&
          window.innerHeight + window.scrollY >=
            document.documentElement.scrollHeight - 2
        if (atEnd) setActive(els.length - 1)
      })
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    read()
    return () => {
      io.disconnect()
      window.removeEventListener("scroll", onScroll)
      cancelAnimationFrame(raf)
    }
  }, [ids])

  const go = (
    e: React.MouseEvent<HTMLAnchorElement>,
    i: number,
    id: string
  ) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return
    const el = document.getElementById(id)
    if (!el) return
    e.preventDefault()
    const top =
      i === 0
        ? 0
        : el.getBoundingClientRect().top +
          window.scrollY -
          window.innerHeight * 0.12
    window.scrollTo({
      top: Math.max(0, top),
      behavior: reduced ? "auto" : "smooth",
    })
    setActive(i)
    history.replaceState(null, "", `#${id}`)
  }

  const list = (strip: boolean) =>
    items.map((it, i) => (
      <a
        key={it.id}
        href={`#${it.id}`}
        onClick={(e) => go(e, i, it.id)}
        aria-current={active === i ? "location" : undefined}
        data-on={active === i || undefined}
        className={cn(
          "rail-item hit shrink-0",
          strip ? "flex min-h-11 items-center whitespace-nowrap" : "py-[3px]"
        )}
        style={{ "--hw": "44px" } as React.CSSProperties}
      >
        {it.label}
      </a>
    ))

  return (
    <>
      {/* desktop: the fixed rail */}
      <nav
        aria-label={label}
        data-site-rail
        className={cn(
          "fixed top-[var(--rail-top)] left-[var(--rail-left)] z-[11] hidden w-[var(--rail-width)] flex-col items-start gap-[5px] text-ui leading-[var(--leading-ui)] tracking-[var(--tracking-ui)] lg:flex",
          className
        )}
      >
        {back ? (
          <Link
            href={back.href}
            className="rail-item hit press mb-[9px]"
            style={{ "--hw": "44px" } as React.CSSProperties}
          >
            ↩ {back.label}
          </Link>
        ) : null}
        {list(false)}
        {children ? <div className="mt-[21px]">{children}</div> : null}
      </nav>

      {/* phone: one line under the header row, on the ground with a hairline
          under it (42), so the text scrolling up passes beneath it. A page
          whose column is padded can bleed it to the edges with
          `[&>nav[data-site-rail]]:-mx-[var(--page-pad-x)]` + matching px. */}
      <nav
        aria-label={label}
        data-site-rail
        className="sticky top-[var(--header-row)] z-[11] flex bg-ground shadow-[0_1px_0_var(--hairline)] [scrollbar-width:none] items-center gap-4 overflow-x-auto text-ui lg:hidden [&::-webkit-scrollbar]:hidden"
      >
        {back ? (
          <Link
            href={back.href}
            className="rail-item flex min-h-11 shrink-0 items-center"
          >
            ↩ {back.label}
          </Link>
        ) : null}
        {list(true)}
      </nav>
    </>
  )
}
