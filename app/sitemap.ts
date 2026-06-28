import type { MetadataRoute } from "next"
import { companyOrder } from "@/lib/companies"
import { postOrder } from "@/lib/posts"

const baseUrl = "https://christerhagen.com"
const lastModified = "2026-06-28"

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/portfolio`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/writing`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/process`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.5,
    },
  ]

  const portfolioRoutes: MetadataRoute.Sitemap = companyOrder.map((slug) => ({
    url: `${baseUrl}/portfolio/${slug}`,
    lastModified,
    changeFrequency: "monthly",
    priority: 0.7,
  }))

  const writingRoutes: MetadataRoute.Sitemap = postOrder.map((slug) => ({
    url: `${baseUrl}/writing/${slug}`,
    lastModified,
    changeFrequency: "monthly",
    priority: 0.6,
  }))

  return [...staticRoutes, ...portfolioRoutes, ...writingRoutes]
}
