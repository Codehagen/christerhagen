import type { MetadataRoute } from "next"
import { companyOrder } from "@/lib/companies"
import { postOrder } from "@/lib/posts"
import { siteUrl } from "@/lib/seo"

const lastModified = "2026-06-28"

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: siteUrl("/"),
      lastModified,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: siteUrl("/about"),
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: siteUrl("/portfolio"),
      lastModified,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: siteUrl("/writing"),
      lastModified,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: siteUrl("/process"),
      lastModified,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: siteUrl("/brand"),
      lastModified,
      changeFrequency: "yearly",
      priority: 0.4,
    },
    {
      url: siteUrl("/contact"),
      lastModified,
      changeFrequency: "yearly",
      priority: 0.5,
    },
  ]

  const portfolioRoutes: MetadataRoute.Sitemap = companyOrder.map((slug) => ({
    url: siteUrl("/portfolio/" + slug),
    lastModified,
    changeFrequency: "monthly",
    priority: 0.7,
  }))

  const writingRoutes: MetadataRoute.Sitemap = postOrder.map((slug) => ({
    url: siteUrl("/writing/" + slug),
    lastModified,
    changeFrequency: "monthly",
    priority: 0.6,
  }))

  return [...staticRoutes, ...portfolioRoutes, ...writingRoutes]
}
