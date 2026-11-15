import { Link } from "next-view-transitions"

import { cn } from "@/lib/utils"

/**
 * 19's read next (DESIGN.md §4 ReadNext): after the last paragraph, 40px of
 * space, a hairline, a grey label, then **one** title and one `→`, then a
 * faint meta line. Only the arrow moves, and only the arrow takes the pen.
 * `inked`: the arrow already wears the pen (45's last mark, 600ms later).
 * Company pages pass the next company as `title` and its tagline as `meta`.
 *
 * Carries `data-end`, so a page can tell when the reader has reached it.
 */
export function ReadNext({
  label,
  href,
  title,
  meta,
  inked = false,
  className,
}: {
  label: string
  href: string
  title: React.ReactNode
  meta?: React.ReactNode
  inked?: boolean
  className?: string
}) {
  return (
    <nav
      aria-label={label}
      data-end
      data-inked={inked || undefined}
      className={cn(
        "read-next mt-10 border-t border-hairline pt-[14px]",
        className
      )}
    >
      <p className="text-[0.82em] text-ink-faint">{label}</p>
      <Link href={href} className="read-next-link flex min-h-11 items-center">
        <span className="text-lead leading-[1.25] font-[560] tracking-[-0.012em] text-balance">
          <span className="read-next-title">{title}</span>{" "}
          <span aria-hidden className="read-next-arrow">
            →
          </span>
        </span>
      </Link>
      {meta ? (
        <p className="text-[0.82em] text-ink-faint tabular-nums">{meta}</p>
      ) : null}
    </nav>
  )
}
