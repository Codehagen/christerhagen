import type { MetadataRoute } from "next"
import { companyOrder } from "@/lib/companies"
import { postOrder } from "@/lib/posts"
import { siteUrl, localizedPath } from "@/lib/seo"

const lastModified = "2026-06-28"

type ChangeFrequency = MetadataRoute.Sitemap[number]["changeFrequency"]

interface RouteDef {
  path: string
  changeFrequency: ChangeFrequency
  priority: number
}

export default function sitemap(): MetadataRoute.Sitemap {
  const routes: RouteDef[] = [
    { path: "/", changeFrequency: "monthly", priority: 1 },
    { path: "/about", changeFrequency: "monthly", priority: 0.8 },
    { path: "/portfolio", changeFrequency: "monthly", priority: 0.9 },
    { path: "/writing", changeFrequency: "weekly", priority: 0.8 },
    { path: "/process", changeFrequency: "monthly", priority: 0.6 },
    { path: "/contact", changeFrequency: "yearly", priority: 0.5 },
    { path: "/brand", changeFrequency: "yearly", priority: 0.4 },
    ...companyOrder.map(
      (slug): RouteDef => ({
        path: "/portfolio/" + slug,
        changeFrequency: "monthly",
        priority: 0.7,
      })
    ),
    ...postOrder.map(
      (slug): RouteDef => ({
        path: "/writing/" + slug,
        changeFrequency: "monthly",
        priority: 0.6,
      })
    ),
  ]

  const entries: MetadataRoute.Sitemap = []

  for (const { path, changeFrequency, priority } of routes) {
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
