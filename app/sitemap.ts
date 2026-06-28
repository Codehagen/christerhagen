import type { MetadataRoute } from "next"
import { companyOrder } from "@/lib/companies"
import { posts, postOrder } from "@/lib/posts"
import { siteUrl, localizedPath } from "@/lib/seo"

// Build date for the static pages that have no intrinsic "modified" date.
// Per-post routes carry their own publish date below.
const siteUpdated = "2026-06-28"

type ChangeFrequency = MetadataRoute.Sitemap[number]["changeFrequency"]

interface RouteDef {
  path: string
  changeFrequency: ChangeFrequency
  priority: number
  lastModified: string
}

export default function sitemap(): MetadataRoute.Sitemap {
  const routes: RouteDef[] = [
    { path: "/", changeFrequency: "monthly", priority: 1, lastModified: siteUpdated },
    { path: "/about", changeFrequency: "monthly", priority: 0.8, lastModified: siteUpdated },
    { path: "/portfolio", changeFrequency: "monthly", priority: 0.9, lastModified: siteUpdated },
    { path: "/writing", changeFrequency: "weekly", priority: 0.8, lastModified: siteUpdated },
    { path: "/process", changeFrequency: "monthly", priority: 0.6, lastModified: siteUpdated },
    { path: "/contact", changeFrequency: "yearly", priority: 0.5, lastModified: siteUpdated },
    { path: "/brand", changeFrequency: "yearly", priority: 0.4, lastModified: siteUpdated },
    ...companyOrder.map(
      (slug): RouteDef => ({
        path: "/portfolio/" + slug,
        changeFrequency: "monthly",
        priority: 0.7,
        lastModified: siteUpdated,
      })
    ),
    ...postOrder.map(
      (slug): RouteDef => ({
        path: "/writing/" + slug,
        changeFrequency: "monthly",
        priority: 0.6,
        // Each essay's own publish date — a truthful per-URL freshness signal.
        lastModified: posts.en[slug].dateISO,
      })
    ),
  ]

  const entries: MetadataRoute.Sitemap = []

  for (const { path, changeFrequency, priority, lastModified } of routes) {
    const languages = {
      en: siteUrl(path),
      "nb-NO": siteUrl(localizedPath(path, "no")),
    }

    // EN entry (root URL)
    entries.push({
      url: siteUrl(path),
      lastModified,
      changeFrequency,
      priority,
      alternates: { languages },
    })

    // NO entry (/no mirror)
    entries.push({
      url: siteUrl(localizedPath(path, "no")),
      lastModified,
      changeFrequency,
      priority,
      alternates: { languages },
    })
  }

  return entries
}
