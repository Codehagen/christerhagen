"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * benji's demo wall, **only behind a product shot** (DESIGN.md §4 Stage):
 * `--ground` with 1px `--wall-line` lines in a 48px cell. The shot (children)
 * goes in a `<StageSheet>`, which arrives slightly off the grid and settles
 * onto the lines the first time it is seen (520ms `--ease-settle`; in place
 * already under reduced motion). One Stage per page at most.
 *
 * - `inline` (44): inside the column, ≈336px tall, inset hairline frame,
 *   caption below in 12px muted.
 * - `full` (53): page-wide, ≈384px tall, hairlines top and bottom only;
 *   `captionClassName` lines the caption up with the column.
 *
 *   <Stage variant="inline" label="A sales prospectus, quality-checked" caption="…">
 *     <StageSheet width={240} height={240} at={{ x: 144, y: 48 }}>…</StageSheet>
 *   </Stage>
 */

const CELL = 48

const SettleContext = React.createContext(false)

export function Stage({
  variant = "inline",
  label,
  caption,
  height,
  className,
  captionClassName,
  children,
}: {
  variant?: "inline" | "full"
  /** The shot's accessible description (the wall is role="img"). */
  label: string
  caption?: React.ReactNode
  /** Wall height in px (default 336 inline, 384 full). */
  height?: number
  className?: string
  captionClassName?: string
  children: React.ReactNode
}) {
  const ref = React.useRef<HTMLDivElement>(null)
  const [seen, setSeen] = React.useState(false)

  React.useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) {
          setSeen(true)
          io.disconnect()
        }
      },
      { threshold: 0.4 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const full = variant === "full"
  return (
    <figure className={cn(full ? "my-10" : "mt-4", className)}>
      <div
        ref={ref}
        role="img"
        aria-label={label}
        className={cn(
          "relative overflow-hidden bg-ground",
          full ? "w-full" : "w-full"
        )}
        style={{
          height: height ?? (full ? 384 : 336),
          backgroundImage:
            "linear-gradient(var(--wall-line) 1px, transparent 1px), linear-gradient(90deg, var(--wall-line) 1px, transparent 1px)",
          backgroundSize: `${CELL}px ${CELL}px`,
          backgroundPosition: "-1px -1px",
          boxShadow: full
            ? "inset 0 1px 0 var(--hairline), inset 0 -1px 0 var(--hairline)"
            : "inset 0 0 0 1px var(--hairline)",
        }}
      >
        <SettleContext.Provider value={seen}>{children}</SettleContext.Provider>
      </div>
      {caption ? (
        <figcaption
          className={cn(
            "mt-2 text-small",
            full ? "text-ink-faint" : "text-ink-muted",
            captionClassName
          )}
        >
          {caption}
        </figcaption>
      ) : null}
    </figure>
  )
}

/**
 * The product shot: a `--surface` sheet (radius 5px, surface shadow) placed
 * at `at` (px, ideally on the 48px lines), arriving from `from` (default: a
 * little off, 0.4 of a cell right and down). Any accent inside it uses
 * `var(--pen)`. Decorative (aria-hidden); the Stage carries the label.
 */
export function StageSheet({
  at,
  from,
  width,
  height,
  className,
  children,
}: {
  at: { x: number; y: number }
  from?: { x: number; y: number }
  width: number
  height: number
  className?: string
  children: React.ReactNode
}) {
  const seen = React.useContext(SettleContext)
  const start = from ?? { x: at.x + CELL * 0.4, y: at.y + CELL * 0.33 }
  const p = seen ? at : start
  return (
    <div
      aria-hidden
      className={cn(
        "stage-sheet absolute top-0 left-0 flex flex-col rounded-[5px] bg-surface p-3",
        className
      )}
      style={{
        width,
        height,
        translate: `${p.x}px ${p.y}px`,
        boxShadow: "var(--surface-shadow)",
      }}
    >
      {children}
    </div>
  )
}
