import { Link } from "next-view-transitions"

import { cn } from "@/lib/utils"

export { PreviewLink, CardBody, type PreviewCard } from "./preview-link"

/**
 * Links have no colour (DESIGN.md §4 Link): ink text with a 1px underline in
 * `--underline`, offset 0.24em, turning ink on hover.
 *
 * - `variant="default"`: in prose and lists.
 * - `variant="back"`: `↩ Portfolio`, no underline at rest.
 * - `variant="quiet"`: footer-style, underline in `--ink-faint` at 0.22em.
 *
 * External hrefs (http…, mailto:) are plain anchors; http ones open in a new
 * tab and end in `↗`. Internal hrefs go through next-view-transitions.
 * For a company named in prose that opens a card, use `PreviewLink`.
 */
export function TextLink({
  href,
  children,
  variant = "default",
  arrow,
  className,
  ...rest
}: {
  href: string
  children: React.ReactNode
  variant?: "default" | "back" | "quiet"
  /** Override the trailing ↗ on external links. */
  arrow?: boolean
  className?: string
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "children">) {
  const external = /^https?:\/\//.test(href)
  const plain = external || /^(mailto|tel):/.test(href)
  const cls = cn("ink-link", className)
  const showArrow = arrow ?? external

  if (plain) {
    return (
      <a
        href={href}
        className={cls}
        data-variant={variant}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        {...rest}
      >
        {children}
        {showArrow ? (
          <>
            <span aria-hidden>{" "}↗</span>
            <span className="sr-only"> (opens in a new tab)</span>
          </>
        ) : null}
      </a>
    )
  }
  return (
    <Link href={href} className={cls} data-variant={variant} {...rest}>
      {children}
    </Link>
  )
}
