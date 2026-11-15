import { companies, type CompanySlug, type Lang } from "@/lib/companies"
import { homeContent } from "@/lib/content"

/**
 * What a colourless preview link (07, DESIGN.md §4 Link) says about the thing
 * it names. Every word comes from lib/companies.ts and lib/content.ts; this
 * file only arranges them into a card (name, status, one line, role · years).
 */

export type PreviewKey = CompanySlug | "nav" | "github"

export type Card = {
  name: string
  status?: string
  line: string
  meta?: string
}

/** End years the site states (lib/content work periods, lib/companies body). */
const ENDED: Partial<Record<CompanySlug, string>> = {
  refenze: "2018",
  sailsdock: "2026",
  docdir: "2026",
}

/** Lower-case a leading capital, but not an acronym ("UI components"). */
function lowerFirst(s: string) {
  return /^[A-Z][a-z]/.test(s) ? s.charAt(0).toLowerCase() + s.slice(1) : s
}

export function cardOf(k: PreviewKey, lang: Lang): Card {
  const h = homeContent[lang]
  if (k === "nav") {
    const w = h.work.find((x) => x.name === "Not Another VC")!
    const [role, what] = w.role.split(" · ")
    return {
      name: w.name,
      line: `${what}.`,
      meta: `${role} · ${w.period.toLowerCase()}`,
    }
  }
  if (k === "github") {
    return {
      name: "github.com/Codehagen",
      line:
        h.oss
          .map((o) => `${o.name}, ${lowerFirst(o.desc)} (${o.stars} ★)`)
          .join(". ") + ".",
      meta: h.lblOss,
    }
  }
  const c = companies[lang][k]
  const end = ENDED[k]
  const since = lang === "en" ? "since" : "siden"
  return {
    name: c.name,
    status: c.status,
    line: c.tagline,
    meta: `${c.role} · ${end ? `${c.year}–${end}` : `${since} ${c.year}`}`,
  }
}

export type Part = string | { k: PreviewKey; t: string }

/**
 * Cuts `text` at the first appearance of each needle, so the named things can
 * become preview links. The words stay the site's own.
 */
export function cut(text: string, links: [string, PreviewKey][]): Part[] {
  let parts: Part[] = [text]
  for (const [needle, k] of links) {
    let done = false
    parts = parts.flatMap((p) => {
      if (done || typeof p !== "string") return [p]
      const i = p.indexOf(needle)
      if (i < 0) return [p]
      done = true
      return [
        p.slice(0, i),
        { k, t: needle },
        p.slice(i + needle.length),
      ].filter((x) => x !== "")
    })
  }
  return parts
}
