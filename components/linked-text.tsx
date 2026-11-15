import type { Lang } from "@/lib/companies"
import { cardOf, cut, type PreviewKey } from "@/lib/previews"
import { cn } from "@/lib/utils"

import { PreviewLink } from "@/components/site/link"

/**
 * A paragraph whose named things are 07's colourless preview links (DESIGN.md
 * §4 Link): each needle, at its first appearance, opens a card under the
 * paragraph saying what it is.
 */
export function LinkedText({
  text,
  links,
  lang,
  className,
}: {
  text: string
  links: [string, PreviewKey][]
  lang: Lang
  className?: string
}) {
  return (
    <p className={cn("relative", className)}>
      {cut(text, links).map((p, i) =>
        typeof p === "string" ? (
          p
        ) : (
          <PreviewLink key={i} card={cardOf(p.k, lang)}>
            {p.t}
          </PreviewLink>
        )
      )}
    </p>
  )
}
