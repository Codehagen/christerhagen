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
 * card under its paragraph, lined up with the word, on pointer-enter, focus
 * or tap. Esc, blur or pointer-leave closes it. The open word's underline
 * turns `--pen`. The card is a `--surface` with the surface shadow.
 *
 * The card is placed under the nearest block (`p`, `li`, or the element with
 * `data-preview-anchor`), and kept inside that block's width.
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
  const [open, setOpen] = React.useState(false)
  const [pos, setPos] = React.useState<{ x: number; y: number } | null>(null)
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
      const x = Math.min(
        Math.max(r.left, o.left),
        Math.max(o.left, o.right - w)
      )
      setPos({ x: x + window.scrollX, y: o.bottom + 12 + window.scrollY })
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
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [open])

  const shown = open && pos !== null

  return (
    <>
      <button
        ref={btn}
        type="button"
        onPointerEnter={(e) => e.pointerType === "mouse" && setOpen(true)}
        onPointerLeave={(e) => e.pointerType === "mouse" && setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onClick={() => setOpen(true)}
        aria-expanded={open}
        aria-controls={id}
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
              role="status"
              aria-live="polite"
              className="preview-card pointer-events-none absolute z-30 w-[210px] rounded-[8px] bg-surface px-3 pt-[9px] pb-[10px] text-small leading-[1.38] text-ink"
              style={{
                left: pos?.x ?? 0,
                top: pos?.y ?? 0,
                boxShadow: "var(--card-shadow)",
                opacity: shown ? 1 : 0,
                translate: shown ? "0 0" : "0 4px",
                visibility: open ? "visible" : "hidden",
              }}
            >
              {open ? <CardBody card={card} /> : null}
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
