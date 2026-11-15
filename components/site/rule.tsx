import { cn } from "@/lib/utils"

/**
 * benji's section heading (DESIGN.md §4 Rule): a grey label with a hairline
 * running right, 40px above and 9px below. An optional count sits at the
 * right in `--ink-faint`. Never an uppercase eyebrow or a bold h2.
 *
 *   <Rule>2026</Rule>
 *   <Rule count="3 posts">Writing</Rule>
 *   <Rule top={22}>Before</Rule>
 */
export function Rule({
  children,
  count,
  as: Tag = "h2",
  top,
  id,
  className,
}: {
  children: React.ReactNode
  count?: React.ReactNode
  as?: "h2" | "h3" | "div"
  /** Space above in px (default 40). */
  top?: number
  id?: string
  className?: string
}) {
  return (
    <Tag
      id={id}
      className={cn(
        "mt-[var(--rule-top)] mb-[var(--rule-bottom)] flex items-center gap-[var(--rule-gap)] text-body font-[460] text-ink-muted",
        className
      )}
      style={top !== undefined ? { marginTop: top } : undefined}
    >
      <span className="shrink-0">{children}</span>
      <span aria-hidden className="h-px flex-1 bg-hairline" />
      {count ? (
        <span className="shrink-0 text-ink-faint tabular-nums">{count}</span>
      ) : null}
    </Tag>
  )
}
