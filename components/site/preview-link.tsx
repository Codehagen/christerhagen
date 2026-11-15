"use client"

import * as React from "react"
import { createPortal } from "react-dom"

import { cn } from "@/lib/utils"

const noop = () => () => {}

export type PreviewCard = {
  /** Name, at 560. */
  name: string
  /** Status beside the name, muted ("Active", "Acquired"). */
  status?: string
  /** One line saying what it is, muted. */
  line: string
  /** Role · years, faint and tabular. */
  meta?: string
}

/**
 * 07's preview link: a company named in prose is a button that opens a small
 * card under its paragraph, lined up with the word. A mouse opens it on
 * pointer-enter and closes it on leave; the keyboard opens it on focus and
 * closes it on blur or Esc; a tap toggles it, and a press anywhere else or
 * Esc closes it (iOS never focuses a tapped button, so blur can't be relied
 * on). The open word's underline turns `--pen`. The card is a `--surface`
 * with the surface shadow.
 *
 * The card is placed under the nearest block (`p`, `li`, or the element with
 * `data-preview-anchor`), kept inside that block's width, and flipped above
 * the block when it would run past the bottom of the viewport. It is the
 * trigger's description (`aria-describedby`), not a live region.
 */
export function PreviewLink({
  card,
  children,
  className,
}: {
  card: PreviewCard
  children: React.ReactNode
  className?: string
}) {
  const btn = React.useRef<HTMLButtonElement>(null)
  const cardRef = React.useRef<HTMLDivElement>(null)
  // The pointer that started the current press: a touch or pen press must
  // not open the card on focus and then shut it again on click.
  const pressing = React.useRef<string | null>(null)
  const [open, setOpen] = React.useState(false)
  const [pos, setPos] = React.useState<{
    x: number
    y: number
    above: boolean
  } | null>(null)
  const mounted = React.useSyncExternalStore(
    noop,
    () => true,
    () => false
  )
  const id = React.useId()

  React.useLayoutEffect(() => {
    if (!open) return
    const place = () => {
      const b = btn.current
      if (!b) return
      const block =
        b.closest("[data-preview-anchor]") ??
        b.closest("p, li") ??
        b.parentElement
      if (!block) return
      const r = b.getClientRects()[0] ?? b.getBoundingClientRect()
      const o = block.getBoundingClientRect()
      const w = cardRef.current?.offsetWidth ?? 210
      const h = cardRef.current?.offsetHeight ?? 64
      const x = Math.min(
        Math.max(r.left, o.left),
        Math.max(o.left, o.right - w)
      )
      // Flip above the block when there is no room under it but there is
      // above it.
      const above =
        o.bottom + 12 + h > window.innerHeight && o.top - 12 - h >= 0
      const y = above ? o.top - 12 - h : o.bottom + 12
      setPos({ x: x + window.scrollX, y: y + window.scrollY, above })
    }
    place()
    window.addEventListener("resize", place)
    return () => window.removeEventListener("resize", place)
  }, [open])

  React.useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false)
    }
    const onDown = (e: PointerEvent) => {
      if (!btn.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("keydown", onKey)
    document.addEventListener("pointerdown", onDown)
    return () => {
      document.removeEventListener("keydown", onKey)
      document.removeEventListener("pointerdown", onDown)
    }
  }, [open])

  const shown = open && pos !== null
  const rise = pos?.above ? "0 -4px" : "0 4px"

  return (
    <>
      <button
        ref={btn}
        type="button"
        onPointerEnter={(e) => e.pointerType === "mouse" && setOpen(true)}
        onPointerLeave={(e) => e.pointerType === "mouse" && setOpen(false)}
        onPointerDown={(e) => {
          pressing.current = e.pointerType
        }}
        onPointerCancel={() => {
          pressing.current = null
        }}
        onFocus={() => {
          // A tap focuses the button on Android (never on iOS): leave the
          // opening to the click so both behave the same.
          if (pressing.current && pressing.current !== "mouse") return
          setOpen(true)
        }}
        onBlur={() => setOpen(false)}
        onClick={() => {
          const by = pressing.current
          pressing.current = null
          // A mouse has already opened it on hover; a tap (or Enter/Space on
          // a focused word) toggles it.
          if (by === "mouse") setOpen(true)
          else setOpen((o) => !o)
        }}
        aria-expanded={open}
        aria-describedby={mounted ? id : undefined}
        data-open={open || undefined}
        className={cn(
          "ink-link inline cursor-pointer border-0 bg-transparent p-0 text-left text-inherit [font:inherit]",
          className
        )}
      >
        {children}
      </button>
      {mounted
        ? createPortal(
            <div
              ref={cardRef}
              id={id}
              className="preview-card pointer-events-none absolute top-0 left-0 z-(--z-raised) w-[210px] rounded-[8px] bg-surface px-3 pt-[9px] pb-[10px] text-small leading-[1.38] text-ink"
              style={{
                transform: `translate(${pos?.x ?? 0}px, ${pos?.y ?? 0}px)`,
                boxShadow: "var(--card-shadow)",
                opacity: shown ? 1 : 0,
                translate: shown ? "0 0" : rise,
                visibility: open ? "visible" : "hidden",
              }}
            >
              <CardBody card={card} />
            </div>,
            document.body
          )
        : null}
    </>
  )
}

/** Name + status, the line, role · years. Shared with the ledger's margin card. */
export function CardBody({
  card,
  dot = false,
}: {
  card: PreviewCard
  /** 55's margin card: a 6px pen dot before the status. */
  dot?: boolean
}) {
  return (
    <>
      <span className="flex items-baseline justify-between gap-2.5">
        <span className="font-[560]">{card.name}</span>
        {card.status ? (
          <span className="flex items-center gap-1.5 whitespace-nowrap text-ink-muted">
            {dot ? (
              <span
                aria-hidden
                className="block size-[6px] rounded-full"
                style={{ background: "var(--pen)" }}
              />
            ) : null}
            {card.status}
          </span>
        ) : null}
      </span>
      <span className="mt-[3px] block text-pretty text-ink-muted">
        {card.line}
      </span>
      {card.meta ? (
        <span className="mt-[2px] block text-ink-faint tabular-nums">
          {card.meta}
        </span>
      ) : null}
    </>
  )
}
