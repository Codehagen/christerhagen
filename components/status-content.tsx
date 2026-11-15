import { cn } from "@/lib/utils"

/**
 * The 404 and error screens: the same plain column as the secondary pages
 * (wide, no rail). A muted kicker (`404`, `Error`), the h1, one muted line,
 * then whatever the screen offers next.
 */
export function StatusContent({
  kicker,
  head,
  body,
  children,
  className,
}: {
  kicker: string
  head: string
  body: string
  children?: React.ReactNode
  className?: string
}) {
  return (
    <main
      id="main"
      className={cn(
        "px-[var(--page-pad-x)] pt-4 lg:ml-[var(--column-wide-left)] lg:w-[var(--column-wide)] lg:px-0 lg:pt-[46px]",
        className
      )}
    >
      <p className="text-ink-muted tabular-nums">{kicker}</p>
      <h1 className="mt-[6px] text-title leading-[var(--leading-title)] font-[var(--weight-strong)] tracking-[var(--tracking-title)]">
        {head}
      </h1>
      <p className="mt-[10px] max-w-[var(--column)] text-ink-muted">{body}</p>
      {children}
    </main>
  )
}
