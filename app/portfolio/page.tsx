import type { Metadata } from "next"

import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { PortfolioContent } from "@/components/portfolio-content"
import { pageMetadata } from "@/lib/seo"

export const metadata: Metadata = pageMetadata({
  path: "/portfolio",
  lang: "en",
  title: "Portfolio",
  description:
    "Companies I've built, backed and sold. Mostly software, mostly Norwegian, mostly pre-seed.",
})

export default function PortfolioPage() {
  return (
    <div lang="en" className="flex min-h-svh flex-col bg-background text-foreground">
      <SiteHeader active="portfolio" lang="en" />
      <PortfolioContent lang="en" />
      <SiteFooter lang="en" />
    </div>
  )
}
